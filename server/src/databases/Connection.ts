import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import Env from "../Env";
import Logger from "../Logger";
import { PrismaExtensionRedis } from "prisma-extension-redis";

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
      Logger.fatal("cannot establish redis connection");
    }
    throw new Error("unreachable");
  }

  private connPrisma(): PrismaClient {
    try {
      const prisma = new PrismaClient();
      Logger.verbose("connected to postgres");
      return prisma.$extends(this.getPrismaCache()) as unknown as PrismaClient;
    } catch (err) {
      Logger.verbose("", err);
      Logger.fatal("cannot establish database connection");
    }
    throw new Error("unreachable");
  }

  private getPrismaCache() {
    if (!this.redis) {
      throw new Error("cannot create middle without redis client");
    }

    return PrismaExtensionRedis({
      auto: {
        models: [
          {
            model: "ShortUrl",
            excludedOperations: ["findMany"],
          },
        ],
      },
      cache: {
        storage: {
          type: "redis",
          options: {
            client: this.redis,
            invalidation: { referencesTTL: 300 }, // Invalidation settings
            log: undefined, // Logger for cache events
          },
        }, // Storage configuration for async-cache-dedupe
      },
      redis: this.redis,
    });
  }
}
