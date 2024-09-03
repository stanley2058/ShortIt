import { ShortUrl } from "@prisma/client";

export type TShortUrl = {
  id: string; // uuid
  alias: string; // path
  url: string; // target
  urlHash: string;
  userId?: string; // email
  createdAt?: Date;
  views?: number;
  isOgCustom: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};

export function fromShortUrl(shortUrl: ShortUrl): TShortUrl {
  const transformed: TShortUrl = {
    id: shortUrl.id,
    alias: shortUrl.alias,
    url: shortUrl.url,
    urlHash: shortUrl.urlHash,
    isOgCustom: shortUrl.isOgCustom,
    userId: shortUrl.userId || undefined,
    ogTitle: shortUrl.ogTitle || undefined,
    ogDescription: shortUrl.ogDescription || undefined,
    ogImage: shortUrl.ogImage || undefined,
    createdAt: shortUrl.createdAt || undefined,
    views: shortUrl.views,
  };

  return transformed;
}
