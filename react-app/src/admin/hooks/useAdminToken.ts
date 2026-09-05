import { useCallback, useEffect, useState } from "react";

const KEY = "adminToken";
const EVENT = "admin-token-change";

export function getAdminToken(): string {
  return sessionStorage.getItem(KEY) ?? "";
}

export function useAdminToken() {
  const [token, setTokenState] = useState(getAdminToken);

  useEffect(() => {
    const sync = () => setTokenState(getAdminToken());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const setToken = useCallback((value: string) => {
    if (value) sessionStorage.setItem(KEY, value);
    else sessionStorage.removeItem(KEY);
    setTokenState(value);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { token, setToken, isEditor: token.length > 0 };
}