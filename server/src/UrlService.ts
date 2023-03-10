import { ShortUrl } from "@prisma/client";
import Database from "./databases/Database";
import { TReqOpenGraphUrl, TResOpenGraphUrl } from "./types/TOpenGraphUrl";
import { TAuth0User } from "./types/TAuth0User";
import OpenGraphService from "./OpenGraphService";
import { fromShortUrl, TShortUrl } from "./types/TShortUrl";
import Env from "./Env";
export default class UrlService {
  private static readonly charOpts =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  private static readonly reservedWords = new Set(
    ...["user", "counts", "login", "logout", "manage", "about"]
  );

  static async insertOrUpdateUrl(
    body: TReqOpenGraphUrl,
    user?: TAuth0User
  ): Promise<{ result?: TResOpenGraphUrl; status?: number }> {
    const metadata = await OpenGraphService.getInstance().getOgMetadata(
      body.url
    );
    const isOgCustom =
      body.ogTitle !== metadata?.ogTitle ||
      body.ogDescription !== metadata?.ogDescription ||
      body.ogImage !== metadata?.ogImage;

    // trying to create a new url
    if (body.id === undefined) {
      const existing = await Database.getInstance().getByUrl(
        body.url,
        user?.email
      );
      if (existing) return { result: this.mapShortUrlToResOGUrl(existing) };

      const created = await Database.getInstance().updateOrInsert({
        ...metadata,
        ...body,
        id: await this.generateUrlId(),
        isOgCustom,
        userId: user ? user.email : undefined,
      });
      return { result: this.mapShortUrlToResOGUrl(created) };
    }

    // editing short url
    if (!user) return { status: 401 };
    const existing = await Database.getInstance().get(body.id);
    if (existing === null) return { status: 400 };
    if (existing.userId !== user?.email) return { status: 403 };

    const update = await Database.getInstance().updateOrInsert({
      ...this.mapShortUrlToResOGUrl(existing),
      ...body,
      isOgCustom: existing.isOgCustom || isOgCustom,
    });
    return { result: this.mapShortUrlToResOGUrl(update) };
  }

  static async getOGUrl(id: string): Promise<TResOpenGraphUrl | null> {
    const res = await Database.getInstance().get(id);
    return res ? this.mapShortUrlToResOGUrl(res) : res;
  }

  static async getAllShortUrls(
    user: TAuth0User,
    skip: number,
    take: number
  ): Promise<TShortUrl[]> {
    const res = await Database.getInstance().getByUser(
      user.email,
      isNaN(skip) ? undefined : skip,
      isNaN(take) ? undefined : take
    );
    return res.map(fromShortUrl);
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
    if (this.reservedWords.has(id)) this.generateUrlId(length, retry + 1);
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
   * Verifies if an URL is valid for ShortIt!
   * @param url URL to verify
   * @returns is valid
   */
  static verifyUrl(url: string): boolean {
    try {
      const toVerify = new URL(url);
      const base = new URL(Env.baseUrl);
      return toVerify.host !== base.host;
    } catch (err) {
      return false;
    }
  }
}
