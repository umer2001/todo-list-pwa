-- PostgreSQL schema for Todo List PWA (Neon)
-- Idempotent: safe to run multiple times via `npm run db:migrate` or Neon SQL Editor.

DO $$
BEGIN
  CREATE TYPE todo_priority AS ENUM ('P1', 'P2', 'P3', 'P4');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower
  ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS todos (
  id BIGSERIAL PRIMARY KEY,
  uid TEXT NOT NULL UNIQUE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_uid TEXT REFERENCES todos(uid) ON DELETE CASCADE,
  todo TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status BOOLEAN NOT NULL DEFAULT FALSE,
  date TEXT NOT NULL,
  priority todo_priority NOT NULL DEFAULT 'P4',
  comments TEXT[] NOT NULL DEFAULT '{}',
  reminders TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_todos_user_id
  ON todos (user_id);

CREATE INDEX IF NOT EXISTS idx_todos_parent_uid
  ON todos (parent_uid);

