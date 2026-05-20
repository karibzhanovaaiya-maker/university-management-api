"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { useT } from "@/lib/i18n";
import { PublicShell } from "@/components/PublicShell";

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useT();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setFields({});
    setLoading(true);
    try {
      await register(userName.trim(), email.trim(), password);
      router.replace("/dashboard");
    } catch (e) {
      if (e instanceof ApiError) {
        setErr(e.message);
        if (e.fields) setFields(e.fields);
      } else setErr(t("auth.regFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-md pt-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{t("auth.registerTitle")}</h1>
          <p className="mt-1 text-sm text-muted">{t("auth.registerSub")}</p>
        </div>
        <form onSubmit={onSubmit} className="card space-y-4 p-6">
          <div>
            <label className="label">{t("auth.username")}</label>
            <input className="input" value={userName} onChange={(e) => setUserName(e.target.value)}
              placeholder="aiya" autoCapitalize="none" required />
            {fields.userName && <p className="mt-1 text-xs text-red-500">{fields.userName}</p>}
          </div>
          <div>
            <label className="label">{t("auth.email")}</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="aiya@example.com" autoCapitalize="none" required />
            {fields.email && <p className="mt-1 text-xs text-red-500">{fields.email}</p>}
          </div>
          <div>
            <label className="label">{t("auth.password")}</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••" required />
            {fields.password && <p className="mt-1 text-xs text-red-500">{fields.password}</p>}
          </div>
          {err && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{err}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? t("auth.creating") : t("auth.create")}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-muted">
          {t("auth.haveAccount")} <Link href="/login" className="text-accent">{t("auth.signIn")}</Link>
        </p>
      </div>
    </PublicShell>
  );
}
