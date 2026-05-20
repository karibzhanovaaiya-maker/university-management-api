"use client";

import { useState } from "react";
import { useApi } from "@/lib/hooks";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { PageHelp } from "@/components/PageHelp";

type Student = {
  id: number; studentName: string; age: number;
  groupName: string; email: string; userId: number; courseIds: number[];
};
type User = { id: number; userName: string; role: string };

export default function StudentsPage() {
  const { me } = useAuth();
  const { t } = useT();
  const isAdmin = me?.role === "ADMIN";
  const { data, loading, error, reload } = useApi<Student[]>("/api/students");
  const users = useApi<User[]>("/api/users");
  const [form, setForm] = useState({ studentName: "", age: "18", groupName: "", email: "", userId: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.userId) { setMsg(t("f.linkedUserId") + " — required"); return; }
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
      <h1 className="text-2xl font-bold">🎓 {t("nav.students")}</h1>
      <PageHelp k="students" />

      {isAdmin && (
        <form onSubmit={create} className="card grid gap-3 p-5 sm:grid-cols-2">
          <div>
            <label className="label">{t("f.studentName")}</label>
            <input className="input" required value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="Alice" />
          </div>
          <div>
            <label className="label">{t("f.group")}</label>
            <input className="input" required value={form.groupName}
              onChange={(e) => setForm({ ...form, groupName: e.target.value })} placeholder="CS-2201" />
          </div>
          <div>
            <label className="label">{t("f.age")}</label>
            <input className="input" type="number" min={16} max={100} value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </div>
          <div>
            <label className="label">{t("f.linkedUserId")}</label>
            <select className="input" required value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}>
              <option value="" disabled>—</option>
              {(users.data || []).map((u) => (
                <option key={u.id} value={u.id}>#{u.id} · {u.userName} ({u.role})</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">{t("f.email")}</label>
            <input className="input" type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="alice@uni.kz" />
          </div>
          <div className="flex items-end sm:col-span-2">
            <button className="btn-primary w-full" disabled={busy}>{busy ? t("common.loading") : t("btn.addStudent")}</button>
          </div>
          {msg && <p className="text-sm text-red-500 sm:col-span-2">{msg}</p>}
        </form>
      )}

      {loading ? (
        <p className="text-muted">{t("common.loading")}</p>
      ) : error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
      ) : (
        <div className="grid gap-3">
          {data && data.length > 0 ? data.map((s) => (
            <div key={s.id} className="card flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{s.studentName}</div>
                <div className="text-sm text-muted">{s.groupName} · {s.age} · {s.email}</div>
              </div>
              <span className="chip">{s.courseIds.length} {t("u.courses")}</span>
            </div>
          )) : <p className="text-muted">{t("common.none")}</p>}
        </div>
      )}
    </div>
  );
}
