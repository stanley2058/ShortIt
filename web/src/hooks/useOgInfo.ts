import { useState, useEffect } from "react";
import { TOpenGraphUrl } from "../types/TOpenGraphUrl";
import Utils from "../Utils";

async function fetchOgInfo(url: string): Promise<TOpenGraphUrl | null> {
  const res = await fetch(`${Utils.API_URI}/og?url=${encodeURIComponent(url)}`);
  if (res.ok) return res.json();
  return null;
}

export default function useOgInfo(url: string) {
  const [ogInfo, setOgInfo] = useState<TOpenGraphUrl | null>(null);

  useEffect(() => {
    (async () => {
      if (Utils.verifyUrl(url)) setOgInfo(await fetchOgInfo(url));
      else if (ogInfo) setOgInfo(null);
    })();
  }, [url]);

  return ogInfo;
}
