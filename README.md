# University Management Application

A Spring Boot REST API that implements all ten lab works for the course, in one
runnable project.

**Stack:** Spring Boot 3.5 · Java 17 · Spring Data JPA · Spring Security · JWT ·
Thymeleaf · PostgreSQL · Lombok · JUnit 5 + Mockito · springdoc OpenAPI

> Built with AI assistance (allowed by the course if disclosed). The author understands
> and can reproduce every part — see the lab map below.

## Live

- **App (UI):** https://karibzhanova.alma-ai.cc
- **API docs (Swagger):** https://karibzhanova.alma-ai.cc/swagger-ui/index.html

Single origin: nginx serves the static Next.js frontend at `/` and routes
`/api`, `/auth`, `/swagger-ui` to the Spring Boot API — so there is no CORS and no
separate public port. Runs as a `systemd` service on NixOS behind Cloudflare.

## Frontend (`frontend/`)

Mobile-first **Next.js + TypeScript + Tailwind** client, exported as static files.
Registration/login store a JWT bearer token; the dashboard lists and creates courses,
teachers, students and users via the API.

```bash
cd frontend
pnpm install
pnpm dev            # local dev (proxies /api,/auth to localhost:8080)
pnpm run build:static   # production static export -> ./out
```

---

## Quick start (local)

```bash
# 1. toolchain (NixOS) — JDK 17 + Maven
nix-shell              # uses shell.nix; or: nix profile install nixpkgs#jdk17 nixpkgs#maven

# 2. database
createdb university_db                       # PostgreSQL must be running

# 3. run
mvn spring-boot:run
```

- App: <http://localhost:8080>
- Swagger UI: <http://localhost:8080/swagger-ui.html>
- A default ADMIN is seeded on first start: **admin / admin123** (change it).

```bash
# get a token, then call a protected endpoint
curl -s -X POST localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"userName":"admin","password":"admin123"}'
```

## Tests

```bash
mvn test
```

Unit tests (JUnit 5 + Mockito) run against in-memory H2 — no real database needed.

---

## Lab map

Each lab is a real, working slice of this codebase.

| Lab | Topic | Key files |
|----|-------|-----------|
| 1 | Controllers, GET, MVC vs REST | `controller/HelloController.java`, `controller/HomeController.java`, `templates/index.html` |
| 2 | CRUD + Spring Data JPA | `entity/User.java`, `repository/UsersRepository.java`, `service/UserService.java` |
| 3 | Related entities (1:1, 1:N, M:N) | `entity/Student.java`, `entity/Teacher.java`, `entity/Course.java` |
| 4 | DTOs + validation | `dto/StudentFormDto.java`, `validation/UserFormValidator.java` |
| 5 | Global exception handling | `exception/GlobalExceptionHandler.java`, `exception/BusinessException.java`, `exception/ErrorResponse.java` |
| 6 | Filter / sort / paginate | `spec/CourseSpecification.java`, `service/CourseService.java`, `service/UserService.java` |
| 7 | JWT + Spring Security | `security/JwtUtil.java`, `security/JwtFilter.java`, `config/SecurityConfig.java`, `controller/AuthController.java` |
| 8 | File upload (multipart) | `service/FileStorageService.java`, `controller/FileController.java`, `entity/UserFile.java` |
| 9 | Unit testing | `src/test/java/kz/iitu/hello/**` |
| 10 | API docs (Swagger/OpenAPI) | `config/OpenApiConfig.java` + `@Tag`/`@Operation` on controllers |

A clickable study guide with theory answers and the live-coding drills is kept
locally (`roadmap.html`) and intentionally not committed.

---

## API overview

| Method | Path | Access |
|--------|------|--------|
| `POST` | `/auth/register`, `/auth/login` | public |
| `GET` | `/hello/{name}?lang=` | public |
| `GET` | `/api/courses` | any authenticated user |
| `*` | `/api/courses/**` (write/search) | ADMIN |
| `*` | `/api/users/**`, `/api/students/**`, `/api/teachers/**` | ADMIN |
| `POST` | `/api/files/{userId}/avatar` | any authenticated user |

## Configuration

Key properties (`src/main/resources/application.properties`):

| Property | Meaning |
|----------|---------|
| `spring.datasource.*` | PostgreSQL connection |
| `app.jwt.secret` / `app.jwt.expiration-ms` | JWT signing key + TTL (override `app.jwt.secret` via `APP_JWT_SECRET`) |
| `spring.servlet.multipart.max-file-size` | upload limit |
| `app.seed.admin.*` | initial admin account |

## Project layout

```
src/main/java/kz/iitu/hello/
  controller/   REST + MVC controllers
  service/      business logic
  repository/   Spring Data JPA repositories
  entity/       JPA entities
  dto/          request/response DTOs + search forms
  spec/         JPA Specifications (dynamic queries)
  validation/   custom validators
  security/     JWT util + filter + user details
  config/       security, OpenAPI, data seeding
  exception/    global handler + custom exceptions
```
