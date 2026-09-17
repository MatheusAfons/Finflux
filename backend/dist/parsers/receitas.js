"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReceitas = parseReceitas;
const sync_1 = require("csv-parse/sync");
function parseValor(valorTexto) {
    return Number(valorTexto
        .replace("R$", "")
        .trim()
        .replace(/\./g, "")
        .replace(",", "."));
}
function parseReceitas(csvText) {
    const linhas = csvText.split(/\r?\n/);
    const csvSemTitulo = linhas.slice(2).join("\n");
    const registros = (0, sync_1.parse)(csvSemTitulo, {
        columns: true,
        skip_empty_lines: true,
    });
    return registros
        .filter((r) => r["Descrição"] && r["Valor"])
        .map((r) => ({
        descricao: r["Descrição"],
        valor: parseValor(r["Valor"]),
        tipo: "receita",
        categoria: r["Banco"] || null,
        data: r["Data"] || null,
    }));
}
//# sourceMappingURL=receitas.js.map