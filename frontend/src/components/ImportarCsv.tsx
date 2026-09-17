import { useState } from "react";
import { importarCsv } from "../services/api";

interface Props {
  aoImportar: () => void;
}

export function ImportarCsv({ aoImportar }: Props) {
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setCarregando(true);
    setMensagem(null);

    try {
      const resultado = await importarCsv(arquivo);
      setMensagem(`Importado: ${resultado.importados} lançamentos (${resultado.tipoDetectado})`);
      aoImportar();
    } catch {
      setMensagem("Erro ao importar arquivo");
    } finally {
      setCarregando(false);
      e.target.value = "";
    }
  }

  return (
    <div className="bg-neutral-900 rounded-xl p-4">
      <label className="cursor-pointer inline-block bg-lime-400 text-black font-semibold px-4 py-2 rounded-lg">
        {carregando ? "Importando..." : "Importar CSV"}
        <input type="file" accept=".csv" className="hidden" onChange={handleChange} disabled={carregando} />
      </label>
      {mensagem && <p className="text-sm text-neutral-400 mt-2">{mensagem}</p>}
    </div>
  );
}