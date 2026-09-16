import { parse } from "csv-parse/sync";
import type { LancamentoNormalizado } from "./receitas";

function parseValor(valorTexto: string): number | null {
  const limpo = valorTexto.replace("R$", "").trim();
  if (limpo === "-" || limpo === "") return null;
  return Number(limpo.replace(/\./g, "").replace(",", "."));
}

export function parseGastosFixos(csvText: string): LancamentoNormalizado[] {
  const linhas = csvText.split(/\r?\n/);
  const csvSemTitulo = linhas.slice(2).join("\n");

  const registros = parse(csvSemTitulo, {
    columns: true,
    skip_empty_lines: true,
  });

  const resultado: LancamentoNormalizado[] = [];
  let categoriaAtual: string | null = null;

  for (const r of registros as any[]) {
    const categoria = r["Categoria"]?.trim();
    const formaPagamento = r["Forma de Pagamento"]?.trim();
    const valorTexto = r["Valor"]?.trim();

    const ehGrupo = categoria && !formaPagamento && !valorTexto;
    if (ehGrupo) {
      categoriaAtual = categoria;
      continue;
    }

    const valor = valorTexto ? parseValor(valorTexto) : null;
    if (!categoria || valor === null) continue;

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