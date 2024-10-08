import { PrismaClient, ShortUrl } from "@prisma/client";
import { TShortUrl } from "../types/TShortUrl";
import Redis from "ioredis";
import Logger from "../Logger";
import Connection from "./Connection";
import { randomUUID } from "crypto";

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
      const con = new Connection();
      this.redis = con.getRedis();
      this.connectionStatus.redis = true;
      this.prisma = con.getPrisma();
      this.connectionStatus.prisma = true;
    } catch (err) {
      Logger.verbose("", err);
      Logger.fatal("cannot establish database connection");
    }
  }

  async updateOrInsert(url: TShortUrl): Promise<ShortUrl> {
    try {
      return await this.prisma.shortUrl.upsert({
        where: {
          id: url.id,
        },
        create: url,
        update: url,
      });
    } catch (e) {
      Logger.error("", e);
      url.id = randomUUID().toString();
      return await this.prisma.shortUrl.upsert({
        where: {
          id: url.id,
        },
        create: url,
        update: url,
      });
    }
  }

  async get(id: string): Promise<ShortUrl | null> {
    try {
      return await this.prisma.shortUrl.findUnique({
        where: {
          id,
        },
      });
    } catch (e) {
      Logger.error("", e);
      return null;
    }
  }

  async getByAlias(alias: string): Promise<ShortUrl | null> {
    return await this.prisma.shortUrl.findFirst({
      where: {
        alias,
      },
    });
  }

  async getByUser(
    userId: string,
    skip?: number,
    take = 10
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
