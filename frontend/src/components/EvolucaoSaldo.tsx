import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Lancamento } from "../services/api";

interface Props {
  lancamentos: Lancamento[];
}

function paraDataOrdenavel(data: string | null): number {
  if (!data) return 0;
  const partes = data.split("/");
  if (partes.length < 2) return 0;
  const [dia, mes, ano] = partes;
  return new Date(Number(ano) || 2026, Number(mes) - 1, Number(dia)).getTime();
}

export function EvolucaoSaldo({ lancamentos }: Props) {
  const comData = lancamentos
    .filter((l) => l.data && l.data.includes("/"))
    .sort((a, b) => paraDataOrdenavel(a.data) - paraDataOrdenavel(b.data));

  let acumulado = 0;
  const dados = comData.map((l) => {
    acumulado += l.tipo === "receita" ? l.valor : -l.valor;
    return { data: l.data, saldo: Number(acumulado.toFixed(2)) };
  });

  if (dados.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4">Evolução do saldo</h2>
        <p className="text-neutral-400 text-sm">Aguardando lançamentos com data.</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">Evolução do saldo</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={dados}>
          <XAxis dataKey="data" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: "#171717", border: "none" }}
            labelStyle={{ color: "#fff" }}
          />
          <Line type="monotone" dataKey="saldo" stroke="#a3e635" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}