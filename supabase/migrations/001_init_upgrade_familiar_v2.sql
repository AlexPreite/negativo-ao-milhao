-- ==============================================================================
-- MIGRAÇÃO 001: SUPABASE / POSTGRESQL - UPGRADE FAMILIAR V2.0
-- "Do Negativo ao Milhão" + Super-App Familiar (FamilyWall Core)
-- ==============================================================================

-- 1. NÚCLEO FAMILIAR (IDENTIDADE E ACESSO)

CREATE TABLE IF NOT EXISTS circulos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  codigo_convite TEXT UNIQUE,
  criado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS membros (
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

CREATE TABLE IF NOT EXISTS convites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  codigo TEXT UNIQUE NOT NULL,
  papel_proposto TEXT NOT NULL DEFAULT 'membro' CHECK (papel_proposto IN ('admin', 'membro', 'crianca')),
  expira_em TIMESTAMPTZ NOT NULL,
  criado_por UUID REFERENCES membros(id),
  usado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_membros_circulo ON membros(circulo_id);
CREATE INDEX IF NOT EXISTS idx_membros_user ON membros(user_id);

-- 2. FINANÇAS E CARTÕES (VALORES EM BIGINT CENTAVOS INTEIROS)

CREATE TABLE IF NOT EXISTS categorias (
  id TEXT NOT NULL,
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cor TEXT DEFAULT '#5581E3',
  tipo TEXT NOT NULL DEFAULT 'gasto' CHECK (tipo IN ('gasto', 'receita', 'ambos')),
  PRIMARY KEY (id, circulo_id)
);

CREATE TABLE IF NOT EXISTS lancamentos_financeiros (
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
  split_detalhe JSONB,
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

CREATE INDEX IF NOT EXISTS idx_lancamentos_circulo_competencia ON lancamentos_financeiros(circulo_id, data_competencia);
CREATE INDEX IF NOT EXISTS idx_lancamentos_grupo ON lancamentos_financeiros(grupo_id);

CREATE TABLE IF NOT EXISTS cartoes_credito (
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

CREATE TABLE IF NOT EXISTS compras_cartao (
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

CREATE INDEX IF NOT EXISTS idx_compras_cartao_mes ON compras_cartao(cartao_id, mes_fatura);

CREATE TABLE IF NOT EXISTS faturas_cartao (
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

CREATE TABLE IF NOT EXISTS dividas (
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
  acordo JSONB,
  historico_quebra_acordo JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS metas_sonhos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valor_alvo_centavos BIGINT NOT NULL,
  valor_atual_centavos BIGINT NOT NULL DEFAULT 0,
  prazo DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS investimentos (
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

-- 3. BENEFÍCIOS VA / VR

CREATE TABLE IF NOT EXISTS carteiras_beneficio (
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

CREATE TABLE IF NOT EXISTS movimentos_carteira (
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

CREATE INDEX IF NOT EXISTS idx_movimentos_carteira ON movimentos_carteira(carteira_id, data_movimento);

-- 4. OCR DE NOTAS FISCAIS E CUPONS

CREATE TABLE IF NOT EXISTS notas_fiscais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id) ON DELETE SET NULL,
  storage_path TEXT,
  qr_code_url TEXT,
  hash_antiduplicidade TEXT NOT NULL,
  estabelecimento TEXT,
  cnpj TEXT,
  data_emissao DATE,
  valor_total_centavos BIGINT NOT NULL,
  status_conferencia TEXT NOT NULL DEFAULT 'pendente' CHECK (status_conferencia IN ('pendente', 'conferido', 'lancado', 'rejeitado')),
  json_extraido JSONB,
  lancamento_id UUID REFERENCES lancamentos_financeiros(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_nota_hash_circulo UNIQUE (circulo_id, hash_antiduplicidade)
);

-- 5. ROTINA FAMILIAR (FAMILYWALL CORE)

CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ,
  dia_inteiro BOOLEAN DEFAULT false,
  cor TEXT DEFAULT '#5581E3',
  categoria TEXT DEFAULT 'geral' CHECK (categoria IN ('geral', 'medico', 'escola', 'lazer', 'financa', 'aniversario')),
  rrule TEXT,
  participantes UUID[] DEFAULT '{}',
  conta_pagar_id UUID REFERENCES lancamentos_financeiros(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eventos_inicio ON eventos(circulo_id, data_inicio);

CREATE TABLE IF NOT EXISTS lembretes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  data_hora TIMESTAMPTZ NOT NULL,
  atribuido_a UUID REFERENCES membros(id) ON DELETE SET NULL,
  concluido BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS listas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'compras' CHECK (tipo IN ('compras', 'tarefas', 'livre')),
  icone TEXT DEFAULT '🛒',
  cor TEXT DEFAULT '#5581E3',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS itens_lista (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lista_id UUID REFERENCES listas(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  concluido BOOLEAN NOT NULL DEFAULT false,
  concluido_por UUID REFERENCES membros(id) ON DELETE SET NULL,
  concluido_em TIMESTAMPTZ,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_itens_lista ON itens_lista(lista_id);

CREATE TABLE IF NOT EXISTS mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id) ON DELETE SET NULL,
  conteudo TEXT NOT NULL,
  fixado_mural BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS receitas_culinarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  ingredientes JSONB NOT NULL DEFAULT '[]'::jsonb,
  modo_preparo TEXT,
  tempo_minutos INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS refeicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  turno TEXT NOT NULL CHECK (turno IN ('cafe', 'almoco', 'jantar', 'lanche')),
  prato TEXT NOT NULL,
  receita_id UUID REFERENCES receitas_culinarias(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pastas_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  privada BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documentos (
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

CREATE TABLE IF NOT EXISTS grade_horaria (
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

CREATE TABLE IF NOT EXISTS aniversarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id) ON DELETE SET NULL,
  nome_pessoa TEXT NOT NULL,
  data_aniversario DATE NOT NULL,
  aviso_dias_antes INT NOT NULL DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  categoria TEXT DEFAULT 'servico' CHECK (categoria IN ('emergencia', 'medico', 'escola', 'servico', 'pessoal')),
  telefone TEXT NOT NULL,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. NOTIFICAÇÕES E ATIVIDADE

CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  destinatario_membro_id UUID REFERENCES membros(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('financeiro', 'lista', 'evento', 'documento', 'mural', 'sistema')),
  titulo TEXT NOT NULL,
  corpo TEXT NOT NULL,
  dados_link JSONB,
  lida BOOLEAN NOT NULL DEFAULT false,
  chave_agrupamento TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notificacoes_membro ON notificacoes(destinatario_membro_id, lida, created_at);

CREATE TABLE IF NOT EXISTS preferencias_notificacao (
  membro_id UUID PRIMARY KEY REFERENCES membros(id) ON DELETE CASCADE,
  push_ativo BOOLEAN NOT NULL DEFAULT true,
  aviso_contas_vencer BOOLEAN NOT NULL DEFAULT true,
  aviso_lista_compras BOOLEAN NOT NULL DEFAULT true,
  aviso_eventos_dia BOOLEAN NOT NULL DEFAULT true,
  aviso_documentos BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ATIVAÇÃO COMPULSÓRIA DE ROW-LEVEL SECURITY (RLS)

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

-- 8. FUNÇÕES AUXILIARES DE SEGURANÇA (SECURITY DEFINER)

CREATE OR REPLACE FUNCTION get_user_circulo_ids() 
RETURNS SETOF UUID AS $$
  SELECT circulo_id FROM membros WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_papel(p_circulo_id UUID) 
RETURNS TEXT AS $$
  SELECT papel FROM membros WHERE user_id = auth.uid() AND circulo_id = p_circulo_id LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 9. POLÍTICAS DE RLS POR CÍRCULO E BLINDAGEM DO PAPEL 'CRIANÇA'

-- Círculos e Membros
CREATE POLICY "Membros acessam seu próprio círculo" ON circulos 
  FOR ALL USING (id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Membros visualizam participantes do mesmo círculo" ON membros 
  FOR SELECT USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Membros gerenciam convites do círculo" ON convites
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Membros acessam categorias do círculo" ON categorias
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

-- BLINDAGEM DO PAPEL 'CRIANÇA' (Acesso restrito a 'admin' e 'membro' em Finanças)
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

CREATE POLICY "Adultos acessam metas e sonhos" ON metas_sonhos 
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

-- ACESSO COMPARTILHADO DA ROTINA FAMILIAR (Inclusive Crianças)
CREATE POLICY "Todos acessam eventos da rotina" ON eventos 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Todos acessam lembretes" ON lembretes 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Todos acessam listas" ON listas 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Todos interagem com itens de lista" ON itens_lista 
  FOR ALL USING (lista_id IN (SELECT id FROM listas WHERE circulo_id IN (SELECT get_user_circulo_ids())));

CREATE POLICY "Todos acessam mural e mensagens" ON mensagens 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Todos acessam receitas culinárias" ON receitas_culinarias 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Todos visualizam cardápio" ON refeicoes 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Todos visualizam grade horária" ON grade_horaria 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Todos acessam aniversários" ON aniversarios 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

CREATE POLICY "Todos acessam contatos" ON contatos 
  FOR ALL USING (circulo_id IN (SELECT get_user_circulo_ids()));

-- Notificações: Crianças recebem notificações gerais, mas NÃO financeiras
CREATE POLICY "Acesso a notificações" ON notificacoes 
  FOR ALL USING (
    circulo_id IN (SELECT get_user_circulo_ids())
    AND (tipo != 'financeiro' OR get_user_papel(circulo_id) IN ('admin', 'membro'))
  );

CREATE POLICY "Acesso a preferências de notificação" ON preferencias_notificacao 
  FOR ALL USING (membro_id IN (SELECT id FROM membros WHERE user_id = auth.uid()));
