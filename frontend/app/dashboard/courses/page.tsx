"use client";

import { useState } from "react";
import { useApi } from "@/lib/hooks";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Course = {
  id: number; courseName: string; credits: number;
  maxStudents: number; teacherId: number | null; teacherName: string | null;
};

export default function CoursesPage() {
  const { me } = useAuth();
  const isAdmin = me?.role === "ADMIN";
  const { data, loading, error, reload } = useApi<Course[]>("/api/courses");
  const [form, setForm] = useState({ courseName: "", credits: "3", maxStudents: "30", teacherId: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      await api("/api/courses", {
        method: "POST",
        body: JSON.stringify({
          courseName: form.courseName,
          credits: Number(form.credits),
          maxStudents: Number(form.maxStudents),
          teacherId: form.teacherId ? Number(form.teacherId) : null,
        }),
      });
      setForm({ courseName: "", credits: "3", maxStudents: "30", teacherId: "" });
      reload();
    } catch (e) {
      setMsg(e instanceof ApiError ? e.message : "Failed to create");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📚 Courses</h1>

      {isAdmin && (
        <form onSubmit={create} className="card grid gap-3 p-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Course name</label>
            <input className="input" required value={form.courseName}
              onChange={(e) => setForm({ ...form, courseName: e.target.value })} placeholder="Algorithms" />
          </div>
          <div>
            <label className="label">Credits</label>
            <input className="input" type="number" min={1} max={10} value={form.credits}
              onChange={(e) => setForm({ ...form, credits: e.target.value })} />
          </div>
          <div>
            <label className="label">Max students</label>
            <input className="input" type="number" min={1} value={form.maxStudents}
              onChange={(e) => setForm({ ...form, maxStudents: e.target.value })} />
          </div>
          <div>
            <label className="label">Teacher id (optional)</label>
            <input className="input" type="number" value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })} placeholder="1" />
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full" disabled={busy}>{busy ? "Adding…" : "Add course"}</button>
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
          {data && data.length > 0 ? data.map((c) => (
            <div key={c.id} className="card flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{c.courseName}</div>
                <div className="text-sm text-slate-400">
                  {c.teacherName ? `👤 ${c.teacherName}` : "no teacher"} · max {c.maxStudents}
                </div>
              </div>
              <span className="chip">{c.credits} cr</span>
            </div>
          )) : <p className="text-slate-500">No courses yet.</p>}
        </div>
      )}
    </div>
  );
}
