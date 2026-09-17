"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCartaoCredito = parseCartaoCredito;
const sync_1 = require("csv-parse/sync");
function parseValor(valorTexto) {
    const limpo = valorTexto.replace("R$", "").trim();
    if (limpo === "-" || limpo === "")
        return null;
    return Number(limpo.replace(/\./g, "").replace(",", "."));
}
function parseCartaoCredito(csvText) {
    const linhas = csvText.split(/\r?\n/);
    const csvSemTitulo = linhas.slice(2).join("\n");
    const registros = (0, sync_1.parse)(csvSemTitulo, {
        columns: true,
        skip_empty_lines: true,
    });
    const resultado = [];
    for (const r of registros) {
        const compra = r["Compra"]?.trim();
        const valorTexto = r["Valor"]?.trim();
        const valor = valorTexto ? parseValor(valorTexto) : null;
        if (!compra || valor === null)
            continue;
        const parcela = r["Parcelas"] ? ` (parcela ${r["Parcelas"]})` : "";
        resultado.push({
            descricao: `${compra}${parcela}`,
            valor,
            tipo: "despesa",
            categoria: r["Cartão"] || null,
            data: r["Vencimento"] || null,
        });
    }
    return resultado;
}
//# sourceMappingURL=cartaoCredito.js.map