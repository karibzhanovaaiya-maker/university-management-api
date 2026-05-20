"use client";

import { useState } from "react";
import { useApi } from "@/lib/hooks";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Teacher = { id: number; teacherName: string; courseCount: number };

export default function TeachersPage() {
  const { me } = useAuth();
  const isAdmin = me?.role === "ADMIN";
  const { data, loading, error, reload } = useApi<Teacher[]>("/api/teachers");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      await api("/api/teachers", { method: "POST", body: JSON.stringify({ teacherName: name }) });
      setName("");
      reload();
    } catch (e) {
      setMsg(e instanceof ApiError ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    setMsg("");
    try {
      await api(`/api/teachers/${id}`, { method: "DELETE" });
      reload();
    } catch (e) {
      setMsg(e instanceof ApiError ? e.message : "Failed");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">🧑‍🏫 Teachers</h1>

      {isAdmin && (
        <form onSubmit={create} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="label">Teacher name</label>
            <input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Smith" />
          </div>
          <button className="btn-primary sm:w-40" disabled={busy}>{busy ? "Adding…" : "Add teacher"}</button>
        </form>
      )}
      {msg && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{msg}</p>}

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      ) : (
        <div className="grid gap-3">
          {data && data.length > 0 ? data.map((t) => (
            <div key={t.id} className="card flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{t.teacherName}</div>
                <div className="text-sm text-slate-400">{t.courseCount} course(s)</div>
              </div>
              {isAdmin && (
                <button onClick={() => remove(t.id)} className="text-sm text-red-400 hover:underline">Delete</button>
              )}
            </div>
          )) : <p className="text-slate-500">No teachers yet.</p>}
        </div>
      )}
    </div>
  );
}
