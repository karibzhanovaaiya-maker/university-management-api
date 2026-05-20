"use client";

import { useT, Lang } from "@/lib/i18n";

type Help = { lab: string } & Record<Lang, string>;

const HELP: Record<string, Help> = {
  courses: {
    lab: "Labs 2 · 3 · 6",
    en: "Create, list and search courses. Shows JPA CRUD (Lab 2), the Course→Teacher relation (Lab 3) and paginated search (Lab 6).",
    ru: "Создание, список и поиск курсов. Демонстрирует CRUD на JPA (Лаб 2), связь Курс→Преподаватель (Лаб 3) и поиск с пагинацией (Лаб 6).",
    kk: "Курстарды құру, тізімдеу және іздеу. JPA CRUD (Лаб 2), Курс→Оқытушы байланысы (Лаб 3) және беттелген іздеу (Лаб 6) көрсетеді.",
  },
  teachers: {
    lab: "Labs 3 · 5 · 9",
    en: "Manage teachers. A teacher has many courses (Lab 3). Deleting a teacher who still has courses is blocked with HTTP 409 (Labs 5 & 9).",
    ru: "Преподаватели. У преподавателя много курсов (Лаб 3). Удаление преподавателя с курсами блокируется кодом 409 (Лаб 5 и 9).",
    kk: "Оқытушылар. Оқытушының көп курсы бар (Лаб 3). Курсы бар оқытушыны жою 409 кодымен бұғатталады (Лаб 5 және 9).",
  },
  students: {
    lab: "Labs 3 · 4",
    en: "Each student is linked to an existing user (one-to-one, Lab 3) — pick the user from the list. Inputs are validated (Lab 4).",
    ru: "Каждый студент связан с существующим пользователем (один-к-одному, Лаб 3) — выберите пользователя из списка. Поля валидируются (Лаб 4).",
    kk: "Әр студент бар қолданушымен байланысты (бір-бірге, Лаб 3) — қолданушыны тізімнен таңдаңыз. Өрістер тексеріледі (Лаб 4).",
  },
  users: {
    lab: "Labs 2 · 4 · 6",
    en: "Manage users with roles. CRUD (Lab 2), validation incl. unique username (Lab 4) and paginated search (Lab 6).",
    ru: "Пользователи с ролями. CRUD (Лаб 2), валидация и уникальный логин (Лаб 4), поиск с пагинацией (Лаб 6).",
    kk: "Рөлдері бар қолданушылар. CRUD (Лаб 2), валидация және бірегей логин (Лаб 4), беттелген іздеу (Лаб 6).",
  },
};

export function PageHelp({ k }: { k: string }) {
  const { lang } = useT();
  const h = HELP[k];
  if (!h) return null;
  return (
    <div className="card p-4 text-sm">
      <div className="mb-1 flex items-center gap-2">
        <span className="chip border-accent/50 text-accent">{h.lab}</span>
        <a className="text-accent hover:underline" href="/swagger-ui/index.html" target="_blank" rel="noreferrer">
          Swagger ↗
        </a>
      </div>
      <p className="text-muted">{h[lang]}</p>
    </div>
  );
}
