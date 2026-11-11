-- Jalankan sekali di Neon SQL Editor
CREATE TABLE IF NOT EXISTS tugas (
  id SERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  deadline DATE,
  link TEXT,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tugas_created_at_idx ON tugas (created_at DESC);
