# Parecer de Arquitetura: Regra de 60 Dias e Módulo de Cartão de Crédito

**Projeto:** Do Negativo ao Milhão  
**Arquiteto:** Arquiteto de Software e Dados (Time Stella)  
**Data:** Outubro de 2026  
**Status:** Aprovado para Planejamento e Implementação  
**Alvo:** `app.js` e `index.html`  

---

## 1. VIABILIDADE TÉCNICA

### 1.1 Parecer Geral
**A implementação é 100% VIÁVEL sem qualquer refatoração destrutiva.**

O código atual de `app.js` foi desenhado com um modelo de dados centrado no estado global `S`, persistido no `localStorage` sob a chave `dnm_data` e replicado no Cloud Firestore na coleção `usuarios` via documento do usuário/família (`fbDb.collection('usuarios').doc(id).set(dataToSync)`).

A arquitetura do app opera com isolamento de responsabilidades entre:
1. **Modelagem de Estado:** `S` (estruturado em coleções simples de objetos planos).
2. **Cálculos Derivados Puros:** `calcTotais()`, `calcTotaisAno()`, `calcSaldoAcumuladoAnterior()`, `gastosDoMes()`, `gastosInadimplentesDoMes()`.
3. **Renderização Declarativa Vanilla:** Funções `render()`, `renderResumo()`, `renderGastos()`, `renderDividas()`, etc.

As duas novas funcionalidades (Regra de 60 Dias e Cartão de Crédito) encaixam-se de forma **puramente aditiva**, estendendo o schema existente sem alterar a assinatura pública nem o contrato fundamental das funções core.

### 1.2 Análise de Riscos Técnicos e Salvaguardas
- **Risco de Duplicidade na Migração (60 Dias):** O gatilho de migração automática poderia gerar duplicações se executado repetidamente.  
  *Salvaguarda:* Idempotência estrita baseada em flags de estado (`migradoDivida: true`, `dividaCriadaId`) e deduplicação de parcelamentos pelo `grupoId`.
- **Risco de Dupla Contagem no Fluxo de Caixa (Cartão de Crédito):** Se as compras do cartão e a fatura consolidada fossem ambas somadas no total de gastos, o valor seria duplicado.  
  *Salvaguarda:* Compras avulsas de cartão são computadas exclusivamente dentro da fatura correspondente (`S.comprasCartao` e `S.faturasCartao`). A listagem de gastos e o cálculo mensal recebem unicamente a fatura consolidada do mês.
- **Risco de Imprecisão nos Juros do Rotativo:** Cálculos com floats no JavaScript (`0.1 + 0.2`) geram dízimas indesejadas em valores financeiros.  
  *Salvaguarda:* Aritmética estrita em centavos inteiros (`Math.round`) antes de converter para representação de exibição.

---

## 2. MODELAGEM DE DADOS E RETROCOMPATIBILIDADE

### 2.1 Schema Global Atualizado (`S`)

```typescript
interface StateGlobal {
  receitas: Receita[];
  gastos: Gasto[];
  dividas: Divida[];
  metas: Meta[];
  investimentos: Investimento[];
  cartoes: CartaoCredito[];          // [NOVO]
  comprasCartao: CompraCartao[];      // [NOVO]
  faturasCartao: FaturaCartao[];      // [NOVO]
  membrosFamilia: string[];
  categoriasGastos: CategoriaGasto[];
  tiposDivida: TipoDivida[];
  chat: ChatMessage[];
  apiKey: string;
  onboardingDone: boolean;
}
```

### 2.2 Novas Entidades

#### Entidade `CartaoCredito` (`S.cartoes`)
```typescript
interface CartaoCredito {
  id: number;                 // Timestamp único (ex: Date.now())
  nome: string;               // Ex: "Nubank Ultravioleta", "Inter Gold"
  titular: string;            // Membro da família responsável
  taxaRotativo: number;       // Percentual mensal do rotativo/atraso (ex: 14.5 para 14,5% a.m.)
  diaVencimento: number;      // Dia de vencimento da fatura (1 a 31)
  diaFechamento: number;      // Dia de fechamento da fatura (opcional, padrão: vencimento - 7)
  anuidade: {
    possui: boolean;          // Se o cartão cobra anuidade
    valorTotal: number;       // Valor total da anuidade (ex: 420.00)
    parcelas: number;         // Quantidade de parcelas (ex: 12)
    valorParcela: number;     // Valor de cada parcela (ex: 35.00)
    mesInicio: string;        // "YYYY-MM" da primeira cobrança
  };
  cor: string;                // Código visual (ex: 'purple', 'orange', 'blue', 'dark')
  ativo: boolean;             // Flag de arquivamento lógico
}
```

#### Entidade `CompraCartao` (`S.comprasCartao`)
```typescript
interface CompraCartao {
  id: number;                 // Timestamp único
  cartaoId: number;           // FK -> CartaoCredito.id
  desc: string;               // Descrição da compra (ex: "Supermercado Pão de Açúcar")
  val: number;                // Valor da parcela neste mês (em reais com 2 casas)
  valTotal: number;           // Valor total da compra
  cat: string;                // ID da categoria de gasto (recorrente, lazer, etc.)
  data: string;               // Data da compra (YYYY-MM-DD)
  mesFatura: string;          // Competência da fatura (YYYY-MM)
  titular: string;            // Membro da família
  parcelado: boolean;         // Se é compra parcelada
  parcelaNum: number;         // Número da parcela (ex: 1)
  totalParcelas: number;      // Total de parcelas (ex: 6)
  grupoId: string;            // Identificador comum de parcelas: "cparc_..."
  adiantada?: boolean;        // Se foi antecipada de mês futuro
  dataOriginal?: string;      // Data/competência original pré-antecipação
}
```

#### Entidade `FaturaCartao` (`S.faturasCartao`)
```typescript
interface FaturaCartao {
  id: string;                 // Chave natural composta: `${cartaoId}_${anoMes}`
  cartaoId: number;           // FK -> CartaoCredito.id
  mes: string;                // "YYYY-MM"
  valorTotal: number;         // Valor consolidado (compras + parcelas + anuidade + rotativo)
  valorPago: number;          // Valor pago pelo usuário
  pago: boolean;              // Quitação total (valorPago >= valorTotal)
  dataPagto: string | null;   // Data do pagamento
  pagoParcial: boolean;       // Se houve pagamento menor que o total
  saldoRotativoOrigem: number;// Saldo não pago do mês anterior
  encargosRotativo: number;   // Juros incidentes do rotativo
  negativada: boolean;        // Flag da regra de 60 dias
  dividaId: number | null;    // FK -> Divida.id gerada na negativação
}
```

### 2.3 Extensão das Entidades Existentes

#### Extensão em `Gasto` (`S.gastos`)
```typescript
interface GastoExtensao {
  // Propriedades existentes preservadas intactas:
  id: number;
  desc: string;
  val: number;
  cat: string;
  data: string;
  titular: string;
  pago: boolean;
  parcelado: boolean;
  recorrente: boolean;
  grupoId?: string;
  // Novas propriedades aditivas:
  migradoDivida?: boolean;          // true se foi negativado e transferido para S.dividas
  dividaCriadaId?: number;          // ID da dívida gerada em S.dividas
  canceladaNegativacao?: boolean;   // true para parcelas futuras invalidadas pela inadimplência
  isFaturaCartao?: boolean;         // true se esta linha representa a fatura consolidada no mês
  cartaoId?: number;                // FK do cartão caso isFaturaCartao seja true
}
```

#### Extensão em `Divida` (`S.dividas`)
```typescript
interface DividaExtensao {
  // Propriedades existentes preservadas intactas:
  id: number;
  credor: string;
  saldo: number;
  juros: number;
  parcela: number;
  tipo: string;
  titular: string;
  quitada: boolean;
  valorQuitado: number | null;
  dataQuitacao: string | null;
  acordo: AcordoDivida | null;
  // Novas propriedades aditivas:
  origemNegativacao?: {
    tipoOrigem: 'gasto_avulso' | 'parcelamento' | 'recorrente' | 'fatura_cartao';
    gastoId?: number;
    cartaoId?: number;
    grupoId?: string;
    mesVencimentoOriginal: string;
    dataNegativacao: string;
    parcelasCanceladas?: number;
    saldoOriginal: number;
  };
}
```

### 2.4 Retrocompatibilidade com `localStorage` e Cloud Firestore
Em `loadState()`:
```javascript
if (!S.cartoes) S.cartoes = [];
if (!S.comprasCartao) S.comprasCartao = [];
if (!S.faturasCartao) S.faturasCartao = [];

(S.gastos || []).forEach(g => {
  if (g.migradoDivida === undefined) g.migradoDivida = false;
  if (g.canceladaNegativacao === undefined) g.canceladaNegativacao = false;
});

(S.dividas || []).forEach(d => {
  if (d.origemNegativacao === undefined) d.origemNegativacao = null;
});
```
- **Firestore:** O Cloud Firestore armazena documentos schemaless em formato JSON/Map. A inclusão de `cartoes`, `comprasCartao` e `faturasCartao` não gera nenhum conflito nem requer migração de banco de dados remota.
- **LocalStorage:** `JSON.parse` funde com as novas propriedades com zero risco de quebra de cache.

---

## 3. IMPACTO NOS CÁLCULOS FINANCEIROS

### 3.1 Regra de 60 Dias nos Gastos e Inadimplência
A função de inadimplência atual:
```javascript
function gastosInadimplentesDoMes(){
  return (S.gastos||[]).filter(g => (g.data||'').slice(0,7) < mesAtual && !g.pago && !g.negociado);
}
```
**Evolução necessária:**
Um gasto que esteja em atraso há mais de 60 dias (ou seja, cuja competência original seja `>= 2 meses` anterior ao mês atual):
1. **Sai do cálculo de inadimplência mensal:**
   ```javascript
   function gastosInadimplentesDoMes(){
     return (S.gastos||[]).filter(g => 
       (g.data||'').slice(0,7) < mesAtual && 
       !g.pago && 
       !g.negociado && 
       !g.migradoDivida
     );
   }
   ```
2. **Entra no consolidado de Dívidas:**
   O saldo devedor consolidado passa a ser somado na aba Dívidas via `calcTotais().totalDiv`.
   Desta forma:
   - A inadimplência de 30 dias (1 mês anterior) permanece visível no box de alerta de `Gastos` para pagamento imediato.
   - A inadimplência grave (>= 60 dias) migra para a lista de prioridades e negociação de passivos na aba `Dívidas`.

### 3.2 Faturas de Cartão no Cálculo de Totais
Na listagem e apuração de despesas:
- O consolidado da fatura de cada cartão entra em `gastosDoMes()` como uma despesa única (`isFaturaCartao = true`).
- Compras individuais (`S.comprasCartao`) **NÃO** são somadas separadamente em `calcTotais()`, eliminando risco de dupla contagem.
- As categorias de gastos no card `breakdown-gastos` continuam somando as compras individuais por categoria, permitindo análise precisa de estilo de vida (alimentação, lazer, transporte).

### 3.3 Preservação de `calcSaldoAcumuladoAnterior(targetYM)`
Atualmente, o saldo acumulado de meses anteriores é calculado por:
```javascript
const gasPagos = (S.gastos || []).filter(g => (g.data||'').slice(0,7) === ym && g.pago && !g.negociado).reduce((s,g) => s + g.val, 0);
```
Como gastos não pagos nunca foram subtraídos das sobras de caixa do passado (`g.pago === true`), a transferência de um gasto não pago para Dívidas mantém rigorosamente inalterado o saldo acumulado de meses anteriores!

### 3.4 Pagamento Parcial e Rolagem do Rotativo (Fórmula Financeira)
Quando o usuário registra um pagamento parcial de fatura:
$$\text{Saldo Devedor Remanescente} = \text{Valor Total da Fatura} - \text{Valor Pago}$$
$$\text{Encargos do Rotativo} = \text{round}\left(\text{Saldo Devedor Remanescente} \times \frac{\text{taxaRotativo}}{100}\right)$$
$$\text{Rolagem para o Mês Seguinte} = \text{Saldo Devedor Remanescente} + \text{Encargos do Rotativo}$$

Todos os cálculos usam números inteiros em centavos (`Math.round(val * 100) / 100`) para garantir exatidão monetária.

---

## 4. GARANTIA DE REGRESSÃO ZERO

| Funcionalidade Existente | Risco Teórico | Mecanismo de Proteção / Regressão Zero |
|---|---|---|
| **Dívidas Normais Cadastradas** | Colisão com dívidas migradas | Dívidas manuais mantêm `origemNegativacao: null`. As regras de quitação, juros e acordos operam de modo idêntico para ambas. |
| **Parcelamento de Gastos Atual** | Conflito de `grupoId` | Parcelamentos normais continuam usando prefixo `parc_`. Parcelamentos de cartão usarão `cparc_`. |
| **Adiantamento de Parcelas** | Quebra em `abrirModalAdiantar` | A função `abrirModalAdiantar` segue operando diretamente sobre `S.gastos` com `grupoId` tradicional. O cartão terá sua própria modal de antecipação ou método compatível. |
| **Investimentos e Aportes** | Alteração no cálculo de sobras | `investimentosDoMes` e dedução em `calcTotais` não possuem dependência com `cartoes` nem com `migradoDivida`. |
| **OCR com Gemini Vision** | Quebra de preenchimento | O OCR preenche `g-val` e `g-desc`. A seleção do método de pagamento (Cartão ou Dinheiro) ocorre pós-leitura sem interferência. |
| **Sincronização Firebase Firestore** | Rejeição por regras de schema | Firestore aceita estruturas dinâmicas. O payload em `save()` é serializado como JSON limpo. |

---

## 5. FATIAMENTO TÉCNICO SUGERIDO

Para garantir execução segura, o desenvolvimento deve ser dividido em 4 fatias sequenciais:

### Fatia 1: Engine da Regra de 60 Dias (Inadimplência Crítica / Negativação)
- **Escopo:**
  - Criação da rotina idempotente `processarInadimplencia60Dias()`.
  - Tratamento de gastos avulsos vencidos há `>= 2 meses` (migração para `S.dividas`, marcação `migradoDivida: true`).
  - Tratamento de parcelamentos e gastos fixos (cancelamento das parcelas posteriores `canceladaNegativacao: true` e consolidação do saldo total devedor restante em uma única dívida na aba Dívidas).
  - Atualização do filtro em `gastosInadimplentesDoMes()` e `gastosPrevistosDoMes()`.
- **Validação de QA:** Criação de gastos não pagos no mês atual, 1 mês atrás e 3 meses atrás. Verificar se apenas o de 3 meses atrás migra para Dívidas e sai da aba Gastos.

### Fatia 2: Cadastro e Modelagem de Cartões de Crédito
- **Escopo:**
  - Atualização do estado `S` com `cartoes`, `comprasCartao` e `faturasCartao` em `loadState()`.
  - Opção no modal de novo gasto (`m-gasto`) para "Incluir Cartão de Crédito" e seleção de cartão para despesas.
  - Modal/Formulário de cadastro de cartão com nome, taxa de rotativo (% a.m.), anuidade (valor total e parcelas) e titular.
  - Persistência no `localStorage` e Firestore.
- **Validação de QA:** Criar 2 cartões de membros diferentes da família. Recarregar o app e atestar persistência íntegra.

### Fatia 3: Visualização no Topo de Gastos, Fatura Consolidada e Compras
- **Escopo:**
  - Renderização dos cartões fixos no topo da aba Gastos (`#cards-cartoes-topo`).
  - Exibição de cards modernos com nome, titular, valor da fatura do mês atual e status.
  - Clique no cartão abre o detalhamento da fatura (accordion ou modal) com lista de compras daquele mês.
  - Botão "+ Adicionar Compra" direto no cartão ou seleção do cartão no modal de gastos.
  - Geração automática das parcelas de anuidade na fatura mês a mês.
  - Listagem de gastos exibindo a linha consolidada da fatura (`💳 Fatura Nubank - R$ X.XXX,XX`) em vez de poluir a lista com comprinhas avulsas.
- **Validação de QA:** Lançar 5 compras em um cartão e 2 compras em dinheiro. Confirmar que na lista geral aparece apenas 1 fatura consolidada e as 2 compras em dinheiro.

### Fatia 4: Operações Financeiras de Fatura e Regra de 60 Dias do Cartão
- **Escopo:**
  - Operação de Pagamento Parcial: saldo devedor rola para a fatura do mês seguinte acrescido da taxa de rotativo configurada.
  - Operação de Antecipação de Faturas/Parcelas Futuras.
  - Aplicação da Regra de 60 Dias para faturas de cartão: fatura não paga há mais de 60 dias migra para a aba Dívidas como dívida negativada, cancelando parcelas futuras do cartão.
- **Validação de QA:** Simular pagamento parcial com juros e conferir centavo por centavo na fatura seguinte. Simular fatura atrasada há 2 meses e atestar migração para Dívidas.
