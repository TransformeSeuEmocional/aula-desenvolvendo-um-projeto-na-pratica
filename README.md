# Calculadora de ROI de Tráfego Pago

Aplicação web de página única que permite a gestores de tráfego pago e empreendedores
inserirem os dados de uma campanha de marketing e visualizarem instantaneamente os
principais indicadores de performance financeira, com apoio gráfico.

100% client-side: todo o cálculo acontece no navegador, sem backend, banco de dados
ou autenticação.

## Indicadores calculados

- **ROAS** — Retorno sobre Investimento em Anúncios
- **ROI** — Retorno sobre Investimento, em %
- **CAC real** — Custo de Aquisição de Cliente, comparado a uma meta opcional
- **Vendas necessárias para o break-even**
- **Lucro líquido** (quando o custo do produto/serviço é informado)

## Stack técnica

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Recharts](https://recharts.org) para o gráfico de Investimento vs. Faturamento
- [lucide-react](https://lucide.dev) para ícones

## Como rodar localmente

Pré-requisito: [Node.js](https://nodejs.org) 20+.

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

Para gerar e rodar o build de produção localmente:

```bash
npm run build
npm run start
```

## Decisões de projeto

- O número de vendas é derivado de `Faturamento ÷ Ticket médio` (o usuário não
  informa o número de vendas diretamente), para manter o formulário enxuto.
- Modo escuro é o único tema da aplicação (requisito de produto), por isso não há
  variantes `dark:` no CSS — a paleta escura já é o padrão fixo.
- Campos numéricos usam `<input type="number">` com separador decimal `.` (padrão
  do navegador); a formatação de saída (resultados) segue o padrão `pt-BR` (`R$ 1.234,56`).

## Deploy

Projeto pronto para deploy na [Vercel](https://vercel.com) sem configuração adicional
(zero variáveis de ambiente obrigatórias).

**Link de deploy:** https://aula-desenvolvendo-um-projeto-na-pr.vercel.app
