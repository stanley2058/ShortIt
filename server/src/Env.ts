import * as dotenv from "dotenv";
import Logger from "./Logger";
import { DefaultConfig, EnvMap } from "./types/Config";
import type { ConfigParams } from "express-openid-connect";

class Configuration extends DefaultConfig {
  constructor() {
    dotenv.config();
    super();

    for (const [k, v] of Object.entries(EnvMap)) {
      const env = process.env[k];
      if (env === undefined) continue;
      if (v === "logLevel") this[v] = Logger.toLogLevel(env);
      else this[v] = env;
    }
  }

  get authConfig(): ConfigParams {
    return {
      authRequired: false,
      auth0Logout: true,
      baseURL: this.baseUrl,
      clientID: this.auth0ClientId,
      issuerBaseURL: this.auth0Uri,
      secret: this.secret,
      routes: {
        login: false,
        logout: false,
        callback: "/api/callback",
      },
    };
  }

  get apiPrefix(): string {
    return `/api/${this.apiVersion}`;
  }
}

export default new Configuration();
