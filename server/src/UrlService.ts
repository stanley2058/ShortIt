import { ShortUrl } from "@prisma/client";
import { Request, Response } from "express";
import Database from "./databases/Database";
import { TOpenGraphUrl } from "./types/TOpenGraphUrl";
import mScraper from "metascraper";
import mDescription from "metascraper-description";
import mImage from "metascraper-image";
import mTitle from "metascraper-title";
import NodeDomParser from "dom-parser";

type TReqOpenGraphUrl = TOpenGraphUrl & { id?: string };
type TResOpenGraphUrl = TOpenGraphUrl & { id: string };
export default class UrlService {
  private static readonly metaScraper = mScraper([
    mDescription(),
    mImage(),
    mTitle(),
  ]);
  private static readonly charOpts =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  /**
   * Generate a unique id for url path
   * @param length length of generated url path
   * @param retry retries of generations
   * @returns unique id for url path
   */
  static async generateUrlId(length = 4, retry = 0): Promise<string> {
    if (retry >= 3) {
      retry = 0;
      length++;
    }
    let id = "";
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * this.charOpts.length);
      id += this.charOpts[idx];
    }
    const exist = await Database.getInstance().get(id);
    if (exist === null) return id;
    return this.generateUrlId(length, retry + 1);
  }

  static mapShortUrlToResOGUrl(sUrl: ShortUrl): TResOpenGraphUrl {
    return {
      id: sUrl.id,
      url: sUrl.url,
      ogTitle: sUrl.ogTitle || undefined,
      ogDescription: sUrl.ogDescription || undefined,
      ogImage: sUrl.ogImage || undefined,
    };
  }

  static async fetchOgMetadata(url: string): Promise<TOpenGraphUrl | null> {
    const html = await fetch(url).then((res) => res.text());
    const title = new NodeDomParser()
      .parseFromString(html)
      .getElementsByTagName("title")?.[0].innerHTML;
    const metadata = await this.metaScraper({ url, html });
    return {
      url,
      ogTitle: metadata.title || title,
      ogDescription: metadata.description || title,
      ogImage: metadata.image,
    };
  }
}
