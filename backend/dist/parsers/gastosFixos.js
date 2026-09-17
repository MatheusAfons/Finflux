"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGastosFixos = parseGastosFixos;
const sync_1 = require("csv-parse/sync");
function parseValor(valorTexto) {
    const limpo = valorTexto.replace("R$", "").trim();
    if (limpo === "-" || limpo === "")
        return null;
    return Number(limpo.replace(/\./g, "").replace(",", "."));
}
function parseGastosFixos(csvText) {
    const linhas = csvText.split(/\r?\n/);
    const csvSemTitulo = linhas.slice(2).join("\n");
    const registros = (0, sync_1.parse)(csvSemTitulo, {
        columns: true,
        skip_empty_lines: true,
    });
    const resultado = [];
    let categoriaAtual = null;
    for (const r of registros) {
        const categoria = r["Categoria"]?.trim();
        const formaPagamento = r["Forma de Pagamento"]?.trim();
        const valorTexto = r["Valor"]?.trim();
        const ehGrupo = categoria && !formaPagamento && !valorTexto;
        if (ehGrupo) {
            categoriaAtual = categoria;
            continue;
        }
        const valor = valorTexto ? parseValor(valorTexto) : null;
        if (!categoria || valor === null)
            continue;
        resultado.push({
            descricao: categoria,
            valor,
            tipo: "despesa",
            categoria: categoriaAtual,
            data: r["Vencimento"] && r["Vencimento"] !== "-" ? r["Vencimento"] : null,
        });
    }
    return resultado;
}
//# sourceMappingURL=gastosFixos.js.map