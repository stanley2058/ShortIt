import { LogLevels } from "../Logger";

type Config = {
  port: string;
  apiVersion: string;
  logLevel: LogLevels;
  redisUri: string;
  postgresUri: string;
  postgresUsername: string;
  postgresPassword: string;
  auth0Token: string;
};

class DefaultConfig implements Config {
  port = "3000";
  apiVersion = "v1";
  logLevel: LogLevels = "verbose";
  redisUri = "redis://localhost:6379";
  postgresUri = "postgres://localhost:5432";
  postgresUsername = "shortit";
  postgresPassword = "shortit";
  auth0Token = "";
}

const EnvMap = {
  PORT: "port" as const,
  API_VERSION: "apiVersion" as const,
  LOG_LEVEL: "logLevel" as const,
  REDIS_URI: "redisUri" as const,
  POSTGRES_URI: "postgresUri" as const,
  POSTGRES_USERNAME: "postgresUsername" as const,
  POSTGRES_PASSWORD: "postgresPassword" as const,
  AUTH0_TOKEN: "auth0Token" as const,
};

export { Config, DefaultConfig, EnvMap };
