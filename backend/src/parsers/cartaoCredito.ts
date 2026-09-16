import { parse } from "csv-parse/sync";
import type { LancamentoNormalizado } from "./receitas";

function parseValor(valorTexto: string): number | null {
  const limpo = valorTexto.replace("R$", "").trim();
  if (limpo === "-" || limpo === "") return null;
  return Number(limpo.replace(/\./g, "").replace(",", "."));
}

export function parseCartaoCredito(csvText: string): LancamentoNormalizado[] {
  const linhas = csvText.split(/\r?\n/);
  const csvSemTitulo = linhas.slice(2).join("\n");

  const registros = parse(csvSemTitulo, {
    columns: true,
    skip_empty_lines: true,
  });

  const resultado: LancamentoNormalizado[] = [];

  for (const r of registros as any[]) {
    const compra = r["Compra"]?.trim();
    const valorTexto = r["Valor"]?.trim();
    const valor = valorTexto ? parseValor(valorTexto) : null;

    if (!compra || valor === null) continue;

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