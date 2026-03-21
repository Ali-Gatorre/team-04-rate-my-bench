CREATE TABLE IF NOT EXISTS benches (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  caption TEXT NOT NULL,
  image_path TEXT,
  location_name VARCHAR(255),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  author_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bench_votes (
  id SERIAL PRIMARY KEY,
  bench_id INTEGER NOT NULL REFERENCES benches(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (bench_id, author_name)
);
