import { useState, useMemo, useEffect } from "react";
import { TAuth0User } from "../types/TAuth0User";
import Utils from "../Utils";

async function fetchUserInfo(): Promise<TAuth0User | null> {
  const res = await fetch(`${Utils.API_URI}/user`, {
    method: "GET",
    credentials: "include",
  });
  if (res.ok) return res.json();
  return null;
}

export default function useUserInfo() {
  const [user, setUser] = useState<TAuth0User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const userInfo = await fetchUserInfo();
      setUser(userInfo);
      setIsLoading(false);
    })();
  }, []);

  return useMemo(() => [user, isLoading], [user, isLoading]);
}
