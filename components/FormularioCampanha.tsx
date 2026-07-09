"use client";

import { useState } from "react";
import {
  DollarSign,
  Info,
  MousePointerClick,
  Percent,
  RotateCcw,
  ShoppingBag,
  Target,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DadosCampanha } from "@/types";

interface FormularioCampanhaProps {
  dados: DadosCampanha;
  onChange: (dados: DadosCampanha) => void;
  onLimpar: () => void;
}

function IconeAjuda({ texto }: { texto: string }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        className="flex items-center text-muted outline-none transition-colors hover:text-brand focus-visible:text-brand"
        aria-label="O que é este campo?"
      >
        <Info className="h-3.5 w-3.5" aria-hidden />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-normal leading-relaxed text-foreground opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {texto}
      </span>
    </span>
  );
}

interface CampoNumericoProps {
  id: string;
  label: string;
  valor: number | undefined;
  onChange: (valor: number | undefined) => void;
  icon: React.ElementType;
  explicacao: string;
  opcional?: boolean;
  unidade?: "moeda" | "percentual" | "numero";
}

function CampoNumerico({
  id,
  label,
  valor,
  onChange,
  icon: Icon,
  explicacao,
  opcional = false,
  unidade = "moeda",
}: CampoNumericoProps) {
  // Estado local do texto digitado, desacoplado do número: evita que o campo
  // "suma" o valor enquanto o usuário digita algo como "0." ou "0,5".
  const [texto, setTexto] = useState(valor ? String(valor) : "");
  const ehMoeda = unidade === "moeda";
  const ehPercentual = unidade === "percentual";

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <label
          htmlFor={id}
          className="flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          <Icon className="h-4 w-4 text-muted" aria-hidden />
          {label}
          {opcional && <span className="text-xs font-normal text-muted">(opcional)</span>}
        </label>
        <IconeAjuda texto={explicacao} />
      </div>
      <div className="relative">
        {ehMoeda && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted">
            R$
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          max={ehPercentual ? 100 : undefined}
          step={ehPercentual ? "0.1" : unidade === "numero" ? "1" : "0.01"}
          placeholder={ehPercentual ? "0,0" : unidade === "numero" ? "0" : "0,00"}
          value={texto}
          onChange={(e) => {
            const novoTexto = e.target.value;
            setTexto(novoTexto);
            if (novoTexto === "") {
              onChange(undefined);
              return;
            }
            const numero = Math.max(0, parseFloat(novoTexto));
            onChange(ehPercentual ? Math.min(100, numero) : numero);
          }}
          className={`w-full rounded-lg border border-border bg-surface-hover py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/30 ${
            ehMoeda ? "pl-9 pr-3" : ehPercentual ? "pl-3 pr-8" : "px-3"
          }`}
        />
        {ehPercentual && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted">
            %
          </span>
        )}
      </div>
    </div>
  );
}

export function FormularioCampanha({ dados, onChange, onLimpar }: FormularioCampanhaProps) {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Dados da campanha</h2>
        <button
          type="button"
          onClick={onLimpar}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Limpar
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <CampoNumerico
          id="investimento"
          label="Investimento em anúncios"
          icon={DollarSign}
          explicacao="Valor total gasto em anúncios (Meta Ads, Google Ads etc.) no período analisado."
          valor={dados.investimento}
          onChange={(v) => onChange({ ...dados, investimento: v ?? 0 })}
        />
        <CampoNumerico
          id="faturamento"
          label="Faturamento gerado"
          icon={TrendingUp}
          explicacao="Receita total gerada pelas vendas atribuídas a esta campanha no período."
          valor={dados.faturamento}
          onChange={(v) => onChange({ ...dados, faturamento: v ?? 0 })}
        />
        <CampoNumerico
          id="ticketMedio"
          label="Ticket médio"
          icon={ShoppingBag}
          explicacao="Valor médio de cada venda. Usado para estimar o número de vendas e o ponto de equilíbrio (break-even)."
          valor={dados.ticketMedio}
          onChange={(v) => onChange({ ...dados, ticketMedio: v ?? 0 })}
        />

        <div className="my-1 border-t border-border" />

        <CampoNumerico
          id="cliques"
          label="Cliques de visitantes"
          icon={MousePointerClick}
          opcional
          unidade="numero"
          explicacao="Número de cliques (visitantes) que a campanha gerou. Usado para calcular o custo por clique e a taxa de conversão real."
          valor={dados.cliques}
          onChange={(v) => onChange({ ...dados, cliques: v })}
        />
        <CampoNumerico
          id="taxaConversaoEsperada"
          label="Taxa de conversão esperada"
          icon={Percent}
          opcional
          unidade="percentual"
          explicacao="Percentual de cliques que você espera converter em vendas. Junto com os cliques, estima quantas vendas a campanha deve gerar."
          valor={dados.taxaConversaoEsperada}
          onChange={(v) => onChange({ ...dados, taxaConversaoEsperada: v })}
        />

        <div className="my-1 border-t border-border" />

        <CampoNumerico
          id="cacDesejado"
          label="CAC desejado / meta"
          icon={Target}
          opcional
          explicacao="Custo de aquisição de cliente que você considera aceitável. É comparado com o CAC real da campanha."
          valor={dados.cacDesejado}
          onChange={(v) => onChange({ ...dados, cacDesejado: v })}
        />
        <CampoNumerico
          id="margemLucro"
          label="Margem de lucro esperada"
          icon={Percent}
          opcional
          unidade="percentual"
          explicacao="Percentual de lucro sobre o ticket médio, descontado o custo do produto/serviço. Usado para calcular o lucro líquido."
          valor={dados.margemLucro}
          onChange={(v) => onChange({ ...dados, margemLucro: v })}
        />
      </div>
    </Card>
  );
}
