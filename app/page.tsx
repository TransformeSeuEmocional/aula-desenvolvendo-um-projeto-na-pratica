"use client";

import { useMemo, useRef, useState } from "react";
import { Calculator, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { FormularioCampanha } from "@/components/FormularioCampanha";
import { GraficoROI } from "@/components/GraficoROI";
import { PainelResultados } from "@/components/PainelResultados";
import { ResumoTextual } from "@/components/ResumoTextual";
import { calcularResultados } from "@/lib/calculos";
import { DadosCampanha } from "@/types";

const DADOS_INICIAIS: DadosCampanha = {
  investimento: 0,
  faturamento: 0,
  ticketMedio: 0,
};

export default function Home() {
  const [dados, setDados] = useState<DadosCampanha>(DADOS_INICIAIS);
  // Muda a cada "Limpar" para forçar o remount do formulário e limpar os campos de texto internos.
  const [resetKey, setResetKey] = useState(0);
  const [exportando, setExportando] = useState(false);
  const areaExportacaoRef = useRef<HTMLDivElement>(null);
  const resultados = useMemo(() => calcularResultados(dados), [dados]);

  function limparCampos() {
    setDados(DADOS_INICIAIS);
    setResetKey((v) => v + 1);
  }

  async function exportarImagem() {
    if (!areaExportacaoRef.current) return;
    setExportando(true);
    try {
      const dataUrl = await toPng(areaExportacaoRef.current, {
        backgroundColor: "#05070d",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "resultado-roi-trafego-pago.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setExportando(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-brand-foreground">
          <Calculator className="h-3.5 w-3.5 text-brand" aria-hidden />
          Calculadora de ROI de Tráfego Pago
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Sua campanha está lucrativa?
        </h1>
        <p className="max-w-2xl text-sm text-muted sm:text-base">
          Preencha os dados da campanha e acompanhe os indicadores em tempo real — sem
          planilhas.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <FormularioCampanha key={resetKey} dados={dados} onChange={setDados} onLimpar={limparCampos} />

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={exportarImagem}
              disabled={exportando || resultados.erros.length > 0}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              {exportando ? "Exportando..." : "Exportar imagem"}
            </button>
          </div>
          <div ref={areaExportacaoRef} className="flex flex-col gap-6">
            <ResumoTextual dados={dados} resultados={resultados} />
            <PainelResultados dados={dados} resultados={resultados} />
            <GraficoROI dados={dados} resultados={resultados} />
          </div>
        </div>
      </div>
    </main>
  );
}
