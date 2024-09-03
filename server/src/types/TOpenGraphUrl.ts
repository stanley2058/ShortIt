export type TReqOpenGraphUrl = TOpenGraphUrl & { id?: string; alias?: string };
export type TResOpenGraphUrl = TOpenGraphUrl & { id: string; alias: string };
export type TOpenGraphUrl = {
  url: string;
  urlHash: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};
