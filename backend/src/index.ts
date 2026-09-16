import express from 'express';
import db from './db';
import multer from "multer";
import { parseReceitas } from "./parsers/receitas";
import { parseGastosFixos } from "./parsers/gastosFixos";
import { parseCartaoCredito } from "./parsers/cartaoCredito";
import { parseDividas } from "./parsers/dividas";



const app = express();
const upload = multer({ storage: multer.memoryStorage() });
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

app.post("/importar/receitas", upload.single("arquivo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: "Nenhum arquivo enviado" });
  }

  const csvText = req.file.buffer.toString("utf-8");
  const lancamentos = parseReceitas(csvText);

  const stmt = db.prepare(
    "INSERT INTO lancamentos (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)"
  );
  const inserirTodos = db.transaction((items: typeof lancamentos) => {
    for (const item of items) {
      stmt.run(item.descricao, item.valor, item.tipo, item.categoria, item.data);
    }
  });
  inserirTodos(lancamentos);

  res.json({ importados: lancamentos.length });
});

app.post("/importar/gastos-fixos", upload.single("arquivo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: "Nenhum arquivo enviado" });
  }

  const csvText = req.file.buffer.toString("utf-8");
  const lancamentos = parseGastosFixos(csvText);

  const stmt = db.prepare(
    "INSERT INTO lancamentos (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)"
  );
  const inserirTodos = db.transaction((items: typeof lancamentos) => {
    for (const item of items) {
      stmt.run(item.descricao, item.valor, item.tipo, item.categoria, item.data);
    }
  });
  inserirTodos(lancamentos);

  res.json({ importados: lancamentos.length });
});

app.post("/importar/cartao-credito", upload.single("arquivo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: "Nenhum arquivo enviado" });
  }

  const csvText = req.file.buffer.toString("utf-8");
  const lancamentos = parseCartaoCredito(csvText);

  const stmt = db.prepare(
    "INSERT INTO lancamentos (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)"
  );
  const inserirTodos = db.transaction((items: typeof lancamentos) => {
    for (const item of items) {
      stmt.run(item.descricao, item.valor, item.tipo, item.categoria, item.data);
    }
  });
  inserirTodos(lancamentos);

  res.json({ importados: lancamentos.length });
});

app.post("/importar/dividas", upload.single("arquivo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: "Nenhum arquivo enviado" });
  }

  const csvText = req.file.buffer.toString("utf-8");
  const lancamentos = parseDividas(csvText);

  const stmt = db.prepare(
    "INSERT INTO lancamentos (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)"
  );
  const inserirTodos = db.transaction((items: typeof lancamentos) => {
    for (const item of items) {
      stmt.run(item.descricao, item.valor, item.tipo, item.categoria, item.data);
    }
  });
  inserirTodos(lancamentos);

  res.json({ importados: lancamentos.length });
});

app.get("/lancamentos", (req, res) => {
  const rows = db.prepare("SELECT * FROM lancamentos").all();
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.delete("/lancamentos", (req, res) => {
  db.prepare("DELETE FROM lancamentos").run();
  res.json({ ok: true });
});

//Invoke-RestMethod -Uri http://localhost:3001/lancamentos -Method Delete//

