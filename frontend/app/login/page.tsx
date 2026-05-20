"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { useT } from "@/lib/i18n";
import { TopNav } from "@/components/TopNav";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useT();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(userName.trim(), password);
      router.replace("/dashboard");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : t("auth.loginFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-md px-5 pb-16 pt-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{t("auth.signInTitle")}</h1>
          <p className="mt-1 text-sm text-muted">{t("auth.signInSub")}</p>
        </div>
        <form onSubmit={onSubmit} className="card space-y-4 p-6">
          <div>
            <label className="label">{t("auth.username")}</label>
            <input className="input" value={userName} onChange={(e) => setUserName(e.target.value)}
              placeholder="admin" autoCapitalize="none" autoComplete="username" required />
          </div>
          <div>
            <label className="label">{t("auth.password")}</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password" required />
          </div>
          {err && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{err}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-muted">
          {t("auth.noAccount")} <Link href="/register" className="text-accent">{t("auth.createOne")}</Link>
        </p>
      </main>
    </>
  );
}
