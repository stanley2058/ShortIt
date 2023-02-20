import { useState, useMemo, useEffect } from "react";
import { TAuth0User } from "../types/TAuth0User";
import Envs from "../Envs";

async function fetchUserInfo(): Promise<TAuth0User | null> {
  const res = await fetch(`${Envs.API_URI}/user`, {
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
      try {
        const userInfo = await fetchUserInfo();
        setUser(userInfo);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return useMemo(() => [user, isLoading] as const, [user, isLoading]);
}
