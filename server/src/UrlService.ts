import { ShortUrl } from "@prisma/client";
import { Request, Response } from "express";
import Database from "./databases/Database";
import { TOpenGraphUrl } from "./types/TOpenGraphUrl";
import mScraper from "metascraper";
import mDescription from "metascraper-description";
import mImage from "metascraper-image";
import mTitle from "metascraper-title";
import NodeDomParser from "dom-parser";
import { TAuth0User } from "./types/TAuth0User";
import Logger from "./Logger";

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

  static async insertOrUpdateUrl(req: Request, res: Response): Promise<void> {
    const hasLogin = req.oidc.isAuthenticated();
    const user = hasLogin ? (req.oidc.user as TAuth0User) : undefined;
    const body: TReqOpenGraphUrl = req.body;
    if (body === undefined) {
      res.sendStatus(400);
      return;
    }

    const isOgCustom = !!body.ogTitle || !!body.ogDescription || !!body.ogImage;

    // trying to create a new url
    if (body.id === undefined) {
      const existing = await Database.getInstance().getByUrl(body.url);
      if (existing) {
        res.json(this.mapShortUrlToResOGUrl(existing));
        return;
      }

      const metadata = await this.fetchOgMetadata(body.url);
      const created = await Database.getInstance().updateOrInsert({
        ...metadata,
        ...body,
        id: await this.generateUrlId(),
        isOgCustom,
        userId: user ? user.email : undefined,
      });
      res.json(this.mapShortUrlToResOGUrl(created));
      return;
    }

    // editing short url
    if (!hasLogin) {
      res.sendStatus(401);
      return;
    }
    const existing = await Database.getInstance().get(body.id);
    if (existing === null) {
      res.sendStatus(400);
      return;
    }
    if (existing.userId !== user?.email) {
      res.sendStatus(403);
      return;
    }

    const update = await Database.getInstance().updateOrInsert({
      ...this.mapShortUrlToResOGUrl(existing),
      ...body,
      isOgCustom: existing.isOgCustom || isOgCustom,
    });
    res.json(this.mapShortUrlToResOGUrl(update));
  }

  static async getOGUrl(id: string): Promise<TResOpenGraphUrl | null> {
    const res = await Database.getInstance().get(id);
    return res ? this.mapShortUrlToResOGUrl(res) : res;
  }

  static async getAllShortUrls(
    user: TAuth0User,
    skip: number,
    take: number
  ): Promise<ShortUrl[]> {
    return await Database.getInstance().getByUser(
      user.email,
      isNaN(skip) ? undefined : skip,
      isNaN(take) ? undefined : take
    );
  }

  static async deleteUrl(id: string, userId: string): Promise<void> {
    const toDelete = await Database.getInstance().get(id);
    if (toDelete === null)
      throw new Error("cannot delete a record doesn't exist");
    if (toDelete.userId !== userId)
      throw new Error("cannot delete a record from another user");
    await Database.getInstance().delete(id);
  }

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

  /**
   * Maps a Prisma ShortUrl object to a TResOpenGraphUrl type
   * @param sUrl ShortUrl object from Prisma
   * @returns transformed into TResOpenGraphUrl from frontend
   */
  static mapShortUrlToResOGUrl(sUrl: ShortUrl): TResOpenGraphUrl {
    return {
      id: sUrl.id,
      url: sUrl.url,
      ogTitle: sUrl.ogTitle || undefined,
      ogDescription: sUrl.ogDescription || undefined,
      ogImage: sUrl.ogImage || undefined,
    };
  }

  /**
   * Fetches the Open Graph metadata from a given url
   * @param url url to fetch from
   * @returns a TOpenGraphUrl object or a null value if failed
   */
  static async fetchOgMetadata(url: string): Promise<TOpenGraphUrl | null> {
    try {
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
    } catch (err) {
      Logger.error(`error occurs fetching open graph metadata from: ${url}`);
      Logger.plain.verbose("", err);
    }
    return null;
  }
}
