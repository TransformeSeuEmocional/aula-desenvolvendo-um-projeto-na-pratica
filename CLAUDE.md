# CLAUDE.md

Este arquivo orienta o Claude Code em todo o trabalho neste repositório. Leia-o por completo antes de gerar ou alterar qualquer código.

## 1. Visão Geral do Projeto

**Nome:** Calculadora de ROI de Tráfego Pago

**O que é:** Uma aplicação web de página única (single-page) que permite a gestores de tráfego pago e empreendedores inserirem dados de uma campanha de marketing e visualizarem instantaneamente os principais indicadores de performance financeira, com apoio gráfico.

**Público-alvo:** Gestores de tráfego pago, agências de marketing digital e empreendedores/donos de negócio que precisam avaliar rapidamente a saúde de uma campanha, sem depender de planilhas complexas.

**Proposta de valor:** Rapidez e clareza. O usuário preenche alguns campos e recebe, em tempo real, uma leitura visual e numérica sobre se a campanha é lucrativa, qual o ponto de equilíbrio e quantas vendas são necessárias para atingir a meta.

## 2. Escopo — O que este projeto É e NÃO É

**É:**
- Uma página única (one-page app), 100% front-end.
- Uma calculadora client-side: todo o cálculo acontece no navegador do usuário.
- Um projeto de demonstração/ferramenta standalone, sem persistência de dados entre sessões.

**NÃO é e NÃO deve ganhar, mesmo que pareça uma boa ideia depois:**
- ❌ Sem autenticação/login de usuários.
- ❌ Sem banco de dados (nenhum tipo — local, remoto, ou serviços tipo Supabase/Firebase).
- ❌ Sem API externa ou backend próprio.
- ❌ Sem múltiplas páginas ou rotas complexas.
- ❌ Sem armazenamento de histórico de cálculos entre sessões (localStorage é opcional e só para conveniência de UX, nunca como "banco de dados").

Se em algum momento a tarefa pedida parecer exigir backend, autenticação ou banco de dados, o Claude Code deve **parar e perguntar ao usuário** antes de prosseguir — isso provavelmente é um desvio do escopo original.

## 3. Quem Executa o Quê

O usuário **não executa nada manualmente**. O Claude Code é responsável por:
- Criar toda a estrutura de arquivos.
- Instalar dependências.
- Rodar build e testes locais.
- Inicializar o repositório Git e publicá-lo no GitHub.
- Deixar o projeto pronto para deploy na Vercel (idealmente, também executar o deploy inicial, se houver ferramenta/CLI disponível).

Sempre que uma etapa exigir uma credencial, token ou decisão que só o usuário pode fornecer (ex.: nome da conta GitHub, login na Vercel), pare e peça essa informação de forma objetiva — não deixe a etapa "pela metade" silenciosamente.

## 4. Stack Técnica

| Camada | Escolha | Motivo |
|---|---|---|
| Framework | **Next.js** (App Router) | Padrão de mercado para deploy simples na Vercel, zero-config |
| Linguagem | **TypeScript** | Segurança de tipos nos cálculos financeiros |
| Estilização | **Tailwind CSS v4** | Agilidade para um design moderno e responsivo; tema definido em `app/globals.css` via `@theme` (sem `tailwind.config.ts`, que não existe nessa versão) |
| Componentes UI | Componentes próprios (`components/ui/`) | shadcn/ui avaliado e descartado — poucos componentes reais precisos (`Card`), não justificava a dependência |
| Gráficos | **Recharts** | Leve, declarativo, fácil de estilizar em modo escuro |
| Ícones | **lucide-react** | Ícones consistentes em todo o app |
| Exportação de imagem | **html-to-image** | Gera PNG do resumo + resultados + gráfico para download |
| Deploy | **Vercel** | Requisito do projeto |
| Hospedagem de código | **GitHub** | Requisito do projeto |

Não introduza outras dependências pesadas (Redux, React Query, ORMs, etc.) — o estado da aplicação é simples o suficiente para `useState`/`useMemo`.

## 5. Regras de Negócio — Fórmulas

Todos os cálculos são derivados dos campos de entrada abaixo. Implemente as fórmulas em um módulo isolado (ex.: `lib/calculos.ts`), puro e testável, separado da camada visual.

### Campos de entrada (inputs do usuário)

Obrigatórios:
- **Investimento em anúncios** (R$)
- **Faturamento gerado** (R$) — receita total no período
- **Ticket médio** (R$) — valor médio por venda

Opcionais:
- **Cliques de visitantes** (número) — usado para CPC e taxa de conversão real
- **Taxa de conversão esperada** (%) — junto com cliques, estima vendas esperadas
- **CAC desejado / meta** (R$) — para comparação com o CAC real
- **Margem de lucro esperada** (%) — substitui um campo de custo em R$; o custo do
  produto é derivado disso (ver fórmula de lucro líquido abaixo)

### Indicadores calculados

- **ROAS (Retorno sobre Investimento em Anúncios)**
  `ROAS = Faturamento / Investimento`

- **ROI (Retorno sobre Investimento, em %)**
  `ROI = ((Faturamento - Investimento) / Investimento) * 100`

- **Número de vendas (estimado)**
  `Número de vendas = Faturamento / Ticket médio`
  (Decisão de UX: o usuário informa Faturamento, não o número de vendas diretamente,
  para manter o formulário enxuto — ver `lib/calculos.ts`.)

- **CAC real (Custo de Aquisição de Cliente)**
  `CAC real = Investimento / Número de vendas`

- **Número de vendas necessárias para o break-even**
  `Vendas para break-even = Investimento / Ticket médio`

- **Custo do produto (derivado da margem de lucro)**
  `Custo do produto = Ticket médio * (1 - Margem de lucro / 100)`

- **Lucro líquido** (se margem de lucro informada)
  `Lucro líquido = Faturamento - Investimento - (Custo do produto * Número de vendas)`

- **Comparação com CAC desejado**
  Sinalizar visualmente se `CAC real <= CAC desejado` (verde/positivo) ou `CAC real > CAC desejado` (vermelho/alerta).

- **Custo por clique (CPC)** (se cliques informados)
  `CPC = Investimento / Cliques`

- **Taxa de conversão real** (se cliques informados)
  `Taxa de conversão real = (Número de vendas / Cliques) * 100`

- **Vendas esperadas** (se cliques e taxa de conversão esperada informados)
  `Vendas esperadas = Cliques * (Taxa de conversão esperada / 100)`
  Comparar com o número de vendas real (verde se real >= esperado, vermelho caso contrário).

- **Resumo textual**
  Um parágrafo em linguagem natural interpretando os indicadores acima (lucratividade,
  vendas vs. break-even, CAC, lucro líquido, conversão), gerado por
  `gerarResumoTextual` em `lib/calculos.ts`. Cada frase só aparece se os dados
  necessários para calculá-la foram preenchidos.

### Validações
- Impedir divisão por zero (Investimento ou Ticket médio = 0 → mostrar mensagem amigável, não erro técnico).
- Aceitar apenas números positivos.
- Formatar todos os valores monetários em **Real (R$)**, padrão `pt-BR` (ex.: `R$ 1.234,56`).
- Percentuais com 1 ou 2 casas decimais.

## 6. Design e UX

- **Idioma:** Todo o texto da interface em **português do Brasil** — rótulos, botões, mensagens de erro, tooltips, tudo.
- **Modo escuro como padrão** — a página carrega em dark mode. Um toggle para modo claro é opcional (bônus), mas o dark mode é o padrão obrigatório e deve ser o mais bem cuidado visualmente.
- **Estilo visual:** Profissional e moderno — pense em um dashboard financeiro/SaaS (referências: Stripe, Linear, Vercel Dashboard). Evite visual "genérico de template".
  - Paleta escura com bom contraste, um acento de cor vibrante (ex.: verde para indicadores positivos, vermelho/laranja para negativos, uma cor de marca para CTAs).
  - Tipografia limpa e hierarquia clara (título, subtítulo, labels de formulário, valores em destaque).
  - Cards para agrupar: formulário de entrada, resultados numéricos, gráfico.
  - Micro-interações sutis (hover states, transições suaves) — sem exagero.
- **Responsividade:** Mobile-first. Testar visualmente em larguras pequenas (360px) até desktop wide (1440px+). Em mobile, o formulário e os resultados devem empilhar verticalmente de forma legível; o gráfico deve se adaptar sem cortar informação.
- **Gráfico de apoio:** Deve comunicar visualmente a relação Investimento vs. Faturamento (ex.: gráfico de barras comparativo) e, se fizer sentido, a evolução até o break-even. Priorize clareza sobre complexidade — o usuário deve entender o gráfico em segundos.
- **Feedback em tempo real:** Os resultados e o gráfico devem atualizar automaticamente conforme o usuário digita (sem necessidade de clicar em "calcular"), com debounce leve se necessário para performance.
- **Ajuda contextual:** Cada campo do formulário tem um ícone (ⓘ) com tooltip explicando o que ele representa, para uso por quem não é familiarizado com os termos.
- **Ações do usuário:** Botão **Limpar** (reseta todos os campos) e botão **Exportar imagem** (baixa um PNG do resumo + resultados + gráfico via `html-to-image`).

## 7. Estrutura de Arquivos Esperada

```
/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # página única com toda a calculadora
│   └── globals.css           # tema Tailwind v4 (paleta dark fixa) via @theme
├── components/
│   ├── FormularioCampanha.tsx
│   ├── ResumoTextual.tsx     # resumo em linguagem natural
│   ├── PainelResultados.tsx
│   ├── GraficoROI.tsx
│   └── ui/
│       └── Card.tsx          # wrapper de card reutilizável (sem shadcn/ui)
├── lib/
│   └── calculos.ts           # funções puras: ROI, ROAS, CAC, break-even, CPC,
│                              # conversão, resumo textual, formatação pt-BR
├── types/
│   └── index.ts              # tipos TypeScript dos dados da campanha
├── public/
├── README.md
├── CLAUDE.md
├── package.json
├── tsconfig.json
└── next.config.ts
```

Mantenha a lógica de cálculo (`lib/calculos.ts`) completamente separada dos componentes visuais. Isso facilita testes e evita bugs de arredondamento espalhados pela UI.

## 8. Convenções de Código

- Componentes React em **PascalCase**, funções e variáveis em **camelCase**.
- Nomes de componentes, funções e variáveis podem ficar em português ou inglês — **seja consistente**; sugestão: nomes de código em português quando representam conceitos de negócio (`calcularROI`, `investimento`, `faturamento`), termos técnicos genéricos em inglês (`props`, `handleChange`).
- Comentários apenas onde a lógica de negócio não for óbvia (ex.: por que uma fórmula usa determinado divisor).
- Sem `any` em TypeScript — tipar corretamente os inputs e outputs de `lib/calculos.ts`.
- Sem dependências desnecessárias — antes de adicionar uma lib nova, verificar se dá para resolver com o que já está no projeto.

## 9. Fluxo de Trabalho Git e GitHub

1. Inicializar o repositório Git localmente (`git init`) já na primeira etapa do projeto.
2. Fazer commits pequenos e descritivos ao longo do desenvolvimento (não um único commit gigante no final).
3. Criar um `.gitignore` adequado para Next.js (`node_modules`, `.next`, `.env*`, etc.).
4. Criar o repositório no GitHub e publicar o código (`git remote add origin ...` + `git push`).
5. Repositório pode ser público, salvo instrução contrária do usuário.
6. Escrever um `README.md` claro em português, contendo: descrição do projeto, como rodar localmente, e link de deploy (a preencher após o deploy).

## 10. Deploy na Vercel

- O projeto deve rodar com **zero configuração adicional** na Vercel (Next.js padrão já é compatível).
- Não deve haver variáveis de ambiente obrigatórias (não há backend, API keys ou banco de dados).
- Validar antes de considerar "pronto para deploy":
  - `npm run build` executa sem erros.
  - Não há warnings críticos de TypeScript/ESLint.
  - A aplicação funciona corretamente em produção local (`npm run build && npm run start`).
- Se houver CLI/integração disponível para deploy automático, realizar o deploy e reportar a URL final ao usuário. Caso contrário, deixar o projeto 100% pronto para um deploy manual via importação do repositório GitHub na Vercel.

## 11. Definição de "Pronto"

O projeto está concluído quando:
- [ ] A calculadora funciona 100% no client-side, sem erros no console.
- [ ] Todos os indicadores (ROI, ROAS, CAC, break-even, vendas necessárias, CPC, conversão, resumo textual) estão corretos e validados com pelo menos 2-3 cenários de teste manual.
- [ ] O gráfico reflete corretamente os dados inseridos e se atualiza em tempo real.
- [ ] Botões Limpar e Exportar imagem funcionam corretamente.
- [ ] O modo escuro é o padrão e o visual é profissional em desktop e mobile.
- [ ] Todo o texto da interface está em português do Brasil.
- [ ] O código está no GitHub com histórico de commits organizado e README preenchido.
- [ ] O build de produção passa sem erros e o projeto está pronto (ou já publicado) na Vercel.

## 12. O Que Fazer Se Algo Não Estiver Claro

Na dúvida entre simplicidade e "mais uma feature", **escolha a simplicidade**. Este projeto é intencionalmente enxuto. Se uma decisão de design ou de regra de negócio não estiver coberta neste documento, tome a decisão mais simples e comum no mercado de gestão de tráfego pago, implemente, e documente a decisão brevemente no README ou em comentário no código — sem parar o fluxo de trabalho para perguntar, a menos que envolva escopo (autenticação, banco de dados, API externa), caso em que a pausa é obrigatória.
