# ADR-005: Compras Recorrentes e Assinaturas no Cartão de Crédito com Cancelamento

**Status:** Aceito  
**Data:** 11/10/2026  
**Decisores:** Arquiteto de Software e Dados, Stella (Tech Lead)  
**Contexto:** Suporte a compras recorrentes e assinaturas mensais (Netflix, cursos, academias) lançadas no cartão com projeção padrão de 24 meses e capacidade de cancelamento a qualquer momento.

---

## 1. Contexto e Problema
Usuários de cartão de crédito possuem despesas recorrentes mensais fixas debitadas no cartão (streaming, assinaturas de software, cursos recorrentes).
- Se lançadas como compra parcelada tradicional, dividiam um valor total inexistente e comprometiam artificialmente todo o limite de crédito do cartão por 24 meses.
- Se lançadas todo mês manualmente, causavam atrito e esquecimento.
- Não havia mecanismo para interromper o lançamento a partir do momento em que o serviço fosse cancelado.

---

## 2. Decisões Arquiteturais

### 2.1 Modelagem da Compra Recorrente / Assinatura
No modal `m-compra-cartao`, adiciona-se o seletor "🔁 Assinatura / Gasto Fixo no Cartão".
- **Prazo:** Se não especificado, adota como padrão **24 meses**. Opção de prazo personalizado ($X$ meses).
- **Entidade em `S.comprasCartao`:**
  - `recorrente: true`;
  - `assinatura: true`;
  - `parcelado: false`;
  - `val`: valor nominal cobrado a cada mês (ex: R$ 55,90);
  - `mesNum: i`, `totalMeses: qtdMeses`;
  - `grupoId: 'crec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)`;
  - 1ª competência calculada por `calcularMesFaturaCompra(dataCompra, diaFechamento, diaVencimento)`;
  - Competências $2 \dots N$ geradas via `adicionarMesesYM(mesFaturaPrimeira, i - 1)`.

### 2.2 Tratamento no Cálculo de Limite (`calcularLimiteCartao`)
Diferenciação contábil essencial entre parcelamento e assinatura:
- **Compras Parceladas (`parcelado: true`):** O montante de todas as parcelas futuras compromete o limite de crédito do cartão.
- **Assinaturas Recorrentes (`assinatura: true`):** O limite é consumido **apenas pelo ciclo corrente (mês atual)** e eventuais faturas passadas não pagas. Parcelas projetadas de meses futuros ($> \text{mesHoje}$) **NÃO comprometem o limite de crédito antecipadamente**, espelhando o funcionamento bancário real.

### 2.3 Cancelamento de Assinatura (`cancelarAssinaturaCartao`)
- No modal da fatura (`abrirFaturaCartao`), compras com `assinatura: true` exibem o badge `🔁 Assinatura` e a ação `🚫 Cancelar Assinatura`.
- Ao confirmar o cancelamento:
  - As compras do mesmo `grupoId` com competência futura ($\text{mesFatura} > \text{mesAtual}$) são marcadas com `canceladaAssinatura: true` (ou removidas do cronograma futuro);
  - As cobranças passadas e do mês atual são rigorosamente preservadas no histórico;
  - A fatura e os limites são recomputados em tempo real.
