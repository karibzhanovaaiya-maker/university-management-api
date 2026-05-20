"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { Controls } from "./Controls";

export function TopNav() {
  const { t } = useT();
  const { theme } = useTheme();
  const { me } = useAuth();
  const path = usePathname();
  const logo = theme === "dark" ? "/iitu-dark.png" : "/iitu-light.png";

  const links = [
    { href: "/", label: t("nav.welcome") },
    { href: "/about", label: "Aiya" },
    { href: "/wiki", label: t("nav.wiki") },
  ];
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2.5">
        <Link href="/" className="shrink-0">
          <img src={logo} alt="IITU" className="h-7 w-auto" />
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition ${
                active(l.href) ? "bg-accent/15 text-accent" : "text-muted hover:bg-fg/5"
              }`}>
              {l.label}
            </Link>
          ))}
          <a href="/swagger-ui/index.html" target="_blank" rel="noreferrer"
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-fg/5">
            Swagger ↗
          </a>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Controls />
          <Link href={me ? "/dashboard" : "/login"}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:brightness-110">
            {me ? t("nav.home") : t("welcome.login")}
          </Link>
        </div>
      </div>
    </header>
  );
}
