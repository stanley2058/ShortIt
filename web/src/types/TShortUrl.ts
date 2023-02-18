export type TShortUrl = {
  id: string; // is also path
  url: string; // target
  userId?: string; // email
  createAt?: Date;
  views?: number;
  isOgCustom: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};

export type ShortUrl = {
  id: string;
  url: string;
  userId: string | null;
  createdAt: Date;
  views: number;
  isOgCustom: boolean;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
};
