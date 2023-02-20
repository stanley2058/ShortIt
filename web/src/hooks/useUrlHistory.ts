import { useState, useMemo, useEffect } from "react";
import UrlService from "../services/UrlService";
import { TShortUrl } from "../types/TShortUrl";

export default function useUrlHistory(skip: number, take = 10) {
  const [urls, setUrls] = useState<TShortUrl[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [localVer, setLocalVer] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const total$ = UrlService.countUrls();
      const update$ = UrlService.getAllUrl(
        skip || undefined,
        take === 10 ? undefined : take
      );
      setUrls(await update$);
      setTotal(await total$);
    })();
  }, [skip, take, localVer]);

  const refresh = () => setLocalVer(localVer + 1);

  return useMemo(
    () => [urls, total, refresh] as const,
    [urls, total, skip, take]
  );
}
