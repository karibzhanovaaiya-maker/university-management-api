"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { TopNav } from "@/components/TopNav";

export default function Welcome() {
  const { me } = useAuth();
  const { t } = useT();

  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-3xl px-5 pb-16">
        <section className="pt-10 text-center sm:pt-16">
          <span className="chip border-accent/40 text-accent">{t("welcome.tag")}</span>
          <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">{t("welcome.title")}</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted">{t("welcome.subtitle")}</p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {me ? (
              <Link href="/dashboard" className="btn-primary">{t("nav.home")} →</Link>
            ) : (
              <>
                <Link href="/login" className="btn-primary">{t("welcome.login")}</Link>
                <Link href="/register" className="btn-ghost">{t("welcome.register")}</Link>
              </>
            )}
            <Link href="/about" className="btn-ghost">👤 Aiya</Link>
            <Link href="/wiki" className="btn-ghost">{t("welcome.wiki")}</Link>
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            ["🔐", t("welcome.f1t"), t("welcome.f1d")],
            ["🧩", t("welcome.f2t"), t("welcome.f2d")],
            ["📖", t("welcome.f3t"), t("welcome.f3d")],
          ].map(([icon, title, desc]) => (
            <div key={title} className="card p-5">
              <div className="text-2xl">{icon}</div>
              <div className="mt-2 font-semibold">{title}</div>
              <p className="mt-1 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </section>

        <footer className="mt-12 text-center text-xs text-muted">
          kz.iitu · Spring Boot · PostgreSQL · Next.js — <code>karibzhanova.alma-ai.cc</code>
        </footer>
      </main>
    </>
  );
}
