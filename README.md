# Todo List PWA

[![CodeQL](https://github.com/umer2001/todo-list-pwa/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/umer2001/todo-list-pwa/actions/workflows/codeql-analysis.yml)

An installable, offline-capable task manager with nested subtasks, priorities, comments, scheduled reminders, and switchable themes, built with React, Netlify Functions, and Neon PostgreSQL.

## The problem

Standard web todo apps break when a mobile or desktop browser goes offline, and flat checklists do not represent multi-step work that needs nested subtasks, priority levels, notes, and reminders. This project solves that by combining a Workbox-backed Progressive Web App with a per-user PostgreSQL backend so tasks remain readable offline, mutations queue for background sync, and nested task hierarchies stay consistent on the server.

## Why it matters

Anyone managing daily tasks across phone and desktop browsers can install the app from the browser, keep reading and editing tasks during network outages, and have changes sync once connectivity returns. As a portfolio project, it demonstrates offline failover with Workbox caching and background sync, automated serverless deployment on Netlify ([netlify.toml](netlify.toml)), and containerized static hosting with Docker and Nginx ([Dockerfile](Dockerfile), [nginx.conf](nginx/nginx.conf)).

## How it works

```mermaid
flowchart LR
    UI["React + Material UI Client\n(src/)"] --> SW["Workbox Service Worker\n(src/service-worker.js)"]
    SW -->|NetworkFirst + BroadcastUpdate| Cache["Browser Cache Storage"]
    SW -->|Offline POST/PUT/DELETE| Queue["Workbox Background Sync Queue"]
    SW -->|/.netlify/functions/*\nx-auth-token JWT| API["Netlify Functions\n(functions/)"]
    Queue -->|Replay when online| API
    API -->|@neondatabase/serverless| DB["Neon PostgreSQL\n(users, todos tables)"]
```

### Key decisions

- **Chose Neon serverless PostgreSQL over FaunaDB** after FaunaDB was shut down (migrated in commit `0ccd665`), moving to standard SQL with self-referencing `ON DELETE CASCADE` foreign keys for nested subtasks and native `TEXT[]` columns for comments and reminders ([schema](db/schema.sql), [todo queries](functions/utils/todoQueries.js)).
- **Chose Netlify Functions over a dedicated Node.js server** to keep maintenance and hosting costs low: all 8 API endpoints deploy alongside the static React bundle with routing in [netlify.toml](netlify.toml) and no always-on server to manage ([functions](functions/)).
- **Chose Workbox `NetworkFirst` caching and a Background Sync `Queue` over online-only `fetch` calls** so users can read cached tasks offline and queue `POST`, `PUT`, and `DELETE` requests to replay when the connection returns ([service worker](src/service-worker.js)).
- **Chose a self-referencing `todos.parent_uid` foreign key with `ON DELETE CASCADE` over separate subtask tables** so tasks can nest to arbitrary depth in one table and deleting a parent removes all descendants in a single query ([schema](db/schema.sql), [deleteTodo](functions/deleteTodo.js)).
- **Chose React Context + `useReducer` over Redux** because the app's state is simple enough to handle optimistic UI updates, undo toasts, and `window.history.pushState` drawer navigation without external state-management boilerplate ([GlobalContext](src/Context/GlobalContext.js), [AppReducer](src/Context/AppReducer.js)).

### Tech stack

JavaScript, React 17, Material UI v4, React Router v6, Workbox, Node.js 20, Netlify Functions, PostgreSQL (Neon), JSON Web Tokens (JWT), bcrypt, Docker, Nginx.

### Tests

- **Backend unit tests** (`npm run test:functions`): 15 tests in [tests/functions.test.js](tests/functions.test.js) using the Node.js built-in test runner (`node --test`). Covers SQL statement splitting in [db/migrate.js](db/migrate.js), input normalization helpers in [functions/utils/db.js](functions/utils/db.js), JWT verification in [functions/utils/decode.js](functions/utils/decode.js), all 8 Netlify Functions with mocked query modules, and SQL query behavior (`createSubTodo` single-statement execution and `COALESCE` preservation in `updateTodo`).
- **Live database end-to-end test** (`npm run test:neon`): [scripts/test-neon-e2e.js](scripts/test-neon-e2e.js) runs migrations and exercises all 8 Netlify Functions against a live Neon PostgreSQL instance, including case-insensitive signup/login, nested subtasks, cross-user authorization rejection, reminder removal, and recursive cascade deletion, then deletes the test users.
- **Frontend tests** (`npm test`): [src/App.test.js](src/App.test.js) currently contains only the default Create React App placeholder test; real component and reducer tests are not written yet.

### CI

[.github/workflows/codeql-analysis.yml](.github/workflows/codeql-analysis.yml) runs GitHub CodeQL static security analysis for JavaScript on every push to `master` and pull request targeting `master` or `main`.

## Live demo

https://umer2001-todo-pwa.netlify.app/

## How to run it

### Prerequisites

- Node.js 20+ (pinned to `20` in [netlify.toml](netlify.toml); `node --test` requires Node.js 18+)
- npm
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`) to run the React client and Netlify Functions together locally
- A [Neon](https://neon.tech) PostgreSQL database (pooled connection string)
- Optional: Docker, to build the static frontend Nginx image defined in [Dockerfile](Dockerfile) and [nginx/nginx.conf](nginx/nginx.conf)

### Install

```bash
git clone https://github.com/umer2001/todo-list-pwa.git
cd todo-list-pwa
npm install
```

### Environment variables

Copy [.env.example](.env.example) to `.env` and fill in your values (also configure them in Netlify site settings for deployment):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL connection string used by [db/migrate.js](db/migrate.js) and [functions/utils/db.js](functions/utils/db.js) |
| `JWT_SECRET` | Secret string used to sign and verify JWTs in [functions/auth.js](functions/auth.js), [functions/signup.js](functions/signup.js), and [functions/utils/decode.js](functions/utils/decode.js) |
| `REACT_APP_ENVIRONMENT` | `development` or `production`; enables `use-reducer-logger` in development ([GlobalContext](src/Context/GlobalContext.js)) |
| `REACT_APP_MODE` | `normal` or `guest`; `guest` pre-fills the sign-in form ([SignIn](src/Pages/SignIn.js)) |
| `REACT_APP_GUEST_EMAIL` | Guest account email; required only when `REACT_APP_MODE=guest` ([SignIn](src/Pages/SignIn.js), [seedGuest](db/seedGuest.js)) |
| `REACT_APP_GUEST_PASSWORD` | Guest account password; required only when `REACT_APP_MODE=guest` ([SignIn](src/Pages/SignIn.js), [seedGuest](db/seedGuest.js)) |
| `GUEST_NAME` | Optional display name for the seeded guest user; defaults to `Guest` ([seedGuest](db/seedGuest.js)) |

### Run

```bash
# 1. Apply the idempotent PostgreSQL schema
npm run db:migrate

# 2. (Optional) Seed the guest account when REACT_APP_MODE=guest
npm run db:seed-guest

# 3. Start the React app and Netlify Functions locally
netlify dev
```

Other available scripts in [package.json](package.json):

```bash
npm start               # Frontend only (without Netlify Functions)
npm run build           # Production React build
npm run test:functions  # Backend unit tests (no database required)
npm run test:neon       # Live end-to-end test against DATABASE_URL
```

To test the 8 serverless endpoints manually, import [Todo pwa.postman_collection.json](Todo%20pwa.postman_collection.json) into Postman (`url` defaults to `http://localhost:8888`, and `signup`/`auth` automatically populate `x-auth-token`).

## What's next

- **Authenticate `updateRemindersList` and add JWT expiration**: [functions/updateRemindersList.js](functions/updateRemindersList.js) currently does not verify `x-auth-token` or task ownership, and tokens issued in [functions/auth.js](functions/auth.js) and [functions/signup.js](functions/signup.js) do not set an expiration (`expiresIn`).
- **Add frontend tests**: Replace the boilerplate [src/App.test.js](src/App.test.js) with React Testing Library coverage for auth flows, reducer state transitions, and task drawers.
- **Run tests and builds in CI and update workflow actions**: Add a GitHub Actions job that runs `npm run test:functions` and `npm run build`, and upgrade the deprecated `actions/checkout@v2` and `github/codeql-action/*@v1` actions in [.github/workflows/codeql-analysis.yml](.github/workflows/codeql-analysis.yml).
- **Update the Docker base image**: Bump [Dockerfile](Dockerfile) from `node:14.17-alpine3.11` to Node.js 20 to match [netlify.toml](netlify.toml) and `react-scripts` 5.0.1.
- **Add a reminder fallback for non-Chromium browsers**: Scheduled notifications in [src/Context/helperFunctions.js](src/Context/helperFunctions.js) rely on the experimental Notification Triggers API (`TimestampTrigger`).

## License

[MIT](LICENSE)
