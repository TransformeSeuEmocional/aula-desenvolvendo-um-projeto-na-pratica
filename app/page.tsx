"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { FormularioCampanha } from "@/components/FormularioCampanha";
import { GraficoROI } from "@/components/GraficoROI";
import { PainelResultados } from "@/components/PainelResultados";
import { calcularResultados } from "@/lib/calculos";
import { DadosCampanha } from "@/types";

const DADOS_INICIAIS: DadosCampanha = {
  investimento: 0,
  faturamento: 0,
  ticketMedio: 0,
};

export default function Home() {
  const [dados, setDados] = useState<DadosCampanha>(DADOS_INICIAIS);
  const resultados = useMemo(() => calcularResultados(dados), [dados]);

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
        <FormularioCampanha dados={dados} onChange={setDados} />

        <div className="flex flex-col gap-6">
          <PainelResultados dados={dados} resultados={resultados} />
          <GraficoROI dados={dados} resultados={resultados} />
        </div>
      </div>
    </main>
  );
}
