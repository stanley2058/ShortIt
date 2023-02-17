import { Prisma, PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import { createPrismaRedisCache } from "prisma-redis-middleware";
// apply fixes from https://github.com/Asjas/prisma-redis-middleware/issues/230
import type TRedis from "prisma-redis-middleware/node_modules/ioredis/built";
import Env from "../Env";
import Logger from "../Logger";

export default class Database {
  private static instance?: Database;
  static getInstance = () => this.instance || (this.instance = new this());

  private redis;
  private prisma;

  private constructor() {
    try {
      this.redis = new Redis(Env.redisUri);
      Logger.verbose("connected to redis");
      this.prisma = new PrismaClient();
      Logger.verbose("connected to postgres");

      const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
        models: [{ model: "ShortUrl", excludeMethods: ["findMany"] }],
        storage: {
          type: "redis",
          options: {
            client: this.redis as unknown as TRedis,
            invalidation: { referencesTTL: 300 },
            log: undefined,
          },
        },
        cacheTime: 300,
      });

      this.prisma.$use(cacheMiddleware);
      Logger.verbose("prisma cache middleware attached");
    } catch (err) {
      Logger.verbose("", err);
      Logger.fatal("cannot establish database connection");
    }
  }
}
