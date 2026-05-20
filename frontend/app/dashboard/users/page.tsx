"use client";

import { useState } from "react";
import { useApi } from "@/lib/hooks";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type User = { id: number; userName: string; email: string; role: string; createdAt: string };
const ROLES = ["ADMIN", "TEACHER", "STUDENT", "USER"];

export default function UsersPage() {
  const { me } = useAuth();
  const isAdmin = me?.role === "ADMIN";
  const { data, loading, error, reload } = useApi<User[]>("/api/users");
  const [form, setForm] = useState({ userName: "", email: "", password: "", role: "STUDENT" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      await api("/api/users", { method: "POST", body: JSON.stringify(form) });
      setForm({ userName: "", email: "", password: "", role: "STUDENT" });
      reload();
    } catch (e) {
      setMsg(e instanceof ApiError ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">👥 Users</h1>

      {isAdmin && (
        <form onSubmit={create} className="card grid gap-3 p-5 sm:grid-cols-2">
          <div>
            <label className="label">Username</label>
            <input className="input" required value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })} placeholder="bob" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="bob@uni.kz" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="min 6 chars" />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-end sm:col-span-2">
            <button className="btn-primary w-full" disabled={busy}>{busy ? "Adding…" : "Add user"}</button>
          </div>
          {msg && <p className="text-sm text-red-400 sm:col-span-2">{msg}</p>}
        </form>
      )}

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      ) : (
        <div className="grid gap-3">
          {data && data.length > 0 ? data.map((u) => (
            <div key={u.id} className="card flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{u.userName}</div>
                <div className="text-sm text-slate-400">{u.email}</div>
              </div>
              <span className="chip">{u.role}</span>
            </div>
          )) : <p className="text-slate-500">No users.</p>}
        </div>
      )}
    </div>
  );
}
