import { PrismaClient } from "@prisma/client";

export default class Database {
  private static instance?: Database;
  static getInstance = () => this.instance || (this.instance = new this());

  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }
}
