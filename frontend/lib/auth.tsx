"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, meStore, tokenStore, Me } from "./api";

type AuthResponse = { token: string; userName: string; role: string };

type AuthCtx = {
  me: Me | null;
  ready: boolean;
  login: (userName: string, password: string) => Promise<void>;
  register: (userName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMe(meStore.get());
    setReady(true);
  }, []);

  async function persist(res: AuthResponse) {
    tokenStore.set(res.token);
    const m = { userName: res.userName, role: res.role };
    meStore.set(m);
    setMe(m);
  }

  const login = async (userName: string, password: string) => {
    const res = await api<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ userName, password }),
    });
    await persist(res);
  };

  const register = async (userName: string, email: string, password: string) => {
    const res = await api<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ userName, email, password }),
    });
    await persist(res);
  };

  const logout = () => {
    tokenStore.clear();
    setMe(null);
    window.location.href = "/login";
  };

  return <Ctx.Provider value={{ me, ready, login, register, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
