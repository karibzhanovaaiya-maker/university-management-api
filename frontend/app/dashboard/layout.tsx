"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/dashboard/courses", label: "Courses", icon: "📚" },
  { href: "/dashboard/teachers", label: "Teachers", icon: "🧑‍🏫" },
  { href: "/dashboard/students", label: "Students", icon: "🎓" },
  { href: "/dashboard/users", label: "Users", icon: "👥" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { me, ready, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !me) router.replace("/login");
  }, [ready, me, router]);

  if (!ready || !me) {
    return <div className="grid min-h-screen place-items-center text-slate-500">Loading…</div>;
  }

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
                isActive(n.href) ? "bg-accent/15 text-accent" : "text-slate-300 hover:bg-white/5"
              }`}>
              <span>{n.icon}</span> {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line pt-3">
          <div className="px-2 text-sm text-slate-300">{me.userName}</div>
          <div className="px-2 pb-2"><span className="chip">{me.role}</span></div>
          <button onClick={logout} className="btn-ghost w-full text-sm">Log out</button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-card/90 px-4 py-3 backdrop-blur md:hidden">
        <span className="font-bold">🎓 University</span>
        <button onClick={logout} className="text-sm text-slate-400">Log out</button>
      </header>

      <main className="mx-auto max-w-4xl p-4 md:p-8">{children}</main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 grid grid-cols-5 border-t border-line bg-card md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${
              isActive(n.href) ? "text-accent" : "text-slate-400"
            }`}>
            <span className="text-lg">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
