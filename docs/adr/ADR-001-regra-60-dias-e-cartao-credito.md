# ADR-001: Arquitetura da Regra de 60 Dias e do Módulo de Cartão de Crédito

**Status:** Aceito  
**Data:** 08/10/2026  
**Decisores:** Arquiteto de Software e Dados, Stella (Tech Lead)  
**Contexto:** Evolução do aplicativo Do Negativo ao Milhão para suporte à inadimplência crítica (> 60 dias) e gestão nativa de faturas de cartão de crédito.

---

## 1. Contexto e Problema
O aplicativo "Do Negativo ao Milhão" consolidava contas em atraso no box de inadimplência do mês vigente (`gastosInadimplentesDoMes`), acumulando despesas de múltiplos meses no mesmo fluxo de caixa. Na prática financeira familiar brasileira:
1. Uma conta em atraso por mais de 60 dias (>= 2 meses) é classificada como inadimplência crítica ou negativada em órgãos de proteção ao crédito (Serasa/SPC). Ela deixa de ser um gasto operacional imediato do mês e se torna uma dívida a ser renegociada, amortizada ou acordada na ordem de ataque (avalanche).
2. Parcelamentos e gastos fixos vinculados a uma conta negativada sofrem vencimento antecipado do saldo devedor e cancelamento das cobranças futuras regulares.
3. As compras em cartão de crédito poluíam a visualização de gastos diários se lançadas como itens soltos, além de não suportarem fatura consolidada, pagamento parcial com rolagem para rotativo e anuidade parcelada.

---

## 2. Decisão

### 2.1 Modelo de Dados Híbrido e Retrocompatível
Decidimos manter o estado global `S` e estendê-lo com três novas coleções de primeira classe:
- `S.cartoes`: Cadastro dos cartões (nome, taxa rotativo mensal, titular, anuidade).
- `S.comprasCartao`: Histórico detalhado de transações e parcelas do cartão.
- `S.faturasCartao`: Estado mensal da fatura (valor consolidado, status de pagamento, rolagem de rotativo).

Para os gastos regulares e dívidas:
- `S.gastos` ganha flags de estado: `migradoDivida: boolean`, `canceladaNegativacao: boolean` e `dividaCriadaId: number`.
- `S.dividas` ganha o objeto opcional `origemNegativacao`.

### 2.2 Isolamento de Fluxo de Caixa vs Passivo
- Gastos com atraso `>= 2 meses` (em relação à competência de referência) são automaticamente transferidos para `S.dividas` como dívida negativada.
- O gasto original é marcado como `migradoDivida: true` e deixa de constar em `gastosInadimplentesDoMes()`.
- Parcelas futuras de compras parceladas (`parcelado: true`) e recorrências (`recorrente: true`) são canceladas e o saldo total remanescente é consolidado no montante inicial da nova dívida.

### 2.3 Cartão de Crédito com Fatura Agregada
- A lista de gastos exibe **uma única linha consolidada por fatura ativa** no mês, evitando poluição visual.
- Cards no topo de `Gastos` exibem os cartões de crédito da família e permitem abrir o detalhamento das compras do mês via accordion/modal.
- Pagamento parcial rola o saldo remanescente para o mês posterior acrescido da taxa de rotativo (`taxaRotativo % a.m.`).
- Toda a matemática de juros e rolagem é calculada em centavos inteiros (`Math.round`), eliminando imprecisões de ponto flutuante.

---

## 3. Consequências

### Positivas
- **Fidelidade à Realidade Financeira:** Separa claramente o que é orçamento do mês do que virou passivo de longo prazo/negativação.
- **Zero Regressão:** Nenhum registro antigo do `localStorage` ou do Firestore é corrompido; `loadState()` aplica fallbacks seguros.
- **UX Limpa:** Elimina listas gigantescas de compras no cartão, mantendo a visão executiva e o detalhamento sob demanda.
- **Precisão Financeira:** Rotativo e antecipações respeitam regras exatas de centavos.

### Negativas / Mitigações
- **Complexidade Adicional no Estado:** Requer manter consistência entre `comprasCartao` e a fatura consolidada.  
  *Mitigação:* Funções auxiliares puras para recomputar o total da fatura sob demanda (`recalcularFaturaDoMes(cartaoId, mes)`).
- **Atenção à Idempotência:** A rotina de migração de 60 dias não pode criar dívidas duplicadas se executada repetidamente.  
  *Mitigação:* Verificação prévia estrita do atributo `migradoDivida` e identificação por `grupoId`.
