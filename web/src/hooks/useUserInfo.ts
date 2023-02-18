import { useState, useMemo, useEffect } from "react";
import { TAuth0User } from "../types/TAuth0User";

const API_URL = import.meta.env.VITE_API_URL;
const API_VER = import.meta.env.VITE_API_VERSION;
const API_URI = `${API_URL}/api/${API_VER}`;

async function fetchUserInfo(): Promise<TAuth0User | null> {
  const res = await fetch(`${API_URI}/user`, {
    method: "GET",
    credentials: "include",
  });
  if (res.ok) return await res.json();
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
