import Redis from "ioredis";
import Logger from "./Logger";
import NodeDomParser from "dom-parser";
import { TOpenGraphUrl } from "./types/TOpenGraphUrl";

import { Scraper } from "metascraper";
import mScraper from "metascraper";
import mDescription from "metascraper-description";
import mImage from "metascraper-image";
import mTitle from "metascraper-title";

import twitter from "metascraper-twitter";
import telegram from "metascraper-telegram";
import youtube from "metascraper-youtube";
import spotify from "metascraper-spotify";
import soundcloud from "metascraper-soundcloud";
import amazon from "metascraper-amazon";
import instagram from "metascraper-instagram";
import Connection from "./databases/Connection";
import UrlService from "./UrlService";

export default class OpenGraphService {
  private static instance?: OpenGraphService;
  static getInstance = () => this.instance || (this.instance = new this());

  private hasConnected = false;
  private redis!: Redis;
  private readonly metaScraper!: Scraper;

  private constructor() {
    try {
      const con = new Connection();
      this.redis = con.getRedis();
      this.hasConnected = true;
      Logger.verbose("connected to redis (OG cache)");

      this.metaScraper = mScraper([
        mDescription(),
        mImage(),
        mTitle(),
        twitter(),
        telegram(),
        youtube(),
        spotify(),
        soundcloud(),
        amazon(),
        instagram(),
      ]);
    } catch (err) {
      Logger.verbose("", err);
      Logger.fatal("cannot establish database connection");
    }
  }

  /**
   * Get the Open Graph metadata for a given url, uses Redis as cache
   * @param url corresponding url to the OG meta
   * @returns a TOpenGraphUrl object or a null value if failed
   */
  async getOgMetadata(url: string): Promise<TOpenGraphUrl | null> {
    const existing = await this.redis.get(url);
    if (existing !== null) return JSON.parse(existing);
    const fetchedRes = await this.fetchOgMetadata(url);
    await this.redis.set(url, JSON.stringify(fetchedRes), "EX", 300);
    return fetchedRes;
  }

  /**
   * Fetches the Open Graph metadata from a given url
   * @param url url to fetch from
   * @returns a TOpenGraphUrl object or a null value if failed
   */
  private async fetchOgMetadata(url: string): Promise<TOpenGraphUrl | null> {
    try {
      const html = await fetch(url).then((res) => res.text());
      const title = new NodeDomParser()
        .parseFromString(html)
        .getElementsByTagName("title")?.[0]?.innerHTML;
      const metadata = await this.metaScraper({ url, html });
      return {
        url,
        urlHash: UrlService.toSHA256(url),
        ogTitle: metadata.title || title,
        ogDescription: metadata.description || title,
        ogImage: metadata.image || undefined,
      };
    } catch (err) {
      Logger.verbose(`error occurs fetching open graph metadata from: ${url}`);
      Logger.plain.verbose("", err);
    }
    return null;
  }

  async connect(): Promise<void> {
    if (!this.hasConnected) await this.redis.connect();
  }
  disconnect(): void {
    if (this.hasConnected) this.redis.disconnect();
  }
}
