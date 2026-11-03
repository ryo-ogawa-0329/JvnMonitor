import Database from 'better-sqlite3';

export const db = new Database(process.env.DATABASE_PATH ?? "db/jvn.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS jvn(
    ID VARCHAR(100) PRIMARY KEY,
    TITLE VARCHAR(200) NOT NULL,
    URL VARCHAR(300) NOT NULL,
    ISSUED TEXT
  )
`);
