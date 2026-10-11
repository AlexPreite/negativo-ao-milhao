# ADR-002: Painel de Caixa Real em Tempo Real, Rolagem Automática de Faturas e Auditoria de 60 Dias

**Status:** Aceito  
**Data:** 10/10/2026  
**Decisores:** Arquiteto de Software e Dados, Stella (Tech Lead)  
**Contexto:** Solicitação do usuário para visualização de Fluxo de Caixa Real ("Painel Verdinho"), acúmulo contínuo de faturas de cartão em aberto (< 60 dias) e ferramenta amigável para simulação/auditoria da regra de 60 dias.

---

## 1. Contexto e Problemas Identificados

1. **Invisibilidade de Faturas Atrasadas (< 60 dias):**
   Uma fatura de cartão não paga de mês anterior (atraso de 1 mês) não era acumulada na fatura do mês seguinte a menos que o usuário fizesse manualmente um pagamento parcial. Como a regra de 60 dias só atua em $\ge 2$ meses, a dívida ficava oculta nos gastos correntes durante esse intervalo.

2. **Distorção no Saldo de Caixa Imediato:**
   O card de resumo descontava antecipadamente todos os gastos previstos do mês (competência), mesmo os que ainda não tinham saído da conta. O usuário necessitava ver o **Saldo em Caixa Real (Atual)**: receitas disponíveis menos apenas as contas e faturas efetivamente pagas até aquele instante, com subtração em tempo real ao clicar em "✓ Pago".

3. **Inviabilidade de Validação Temporal da Regra de 60 Dias:**
   O usuário não conseguia auditar a negativação automática de 60 dias porque gastos criados na data corrente requereriam aguardar 2 meses civis no mundo real.

---

## 2. Decisões Arquiteturais

### 2.1 Rolagem Dinâmica e Reativa de Faturas Não Pagas (< 60 dias)
- A função `calcularFaturaMes(cartaoId, mesYM)` passa a inspecionar dinamicamente a competência anterior (`mesYM - 1`).
- Se a fatura anterior tiver saldo pendente, não estiver quitada, não tiver sido rolada manualmente por pagamento parcial e não estiver negativada ($\text{atraso} < 2\text{ meses}$):
  - O saldo devedor remanescente é acrescido da taxa de rotativo configurada (`taxaRotativo % a.m.`) e incorporado dinamicamente como item de rotativo na fatura do mês corrente.
- **Precisão Financeira:** Cálculo efetuado em centavos inteiros (`Math.round`).
- **Idempotência:** Totalmente dinâmico, sem persistência redundante de registros fantasmas.

### 2.2 Desacoplamento entre Fluxo de Caixa Real e Projeção Mensal
- `calcTotais()` é enriquecido com métricas operacionais explícitas:
  - $\text{totalDisponivel} = \text{totalRec} + \text{saldoAnterior}$
  - $\text{totalPago} = \text{gastosPagos} + \text{faturasPagas} + \text{aportesRealizados}$
  - $\text{saldoCaixaReal} = \text{totalDisponivel} - \text{totalPago}$ (O "Painel Verdinho" em tempo real)
  - $\text{totalPendente} = \text{gastosAbertos} + \text{faturasAbertas}$
  - $\text{saldoProjetado} = \text{saldoCaixaReal} - \text{totalPendente}$ (Equivalente ao antigo `saldoDisp`)
- O card principal em `renderResumo()` passa a destacar o **Saldo em Caixa Real**, atualizando instantaneamente quando o usuário clica em "✓ Pago" ou "✓ Pagar Fatura".
- A visão anual (`calcTotaisAno`) e os gráficos continuam utilizando o regime de competência consolidado sem quebra.

### 2.3 Ferramenta de Simulação e Auditoria da Regra de 60 Dias
- Disponibilizada na aba **Configurações**:
  - Geração de cenário controlado de teste (contas e compras de 2 e 3 meses atrás);
  - Auditoria imediata demonstrando a migração para a aba Dívidas com flag `🔴 Negativada`;
  - Opção de limpeza dos dados de teste para assegurar a integridade da base.

---

## 3. Consequências e Salvaguardas

- **Zero Regressão:** `saldoMes` e `saldoDisp` são mantidos intactos no objeto retornado por `calcTotais()`.
- **Exatidão Monetária:** Incorporação de faturas de cartão pagas em `calcSaldoAcumuladoAnterior()`, garantindo que sobras de meses passados sejam contábil e matematicamente perfeitas.
