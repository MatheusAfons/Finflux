import express from 'express';
import db from './db';

const app = express();
app.use(express.json());
const PORT = 3001;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/lancamentos", (req, res) => {
  const { descricao, valor, tipo, categoria, data } = req.body;
  const stmt = db.prepare(`
    INSERT INTO lancamentos (descricao, valor, tipo, categoria, data)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(descricao, valor, tipo, categoria, data);
  res.json({ id: info.lastInsertRowid });
});

app.get("/lancamentos", (req, res) => {
  const rows = db.prepare("SELECT * FROM lancamentos").all();
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

