"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { Controls } from "./Controls";

type Item = { href: string; label: string; icon: string; ext?: boolean };

export function PublicShell({ children }: { children: React.ReactNode }) {
  const { t } = useT();
  const { theme } = useTheme();
  const { me } = useAuth();
  const path = usePathname();
  const logo = theme === "dark" ? "/iitu-dark.png" : "/iitu-light.png";

  const items: Item[] = [
    { href: "/", label: t("nav.welcome"), icon: "🏠" },
    { href: "/about", label: "Aiya", icon: "👤" },
    { href: "/wiki", label: t("nav.wiki"), icon: "📖" },
    { href: "/uml.html", label: "Docs (UML)", icon: "🧩", ext: true },
    { href: "/swagger-ui/index.html", label: "Swagger", icon: "🔌", ext: true },
  ];
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  const NavLink = ({ n, mobile }: { n: Item; mobile?: boolean }) => {
    const cls = mobile
      ? `flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${active(n.href) && !n.ext ? "text-accent" : "text-muted"}`
      : `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active(n.href) && !n.ext ? "bg-accent/15 text-accent" : "text-fg hover:bg-fg/5"}`;
    const inner = mobile ? <><span className="text-lg">{n.icon}</span>{n.label}</> : <><span>{n.icon}</span> {n.label}{n.ext ? " ↗" : ""}</>;
    return n.ext
      ? <a href={n.href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
      : <Link href={n.href} className={cls}>{inner}</Link>;
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-60">
      {/* Sidebar (desktop) */}
      <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col border-r border-line bg-card p-4 md:flex">
        <Link href="/" className="px-2 py-2"><img src={logo} alt="IITU" className="h-8 w-auto" /></Link>
        <nav className="mt-3 flex flex-1 flex-col gap-1">
          {items.map((n) => <NavLink key={n.href} n={n} />)}
        </nav>
        <div className="space-y-2 border-t border-line pt-3">
          <Controls />
          <Link href={me ? "/dashboard" : "/login"} className="btn-primary w-full text-sm">
            {me ? t("nav.home") : t("welcome.login")}
          </Link>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-card/90 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/"><img src={logo} alt="IITU" className="h-7 w-auto" /></Link>
        <div className="flex items-center gap-2">
          <Controls />
          <Link href={me ? "/dashboard" : "/login"} className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white">
            {me ? t("nav.home") : t("welcome.login")}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4 md:p-8">{children}</main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 grid grid-cols-5 border-t border-line bg-card md:hidden">
        {items.map((n) => <NavLink key={n.href} n={n} mobile />)}
      </nav>
    </div>
  );
}
