import {
  NextFunction,
  Request,
  Response,
  Router as ExpressRouter,
} from "express";
import { requiresAuth } from "express-openid-connect";
import Database from "./databases/Database";
import Env from "./Env";
import Logger from "./Logger";
import OpenGraphService from "./OpenGraphService";
import PageGenerator from "./PageGenerator";
import { TAuth0User } from "./types/TAuth0User";
import { TReqOpenGraphUrl } from "./types/TOpenGraphUrl";
import { fromShortUrl } from "./types/TShortUrl";
import UrlService from "./UrlService";

type Handler =
  | ((req: Request, res: Response) => Promise<void>)
  | ((req: Request, res: Response, next: NextFunction) => Promise<void>);
type RequestMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "head"
  | "options"
  | "connect"
  | "trace";
type RouteMapping = {
  path: string;
  method: RequestMethod;
  handler: Handler;
  requireAuth?: boolean;
  noPrefix?: boolean;
};

export default class Router {
  private static readonly mapping: RouteMapping[] = [
    {
      path: "/user",
      method: "get",
      requireAuth: true,
      handler: Router.handleUser,
    },
    {
      path: "/url",
      method: "post",
      handler: Router.handlePostUrl,
    },
    {
      path: "/url/count",
      method: "get",
      requireAuth: true,
      handler: Router.handleCount,
    },
    {
      path: "/url/:id",
      method: "get",
      handler: Router.handleGetUrl,
    },
    {
      path: "/url",
      method: "get",
      requireAuth: true,
      handler: Router.handleGetUrls,
    },
    {
      path: "/url/:id",
      method: "delete",
      requireAuth: true,
      handler: Router.handleDeleteUrl,
    },
    {
      path: "/og",
      method: "get",
      handler: Router.handleGetOpenGraph,
    },
    {
      path: "/login",
      method: "get",
      noPrefix: true,
      handler: Router.handleLogin,
    },
    {
      path: "/logout",
      method: "get",
      noPrefix: true,
      handler: Router.handleLogout,
    },
    {
      path: "/:id",
      method: "get",
      noPrefix: true,
      handler: Router.handleRedirect,
    },
  ];

  route() {
    return this.router;
  }

  private router: ExpressRouter;
  constructor() {
    this.router = ExpressRouter();
    this.setup();
  }

  private setup() {
    Logger.verbose("Registering routes:");
    Router.mapping.forEach((r) => {
      const path = `${r.noPrefix ? "" : Env.apiPrefix}${r.path}`;
      if (r.requireAuth) this.router[r.method](path, requiresAuth(), r.handler);
      else this.router[r.method](path, r.handler);

      Logger.plain.verbose(
        `${r.method.toUpperCase()}${r.requireAuth ? "(A)" : ""}\t${path}`
      );
    });
  }

  private static async handleUser(req: Request, res: Response): Promise<void> {
    res.json(req.oidc.user);
  }

  private static async handlePostUrl(
    req: Request,
    res: Response
  ): Promise<void> {
    const hasLogin = req.oidc.isAuthenticated();
    const user = hasLogin ? (req.oidc.user as TAuth0User) : undefined;
    const body: TReqOpenGraphUrl = req.body;
    if (body === undefined || !UrlService.verifyUrl(body.url)) {
      res.sendStatus(400);
      return;
    }

    const { result, status } = await UrlService.insertOrUpdateUrl(body, user);
    if (status) res.sendStatus(status);
    else res.json(result);
  }

  private static async handleCount(req: Request, res: Response): Promise<void> {
    const user = req.oidc.user as TAuth0User;
    res.json({
      count: await Database.getInstance().countByUser(user.email),
    });
  }

  private static async handleGetUrl(
    req: Request,
    res: Response
  ): Promise<void> {
    const result = await UrlService.getOGUrl(req.params.id);
    if (result) res.json(result);
    else res.sendStatus(404);
  }

  private static async handleGetUrls(
    req: Request,
    res: Response
  ): Promise<void> {
    const { s, t } = req.query as { s?: string; t?: string };
    const skip = s !== undefined ? parseInt(s) : NaN;
    const take = t !== undefined ? parseInt(t) : NaN;
    const user = req.oidc.user as TAuth0User;

    res.json(await UrlService.getAllShortUrls(user, skip, take));
  }

  private static async handleDeleteUrl(
    req: Request,
    res: Response
  ): Promise<void> {
    const user = req.oidc.user as TAuth0User;
    try {
      await UrlService.deleteUrl(req.params.id, user.email);
      res.sendStatus(204);
    } catch (err) {
      res.status(403).send((err as Error).message);
    }
  }

  private static async handleGetOpenGraph(
    req: Request,
    res: Response
  ): Promise<void> {
    const { url } = req.query as { url: string };
    const ogMeta = await OpenGraphService.getInstance().getOgMetadata(
      decodeURIComponent(url)
    );

    if (ogMeta) res.json(ogMeta);
    else res.sendStatus(400);
  }

  private static async handleLogin(_: Request, res: Response): Promise<void> {
    res.oidc.login({ returnTo: Env.loginReturnUrl });
  }

  private static async handleLogout(_: Request, res: Response): Promise<void> {
    res.oidc.logout({ returnTo: Env.logoutReturnUrl });
  }

  private static async handleRedirect(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.params.id) return next();
    const existing = await Database.getInstance().get(req.params.id);
    if (!existing) return next();
    const shortUrl = fromShortUrl(existing);

    shortUrl.views = (shortUrl.views || 0) + 1;
    Database.getInstance().updateOrInsert(shortUrl).catch(Logger.error);

    if (!existing.isOgCustom) res.redirect(existing.url);
    else res.contentType("html").send(PageGenerator.generate(shortUrl));
  }
}
