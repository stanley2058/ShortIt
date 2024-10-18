import Env from "./src/Env";
import Logger from "./src/Logger";

import express from "express";
import cors from "cors";
import compression from "compression";

import { auth } from "express-openid-connect";
import path from "path";
import Router from "./src/Router";

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
app.use(express.static("dist"));

app.use(auth(Env.authConfig));
app.use(new Router().route());

// serve SPA webpage
app.get("*", (_, res) =>
  res.sendFile(path.resolve(import.meta.dirname, "dist/index.html"))
);

(async () => {
  app.listen(Env.port, () => {
    Logger.info(`Express server started on port: ${Env.port}`);
  });
})();
