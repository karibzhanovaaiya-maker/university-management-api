"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
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
      setErr(e instanceof ApiError ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">🎓 University</h1>
        <p className="mt-1 text-sm text-slate-400">Sign in to your account</p>
      </div>
      <form onSubmit={onSubmit} className="card space-y-4 p-6">
        <div>
          <label className="label">Username</label>
          <input className="input" value={userName} onChange={(e) => setUserName(e.target.value)}
            placeholder="admin" autoCapitalize="none" autoComplete="username" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" autoComplete="current-password" required />
        </div>
        {err && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{err}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-400">
        No account? <Link href="/register" className="text-accent">Create one</Link>
      </p>
    </main>
  );
}
