import { Prisma, PrismaClient, ShortUrl } from "@prisma/client";
import { TShortUrl } from "../types/TShortUrl";
import Redis from "ioredis";
import { createPrismaRedisCache } from "prisma-redis-middleware";
// apply fixes from https://github.com/Asjas/prisma-redis-middleware/issues/230
import type TRedis from "prisma-redis-middleware/node_modules/ioredis/built";
import Env from "../Env";
import Logger from "../Logger";

export default class Database {
  private static instance?: Database;
  static getInstance = () => this.instance || (this.instance = new this());

  private redis!: Redis;
  private prisma!: PrismaClient;

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

  async updateOrInsert(url: TShortUrl): Promise<ShortUrl> {
    return await this.prisma.shortUrl.upsert({
      where: {
        id: url.id,
      },
      create: url,
      update: url,
    });
  }

  async get(id: string): Promise<ShortUrl | null> {
    return await this.prisma.shortUrl.findUnique({
      where: {
        id,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shortUrl.delete({
      where: { id },
    });
  }

  closeAllConnection() {
    this.redis.disconnect();
    this.prisma.$disconnect();
  }
}
