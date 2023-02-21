export type TReqOpenGraphUrl = TOpenGraphUrl & { id?: string };
export type TResOpenGraphUrl = TOpenGraphUrl & { id: string };
export type TOpenGraphUrl = {
  url: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};
