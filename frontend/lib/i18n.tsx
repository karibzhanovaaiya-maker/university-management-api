"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "ru" | "kk";
export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "kk", label: "KK" },
];

type Dict = Record<string, string | string[]>;

const en: Dict = {
  appName: "University Management",
  "nav.welcome": "Welcome",
  "nav.home": "Home",
  "nav.courses": "Courses",
  "nav.teachers": "Teachers",
  "nav.students": "Students",
  "nav.users": "Users",
  "nav.wiki": "How it works",
  logout: "Log out",
  role: "Role",
  adminOnly: "some sections are ADMIN-only.",

  "auth.signInTitle": "Sign in",
  "auth.signInSub": "Sign in to your account",
  "auth.username": "Username",
  "auth.password": "Password",
  "auth.signIn": "Sign in",
  "auth.signingIn": "Signing in…",
  "auth.noAccount": "No account?",
  "auth.createOne": "Create one",
  "auth.registerTitle": "Create account",
  "auth.registerSub": "Register a new user",
  "auth.email": "Email",
  "auth.create": "Create account",
  "auth.creating": "Creating…",
  "auth.haveAccount": "Already have an account?",
  "auth.loginFailed": "Login failed",
  "auth.regFailed": "Registration failed",

  "welcome.tag": "University Management API",
  "welcome.title": "A full university management system",
  "welcome.subtitle":
    "Students, teachers, courses and users — with secure JWT login, a REST API and live documentation.",
  "welcome.login": "Sign in",
  "welcome.register": "Create account",
  "welcome.swagger": "Open Swagger (API docs)",
  "welcome.wiki": "How it works",
  "welcome.f1t": "Secure auth",
  "welcome.f1d": "JWT login with role-based access (ADMIN / user).",
  "welcome.f2t": "Full REST API",
  "welcome.f2d": "CRUD for courses, teachers, students and users.",
  "welcome.f3t": "Live docs",
  "welcome.f3d": "Interactive Swagger / OpenAPI you can try in the browser.",

  "dash.welcome": "Welcome",
  "dash.aboutTitle": "About this app",
  "dash.about":
    "Mobile-first client for the University Management API. Login stores a JWT bearer token. Full docs are in Swagger.",
  "dash.openSwagger": "Open Swagger",

  "common.add": "Add",
  "common.loading": "Loading…",
  "common.delete": "Delete",
  "common.none": "Nothing here yet.",
  "f.courseName": "Course name",
  "f.credits": "Credits",
  "f.maxStudents": "Max students",
  "f.teacherId": "Teacher id (optional)",
  "f.teacherName": "Teacher name",
  "f.studentName": "Student name",
  "f.group": "Group",
  "f.age": "Age",
  "f.linkedUserId": "Linked user id",
  "f.email": "Email",
  "f.password": "Password",
  "f.roleField": "Role",
  "btn.addCourse": "Add course",
  "btn.addTeacher": "Add teacher",
  "btn.addStudent": "Add student",
  "btn.addUser": "Add user",
  "u.courses": "course(s)",
  "u.noTeacher": "no teacher",
  "u.max": "max",

  "wiki.title": "How it works",
  "wiki.role": "Student · IITU",
  "wiki.stack": "Technology stack",
  "wiki.archTitle": "Architecture — what happens on a request",
  "wiki.flow": [
    "Your browser opens the site over HTTPS.",
    "A reverse proxy (nginx) terminates TLS and decides where the request goes.",
    "Page requests are served as static files (the frontend). API requests (/api, /auth) go to the Java backend.",
    "The Java app reads/writes the PostgreSQL database and returns JSON.",
  ],
  "wiki.backendTitle": "The Java backend (how it runs)",
  "wiki.backendText":
    "The backend is a Spring Boot application compiled by Maven into one executable .jar file. On the server it runs continuously as a background service: it starts automatically when the server boots and restarts itself if it ever crashes. It listens on an internal port (8080) and is never exposed directly — only the reverse proxy can reach it.",
  "wiki.dbTitle": "Database (PostgreSQL)",
  "wiki.dbText":
    "Data lives in a PostgreSQL database on the same server, reachable only from the machine itself (not from the internet). The application talks to it with Spring Data JPA / Hibernate, which maps Java objects to tables (users, students, teachers, courses).",
  "wiki.authTitle": "Authentication (JWT)",
  "wiki.authText":
    "Logging in returns a signed JWT token. The browser stores it and sends it as a Bearer header on every request. The server verifies the signature and the user's role before allowing access — admin-only endpoints reject normal users.",
  "wiki.backupTitle": "Backup & recovery",
  "wiki.backupText":
    "The database is backed up with a full SQL dump (pg_dump). Restoring is loading that dump back. The source code is versioned in Git/GitHub, so the whole system can be rebuilt from scratch at any time.",
  "wiki.deployTitle": "Deploying an update",
  "wiki.deploy": [
    "Push the new code to GitHub.",
    "On the server: pull the latest code.",
    "Rebuild (Maven for the API, a static build for the UI).",
    "Restart the background service — done, no downtime for the other apps.",
  ],
  "wiki.swaggerTitle": "Live API documentation",
  "wiki.swaggerText":
    "Every endpoint is documented in Swagger / OpenAPI. You can authorize with a token and try requests directly in the browser.",
  "wiki.openSwagger": "Open the real Swagger UI",
};

const ru: Dict = {
  appName: "Управление университетом",
  "nav.welcome": "Главная",
  "nav.home": "Обзор",
  "nav.courses": "Курсы",
  "nav.teachers": "Преподаватели",
  "nav.students": "Студенты",
  "nav.users": "Пользователи",
  "nav.wiki": "Как это работает",
  logout: "Выйти",
  role: "Роль",
  adminOnly: "некоторые разделы только для ADMIN.",

  "auth.signInTitle": "Вход",
  "auth.signInSub": "Войдите в свой аккаунт",
  "auth.username": "Имя пользователя",
  "auth.password": "Пароль",
  "auth.signIn": "Войти",
  "auth.signingIn": "Вход…",
  "auth.noAccount": "Нет аккаунта?",
  "auth.createOne": "Создать",
  "auth.registerTitle": "Регистрация",
  "auth.registerSub": "Создать нового пользователя",
  "auth.email": "Эл. почта",
  "auth.create": "Создать аккаунт",
  "auth.creating": "Создание…",
  "auth.haveAccount": "Уже есть аккаунт?",
  "auth.loginFailed": "Ошибка входа",
  "auth.regFailed": "Ошибка регистрации",

  "welcome.tag": "API управления университетом",
  "welcome.title": "Полная система управления университетом",
  "welcome.subtitle":
    "Студенты, преподаватели, курсы и пользователи — с безопасным входом по JWT, REST API и живой документацией.",
  "welcome.login": "Войти",
  "welcome.register": "Создать аккаунт",
  "welcome.swagger": "Открыть Swagger (документация API)",
  "welcome.wiki": "Как это работает",
  "welcome.f1t": "Безопасный вход",
  "welcome.f1d": "Вход по JWT с ролями (ADMIN / пользователь).",
  "welcome.f2t": "Полный REST API",
  "welcome.f2d": "CRUD для курсов, преподавателей, студентов и пользователей.",
  "welcome.f3t": "Живая документация",
  "welcome.f3d": "Интерактивный Swagger / OpenAPI прямо в браузере.",

  "dash.welcome": "Добро пожаловать",
  "dash.aboutTitle": "О приложении",
  "dash.about":
    "Мобильный клиент для API управления университетом. При входе сохраняется JWT-токен. Полная документация — в Swagger.",
  "dash.openSwagger": "Открыть Swagger",

  "common.add": "Добавить",
  "common.loading": "Загрузка…",
  "common.delete": "Удалить",
  "common.none": "Здесь пока пусто.",
  "f.courseName": "Название курса",
  "f.credits": "Кредиты",
  "f.maxStudents": "Макс. студентов",
  "f.teacherId": "ID преподавателя (необязательно)",
  "f.teacherName": "Имя преподавателя",
  "f.studentName": "Имя студента",
  "f.group": "Группа",
  "f.age": "Возраст",
  "f.linkedUserId": "ID пользователя",
  "f.email": "Эл. почта",
  "f.password": "Пароль",
  "f.roleField": "Роль",
  "btn.addCourse": "Добавить курс",
  "btn.addTeacher": "Добавить преподавателя",
  "btn.addStudent": "Добавить студента",
  "btn.addUser": "Добавить пользователя",
  "u.courses": "курс(ов)",
  "u.noTeacher": "без преподавателя",
  "u.max": "макс.",

  "wiki.title": "Как это работает",
  "wiki.role": "Студент · IITU",
  "wiki.stack": "Технологический стек",
  "wiki.archTitle": "Архитектура — что происходит при запросе",
  "wiki.flow": [
    "Браузер открывает сайт по HTTPS.",
    "Обратный прокси (nginx) завершает TLS и решает, куда направить запрос.",
    "Запросы страниц отдаются как статические файлы (фронтенд). Запросы API (/api, /auth) идут на Java-бэкенд.",
    "Java-приложение читает/пишет базу PostgreSQL и возвращает JSON.",
  ],
  "wiki.backendTitle": "Java-бэкенд (как он работает)",
  "wiki.backendText":
    "Бэкенд — это приложение Spring Boot, собранное Maven в один исполняемый .jar. На сервере оно работает постоянно как фоновая служба: запускается автоматически при загрузке сервера и перезапускается при сбое. Слушает внутренний порт (8080) и напрямую не доступно из интернета — только через обратный прокси.",
  "wiki.dbTitle": "База данных (PostgreSQL)",
  "wiki.dbText":
    "Данные хранятся в PostgreSQL на том же сервере и доступны только локально (не из интернета). Приложение работает с ней через Spring Data JPA / Hibernate, которая сопоставляет Java-объекты с таблицами (пользователи, студенты, преподаватели, курсы).",
  "wiki.authTitle": "Аутентификация (JWT)",
  "wiki.authText":
    "При входе выдаётся подписанный JWT-токен. Браузер хранит его и отправляет в заголовке Bearer при каждом запросе. Сервер проверяет подпись и роль пользователя — эндпоинты только для админа отклоняют обычных пользователей.",
  "wiki.backupTitle": "Резервное копирование и восстановление",
  "wiki.backupText":
    "База копируется полным SQL-дампом (pg_dump). Восстановление — это загрузка дампа обратно. Исходный код хранится в Git/GitHub, поэтому всю систему можно пересобрать с нуля в любой момент.",
  "wiki.deployTitle": "Развёртывание обновления",
  "wiki.deploy": [
    "Отправить новый код в GitHub.",
    "На сервере: получить последнюю версию кода.",
    "Пересобрать (Maven для API, статическая сборка для UI).",
    "Перезапустить фоновую службу — готово, без простоя других приложений.",
  ],
  "wiki.swaggerTitle": "Живая документация API",
  "wiki.swaggerText":
    "Каждый эндпоинт описан в Swagger / OpenAPI. Можно авторизоваться с токеном и выполнять запросы прямо в браузере.",
  "wiki.openSwagger": "Открыть настоящий Swagger UI",
};

const kk: Dict = {
  appName: "Университетті басқару",
  "nav.welcome": "Басты бет",
  "nav.home": "Шолу",
  "nav.courses": "Курстар",
  "nav.teachers": "Оқытушылар",
  "nav.students": "Студенттер",
  "nav.users": "Қолданушылар",
  "nav.wiki": "Қалай жұмыс істейді",
  logout: "Шығу",
  role: "Рөл",
  adminOnly: "кейбір бөлімдер тек ADMIN үшін.",

  "auth.signInTitle": "Кіру",
  "auth.signInSub": "Аккаунтыңызға кіріңіз",
  "auth.username": "Пайдаланушы аты",
  "auth.password": "Құпиясөз",
  "auth.signIn": "Кіру",
  "auth.signingIn": "Кіру…",
  "auth.noAccount": "Аккаунт жоқ па?",
  "auth.createOne": "Тіркелу",
  "auth.registerTitle": "Тіркелу",
  "auth.registerSub": "Жаңа қолданушы тіркеу",
  "auth.email": "Эл. пошта",
  "auth.create": "Аккаунт құру",
  "auth.creating": "Құрылуда…",
  "auth.haveAccount": "Аккаунтыңыз бар ма?",
  "auth.loginFailed": "Кіру қатесі",
  "auth.regFailed": "Тіркелу қатесі",

  "welcome.tag": "Университетті басқару API",
  "welcome.title": "Толық университетті басқару жүйесі",
  "welcome.subtitle":
    "Студенттер, оқытушылар, курстар мен қолданушылар — қауіпсіз JWT кірумен, REST API және тірі құжаттамамен.",
  "welcome.login": "Кіру",
  "welcome.register": "Аккаунт құру",
  "welcome.swagger": "Swagger ашу (API құжаттамасы)",
  "welcome.wiki": "Қалай жұмыс істейді",
  "welcome.f1t": "Қауіпсіз кіру",
  "welcome.f1d": "Рөлдермен JWT кіру (ADMIN / қолданушы).",
  "welcome.f2t": "Толық REST API",
  "welcome.f2d": "Курстар, оқытушылар, студенттер мен қолданушыларға CRUD.",
  "welcome.f3t": "Тірі құжаттама",
  "welcome.f3d": "Браузерде сынауға болатын интерактивті Swagger / OpenAPI.",

  "dash.welcome": "Қош келдіңіз",
  "dash.aboutTitle": "Қолданба туралы",
  "dash.about":
    "Университетті басқару API-ге арналған мобильді клиент. Кіргенде JWT токені сақталады. Толық құжаттама Swagger-де.",
  "dash.openSwagger": "Swagger ашу",

  "common.add": "Қосу",
  "common.loading": "Жүктелуде…",
  "common.delete": "Жою",
  "common.none": "Әзірге бос.",
  "f.courseName": "Курс атауы",
  "f.credits": "Кредиттер",
  "f.maxStudents": "Макс. студент",
  "f.teacherId": "Оқытушы id (міндетті емес)",
  "f.teacherName": "Оқытушы аты",
  "f.studentName": "Студент аты",
  "f.group": "Топ",
  "f.age": "Жасы",
  "f.linkedUserId": "Қолданушы id",
  "f.email": "Эл. пошта",
  "f.password": "Құпиясөз",
  "f.roleField": "Рөл",
  "btn.addCourse": "Курс қосу",
  "btn.addTeacher": "Оқытушы қосу",
  "btn.addStudent": "Студент қосу",
  "btn.addUser": "Қолданушы қосу",
  "u.courses": "курс",
  "u.noTeacher": "оқытушысыз",
  "u.max": "макс.",

  "wiki.title": "Қалай жұмыс істейді",
  "wiki.role": "Студент · IITU",
  "wiki.stack": "Технологиялық стек",
  "wiki.archTitle": "Архитектура — сұраныс кезінде не болады",
  "wiki.flow": [
    "Браузер сайтты HTTPS арқылы ашады.",
    "Кері прокси (nginx) TLS-ті аяқтап, сұранысты қайда жіберуді шешеді.",
    "Бет сұраныстары статикалық файлдар ретінде беріледі (фронтенд). API сұраныстары (/api, /auth) Java бэкендке барады.",
    "Java қолданбасы PostgreSQL дерекқорын оқиды/жазады және JSON қайтарады.",
  ],
  "wiki.backendTitle": "Java бэкенд (қалай жұмыс істейді)",
  "wiki.backendText":
    "Бэкенд — Maven арқылы бір орындалатын .jar файлға жиналған Spring Boot қолданбасы. Серверде ол үздіксіз фондық қызмет ретінде жұмыс істейді: сервер қосылғанда автоматты түрде іске қосылады және ақаулық болса өзін қайта қосады. Ішкі портты (8080) тыңдайды және интернеттен тікелей қолжетімді емес — тек кері прокси арқылы.",
  "wiki.dbTitle": "Дерекқор (PostgreSQL)",
  "wiki.dbText":
    "Деректер сол сервердегі PostgreSQL дерекқорында сақталады және тек жергілікті қолжетімді (интернеттен емес). Қолданба онымен Spring Data JPA / Hibernate арқылы жұмыс істейді — ол Java нысандарын кестелерге (қолданушылар, студенттер, оқытушылар, курстар) салыстырады.",
  "wiki.authTitle": "Аутентификация (JWT)",
  "wiki.authText":
    "Кіргенде қол қойылған JWT токені беріледі. Браузер оны сақтап, әр сұраныста Bearer тақырыбында жібереді. Сервер қолтаңба мен рөлді тексереді — тек админге арналған эндпоинттер қарапайым қолданушыларды қабылдамайды.",
  "wiki.backupTitle": "Сақтық көшірме және қалпына келтіру",
  "wiki.backupText":
    "Дерекқор толық SQL дампымен (pg_dump) көшіріледі. Қалпына келтіру — сол дампты қайта жүктеу. Бастапқы код Git/GitHub-та сақталады, сондықтан бүкіл жүйені кез келген уақытта нөлден қайта құруға болады.",
  "wiki.deployTitle": "Жаңартуды орналастыру",
  "wiki.deploy": [
    "Жаңа кодты GitHub-қа жіберу.",
    "Серверде: соңғы кодты алу.",
    "Қайта жинау (API үшін Maven, UI үшін статикалық жинақ).",
    "Фондық қызметті қайта қосу — дайын, басқа қолданбалар тоқтамайды.",
  ],
  "wiki.swaggerTitle": "Тірі API құжаттамасы",
  "wiki.swaggerText":
    "Әр эндпоинт Swagger / OpenAPI-да құжатталған. Токенмен авторизацияланып, сұраныстарды браузерде тікелей сынауға болады.",
  "wiki.openSwagger": "Нағыз Swagger UI ашу",
};

const DICTS: Record<Lang, Dict> = { en, ru, kk };

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  tArr: (key: string) => string[];
};

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("uni_lang") as Lang | null;
    if (saved && DICTS[saved]) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("uni_lang", l);
  };

  const t = (key: string) => {
    const v = DICTS[lang][key] ?? en[key] ?? key;
    return Array.isArray(v) ? v.join(" ") : v;
  };
  const tArr = (key: string) => {
    const v = DICTS[lang][key] ?? en[key];
    return Array.isArray(v) ? v : [];
  };

  return <Ctx.Provider value={{ lang, setLang, t, tArr }}>{children}</Ctx.Provider>;
}

export function useT() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useT must be used within I18nProvider");
  return c;
}
