import { DadosCampanha, ResultadosCampanha } from "@/types";

/**
 * O usuário informa Faturamento (não número de vendas diretamente) para manter o
 * formulário enxuto. O número de vendas é sempre derivado de Faturamento / Ticket
 * médio, que também é o denominador natural do break-even.
 */

export function calcularROAS(faturamento: number, investimento: number): number | null {
  if (investimento <= 0) return null;
  return faturamento / investimento;
}

export function calcularROI(faturamento: number, investimento: number): number | null {
  if (investimento <= 0) return null;
  return ((faturamento - investimento) / investimento) * 100;
}

export function calcularNumeroVendas(faturamento: number, ticketMedio: number): number | null {
  if (ticketMedio <= 0) return null;
  return faturamento / ticketMedio;
}

export function calcularCACReal(investimento: number, numeroVendas: number | null): number | null {
  if (numeroVendas === null || numeroVendas <= 0) return null;
  return investimento / numeroVendas;
}

export function calcularVendasBreakEven(investimento: number, ticketMedio: number): number | null {
  if (ticketMedio <= 0) return null;
  return investimento / ticketMedio;
}

export function calcularLucroLiquido(
  faturamento: number,
  investimento: number,
  custoProduto: number | undefined,
  numeroVendas: number | null
): number | null {
  if (!custoProduto || custoProduto <= 0 || numeroVendas === null) return null;
  return faturamento - investimento - custoProduto * numeroVendas;
}

export function compararCAC(
  cacReal: number | null,
  cacDesejado: number | undefined
): boolean | null {
  if (cacReal === null || !cacDesejado || cacDesejado <= 0) return null;
  return cacReal <= cacDesejado;
}

/** Valida os campos obrigatórios e retorna mensagens de erro amigáveis (sem jargão técnico). */
export function validarDados(dados: DadosCampanha): string[] {
  const erros: string[] = [];

  if (dados.investimento < 0) erros.push("O investimento não pode ser negativo.");
  if (dados.faturamento < 0) erros.push("O faturamento não pode ser negativo.");
  if (dados.ticketMedio < 0) erros.push("O ticket médio não pode ser negativo.");

  if (dados.investimento === 0) {
    erros.push("Informe o investimento em anúncios para calcular os indicadores.");
  }
  if (dados.ticketMedio === 0) {
    erros.push("Informe o ticket médio para calcular o número de vendas e o break-even.");
  }

  return erros;
}

/** Função orquestradora: recebe os dados brutos e devolve todos os indicadores prontos para exibição. */
export function calcularResultados(dados: DadosCampanha): ResultadosCampanha {
  const erros = validarDados(dados);

  if (erros.length > 0) {
    return {
      roas: null,
      roi: null,
      numeroVendas: null,
      cacReal: null,
      vendasBreakEven: null,
      lucroLiquido: null,
      cacDentroDaMeta: null,
      erros,
    };
  }

  const numeroVendas = calcularNumeroVendas(dados.faturamento, dados.ticketMedio);
  const cacReal = calcularCACReal(dados.investimento, numeroVendas);

  return {
    roas: calcularROAS(dados.faturamento, dados.investimento),
    roi: calcularROI(dados.faturamento, dados.investimento),
    numeroVendas,
    cacReal,
    vendasBreakEven: calcularVendasBreakEven(dados.investimento, dados.ticketMedio),
    lucroLiquido: calcularLucroLiquido(
      dados.faturamento,
      dados.investimento,
      dados.custoProduto,
      numeroVendas
    ),
    cacDentroDaMeta: compararCAC(cacReal, dados.cacDesejado),
    erros: [],
  };
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function formatarPercentual(valor: number, casasDecimais: 1 | 2 = 1): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  }).format(valor / 100);
}

export function formatarNumero(valor: number, casasDecimais = 0): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  }).format(valor);
}
