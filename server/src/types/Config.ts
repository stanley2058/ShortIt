import { LogLevels } from "../Logger";

type Config = {
  port: string;
  apiVersion: string;
  logLevel: LogLevels;
  redisUri: string;
  jwkUri: string;
};

class DefaultConfig implements Config {
  port = "3000";
  apiVersion = "v1";
  logLevel: LogLevels = "verbose";
  redisUri = "redis://localhost:6379";
  jwkUri = "";
}

const EnvMap = {
  PORT: "port" as const,
  API_VERSION: "apiVersion" as const,
  LOG_LEVEL: "logLevel" as const,
  REDIS_URI: "redisUri" as const,
  JWK_URI: "jwkUri" as const,
};

export { Config, DefaultConfig, EnvMap };
