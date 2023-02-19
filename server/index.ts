import Env from "./src/Env";
import Logger from "./src/Logger";

import express, { Router } from "express";
import cors from "cors";
import compression from "compression";

import { auth, requiresAuth } from "express-openid-connect";
import UrlService from "./src/UrlService";
import { TAuth0User } from "./src/types/TAuth0User";
import path from "path";
import OpenGraphService from "./src/OpenGraphService";

Logger.setGlobalLogLevel(Env.logLevel);
Logger.verbose("Configuration loaded:");
Logger.plain.verbose("", Env);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(compression());
app.use(auth(Env.authConfig));

app.get(`${Env.apiPrefix}/user`, requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});

app.post(`${Env.apiPrefix}/url`, async (req, res) => {
  await UrlService.insertOrUpdateUrl(req, res);
});
app.get(`${Env.apiPrefix}/url/:id`, async (req, res) => {
  const result = await UrlService.getOGUrl(req.params.id);
  if (result) res.json(result);
  else res.sendStatus(404);
});
app.get(`${Env.apiPrefix}/url`, requiresAuth(), async (req, res) => {
  const { s, t } = req.query as { s?: string; t?: string };
  const skip = s !== undefined ? parseInt(s) : NaN;
  const take = t !== undefined ? parseInt(t) : NaN;
  const user = req.oidc.user as TAuth0User;

  res.json(await UrlService.getAllShortUrls(user, skip, take));
});
app.delete(`${Env.apiPrefix}/url/:id`, requiresAuth(), async (req, res) => {
  const user = req.oidc.user as TAuth0User;
  try {
    await UrlService.deleteUrl(req.params.id, user.email);
    res.sendStatus(204);
  } catch (err) {
    res.status(403).send((err as Error).message);
  }
});
app.get(`${Env.apiPrefix}/og`, async (req, res) => {
  const { url } = req.query as { url: string };
  const ogMeta = await OpenGraphService.getInstance().getOgMetadata(
    decodeURIComponent(url)
  );

  if (ogMeta) res.json(ogMeta);
  else res.sendStatus(400);
});
app.get(`/s/:id`, (_req, res) => {
  // TODO: implement redirect html page generator
  // TODO: increment view count
  res.contentType("html").send("<html><body>Placeholder</body></html>");
});

// serve SPA webpage
const spaRouter = Router();
spaRouter.use(express.static("dist"));
spaRouter.get("*", (_, res) =>
  res.sendFile(path.resolve(__dirname, "dist/index.html"))
);
app.use(spaRouter);

(async () => {
  app.listen(Env.port, () => {
    Logger.info(`Express server started on port: ${Env.port}`);
  });
})();
