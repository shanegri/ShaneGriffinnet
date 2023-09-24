CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY,
  filename TEXT NOT NULL UNIQUE,
  subject TEXT,
  location TEXT,
  time_frame TEXT,
  display_order INTEGER
);
