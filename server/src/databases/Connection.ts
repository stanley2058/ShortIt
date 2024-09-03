import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import Env from "../Env";
import Logger from "../Logger";
import { createPrismaRedisCache } from "prisma-redis-middleware";

export default class Connection {
  private redis?: Redis;
  private prisma?: PrismaClient;

  getRedis(): Redis {
    if (!this.redis) this.redis = this.connRedis();
    return this.redis;
  }

  getPrisma(): PrismaClient {
    if (!this.prisma) this.prisma = this.connPrisma();
    return this.prisma;
  }

  private connRedis(): Redis {
    try {
      const redis = new Redis(Env.redisUri);
      Logger.verbose("connected to redis");
      return redis;
    } catch (err) {
      Logger.verbose("", err);
      Logger.fatal("cannot establish database connection");
    }
    throw new Error("unreachable");
  }

  private connPrisma(): PrismaClient {
    try {
      const prisma = new PrismaClient();
      Logger.verbose("connected to postgres");
      return prisma.$extends(this.getPrismaCache() as any) as PrismaClient;
    } catch (err) {
      Logger.verbose("", err);
      Logger.fatal("cannot establish database connection");
    }
    throw new Error("unreachable");
  }

  private getPrismaCache() {
    return createPrismaRedisCache({
      models: [{ model: "ShortUrl", excludeMethods: ["findMany"] }],
      storage: {
        type: "redis",
        options: {
          client: this.redis as any,
          invalidation: { referencesTTL: 300 },
          log: undefined,
        },
      },
      cacheTime: 300,
    });
  }
}
