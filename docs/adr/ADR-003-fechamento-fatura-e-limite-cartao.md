# ADR-003: Fechamento de Fatura (Melhor Dia de Compra), Limite do Cartão e Edição de Cartões

**Status:** Aceito  
**Data:** 11/10/2026  
**Decisores:** Arquiteto de Software e Dados, Stella (Tech Lead)  
**Contexto:** Necessidade de atribuir compras à fatura correta com base no fechamento/melhor dia de compra e exibir o limite total/disponível do cartão de crédito.

---

## 1. Contexto e Problemas Identificados

1. **Atribuição Ingênua de Competência da Fatura:**
   Anteriormente, compras realizadas em um determinado mês civil eram alocadas diretamente no mesmo mês (`data.slice(0, 7)`). Na realidade bancária, se uma compra ocorre a partir do dia de fechamento (melhor dia de compra), ela já pertence à fatura subsequente. Exemplo: um cartão que vence no dia 01/11 com fechamento no dia 22/10 recebe compras a partir de 22/10 na fatura que vence em 01/12, e não em 01/11.

2. **Ausência de Gestão de Limite de Crédito:**
   O usuário não conseguia acompanhar o limite total do cartão nem quanto ainda restava disponível. O limite comprometido inclui tanto as parcelas futuras a vencer quanto o saldo em aberto da fatura do mês atual e de meses anteriores.

3. **Inexistência de Edição de Cartões Existentes:**
   O modal de cartões apenas permitia a criação e exclusão, forçando o usuário a recriar o cartão para atualizar parâmetros cadastrais.

---

## 2. Decisões Arquiteturais

### 2.1 Modelo Matemático de Atribuição de Competência (`mesFatura`)
A função pura `calcularMesFaturaCompra(dataCompraISO, diaFechamento, diaVencimento)` opera sob o seguinte algoritmo determinístico:
1. Extrai `diaCompra`, `mesCompra` e `anoCompra` da data da transação.
2. Determina o ciclo de fechamento:
   - Se $\text{diaCompra} \ge \text{diaFechamento}$: O fechamento do mês da compra já ocorreu; a compra entra no ciclo de fechamento do mês seguinte ($\text{mesCompra} + 1$).
   - Se $\text{diaCompra} < \text{diaFechamento}$: O fechamento ainda não ocorreu; a compra entra no ciclo de fechamento do mês corrente ($\text{mesCompra}$).
3. Determina o mês de vencimento correspondente:
   - Se $\text{diaVencimento} \le \text{diaFechamento}$: O vencimento ocorre no mês seguinte ao fechamento ($\text{mesFechamento} + 1$).
   - Se $\text{diaVencimento} > \text{diaFechamento}$: O vencimento ocorre no mesmo mês do fechamento ($\text{mesFechamento}$).
4. Para compras parceladas ($N$ parcelas):
   - Parcela 1: Vence em $\text{mesFaturaPrimeira}$.
   - Parcela $i$ ($2 \le i \le N$): Vence em $\text{adicionarMesesYM}(\text{mesFaturaPrimeira}, i - 1)$.

### 2.2 Cálculo de Limite Comprometido e Disponível
A função `calcularLimiteCartao(cartaoId)` computa em centavos inteiros:
$$\text{Comprometido Futuro} = \sum_{\text{mesFatura} > \text{mesHoje}} \text{parcelasFuturasNãoCanceladas}$$
$$\text{Comprometido Vigente e Passado} = \sum_{\text{mesFatura} \le \text{mesHoje}} \text{saldoRestanteFaturaNãoQuitada}$$
$$\text{limiteComprometido} = \text{Comprometido Futuro} + \text{Comprometido Vigente e Passado}$$
$$\text{limiteDisponivel} = \max(0, \text{limiteTotal} - \text{limiteComprometido})$$

### 2.3 Edição e Retrocompatibilidade
- `CartaoCredito` recebe `diaFechamento` e `limiteTotal`.
- `loadState()` aplica fallbacks inteligentes: se `diaFechamento` for nulo, deriva $\max(1, \text{diaVencimento} - 7)$. Se `limiteTotal` for nulo, atribui 0 (não configurado).
- `abrirModalCartao(cartaoId)` passa a suportar edição in-place sem recriação do cartão.
- Compras antigas já gravadas preservam seus `mesFatura` históricos para garantir integridade contábil.
