import { parse } from "csv-parse/sync";

export interface LancamentoNormalizado {
  descricao: string;
  valor: number;
  tipo: string;
  categoria: string | null;
  data: string | null;
}

function parseValor(valorTexto: string): number {
  return Number(
    valorTexto
      .replace("R$", "")
      .trim()
      .replace(/\./g, "")
      .replace(",", ".")
  );
}

export function parseReceitas(csvText: string): LancamentoNormalizado[] {
  const linhas = csvText.split(/\r?\n/);
  const csvSemTitulo = linhas.slice(2).join("\n");

  const registros = parse(csvSemTitulo, {
    columns: true,
    skip_empty_lines: true,
  });

  return registros
    .filter((r: any) => r["Descrição"] && r["Valor"])
    .map((r: any) => ({
      descricao: r["Descrição"],
      valor: parseValor(r["Valor"]),
      tipo: "receita",
      categoria: r["Banco"] || null,
      data: r["Data"] || null,
    }));
}