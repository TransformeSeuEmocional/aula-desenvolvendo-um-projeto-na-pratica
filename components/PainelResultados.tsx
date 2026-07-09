"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  MousePointerClick,
  Percent,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatarMoeda, formatarNumero, formatarPercentual } from "@/lib/calculos";
import { DadosCampanha, ResultadosCampanha } from "@/types";

interface PainelResultadosProps {
  dados: DadosCampanha;
  resultados: ResultadosCampanha;
}

interface StatTileProps {
  icon: React.ElementType;
  label: string;
  valor: string;
  subtexto?: string;
  tom?: "neutro" | "positivo" | "negativo";
}

function StatTile({ icon: Icon, label, valor, subtexto, tom = "neutro" }: StatTileProps) {
  const corValor =
    tom === "positivo" ? "text-positive" : tom === "negativo" ? "text-negative" : "text-foreground";

  return (
    <div className="rounded-xl border border-border bg-surface-hover/60 p-4">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </div>
      <p className={`text-2xl font-semibold tracking-tight ${corValor}`}>{valor}</p>
      {subtexto && <p className="mt-1 text-xs text-muted">{subtexto}</p>}
    </div>
  );
}

export function PainelResultados({ dados, resultados }: PainelResultadosProps) {
  const { erros } = resultados;

  if (erros.length > 0) {
    return (
      <Card>
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
          <div>
            <h2 className="mb-1 text-sm font-semibold text-foreground">
              Preencha os dados para ver os resultados
            </h2>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted">
              {erros.map((erro) => (
                <li key={erro}>{erro}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    );
  }

  const {
    roas,
    roi,
    cacReal,
    vendasBreakEven,
    numeroVendas,
    lucroLiquido,
    cacDentroDaMeta,
    cpc,
    taxaConversaoReal,
    vendasEsperadas,
  } = resultados;

  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold text-foreground">Resultados</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile
          icon={TrendingUp}
          label="ROAS"
          valor={roas !== null ? `${formatarNumero(roas, 2)}x` : "—"}
          subtexto="Retorno por real investido"
        />
        <StatTile
          icon={Percent}
          label="ROI"
          valor={roi !== null ? formatarPercentual(roi, 1) : "—"}
          tom={roi !== null ? (roi >= 0 ? "positivo" : "negativo") : "neutro"}
          subtexto={roi !== null ? (roi >= 0 ? "Campanha lucrativa" : "Campanha no prejuízo") : undefined}
        />
        <StatTile
          icon={ShoppingCart}
          label="Vendas estimadas"
          valor={numeroVendas !== null ? formatarNumero(numeroVendas, 0) : "—"}
          subtexto="Faturamento ÷ ticket médio"
        />
        <StatTile
          icon={Target}
          label="CAC real"
          valor={cacReal !== null ? formatarMoeda(cacReal) : "—"}
          tom={cacDentroDaMeta === null ? "neutro" : cacDentroDaMeta ? "positivo" : "negativo"}
          subtexto={
            cacDentroDaMeta === null
              ? undefined
              : cacDentroDaMeta
                ? "Dentro da meta desejada"
                : "Acima da meta desejada"
          }
        />
        <StatTile
          icon={Users}
          label="Vendas p/ break-even"
          valor={vendasBreakEven !== null ? formatarNumero(vendasBreakEven, 0) : "—"}
          subtexto="Investimento ÷ ticket médio"
        />
        {lucroLiquido !== null && (
          <StatTile
            icon={Wallet}
            label="Lucro líquido"
            valor={formatarMoeda(lucroLiquido)}
            tom={lucroLiquido >= 0 ? "positivo" : "negativo"}
            subtexto="Após custo do produto"
          />
        )}
        {cpc !== null && (
          <StatTile
            icon={MousePointerClick}
            label="Custo por clique"
            valor={formatarMoeda(cpc)}
            subtexto="Investimento ÷ cliques"
          />
        )}
        {taxaConversaoReal !== null && (
          <StatTile
            icon={Activity}
            label="Taxa de conversão real"
            valor={formatarPercentual(taxaConversaoReal, 2)}
            subtexto="Vendas ÷ cliques"
          />
        )}
        {vendasEsperadas !== null && (
          <StatTile
            icon={Sparkles}
            label="Vendas esperadas"
            valor={formatarNumero(vendasEsperadas, 0)}
            tom={
              numeroVendas !== null
                ? numeroVendas >= vendasEsperadas
                  ? "positivo"
                  : "negativo"
                : "neutro"
            }
            subtexto={
              numeroVendas !== null
                ? `Real: ${formatarNumero(numeroVendas, 0)} vendas`
                : "Cliques × taxa de conversão esperada"
            }
          />
        )}
      </div>

      {cacDentroDaMeta !== null && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
            cacDentroDaMeta
              ? "border-positive/30 bg-positive/10 text-positive"
              : "border-negative/30 bg-negative/10 text-negative"
          }`}
        >
          {cacDentroDaMeta ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" aria-hidden />
          )}
          {cacDentroDaMeta
            ? `O CAC real está dentro da meta de ${formatarMoeda(dados.cacDesejado ?? 0)}.`
            : `O CAC real ultrapassou a meta de ${formatarMoeda(dados.cacDesejado ?? 0)}.`}
        </div>
      )}
    </Card>
  );
}
