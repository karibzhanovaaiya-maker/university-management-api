"use client";

import { useState } from "react";
import { useApi } from "@/lib/hooks";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Student = {
  id: number; studentName: string; age: number;
  groupName: string; email: string; userId: number; courseIds: number[];
};

export default function StudentsPage() {
  const { me } = useAuth();
  const isAdmin = me?.role === "ADMIN";
  const { data, loading, error, reload } = useApi<Student[]>("/api/students");
  const [form, setForm] = useState({ studentName: "", age: "18", groupName: "", email: "", userId: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      await api("/api/students", {
        method: "POST",
        body: JSON.stringify({
          studentName: form.studentName,
          age: Number(form.age),
          groupName: form.groupName,
          email: form.email,
          userId: Number(form.userId),
          courseIds: [],
        }),
      });
      setForm({ studentName: "", age: "18", groupName: "", email: "", userId: "" });
      reload();
    } catch (e) {
      setMsg(e instanceof ApiError ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">🎓 Students</h1>

      {isAdmin && (
        <form onSubmit={create} className="card grid gap-3 p-5 sm:grid-cols-2">
          <div>
            <label className="label">Student name</label>
            <input className="input" required value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="Alice" />
          </div>
          <div>
            <label className="label">Group</label>
            <input className="input" required value={form.groupName}
              onChange={(e) => setForm({ ...form, groupName: e.target.value })} placeholder="CS-2201" />
          </div>
          <div>
            <label className="label">Age</label>
            <input className="input" type="number" min={16} max={100} value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </div>
          <div>
            <label className="label">Linked user id</label>
            <input className="input" type="number" required value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })} placeholder="2" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Email</label>
            <input className="input" type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="alice@uni.kz" />
          </div>
          <div className="flex items-end sm:col-span-2">
            <button className="btn-primary w-full" disabled={busy}>{busy ? "Adding…" : "Add student"}</button>
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
          {data && data.length > 0 ? data.map((s) => (
            <div key={s.id} className="card flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{s.studentName}</div>
                <div className="text-sm text-slate-400">{s.groupName} · age {s.age} · {s.email}</div>
              </div>
              <span className="chip">{s.courseIds.length} course(s)</span>
            </div>
          )) : <p className="text-slate-500">No students yet.</p>}
        </div>
      )}
    </div>
  );
}
