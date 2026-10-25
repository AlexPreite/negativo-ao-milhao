# Arquitetura Mestre: Super-App Organizador Familiar v2.0
## "Do Negativo ao Milhão" + FamilyWall + Agente Norte

**Projeto:** Do Negativo ao Milhão — Super-App Familiar  
**Arquiteto:** Arquiteto de Software e Dados (Time Stella)  
**Data:** Outubro de 2026  
**Status:** Aprovado para Planejamento e Execução  
**Documento de Referência:** Seção 9 das Diretrizes do Usuário (Alexsander)  

---

## 1. DIAGNÓSTICO DO CÓDIGO ATUAL E ESTRATÉGIA DE MODULARIZAÇÃO

### 1.1 Diagnóstico da Estrutura Atual
- **`app.js` (~4.876 linhas):** Monólito em Vanilla JavaScript contendo estado global `S`, persistência em `localStorage['dnm_data']`, sincronização com Firebase legado, OCR com Gemini Vision, motor contábil, cartões de crédito e regras de inadimplência.
- **`index.html` (~950 linhas):** Interface mobile-first baseada em container de 430px, paleta escura pura (`#0a0a0a`), estilos CSS embutidos e modais em sequência linear.
- **`sw.js` (43 linhas):** Service Worker PWA para cache estático dos arquivos básicos.

### 1.2 O que é 100% Reaproveitado e Preservado (Núcleo Inegociável)
Todo o núcleo contábil e de inteligência de crédito aprovado nas fases anteriores permanece estritamente íntegro:
1. **Motor Financeiro em Centavos Inteiros:** Algoritmos de apuração de `saldoMes`, `saldoAnterior`, `saldoDisp`, `calcTotais()`, `calcTotaisAno()`, `calcSaldoAcumuladoAnterior()` imunes a dízimas de ponto flutuante.
2. **Painel Verdinho (Caixa Real em Tempo Real):** Decomposição em `totalDisponivel`, `totalPago`, `saldoCaixaReal`, `totalPendente` e `saldoProjetado`.
3. **Módulo Completo de Cartões de Crédito:**
   - Fechamento determinístico (`calcularMesFaturaCompra`) considerando melhor dia de compra e vencimento;
   - Limite de crédito dinâmico (`calcularLimiteCartao`), separando parcelas futuras de assinaturas mensais;
   - Operações financeiras: quitação total, rolagem com rotativo, abatimento avulso com liberação de limite e antecipação;
   - Assinaturas recorrentes (`crec_`) com cancelamento pontual sem perda histórica.
4. **Regra de 60 Dias:** Negativação automática e idempotente com cancelamento de parcelas futuras e consolidação na aba Dívidas.
5. **Dívidas e Acordos:** Quitação, parcelamento de acordos e **Quebra de Acordo** com recomposição do passivo e juros.
6. **Investimentos e Agente Norte:** Juros compostos mensais vinculados a metas e prompt de contexto financeiro familiar com Gemini.

### 1.3 Riscos Técnicos e Estratégia de Modularização
Manter um monólito de 4.876 linhas agregando funcionalidades de calendário, cardápio, notas fiscais, VA/VR e documentos familiares geraria débito técnico insustentável.

**Estratégia de Modularização do Frontend:**
- Manter compatibilidade total com **PWA** e **GitHub Pages** (sem dependência de servidores Node.js em runtime ou ferramentas pesadas de build).
- Divisão em ES Modules nativos (`<script type="module" src="js/main.js">`) com separação de domínios:
  - `js/core/state.js`: Gerenciador de estado reativo unificado.
  - `js/core/auth.js`: Autenticação e sessão no Supabase.
  - `js/finance/engine.js`: Motor financeiro existente extraído sem alterar funções-chave.
  - `js/finance/cards.js`: Cartões, faturas, fechamento e limites.
  - `js/finance/benefits.js`: Carteiras VA/VR e split de pagamento.
  - `js/finance/ocr.js`: Scanner de cupons fiscais e notas fiscais com Gemini Vision.
  - `js/family/routine.js`: Calendário, refeições, grade horária e aniversários.
  - `js/family/lists.js`: Listas de compras e tarefas compartilhadas.
  - `js/family/vault.js`: Cofre seguro de documentos e pastas familiares.
  - `js/notifications/hub.js`: Central de notificações e feed de atividades.
  - `js/ai/agent.js`: Agente Norte multimodal.
  - `js/ui/theme.js`: Gerenciamento dos temas Claro e Escuro.

**Design System Familiar:**
- **Tema Claro / Lavanda (Padrão Acolhedor FamilyWall):**
  - Background base: `#F2F2F7` (Cinza Lavanda suave)
  - Cards e Superfícies: `#FFFFFF` com bordas `rgba(0,0,0,0.06)` e sombra suave `0 2px 8px rgba(0,0,0,0.04)`
  - Destaque Primário: `#5581E3` (Azul Royal elegante e amigável)
  - Caixa Real / Sucesso: `#10B981` (Verde Esmeralda vivo)
  - Alertas / Atenção: `#F59E0B` (Âmbar) e `#EF4444` (Coral)
- **Tema Escuro Atual (Preservado e chaveável):**
  - Background `#0A0A0A`, Cards `#141414`, Bordas `rgba(255,255,255,0.08)`.

---

## 2. ESQUEMA COMPLETO DO BANCO DE DADOS (POSTGRES / SUPABASE) + RLS

O banco de dados é modelado com rigor relacional, tipos fortes, índices de alta performance e isolamento rigoroso por Círculo Familiar via **Row-Level Security (RLS)**.

### 2.1 Domínio 1: Núcleo Familiar (Identidade e Acesso)

```sql
-- Círculos Familiares
CREATE TABLE circulos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  criado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Membros do Círculo Familiar
CREATE TABLE membros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  papel TEXT NOT NULL CHECK (papel IN ('admin', 'membro', 'crianca')),
  cor TEXT NOT NULL DEFAULT '#5581E3',
  avatar_url TEXT,
  data_nascimento DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_membro_circulo UNIQUE (user_id, circulo_id)
);

-- Convites para Ingresso Familiar
CREATE TABLE convites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  codigo TEXT UNIQUE NOT NULL,
  papel_proposto TEXT NOT NULL DEFAULT 'membro' CHECK (papel_proposto IN ('admin', 'membro', 'crianca')),
  expira_em TIMESTAMPTZ NOT NULL,
  criado_por UUID REFERENCES membros(id),
  usado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_membros_circulo ON membros(circulo_id);
CREATE INDEX idx_membros_user ON membros(user_id);
```

### 2.2 Domínio 2: Finanças e Cartões (Evolução de `S`)

*Regra de Ouro: Todo valor monetário é armazenado em `BIGINT` representando centavos inteiros.*

```sql
-- Categorias de Finanças
CREATE TABLE categorias (
  id TEXT NOT NULL,
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cor TEXT DEFAULT '#5581E3',
  tipo TEXT NOT NULL DEFAULT 'gasto' CHECK (tipo IN ('gasto', 'receita', 'ambos')),
  PRIMARY KEY (id, circulo_id)
);

-- Lançamentos Financeiros Gerais (Receitas e Despesas Avulsas/Parceladas/Recorrentes)
CREATE TABLE lancamentos_financeiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa', 'transferencia')),
  descricao TEXT NOT NULL,
  valor_centavos BIGINT NOT NULL,
  categoria_id TEXT,
  data_competencia DATE NOT NULL,
  pago BOOLEAN NOT NULL DEFAULT false,
  data_pagamento DATE,
  origem_pagamento TEXT NOT NULL DEFAULT 'conta_corrente' CHECK (origem_pagamento IN ('conta_corrente', 'dinheiro', 'VA', 'VR', 'cartao', 'split')),
  split_detalhe JSONB, -- Ex: [{"origem": "VA", "valor_centavos": 8000}, {"origem": "conta_corrente", "valor_centavos": 2000}]
  parcelado BOOLEAN NOT NULL DEFAULT false,
  parcela_num INT DEFAULT 1,
  total_parcelas INT DEFAULT 1,
  grupo_id TEXT,
  recorrente BOOLEAN NOT NULL DEFAULT false,
  negativado BOOLEAN NOT NULL DEFAULT false,
  migrado_divida BOOLEAN NOT NULL DEFAULT false,
  cancelado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_lancamentos_circulo_competencia ON lancamentos_financeiros(circulo_id, data_competencia);
CREATE INDEX idx_lancamentos_grupo ON lancamentos_financeiros(grupo_id);

-- Cartões de Crédito
CREATE TABLE cartoes_credito (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  titular_membro_id UUID REFERENCES membros(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  dia_fechamento INT NOT NULL CHECK (dia_fechamento BETWEEN 1 AND 31),
  dia_vencimento INT NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
  limite_total_centavos BIGINT NOT NULL DEFAULT 0,
  taxa_rotativo NUMERIC(5,2) NOT NULL DEFAULT 0,
  anuidade JSONB NOT NULL DEFAULT '{"possui": false, "valor_parcela_centavos": 0, "parcelas": 0, "mes_inicio": ""}'::jsonb,
  cor TEXT NOT NULL DEFAULT '#5581E3',
  ativo BOOLEAN NOT NULL DEFAULT true,
  negativado BOOLEAN NOT NULL DEFAULT false,
  data_negativacao DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Compras e Parcelamentos no Cartão de Crédito
CREATE TABLE compras_cartao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartao_id UUID REFERENCES cartoes_credito(id) ON DELETE CASCADE,
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  valor_parcela_centavos BIGINT NOT NULL,
  valor_total_centavos BIGINT NOT NULL,
  categoria_id TEXT,
  data_compra DATE NOT NULL,
  mes_fatura TEXT NOT NULL, -- YYYY-MM
  parcelado BOOLEAN NOT NULL DEFAULT false,
  parcela_num INT DEFAULT 1,
  total_parcelas INT DEFAULT 1,
  grupo_id TEXT,
  recorrente BOOLEAN NOT NULL DEFAULT false,
  assinatura BOOLEAN NOT NULL DEFAULT false,
  cancelada BOOLEAN NOT NULL DEFAULT false,
  adiantada BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_compras_cartao_mes ON compras_cartao(cartao_id, mes_fatura);

-- Faturas Consolidadas Mensais
CREATE TABLE faturas_cartao (
  id TEXT PRIMARY KEY, -- `${cartao_id}_${mes}`
  cartao_id UUID REFERENCES cartoes_credito(id) ON DELETE CASCADE,
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  mes TEXT NOT NULL, -- YYYY-MM
  valor_total_centavos BIGINT NOT NULL DEFAULT 0,
  valor_pago_centavos BIGINT NOT NULL DEFAULT 0,
  pago BOOLEAN NOT NULL DEFAULT false,
  pago_parcial BOOLEAN NOT NULL DEFAULT false,
  saldo_restante_centavos BIGINT NOT NULL DEFAULT 0,
  rotativo_rolado_centavos BIGINT NOT NULL DEFAULT 0,
  rotativo_detalhe JSONB,
  data_pagamento DATE,
  negativada BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Dívidas e Acordos
CREATE TABLE dividas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id) ON DELETE SET NULL,
  credor TEXT NOT NULL,
  saldo_centavos BIGINT NOT NULL,
  saldo_original_centavos BIGINT NOT NULL,
  juros_mensal NUMERIC(5,2) DEFAULT 0,
  tipo TEXT DEFAULT 'outro',
  quitada BOOLEAN NOT NULL DEFAULT false,
  valor_quitado_centavos BIGINT,
  data_quitacao DATE,
  negativada BOOLEAN NOT NULL DEFAULT false,
  origem_cartao_id UUID REFERENCES cartoes_credito(id),
  origem_grupo_id TEXT,
  origem_gasto_id UUID,
  acordo JSONB, -- { valor_total_centavos, entrada_centavos, num_parcelas, parcelas: [...] }
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Metas e Investimentos
CREATE TABLE metas_sonhos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valor_alvo_centavos BIGINT NOT NULL,
  valor_atual_centavos BIGINT NOT NULL DEFAULT 0,
  prazo DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE investimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id) ON DELETE SET NULL,
  meta_id UUID REFERENCES metas_sonhos(id) ON DELETE SET NULL,
  banco TEXT NOT NULL,
  tipo TEXT NOT NULL,
  valor_inicial_centavos BIGINT NOT NULL,
  taxa_mensal NUMERIC(5,2) DEFAULT 0,
  data_inicio DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.3 Domínio 3: Benefícios VA / VR (Seção 4.12)

```sql
-- Carteiras de Benefícios (VA / VR)
CREATE TABLE carteiras_beneficio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('VA', 'VR')),
  saldo_atual_centavos BIGINT NOT NULL DEFAULT 0,
  valor_mensal_recarga_centavos BIGINT NOT NULL DEFAULT 0,
  dia_recarga INT NOT NULL CHECK (dia_recarga BETWEEN 1 AND 31),
  acumula_saldo BOOLEAN NOT NULL DEFAULT true,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_carteira_membro_tipo UNIQUE (membro_id, tipo)
);

-- Histórico de Movimentações da Carteira
CREATE TABLE movimentos_carteira (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carteira_id UUID REFERENCES carteiras_beneficio(id) ON DELETE CASCADE,
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  tipo_movimento TEXT NOT NULL CHECK (tipo_movimento IN ('recarga_automatica', 'recarga_manual', 'debito', 'estorno')),
  valor_centavos BIGINT NOT NULL,
  lancamento_id UUID REFERENCES lancamentos_financeiros(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  data_movimento DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_movimentos_carteira ON movimentos_carteira(carteira_id, data_movimento);
```

### 2.4 Domínio 4: OCR de Notas Fiscais e Cupom Fiscal (Seção 4.14)

```sql
CREATE TABLE notas_fiscais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id) ON DELETE SET NULL,
  storage_path TEXT,
  qr_code_url TEXT,
  hash_antiduplicidade TEXT NOT NULL, -- SHA-256(CNPJ + Número + Série + Data + Valor)
  estabelecimento TEXT,
  cnpj TEXT,
  data_emissao DATE,
  valor_total_centavos BIGINT NOT NULL,
  status_conferencia TEXT NOT NULL DEFAULT 'pendente' CHECK (status_conferencia IN ('pendente', 'conferido', 'lancado', 'rejeitado')),
  json_extraido JSONB, -- Array de itens com { nome, qtd, valor_unit_centavos, valor_total_centavos, categoria_sugerida }
  lancamento_id UUID REFERENCES lancamentos_financeiros(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_nota_hash_circulo UNIQUE (circulo_id, hash_antiduplicidade)
);
```

### 2.5 Domínio 5: Rotina Familiar (FamilyWall Core)

```sql
-- Calendário Familiar Unificado
CREATE TABLE eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ,
  dia_inteiro BOOLEAN DEFAULT false,
  cor TEXT DEFAULT '#5581E3',
  categoria TEXT DEFAULT 'geral' CHECK (categoria IN ('geral', 'medico', 'escola', 'lazer', 'financa', 'aniversario')),
  rrule TEXT, -- Regra iCalendar para repetições automáticas
  participantes UUID[] DEFAULT '{}', -- Array de membros(id)
  conta_pagar_id UUID REFERENCES lancamentos_financeiros(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_eventos_inicio ON eventos(circulo_id, data_inicio);

-- Lembretes
CREATE TABLE lembretes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  data_hora TIMESTAMPTZ NOT NULL,
  atribuido_a UUID REFERENCES membros(id) ON DELETE SET NULL,
  concluido BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Listas Compartilhadas (Compras, Tarefas, Malas)
CREATE TABLE listas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'compras' CHECK (tipo IN ('compras', 'tarefas', 'livre')),
  icone TEXT DEFAULT '🛒',
  cor TEXT DEFAULT '#5581E3',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE itens_lista (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lista_id UUID REFERENCES listas(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  concluido BOOLEAN NOT NULL DEFAULT false,
  concluido_por UUID REFERENCES membros(id) ON DELETE SET NULL,
  concluido_em TIMESTAMPTZ,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_itens_lista ON itens_lista(lista_id);

-- Mensagens do Mural e Chat Familiar
CREATE TABLE mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id) ON DELETE SET NULL,
  conteudo TEXT NOT NULL,
  fixado_mural BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cardápio Semanal e Receitas
CREATE TABLE receitas_culinarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  ingredientes JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ "item": "Arroz", "qtd": "1kg" }]
  modo_preparo TEXT,
  tempo_minutos INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE refeicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  turno TEXT NOT NULL CHECK (turno IN ('cafe', 'almoco', 'jantar', 'lanche')),
  prato TEXT NOT NULL,
  receita_id UUID REFERENCES receitas_culinarias(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cofre de Documentos
CREATE TABLE pastas_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL, -- 'Privado', 'Educação', 'Casa', 'Família'
  privada BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pasta_id UUID REFERENCES pastas_documentos(id) ON DELETE CASCADE,
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  validade DATE,
  membro_dono_id UUID REFERENCES membros(id) ON DELETE SET NULL,
  alerta_vencimento BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Grade Horária Escolar
CREATE TABLE grade_horaria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id) ON DELETE CASCADE,
  dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  materia_atividade TEXT NOT NULL,
  sala_local TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Aniversários e Contatos
CREATE TABLE aniversarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id) ON DELETE SET NULL,
  nome_pessoa TEXT NOT NULL,
  data_aniversario DATE NOT NULL,
  aviso_dias_antes INT NOT NULL DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  categoria TEXT DEFAULT 'servico' CHECK (categoria IN ('emergencia', 'medico', 'escola', 'servico', 'pessoal')),
  telefone TEXT NOT NULL,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.6 Domínio 6: Tempo Real, Notificações e Auditoria (Seções 4.13 e 4.17)

```sql
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  destinatario_membro_id UUID REFERENCES membros(id) ON DELETE CASCADE, -- NULL = broadcast para o círculo
  tipo TEXT NOT NULL CHECK (tipo IN ('financeiro', 'lista', 'evento', 'documento', 'mural', 'sistema')),
  titulo TEXT NOT NULL,
  corpo TEXT NOT NULL,
  dados_link JSONB,
  lida BOOLEAN NOT NULL DEFAULT false,
  chave_agrupamento TEXT, -- Anti-spam: agrupa múltiplos itens de lista em um único aviso
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notificacoes_membro ON notificacoes(destinatario_membro_id, lida, created_at);

CREATE TABLE preferencias_notificacao (
  membro_id UUID PRIMARY KEY REFERENCES membros(id) ON DELETE CASCADE,
  push_ativo BOOLEAN NOT NULL DEFAULT true,
  aviso_contas_vencer BOOLEAN NOT NULL DEFAULT true,
  aviso_lista_compras BOOLEAN NOT NULL DEFAULT true,
  aviso_eventos_dia BOOLEAN NOT NULL DEFAULT true,
  aviso_documentos BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.7 Políticas de Row-Level Security (RLS) e Blindagem do Papel `crianca`

```sql
-- Ativação compulsória de RLS em todas as tabelas
ALTER TABLE circulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE convites ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE lancamentos_financeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoes_credito ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras_cartao ENABLE ROW LEVEL SECURITY;
ALTER TABLE faturas_cartao ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividas ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas_sonhos ENABLE ROW LEVEL SECURITY;
ALTER TABLE investimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE carteiras_beneficio ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentos_carteira ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_fiscais ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE lembretes ENABLE ROW LEVEL SECURITY;
ALTER TABLE listas ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_lista ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE receitas_culinarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE refeicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pastas_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_horaria ENABLE ROW LEVEL SECURITY;
ALTER TABLE aniversarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferencias_notificacao ENABLE ROW LEVEL SECURITY;

-- Funções Auxiliares de Segurança (Security Definer)
CREATE OR REPLACE FUNCTION get_user_circulo_ids() 
RETURNS SETOF UUID AS $$
  SELECT circulo_id FROM membros WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_papel(p_circulo_id UUID) 
RETURNS TEXT AS $$
  SELECT papel FROM membros WHERE user_id = auth.uid() AND circulo_id = p_circulo_id LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS Círculos e Membros
CREATE POLICY "Membros acessam seu próprio círculo" ON circulos 
  FOR ALL USING (id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Membros visualizam participantes do mesmo círculo" ON membros 
  FOR SELECT USING (circulo_id IN (SELECT get_user_circulo_ids()));

-- BLINDAGEM DO PERFIL 'CRIANÇA' (Zero Visibilidade Financeira)
CREATE POLICY "Adultos acessam finanças" ON lancamentos_financeiros 
  FOR ALL USING (
    circulo_id IN (SELECT get_user_circulo_ids()) 
    AND get_user_papel(circulo_id) IN ('admin', 'membro')
  );

CREATE POLICY "Adultos acessam cartões" ON cartoes_credito 
  FOR ALL USING (
    circulo_id IN (SELECT get_user_circulo_ids()) 
    AND get_user_papel(circulo_id) IN ('admin', 'membro')
  );

CREATE POLICY "Adultos acessam compras de cartão" ON compras_cartao 
  FOR ALL USING (
    circulo_id IN (SELECT get_user_circulo_ids()) 
    AND get_user_papel(circulo_id) IN ('admin', 'membro')
  );

CREATE POLICY "Adultos acessam faturas" ON faturas_cartao 
  FOR ALL USING (
    circulo_id IN (SELECT get_user_circulo_ids()) 
    AND get_user_papel(circulo_id) IN ('admin', 'membro')
  );

CREATE POLICY "Adultos acessam dívidas" ON dividas 
  FOR ALL USING (
    circulo_id IN (SELECT get_user_circulo_ids()) 
    AND get_user_papel(circulo_id) IN ('admin', 'membro')
  );

CREATE POLICY "Adultos acessam investimentos" ON investimentos 
  FOR ALL USING (
    circulo_id IN (SELECT get_user_circulo_ids()) 
    AND get_user_papel(circulo_id) IN ('admin', 'membro')
  );

CREATE POLICY "Adultos acessam benefícios VA/VR" ON carteiras_beneficio 
  FOR ALL USING (
    circulo_id IN (SELECT get_user_circulo_ids()) 
    AND get_user_papel(circulo_id) IN ('admin', 'membro')
  );

CREATE POLICY "Adultos acessam movimentos VA/VR" ON movimentos_carteira 
  FOR ALL USING (
    circulo_id IN (SELECT get_user_circulo_ids()) 
    AND get_user_papel(circulo_id) IN ('admin', 'membro')
  );

CREATE POLICY "Adultos acessam notas fiscais" ON notas_fiscais 
  FOR ALL USING (
    circulo_id IN (SELECT get_user_circulo_ids()) 
    AND get_user_papel(circulo_id) IN ('admin', 'membro')
  );

-- PROTEÇÃO DO COFRE DE DOCUMENTOS
CREATE POLICY "Acesso a pastas públicas e privadas" ON pastas_documentos 
  FOR ALL USING (
    circulo_id IN (SELECT get_user_circulo_ids()) 
    AND (privada = false OR get_user_papel(circulo_id) IN ('admin', 'membro'))
  );

CREATE POLICY "Acesso a documentos com base na pasta" ON documentos 
  FOR ALL USING (
    circulo_id IN (SELECT get_user_circulo_ids()) 
    AND pasta_id IN (
      SELECT id FROM pastas_documentos 
      WHERE privada = false OR get_user_papel(circulo_id) IN ('admin', 'membro')
    )
  );

-- ACESSO COMPARTILHADO DA FAMÍLIA (Inclusive Crianças)
CREATE POLICY "Todos acessam eventos da rotina" ON eventos 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Todos acessam listas" ON listas 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Todos interagem com itens de lista" ON itens_lista 
  FOR ALL USING (lista_id IN (SELECT id FROM listas WHERE circulo_id IN (SELECT get_user_circulo_ids())));

CREATE POLICY "Todos acessam mural e chat" ON mensagens 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Todos visualizam cardápio" ON refeicoes 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Todos visualizam grade horária" ON grade_horaria 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));
```

---

## 3. ARQUITETURA OFFLINE-FIRST E MIGRAÇÃO SEM PERDA

```
+-----------------------------------------------------------------------+
|                              NAVEGADOR / PWA                          |
|                                                                       |
|   +-------------------+    Lê/Escreve    +------------------------+   |
|   | UI / Telas App    | <=============> |  Cache Local IndexedDB |   |
|   +-------------------+  (Zero Latency)  +------------------------+   |
|             |                                         |               |
|             | Gera Ação de Mutação                    |               |
|             v                                         v               |
|   +-------------------+                   +-----------------------+   |
|   | Fila de Mutações  |                   | Snapshot Backup       |   |
|   | (outbox / queue)  |                   | 'dnm_backup_v1'       |   |
|   +-------------------+                   +-----------------------+   |
+-------------|---------------------------------------------------------+
              | Background Sync (Online)
              v
+-----------------------------------------------------------------------+
|                    SUPABASE CLOUD (PostgreSQL + RLS)                  |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   | Tabelas com RLS + Realtime WebSockets                         |   |
|   | Resolução Last-Write-Wins (LWW) via coluna 'updated_at'       |   |
|   +---------------------------------------------------------------+   |
+-----------------------------------------------------------------------+
```

### 3.1 Camada Offline-First (`sync_queue / outbox`)
1. **Cache Local Primário (IndexedDB):** Toda interação na tela atualiza o estado local imediatamente. A UI não espera a rede para responder.
2. **Outbox Pattern:** Mutações são gravadas na tabela local `outbox`. Cada registro contém `{ id, tabela, operacao, dados, timestamp, status }`.
3. **Background Worker:** Quando a conexão com a internet é restaurada (`window.ononline` ou ativação do Service Worker), o despachante envia as mutações em lote para o Supabase.
4. **Resolução de Conflitos:** Aplica Last-Write-Wins (LWW) baseado em `updated_at`. Caso ocorra divergência em registros financeiros críticos, o sistema mantém o valor mais recente e emite uma notificação de auditoria para o administrador familiar.

### 3.2 Ritual de Migração Imutável de Dados Legados
Para os usuários atuais com dados armazenados em `localStorage['dnm_data']`:
1. **Snapshot de Segurança Imediato:**
   Na primeira execução pós-upgrade, antes de qualquer escrita, o script gera uma cópia fria imutável:
   `localStorage.setItem('dnm_backup_v1_' + Date.now(), localStorage.getItem('dnm_data'))`.
2. **Parser e Validação Contábil:**
   O migrador carrega o objeto `S` legado, checa integridade de centavos e gera os registros estruturados.
3. **Carga no Supabase:**
   Vincula os dados ao `circulo_id` autenticado. Em caso de falha de conexão, os dados permanecem salvos localmente e a tentativa é retomada no próximo ciclo.
4. **Marcação e Confirmação:**
   Registra `dnm_migrated_v2 = true` e notifica o usuário sobre a importação bem-sucedida de todas as suas receitas, despesas, faturas, limites e acordos.

---

## 4. PLANO DE ENTREGA PASSO A PASSO (ORDEM DE EXECUÇÃO)

O plano obedece à governança estrita do Time Stella: cada etapa é autônoma, validável funcionalmente e com garantia inegociável de zero regressão.

### 4.1 Sequência da Fase 1: Fundação, Migração e Super-App Core

| Etapa | Nome da Etapa | Entregáveis Técnicos | Critério de Aceite / Portão QA |
|---|---|---|---|
| **Etapa 1** | **Infraestrutura Supabase & RLS** | Script DDL completo, índices, tabelas, funções RLS e buckets Storage | Teste de RLS: Perfil `crianca` retorna zero registros em finanças; perfil `admin` acessa seu círculo. |
| **Etapa 2** | **Shell Modular & Design System** | Nova casca com navegação (Início, Calendário, Finanças, Listas, Mais) e temas Claro Lavanda (`#F2F2F7` / `#5581E3`) e Escuro | PWA carrega fluidamente em tela cheia mobile; alternância de tema instantânea. |
| **Etapa 3** | **Migrador Legado & Offline-First** | Backup `dnm_backup_v1`, outbox de mutações e cache IndexedDB | Importação de base legada sem perda de dados; adição de despesa offline sincroniza ao reconectar. |
| **Etapa 4** | **Reimplantação do Motor Financeiro** | Módulos `engine.js` e `cards.js` integrando Caixa Real, Fechamento/Limite, 60 dias e Acordos | 100% dos testes contábeis aprovados: zero divergência de centavos em relação ao monólito legado. |
| **Etapa 5** | **Benefícios VA / VR & Split** | Carteiras de alimentação/refeição com recarga mensal e seletor de split nos gastos | Lançamento de supermercado debitando parcialmente de VA e conta corrente atualiza ambos os saldos. |
| **Etapa 6** | **Calendário & Rotina Familiar** | Calendário com eventos rrule, grade escolar, aniversários e contas a vencer | Contas cadastradas em Finanças geram evento visual no calendário familiar com cor correspondente. |
| **Etapa 7** | **Listas, Mural & Cofre Familiar** | Listas de compras/tarefas colaborativas, receitas que geram ingredientes e cofre de documentos | Edição de lista reflete em tempo real em outro aparelho; documentos privados bloqueados para crianças. |
| **Etapa 8** | **OCR de Cupom Fiscal & Notificações** | Scanner Gemini Vision multimodal para notas fiscais, hash antiduplicidade e hub de notificações | Foto de cupom fiscal extrai itens e total; notificação agrupa adições na lista de compras. |

### 4.2 Sequência da Fase 2: Expansão Avançada
- **Etapa 9 (Modo Criança & Mesada Educativa):** Interface lúdica com tarefas gamificadas da rotina e cofre de mesada vinculado a tarefas cumpridas.
- **Etapa 10 (Relatórios & Agente Norte Familiar):** Visão holística de consumo familiar por membro, comparativo de gastos em mercado e recomendações proativas do Agente Norte para aceleração do patrimônio familiar rumo ao milhão.

---

**Conclusão do Arquiteto:**  
O desenho arquitetural mestre do Super-App Familiar v2.0 entrega exatamente a visão do usuário Alexsander: robustez contábil inegociável, isolamento familiar completo no Supabase, autonomia saudável para as crianças e experiência unificada de gestão familiar diária. Documento pronto para governança e execução.
