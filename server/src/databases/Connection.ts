import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import Env from "../Env";
import Logger from "../Logger";

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
      if (process.env.NODE_ENV === "test") return prisma;
      // this cache layer breaks jest so we have to skip it in test
      import("./PrismaCache").then(({ registerPrismaCache }) => {
        if (!this.redis) {
          Logger.warn("cannot setup prisma cache without redis connection");
          return;
        }
        this.prisma = registerPrismaCache(prisma, this.redis);
        Logger.verbose("prisma extended with redis cache");
      });
      return prisma;
    } catch (err) {
      Logger.verbose("", err);
      Logger.fatal("cannot establish database connection");
    }
    throw new Error("unreachable");
  }
}
