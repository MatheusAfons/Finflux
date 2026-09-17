"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAssinaturas = parseAssinaturas;
const sync_1 = require("csv-parse/sync");
function parseValor(valorTexto) {
    const limpo = valorTexto.replace("R$", "").trim();
    if (limpo === "-" || limpo === "")
        return null;
    return Number(limpo.replace(/\./g, "").replace(",", "."));
}
function parseAssinaturas(csvText) {
    const linhas = csvText.split(/\r?\n/);
    const csvSemTitulo = linhas.slice(2).join("\n");
    const registros = (0, sync_1.parse)(csvSemTitulo, {
        columns: true,
        skip_empty_lines: true,
    });
    const resultado = [];
    for (const r of registros) {
        const servico = r["Serviço"]?.trim();
        const valorTexto = r["Valor"]?.trim();
        const valor = valorTexto ? parseValor(valorTexto) : null;
        if (!servico || valor === null)
            continue;
        resultado.push({
            descricao: servico,
            valor,
            tipo: "despesa",
            categoria: "Assinatura",
            data: r["Vencimento"] || null,
        });
    }
    return resultado;
}
//# sourceMappingURL=assinaturas.js.map