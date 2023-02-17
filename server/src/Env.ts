import * as dotenv from "dotenv";
import Logger from "./Logger";
import { DefaultConfig, EnvMap } from "./types/Config";

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
}

export default new Configuration();
