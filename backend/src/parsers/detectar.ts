export type TipoPlanilha =
  | "receitas"
  | "gastos-fixos"
  | "cartao-credito"
  | "dividas"
  | "assinaturas"
  | "a-receber";

export function detectarTipo(csvText: string): TipoPlanilha | null {
  const texto = csvText.replace(/"/g, "");

  if (texto.includes("Descrição,Data,Banco,Valor")) return "receitas";
  if (texto.includes("Categoria,Forma de Pagamento,Vencimento,Valor,Status")) return "gastos-fixos";
  if (texto.includes("Compra,Cartão,Loja,Vencimento,Parcelas,Valor,Status")) return "cartao-credito";
  if (texto.includes("Dívida,Parcela,Vencimento,Valor,Pago")) return "dividas";
  if (texto.includes("Serviço,Valor,Vencimento,Renovação")) return "assinaturas";
  if (texto.trim().startsWith(", Parcelas , Valor Final")) return "a-receber";

  return null;
}