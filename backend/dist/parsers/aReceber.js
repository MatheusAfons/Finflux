"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAReceber = parseAReceber;
const sync_1 = require("csv-parse/sync");
function parseValor(valorTexto) {
    const limpo = valorTexto.replace("R$", "").trim();
    if (limpo === "-" || limpo === "")
        return null;
    return Number(limpo.replace(/\./g, "").replace(",", "."));
}
function parseAReceber(csvText) {
    const registros = (0, sync_1.parse)(csvText, {
        columns: false,
        skip_empty_lines: true,
        trim: true,
        from_line: 2,
    });
    const resultado = [];
    let descricaoAtual = null;
    for (const linha of registros) {
        const [descricaoCol, parcelaValor, , qtdParcela, data, status] = linha;
        if (descricaoCol)
            descricaoAtual = descricaoCol;
        const valor = parcelaValor ? parseValor(parcelaValor) : null;
        if (!descricaoAtual || valor === null)
            continue;
        resultado.push({
            descricao: `${descricaoAtual} (${qtdParcela || ""}, ${status || "Falta"})`,
            valor,
            tipo: "receita",
            categoria: "A receber",
            data: data || null,
        });
    }
    return resultado;
}
//# sourceMappingURL=aReceber.js.map