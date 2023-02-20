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
  private connectionStatus = {
    redis: false,
    prisma: false,
  };

  private constructor() {
    try {
      this.redis = new Redis(Env.redisUri);
      this.connectionStatus.redis = true;
      Logger.verbose("connected to redis");
      this.prisma = new PrismaClient();
      this.connectionStatus.prisma = true;
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

  async getByUser(
    userId: string,
    skip?: number,
    take = 20
  ): Promise<ShortUrl[]> {
    if (userId === "") return [];
    return await this.prisma.shortUrl.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip || 0,
      take: take,
    });
  }

  async countByUser(userId: string): Promise<number> {
    if (userId === "") 0;
    return await this.prisma.shortUrl.count({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getByUrl(
    url: string,
    userId?: string,
    allowCustomOg = false
  ): Promise<ShortUrl | null> {
    return await this.prisma.shortUrl.findFirst({
      where: {
        url,
        userId: userId || null,
        isOgCustom: allowCustomOg ? undefined : false,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shortUrl.delete({
      where: { id },
    });
  }

  async connect() {
    const { redis, prisma } = this.connectionStatus;
    try {
      if (!redis) await this.redis.connect();
      if (!prisma) await this.prisma.$connect();
      this.connectionStatus = {
        redis: true,
        prisma: true,
      };
    } catch (err) {
      Logger.verbose("", err);
      Logger.fatal("cannot connect to database");
    }
  }

  async disconnect() {
    const { redis, prisma } = this.connectionStatus;
    try {
      if (redis) await this.redis.quit();
      if (prisma) await this.prisma.$disconnect();
      this.connectionStatus = {
        redis: false,
        prisma: false,
      };
    } catch (err) {
      Logger.verbose("", err);
      Logger.error("error occurs while trying to disconnect from database");
    }
  }
}
