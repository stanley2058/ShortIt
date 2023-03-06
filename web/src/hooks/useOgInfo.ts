import { useState, useEffect } from "react";
import UrlService from "../services/UrlService";
import { TOpenGraphUrl } from "../types/TOpenGraphUrl";
import Envs from "../Envs";

async function fetchOgInfo(
  url: string,
  controller: AbortController
): Promise<TOpenGraphUrl | null> {
  const res = await fetch(`${Envs.API_URI}/og?url=${encodeURIComponent(url)}`, {
    signal: controller.signal,
  });
  if (res.ok) return res.json();
  return null;
}

export default function useOgInfo(url: string) {
  const [ogInfo, setOgInfo] = useState<TOpenGraphUrl | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      if (UrlService.verifyUrl(url)[0]) {
        setOgInfo(await fetchOgInfo(url, controller));
      } else if (ogInfo) setOgInfo(null);
    })();

    return () => controller.abort();
  }, [url]);

  return ogInfo;
}
