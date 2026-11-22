# Todo List (PWA)

## Demo

https://umer2001-todo-pwa.netlify.app/

## Features

- Cross platform (PWA)
- Offline Capabilities (PWA)
- User Auth (JWT + bcrypt)
- Nested Sub-tasks, Comments, Priorities, and Reminders
- Different Themes
- Neon PostgreSQL backend with Netlify Functions
- Dockerized
- Android feel

## Environment Variables

Copy `.env.example` to `.env` (and configure the same variables in your Netlify site settings):

- `DATABASE_URL` — Neon PostgreSQL connection string (from Neon Console -> Connection Details)
- `JWT_SECRET` — Secret string used to sign JWT tokens
- `REACT_APP_ENVIRONMENT` — `development` or `production`
- `REACT_APP_MODE` — `guest` or `normal`

If you set `REACT_APP_MODE=guest`, also set:

- `REACT_APP_GUEST_EMAIL` — Email address for the guest account
- `REACT_APP_GUEST_PASSWORD` — Password for the guest account

## Database Setup (Neon)

1. Create a project in [Neon](https://neon.tech) and copy its pooled connection string into `DATABASE_URL` in `.env`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the idempotent database schema migration:
   ```bash
   npm run db:migrate
   ```
4. (Optional) If using `REACT_APP_MODE=guest`, seed the guest account:
   ```bash
   npm run db:seed-guest
   ```
5. (Optional) Run the live Neon end-to-end verification suite:
   ```bash
   npm run test:neon
   ```
6. Start the local dev server (React + Netlify Functions):
   ```bash
   netlify dev
   ```
