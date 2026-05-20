"use client";

import Link from "next/link";
import { useT, Lang } from "@/lib/i18n";

type Lab = {
  n: string; title: string; where: string; code: string;
} & Record<Lang, string>;

const LABS: Lab[] = [
  {
    n: "1", title: "Spring Boot · GET · MVC vs REST",
    where: "/hello/{name}?lang= · home page",
    code: "HelloController, HomeController · @GetMapping, @PathVariable, @RequestParam",
    en: "@Controller returns a view name; @RestController writes the value into the body. @GetMapping maps an HTTP GET to a method.",
    ru: "@Controller возвращает имя представления; @RestController пишет значение в тело ответа. @GetMapping связывает GET с методом.",
    kk: "@Controller көрініс атауын қайтарады; @RestController мәнді денеге жазады. @GetMapping GET сұранысын әдіспен байланыстырады.",
  },
  {
    n: "2", title: "CRUD + Spring Data JPA",
    where: "Users page → /api/users",
    code: "User, UsersRepository (JpaRepository), UserService.findById (orElseThrow)",
    en: "@Entity/@Id/@GeneratedValue map a class to a table. JpaRepository gives free CRUD; findById returns Optional.empty() when missing.",
    ru: "@Entity/@Id/@GeneratedValue сопоставляют класс с таблицей. JpaRepository даёт CRUD бесплатно; findById возвращает Optional.empty() при отсутствии.",
    kk: "@Entity/@Id/@GeneratedValue класты кестеге салыстырады. JpaRepository CRUD-ты тегін береді; findById жоқ болса Optional.empty() қайтарады.",
  },
  {
    n: "3", title: "Related entities (1:1, 1:N, M:N)",
    where: "Courses (teacher) · Students (user + courses)",
    code: "Student↔User @OneToOne · Teacher↔Course @OneToMany/@ManyToOne · Student↔Course @ManyToMany",
    en: "Owning side holds the @JoinTable / FK; the inverse uses mappedBy. All associations are LAZY so related rows load only when used.",
    ru: "Владеющая сторона держит @JoinTable / FK; обратная использует mappedBy. Все связи LAZY — связанные строки грузятся только при обращении.",
    kk: "Иеленуші жақ @JoinTable / FK ұстайды; кері жақ mappedBy қолданады. Барлық байланыс LAZY — қажет болғанда ғана жүктеледі.",
  },
  {
    n: "4", title: "DTO + validation",
    where: "Any create form (shows field errors)",
    code: "*FormDto · @NotBlank @Size @Email @Min @Max · @Valid · UserFormValidator",
    en: "@Valid triggers bean validation; failures become 400 with per-field messages. UserFormValidator adds uniqueness using currentId to skip the record itself on update.",
    ru: "@Valid запускает валидацию; ошибки → 400 с сообщениями по полям. UserFormValidator проверяет уникальность, используя currentId, чтобы пропустить саму запись при обновлении.",
    kk: "@Valid валидацияны іске қосады; қателер → 400, өріс бойынша хабарлар. UserFormValidator бірегейлікті тексереді, жаңартқанда жазбаның өзін өткізу үшін currentId қолданады.",
  },
  {
    n: "5", title: "Global exception handling",
    where: "Delete teacher with courses → 409 · bad input → 400",
    code: "GlobalExceptionHandler @RestControllerAdvice · @ExceptionHandler",
    en: "One central advice maps exceptions to a uniform JSON error: 404 not-found, 400 validation, 409 business rule, 401/403 security.",
    ru: "Один центральный advice превращает исключения в единый JSON: 404 — не найдено, 400 — валидация, 409 — бизнес-правило, 401/403 — безопасность.",
    kk: "Бір орталық advice ерекшеліктерді біркелкі JSON-ға айналдырады: 404 — табылмады, 400 — валидация, 409 — бизнес-ереже, 401/403 — қауіпсіздік.",
  },
  {
    n: "6", title: "Filtering · sorting · pagination",
    where: "Course / user search (page, size, sortBy)",
    code: "CourseSpecification.withFilters · JpaSpecificationExecutor · Pageable · sort whitelist",
    en: "Specification builds a dynamic WHERE (empty filters → all rows). Sort fields are whitelisted to prevent injection; results are paged.",
    ru: "Specification строит динамический WHERE (пустые фильтры → все строки). Поля сортировки в белом списке (защита от инъекций); результат постранично.",
    kk: "Specification динамикалық WHERE құрады (бос сүзгілер → барлық жол). Сұрыптау өрістері ақ тізімде (инъекциядан қорғау); нәтиже беттелген.",
  },
  {
    n: "7", title: "Auth & authorization (JWT + Security)",
    where: "Login · the whole secured app",
    code: "JwtUtil, JwtFilter, CustomUserDetailsService, SecurityConfig, AuthController",
    en: "Login returns a signed JWT (subject/iat/exp). JwtFilter validates it per request and sets the principal + role. No token → 401, wrong role → 403.",
    ru: "Логин возвращает подписанный JWT (subject/iat/exp). JwtFilter проверяет его на каждый запрос и ставит пользователя + роль. Нет токена → 401, не та роль → 403.",
    kk: "Кіру қол қойылған JWT қайтарады (subject/iat/exp). JwtFilter оны әр сұраныста тексеріп, пайдаланушы мен рөлді орнатады. Токен жоқ → 401, рөл сәйкес емес → 403.",
  },
  {
    n: "8", title: "File upload API (multipart)",
    where: "POST /api/files/{userId}/avatar",
    code: "FileStorageService, FileController · MultipartFile · @RequestParam(\"file\")",
    en: "Accepts multipart/form-data, validates size & content-type, stores the file, and removes the old avatar only AFTER the new one is safely saved.",
    ru: "Принимает multipart/form-data, проверяет размер и тип, сохраняет файл и удаляет старый аватар только ПОСЛЕ успешного сохранения нового.",
    kk: "multipart/form-data қабылдайды, өлшем мен түрін тексереді, файлды сақтайды және ескі аватарды тек жаңасы сәтті сақталғаннан КЕЙІН жояды.",
  },
  {
    n: "9", title: "Unit testing (JUnit 5 + Mockito)",
    where: "src/test/java/kz/iitu/hello (mvn test → 17 green)",
    code: "@ExtendWith(MockitoExtension) · @Mock · @InjectMocks · assertThatThrownBy",
    en: "Services are tested in isolation by mocking repositories. Example: deleting a teacher with courses must throw BusinessException.",
    ru: "Сервисы тестируются изолированно с мок-репозиториями. Пример: удаление преподавателя с курсами должно бросать BusinessException.",
    kk: "Сервистер репозиторийлерді mock арқылы оқшау тексеріледі. Мысал: курсы бар оқытушыны жою BusinessException лақтыруы керек.",
  },
  {
    n: "10", title: "API documentation (Swagger / OpenAPI)",
    where: "/swagger-ui/index.html",
    code: "OpenApiConfig (OpenAPI bean, Bearer scheme) · @Tag, @Operation, @Parameter",
    en: "@Tag groups a controller, @Operation documents an endpoint. The OpenAPI bean adds the title and a Bearer-JWT 'Authorize' button.",
    ru: "@Tag группирует контроллер, @Operation описывает эндпоинт. Бин OpenAPI добавляет заголовок и кнопку 'Authorize' с Bearer-JWT.",
    kk: "@Tag контроллерді топтайды, @Operation эндпоинтті құжаттайды. OpenAPI бині тақырып пен Bearer-JWT 'Authorize' түймесін қосады.",
  },
];

export default function LabsPage() {
  const { t, lang } = useT();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🎯 {t("nav.wiki")} — Labs 1–10</h1>
        <p className="text-sm text-muted">Which feature belongs to which lab + a quick refresh. Open <Link href="/uml.html" className="text-accent">Docs (UML)</Link> for diagrams.</p>
      </div>

      <div className="grid gap-3">
        {LABS.map((l) => (
          <div key={l.n} className="card p-4">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="chip border-accent/50 text-accent">Lab {l.n}</span>
              <span className="font-semibold">{l.title}</span>
            </div>
            <p className="text-sm text-muted">{l[lang]}</p>
            <div className="mt-2 grid gap-1 text-xs">
              <div><span className="text-muted">📍 in app:</span> {l.where}</div>
              <div><span className="text-muted">🔑 key code:</span> <code className="text-[11px]">{l.code}</code></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
