import type { PrismaClient } from "@prisma/client";
import type { Redis } from "ioredis";
import { PrismaExtensionRedis } from "prisma-extension-redis";

export function registerPrismaCache(prisma: PrismaClient, redis: Redis) {
  return prisma.$extends(
    PrismaExtensionRedis({
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
            client: redis,
            invalidation: { referencesTTL: 300 }, // Invalidation settings
            log: undefined, // Logger for cache events
          },
        }, // Storage configuration for async-cache-dedupe
      },
      redis,
    })
  ) as unknown as PrismaClient;
}
