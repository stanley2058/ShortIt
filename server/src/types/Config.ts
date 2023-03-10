import { LogLevels } from "../Logger";

type Config = {
  port: string;
  apiVersion: string;
  baseUrl: string;
  logLevel: LogLevels;
  redisUri: string;
  auth0ClientId: string;
  auth0Uri: string;
  secret: string;
  loginReturnUrl: string;
  logoutReturnUrl: string;
};

class DefaultConfig implements Config {
  port = "3000";
  baseUrl = "http://localhost:3000";
  apiVersion = "v1";
  logLevel: LogLevels = "verbose";
  redisUri = "redis://localhost:6379";
  auth0ClientId = "";
  auth0Uri = "";
  secret = "";
  loginReturnUrl = "http://localhost:5173";
  logoutReturnUrl = "http://localhost:5173?s=logout";
}

const EnvMap = {
  PORT: "port" as const,
  BASE_URL: "baseUrl" as const,
  API_VERSION: "apiVersion" as const,
  LOG_LEVEL: "logLevel" as const,
  REDIS_URI: "redisUri" as const,
  AUTH0_CLIENT_ID: "auth0ClientId" as const,
  AUTH0_URI: "auth0Uri" as const,
  SECRET: "secret" as const,
  LOGIN_RETURN_URL: "loginReturnUrl" as const,
  LOGOUT_RETURN_URL: "logoutReturnUrl" as const,
};

export { Config, DefaultConfig, EnvMap };
