"use client";

import { FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { gerarResumoTextual } from "@/lib/calculos";
import { DadosCampanha, ResultadosCampanha } from "@/types";

interface ResumoTextualProps {
  dados: DadosCampanha;
  resultados: ResultadosCampanha;
}

export function ResumoTextual({ dados, resultados }: ResumoTextualProps) {
  const frases = gerarResumoTextual(dados, resultados);

  if (frases.length === 0) return null;

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <FileText className="h-4 w-4 text-brand" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">Resumo</h2>
      </div>
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted">
        {frases.map((frase) => (
          <p key={frase}>{frase}</p>
        ))}
      </div>
    </Card>
  );
}
