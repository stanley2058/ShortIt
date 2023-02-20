export type TShortUrl = {
  id: string; // is also path
  url: string; // target
  userId?: string; // email
  createdAt?: Date;
  views?: number;
  isOgCustom: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};
