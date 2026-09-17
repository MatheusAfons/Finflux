"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const multer_1 = __importDefault(require("multer"));
const receitas_1 = require("./parsers/receitas");
const gastosFixos_1 = require("./parsers/gastosFixos");
const cartaoCredito_1 = require("./parsers/cartaoCredito");
const dividas_1 = require("./parsers/dividas");
const assinaturas_1 = require("./parsers/assinaturas");
const aReceber_1 = require("./parsers/aReceber");
const detectar_1 = require("./parsers/detectar");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
app.use(express_1.default.json());
const PORT = 3001;
const parsersPorTipo = {
    "receitas": receitas_1.parseReceitas,
    "gastos-fixos": gastosFixos_1.parseGastosFixos,
    "cartao-credito": cartaoCredito_1.parseCartaoCredito,
    "dividas": dividas_1.parseDividas,
    "assinaturas": assinaturas_1.parseAssinaturas,
    "a-receber": aReceber_1.parseAReceber,
};
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
app.post("/importar", upload.single("arquivo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ erro: "Nenhum arquivo enviado" });
    }
    const csvText = req.file.buffer.toString("utf-8");
    const tipo = (0, detectar_1.detectarTipo)(csvText);
    if (!tipo) {
        return res.status(400).json({ erro: "Não foi possível identificar o tipo de planilha" });
    }
    const parser = parsersPorTipo[tipo];
    if (!parser) {
        return res.status(400).json({ erro: "Parser não encontrado para esse tipo" });
    }
    const lancamentos = parser(csvText);
    const stmt = db_1.default.prepare("INSERT INTO lancamentos (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)");
    const inserirTodos = db_1.default.transaction((items) => {
        for (const item of items) {
            stmt.run(item.descricao, item.valor, item.tipo, item.categoria, item.data);
        }
    });
    inserirTodos(lancamentos);
    res.json({ tipoDetectado: tipo, importados: lancamentos.length });
});
app.post("/lancamentos", (req, res) => {
    const { descricao, valor, tipo, categoria, data } = req.body;
    const stmt = db_1.default.prepare(`
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
    const lancamentos = (0, receitas_1.parseReceitas)(csvText);
    const stmt = db_1.default.prepare("INSERT INTO lancamentos (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)");
    const inserirTodos = db_1.default.transaction((items) => {
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
    const lancamentos = (0, gastosFixos_1.parseGastosFixos)(csvText);
    const stmt = db_1.default.prepare("INSERT INTO lancamentos (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)");
    const inserirTodos = db_1.default.transaction((items) => {
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
    const lancamentos = (0, cartaoCredito_1.parseCartaoCredito)(csvText);
    const stmt = db_1.default.prepare("INSERT INTO lancamentos (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)");
    const inserirTodos = db_1.default.transaction((items) => {
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
    const lancamentos = (0, dividas_1.parseDividas)(csvText);
    const stmt = db_1.default.prepare("INSERT INTO lancamentos (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)");
    const inserirTodos = db_1.default.transaction((items) => {
        for (const item of items) {
            stmt.run(item.descricao, item.valor, item.tipo, item.categoria, item.data);
        }
    });
    inserirTodos(lancamentos);
    res.json({ importados: lancamentos.length });
});
app.post("/importar/assinaturas", upload.single("arquivo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ erro: "Nenhum arquivo enviado" });
    }
    const csvText = req.file.buffer.toString("utf-8");
    const lancamentos = (0, assinaturas_1.parseAssinaturas)(csvText);
    const stmt = db_1.default.prepare("INSERT INTO lancamentos (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)");
    const inserirTodos = db_1.default.transaction((items) => {
        for (const item of items) {
            stmt.run(item.descricao, item.valor, item.tipo, item.categoria, item.data);
        }
    });
    inserirTodos(lancamentos);
    res.json({ importados: lancamentos.length });
});
app.post("/importar/a-receber", upload.single("arquivo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ erro: "Nenhum arquivo enviado" });
    }
    const csvText = req.file.buffer.toString("utf-8");
    const lancamentos = (0, aReceber_1.parseAReceber)(csvText);
    const stmt = db_1.default.prepare("INSERT INTO lancamentos (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)");
    const inserirTodos = db_1.default.transaction((items) => {
        for (const item of items) {
            stmt.run(item.descricao, item.valor, item.tipo, item.categoria, item.data);
        }
    });
    inserirTodos(lancamentos);
    res.json({ importados: lancamentos.length });
});
app.get("/lancamentos", (req, res) => {
    const rows = db_1.default.prepare("SELECT * FROM lancamentos").all();
    res.json(rows);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.use((req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend/dist/index.html"));
});
app.delete("/lancamentos", (req, res) => {
    db_1.default.prepare("DELETE FROM lancamentos").run();
    res.json({ ok: true });
});
//Invoke-RestMethod -Uri http://localhost:3001/lancamentos -Method Delete//
//# sourceMappingURL=index.js.map