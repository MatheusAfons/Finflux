import { useEffect, useState } from "react";
import { buscarLancamentos, type Lancamento } from "./services/api";
import { ImportarCsv } from "./components/ImportarCsv";
import { ListaLancamentos } from "./components/ListaLancamentos";
import { EvolucaoSaldo } from "./components/EvolucaoSaldo";

function App() {

  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarLancamentos()
      .then(setLancamentos)
      .finally(() => setCarregando(false));
  }, []);

  function recarregar() {
    setCarregando(true);
    buscarLancamentos()
      .then(setLancamentos)
      .finally(() => setCarregando(false));
  }

  const receitas = lancamentos
    .filter((l) => l.tipo === "receita")
    .reduce((soma, l) => soma + l.valor, 0);

  const despesas = lancamentos
    .filter((l) => l.tipo === "despesa")
    .reduce((soma, l) => soma + l.valor, 0);

  const saldo = receitas - despesas;

  if (carregando) {
    return <div className="p-8 text-white">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Seu dinheiro, em movimento</h1>

      <div className="mb-6">
        <ImportarCsv aoImportar={recarregar} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-neutral-900 rounded-xl p-4">
          <p className="text-sm text-neutral-400">Saldo atual</p>
          <p className="text-2xl font-bold">R$ {saldo.toFixed(2)}</p>
        </div>
        <div className="bg-neutral-900 rounded-xl p-4">
          <p className="text-sm text-neutral-400">Receitas</p>
          <p className="text-2xl font-bold text-green-400">R$ {receitas.toFixed(2)}</p>
        </div>
        <div className="bg-neutral-900 rounded-xl p-4">
          <p className="text-sm text-neutral-400">Despesas</p>
          <p className="text-2xl font-bold text-red-400">R$ {despesas.toFixed(2)}</p>
        </div>

        <div className="mt-6">
          <ListaLancamentos lancamentos={lancamentos} />
        </div>
        <div className="mt-6">
          <EvolucaoSaldo lancamentos={lancamentos} />
        </div>
      </div>
    </div>
  );
}

export default App;