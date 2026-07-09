/** Dados de entrada informados pelo usuário para uma campanha de tráfego pago. */
export interface DadosCampanha {
  investimento: number;
  faturamento: number;
  ticketMedio: number;
  /** Opcional: meta de CAC para comparação visual. */
  cacDesejado?: number;
  /** Opcional: custo do produto/serviço (COGS) por venda, para lucro líquido. */
  custoProduto?: number;
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
  erros: string[];
}
