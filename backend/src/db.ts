import Database from 'better-sqlite3';

const db = new Database("finflux.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS lancamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    valor REAL NOT NULL,
    tipo TEXT NOT NULL,
    categoria TEXT,
    data TEXT
  )
`);

export default db;