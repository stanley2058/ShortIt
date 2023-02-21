jest.spyOn(console, "warn").mockImplementation();

import { PrismaClient } from "@prisma/client";
import TRedis from "ioredis";
import createPrismaMock from "prisma-mock";
import Redis from "ioredis-mock";

export default class Connection {
  getRedis(): TRedis {
    return new Redis();
  }

  getPrisma(): PrismaClient {
    return createPrismaMock();
  }
}
