import { parse } from "csv-parse/sync";
import type { LancamentoNormalizado } from "./receitas";

function parseValor(valorTexto: string): number | null {
  const limpo = valorTexto.replace("R$", "").trim();
  if (limpo === "-" || limpo === "") return null;
  return Number(limpo.replace(/\./g, "").replace(",", "."));
}

export function parseAReceber(csvText: string): LancamentoNormalizado[] {
  const registros = parse(csvText, {
    columns: false,
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as string[][];

  const resultado: LancamentoNormalizado[] = [];
  let descricaoAtual: string | null = null;

  for (const linha of registros) {
    const [descricaoCol, parcelaValor, , qtdParcela, data, status] = linha;

    if (descricaoCol) descricaoAtual = descricaoCol;

    const valor = parcelaValor ? parseValor(parcelaValor) : null;
    if (!descricaoAtual || valor === null) continue;

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