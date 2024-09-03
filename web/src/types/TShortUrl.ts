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
