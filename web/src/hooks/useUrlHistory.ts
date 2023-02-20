import { useState, useMemo, useEffect } from "react";
import UrlService from "../services/UrlService";
import { TShortUrl } from "../types/TShortUrl";

export default function useUrlHistory(skip: number, take = 10) {
  const [urls, setUrls] = useState<TShortUrl[]>([]);
  const [total, setTotal] = useState<number>(0);

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
  }, [skip, take]);

  return useMemo(() => [urls, total] as const, [urls, total, skip, take]);
}
