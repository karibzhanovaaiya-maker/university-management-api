"use client";

import { useT } from "@/lib/i18n";
import { PublicShell } from "@/components/PublicShell";

const STACK = [
  "Spring Boot 3.5", "Java 17", "Spring Data JPA", "Hibernate", "Spring Security",
  "JWT", "PostgreSQL", "Maven", "JUnit 5", "Mockito", "Swagger / OpenAPI",
  "Next.js", "TypeScript", "Tailwind", "nginx", "Cloudflare",
];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <div className="text-sm text-muted">{children}</div>
    </div>
  );
}

export default function WikiPage() {
  const { t, tArr } = useT();

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl">

      {/* Profile */}
      <section className="card flex items-center gap-4 p-5">
        <img src="/profile.jpg" alt="Aiya Karibzhanova"
          className="h-16 w-16 shrink-0 rounded-full border border-line object-cover" />
        <div>
          <h1 className="text-xl font-bold">Aiya Karibzhanova</h1>
          <p className="text-sm text-muted">{t("wiki.role")}</p>
        </div>
      </section>

      <h1 className="mt-8 mb-4 text-2xl font-bold">{t("wiki.title")}</h1>

      {/* Stack */}
      <section className="card mb-5 p-5">
        <h2 className="mb-3 text-lg font-semibold">{t("wiki.stack")}</h2>
        <div className="flex flex-wrap gap-2">
          {STACK.map((s) => <span key={s} className="chip">{s}</span>)}
        </div>
      </section>

      {/* Architecture flow */}
      <section className="card mb-5 p-5">
        <h2 className="mb-3 text-lg font-semibold">{t("wiki.archTitle")}</h2>
        <div className="mb-4 overflow-x-auto rounded-xl bg-bg p-4 text-center text-xs text-fg">
          <code>Browser → Cloudflare (HTTPS) → nginx ─┬─ &quot;/&quot; → Next.js (static UI)</code><br />
          <code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ &quot;/api&quot; → Java :8080 → PostgreSQL</code>
        </div>
        <ol className="ml-5 list-decimal space-y-1 text-sm text-muted">
          {tArr("wiki.flow").map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card title={t("wiki.backendTitle")}>{t("wiki.backendText")}</Card>
        <Card title={t("wiki.dbTitle")}>{t("wiki.dbText")}</Card>
        <Card title={t("wiki.authTitle")}>{t("wiki.authText")}</Card>
        <Card title={t("wiki.backupTitle")}>
          {t("wiki.backupText")}
          <pre className="mt-2 overflow-x-auto rounded-lg bg-bg p-3 text-xs text-fg">{`pg_dump university_db > backup.sql   # backup
psql university_db < backup.sql      # restore`}</pre>
        </Card>
      </div>

      <section className="card mt-5 p-5">
        <h2 className="mb-2 text-lg font-semibold">{t("wiki.deployTitle")}</h2>
        <ol className="ml-5 list-decimal space-y-1 text-sm text-muted">
          {tArr("wiki.deploy").map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </section>

      <section className="card mt-5 flex flex-col items-start gap-3 p-5">
        <h2 className="text-lg font-semibold">{t("wiki.swaggerTitle")}</h2>
        <p className="text-sm text-muted">{t("wiki.swaggerText")}</p>
        <a href="/swagger-ui/index.html" target="_blank" rel="noreferrer" className="btn-primary">
          {t("wiki.openSwagger")} ↗
        </a>
      </section>
      </div>
    </PublicShell>
  );
}
