/** Dados de entrada informados pelo usuário para uma campanha de tráfego pago. */
export interface DadosCampanha {
  investimento: number;
  faturamento: number;
  ticketMedio: number;
  /** Opcional: meta de CAC para comparação visual. */
  cacDesejado?: number;
  /** Opcional: percentual de lucro sobre o ticket médio, usado para derivar o custo do produto. */
  margemLucro?: number;
  /** Opcional: número de cliques/visitantes gerados pela campanha. */
  cliques?: number;
  /** Opcional: percentual esperado de conversão de cliques em vendas. */
  taxaConversaoEsperada?: number;
}

/** Indicadores calculados a partir de DadosCampanha. `null` quando não é possível calcular. */
export interface ResultadosCampanha {
  roas: number | null;
  roi: number | null;
  numeroVendas: number | null;
  cacReal: number | null;
  vendasBreakEven: number | null;
  lucroLiquido: number | null;
  cacDentroDaMeta: boolean | null;
  cpc: number | null;
  taxaConversaoReal: number | null;
  vendasEsperadas: number | null;
  erros: string[];
}
