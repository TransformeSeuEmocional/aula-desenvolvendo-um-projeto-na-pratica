"use client";

import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { formatarMoeda } from "@/lib/calculos";
import { DadosCampanha, ResultadosCampanha } from "@/types";

interface GraficoROIProps {
  dados: DadosCampanha;
  resultados: ResultadosCampanha;
}

function TooltipPersonalizado({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-xl">
      <p className="text-muted">{item.name}</p>
      <p className="font-semibold text-foreground">{formatarMoeda(Number(item.value))}</p>
    </div>
  );
}

export function GraficoROI({ dados, resultados }: GraficoROIProps) {
  if (resultados.erros.length > 0) {
    return (
      <Card>
        <h2 className="mb-5 text-lg font-semibold text-foreground">
          Investimento vs. Faturamento
        </h2>
        <div className="flex h-56 flex-col items-center justify-center gap-2 text-center text-muted">
          <BarChart3 className="h-6 w-6" aria-hidden />
          <p className="text-sm">Preencha os dados para visualizar o gráfico.</p>
        </div>
      </Card>
    );
  }

  const lucrativa = dados.faturamento >= dados.investimento;
  const dadosGrafico = [
    { nome: "Investimento", valor: dados.investimento, cor: "var(--color-brand)" },
    {
      nome: "Faturamento",
      valor: dados.faturamento,
      cor: lucrativa ? "var(--color-positive)" : "var(--color-negative)",
    },
  ];

  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold text-foreground">
        Investimento vs. Faturamento
      </h2>
      <div className="h-56 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dadosGrafico} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="nome"
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(valor: number) =>
                valor >= 1000 ? `${Number((valor / 1000).toFixed(1))}k` : `${valor}`
              }
            />
            <Tooltip cursor={{ fill: "var(--color-surface-hover)" }} content={TooltipPersonalizado} />
            <Bar dataKey="valor" radius={[8, 8, 0, 0]} maxBarSize={96}>
              {dadosGrafico.map((entrada) => (
                <Cell key={entrada.nome} fill={entrada.cor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
