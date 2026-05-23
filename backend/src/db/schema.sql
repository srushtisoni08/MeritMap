-- ── Extensions ────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  name         TEXT        NOT NULL,
  email        TEXT        NOT NULL UNIQUE,
  password     TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- ── Colleges ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS colleges (
  id                 SERIAL PRIMARY KEY,
  name               TEXT           NOT NULL,
  location           TEXT           NOT NULL,
  city               TEXT           NOT NULL,
  state              TEXT           NOT NULL,
  fees_min           INTEGER        NOT NULL DEFAULT 0,
  fees_max           INTEGER        NOT NULL DEFAULT 0,
  rating             NUMERIC(3,1)   NOT NULL DEFAULT 0.0,
  type               TEXT           NOT NULL CHECK (type IN ('Government','Private','Deemed')),
  established        INTEGER,
  placement_percent  NUMERIC(5,2),
  avg_package        INTEGER,
  highest_package    INTEGER,
  image_url          TEXT,
  description        TEXT,
  website            TEXT,
  courses            TEXT[]         NOT NULL DEFAULT '{}',
  created_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_colleges_state          ON colleges (state);
CREATE INDEX IF NOT EXISTS idx_colleges_type           ON colleges (type);
CREATE INDEX IF NOT EXISTS idx_colleges_rating         ON colleges (rating DESC);
CREATE INDEX IF NOT EXISTS idx_colleges_fees_min       ON colleges (fees_min);
CREATE INDEX IF NOT EXISTS idx_colleges_placement      ON colleges (placement_percent DESC);

-- ── Reviews ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id           SERIAL PRIMARY KEY,
  college_id   INTEGER        NOT NULL REFERENCES colleges (id) ON DELETE CASCADE,
  user_id      INTEGER        REFERENCES users (id) ON DELETE SET NULL,
  rating       NUMERIC(3,1)   NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment      TEXT,
  author_name  TEXT,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_college_id ON reviews (college_id);

-- ── Saved Colleges ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_colleges (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER     NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  college_id   INTEGER     NOT NULL REFERENCES colleges (id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, college_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_user_id    ON saved_colleges (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_college_id ON saved_colleges (college_id);