"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { useApi } from "@/lib/hooks";

function StatCard({ href, icon, label, path }: { href: string; icon: string; label: string; path: string }) {
  const { data, loading, error } = useApi<unknown[]>(path);
  return (
    <Link href={href} className="card flex items-center gap-4 p-5 transition hover:border-accent/60">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-2xl font-bold">{loading ? "…" : error ? "—" : (data?.length ?? 0)}</div>
        <div className="text-sm text-muted">{label}</div>
      </div>
    </Link>
  );
}

export default function DashboardHome() {
  const { me } = useAuth();
  const { t } = useT();
  const isAdmin = me?.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("dash.welcome")}, {me?.userName} 👋</h1>
        <p className="text-sm text-muted">
          {t("role")}: <span className="chip">{me?.role}</span>{" "}
          {!isAdmin && `— ${t("adminOnly")}`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard href="/dashboard/courses" icon="📚" label={t("nav.courses")} path="/api/courses" />
        <StatCard href="/dashboard/teachers" icon="🧑‍🏫" label={t("nav.teachers")} path="/api/teachers" />
        <StatCard href="/dashboard/students" icon="🎓" label={t("nav.students")} path="/api/students" />
        <StatCard href="/dashboard/users" icon="👥" label={t("nav.users")} path="/api/users" />
      </div>

      <div className="card p-5 text-sm">
        <p className="mb-2 font-medium">{t("dash.aboutTitle")}</p>
        <p className="text-muted">{t("dash.about")}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a className="text-accent hover:underline" href="/swagger-ui/index.html" target="_blank" rel="noreferrer">{t("dash.openSwagger")} ↗</a>
          <Link className="text-accent hover:underline" href="/wiki">{t("nav.wiki")} →</Link>
        </div>
      </div>
    </div>
  );
}
