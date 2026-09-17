import type { Lancamento } from "../services/api";

interface Props {
  lancamentos: Lancamento[];
}

export function ListaLancamentos({ lancamentos }: Props) {
  return (
    <div className="bg-neutral-900 rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">Lançamentos</h2>
      <div className="flex flex-col gap-2">
        {lancamentos.map((l) => (
          <div
            key={l.id}
            className="flex items-center justify-between border-b border-neutral-800 py-2"
          >
            <div>
              <p className="font-medium">{l.descricao}</p>
              <p className="text-sm text-neutral-400">
                {l.categoria || "Sem categoria"} {l.data ? `· ${l.data}` : ""}
              </p>
            </div>
            <p
              className={
                l.tipo === "receita"
                  ? "text-green-400 font-semibold"
                  : "text-red-400 font-semibold"
              }
            >
              {l.tipo === "receita" ? "+" : "-"} R$ {l.valor.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}