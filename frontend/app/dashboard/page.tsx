"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useApi } from "@/lib/hooks";

function StatCard({ href, icon, label, path }: { href: string; icon: string; label: string; path: string }) {
  const { data, loading, error } = useApi<unknown[]>(path);
  return (
    <Link href={href} className="card flex items-center gap-4 p-5 transition hover:border-accent/60">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-2xl font-bold">
          {loading ? "…" : error ? "—" : (data?.length ?? 0)}
        </div>
        <div className="text-sm text-slate-400">{label}</div>
      </div>
    </Link>
  );
}

export default function DashboardHome() {
  const { me } = useAuth();
  const isAdmin = me?.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {me?.userName} 👋</h1>
        <p className="text-sm text-slate-400">
          Role: <span className="chip">{me?.role}</span>{" "}
          {!isAdmin && "— some sections are ADMIN-only."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard href="/dashboard/courses" icon="📚" label="Courses" path="/api/courses" />
        <StatCard href="/dashboard/teachers" icon="🧑‍🏫" label="Teachers" path="/api/teachers" />
        <StatCard href="/dashboard/students" icon="🎓" label="Students" path="/api/students" />
        <StatCard href="/dashboard/users" icon="👥" label="Users" path="/api/users" />
      </div>

      <div className="card p-5 text-sm text-slate-400">
        <p className="mb-2 font-medium text-slate-200">About this app</p>
        Mobile-first client for the University Management API (Spring Boot). Auth uses a
        JWT bearer token stored after login. API docs are available at{" "}
        <a className="text-accent" href="/swagger-ui/index.html" target="_blank" rel="noreferrer">/swagger-ui</a>.
      </div>
    </div>
  );
}
