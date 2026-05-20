"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { Controls } from "@/components/Controls";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { me, ready, logout } = useAuth();
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !me) router.replace("/login");
  }, [ready, me, router]);

  if (!ready || !me) {
    return <div className="grid min-h-screen place-items-center text-muted">{t("common.loading")}</div>;
  }

  const NAV = [
    { href: "/dashboard", label: t("nav.home"), icon: "🏠" },
    { href: "/dashboard/courses", label: t("nav.courses"), icon: "📚" },
    { href: "/dashboard/teachers", label: t("nav.teachers"), icon: "🧑‍🏫" },
    { href: "/dashboard/students", label: t("nav.students"), icon: "🎓" },
    { href: "/dashboard/users", label: t("nav.users"), icon: "👥" },
  ];
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-60">
      {/* Sidebar (desktop) */}
      <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col border-r border-line bg-card p-4 md:flex">
        <div className="px-2 py-3 text-lg font-bold">🎓 University</div>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive(n.href) ? "bg-accent/15 text-accent" : "text-fg hover:bg-fg/5"
              }`}>
              <span>{n.icon}</span> {n.label}
            </Link>
          ))}
          <Link href="/wiki" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fg hover:bg-fg/5">
            <span>📖</span> {t("nav.wiki")}
          </Link>
        </nav>
        <div className="space-y-2 border-t border-line pt-3">
          <Controls />
          <div className="px-1 text-sm text-fg">{me.userName} <span className="chip ml-1">{me.role}</span></div>
          <button onClick={logout} className="btn-ghost w-full text-sm">{t("logout")}</button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-line bg-card/90 px-4 py-3 backdrop-blur md:hidden">
        <span className="font-bold">🎓 University</span>
        <div className="flex items-center gap-2">
          <Controls />
          <button onClick={logout} className="text-sm text-muted">{t("logout")}</button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4 md:p-8">{children}</main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 grid grid-cols-5 border-t border-line bg-card md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${
              isActive(n.href) ? "text-accent" : "text-muted"
            }`}>
            <span className="text-lg">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
