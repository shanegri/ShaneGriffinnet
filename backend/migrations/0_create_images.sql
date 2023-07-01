CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY,
  path TEXT NOT NULL,
  subject TEXT,
  location TEXT,
  time_frame TEXT,
  display_order INTEGER
);
