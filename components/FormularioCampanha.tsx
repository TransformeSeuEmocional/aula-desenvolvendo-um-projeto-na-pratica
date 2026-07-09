"use client";

import { useState } from "react";
import { DollarSign, Package, ShoppingBag, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DadosCampanha } from "@/types";

interface FormularioCampanhaProps {
  dados: DadosCampanha;
  onChange: (dados: DadosCampanha) => void;
}

interface CampoNumericoProps {
  id: string;
  label: string;
  valor: number | undefined;
  onChange: (valor: number | undefined) => void;
  icon: React.ElementType;
  opcional?: boolean;
  ajuda?: string;
}

function CampoNumerico({
  id,
  label,
  valor,
  onChange,
  icon: Icon,
  opcional = false,
  ajuda,
}: CampoNumericoProps) {
  // Estado local do texto digitado, desacoplado do número: evita que o campo
  // "suma" o valor enquanto o usuário digita algo como "0." ou "0,5".
  const [texto, setTexto] = useState(valor ? String(valor) : "");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        <Icon className="h-4 w-4 text-muted" aria-hidden />
        {label}
        {opcional && <span className="text-xs font-normal text-muted">(opcional)</span>}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted">
          R$
        </span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          placeholder="0,00"
          value={texto}
          onChange={(e) => {
            const novoTexto = e.target.value;
            setTexto(novoTexto);
            onChange(novoTexto === "" ? undefined : Math.max(0, parseFloat(novoTexto)));
          }}
          className="w-full rounded-lg border border-border bg-surface-hover py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
      </div>
      {ajuda && <p className="mt-1 text-xs text-muted">{ajuda}</p>}
    </div>
  );
}

export function FormularioCampanha({ dados, onChange }: FormularioCampanhaProps) {
  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold text-foreground">Dados da campanha</h2>
      <div className="flex flex-col gap-4">
        <CampoNumerico
          id="investimento"
          label="Investimento em anúncios"
          icon={DollarSign}
          valor={dados.investimento}
          onChange={(v) => onChange({ ...dados, investimento: v ?? 0 })}
        />
        <CampoNumerico
          id="faturamento"
          label="Faturamento gerado"
          icon={TrendingUp}
          valor={dados.faturamento}
          onChange={(v) => onChange({ ...dados, faturamento: v ?? 0 })}
        />
        <CampoNumerico
          id="ticketMedio"
          label="Ticket médio"
          icon={ShoppingBag}
          valor={dados.ticketMedio}
          onChange={(v) => onChange({ ...dados, ticketMedio: v ?? 0 })}
        />
        <div className="my-1 border-t border-border" />
        <CampoNumerico
          id="cacDesejado"
          label="CAC desejado / meta"
          icon={Target}
          opcional
          ajuda="Usado para comparar com o CAC real da campanha."
          valor={dados.cacDesejado}
          onChange={(v) => onChange({ ...dados, cacDesejado: v })}
        />
        <CampoNumerico
          id="custoProduto"
          label="Custo do produto/serviço (COGS)"
          icon={Package}
          opcional
          ajuda="Custo por venda, usado para calcular o lucro líquido."
          valor={dados.custoProduto}
          onChange={(v) => onChange({ ...dados, custoProduto: v })}
        />
      </div>
    </Card>
  );
}
