"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDividas = parseDividas;
const sync_1 = require("csv-parse/sync");
function parseValor(valorTexto) {
    const limpo = valorTexto.replace("R$", "").trim();
    if (limpo === "-" || limpo === "")
        return null;
    return Number(limpo.replace(/\./g, "").replace(",", "."));
}
function parseDividas(csvText) {
    const linhas = csvText.split(/\r?\n/);
    const csvSemTitulo = linhas.slice(2).join("\n");
    const registros = (0, sync_1.parse)(csvSemTitulo, {
        columns: true,
        skip_empty_lines: true,
    });
    const resultado = [];
    for (const r of registros) {
        const divida = r["Dívida"]?.trim();
        const valorTexto = r["Valor"]?.trim();
        const valor = valorTexto ? parseValor(valorTexto) : null;
        if (!divida || valor === null)
            continue;
        const parcela = r["Parcela"] ? ` (parcela ${r["Parcela"]})` : "";
        resultado.push({
            descricao: `${divida}${parcela}`,
            valor,
            tipo: "despesa",
            categoria: "Dívida",
            data: r["Vencimento"] || null,
        });
    }
    return resultado;
}
//# sourceMappingURL=dividas.js.map