"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { PublicShell } from "@/components/PublicShell";

const BIO = {
  en: "Computer science student at IITU. Built this University Management system end-to-end — a Spring Boot REST API, PostgreSQL database, JWT security, and this Next.js interface.",
  ru: "Студентка IITU. Полностью разработала эту систему управления университетом — REST API на Spring Boot, базу данных PostgreSQL, безопасность JWT и этот интерфейс на Next.js.",
  kk: "IITU студенті. Осы университетті басқару жүйесін толық жасады — Spring Boot REST API, PostgreSQL дерекқоры, JWT қауіпсіздігі және осы Next.js интерфейсі.",
};

const STACK = ["Spring Boot", "Java 17", "PostgreSQL", "JWT", "Next.js", "TypeScript", "Tailwind"];

export default function AboutPage() {
  const { t, lang } = useT();

  return (
    <PublicShell>
      <div className="mx-auto max-w-2xl">
        <section className="card overflow-hidden">
          <div className="flex flex-col items-center gap-4 p-7 text-center sm:flex-row sm:text-left">
            <img src="/profile.jpg" alt="Aiya Karibzhanova"
              className="h-32 w-32 shrink-0 rounded-2xl border border-line object-cover" />
            <div>
              <h1 className="text-2xl font-bold">Aiya Karibzhanova</h1>
              <p className="mt-1"><span className="chip border-accent/40 text-accent">{t("wiki.role")}</span></p>
              <p className="mt-3 text-sm text-muted">{BIO[lang]}</p>
            </div>
          </div>
        </section>

        <section className="card mt-5 p-5">
          <h2 className="mb-3 text-sm font-semibold text-muted">{t("wiki.stack")}</h2>
          <div className="flex flex-wrap gap-2">
            {STACK.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
        </section>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/dashboard" className="btn-primary">{t("nav.home")} →</Link>
          <Link href="/wiki" className="btn-ghost">{t("nav.wiki")}</Link>
          <a href="https://github.com/karibzhanovaaiya-maker/university-management-api" target="_blank" rel="noreferrer" className="btn-ghost">GitHub ↗</a>
        </div>
      </div>
    </PublicShell>
  );
}
