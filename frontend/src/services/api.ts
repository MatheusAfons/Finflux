import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001",
});

export interface Lancamento {
  id: number;
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa";
  categoria: string | null;
  data: string | null;
}

export async function buscarLancamentos(): Promise<Lancamento[]> {
  const res = await api.get<Lancamento[]>("/lancamentos");
  return res.data;
}