# ADR-004: Pagamento Avulso / Abatimento de Fatura e Quebra de Acordo de Dívidas

**Status:** Aceito  
**Data:** 11/10/2026  
**Decisores:** Arquiteto de Software e Dados, Stella (Tech Lead)  
**Contexto:** Suporte a pagamentos avulsos em faturas para liberação imediata de limite e impacto em caixa real, além de quebra de acordos inadimplidos na aba Dívidas com recomposição de saldo e juros.

---

## 1. Contexto e Problemas

1. **Inexistência de Pagamento Avulso de Fatura (Liberação de Limite):**
   O usuário só possuía as opções de "Pagar Fatura Total" ou "Pagamento Parcial" (que acionava compulsoriamente a rolagem com rotativo para o mês seguinte). O usuário precisava poder abater qualquer valor avulso a qualquer momento (ex: antecipar R$ 300) para liberar limite de crédito imediatamente, sem fechar a fatura nem forçar juros de rotativo, registrando a saída de caixa no Painel Verdinho no mesmo instante.

2. **Acordos Inadimplidos Irreversíveis:**
   Uma vez firmado um acordo (`d.acordo`), a dívida ficava travada na grade de parcelas sem juros. Se o devedor deixasse de pagar as parcelas do acordo por mais de 30 dias, não havia forma de quebrar o acordo, reverter os descontos não cumpridos, recalcular o saldo restante e reativar os juros contratuais originais.

---

## 2. Decisões Arquiteturais

### 2.1 Pagamento Avulso / Abatimento de Valor (`abaterValorFatura`)
- Adicionada a ação no modal da fatura: `💵 Abater / Pagar Valor Avulso`.
- Permite informar qualquer valor $V$ ($0 < V \le \text{saldoPendente}$).
- **Comportamento Contábil:**
  - $\text{fat.valorPago} \mathrel{+}= V$;
  - $\text{fat.saldoRestante} \mathrel{-}= V$;
  - Se $\text{fat.saldoRestante} == 0$, marca $\text{fat.pago} = \text{true}$;
  - **Não aciona rolagem nem encargos de rotativo** (a fatura permanece aberta aguardando vencimento pelo saldo restante);
  - $\text{limiteComprometido}$ é reduzido em $V$ e $\text{limiteDisponivel}$ é ampliado em $V$ no mesmo instante via `calcularLimiteCartao()`;
  - O desembolso $V$ é contabilizado em `totalPago` na competência do pagamento e deduzido em tempo real do **Painel Verdinho (Caixa Real)**.

### 2.2 Quebra de Acordo de Dívidas (`quebrarAcordo`)
- Na aba Dívidas, cards com acordo ativo (`d.acordo`) ganham o botão `⚠️ Quebrar Acordo`.
- Se houver parcela com vencimento $\ge 30$ dias em atraso, o card exibe destaque visual com badge `⚠️ Parcela do Acordo em Atraso (+30 dias)`.
- **Cálculo de Recomposição Matemática:**
  $$\text{totalAmortizado} = \text{entradaPaga} + \sum_{\text{parcelas pagas}} \text{valorParcela}$$
  $$\text{saldoBase} = \text{d.saldoOriginalPreAcordo} \parallel \text{d.saldo} \parallel \text{d.acordo.valorTotal}$$
  $$\text{novoSaldo} = \max(0, \text{round}((\text{saldoBase} - \text{totalAmortizado}) \times 100) / 100)$$
- **Efeitos da Quebra:**
  - `d.saldo = novoSaldo`;
  - `d.acordo = null`;
  - Reativação imediata da taxa de juros original `d.juros` no cálculo de `custoJuros`;
  - A dívida volta a figurar integralmente em `totalDiv` e na ordem de prioridades do método avalanche.

---

## 3. Consequências e Salvaguardas

- **Zero Regressão:** `pagarFaturaTotal` e o rotativo continuam funcionando perfeitamente; o abatimento avulso é uma operação complementar limpa.
- **Aritmética Exata:** Todas as amortizações e recomposições operam com números em centavos inteiros (`Math.round`), impedindo dízimas.
