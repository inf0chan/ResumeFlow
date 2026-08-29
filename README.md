# ResumeFlow

> Build, version, share and export your resume — and track every job application that uses it.

ResumeFlow is a full-stack resume builder and job-application tracker. Create
documents from a template gallery, edit them section-by-section, snapshot
versions, publish public share links, log PDF exports, and watch your pipeline
move from **saved** to **offer** on a Kanban board.

Built during a summer internship as a complete, real-world full-stack CRUD
application.

## Badges

| Stack | Deploy |
| --- | --- |
| [![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)](https://angular.dev) [![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org) | [![Vercel](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)](https://vercel.com) |
| [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org) [![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com) | [![Render](https://img.shields.io/badge/deploy-Render-46E3B7?logo=render)](https://render.com) |
| [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org) [![Supabase](https://img.shields.io/badge/hosted-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com) | [![Sequelize](https://img.shields.io/badge/ORM-Sequelize-52B0E7?logo=sequelize&logoColor=white)](https://sequelize.org) |
| [![JWT](https://img.shields.io/badge/auth-JWT-000000?logo=jsonwebtokens)](https://jwt.io) [![bcrypt](https://img.shields.io/badge/passwords-bcrypt-003A70)](https://en.wikipedia.org/wiki/Bcrypt) | [![Postman](https://img.shields.io/badge/tested-Postman-FF6C37?logo=postman&logoColor=white)](https://www.postman.com) |

## Feature highlights

- **Auth with JWT** — register / login, passwords hashed with bcrypt
  (`cost: 10`), 7-day tokens, route-guarded frontend.
- **Document manager** — create, rename, duplicate, search and filter resumes,
  CVs or letters; each one can be tied to a template.
- **Block-based editor** — documents are made of *sections* (Experience,
  Education, ...) that hold ordered *items* (bullet entries).
- **Template gallery** — pick a template or build your own with a name,
  accent color, font, layout and density.
- **Version snapshots** — save a labelled snapshot of a document at any point
  in its life.
- **Public sharing** — generate a revocable link (`/r/<slug>`) that renders
  the document read-only to anyone, no login required.
- **PDF export log** — one click records an export; every event shows up in
  the Exports page and the dashboard counter.
- **Application tracker** — a Kanban board with
  `saved → applied → interview → offer` (plus `rejected`), each card linked to
  the resume used to apply.
- **Live dashboard** — counters for documents, saved versions, exports and the
  application pipeline.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Angular 18 · TypeScript · HTML5 · CSS3 |
| Backend | Node.js · Express 5 · Sequelize ORM |
| Database | PostgreSQL (hosted on Supabase) |
| Auth | JSON Web Tokens (`jsonwebtoken`) · `bcryptjs` |
| Tooling | Git · GitHub · VS Code · Postman |
| Deploy | Vercel (frontend + serverless API) · Render (API) |

## Project layout

```
resumeflow-full/
├── frontend/          Angular 18 app (source)
├── backend/           Express 5 API · serves the built Angular app
│   ├── app.js         Route mounting, static hosting, boot
│   ├── routers/       One file per resource (auth, documents, ...)
│   ├── models/        Sequelize models (user, document, section, item, ...)
│   ├── config/        DB connection config (dev + prod)
│   ├── migrations/    Sequelize migrations
│   └── middleware/    JWT auth guard
├── api/index.js       Vercel serverless entry point
├── render.yaml        Render deploy descriptor
└── vercel.json        Vercel build + rewrite rules
```

## Architecture

```
                 ┌─────────────────────────────────────────────┐
                 │                 Vercel (CDN)                │
                 │  Angular SPA  ──────►  /api/* rewrites      │
                 └───────────────┬─────────────────────────────┘
                                 │ HTTPS
                                 ▼
   ┌────────────────────────────────────────────────────────────┐
   │               Express 5 API  (backend/app.js)              │
   │  auth · documents · sections · items · templates ·         │
   │  versions · shares · exports · applications · users        │
   │                        └  JWT middleware                   │
   └──────────────┬───────────────────────────────▲─────────────┘
                  │                               │
                  ▼                               │
   ┌──────────────────────────────────────────────┴─────────────┐
   │                 PostgreSQL (Supabase)                     │
   │  users · documents · templates · sections · items ·        │
   │  versions · shares · exports · applications                │
   └────────────────────────────────────────────────────────────┘
```

## Getting started locally

### Prerequisites

- Node.js 18+ and npm
- A PostgreSQL database — the project is pre-wired for a free
  [Supabase](https://supabase.com) instance (grab your connection string from
  **Dashboard → Settings → Database** and put it in env vars — there is no
  `CREATE DATABASE` step needed, the default `postgres` db is used).

### 1. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` — the only truly required values are:

```dotenv
JWT_SECRET=<a long random string>
DB_HOST=aws-0-<region>.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.<your-ref>
DB_PASSWORD=<your supabase password>
```

> `backend/config/config.json` already contains working dev/prod credentials if
> you'd rather not use env vars; env vars simply take precedence.

### 2. Install deps and set up the schema

```bash
cd backend
npm install
npx sequelize-cli db:migrate
```

### 3. Build the frontend into the backend

The Express server serves the built Angular app from `backend/public/`.

```bash
cd frontend
npm install
npm run build
cp -r dist/resumeflow-frontend/browser/* ../backend/public/
```

(Angular nests output under `browser/` — if your version differs, check
`frontend/dist/resumeflow-frontend/` after building and adjust the path.)

### 4. Run it

```bash
cd backend
npm start        # runs migrations automatically, then starts the server
```

Open **http://localhost:3000** — sign up and you're in.

### Frontend-only development with live reload

```bash
cd frontend
npm start        # ng serve → http://localhost:4200
```

Angular's dev server doesn't proxy anything by default. To reach `/api` on port
3000 during development, add a `proxy.conf.json` mapping `/api` →
`http://localhost:3000`, or just rebuild into `backend/public/` to test the
full stack together.

### NPM scripts

| Directory | Command | What it does |
| --- | --- | --- |
| `backend/` | `npm start` | `sequelize-cli db:migrate` then boot Express on `:3000` |
| `backend/` | `npm run dev` | Boot with `nodemon` for auto-restart |
| `frontend/` | `npm start` | `ng serve` dev server on `:4200` |
| `frontend/` | `npm run build` | Production build into `dist/` |
| root | `npm run build` | Install + build the frontend (used by CI/cloud) |

## API overview

All routes below sit under `/api` and (except `auth/*` and `public/*`) require
a `Bearer` JWT.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create account, returns token + user |
| `POST` | `/api/auth/login` | Login, returns token + user |
| `GET/POST` | `/api/documents` | List / create documents |
| `GET` | `/api/documents/recent` | Latest documents for the dash |
| `GET/PATCH/DELETE` | `/api/documents/:id` | Read / update / delete |
| `POST` | `/api/documents/:id/duplicate` | Clone a document |
| `GET/POST` | `/api/templates` | List / create templates |
| `GET` | `/api/sections/document/:id` | Sections of a document |
| `POST/PATCH/DELETE` | `/api/sections` | Manage a section |
| `GET` | `/api/items/section/:id` | Items inside a section |
| `POST/PATCH/DELETE` | `/api/items` | Manage an item |
| `GET/POST/DELETE` | `/api/versions` | Save / list / delete snapshots |
| `GET/POST/DELETE` | `/api/shares` | Create / list / revoke share links |
| `GET/POST/DELETE` | `/api/exports` | Record / list / delete PDF exports |
| `GET/POST` | `/api/applications` | List / create applications |
| `GET` | `/api/applications/pipeline` | Per-status counts for the Kanban |
| `GET` | `/api/public/r/:slug` | Public, read-only document view |

## Deployment

### Vercel (frontend + serverless API)

`vercel.json` handles everything: it builds the Angular app, ships the root
`api/index.js` as the serverless backend, and rewrites `/api/*` and SPA routes
so deep links work.

Whatever env vars you set locally (`.env`) must be repeated in the project's
Environment Variables on Vercel — especially `JWT_SECRET` and the `DB_*`
variables.

### Render (API only)

`render.yaml` is a ready-made web-service blueprint: rootDir `backend`,
`npm install` + `npm start`, with `JWT_SECRET` auto-generated and the Supabase
`DB_*` values pre-filled. Point `FRONTEND_URL` at your Vercel app to keep CORS
happy.

## Configuration & secrets

This app calls **no third-party services** — no Stripe, no OpenAI, no email
provider. Every API route is self-contained, so the only real secret is
`JWT_SECRET` in `backend/.env`, used to sign login tokens. Everything else
(`PORT`, `NODE_ENV`, `FRONTEND_URL`, `DB_*`) is plain configuration.

> Keep `backend/.env`, `config/config.json` and anything containing real DB
> passwords out of version control in your own deployments. `render.yaml` here
> is committed intentionally so the template deploys in one click.

## Roadmap / known gaps

- Real PDF rendering — the Export button currently *logs* the export; wire up
  a renderer (e.g. `puppeteer`) to emit an actual file.
- Password reset — `forget-password` / `reset-password` endpoints are stubs,
  waiting for an email provider.
- User profile/photos exist in the schema but aren't surfaced in the UI yet.