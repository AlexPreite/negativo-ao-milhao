// STATE
const DEFAULT_CATEGORIAS_GASTOS = [
  { id: 'recorrente', nome: 'Fixo/Recorrente', cor: 'c-yellow' },
  { id: 'nao_planejado', nome: 'Não planejado', cor: 'c-red' },
  { id: 'lazer', nome: 'Lazer', cor: 'c-red' },
  { id: 'viagem', nome: 'Viagem', cor: 'c-muted' }
];

const DEFAULT_TIPOS_DIVIDA = [
  { id: 'cartao', nome: 'Cartão de crédito' },
  { id: 'emprestimo', nome: 'Empréstimo bancário' },
  { id: 'emprestimo_pf', nome: 'Empréstimo pessoa física' }
];

let TIPOS_DIVIDA = {
  cartao: 'Cartão de crédito',
  emprestimo: 'Empréstimo bancário',
  emprestimo_pf: 'Empréstimo pessoa física'
};

function sincronizarTiposDividaMap() {
  const map = {};
  (S.tiposDivida || DEFAULT_TIPOS_DIVIDA).forEach(td => {
    map[td.id] = td.nome;
  });
  TIPOS_DIVIDA = map;
}

const PALETA_FAMILIAR = ['#5581E3', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#3B82F6', '#EF4444', '#14B8A6'];
const MODELOS_GEMINI_FALLBACK = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-pro'];

const MODULOS_INICIO_CATALOGO = [
  { id: 'orcamento', nome: 'Orçamento', desc: 'Saldo em Caixa Real e visão financeira', icone: '🐷', cor: '#10B981', bgIcon: 'rgba(16,185,129,0.14)', categoria: 'avancado', telaAlvo: 'resumo' },
  { id: 'listas', nome: 'Listas', desc: 'Compras e tarefas colaborativas', icone: '🛒', cor: '#F59E0B', bgIcon: 'rgba(245,158,11,0.14)', categoria: 'essencial', telaAlvo: 'explorar' },
  { id: 'calendario', nome: 'Calendário', desc: 'Rotina familiar e contas a vencer', icone: '📅', cor: '#8B5CF6', bgIcon: 'rgba(139,92,246,0.14)', categoria: 'essencial', telaAlvo: 'explorar' },
  { id: 'familia', nome: 'Minha Família', desc: 'Membros, papéis e convites', icone: '👨‍👩‍👧‍👦', cor: '#5581E3', bgIcon: 'rgba(85,129,227,0.14)', categoria: 'avancado', telaAlvo: 'familia' },
  { id: 'atividade', nome: 'Atividade', desc: 'Linha do tempo e notificações', icone: '⚡', cor: '#3B82F6', bgIcon: 'rgba(59,130,246,0.14)', categoria: 'essencial', telaAlvo: 'atividade' },
  { id: 'aniversarios', nome: 'Aniversários', desc: 'Datas especiais de quem amamos', icone: '🎂', cor: '#EC4899', bgIcon: 'rgba(236,72,153,0.14)', categoria: 'avancado', telaAlvo: 'explorar' },
  { id: 'documentos', nome: 'Documentos', desc: 'Cofre seguro de arquivos da casa', icone: '📂', cor: '#6366F1', bgIcon: 'rgba(99,102,241,0.14)', categoria: 'avancado', telaAlvo: 'explorar' },
  { id: 'refeicoes', nome: 'Refeições', desc: 'Cardápio semanal e receitas', icone: '🍲', cor: '#14B8A6', bgIcon: 'rgba(20,184,166,0.14)', categoria: 'avancado', telaAlvo: 'explorar' },
  { id: 'receitas_cul', nome: 'Receitas', desc: 'Pratos favoritos da família', icone: '📖', cor: '#F97316', bgIcon: 'rgba(249,115,22,0.14)', categoria: 'essencial', telaAlvo: 'explorar' },
  { id: 'mensagens', nome: 'Mural / Mensagens', desc: 'Recados fixados no mural', icone: '💬', cor: '#06B6D4', bgIcon: 'rgba(6,182,212,0.14)', categoria: 'essencial', telaAlvo: 'explorar' },
  { id: 'horario', nome: 'Horário Escolar', desc: 'Aulas e atividades dos filhos', icone: '🎒', cor: '#A855F7', bgIcon: 'rgba(168,85,247,0.14)', categoria: 'avancado', telaAlvo: 'explorar' },
  { id: 'contatos', nome: 'Contatos Úteis', desc: 'Telefones de emergência e médicos', icone: '📞', cor: '#64748B', bgIcon: 'rgba(100,116,139,0.14)', categoria: 'essencial', telaAlvo: 'explorar' }
];

let S = {
  versaoSchema: 2,
  tema: 'claro',
  circulos: [
    { id: 'circ_1', nome: 'Nossa Família', codigoConvite: 'FAM-INICIO', expiraEm: '', criadoEm: new Date().toISOString() }
  ],
  circuloAtivoId: 'circ_1',
  membrosPerfil: [
    { id: 'm_1', circuloId: 'circ_1', nome: 'Alex', papel: 'admin', cor: '#5581E3', iniciais: 'AL', aniversario: '' },
    { id: 'm_2', circuloId: 'circ_1', nome: 'Gabi', papel: 'membro', cor: '#EC4899', iniciais: 'GA', aniversario: '' }
  ],
  membroAtivoId: 'm_1',
  modulosInicio: ['orcamento', 'listas', 'calendario', 'familia', 'atividade', 'aniversarios', 'documentos', 'refeicoes'],
  notificacoes: [],
  preferenciasNotificacao: {
    eventos: true,
    financas: true,
    listas: true,
    documentos: true,
    mensagens: true,
    ocultarValores: false,
    silencioInicio: '22:00',
    silencioFim: '07:00'
  },
  syncQueue: [],
  receitas:[],
  gastos:[],
  dividas:[],
  metas:[],
  investimentos:[],
  cartoes:[],
  comprasCartao:[],
  faturasCartao:[],
  membrosFamilia:['Alex', 'Gabi'],
  categoriasGastos:[...DEFAULT_CATEGORIAS_GASTOS],
  tiposDivida:[...DEFAULT_TIPOS_DIVIDA],
  chat:[],
  apiKey:'',
  onboardingDone:false
};
let apiKey = '';
let mesAtual = new Date().toISOString().slice(0,7); // "YYYY-MM"

// REGRA DE 60 DIAS & INADIMPLÊNCIA CRÍTICA (Fatia 1)
// Calcula a diferença em meses entre duas competências 'YYYY-MM'
function calcularMesesAtraso(mesOrigem, mesReferencia) {
  if (!mesOrigem || !mesReferencia) return 0;
  try {
    const mo = String(mesOrigem).slice(0, 7);
    const mr = String(mesReferencia).slice(0, 7);
    const [yo, moNum] = mo.split('-').map(Number);
    const [yr, mrNum] = mr.split('-').map(Number);
    if (isNaN(yo) || isNaN(moNum) || isNaN(yr) || isNaN(mrNum)) return 0;
    return (yr * 12 + mrNum) - (yo * 12 + moNum);
  } catch (err) {
    console.error('Erro em calcularMesesAtraso:', err);
    return 0;
  }
}

// Desloca competência 'YYYY-MM' por N meses mantendo precisão de calendário
function adicionarMesesYM(ym, qtdMeses) {
  if (!ym) return new Date().toISOString().slice(0, 7);
  try {
    const [y, m] = String(ym).slice(0, 7).split('-').map(Number);
    const d = new Date(y, (m - 1) + qtdMeses, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  } catch (err) {
    console.error('Erro em adicionarMesesYM:', err);
    return String(ym).slice(0, 7);
  }
}

/**
 * Fatia 2 (ADR-003 / ADR-005): Determina a competência (mês da fatura 'YYYY-MM')
 * em que uma compra será cobrada com base no ciclo de fechamento e dia de vencimento.
 *
 * Algoritmo determinístico:
 * 1. Extrai ano, mês Mc (1 a 12) e dia Dc (1 a 31) de dataCompraISO.
 * 2. Se Dc >= diaFechamento: fecha no mês seguinte (deslocamento +1).
 *    Se Dc < diaFechamento: fecha no mês corrente (deslocamento +0).
 * 3. Se diaVencimento <= diaFechamento: vence 1 mês após o fechamento (+1 mês).
 *    Se diaVencimento > diaFechamento: vence no mesmo mês do fechamento (+0 mês).
 * 4. Deslocamento total = deslocamentoFechamento + deslocamentoVencimento.
 * 5. Retorna adicionarMesesYM(`${ano}-${mes}`, deslocamentoTotal).
 */
function calcularMesFaturaCompra(dataCompraISO, diaFechamento, diaVencimento) {
  try {
    const dataStr = String(dataCompraISO || new Date().toISOString().slice(0, 10)).trim();
    const partes = dataStr.slice(0, 10).split('-');
    const ano = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10);
    const diaCompra = parseInt(partes[2], 10);

    if (isNaN(ano) || isNaN(mes) || isNaN(diaCompra)) {
      return new Date().toISOString().slice(0, 7);
    }

    const dVenc = parseInt(diaVencimento, 10) || 10;
    const dFech = parseInt(diaFechamento, 10) || Math.max(1, dVenc - 7);

    // 1. Ciclo de fechamento:
    // Se diaCompra >= diaFechamento: entra no ciclo de fechamento do mês seguinte (+1)
    // Se diaCompra < diaFechamento: entra no ciclo de fechamento do mês corrente (+0)
    const deslocamentoFechamento = diaCompra >= dFech ? 1 : 0;

    // 2. Relação vencimento vs fechamento:
    // Se diaVencimento <= diaFechamento: fatura vence 1 mês após o fechamento (+1)
    // Se diaVencimento > diaFechamento: fatura vence no mesmo mês do fechamento (+0)
    const deslocamentoVencimento = dVenc <= dFech ? 1 : 0;

    const deslocamentoTotal = deslocamentoFechamento + deslocamentoVencimento;
    const mesCompraYM = `${ano}-${String(mes).padStart(2, '0')}`;

    return adicionarMesesYM(mesCompraYM, deslocamentoTotal);
  } catch (err) {
    console.error('Erro em calcularMesFaturaCompra:', err);
    return String(dataCompraISO || '').slice(0, 7) || new Date().toISOString().slice(0, 7);
  }
}

// Processa inadimplência de contas e faturas com atraso >= 2 meses em relação à data civil REAL de hoje (mesRealHoje)
// Migra gastos vencidos e faturas de cartão para dívidas negativadas e invalida cobranças/parcelas futuras
// Importante: Nunca usar mesAtual (cursor da UI) aqui, para não negativar despesas quando o usuário navegar para o futuro
function processarInadimplencia60Dias(mesReferenciaOverride) {
  if (!S) return;
  if (!Array.isArray(S.gastos)) S.gastos = [];
  if (!Array.isArray(S.dividas)) S.dividas = [];
  if (!Array.isArray(S.cartoes)) S.cartoes = [];
  if (!Array.isArray(S.comprasCartao)) S.comprasCartao = [];
  if (!Array.isArray(S.faturasCartao)) S.faturasCartao = [];

  const hoje = new Date().toISOString().slice(0, 10);
  const mesRealHoje = (mesReferenciaOverride && String(mesReferenciaOverride).slice(0, 7)) || hoje.slice(0, 7);
  const gruposProcessados = new Set();
  let houveMudanca = false;

  const listaGastos = [...S.gastos];

  // 1. Processa Gastos Regulares e Parcelamentos em S.gastos (Fatia 1)
  for (const g of listaGastos) {
    // Filtro de elegibilidade: não pago, não negociado e ainda não migrado
    if (!g || g.pago || g.negociado || g.migradoDivida) continue;

    const mesGasto = (g.data || '').slice(0, 7);
    const mesesAtraso = calcularMesesAtraso(mesGasto, mesRealHoje);

    if (mesesAtraso >= 2) {
      if ((g.parcelado || g.recorrente) && g.grupoId) {
        if (gruposProcessados.has(g.grupoId)) continue;
        gruposProcessados.add(g.grupoId);

        // Encontra todas as parcelas não pagas do mesmo grupo (vencidas e futuras)
        const parcelasNaoPagas = S.gastos.filter(x => x.grupoId === g.grupoId && !x.pago);

        for (const x of parcelasNaoPagas) {
          const mesX = (x.data || '').slice(0, 7);
          const dataX = (x.data || '').slice(0, 10);
          const isFutura = (mesX > mesRealHoje) || (dataX > hoje);

          if (isFutura) {
            x.canceladaNegativacao = true;
          }
          x.migradoDivida = true;
          houveMudanca = true;
        }

        // Consolida saldo devedor exato em centavos para precisão monetária estrita
        const totalCentavos = parcelasNaoPagas.reduce((acc, p) => acc + Math.round((Number(p.val) || 0) * 100), 0);
        const saldoTotal = Math.round(totalCentavos) / 100;

        // Vínculo idempotente por origemGrupoId: não duplica registros
        const dividaExistente = S.dividas.find(d => d.origemGrupoId === g.grupoId);
        if (dividaExistente) {
          if (!dividaExistente.quitada && dividaExistente.saldo !== saldoTotal) {
            dividaExistente.saldo = saldoTotal;
            houveMudanca = true;
          }
        } else {
          const credorNome = g.credor || (g.descOriginal || g.desc || '').split('(')[0].trim() || 'Dívida Parcelada';
          const novaDivida = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            credor: credorNome,
            saldo: saldoTotal,
            juros: 0,
            parcela: 0,
            tipo: g.tipoDivida || 'cartao',
            titular: g.titular || '',
            quitada: false,
            negativada: true,
            origemGrupoId: g.grupoId,
            dataNegativacao: hoje
          };
          S.dividas.push(novaDivida);
          houveMudanca = true;
        }
      } else {
        // Gasto comum avulso
        g.migradoDivida = true;
        houveMudanca = true;

        const saldoGasto = Math.round((Number(g.val) || 0) * 100) / 100;
        const dividaExistente = S.dividas.find(d => d.origemGastoId === g.id);
        if (dividaExistente) {
          if (!dividaExistente.quitada && dividaExistente.saldo !== saldoGasto) {
            dividaExistente.saldo = saldoGasto;
            houveMudanca = true;
          }
        } else {
          const credorNome = g.credor || (g.desc || '').trim() || 'Gasto Inadimplente';
          const novaDivida = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            credor: credorNome,
            saldo: saldoGasto,
            juros: 0,
            parcela: 0,
            tipo: g.tipoDivida || 'outro',
            titular: g.titular || '',
            quitada: false,
            negativada: true,
            origemGastoId: g.id,
            dataNegativacao: hoje
          };
          S.dividas.push(novaDivida);
          houveMudanca = true;
        }
      }
    }
  }

  // 2. Regra de 60 Dias para Faturas de Cartão de Crédito (Fatia 4)
  for (const c of S.cartoes) {
    if (!c || c.ativo === false) continue;

    // Coleta todos os meses com compras ou faturas registradas neste cartão
    const mesesFaturaSet = new Set();
    (S.comprasCartao || []).forEach(cp => {
      if (cp.cartaoId === c.id && cp.mesFatura) mesesFaturaSet.add(cp.mesFatura);
    });
    (S.faturasCartao || []).forEach(f => {
      if (f.cartaoId === c.id && f.mes) mesesFaturaSet.add(f.mes);
    });

    const mesesOrdenados = Array.from(mesesFaturaSet).sort();
    let cartaoTemInadimplencia60Dias = false;
    let saldoVencidoTotalCentavos = 0;

    for (const mesFatura of mesesOrdenados) {
      const mesesAtraso = calcularMesesAtraso(mesFatura, mesRealHoje);
      if (mesesAtraso >= 2) {
        let fatReg = (S.faturasCartao || []).find(f => f.cartaoId === c.id && f.mes === mesFatura);
        const fatInfo = calcularFaturaMes(c.id, mesFatura);

        // B1: Verifica se a fatura teve saldo rolado para a próxima competência
        const mesSeguinte = adicionarMesesYM(mesFatura, 1);
        const fatSeguinte = (S.faturasCartao || []).find(f => f.cartaoId === c.id && f.mes === mesSeguinte);
        const foiRolada = Boolean((fatReg && fatReg.roladoParaProxima) || (fatSeguinte && Number(fatSeguinte.rotativoRolado) > 0));

        // Na regra de 60 dias, faturas roladas contam saldo 0 (a dívida foi transferida para a fatura seguinte)
        if (foiRolada) {
          if (fatReg && (fatReg.negativada || fatReg.migradoDivida)) {
            fatReg.negativada = false;
            fatReg.migradoDivida = false;
            houveMudanca = true;
          }
          continue;
        }

        const estaPaga = fatReg && fatReg.pago;
        if (estaPaga) {
          if (fatReg && (fatReg.negativada || fatReg.migradoDivida)) {
            fatReg.negativada = false;
            fatReg.migradoDivida = false;
            houveMudanca = true;
          }
          continue;
        }

        if (fatInfo.valorTotalFatura > 0) {
          let saldoNaoPagoCentavos = 0;
          if (fatReg && fatReg.pagoParcial) {
            saldoNaoPagoCentavos = Math.round((Number(fatReg.saldoRestante) || 0) * 100);
          } else {
            const valFat = (fatReg && (fatReg.saldoRestante || fatReg.valorTotal)) || fatInfo.valorTotalFatura;
            saldoNaoPagoCentavos = Math.round((Number(valFat) || 0) * 100);
          }

          if (saldoNaoPagoCentavos > 0) {
            cartaoTemInadimplencia60Dias = true;
            saldoVencidoTotalCentavos += saldoNaoPagoCentavos;

            if (!fatReg) {
              fatReg = {
                id: `${c.id}_${mesFatura}`,
                cartaoId: c.id,
                mes: mesFatura,
                valorTotal: fatInfo.valorTotalFatura,
                valorPago: 0,
                pago: false,
                pagoParcial: false,
                saldoRestante: fatInfo.valorTotalFatura,
                rotativoRolado: 0,
                negativada: true,
                migradoDivida: true
              };
              S.faturasCartao.push(fatReg);
            } else {
              fatReg.negativada = true;
              fatReg.migradoDivida = true;
            }
            houveMudanca = true;
          }
        }
      }
    }

    if (cartaoTemInadimplencia60Dias) {
      // B4: Marcar o cartão como negativado e registrar data da negativação
      const dataNegativacaoHoje = c.dataNegativacao || hoje;
      const mesCancelamento = (c.dataNegativacao || '').slice(0, 7) || mesRealHoje;
      if (!c.negativado) {
        c.negativado = true;
        c.dataNegativacao = dataNegativacaoHoje;
        houveMudanca = true;
      }

      // Cancela compras parceladas futuras do cartão (que venceriam no mês de referência ou no futuro)
      let centavosFuturos = 0;
      (S.comprasCartao || []).forEach(cp => {
        if (cp.cartaoId === c.id) {
          const atrasoCp = calcularMesesAtraso(cp.mesFatura, mesRealHoje);
          // Parcelas futuras ou vigentes que não entraram nas faturas já vencidas >= 2 meses
          if (atrasoCp < 2) {
            if (!cp.canceladaNegativacao) {
              cp.canceladaNegativacao = true;
              houveMudanca = true;
            }
            centavosFuturos += Math.round((Number(cp.val) || 0) * 100);
          }
        }
      });

      // B4: Soma as parcelas de anuidade restantes (meses >= mês de cancelamento) no saldo consolidado
      let centavosAnuidadeRestante = 0;
      if (c.anuidade && c.anuidade.possui && c.anuidade.parcelas > 0 && c.anuidade.valorParcela > 0) {
        const mesInicio = (c.anuidade.mesInicio || mesCancelamento).slice(0, 7);
        const qtd = c.anuidade.parcelas;
        const vParcCentavos = Math.round(Number(c.anuidade.valorParcela) * 100);
        for (let k = 0; k < qtd; k++) {
          const mesParc = adicionarMesesYM(mesInicio, k);
          if (mesParc >= mesCancelamento) {
            centavosAnuidadeRestante += vParcCentavos;
          }
        }
      }

      // Consolida saldo devedor total em centavos: vencidas + futuras canceladas + anuidade restante
      const saldoTotalDevedor = Math.round(saldoVencidoTotalCentavos + centavosFuturos + centavosAnuidadeRestante) / 100;

      // Idempotência estrita: busca dívida pelo origemCartaoId
      const dividaExistente = S.dividas.find(d => d.origemCartaoId === c.id);
      if (dividaExistente) {
        if (!dividaExistente.quitada && dividaExistente.saldo !== saldoTotalDevedor) {
          dividaExistente.saldo = saldoTotalDevedor;
          dividaExistente.negativada = true;
          houveMudanca = true;
        }
      } else {
        const novaDivida = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          credor: c.nome,
          saldo: saldoTotalDevedor,
          juros: c.taxaRotativo || 0,
          parcela: 0,
          tipo: 'cartao',
          titular: c.titular || '',
          quitada: false,
          negativada: true,
          origemCartaoId: c.id,
          dataNegativacao: dataNegativacaoHoje
        };
        S.dividas.push(novaDivida);
        houveMudanca = true;
      }
    } else {
      // Se o cartão não possui inadimplência (todas faturas pagas ou roladas)
      const idx = S.dividas.findIndex(d => d.origemCartaoId === c.id && d.negativada && !d.quitada);
      if (idx !== -1) {
        S.dividas.splice(idx, 1);
        houveMudanca = true;
      }
      if (c.negativado) {
        c.negativado = false;
        c.dataNegativacao = null;
        houveMudanca = true;
      }
    }
  }

  // Persiste no storage apenas se houver alterações
  if (houveMudanca && typeof save === 'function') {
    try {
      save();
    } catch (err) {
      console.error('Erro ao salvar estado após processar inadimplência de 60 dias:', err);
    }
  }
}

// ============================================================================
// SUPER-APP FAMILIAR V2.0 - FUNDAÇÃO DO CÍRCULO FAMILIAR (Etapa 1)
// ============================================================================

/**
 * Migração automática sem perda de dados para o Super-App Familiar v2.0 (Etapa 1).
 * Preserva 100% dos dados legados, inicializa o esquema v2 e mantém sincronia bidirecional.
 */
function migrarParaUpgradeFamiliarV2() {
  if (!S) return;

  // 1. Versão do esquema
  if (!S.versaoSchema || S.versaoSchema < 2) {
    S.versaoSchema = 2;
  }

  // 2. Tema visual
  if (!S.tema || (S.tema !== 'claro' && S.tema !== 'escuro')) {
    S.tema = 'claro';
  }

  // 3. Círculo familiar padrão
  if (!Array.isArray(S.circulos) || S.circulos.length === 0) {
    S.circulos = [
      {
        id: 'circ_1',
        nome: 'Nossa Família',
        codigoConvite: 'FAM-INICIO',
        expiraEm: '',
        criadoEm: new Date().toISOString()
      }
    ];
  }

  if (!S.circuloAtivoId || !S.circulos.some(c => c.id === S.circuloAtivoId)) {
    S.circuloAtivoId = S.circulos[0].id;
  }

  // 4. Membros e Perfis com papéis ('admin', 'membro', 'crianca')
  if (!Array.isArray(S.membrosPerfil) || S.membrosPerfil.length === 0) {
    const nomesBase = Array.isArray(S.membrosFamilia) && S.membrosFamilia.length > 0
      ? S.membrosFamilia
      : ['Alex', 'Gabi'];

    S.membrosPerfil = nomesBase.map((nome, idx) => {
      const partes = nome.trim().split(/\s+/);
      const iniciais = partes.length > 1
        ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
        : partes[0].substring(0, 2).toUpperCase();
      return {
        id: 'm_' + (idx + 1),
        circuloId: S.circuloAtivoId,
        nome: nome.trim(),
        papel: idx === 0 ? 'admin' : 'membro',
        cor: PALETA_FAMILIAR[idx % PALETA_FAMILIAR.length] || '#5581E3',
        iniciais,
        aniversario: ''
      };
    });
  }

  if (!S.membroAtivoId || !S.membrosPerfil.some(m => m.id === S.membroAtivoId)) {
    S.membroAtivoId = S.membrosPerfil[0].id;
  }

  // Sincronia bidirecional com S.membrosFamilia para manter retrocompatibilidade total
  S.membrosFamilia = S.membrosPerfil.map(m => m.nome);

  // 5. Módulos do Mural Inicial
  if (!Array.isArray(S.modulosInicio) || S.modulosInicio.length === 0) {
    S.modulosInicio = ['orcamento', 'listas', 'calendario', 'familia', 'atividade', 'aniversarios', 'documentos', 'refeicoes'];
  }

  // 6. Notificações e Preferências
  if (!Array.isArray(S.notificacoes)) {
    S.notificacoes = [];
  }

  const prefsPadrao = {
    eventos: true,
    financas: true,
    listas: true,
    documentos: true,
    mensagens: true,
    ocultarValores: false,
    silencioInicio: '22:00',
    silencioFim: '07:00'
  };
  S.preferenciasNotificacao = Object.assign({}, prefsPadrao, S.preferenciasNotificacao || {});

  // 7. Fila de sincronização offline
  if (!Array.isArray(S.syncQueue)) {
    S.syncQueue = [];
  }
}

// --- TEMA CLARO / ESCURO ---
function aplicarTema(tema) {
  const temaFinal = tema === 'escuro' ? 'escuro' : 'claro';
  S.tema = temaFinal;
  if (typeof document !== 'undefined') {
    if (document.documentElement) {
      document.documentElement.setAttribute('data-theme', temaFinal);
    }
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = temaFinal === 'escuro' ? '🌙' : '☀️';
    }
  }
}

function alternarTema() {
  const novoTema = S.tema === 'claro' ? 'escuro' : 'claro';
  aplicarTema(novoTema);
  save();
}

// --- GESTÃO DE CÍRCULOS FAMILIARES ---
function obterCirculoAtivo() {
  if (!S || !Array.isArray(S.circulos) || S.circulos.length === 0) {
    return { id: 'circ_1', nome: 'Nossa Família', codigoConvite: 'FAM-INICIO' };
  }
  const circ = S.circulos.find(c => c.id === S.circuloAtivoId);
  return circ || S.circulos[0];
}

function criarCirculo(nome) {
  const nomeLimpo = (nome || '').trim();
  if (!nomeLimpo) return null;
  const id = 'circ_' + Date.now().toString(36);
  const codigoConvite = 'FAM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const novoCirculo = {
    id,
    nome: nomeLimpo,
    codigoConvite,
    expiraEm: '',
    criadoEm: new Date().toISOString()
  };
  if (!Array.isArray(S.circulos)) S.circulos = [];
  S.circulos.push(novoCirculo);
  S.circuloAtivoId = id;

  registrarNotificacaoFamilia({
    tipo: 'geral',
    titulo: 'Novo Círculo Familiar',
    texto: `Círculo "${nomeLimpo}" criado com sucesso!`,
    valor: 0
  });

  save();
  render();
  return novoCirculo;
}

function selecionarCirculo(circuloId) {
  if (!S || !Array.isArray(S.circulos)) return;
  const encontrado = S.circulos.find(c => c.id === circuloId);
  if (!encontrado) return;
  S.circuloAtivoId = circuloId;

  // Sincroniza membro ativo para este círculo se houver membros associados
  const membrosDesteCirculo = (S.membrosPerfil || []).filter(m => m.circuloId === circuloId);
  if (membrosDesteCirculo.length > 0) {
    if (!membrosDesteCirculo.some(m => m.id === S.membroAtivoId)) {
      S.membroAtivoId = membrosDesteCirculo[0].id;
    }
  }

  save();
  render();
}

function gerarConviteCirculo(circuloId, papelProposto = 'membro') {
  const circulo = (S.circulos || []).find(c => c.id === (circuloId || S.circuloAtivoId)) || obterCirculoAtivo();
  if (!circulo) return null;

  const codigo = 'FAM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const expiraEm = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Validade de 7 dias

  circulo.codigoConvite = codigo;
  circulo.expiraEm = expiraEm;

  save();
  return {
    codigo,
    expiraEm,
    papel: papelProposto,
    link: `https://negativoaomilhao.app/convite?c=${codigo}&papel=${papelProposto}`
  };
}

// --- GESTÃO DE MEMBROS E PERFIS ---
function obterMembroAtivo() {
  if (!S || !Array.isArray(S.membrosPerfil) || S.membrosPerfil.length === 0) {
    return { id: 'm_1', nome: 'Alex', papel: 'admin', cor: '#5581E3', iniciais: 'AL' };
  }
  const ativo = S.membrosPerfil.find(m => m.id === S.membroAtivoId);
  return ativo || S.membrosPerfil[0];
}

function alternarMembroAtivo(membroId) {
  if (!S || !Array.isArray(S.membrosPerfil)) return;
  const encontrado = S.membrosPerfil.find(m => m.id === membroId);
  if (!encontrado) return;

  S.membroAtivoId = membroId;

  // Blindagem do perfil 'crianca': redireciona se estiver em tela financeira
  if (encontrado.papel === 'crianca' && typeof document !== 'undefined') {
    const rotasRestritas = ['resumo', 'receitas', 'gastos', 'dividas', 'metas'];
    const secoes = document.querySelectorAll('.section');
    for (let i = 0; i < secoes.length; i++) {
      if (secoes[i].style.display === 'block') {
        const idAtual = secoes[i].id.replace('sec-', '');
        if (rotasRestritas.includes(idAtual)) {
          go('inicio');
          break;
        }
      }
    }
  }

  save();
  render();
}

function salvarMembroCirculo(dados) {
  if (!dados || !dados.nome) return null;
  const nomeLimpo = dados.nome.trim();
  if (!nomeLimpo) return null;

  if (!Array.isArray(S.membrosPerfil)) S.membrosPerfil = [];

  const papel = ['admin', 'membro', 'crianca'].includes(dados.papel) ? dados.papel : 'membro';
  const partes = nomeLimpo.split(/\s+/);
  const iniciais = partes.length > 1
    ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
    : partes[0].substring(0, 2).toUpperCase();
  const circuloId = dados.circuloId || S.circuloAtivoId;
  const cor = dados.cor || PALETA_FAMILIAR[S.membrosPerfil.length % PALETA_FAMILIAR.length] || '#5581E3';

  let membroSalvo = null;
  if (dados.id) {
    const idx = S.membrosPerfil.findIndex(m => m.id === dados.id);
    if (idx >= 0) {
      S.membrosPerfil[idx] = {
        ...S.membrosPerfil[idx],
        nome: nomeLimpo,
        papel,
        cor,
        iniciais,
        aniversario: dados.aniversario || S.membrosPerfil[idx].aniversario || ''
      };
      membroSalvo = S.membrosPerfil[idx];
    }
  }

  if (!membroSalvo) {
    membroSalvo = {
      id: 'm_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      circuloId,
      nome: nomeLimpo,
      papel,
      cor,
      iniciais,
      aniversario: dados.aniversario || ''
    };
    S.membrosPerfil.push(membroSalvo);
  }

  // Sincronia bidirecional com S.membrosFamilia para manter integridade contábil
  S.membrosFamilia = S.membrosPerfil.map(m => m.nome);

  registrarNotificacaoFamilia({
    tipo: 'geral',
    titulo: 'Perfil Familiar Atualizado',
    texto: `${nomeLimpo} (${papel}) está ativo no círculo`,
    valor: 0,
    membroId: membroSalvo.id
  });

  save();
  render();
  return membroSalvo;
}

function excluirMembroCirculo(membroId) {
  if (!S || !Array.isArray(S.membrosPerfil) || S.membrosPerfil.length <= 1) {
    if (typeof alert === 'function') alert('O Círculo precisa ter pelo menos um membro cadastrado.');
    return false;
  }

  const membro = S.membrosPerfil.find(m => m.id === membroId);
  if (!membro) return false;

  // Garante a existência de pelo menos 1 administrador
  if (membro.papel === 'admin') {
    const totalAdmins = S.membrosPerfil.filter(m => m.papel === 'admin').length;
    if (totalAdmins <= 1) {
      if (typeof alert === 'function') alert('Promova outro membro a Administrador antes de excluir este.');
      return false;
    }
  }

  S.membrosPerfil = S.membrosPerfil.filter(m => m.id !== membroId);
  if (S.membroAtivoId === membroId) {
    S.membroAtivoId = S.membrosPerfil[0].id;
  }

  // Sincronia com lista de nomes de família
  S.membrosFamilia = S.membrosPerfil.map(m => m.nome);

  save();
  render();
  return true;
}

// --- CENTRAL DE NOTIFICAÇÕES & LINHA DO TEMPO (ATIVIDADE) ---
let ultimaNotificacaoTimestamp = 0;
let ultimaNotificacaoAssinatura = '';
let filtroAtividadeAtual = 'todos';

function verificarHorarioSilencio() {
  const prefs = S.preferenciasNotificacao;
  if (!prefs || !prefs.silencioInicio || !prefs.silencioFim) return false;
  try {
    const agora = new Date();
    const horaMin = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');
    const { silencioInicio, silencioFim } = prefs;

    if (silencioInicio <= silencioFim) {
      return horaMin >= silencioInicio && horaMin <= silencioFim;
    } else {
      return horaMin >= silencioInicio || horaMin <= silencioFim;
    }
  } catch (err) {
    console.error('Erro em verificarHorarioSilencio:', err);
    return false;
  }
}

function registrarNotificacaoFamilia(dados) {
  if (!dados || !dados.titulo) return null;
  if (!S) return null;
  if (!Array.isArray(S.notificacoes)) S.notificacoes = [];

  const tipo = dados.tipo || 'geral';
  const prefs = S.preferenciasNotificacao || {};

  // Respeita preferência do tipo de notificação
  if (prefs[tipo] === false) {
    return null;
  }

  // Anti-spam de 15 segundos para evitar ruído com notificações idênticas consecutivas
  const assinatura = `${tipo}_${dados.titulo}_${dados.texto || ''}`;
  const agora = Date.now();
  if (assinatura === ultimaNotificacaoAssinatura && (agora - ultimaNotificacaoTimestamp) < 15000) {
    return null;
  }
  ultimaNotificacaoAssinatura = assinatura;
  ultimaNotificacaoTimestamp = agora;

  const novaNotif = {
    id: 'notif_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
    circuloId: S.circuloAtivoId,
    tipo,
    titulo: dados.titulo,
    texto: dados.texto || '',
    valor: Number(dados.valor) || 0,
    membroId: dados.membroId || S.membroAtivoId,
    linkTela: dados.linkTela || '',
    lida: false,
    criadoEm: new Date().toISOString()
  };

  S.notificacoes.unshift(novaNotif);

  // Mantém histórico em tamanho adequado (máx 100 itens)
  if (S.notificacoes.length > 100) {
    S.notificacoes = S.notificacoes.slice(0, 100);
  }

  // Exibe toast em tela caso não esteja em horário de silêncio
  if (!verificarHorarioSilencio() && typeof document !== 'undefined') {
    const icone = tipo === 'financas' ? '💰' : tipo === 'listas' ? '🛒' : '🔔';
    exibirToastNotificacao(dados.titulo + (dados.texto ? ': ' + dados.texto : ''), icone);
  }

  atualizarBadgesHeader();
  return novaNotif;
}

function obterFeedAtividade(filtroTipo = 'todos') {
  if (!S || !Array.isArray(S.notificacoes)) return [];
  const membroAtivo = obterMembroAtivo();
  const isCrianca = membroAtivo && membroAtivo.papel === 'crianca';
  const ocultarValores = Boolean(S.preferenciasNotificacao && S.preferenciasNotificacao.ocultarValores);

  return S.notificacoes
    .filter(n => {
      // Blindagem do perfil 'crianca': oculta todo registro de tipo 'financas' ou 'financeiro'
      if (isCrianca && (n.tipo === 'financas' || n.tipo === 'financeiro')) {
        return false;
      }
      if (filtroTipo && filtroTipo !== 'todos' && n.tipo !== filtroTipo) {
        return false;
      }
      return true;
    })
    .map(n => {
      let textoFormatado = n.texto;
      if (ocultarValores && n.valor > 0) {
        // Mascara quantias monetárias para R$ •••••
        textoFormatado = textoFormatado.replace(/R\$\s*[\d\.,]+/g, 'R$ •••••');
      }
      return {
        ...n,
        texto: textoFormatado
      };
    });
}

function marcarNotificacoesLidas() {
  if (!S || !Array.isArray(S.notificacoes)) return;
  S.notificacoes.forEach(n => { n.lida = true; });
  save();
  atualizarBadgesHeader();
  renderAtividadeFeed();
}

function salvarPreferenciasNotificacao(novasPrefs) {
  if (!S) return;
  S.preferenciasNotificacao = Object.assign({}, S.preferenciasNotificacao || {}, novasPrefs || {});
  save();
}

function exibirToastNotificacao(texto, icone = '🔔') {
  if (typeof document === 'undefined') return;
  const toast = document.getElementById('toast-notificacao');
  const txtEl = document.getElementById('toast-text') || document.getElementById('toast-texto');
  const icEl = document.getElementById('toast-icon') || document.getElementById('toast-icone');
  if (!toast || !txtEl) return;

  txtEl.textContent = texto;
  if (icEl) icEl.textContent = icone;
  toast.classList.add('show');
  toast.classList.add('visible');

  if (typeof window !== 'undefined') {
    clearTimeout(window.__toastTimeout);
    window.__toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.remove('visible');
    }, 3500);
  }
}

// --- MURAL INICIAL E ABA EXPLORAR ---
function toggleModuloInicio(moduloId) {
  if (!S || !Array.isArray(S.modulosInicio)) return;
  const idx = S.modulosInicio.indexOf(moduloId);
  if (idx >= 0) {
    if (S.modulosInicio.length <= 1) {
      if (typeof alert === 'function') alert('Mantenha pelo menos 1 módulo no Mural Inicial.');
      return;
    }
    S.modulosInicio.splice(idx, 1);
  } else {
    S.modulosInicio.push(moduloId);
  }
  save();
  render();
}

function reordenarModuloInicio(moduloId, direcao) {
  if (!S || !Array.isArray(S.modulosInicio)) return;
  const idx = S.modulosInicio.indexOf(moduloId);
  if (idx < 0) return;

  const novoIdx = direcao === 'up' ? idx - 1 : idx + 1;
  if (novoIdx < 0 || novoIdx >= S.modulosInicio.length) return;

  const item = S.modulosInicio.splice(idx, 1)[0];
  S.modulosInicio.splice(novoIdx, 0, item);

  save();
  render();
}

// Carrossel
const SLIDES_CARROSSEL = [
  {
    icon: '👨‍👩‍👧‍👦',
    titulo: 'Bem-vindo ao Mural Familiar',
    desc: 'Tudo organizado em um só lugar: orçamento, rotina, compras e muito mais.'
  },
  {
    icon: '💡',
    titulo: 'Dica Financeira: Regra 50/30/20',
    desc: '50% para necessidades, 30% para estilo de vida e 20% para quitar dívidas e investir.'
  },
  {
    icon: '🛡️',
    titulo: 'Privacidade e Proteção Infantil',
    desc: 'Perfis infantis têm acesso seguro com ocultação automática de finanças da família.'
  },
  {
    icon: '⚡',
    titulo: 'Rotina Sem Estresse',
    desc: 'Use listas colaborativas para supermercado e feira sincronizadas com toda a casa.'
  }
];
let slideCarrosselAtual = 0;

function setCarouselSlide(idx) {
  if (idx < 0 || idx >= SLIDES_CARROSSEL.length) return;
  slideCarrosselAtual = idx;
  if (typeof document === 'undefined') return;

  const slide = SLIDES_CARROSSEL[idx];
  const iconEl = document.getElementById('carousel-icon');
  const titleEl = document.getElementById('carousel-title');
  const descEl = document.getElementById('carousel-desc');
  if (iconEl) iconEl.textContent = slide.icon;
  if (titleEl) titleEl.textContent = slide.titulo;
  if (descEl) descEl.textContent = slide.desc;

  document.querySelectorAll('.carousel-dot').forEach((dot, dIdx) => {
    if (dIdx === idx) dot.classList.add('active');
    else dot.classList.remove('active');
  });
}

function proximoSlideCarrossel() {
  const next = (slideCarrosselAtual + 1) % SLIDES_CARROSSEL.length;
  setCarouselSlide(next);
}

// --- FAB + MENU ---
function abrirFabMenu() {
  openM('m-fab-menu');
}

function abrirMenuAcaoRapida() {
  abrirFabMenu();
}

function fecharFabMenu() {
  closeM('m-fab-menu');
}

function toggleFabMenu() {
  const modal = document.getElementById('m-fab-menu');
  if (modal && modal.classList.contains('open')) {
    fecharFabMenu();
  } else {
    abrirFabMenu();
  }
}

// --- ROTEADOR DE MODELOS GEMINI RESILIENTE (ADR-004 / ETAPA 1) ---
/**
 * Roteador de Modelos Gemini com Fallback Ordenado.
 * Resiliente a 429 (Too Many Requests), RESOURCE_EXHAUSTED, 503 e 404.
 */
async function chamarGeminiComFallback({ contents, systemInstruction, generationConfig, fetchFn = (typeof fetch !== 'undefined' ? fetch : null) }) {
  const chave = apiKey || (S && S.apiKey);
  if (!chave) {
    throw new Error('Configure a Gemini API Key em Configurações para usar a inteligência artificial.');
  }
  if (!fetchFn) {
    throw new Error('Nenhum cliente fetch disponível no ambiente.');
  }

  let ultimoErro = null;

  for (const modelo of MODELOS_GEMINI_FALLBACK) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${chave}`;
      const payload = { contents };
      if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
      }
      if (generationConfig) {
        payload.generationConfig = generationConfig;
      }

      const resp = await fetchFn(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Se status de cota ou indisponibilidade, aciona fallback para o próximo modelo
      if (resp.status === 429 || resp.status === 503 || resp.status === 404 || resp.status === 500) {
        console.warn(`[Gemini Fallback] Modelo ${modelo} retornou status ${resp.status}. Tentando próximo modelo da lista...`);
        continue;
      }

      const data = await resp.json();

      if (data.error) {
        const errMsg = String(data.error.message || '').toUpperCase();
        if (errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('QUOTA') || data.error.code === 429) {
          console.warn(`[Gemini Fallback] Cota esgotada no modelo ${modelo} (${data.error.message}). Tentando próximo...`);
          continue;
        }
        throw new Error(data.error.message || 'Erro na resposta da API Gemini');
      }

      // Sucesso
      return {
        modeloUtilizado: modelo,
        data,
        text: data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      };
    } catch (err) {
      ultimoErro = err;
      const msg = String(err.message || '').toUpperCase();
      if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429') || msg.includes('QUOTA')) {
        console.warn(`[Gemini Fallback] Falha no modelo ${modelo}. Tentando próximo...`);
        continue;
      }
      console.warn(`[Gemini Fallback] Erro ao chamar modelo ${modelo}:`, err);
    }
  }

  throw new Error(`Todos os modelos Gemini do roteador falharam. Último erro: ${ultimoErro ? ultimoErro.message : 'Indisponibilidade de cota'}`);
}

function loadState(){
  try {
    if (typeof localStorage !== 'undefined') {
      const rawData = localStorage.getItem('dnm_data');
      if (rawData && !localStorage.getItem('dnm_backup_v1')) {
        localStorage.setItem('dnm_backup_v1', rawData);
        localStorage.setItem('dnm_backup_v1_timestamp', new Date().toISOString());
      }
      if (rawData) {
        const parsed = JSON.parse(rawData);
        Object.assign(S, parsed);
      }
    }
  } catch(e){
    console.error('Erro ao ler dnm_data do localStorage:', e);
  }

  // Migração segura para o Super-App Familiar v2.0 (Etapa 1)
  migrarParaUpgradeFamiliarV2();
  if(!S.membrosFamilia) S.membrosFamilia = ['Alex', 'Gabi'];
  if(!S.categoriasGastos || !S.categoriasGastos.length) S.categoriasGastos = [...DEFAULT_CATEGORIAS_GASTOS];
  if(!S.tiposDivida || !S.tiposDivida.length) S.tiposDivida = [...DEFAULT_TIPOS_DIVIDA];
  sincronizarTiposDividaMap();

  try {
    if (typeof localStorage !== 'undefined') {
      familiaId = localStorage.getItem('dnm_familia_id') || '';
    }
  } catch(e){
    console.error('Erro ao ler dnm_familia_id:', e);
  }
  if(S.apiKey) apiKey=S.apiKey;
  if(!S.apiKey){
    try{
      if (typeof localStorage !== 'undefined') {
        const legado = localStorage.getItem('dnm_key');
        if(legado){ S.apiKey=legado; apiKey=legado; }
      }
    }catch(e){
      console.error('Erro ao ler dnm_key legada:', e);
    }
  }
  if(!S.onboardingDone && (S.apiKey || (typeof localStorage !== 'undefined' && localStorage.getItem('dnm_skip')))) S.onboardingDone=true;
  // Migração: garante que registros antigos (sem mês/status/titular/recorrência/flags 60 dias) continuem funcionando
  const hoje=new Date().toISOString().slice(0,10);
  (S.receitas||[]).forEach(r=>{
    if(!r.data) r.data=hoje;
    if(r.titular===undefined) r.titular='';
  });
  (S.gastos||[]).forEach(g=>{
    if(!g.data) g.data=hoje;
    if(g.titular===undefined) g.titular='';
    if(g.pago===undefined) g.pago=true;
    if(g.parcelado===undefined) g.parcelado=false;
    if(g.parcelado && !g.dataOriginal) g.dataOriginal=g.data;
    if(g.recorrente===undefined) g.recorrente=false;
    if(g.origemDivida===undefined) g.origemDivida='';
    if(g.negociado===undefined) g.negociado=false;
    if(g.migradoDivida===undefined) g.migradoDivida=false;
    if(g.canceladaNegativacao===undefined) g.canceladaNegativacao=false;
  });
  (S.dividas||[]).forEach(d=>{
    if(d.titular===undefined) d.titular='';
    if(d.quitada===undefined) d.quitada=false;
    if(d.valorQuitado===undefined) d.valorQuitado=null;
    if(d.dataQuitacao===undefined) d.dataQuitacao=null;
    if(d.acordo===undefined) d.acordo=null;
    if(d.negativada===undefined) d.negativada=false;
  });
  if(!S.investimentos) S.investimentos=[];
  (S.investimentos||[]).forEach(inv=>{
    if(inv.titular===undefined) inv.titular='';
  });

  if (!Array.isArray(S.cartoes)) S.cartoes = [];
  if (!Array.isArray(S.comprasCartao)) S.comprasCartao = [];
  if (!Array.isArray(S.faturasCartao)) S.faturasCartao = [];

  // Fatia 1 (ADR-003): Garante diaFechamento e limiteTotal para cartões legados existentes
  (S.cartoes || []).forEach(c => {
    if (c.diaFechamento === undefined || c.diaFechamento === null) {
      c.diaFechamento = Math.max(1, (c.diaVencimento || 10) - 7);
    }
    if (c.limiteTotal === undefined || c.limiteTotal === null) {
      c.limiteTotal = 0;
    }
  });

  // Executa processamento após carga do localStorage
  processarInadimplencia60Dias();
}

const fmt = v => 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

// FIREBASE INTEGRATION
// 1. Crie um projeto em https://console.firebase.google.com
// 2. Ative Authentication > Método de login > Google
// 3. Ative Firestore Database (modo produção)
// 4. Configurações do projeto > copie o firebaseConfig e cole abaixo
const firebaseConfig = {
  apiKey: "AIzaSyBlFODuPRjVS4vfyin6vNC13v4ATxF8g6A",
  authDomain: "controle-de-despesas-8bd81.firebaseapp.com",
  projectId: "controle-de-despesas-8bd81",
  storageBucket: "controle-de-despesas-8bd81.firebasestorage.app",
  messagingSenderId: "1071645887652",
  appId: "1:1071645887652:web:e2373db3e9bcc35e472a31",
  measurementId: "G-XTRG0XMJCC"
};

let fbUser = null;
let fbDb = null;
let saveTimer = null;
let familiaId = '';

function initFirebase(){
  if (typeof firebase === 'undefined') return;
  try {
    firebase.initializeApp(firebaseConfig);
    fbDb = firebase.firestore();
    firebase.auth().onAuthStateChanged(async user => {
      fbUser = user;
      if(user){
        document.getElementById('tela-login').style.display='none';
        await loadFromCloud();
        updateKeyStatus(); updateContaStatus(); updateFamiliaStatus();
        if(S.onboardingDone){
          document.getElementById('onboarding').style.display='none';
          document.getElementById('app').style.display='flex';
          render();
        } else {
          document.getElementById('app').style.display='none';
          document.getElementById('onboarding').style.display='flex';
        }
      } else {
        document.getElementById('app').style.display='none';
        document.getElementById('onboarding').style.display='none';
        document.getElementById('tela-login').style.display='flex';
      }
    });
  } catch(e) { console.error('Erro ao iniciar Firebase. Confira o firebaseConfig.', e); }
}

// Firebase não tem "telefone + senha" nativo — por baixo dos panos convertemos
// o telefone num e-mail interno (nunca exibido) e usamos o login de e-mail/senha,
// que já guarda a senha de forma segura (com hash), nunca em texto puro.
function telefoneParaEmail(tel){
  const d=(tel||'').replace(/\D/g,'');
  return d+'@negativoaomilhao.app';
}

function fazerCadastro(){
  const tel=document.getElementById('login-tel').value.trim();
  const senha=document.getElementById('login-senha').value;
  const msg=document.getElementById('login-msg');
  const d=tel.replace(/\D/g,'');
  if(d.length<10){ msg.textContent='Digite um telefone válido, com DDD.'; return; }
  if(senha.length<6){ msg.textContent='A senha precisa ter pelo menos 6 caracteres.'; return; }
  msg.textContent='Criando conta...';
  firebase.auth().createUserWithEmailAndPassword(telefoneParaEmail(d), senha)
    .catch(e=>{
      msg.textContent = e.code==='auth/email-already-in-use' ? 'Esse telefone já tem conta — toque em Entrar.' : 'Erro ao criar conta: '+e.message;
    });
}

function fazerLogin(){
  const tel=document.getElementById('login-tel').value.trim();
  const senha=document.getElementById('login-senha').value;
  const msg=document.getElementById('login-msg');
  const d=tel.replace(/\D/g,'');
  if(d.length<10||!senha){ msg.textContent='Preencha telefone e senha.'; return; }
  msg.textContent='Entrando...';
  firebase.auth().signInWithEmailAndPassword(telefoneParaEmail(d), senha)
    .catch(e=>{
      if(e.code==='auth/user-not-found') msg.textContent='Esse telefone ainda não tem conta — toque em "Criar minha conta".';
      else if(e.code==='auth/wrong-password'||e.code==='auth/invalid-credential') msg.textContent='Senha incorreta.';
      else msg.textContent='Erro ao entrar: '+e.message;
    });
}

function sair(){
  if(!confirm('Sair da conta neste aparelho?')) return;
  firebase.auth().signOut();
}

function updateContaStatus(){
  const el=document.getElementById('conta-status');
  if(el) el.textContent = fbUser ? '✅ Conectado' : '❌ Desconectado';
}

function docId(){ return familiaId || (fbUser ? fbUser.uid : null); }

async function loadFromCloud(){
  if(!fbUser || !fbDb) return;
  const id=docId(); if(!id) return;
  try {
    const doc = await fbDb.collection('usuarios').doc(id).get();
    if(doc.exists){
      S = {...S, ...doc.data()};
      if(S.apiKey) apiKey=S.apiKey;
      try{localStorage.setItem('dnm_data',JSON.stringify(S));}catch(e){ console.error('Erro ao gravar dnm_data no localStorage em loadFromCloud:', e); }
    }
  } catch(e) { console.error('Erro ao carregar dados da nuvem:', e); }
}

async function syncDrive(){
  if(!fbUser || !fbDb) { alert('Faça login primeiro'); return; }
  const id=docId();
  if(!id){ alert('Defina um código de família em Configurações antes de sincronizar.'); return; }
  try {
    await fbDb.collection('usuarios').doc(id).set(S);
    alert('✅ Dados sincronizados!');
  } catch(e) { alert('Erro ao sincronizar: '+e.message); }
}

function salvarFamiliaId(){
  const v=document.getElementById('familia-id').value.trim();
  if(!v){ alert('Digite um código.'); return; }
  if(!fbUser || !fbDb){ alert('Faça login primeiro.'); return; }
  familiaId=v; localStorage.setItem('dnm_familia_id',v);
  updateFamiliaStatus();
  fbDb.collection('usuarios').doc(familiaId).get().then(doc=>{
    if(doc.exists){
      // Já existe dado nesse código — este aparelho ADOTA os dados, nunca sobrescreve.
      S = {...S, ...doc.data()};
      if(S.apiKey) apiKey=S.apiKey;
      try{localStorage.setItem('dnm_data',JSON.stringify(S));}catch(e){ console.error('Erro ao gravar dnm_data no localStorage em salvarFamiliaId:', e); }
      updateKeyStatus(); render();
      alert('Código vinculado! Os dados da família já foram carregados aqui.');
    } else {
      // Ninguém criou esse código ainda — este aparelho vira a base.
      const dataToSync = { ...S };
      delete dataToSync.apiKey;
      fbDb.collection('usuarios').doc(familiaId).set(dataToSync)
        .then(()=>alert('Código salvo! Este foi o primeiro aparelho com esse código — os dados daqui viraram a base da família.'))
        .catch(e=>alert('Erro ao gravar na nuvem: '+e.message+'\n\nProvavelmente as regras do Firestore estão bloqueando. Veja a mensagem que te mandei sobre isso.'));
    }
  }).catch(e=>{
    alert('Erro ao acessar a nuvem: '+e.message+'\n\nProvavelmente as regras do Firestore estão bloqueando o acesso a este código.');
    console.error(e);
  });
}
function updateFamiliaStatus(){
  const el=document.getElementById('familia-status');
  if(el) el.textContent = familiaId || 'Não definido';
}

// Salva local sempre; se logado, sincroniza na nuvem com debounce (evita gravar a cada tecla)
function save(){
  S.apiKey = apiKey;
  try{
    if(typeof localStorage !== 'undefined') localStorage.setItem('dnm_data',JSON.stringify(S));
  }catch(e){
    console.error('Erro ao salvar no localStorage em save():', e);
  }
  const id=docId();
  if(fbUser && fbDb && id){
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const dataToSync = { ...S };
      delete dataToSync.apiKey; // Segurança: nunca envia chave pessoal de IA para base compartilhada
      fbDb.collection('usuarios').doc(id).set(dataToSync).catch(e=>console.error('Erro ao sincronizar (confira as regras do Firestore):',e));
    }, 1500);
  }
}

// ONBOARDING / AUTENTICAÇÃO
if(typeof localStorage !== 'undefined') loadState();
if(typeof document !== 'undefined') {
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

function init(){ initFirebase(); }

function salvarKey(){
  const k=document.getElementById('key-input').value.trim();
  if(!k){alert('Cole a API Key para continuar.');return;}
  apiKey=k; S.onboardingDone=true; save();
  document.getElementById('onboarding').style.display='none';
  document.getElementById('app').style.display='flex';
  updateKeyStatus(); render();
}
function pularKey(){
  S.onboardingDone=true; save();
  document.getElementById('onboarding').style.display='none';
  document.getElementById('app').style.display='flex';
  render();
}
function atualizarKey(){
  const k=document.getElementById('new-key').value.trim();
  if(!k) return;
  apiKey=k; save();
  closeM('m-key'); updateKeyStatus();
  alert('Chave atualizada com sucesso!');
}
function updateKeyStatus(){
  const el=document.getElementById('key-status');
  if(el) el.textContent = apiKey ? '✅ Configurada' : '❌ Não configurada';
}

// NAV
const TITLES = {
  inicio: 'Mural da Família',
  explorar: 'Explorar Recursos',
  familia: 'Minha Família',
  atividade: 'Linha do Tempo',
  resumo: 'Resumo do mês',
  receitas: 'Receitas',
  gastos: 'Gastos',
  dividas: 'Dívidas',
  metas: 'Investimentos & Metas',
  agente: 'Agente Financeiro',
  config: 'Configurações'
};
const SECS = ['inicio', 'explorar', 'familia', 'atividade', 'resumo', 'receitas', 'gastos', 'dividas', 'metas', 'agente', 'config'];
const ROTAS_FINANCEIRAS = ['resumo', 'receitas', 'gastos', 'dividas', 'metas'];

function go(id) {
  if (!id) id = 'inicio';

  // Blindagem do perfil 'crianca': bloqueia acesso a rotas contábeis e financeiras
  const membroAtivo = obterMembroAtivo();
  if (membroAtivo && membroAtivo.papel === 'crianca' && ROTAS_FINANCEIRAS.includes(id)) {
    if (typeof alert === 'function') {
      alert('Área financeira restrita aos adultos e responsáveis da família.');
    }
    id = 'inicio';
  }

  if (typeof document === 'undefined') return;

  // Oculta todas as seções
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');

  // Exibe a seção ativa
  const targetSec = document.getElementById('sec-' + id);
  if (targetSec) {
    targetSec.style.display = 'block';
  }

  // Controle da Subnav de Finanças
  const subnavFin = document.getElementById('subnav-financas');
  if (subnavFin) {
    if (ROTAS_FINANCEIRAS.includes(id) || id === 'config') {
      subnavFin.style.display = 'flex';
      document.querySelectorAll('.subnav-btn').forEach(b => b.classList.remove('active'));
      const activeSubBtn = document.getElementById('snb-' + id);
      if (activeSubBtn) activeSubBtn.classList.add('active');
    } else {
      subnavFin.style.display = 'none';
    }
  }

  // Controle da Bottom Nav Bar
  document.querySelectorAll('.bottom-nav-btn, .bnav-btn').forEach(b => b.classList.remove('active'));
  const bnavBtn = document.getElementById('bnav-' + id);
  if (bnavBtn) {
    bnavBtn.classList.add('active');
  }

  // Nav legada (preservada para suítes de testes legadas)
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const legacyIdx = SECS.indexOf(id);
  const legacyButtons = document.querySelectorAll('.nav-btn');
  if (legacyIdx >= 0 && legacyButtons[legacyIdx]) {
    legacyButtons[legacyIdx].classList.add('active');
  }

  // Atualiza título do cabeçalho
  const titleEl = document.getElementById('header-title');
  if (titleEl && TITLES[id]) {
    titleEl.textContent = TITLES[id];
  }

  const superTitleEl = document.getElementById('header-supertitle');
  if (superTitleEl) {
    const circulo = obterCirculoAtivo();
    superTitleEl.textContent = circulo ? circulo.nome : 'Círculo Familiar';
  }

  const contentEl = document.getElementById('content');
  if (contentEl) contentEl.scrollTop = 0;

  render();
}

// --- MODAIS DO CÍRCULO FAMILIAR ---
function abrirModalCirculo() {
  const listaEl = document.getElementById('lista-circulos-modal') || document.getElementById('lista-circulos-selector');
  if (listaEl) {
    listaEl.innerHTML = (S.circulos || []).map(c => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;margin-bottom:8px;background:${c.id === S.circuloAtivoId ? 'var(--blue-dim)' : 'var(--bg3)'};border-radius:var(--radius-sm);cursor:pointer;border:1px solid ${c.id === S.circuloAtivoId ? 'var(--blue)' : 'var(--border2)'};" onclick="selecionarCirculo('${c.id}');closeM('m-circulo');">
        <div>
          <span style="font-weight:700;font-size:14px;">🏰 ${escapeHtml(c.nome)}</span>
          <p style="font-size:11px;color:var(--muted);margin-top:2px;">Código: ${escapeHtml(c.codigoConvite || 'N/A')}</p>
        </div>
        ${c.id === S.circuloAtivoId ? '<span style="color:var(--blue);font-weight:700;font-size:12px;">Ativo</span>' : ''}
      </div>
    `).join('');
  }
  openM('m-circulo');
}

function salvarNovoCirculo() {
  const input = document.getElementById('novo-circulo-nome') || document.getElementById('circulo-novo-nome');
  if (!input) return;
  const nome = input.value.trim();
  if (!nome) {
    if (typeof alert === 'function') alert('Digite o nome do novo círculo.');
    return;
  }
  criarCirculo(nome);
  input.value = '';
  closeM('m-circulo');
}

function salvarNovoCirculoModal() {
  salvarNovoCirculo();
}

function selecionarCorMembro(cor) {
  const corInput = document.getElementById('mb-cor') || document.getElementById('membro-edit-cor');
  if (corInput) corInput.value = cor;
  const paletaEl = document.getElementById('mb-cores-paleta');
  if (paletaEl) {
    paletaEl.querySelectorAll('div').forEach(d => {
      d.style.borderColor = d.dataset.cor === cor ? '#fff' : 'transparent';
    });
  }
}

function abrirModalMembro(membroId) {
  const mIdInput = document.getElementById('mb-edit-id') || document.getElementById('membro-edit-id');
  const nomeInput = document.getElementById('mb-nome') || document.getElementById('membro-edit-nome');
  const papelSelect = document.getElementById('mb-papel') || document.getElementById('membro-edit-papel');
  const anivInput = document.getElementById('mb-aniversario') || document.getElementById('membro-edit-aniv');
  const btnExcluir = document.getElementById('mb-btn-excluir') || document.getElementById('membro-btn-excluir');
  const corInput = document.getElementById('mb-cor') || document.getElementById('membro-edit-cor');

  let membroCor = '#5581E3';
  if (membroId) {
    const membro = (S.membrosPerfil || []).find(m => m.id === membroId);
    if (membro) {
      if (mIdInput) mIdInput.value = membro.id;
      if (nomeInput) nomeInput.value = membro.nome;
      if (papelSelect) papelSelect.value = membro.papel || 'membro';
      if (anivInput) anivInput.value = membro.aniversario || '';
      if (corInput) corInput.value = membro.cor || '#5581E3';
      membroCor = membro.cor || '#5581E3';
      if (btnExcluir) btnExcluir.style.display = 'block';
    }
  } else {
    if (mIdInput) mIdInput.value = '';
    if (nomeInput) nomeInput.value = '';
    if (papelSelect) papelSelect.value = 'membro';
    if (anivInput) anivInput.value = '';
    if (corInput) corInput.value = PALETA_FAMILIAR[0] || '#5581E3';
    membroCor = PALETA_FAMILIAR[0] || '#5581E3';
    if (btnExcluir) btnExcluir.style.display = 'none';
  }

  const paletaEl = document.getElementById('mb-cores-paleta');
  if (paletaEl) {
    paletaEl.innerHTML = PALETA_FAMILIAR.map(c => `
      <div data-cor="${c}" onclick="selecionarCorMembro('${c}')" style="width:28px;height:28px;border-radius:50%;background:${c};cursor:pointer;border:2px solid ${c === membroCor ? '#fff' : 'transparent'};"></div>
    `).join('');
  }

  openM('m-membro');
}

function salvarModalMembro() {
  const mIdInput = document.getElementById('mb-edit-id') || document.getElementById('membro-edit-id');
  const nomeInput = document.getElementById('mb-nome') || document.getElementById('membro-edit-nome');
  const papelSelect = document.getElementById('mb-papel') || document.getElementById('membro-edit-papel');
  const anivInput = document.getElementById('mb-aniversario') || document.getElementById('membro-edit-aniv');
  const corInput = document.getElementById('mb-cor') || document.getElementById('membro-edit-cor');

  const id = mIdInput ? mIdInput.value.trim() : '';
  const nome = nomeInput ? nomeInput.value.trim() : '';
  const papel = papelSelect ? papelSelect.value : 'membro';
  const aniversario = anivInput ? anivInput.value.trim() : '';
  const cor = corInput ? corInput.value.trim() : '';

  if (!nome) {
    if (typeof alert === 'function') alert('Informe o nome do membro.');
    return;
  }

  salvarMembroCirculo({ id, nome, papel, aniversario, cor });
  closeM('m-membro');
}

function salvarMembroModal() {
  salvarModalMembro();
}

function excluirModalMembro() {
  const mIdInput = document.getElementById('mb-edit-id') || document.getElementById('membro-edit-id');
  const id = mIdInput ? mIdInput.value.trim() : '';
  if (!id) return;

  if (typeof confirm === 'function' && !confirm('Tem certeza de que deseja remover este membro do círculo?')) {
    return;
  }

  const ok = excluirMembroCirculo(id);
  if (ok) {
    closeM('m-membro');
  }
}

function excluirMembroModal() {
  excluirModalMembro();
}

function abrirModalConviteCirculo() {
  const convite = gerarConviteCirculo();
  if (!convite) return;

  const circulo = obterCirculoAtivo();
  const cvCirculoNome = document.getElementById('cv-circulo-nome');
  if (cvCirculoNome && circulo) cvCirculoNome.textContent = circulo.nome;

  const codEl = document.getElementById('cv-codigo-txt') || document.getElementById('convite-circulo-codigo');
  const linkEl = document.getElementById('convite-link-texto');
  const expiraEl = document.getElementById('cv-expira-txt') || document.getElementById('convite-expira-texto');

  if (codEl) codEl.textContent = convite.codigo;
  if (linkEl) linkEl.value = convite.link;
  if (expiraEl) {
    const d = new Date(convite.expiraEm);
    expiraEl.textContent = `Válido até ${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  openM('m-convite-circulo');
}

function abrirModalConvite() {
  abrirModalConviteCirculo();
}

function copiarCodigoConvite() {
  const codEl = document.getElementById('cv-codigo-txt') || document.getElementById('convite-circulo-codigo');
  const codigo = codEl ? codEl.textContent : '';
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(codigo).catch(err => console.error('Erro ao copiar código:', err));
  }
  exibirToastNotificacao(`Código "${codigo}" copiado para a área de transferência!`, '📋');
}

function copiarLinkConvite() {
  copiarCodigoConvite();
}

function gerarNovoConviteModal() {
  abrirModalConviteCirculo();
}

function abrirModalNotifPrefs() {
  const prefs = S.preferenciasNotificacao || {};
  const setChk = (ids, val) => {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    });
  };

  setChk(['np-eventos', 'pref-notif-eventos'], prefs.eventos !== false);
  setChk(['np-financas', 'pref-notif-financas'], prefs.financas !== false);
  setChk(['np-listas', 'pref-notif-listas'], prefs.listas !== false);
  setChk(['pref-notif-docs'], prefs.documentos !== false);
  setChk(['pref-notif-mensagens'], prefs.mensagens !== false);
  setChk(['np-ocultar-valores', 'pref-notif-ocultar-valores'], prefs.ocultarValores === true);

  const setVal = (ids, val) => {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    });
  };

  setVal(['np-silencio-ini', 'pref-notif-silencio-ini'], prefs.silencioInicio || '22:00');
  setVal(['np-silencio-fim', 'pref-notif-silencio-fim'], prefs.silencioFim || '07:00');

  openM('m-notif-prefs');
}

function salvarModalNotifPrefs() {
  const getChk = (...ids) => {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) return el.checked;
    }
    return true;
  };

  const getVal = (fallback, ...ids) => {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.value) return el.value;
    }
    return fallback;
  };

  const novasPrefs = {
    eventos: getChk('np-eventos', 'pref-notif-eventos'),
    financas: getChk('np-financas', 'pref-notif-financas'),
    listas: getChk('np-listas', 'pref-notif-listas'),
    documentos: getChk('pref-notif-docs'),
    mensagens: getChk('pref-notif-mensagens'),
    ocultarValores: Boolean(document.getElementById('np-ocultar-valores')?.checked || document.getElementById('pref-notif-ocultar-valores')?.checked),
    silencioInicio: getVal('22:00', 'np-silencio-ini', 'pref-notif-silencio-ini'),
    silencioFim: getVal('07:00', 'np-silencio-fim', 'pref-notif-silencio-fim')
  };

  salvarPreferenciasNotificacao(novasPrefs);
  closeM('m-notif-prefs');
  exibirToastNotificacao('Preferências de notificação atualizadas!', '⚙️');
  renderAtividadeFeed();
}

function salvarNotifPrefsModal() {
  return salvarModalNotifPrefs();
}

// MODALS
function openM(id){ if (typeof document !== 'undefined') document.getElementById(id)?.classList.add('open'); }
function closeM(id){ if (typeof document !== 'undefined') document.getElementById(id)?.classList.remove('open'); }
if (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function') {
  document.querySelectorAll('.modal-bg').forEach(m=>{
    m.addEventListener('click',e=>{ if(e.target===m) m.classList.remove('open'); });
  });
}

function selTag(el){ document.querySelectorAll('#cat-tags .tag').forEach(t=>t.classList.remove('sel')); el.classList.add('sel'); }

// VISÃO MENSAL & GESTÃO FAMILIAR
// mesAtual é declarado no topo do arquivo para uso prévio em loadState()
let filtroTitularGasto = 'todos';
let filtroTitularReceita = 'todos';

function getNomeCategoria(catId){
  const found = (S.categoriasGastos || DEFAULT_CATEGORIAS_GASTOS).find(c => c.id === catId);
  return found ? found.nome : (catId || 'Outro');
}

function getCorCategoria(catId){
  const found = (S.categoriasGastos || DEFAULT_CATEGORIAS_GASTOS).find(c => c.id === catId);
  return found && found.cor ? found.cor : 'c-muted';
}

function mesLabel(ym){
  if(!ym) return '';
  const [y,m]=ym.split('-').map(Number);
  const nomes=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  return `${nomes[m-1]}/${y}`;
}

// Altera o mês ativo, processa inadimplência de 60 dias para o novo contexto e renderiza
function setMes(novoMes){
  if(novoMes) mesAtual = String(novoMes).slice(0, 7);
  processarInadimplencia60Dias();
  render();
}

function mudarMes(delta){
  const [y,m]=mesAtual.split('-').map(Number);
  const d=new Date(y, (m-1)+delta, 1);
  const novoMes = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
  setMes(novoMes);
}

function adicionarMeses(isoDateStr, qtdMeses) {
  const partes = (isoDateStr || new Date().toISOString().slice(0,10)).split('-').map(Number);
  const y = partes[0], m = partes[1], d = partes[2] || 1;
  const dataObj = new Date(y, (m - 1) + qtdMeses, 1);
  const ultimoDia = new Date(dataObj.getFullYear(), dataObj.getMonth() + 1, 0).getDate();
  const diaReal = Math.min(d, ultimoDia);
  return `${dataObj.getFullYear()}-${String(dataObj.getMonth() + 1).padStart(2, '0')}-${String(diaReal).padStart(2, '0')}`;
}

// SANITIZAÇÃO & XSS
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// TITULARES & FILTROS
function obterTitularesUnicos() {
  const set = new Set(S.membrosFamilia || []);
  (S.receitas||[]).forEach(r => { if (r.titular && r.titular.trim()) set.add(r.titular.trim()); });
  (S.gastos||[]).forEach(g => { if (g.titular && g.titular.trim()) set.add(g.titular.trim()); });
  (S.dividas||[]).forEach(d => { if (d.titular && d.titular.trim()) set.add(d.titular.trim()); });
  (S.investimentos||[]).forEach(inv => { if (inv.titular && inv.titular.trim()) set.add(inv.titular.trim()); });
  (S.cartoes||[]).forEach(c => { if (c.titular && c.titular.trim()) set.add(c.titular.trim()); });
  return Array.from(set).sort();
}

function atualizarDatalistTitulares() {
  const nomes = obterTitularesUnicos();
  const html = nomes.map(n => `<option value="${escapeHtml(n)}"></option>`).join('');
  ['titulares-list', 'lista-titulares'].forEach(id => {
    const dl = document.getElementById(id);
    if (dl) dl.innerHTML = html;
  });
}

function addMembroFamilia(){
  const input = document.getElementById('novo-membro');
  const nome = input.value.trim();
  if(!nome) return;
  if(!S.membrosFamilia) S.membrosFamilia = [];
  if(!S.membrosFamilia.includes(nome)){
    S.membrosFamilia.push(nome);
    save();
    render();
  }
  input.value = '';
}

function delMembroFamilia(nome){
  if(confirm(`Deseja remover ${nome} da lista de membros da família?`)){
    S.membrosFamilia = S.membrosFamilia.filter(n => n !== nome);
    save();
    render();
  }
}

// CATEGORIAS DE GASTOS DINÂMICAS
function addCategoriaGasto(){
  const input = document.getElementById('nova-categoria');
  const nome = input.value.trim();
  if(!nome) return;
  const id = 'cat_' + Date.now().toString(36);
  if(!S.categoriasGastos) S.categoriasGastos = [...DEFAULT_CATEGORIAS_GASTOS];
  if(!S.categoriasGastos.some(c => c.nome.toLowerCase() === nome.toLowerCase())){
    S.categoriasGastos.push({ id, nome, cor: 'c-muted' });
    save();
    render();
  }
  input.value = '';
}

function delCategoriaGasto(id){
  if(confirm('Deseja remover esta categoria de gastos?')){
    S.categoriasGastos = (S.categoriasGastos || []).filter(c => c.id !== id);
    if(!S.categoriasGastos.length) S.categoriasGastos = [...DEFAULT_CATEGORIAS_GASTOS];
    save();
    render();
  }
}

function renderCategoriasConfig(){
  const el = document.getElementById('lista-categorias');
  if(!el) return;
  el.innerHTML = (S.categoriasGastos || DEFAULT_CATEGORIAS_GASTOS).map(c => `
    <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg3);padding:8px 12px;border-radius:var(--radius-sm);">
      <span>${escapeHtml(c.nome)}</span>
      <span class="item-del" style="font-size:18px;" onclick="delCategoriaGasto('${escapeHtml(c.id)}')">×</span>
    </div>
  `).join('');
}

// TIPOS DE DÍVIDAS DINÂMICOS
function addTipoDivida(){
  const input = document.getElementById('novo-tipo-divida');
  const nome = input.value.trim();
  if(!nome) return;
  const id = 'tipo_' + Date.now().toString(36);
  if(!S.tiposDivida) S.tiposDivida = [...DEFAULT_TIPOS_DIVIDA];
  if(!S.tiposDivida.some(t => t.nome.toLowerCase() === nome.toLowerCase())){
    S.tiposDivida.push({ id, nome });
    sincronizarTiposDividaMap();
    save();
    render();
  }
  input.value = '';
}

function delTipoDivida(id){
  if(confirm('Deseja remover este tipo de dívida?')){
    S.tiposDivida = (S.tiposDivida || []).filter(t => t.id !== id);
    if(!S.tiposDivida.length) S.tiposDivida = [...DEFAULT_TIPOS_DIVIDA];
    sincronizarTiposDividaMap();
    save();
    render();
  }
}

function renderTiposDividaConfig(){
  const el = document.getElementById('lista-tipos-divida');
  if(!el) return;
  el.innerHTML = (S.tiposDivida || DEFAULT_TIPOS_DIVIDA).map(t => `
    <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg3);padding:8px 12px;border-radius:var(--radius-sm);">
      <span>${escapeHtml(t.nome)}</span>
      <span class="item-del" style="font-size:18px;" onclick="delTipoDivida('${escapeHtml(t.id)}')">×</span>
    </div>
  `).join('');
}

function renderConfig(){
  const el = document.getElementById('lista-membros');
  if(el){
    el.innerHTML = (S.membrosFamilia || []).map(nome => `
      <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg3);padding:8px 12px;border-radius:var(--radius-sm);">
        <span>${escapeHtml(nome)}</span>
        <span class="item-del" style="font-size:18px;" onclick="delMembroFamilia('${escapeHtml(nome)}')">×</span>
      </div>
    `).join('');
  }
  renderCategoriasConfig();
  renderTiposDividaConfig();
}

function renderCategoriasModalGasto(){
  const el = document.getElementById('cat-tags');
  if(!el) return;
  const cats = S.categoriasGastos || DEFAULT_CATEGORIAS_GASTOS;
  const selAtual = document.querySelector('#cat-tags .tag.sel')?.dataset.cat || cats[0]?.id || 'recorrente';
  el.innerHTML = cats.map(c => `
    <button type="button" class="tag ${c.id===selAtual?'sel':''}" data-cat="${escapeHtml(c.id)}" onclick="selTag(this)">${escapeHtml(c.nome)}</button>
  `).join('');
}

function atualizarSelectsTipoDivida(){
  const sGasto = document.getElementById('g-tipo-divida');
  const sDivida = document.getElementById('d-tipo');
  const tipos = S.tiposDivida || DEFAULT_TIPOS_DIVIDA;
  const optionsHtml = tipos.map(t => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.nome)}</option>`).join('');
  if(sGasto) sGasto.innerHTML = optionsHtml;
  if(sDivida) sDivida.innerHTML = optionsHtml;
}

function setFiltroTitularGasto(titular) {
  filtroTitularGasto = titular;
  renderGastos();
}

function setFiltroTitularReceita(titular) {
  filtroTitularReceita = titular;
  renderReceitas();
}

function renderFiltroTitulares(containerId, titularSelecionado, onClickFnName) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const titulares = obterTitularesUnicos();
  if (titulares.length <= 1) {
    el.innerHTML = '';
    return;
  }
  let html = `<button class="filtro-pill ${titularSelecionado==='todos'?'sel':''}" onclick="${onClickFnName}('todos')">Todos</button>`;
  titulares.forEach(t => {
    const safeLabel = escapeHtml(t);
    const encParam = encodeURIComponent(t);
    html += `<button class="filtro-pill ${titularSelecionado===t?'sel':''}" onclick="${onClickFnName}(decodeURIComponent('${encParam}'))">${safeLabel}</button>`;
  });
  el.innerHTML = html;
}

// REGRAS DE INADIMPLÊNCIA & GASTOS DO MÊS
function gastosPrevistosDoMes(){
  return (S.gastos||[]).filter(g => (g.data||'').slice(0,7) === mesAtual && !g.canceladaNegativacao);
}

// Contas de meses anteriores que continuam não pagas acumulam no mês vigente
// Contas com atraso >= 60 dias (migradas para S.dividas) deixam de acumular aqui
function gastosInadimplentesDoMes(){
  return (S.gastos||[]).filter(g => (g.data||'').slice(0,7) < mesAtual && !g.pago && !g.negociado && !g.migradoDivida);
}

function gastosDoMes(){
  const previstos = gastosPrevistosDoMes();
  const inadimplentes = gastosInadimplentesDoMes();
  return [...inadimplentes, ...previstos];
}

function receitasDoMes(){
  return (S.receitas||[]).filter(r => (r.data||'').slice(0,7) === mesAtual);
}

function updateMesLabel(){
  document.querySelectorAll('.mes-label').forEach(el=>el.textContent=mesLabel(mesAtual));
}

function dataDefaultParaModal(){
  const hojeYM=new Date().toISOString().slice(0,7);
  return mesAtual===hojeYM ? new Date().toISOString().slice(0,10) : mesAtual+'-01';
}

function toggleCamposParcelamento(){
  const chk = document.getElementById('g-is-parcelado');
  const bloco = document.getElementById('g-bloco-parcelamento');
  if (bloco) bloco.style.display = chk && chk.checked ? 'block' : 'none';
  if (chk && chk.checked) {
    const chkRec = document.getElementById('g-is-recorrente');
    if (chkRec && chkRec.checked) {
      chkRec.checked = false;
      toggleCamposRecorrente();
    }
  }
  atualizarPreviewParcelas();
}

function toggleCamposRecorrente(){
  const chk = document.getElementById('g-is-recorrente');
  const bloco = document.getElementById('g-bloco-recorrente');
  if (bloco) bloco.style.display = chk && chk.checked ? 'block' : 'none';
  if (chk && chk.checked) {
    const chkParc = document.getElementById('g-is-parcelado');
    if (chkParc && chkParc.checked) {
      chkParc.checked = false;
      toggleCamposParcelamento();
    }
  }
  atualizarPreviewRecorrente();
}

function atualizarPreviewRecorrente(){
  const chk = document.getElementById('g-is-recorrente');
  const prev = document.getElementById('g-preview-recorrente');
  if (!chk || !chk.checked) { if (prev) prev.textContent = ''; return; }
  const val = parseFloat(document.getElementById('g-val').value) || 0;
  const prazoSel = document.getElementById('g-prazo-recorrente')?.value || '12';
  const rowPers = document.getElementById('g-row-meses-personalizado');
  
  let qtdMeses = 12;
  if (prazoSel === 'personalizado') {
    if(rowPers) rowPers.style.display = 'block';
    qtdMeses = parseInt(document.getElementById('g-meses-recorrente')?.value) || 12;
  } else {
    if(rowPers) rowPers.style.display = 'none';
    if (prazoSel === 'ano_atual') {
      const dataVal = document.getElementById('g-data')?.value || mesAtual;
      const mesNum = parseInt(dataVal.split('-')[1]) || 1;
      qtdMeses = Math.max(1, 12 - mesNum + 1);
    } else {
      qtdMeses = parseInt(prazoSel) || 12;
    }
  }

  if (val > 0) {
    prev.textContent = `Serão gerados ${qtdMeses} meses de ${fmt(val)} cada (total de ${fmt(val * qtdMeses)} no período).`;
  } else {
    prev.textContent = `Serão gerados ${qtdMeses} meses recorrentes com este valor mensal.`;
  }
}

function atualizarPreviewParcelas(){
  const chk = document.getElementById('g-is-parcelado');
  const prev = document.getElementById('g-preview-parcela');
  if (!chk || !chk.checked) { if (prev) prev.textContent = ''; return; }
  const val = parseFloat(document.getElementById('g-val').value) || 0;
  const num = parseInt(document.getElementById('g-num-parcelas').value) || 1;
  if (val > 0 && num > 1) {
    const baseCentavos = Math.floor((val / num) * 100);
    const restoCentavos = Math.round(val * 100) - (baseCentavos * num);
    const vBase = baseCentavos / 100;
    if (restoCentavos === 0) {
      prev.textContent = `Serão geradas ${num}x de ${fmt(vBase)} para os próximos ${num} meses.`;
    } else {
      const vFinal = (baseCentavos + restoCentavos) / 100;
      prev.textContent = `Serão geradas ${num - 1}x de ${fmt(vBase)} + 1x de ${fmt(vFinal)} para os próximos ${num} meses.`;
    }
  } else {
    if (prev) prev.textContent = '';
  }
}

function togglePagoGasto(id){
  const g = S.gastos.find(x => x.id === id);
  if (!g) return;
  g.pago = !g.pago;
  if (g.pago) {
    g.dataPagto = new Date().toISOString().slice(0,10);
  } else {
    g.dataPagto = null;
    // Se era uma parcela adiantada e foi desmarcada, reverte a data para o vencimento original
    if (g.adiantada && g.dataOriginal) {
      g.data = g.dataOriginal;
      g.adiantada = false;
    }
  }
  save();
  render();
}

// ADIANTAMENTO DE PARCELAS
let adiantarGrupoId = null;

function abrirModalAdiantar(grupoId){
  adiantarGrupoId = grupoId;
  const parcelas = S.gastos.filter(g => g.grupoId === grupoId).sort((a, b) => a.parcelaNum - b.parcelaNum);
  if (!parcelas.length) return;
  const prim = parcelas[0];
  const pagas = parcelas.filter(p => p.pago).length;
  const abertas = parcelas.filter(p => !p.pago);
  
  document.getElementById('ad-compra-nome').textContent = prim.descOriginal || prim.desc;
  document.getElementById('ad-compra-status').textContent = `${pagas} de ${parcelas.length} parcelas pagas • ${abertas.length} em aberto`;
  
  // Próxima parcela futura em aberto
  const proximaFutura = parcelas.find(p => !p.pago && (p.dataOriginal || p.data || '').slice(0, 7) > mesAtual);
  const txtProx = document.getElementById('ad-txt-proxima');
  if (proximaFutura) {
    const dataRef = proximaFutura.dataOriginal || proximaFutura.data;
    txtProx.textContent = `Antecipa a parcela ${proximaFutura.parcelaNum}/${parcelas.length} (${fmt(proximaFutura.val)}) de ${mesLabel(dataRef.slice(0,7))}. O próximo mês fica livre dessa cobrança!`;
  } else {
    txtProx.textContent = `Não há parcelas futuras em aberto para adiantar.`;
  }
  
  // Última parcela futura em aberto (amortização do final)
  const parcelasFuturas = parcelas.filter(p => !p.pago && (p.dataOriginal || p.data || '').slice(0, 7) > mesAtual);
  const ultimaFutura = parcelasFuturas[parcelasFuturas.length - 1];
  const txtFinal = document.getElementById('ad-txt-final');
  if (ultimaFutura) {
    const dataRef = ultimaFutura.dataOriginal || ultimaFutura.data;
    txtFinal.textContent = `Amortiza a parcela final ${ultimaFutura.parcelaNum}/${parcelas.length} (${fmt(ultimaFutura.val)}) de ${mesLabel(dataRef.slice(0,7))}. Encurta o término da dívida em 1 mês!`;
  } else {
    txtFinal.textContent = `Não há parcelas futuras em aberto para amortizar do final.`;
  }
  
  // Histórico de parcelas
  const gradeEl = document.getElementById('ad-grade-parcelas');
  gradeEl.innerHTML = parcelas.map(p => {
    const ym = (p.dataOriginal || p.data || '').slice(0,7);
    const isAtual = (p.data||'').slice(0,7) === mesAtual;
    const statusTxt = p.pago ? `<span class="c-green" style="font-weight:600;">✓ Paga</span>` : `<span class="c-red">⏳ Aberta</span>`;
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;${isAtual?'background:var(--bg3);border-radius:4px;padding:6px 8px;':''}">
      <span>Parcela ${p.parcelaNum}/${p.totalParcelas} (${mesLabel(ym)})${p.adiantada?' <span class="badge b-parc">Adiantada</span>':''}</span>
      <div style="display:flex;align-items:center;gap:8px;">
        <span>${fmt(p.val)}</span>
        ${statusTxt}
      </div>
    </div>`;
  }).join('');
  
  openM('m-adiantar');
}

function confirmarAdiantamento(modo){
  if (!adiantarGrupoId) return;
  const parcelas = S.gastos.filter(g => g.grupoId === adiantarGrupoId).sort((a, b) => a.parcelaNum - b.parcelaNum);
  const parcelasFuturas = parcelas.filter(p => !p.pago && (p.dataOriginal || p.data || '').slice(0, 7) > mesAtual);
  
  if (!parcelasFuturas.length) {
    alert('Não há parcelas futuras em aberto para adiantar neste parcelamento.');
    return;
  }
  
  let alvo = null;
  if (modo === 'proxima') {
    alvo = parcelasFuturas[0]; // próxima do mês seguinte
  } else {
    alvo = parcelasFuturas[parcelasFuturas.length - 1]; // última do final
  }
  
  if (!alvo) return;
  
  if (!alvo.dataOriginal) {
    alvo.dataOriginal = alvo.data;
  }
  
  const hoje = new Date().toISOString().slice(0, 10);
  const diaBase = (alvo.dataOriginal || alvo.data || hoje).slice(8, 10) || '01';
  alvo.data = mesAtual + '-' + diaBase;
  alvo.pago = true;
  alvo.dataPagto = hoje;
  alvo.adiantada = true;
  
  save();
  closeM('m-adiantar');
  render();
  alert(`✅ Parcela ${alvo.parcelaNum}/${alvo.totalParcelas} adiantada com sucesso para ${mesLabel(mesAtual)}!`);
}

// NEGOCIAÇÃO DE GASTOS / DÍVIDAS ATRASADAS
let negociandoGastoId = null;

function abrirModalNegociarGasto(gastoId){
  negociandoGastoId = gastoId;
  const g = S.gastos.find(x => x.id === gastoId);
  if (!g) return;

  const hoje = new Date().toISOString().slice(0, 10);
  const mesOrig = (g.dataOriginal || g.data || '').slice(0, 7);
  
  document.getElementById('neg-orig-desc').textContent = g.descOriginal || g.desc;
  document.getElementById('neg-orig-titular').textContent = g.titular || 'Alex';
  document.getElementById('neg-orig-data').textContent = mesLabel(mesOrig);
  document.getElementById('neg-orig-val').textContent = fmt(g.val);

  document.getElementById('neg-entrada').value = '';
  document.getElementById('neg-data-entrada').value = hoje;
  document.getElementById('neg-row-data-entrada').style.display = 'none';

  document.getElementById('neg-parcelas').value = '6';
  
  // 1º vencimento: próximo mês no mesmo dia ou dia 10
  const diaBase = (g.dataOriginal || g.data || hoje).slice(8, 10) || '10';
  const proximoVenc = adicionarMeses(mesAtual + '-' + diaBase, 1);
  document.getElementById('neg-primeiro-vencimento').value = proximoVenc;
  
  // Sugestão inicial: valor total = valor pendente original
  document.getElementById('neg-valor-total').value = g.val.toFixed(2);
  document.getElementById('neg-valor-parcela').value = (g.val / 6).toFixed(2);
  document.getElementById('neg-juros').value = '';

  // Preenche opções de tipo de dívida
  const selTipo = document.getElementById('neg-tipo-divida');
  if (selTipo) {
    const tipos = S.tiposDivida || DEFAULT_TIPOS_DIVIDA;
    selTipo.innerHTML = tipos.map(t => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.nome)}</option>`).join('');
    if (g.tipoDivida) selTipo.value = g.tipoDivida;
  }

  atualizarResumoNegociacao('total');
  openM('m-negociar-gasto');
}

function atualizarResumoNegociacao(origemMudanca){
  const g = S.gastos.find(x => x.id === negociandoGastoId);
  const vOrig = g ? g.val : 0;
  
  const entrada = Math.max(0, parseFloat(document.getElementById('neg-entrada').value) || 0);
  const rowDataEntrada = document.getElementById('neg-row-data-entrada');
  if (rowDataEntrada) rowDataEntrada.style.display = entrada > 0 ? 'block' : 'none';

  const numParc = Math.max(1, parseInt(document.getElementById('neg-parcelas').value) || 1);
  let vTotal = parseFloat(document.getElementById('neg-valor-total').value) || 0;
  let vParc = parseFloat(document.getElementById('neg-valor-parcela').value) || 0;

  if (origemMudanca === 'parcela') {
    vTotal = entrada + (vParc * numParc);
    document.getElementById('neg-valor-total').value = vTotal > 0 ? vTotal.toFixed(2) : '';
  } else if (origemMudanca === 'total' || origemMudanca === 'entrada' || origemMudanca === 'parcelas') {
    const saldoFinanciar = Math.max(0, vTotal - entrada);
    vParc = saldoFinanciar / numParc;
    document.getElementById('neg-valor-parcela').value = vParc > 0 ? vParc.toFixed(2) : '';
  }

  const acrescimo = vTotal - vOrig;
  
  document.getElementById('neg-resumo-orig').textContent = fmt(vOrig);
  document.getElementById('neg-resumo-entrada').textContent = entrada > 0 ? fmt(entrada) : 'R$ 0,00';
  document.getElementById('neg-resumo-parcelamento').textContent = `${numParc}x de ${fmt(vParc)} (${fmt(vParc * numParc)})`;
  
  const acrescimoEl = document.getElementById('neg-resumo-acrescimo');
  if (acrescimo > 0.01) {
    acrescimoEl.textContent = `+ ${fmt(acrescimo)} (juros/encargos)`;
    acrescimoEl.style.color = 'var(--yellow)';
  } else if (acrescimo < -0.01) {
    acrescimoEl.textContent = `- ${fmt(Math.abs(acrescimo))} (desconto obtido 🎉)`;
    acrescimoEl.style.color = 'var(--green)';
  } else {
    acrescimoEl.textContent = 'Sem juros adicionais';
    acrescimoEl.style.color = 'var(--muted)';
  }

  document.getElementById('neg-resumo-total').textContent = fmt(vTotal);
}

function salvarNegociacaoGasto(){
  const g = S.gastos.find(x => x.id === negociandoGastoId);
  if (!g) return;

  const entrada = Math.max(0, parseFloat(document.getElementById('neg-entrada').value) || 0);
  const dataEntrada = document.getElementById('neg-data-entrada').value || new Date().toISOString().slice(0, 10);
  const num = Math.max(1, parseInt(document.getElementById('neg-parcelas').value) || 1);
  const vTotal = parseFloat(document.getElementById('neg-valor-total').value);
  const primeiroVenc = document.getElementById('neg-primeiro-vencimento').value || adicionarMeses(new Date().toISOString().slice(0,10), 1);
  const tipoDivida = document.getElementById('neg-tipo-divida').value || g.tipoDivida || 'cartao';
  const juros = parseFloat(document.getElementById('neg-juros').value) || null;

  if (!vTotal || vTotal <= 0) {
    alert('Informe o valor total da negociação ou o valor das parcelas.');
    return;
  }

  if (entrada >= vTotal) {
    alert('A entrada não pode ser igual ou maior que o valor total negociado.');
    return;
  }

  const valorRestante = Math.round((vTotal - entrada) * 100) / 100;
  const baseCentavos = Math.floor((valorRestante / num) * 100);
  const restoCentavos = Math.round(valorRestante * 100) - (baseCentavos * num);
  const grupoId = 'acordo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  const nomeBase = g.descOriginal || g.desc;
  const credorOrigem = g.origemDivida || nomeBase;
  const hoje = new Date().toISOString().slice(0, 10);

  // 1. Marca a dívida/gasto antigo como negociado e pago (sai das cobranças e inadimplência)
  g.negociado = true;
  g.pago = true;
  g.dataPagto = hoje;
  g.motivoQuitacao = `Negociado em acordo (${num}x)`;
  g.acordoGeradoId = grupoId;

  // 2. Se houve entrada, gera o gasto da entrada no mês correspondente
  if (entrada > 0) {
    S.gastos.push({
      id: Date.now() + 999,
      grupoId,
      desc: `Entrada Acordo: ${nomeBase}`,
      descOriginal: `Entrada Acordo: ${nomeBase}`,
      val: entrada,
      valTotal: entrada,
      cat: g.cat || 'recorrente',
      titular: g.titular,
      tipoDivida,
      origemDivida: credorOrigem,
      parcelado: false,
      recorrente: false,
      data: dataEntrada,
      dataOriginal: dataEntrada,
      pago: true,
      dataPagto: dataEntrada,
      adiantada: false
    });
  }

  // 3. Gera as novas parcelas conforme vencimento mês a mês (com suporte nativo a amortização/adiantamento)
  for (let i = 1; i <= num; i++) {
    const centavosDesta = baseCentavos + (i === num ? restoCentavos : 0);
    const vParc = centavosDesta / 100;
    const dt = adicionarMeses(primeiroVenc, i - 1);
    S.gastos.push({
      id: Date.now() + i,
      grupoId,
      desc: `Acordo: ${nomeBase} (${i}/${num})`,
      descOriginal: `Acordo: ${nomeBase}`,
      val: vParc,
      valTotal: valorRestante,
      cat: g.cat || 'recorrente',
      titular: g.titular,
      tipoDivida,
      origemDivida: credorOrigem,
      parcelado: true, // Habilita amortização/adiantamento nativo
      recorrente: false,
      parcelaNum: i,
      totalParcelas: num,
      data: dt,
      dataOriginal: dt,
      pago: false,
      dataPagto: null,
      adiantada: false,
      jurosAcordo: juros
    });
  }

  save();
  closeM('m-negociar-gasto');
  render();
  alert(`✅ Negociação confirmada com sucesso!\nO gasto atrasado foi baixado e ${num} nova(s) parcela(s) de ${fmt(baseCentavos/100)} foram geradas.`);
}

// CARTÕES DE CRÉDITO (Fatia 2)
function toggleAnuidadeCartao() {
  const chk = document.getElementById('cartao-tem-anuidade');
  const bloco = document.getElementById('bloco-anuidade-cartao');
  if (bloco) {
    bloco.style.display = chk && chk.checked ? 'block' : 'none';
  }
}

function atualizarTotalAnuidade() {
  const parcEl = document.getElementById('cartao-anuidade-parcelas');
  const valParcEl = document.getElementById('cartao-anuidade-valor-parcela');
  const totalEl = document.getElementById('cartao-anuidade-valor-total');
  if (!parcEl || !valParcEl || !totalEl) return;
  const numParc = parseInt(parcEl.value, 10) || 0;
  const valParc = parseFloat(String(valParcEl.value).replace(',', '.')) || 0;
  if (numParc > 0 && valParc > 0) {
    const totalCentavos = Math.round(numParc * Math.round(valParc * 100));
    totalEl.value = (totalCentavos / 100).toFixed(2);
  }
}

function abrirModalCartao(cartaoId = null) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = (val !== null && val !== undefined) ? String(val) : '';
  };

  const elEditId = document.getElementById('c-edit-id');
  const elTitle = document.getElementById('c-modal-title');
  const elBtn = document.getElementById('c-btn-salvar');

  if (cartaoId !== null && cartaoId !== undefined && cartaoId !== '') {
    // Modo Edição
    const cartao = (S.cartoes || []).find(c => String(c.id) === String(cartaoId));
    if (!cartao) return;

    if (elEditId) elEditId.value = cartao.id;
    if (elTitle) elTitle.textContent = '✏️ Editar Cartão de Crédito';
    if (elBtn) elBtn.textContent = 'Salvar Alterações';

    setVal('cartao-nome', cartao.nome || '');
    setVal('c-nome', cartao.nome || '');
    setVal('cartao-titular', cartao.titular || '');
    setVal('c-titular', cartao.titular || '');
    setVal('cartao-taxa-atraso', (cartao.taxaRotativo !== undefined && cartao.taxaRotativo !== null) ? cartao.taxaRotativo : '');
    setVal('c-taxa-rotativo', (cartao.taxaRotativo !== undefined && cartao.taxaRotativo !== null) ? cartao.taxaRotativo : '');
    setVal('cartao-dia-vencimento', cartao.diaVencimento || '10');
    setVal('c-dia-vencimento', cartao.diaVencimento || '10');
    setVal('c-dia-fechamento', cartao.diaFechamento || '');
    setVal('c-limite', (cartao.limiteTotal !== undefined && cartao.limiteTotal !== null) ? cartao.limiteTotal : '');

    const chk = document.getElementById('cartao-tem-anuidade');
    const bloco = document.getElementById('bloco-anuidade-cartao');
    const temAnuidade = Boolean(cartao.anuidade && cartao.anuidade.possui);
    if (chk) chk.checked = temAnuidade;
    if (bloco) bloco.style.display = temAnuidade ? 'block' : 'none';

    setVal('cartao-anuidade-parcelas', cartao.anuidade?.parcelas || '12');
    setVal('cartao-anuidade-valor-parcela', cartao.anuidade?.valorParcela || '');
    setVal('cartao-anuidade-valor-total', cartao.anuidade?.valorTotal || '');
    setVal('cartao-anuidade-mes-inicio', cartao.anuidade?.mesInicio || new Date().toISOString().slice(0, 7));

  } else {
    // Modo Criação
    if (elEditId) elEditId.value = '';
    if (elTitle) elTitle.textContent = 'Cadastrar Cartão de Crédito';
    if (elBtn) elBtn.textContent = 'Salvar Cartão';

    setVal('cartao-nome', '');
    setVal('c-nome', '');
    setVal('cartao-titular', '');
    setVal('c-titular', '');
    setVal('cartao-taxa-atraso', '');
    setVal('c-taxa-rotativo', '');
    setVal('cartao-dia-vencimento', '10');
    setVal('c-dia-vencimento', '10');
    setVal('c-dia-fechamento', '');
    setVal('c-limite', '');

    const chk = document.getElementById('cartao-tem-anuidade');
    if (chk) chk.checked = false;

    const bloco = document.getElementById('bloco-anuidade-cartao');
    if (bloco) bloco.style.display = 'none';

    setVal('cartao-anuidade-parcelas', '12');
    setVal('cartao-anuidade-valor-parcela', '');
    setVal('cartao-anuidade-valor-total', '');

    const mesAtualHoje = new Date().toISOString().slice(0, 7);
    setVal('cartao-anuidade-mes-inicio', mesAtualHoje);
  }

  atualizarDatalistTitulares();
  openM('m-cartao');
}

function salvarCartao(dadosOverride) {
  const elEditId = typeof document !== 'undefined' ? document.getElementById('c-edit-id') : null;
  const editIdRaw = dadosOverride ? (dadosOverride.id || null) : (elEditId && elEditId.value ? elEditId.value : null);

  // Helper defensivo para extrair valor de elementos do DOM
  const getElVal = (primaryId, fallbackId) => {
    if (typeof document === 'undefined') return '';
    const el = document.getElementById(primaryId) || (fallbackId ? document.getElementById(fallbackId) : null);
    return el && el.value !== undefined ? el.value : '';
  };

  // Coleta dados dos inputs do DOM ou do parâmetro dadosOverride (para testes / chamadas programáticas)
  const nomeRaw = dadosOverride?.nome ?? getElVal('cartao-nome', 'c-nome');
  const nomeLimpo = String(nomeRaw || '').trim();

  // Validação: nome é obrigatório
  if (!nomeLimpo) {
    if (typeof alert === 'function' && !dadosOverride) alert('Informe o nome do cartão de crédito.');
    return { ok: false, erro: 'Nome obrigatório' };
  }

  // Sanitização contra injeção de HTML / XSS
  const nome = escapeHtml(nomeLimpo);

  const titularRaw = dadosOverride?.titular ?? getElVal('cartao-titular', 'c-titular');
  const titular = escapeHtml(String(titularRaw || '').trim());

  // Taxa de rotativo / atraso (% a.m.)
  const taxaRaw = dadosOverride?.taxaRotativo ?? getElVal('cartao-taxa-atraso', 'c-taxa-rotativo');
  let taxaRotativo = 0;
  if (taxaRaw !== '' && taxaRaw !== null && taxaRaw !== undefined) {
    taxaRotativo = parseFloat(String(taxaRaw).replace(',', '.'));
    if (isNaN(taxaRotativo) || taxaRotativo < 0) {
      if (typeof alert === 'function' && !dadosOverride) alert('A taxa de atraso / rotativo deve ser maior ou igual a zero.');
      return { ok: false, erro: 'Taxa inválida' };
    }
  }
  taxaRotativo = Math.round(taxaRotativo * 100) / 100;

  // Dia do vencimento (1 a 31)
  const vencRaw = dadosOverride?.diaVencimento ?? (getElVal('cartao-dia-vencimento', 'c-dia-vencimento') || '10');
  const diaVencimento = parseInt(vencRaw, 10);
  if (isNaN(diaVencimento) || diaVencimento < 1 || diaVencimento > 31) {
    if (typeof alert === 'function' && !dadosOverride) alert('O dia do vencimento deve estar entre 1 e 31.');
    return { ok: false, erro: 'Dia de vencimento inválido' };
  }

  // Fatia 1 (ADR-003): Dia do fechamento (1 a 31, fallback seguro: Math.max(1, diaVencimento - 7))
  const fechRaw = dadosOverride?.diaFechamento ?? getElVal('c-dia-fechamento', 'cartao-dia-fechamento');
  let diaFechamento = null;
  if (fechRaw !== '' && fechRaw !== null && fechRaw !== undefined) {
    const parsedFech = parseInt(fechRaw, 10);
    if (!isNaN(parsedFech)) {
      // Ajuste para limites seguros (1 a 31)
      diaFechamento = Math.min(31, Math.max(1, parsedFech));
    }
  }
  if (!diaFechamento) {
    diaFechamento = Math.max(1, diaVencimento - 7);
  }

  // Fatia 1 (ADR-003): Limite Total de Crédito (R$)
  const limiteRaw = dadosOverride?.limiteTotal ?? getElVal('c-limite', 'cartao-limite');
  let limiteTotal = 0;
  if (limiteRaw !== '' && limiteRaw !== null && limiteRaw !== undefined) {
    const parsedLim = parseFloat(String(limiteRaw).replace(',', '.'));
    if (!isNaN(parsedLim) && parsedLim >= 0) {
      limiteTotal = Math.round(parsedLim * 100) / 100;
    }
  }

  // Anuidade
  const elChk = typeof document !== 'undefined' ? document.getElementById('cartao-tem-anuidade') : null;
  const possuiAnuidade = Boolean(dadosOverride?.anuidade?.possui ?? (elChk ? elChk.checked : false));
  let anuidadeObj = {
    possui: false,
    parcelas: 0,
    valorParcela: 0,
    valorTotal: 0,
    mesInicio: ''
  };

  if (possuiAnuidade) {
    const parcRaw = dadosOverride?.anuidade?.parcelas ?? (getElVal('cartao-anuidade-parcelas') || '12');
    const parcelas = parseInt(parcRaw, 10);
    if (isNaN(parcelas) || parcelas < 1 || parcelas > 12) {
      if (typeof alert === 'function' && !dadosOverride) alert('A quantidade de parcelas da anuidade deve ser entre 1 e 12.');
      return { ok: false, erro: 'Parcelas da anuidade inválidas' };
    }

    const valParcRaw = dadosOverride?.anuidade?.valorParcela ?? getElVal('cartao-anuidade-valor-parcela');
    const valorParcela = parseFloat(String(valParcRaw).replace(',', '.'));
    if (isNaN(valorParcela) || valorParcela <= 0) {
      if (typeof alert === 'function' && !dadosOverride) alert('Informe um valor válido para a parcela da anuidade.');
      return { ok: false, erro: 'Valor de parcela da anuidade inválido' };
    }

    let valorTotal = 0;
    const valTotalRaw = dadosOverride?.anuidade?.valorTotal ?? getElVal('cartao-anuidade-valor-total');
    if (valTotalRaw !== '' && valTotalRaw !== null && valTotalRaw !== undefined) {
      valorTotal = parseFloat(String(valTotalRaw).replace(',', '.'));
    }
    // Se o valor total não foi informado ou for inconsistente, calcula parcelas * valorParcela em centavos inteiros
    if (isNaN(valorTotal) || valorTotal <= 0) {
      const centavosTotal = Math.round(parcelas * Math.round(valorParcela * 100));
      valorTotal = centavosTotal / 100;
    } else {
      valorTotal = Math.round(valorTotal * 100) / 100;
    }

    const mesInicio = String(dadosOverride?.anuidade?.mesInicio ?? getElVal('cartao-anuidade-mes-inicio')).trim() || new Date().toISOString().slice(0, 7);

    anuidadeObj = {
      possui: true,
      parcelas,
      valorParcela: Math.round(valorParcela * 100) / 100,
      valorTotal,
      mesInicio
    };
  }

  if (!Array.isArray(S.cartoes)) S.cartoes = [];

  // Fatia 1 (ADR-003): Suporte a edição in-place se editIdRaw informado
  const cartaoExistente = editIdRaw ? S.cartoes.find(c => String(c.id) === String(editIdRaw)) : null;

  if (cartaoExistente) {
    cartaoExistente.nome = nome;
    cartaoExistente.titular = titular;
    cartaoExistente.taxaRotativo = taxaRotativo;
    cartaoExistente.diaVencimento = diaVencimento;
    cartaoExistente.diaFechamento = diaFechamento;
    cartaoExistente.limiteTotal = limiteTotal;
    cartaoExistente.anuidade = anuidadeObj;

    save();
    if (typeof document !== 'undefined') {
      closeM('m-cartao');
      render();
    }

    if (typeof alert === 'function' && !dadosOverride) {
      alert(`✅ Cartão "${nome}" atualizado com sucesso!`);
    }

    return { ok: true, cartao: cartaoExistente, editado: true };
  } else {
    const novoCartao = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      nome,
      titular,
      taxaRotativo,
      diaVencimento,
      diaFechamento,
      limiteTotal,
      anuidade: anuidadeObj,
      cor: '#8b5cf6',
      ativo: true
    };

    S.cartoes.push(novoCartao);
    save();
    if (typeof document !== 'undefined') {
      closeM('m-cartao');
      render();
    }

    if (typeof alert === 'function' && !dadosOverride) {
      alert(`💳 Cartão "${nome}" cadastrado com sucesso!`);
    }

    return { ok: true, cartao: novoCartao, editado: false };
  }
}

function excluirCartao(id) {
  if (!Array.isArray(S.cartoes)) return { ok: false, erro: 'Sem cartões' };
  const c = S.cartoes.find(x => x.id === id);
  if (!c) return { ok: false, erro: 'Cartão não encontrado' };
  const confirma = typeof confirm === 'function' ? confirm(`Deseja realmente remover o cartão "${c.nome}"?`) : true;
  if (!confirma) return { ok: false, cancelado: true };

  S.cartoes = S.cartoes.filter(x => x.id !== id);
  save();
  render();
  if (typeof alert === 'function') {
    alert(`Cartão "${c.nome}" removido com sucesso.`);
  }
  return { ok: true, removidoId: id };
}

let cartaoAtualId = null;

// Retorna resumo financeiro da fatura do cartão em determinada competência YYYY-MM
function calcularFaturaMes(cartaoId, mesYM, _jaAcumulando = false) {
  const ym = mesYM ? String(mesYM).slice(0, 7) : mesAtual;
  const cartao = (S.cartoes || []).find(c => c.id === cartaoId);
  if (!cartao) {
    return {
      compras: [],
      valorTotalCompras: 0,
      anuidadeItem: null,
      valorAnuidade: 0,
      rotativoItem: null,
      valorRotativo: 0,
      valorTotalFatura: 0,
      cartao: null,
      registroFatura: null
    };
  }

  // Compras ativas na competência (não canceladas por negativação e não canceladas por cancelamento de assinatura)
  const compras = (S.comprasCartao || []).filter(c => c.cartaoId === cartaoId && c.mesFatura === ym && !c.canceladaNegativacao && !c.canceladaAssinatura);
  const centavosCompras = compras.reduce((acc, c) => acc + Math.round((Number(c.val) || 0) * 100), 0);
  const valorTotalCompras = Math.round(centavosCompras) / 100;

  // Parcela de anuidade automática (se configurada e dentro do período de vigência)
  let anuidadeItem = null;
  let valorAnuidade = 0;
  if (cartao.anuidade && cartao.anuidade.possui && cartao.anuidade.parcelas > 0 && cartao.anuidade.valorParcela > 0) {
    // B4: Não gera anuidade para competências >= mês de negativação de cartão negativado
    const mesNeg = (cartao.dataNegativacao || '').slice(0, 7) || cartao.mesNegativacao;
    const bloqueadaPorNegativacao = cartao.negativado && mesNeg && ym >= mesNeg;

    if (!bloqueadaPorNegativacao) {
      const mesInicio = (cartao.anuidade.mesInicio || ym).slice(0, 7);
      const qtd = cartao.anuidade.parcelas;
      const diff = calcularMesesAtraso(mesInicio, ym);
      if (diff >= 0 && diff < qtd) {
        const parcelaNum = diff + 1;
        anuidadeItem = {
          desc: 'Anuidade do Cartão',
          parcelaNum,
          totalParcelas: qtd,
          val: Math.round(Number(cartao.anuidade.valorParcela) * 100) / 100,
          cat: 'recorrente'
        };
        valorAnuidade = anuidadeItem.val;
      }
    }
  }

  // Item de rotativo rolado do mês anterior: manual (gravado) ou acúmulo automático (< 60 dias)
  const idFat = `${cartaoId}_${ym}`;
  const fatReg = (S.faturasCartao || []).find(f => f.id === idFat || (f.cartaoId === cartaoId && f.mes === ym));
  let rotativoItem = null;
  let valorRotativo = 0;

  if (fatReg && fatReg.rotativoRolado > 0) {
    // 1. Rolagem manual gravada por pagamento parcial prévio
    valorRotativo = Math.round(Number(fatReg.rotativoRolado) * 100) / 100;
    rotativoItem = {
      desc: 'Rotativo Fatura Anterior (Saldo + Juros)',
      val: valorRotativo,
      cat: 'recorrente',
      detalhe: fatReg.rotativoDetalhe || null
    };
  } else if (!_jaAcumulando && ym <= mesAtual && (!fatReg || (!fatReg.pago && !fatReg.negativada && !fatReg.migradoDivida))) {
    // 2. Fatia A: Acúmulo Automático de Fatura Atrasada (< 60 dias)
    // Limita o acúmulo automático estritamente até mesAtual (não gera cascata em meses futuros)
    const mesAnt = adicionarMesesYM(ym, -1);
    const hojeStr = new Date().toISOString().slice(0, 7);
    const atrasoAnt = calcularMesesAtraso(mesAnt, hojeStr);

    // O acúmulo automático só ocorre se o cartão estiver ativo, não negativado e com atraso < 2 meses
    const cartaoValido = cartao.ativo !== false && !cartao.negativado;
    if (cartaoValido && atrasoAnt < 2) {
      const fatAnt = (S.faturasCartao || []).find(f => f.cartaoId === cartaoId && f.mes === mesAnt);
      const estaLiquidadaAnt = fatAnt && (fatAnt.pago || fatAnt.roladoParaProxima || fatAnt.liquidadaPorRolagem || fatAnt.negativada || fatAnt.migradoDivida);

      if (!estaLiquidadaAnt) {
        // Calcula a fatura da competência anterior sem recursão adicional (_jaAcumulando = true)
        const fatAntInfo = calcularFaturaMes(cartaoId, mesAnt, true);

        let saldoDev = 0;
        if (fatAnt && fatAnt.pagoParcial) {
          saldoDev = Number(fatAnt.saldoRestante) || 0;
        } else if (fatAnt && fatAnt.saldoRestante !== undefined && fatAnt.saldoRestante !== null) {
          saldoDev = Number(fatAnt.saldoRestante) || 0;
        } else {
          saldoDev = fatAntInfo.valorTotalFatura;
        }

        saldoDev = Math.round(saldoDev * 100) / 100;

        if (saldoDev > 0) {
          const saldoDevCentavos = Math.round(saldoDev * 100);
          const taxa = (cartao.taxaRotativo !== undefined && cartao.taxaRotativo !== null && !isNaN(cartao.taxaRotativo))
            ? Number(cartao.taxaRotativo)
            : 14.5;
          const encargosCentavos = Math.round((saldoDevCentavos * taxa) / 100);
          const totalRolado = Math.round(saldoDevCentavos + encargosCentavos) / 100;

          valorRotativo = totalRolado;
          rotativoItem = {
            desc: `Fatura Anterior em Aberto (${mesLabel(mesAnt)}) + Encargos`,
            val: totalRolado,
            cat: 'recorrente',
            automatico: true,
            detalhe: {
              saldoAnterior: saldoDev,
              principal: saldoDev,
              juros: Math.round(encargosCentavos) / 100,
              encargos: Math.round(encargosCentavos) / 100,
              taxa: taxa,
              mesOrigem: mesAnt
            }
          };
        }
      }
    }
  }

  const centavosTotal = centavosCompras + Math.round(valorAnuidade * 100) + Math.round(valorRotativo * 100);
  const valorTotalFatura = Math.round(centavosTotal) / 100;

  return {
    compras,
    valorTotalCompras,
    anuidadeItem,
    valorAnuidade,
    rotativoItem,
    valorRotativo,
    valorTotalFatura,
    cartao,
    registroFatura: fatReg || null
  };
}

/**
 * Fatia 3 (ADR-003 / ADR-005): Gestão Inteligente de Limite de Crédito do Cartão.
 * Calcula o limite total, comprometido e disponível com base em centavos inteiros:
 * - Compras futuras (> mesHoje) que NÃO sejam assinaturas (recorrentes mensais).
 * - Saldo pendente da fatura vigente (mesHoje) que ainda não foi 100% pago.
 * - Saldo pendente de faturas passadas (< mesHoje) não liquidadas e não roladas.
 *
 * @param {number|string} cartaoId - ID do cartão de crédito.
 * @param {string|null} mesRef - Competência de referência 'YYYY-MM' (default: data civil atual).
 * @returns {object} { configurado: boolean, limiteTotal: number, limiteComprometido: number, limiteDisponivel: number, pctUsado: number }
 */
function calcularLimiteCartao(cartaoId, mesRef = null) {
  const cid = (cartaoId !== null && cartaoId !== undefined) ? String(cartaoId) : null;
  const cartao = (S.cartoes || []).find(c => String(c.id) === cid);

  if (!cartao || !(Number(cartao.limiteTotal) > 0)) {
    return {
      configurado: false,
      limiteTotal: 0,
      limiteComprometido: 0,
      limiteDisponivel: 0,
      pctUsado: 0
    };
  }

  const mesHoje = (mesRef && String(mesRef).slice(0, 7)) || new Date().toISOString().slice(0, 7);

  // 1. Compras futuras que comprometem o limite:
  // Filtra compras com mesFatura > mesHoje.
  // Assinaturas recorrentes (c.assinatura) NÃO comprometem o limite futuro por decisão da ADR-005.
  const comprasFuturas = (S.comprasCartao || []).filter(c =>
    String(c.cartaoId) === cid &&
    c.mesFatura > mesHoje &&
    !c.canceladaNegativacao &&
    !c.canceladaAssinatura &&
    !c.assinatura
  );
  const centavosFuturo = comprasFuturas.reduce((acc, c) => acc + Math.round((Number(c.val) || 0) * 100), 0);

  // 2. Saldo comprometido da fatura vigente (mesHoje):
  const fatHoje = calcularFaturaMes(cartao.id, mesHoje);
  const vPagoHoje = (fatHoje.registroFatura && Number(fatHoje.registroFatura.valorPago)) || 0;
  const centavosPendenteHoje = Math.max(0, Math.round(fatHoje.valorTotalFatura * 100) - Math.round(vPagoHoje * 100));

  // 3. Faturas passadas (< mesHoje) não quitadas e não roladas:
  let centavosPassado = 0;
  const faturasPassadas = (S.faturasCartao || []).filter(f =>
    String(f.cartaoId) === cid &&
    f.mes < mesHoje &&
    !f.pago &&
    !f.roladoParaProxima &&
    !f.liquidadaPorRolagem &&
    !f.negativada &&
    !f.migradoDivida
  );
  faturasPassadas.forEach(fp => {
    const vPago = Number(fp.valorPago) || 0;
    const vTot = Number(fp.valorTotal) || 0;
    const pendente = Math.max(0, Math.round(vTot * 100) - Math.round(vPago * 100));
    centavosPassado += pendente;
  });

  const centavosComprometido = centavosFuturo + centavosPendenteHoje + centavosPassado;
  const limiteComprometido = Math.round(centavosComprometido) / 100;
  const limiteTotal = Math.round(Number(cartao.limiteTotal) * 100) / 100;
  const limiteDisponivel = Math.max(0, Math.round((limiteTotal - limiteComprometido) * 100) / 100);
  const pctUsado = limiteTotal > 0 ? Math.min(100, Math.round((limiteComprometido / limiteTotal) * 100)) : 0;

  return {
    configurado: true,
    limiteTotal,
    limiteComprometido,
    limiteDisponivel,
    pctUsado
  };
}

// Renderiza cards horizontais de cartões de crédito no topo da aba Gastos
function renderCartoesTopo() {
  const container = document.getElementById('cartoes-topo-container');
  if (!container) return;

  const cartoesAtivos = (S.cartoes || []).filter(c => c.ativo !== false);
  if (!cartoesAtivos.length) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  container.style.display = 'flex';
  container.innerHTML = cartoesAtivos.map(c => {
    const fatura = calcularFaturaMes(c.id, mesAtual);
    const fatReg = fatura.registroFatura;
    const estaPaga = fatReg && fatReg.pago;
    const estaParcial = fatReg && fatReg.pagoParcial;
    const estaNegativada = fatReg && (fatReg.negativada || fatReg.migradoDivida);

    let statusBadge = '';
    let corValor = 'var(--red)';
    let textoValor = fmt(fatura.valorTotalFatura);

    if (estaNegativada) {
      statusBadge = '<span class="badge" style="background:rgba(239,68,68,0.25);color:#f87171;font-size:10px;padding:2px 6px;">🔴 Negativada</span>';
      corValor = '#f87171';
    } else if (estaPaga) {
      statusBadge = '<span class="badge" style="background:rgba(34,197,94,0.25);color:#4ade80;font-size:10px;padding:2px 6px;">✓ Paga</span>';
      corValor = 'var(--green)';
      textoValor = fmt(fatReg.valorPago);
    } else if (estaParcial) {
      statusBadge = `<span class="badge" style="background:rgba(234,179,8,0.25);color:#facc15;font-size:10px;padding:2px 6px;">⚠️ Parcial (${fmt(fatReg.saldoRestante)} pendente)</span>`;
      corValor = 'var(--yellow)';
    } else {
      corValor = fatura.valorTotalFatura > 0 ? 'var(--red)' : 'var(--green)';
    }

    // Fatia 3 (ADR-003): Barra visual e informações de limite de crédito
    let limiteHtml = '';
    const lim = calcularLimiteCartao(c.id, mesAtual);
    if (lim && lim.configurado) {
      let corBarra = '#4ade80'; // < 70% verde
      if (lim.pctUsado >= 90) {
        corBarra = '#f87171'; // > 90% vermelho
      } else if (lim.pctUsado >= 70) {
        corBarra = '#facc15'; // 70-90% amarelo
      }

      limiteHtml = `
      <div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.08);">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--muted);margin-bottom:3px;">
          <span>Limite Disp:</span>
          <span style="font-weight:600;color:${corBarra};">${fmt(lim.limiteDisponivel)}</span>
        </div>
        <div style="width:100%;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;">
          <div style="width:${lim.pctUsado}%;height:100%;background:${corBarra};border-radius:2px;transition:width 0.3s;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-top:2px;">
          <span>Usado: ${lim.pctUsado}%</span>
          <span>Total: ${fmt(lim.limiteTotal)}</span>
        </div>
      </div>`;
    }

    return `<div class="card" onclick="abrirFaturaCartao(${c.id})" style="min-width:230px;max-width:270px;flex:0 0 auto;cursor:pointer;border:1px solid rgba(139,92,246,0.35);background:linear-gradient(135deg, rgba(139,92,246,0.12), rgba(0,0,0,0.4));border-radius:12px;padding:12px;transition:transform 0.15s, border-color 0.15s;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span style="font-weight:700;font-size:14px;color:#c084fc;">💳 ${escapeHtml(c.nome)}</span>
        <span style="font-size:11px;color:var(--muted);background:rgba(0,0,0,0.25);padding:2px 6px;border-radius:4px;">Venc: ${c.diaVencimento || 10}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        ${c.titular ? `<span style="font-size:11px;color:var(--muted);">👤 ${escapeHtml(c.titular)}</span>` : '<span></span>'}
        ${statusBadge}
      </div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px;">Fatura ${mesLabel(mesAtual)}:</div>
      <div style="font-size:18px;font-weight:700;color:${corValor};margin-top:2px;">
        ${textoValor}
      </div>
      ${limiteHtml}
      <div style="font-size:11px;color:#a855f7;margin-top:8px;display:flex;justify-content:space-between;align-items:center;">
        <span>👁️ Ver compras e ações</span>
        <span style="font-size:10px;opacity:0.8;">›</span>
      </div>
    </div>`;
  }).join('');
}

// Abre o modal detalhado da fatura do cartão
function abrirFaturaCartao(cartaoId, mesYM) {
  cartaoAtualId = cartaoId;
  const ym = mesYM ? String(mesYM).slice(0, 7) : mesAtual;
  const fatura = calcularFaturaMes(cartaoId, ym);
  if (!fatura.cartao) return;

  const elTitulo = document.getElementById('fatura-titulo');
  if (elTitulo) elTitulo.textContent = `💳 Fatura ${fatura.cartao.nome} - ${mesLabel(ym)}`;

  const fatReg = fatura.registroFatura;
  const estaNegativada = fatReg && (fatReg.negativada || fatReg.migradoDivida);
  const valorJaPago = (fatReg && Number(fatReg.valorPago)) || 0;
  const saldoPendente = Math.max(0, Math.round((fatura.valorTotalFatura - valorJaPago) * 100) / 100);

  // Fatia 3 (ADR-003): Bloco de Gestão Inteligente de Limite de Crédito
  const elBlocoLimite = document.getElementById('fatura-bloco-limite');
  if (elBlocoLimite) {
    const lim = calcularLimiteCartao(cartaoId, ym);
    if (lim && lim.configurado) {
      let corBarra = '#4ade80';
      if (lim.pctUsado >= 90) corBarra = '#f87171';
      else if (lim.pctUsado >= 70) corBarra = '#facc15';

      elBlocoLimite.style.display = 'block';
      elBlocoLimite.innerHTML = `
        <div class="card" style="background:var(--bg3);border:1px solid rgba(139,92,246,0.3);padding:10px 12px;margin:0 0 10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="font-size:12px;font-weight:700;color:#c084fc;">💳 Limite de Crédito</span>
            <span class="badge" style="background:rgba(255,255,255,0.06);color:var(--text);font-size:11px;">${lim.pctUsado}% utilizado</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;text-align:center;margin-bottom:8px;">
            <div style="background:rgba(0,0,0,0.25);padding:6px;border-radius:6px;">
              <div style="font-size:10px;color:var(--muted);">Total</div>
              <div style="font-size:12px;font-weight:600;">${fmt(lim.limiteTotal)}</div>
            </div>
            <div style="background:rgba(0,0,0,0.25);padding:6px;border-radius:6px;">
              <div style="font-size:10px;color:var(--muted);">Comprometido</div>
              <div style="font-size:12px;font-weight:600;color:var(--red);">${fmt(lim.limiteComprometido)}</div>
            </div>
            <div style="background:rgba(0,0,0,0.25);padding:6px;border-radius:6px;">
              <div style="font-size:10px;color:var(--muted);">Disponível</div>
              <div style="font-size:12px;font-weight:700;color:${corBarra};">${fmt(lim.limiteDisponivel)}</div>
            </div>
          </div>
          <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
            <div style="width:${lim.pctUsado}%;height:100%;background:${corBarra};border-radius:3px;transition:width 0.3s;"></div>
          </div>
        </div>
      `;
    } else {
      elBlocoLimite.style.display = 'none';
      elBlocoLimite.innerHTML = '';
    }
  }

  // Status visual no badge do modal
  const elStatusBadge = document.getElementById('fatura-status-badge');
  if (elStatusBadge) {
    if (estaNegativada) {
      elStatusBadge.className = 'badge';
      elStatusBadge.style.background = 'rgba(239,68,68,0.2)';
      elStatusBadge.style.color = '#f87171';
      elStatusBadge.style.border = '1px solid rgba(239,68,68,0.4)';
      elStatusBadge.textContent = '🔴 Negativada (60+ dias)';
    } else if (fatReg && fatReg.pago && saldoPendente <= 0) {
      elStatusBadge.className = 'badge';
      elStatusBadge.style.background = 'rgba(34,197,94,0.2)';
      elStatusBadge.style.color = '#4ade80';
      elStatusBadge.style.border = '1px solid rgba(34,197,94,0.4)';
      elStatusBadge.textContent = '✓ Paga';
    } else if (valorJaPago > 0 && saldoPendente > 0) {
      // B2: Badge "Pago parcial / saldo pendente"
      elStatusBadge.className = 'badge';
      elStatusBadge.style.background = 'rgba(234,179,8,0.2)';
      elStatusBadge.style.color = '#facc15';
      elStatusBadge.style.border = '1px solid rgba(234,179,8,0.4)';
      elStatusBadge.textContent = `⚠️ Pago parcial / saldo pendente (${fmt(saldoPendente)})`;
    } else if (fatReg && fatReg.pagoParcial && fatReg.roladoParaProxima) {
      elStatusBadge.className = 'badge';
      elStatusBadge.style.background = 'rgba(234,179,8,0.2)';
      elStatusBadge.style.color = '#facc15';
      elStatusBadge.style.border = '1px solid rgba(234,179,8,0.4)';
      elStatusBadge.textContent = `⚠️ Pagamento Parcial (Rolado p/ próx. mês)`;
    } else {
      elStatusBadge.className = 'badge';
      elStatusBadge.style.background = 'rgba(148,163,184,0.15)';
      elStatusBadge.style.color = 'var(--text)';
      elStatusBadge.style.border = '1px solid var(--border)';
      elStatusBadge.textContent = '⏳ Em Aberto';
    }
  }

  // Valor total exibido
  const elTotal = document.getElementById('fatura-valor-total');
  if (elTotal) {
    if (estaNegativada) {
      elTotal.textContent = `${fmt(fatura.valorTotalFatura)} (Negativada)`;
      elTotal.className = 'big-num c-red';
    } else if (fatReg && fatReg.pago && saldoPendente <= 0) {
      elTotal.textContent = `${fmt(fatReg.valorPago)} (Quitada)`;
      elTotal.className = 'big-num c-green';
    } else if (valorJaPago > 0 && saldoPendente > 0) {
      elTotal.textContent = `${fmt(saldoPendente)} pendente (${fmt(fatura.valorTotalFatura)} total)`;
      elTotal.className = 'big-num c-yellow';
    } else {
      elTotal.textContent = fmt(fatura.valorTotalFatura);
      elTotal.className = 'big-num c-red';
    }
  }

  const elSub = document.getElementById('fatura-subinfo');
  if (elSub) {
    elSub.textContent = `${fatura.cartao.titular ? `Titular: ${fatura.cartao.titular} • ` : ''}Vencimento: dia ${fatura.cartao.diaVencimento || 10} • Rotativo: ${fatura.cartao.taxaRotativo || 0}% a.m.`;
  }

  // Botões de ações financeiras da fatura
  const btnPagarTot = document.getElementById('btn-pagar-fatura-total');
  const btnPagarParc = document.getElementById('btn-pagar-fatura-parcial');
  const btnAbater = document.getElementById('btn-abater-fatura');
  const btnAntecipar = document.getElementById('btn-antecipar-parcelas');
  // B2: Botões Pagar Total/Parcial/Abater devem reaparecer cobrando apenas o saldo pendente
  const podePagar = !estaNegativada && saldoPendente > 0;

  if (btnPagarTot) {
    btnPagarTot.style.display = podePagar ? 'block' : 'none';
    if (valorJaPago > 0 && saldoPendente > 0) {
      btnPagarTot.textContent = `💳 Pagar Complemento (${fmt(saldoPendente)})`;
    } else {
      btnPagarTot.textContent = '💳 Pagar Fatura Total';
    }
    btnPagarTot.setAttribute('onclick', `pagarFaturaTotal(${cartaoId}, '${ym}')`);
  }
  if (btnPagarParc) {
    btnPagarParc.style.display = podePagar ? 'block' : 'none';
    btnPagarParc.setAttribute('onclick', `abrirModalPagamentoParcial(${cartaoId}, '${ym}')`);
  }
  if (btnAbater) {
    btnAbater.style.display = podePagar ? 'block' : 'none';
    btnAbater.setAttribute('onclick', `abrirModalAbaterCartao(${cartaoId}, '${ym}')`);
  }

  // B3: Destino da antecipação = max(ym, mesRealHoje); botão oculto se destino estiver negativada
  const mesRealHoje = new Date().toISOString().slice(0, 7);
  const destinoMes = ym < mesRealHoje ? mesRealHoje : ym;
  const fatDestino = (S.faturasCartao || []).find(f => f.cartaoId === cartaoId && f.mes === destinoMes);
  const destinoNegativada = fatDestino && (fatDestino.negativada || fatDestino.migradoDivida);

  if (btnAntecipar) {
    btnAntecipar.style.display = (estaNegativada || destinoNegativada) ? 'none' : 'block';
    btnAntecipar.setAttribute('onclick', `abrirModalAnteciparCartao(${cartaoId})`);
  }

  const elBtnAdd = document.getElementById('btn-add-compra-fatura');
  if (elBtnAdd) {
    elBtnAdd.style.display = estaNegativada ? 'none' : 'block';
    elBtnAdd.setAttribute('onclick', `abrirModalCompraCartao(${cartaoId})`);
  }

  const elLista = document.getElementById('fatura-itens-lista');
  if (elLista) {
    let html = '';

    // Item de rotativo rolado do mês anterior
    if (fatura.rotativoItem) {
      html += `<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(234,179,8,0.12);border:1px solid rgba(234,179,8,0.35);border-radius:6px;padding:8px 10px;margin-bottom:6px;font-size:12px;">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <strong>🔄 ${escapeHtml(fatura.rotativoItem.desc)}</strong>
          <span class="badge" style="background:rgba(234,179,8,0.25);color:#facc15;">Rolagem do Mês Anterior</span>
        </div>
        <div style="font-weight:700;color:var(--yellow);">${fmt(fatura.rotativoItem.val)}</div>
      </div>`;
    }

    // Item de anuidade
    if (fatura.anuidadeItem) {
      html += `<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.25);border-radius:6px;padding:8px 10px;margin-bottom:6px;font-size:12px;">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <strong>🛡️ ${escapeHtml(fatura.anuidadeItem.desc)}</strong>
          <span class="badge" style="background:rgba(168,85,247,0.2);color:#c084fc;">Anuidade ${fatura.anuidadeItem.parcelaNum}/${fatura.anuidadeItem.totalParcelas}</span>
        </div>
        <div style="font-weight:600;color:var(--red);">${fmt(fatura.anuidadeItem.val)}</div>
      </div>`;
    }

    // Compras do cartão
    if (fatura.compras.length) {
      html += fatura.compras.map(c => {
        const parcBadge = c.parcelado ? `<span class="badge b-parc">${c.parcelaNum}/${c.totalParcelas}</span>` : '';
        const assBadge = c.assinatura ? `<span class="badge" style="background:rgba(168,85,247,0.2);color:#c084fc;">🔁 Assinatura ${c.mesNum}/${c.totalMeses}</span>` : '';
        const catBadge = `<span class="badge ${c.cat === 'recorrente' ? 'b-rec' : 'b-laz'}">${escapeHtml(getNomeCategoria(c.cat))}</span>`;
        const adiantadaBadge = c.adiantada ? `<span class="badge" style="background:rgba(59,130,246,0.2);color:#60a5fa;">⏩ Antecipada</span>` : '';
        const cancelAssBtn = c.assinatura ? `<button type="button" class="btn" style="width:auto;margin:0;padding:2px 7px;font-size:11px;background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.3);cursor:pointer;" onclick="cancelarAssinaturaCartao(${c.id})" title="Cancelar Assinatura">🚫 Cancelar Assinatura</button>` : '';

        return `<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.3);border-radius:6px;padding:8px 10px;margin-bottom:6px;font-size:12px;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <strong>${escapeHtml(c.desc)}</strong>
            ${catBadge}
            ${parcBadge}
            ${assBadge}
            ${adiantadaBadge}
            <span style="font-size:11px;color:var(--muted);">${escapeHtml(c.data || '')}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-weight:600;color:var(--red);">${fmt(c.val)}</span>
            ${cancelAssBtn}
            <span class="item-del" style="font-size:16px;cursor:pointer;color:var(--muted);" onclick="excluirCompraCartao(${c.id})" title="Excluir compra">×</span>
          </div>
        </div>`;
      }).join('');
    }

    if (!fatura.compras.length && !fatura.anuidadeItem && !fatura.rotativoItem) {
      html = '<p style="color:var(--muted);font-size:13px;padding:12px 0;text-align:center;">Nenhuma compra nesta fatura.</p>';
    }

    elLista.innerHTML = html;
  }

  openM('m-fatura-cartao');
}

// Abre o modal para cadastrar compra no cartão
function abrirModalCompraCartao(cartaoId) {
  cartaoAtualId = cartaoId;
  const elCartaoId = document.getElementById('cc-cartao-id');
  if (elCartaoId) elCartaoId.value = cartaoId;

  const elDesc = document.getElementById('cc-desc');
  if (elDesc) elDesc.value = '';

  const elVal = document.getElementById('cc-val');
  if (elVal) elVal.value = '';

  const elData = document.getElementById('cc-data');
  if (elData) elData.value = dataDefaultParaModal();

  const elParcChk = document.getElementById('cc-is-parcelado');
  if (elParcChk) elParcChk.checked = false;

  const blocoParc = document.getElementById('cc-bloco-parcelamento');
  if (blocoParc) blocoParc.style.display = 'none';

  const elParcNum = document.getElementById('cc-parcelas');
  if (elParcNum) elParcNum.value = '2';

  const elPrevParc = document.getElementById('cc-preview-parcela');
  if (elPrevParc) elPrevParc.textContent = '';

  // Fatia 2: Reseta bloco de assinatura recorrente
  const elRecChk = document.getElementById('cc-is-recorrente');
  if (elRecChk) elRecChk.checked = false;

  const blocoRec = document.getElementById('cc-bloco-recorrente');
  if (blocoRec) blocoRec.style.display = 'none';

  const elPrazoRec = document.getElementById('cc-prazo-recorrente');
  if (elPrazoRec) elPrazoRec.value = '24';

  const rowMesesPers = document.getElementById('cc-row-meses-personalizado');
  if (rowMesesPers) rowMesesPers.style.display = 'none';

  const elMesesRec = document.getElementById('cc-meses-recorrente');
  if (elMesesRec) elMesesRec.value = '24';

  const elPrevRec = document.getElementById('cc-preview-recorrente');
  if (elPrevRec) elPrevRec.textContent = '';

  // Popula categorias no select
  const elCat = document.getElementById('cc-cat');
  if (elCat) {
    const cats = S.categoriasGastos || DEFAULT_CATEGORIAS_GASTOS;
    elCat.innerHTML = cats.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.nome)}</option>`).join('');
  }

  atualizarPreviewCompraModal();
  openM('m-compra-cartao');
}

function toggleCompraParcelada() {
  const chkParc = document.getElementById('cc-is-parcelado');
  const blocoParc = document.getElementById('cc-bloco-parcelamento');
  const chkRec = document.getElementById('cc-is-recorrente');
  const blocoRec = document.getElementById('cc-bloco-recorrente');

  if (chkParc && chkParc.checked) {
    // Exclusividade mútua: ao marcar parcelado, desmarca recorrente
    if (chkRec) chkRec.checked = false;
    if (blocoRec) blocoRec.style.display = 'none';
    if (blocoParc) blocoParc.style.display = 'block';
  } else {
    if (blocoParc) blocoParc.style.display = 'none';
  }
  atualizarPreviewCompraModal();
}

function toggleCompraRecorrente() {
  const chkParc = document.getElementById('cc-is-parcelado');
  const blocoParc = document.getElementById('cc-bloco-parcelamento');
  const chkRec = document.getElementById('cc-is-recorrente');
  const blocoRec = document.getElementById('cc-bloco-recorrente');

  if (chkRec && chkRec.checked) {
    // Exclusividade mútua: ao marcar recorrente, desmarca parcelado
    if (chkParc) chkParc.checked = false;
    if (blocoParc) blocoParc.style.display = 'none';
    if (blocoRec) blocoRec.style.display = 'block';
  } else {
    if (blocoRec) blocoRec.style.display = 'none';
  }
  atualizarPreviewCompraModal();
}

function togglePrazoRecorrenteCartao() {
  const selPrazo = document.getElementById('cc-prazo-recorrente');
  const rowPers = document.getElementById('cc-row-meses-personalizado');
  if (rowPers) {
    rowPers.style.display = selPrazo && selPrazo.value === 'personalizado' ? 'block' : 'none';
  }
  atualizarPreviewCompraModal();
}

function atualizarPreviewCompraModal() {
  const elCartaoId = document.getElementById('cc-cartao-id');
  const cid = elCartaoId && elCartaoId.value ? parseInt(elCartaoId.value, 10) : cartaoAtualId;
  const cartao = (S.cartoes || []).find(c => c.id === cid);

  const elData = document.getElementById('cc-data');
  const data = (elData && elData.value) ? elData.value : new Date().toISOString().slice(0, 10);

  const dVenc = cartao?.diaVencimento || 10;
  const dFech = cartao?.diaFechamento || Math.max(1, dVenc - 7);

  const mesFaturaBase = calcularMesFaturaCompra(data, dFech, dVenc);

  const elVal = document.getElementById('cc-val');
  const val = parseFloat(String(elVal?.value || '0').replace(',', '.')) || 0;

  const chkParc = document.getElementById('cc-is-parcelado');
  const isParc = Boolean(chkParc && chkParc.checked);

  const chkRec = document.getElementById('cc-is-recorrente');
  const isRec = Boolean(chkRec && chkRec.checked);

  const elPrevFatura = document.getElementById('cc-preview-fatura');
  const elPrevParc = document.getElementById('cc-preview-parcela');
  const elPrevRec = document.getElementById('cc-preview-recorrente');

  if (isRec) {
    const selPrazo = document.getElementById('cc-prazo-recorrente');
    let qtdMeses = 24;
    if (selPrazo) {
      if (selPrazo.value === 'personalizado') {
        const elMeses = document.getElementById('cc-meses-recorrente');
        qtdMeses = Math.min(72, Math.max(2, parseInt(elMeses?.value || '24', 10) || 24));
      } else {
        qtdMeses = parseInt(selPrazo.value, 10) || 24;
      }
    }
    const mesFim = adicionarMesesYM(mesFaturaBase, qtdMeses - 1);
    if (elPrevFatura) {
      elPrevFatura.textContent = `📅 1ª cobrança na fatura de ${mesLabel(mesFaturaBase)} até ${mesLabel(mesFim)} (${qtdMeses} meses)`;
    }
    if (elPrevRec) {
      elPrevRec.textContent = val > 0
        ? `${fmt(val)} cobrado todo mês por ${qtdMeses} meses (cancela quando quiser)`
        : `Assinatura por ${qtdMeses} meses`;
    }
    if (elPrevParc) elPrevParc.textContent = '';
  } else if (isParc) {
    const elNum = document.getElementById('cc-parcelas');
    const num = Math.min(48, Math.max(2, parseInt(elNum?.value || '2', 10) || 2));
    const mesFim = adicionarMesesYM(mesFaturaBase, num - 1);
    if (elPrevFatura) {
      elPrevFatura.textContent = `📅 1ª parcela na fatura de ${mesLabel(mesFaturaBase)} até ${mesLabel(mesFim)} (${num}x)`;
    }
    if (elPrevParc) {
      if (val > 0) {
        const baseCentavos = Math.floor(Math.round(val * 100) / num);
        elPrevParc.textContent = `${num}x de aproximadamente ${fmt(baseCentavos / 100)} / mês`;
      } else {
        elPrevParc.textContent = '';
      }
    }
    if (elPrevRec) elPrevRec.textContent = '';
  } else {
    if (elPrevFatura) {
      elPrevFatura.textContent = `📅 Compra entrará na fatura de ${mesLabel(mesFaturaBase)} (Fechamento dia ${dFech}, Vencimento dia ${dVenc})`;
    }
    if (elPrevParc) elPrevParc.textContent = '';
    if (elPrevRec) elPrevRec.textContent = '';
  }
}

function atualizarPreviewCompraParcelada() {
  atualizarPreviewCompraModal();
}

// B2: Se a fatura daquele mês já estiver paga ou com pagamento parcial, reabre com saldo pendente
function verificarEReabrirFatura(cartaoId, mesYM) {
  if (!Array.isArray(S.faturasCartao)) return;
  const ym = String(mesYM || '').slice(0, 7);
  const fatReg = S.faturasCartao.find(f => f.cartaoId === cartaoId && f.mes === ym);
  if (!fatReg) return;

  const fatInfo = calcularFaturaMes(cartaoId, ym);
  const novoTotal = fatInfo.valorTotalFatura;
  const vPago = Number(fatReg.valorPago) || 0;
  const saldoPendente = Math.max(0, Math.round((novoTotal - vPago) * 100) / 100);

  if (saldoPendente > 0) {
    fatReg.pago = false;
    fatReg.pagoParcial = vPago > 0;
    fatReg.saldoRestante = saldoPendente;
    fatReg.valorTotal = novoTotal;
  }
}

// Salva compra avulsa, parcelada ou assinatura recorrente no cartão
function salvarCompraCartao(dadosOverride) {
  const getElVal = (id) => (typeof document !== 'undefined' ? document.getElementById(id)?.value : '') || '';
  const elCartaoId = typeof document !== 'undefined' ? document.getElementById('cc-cartao-id') : null;
  const cartaoId = dadosOverride?.cartaoId || (elCartaoId && elCartaoId.value ? parseInt(elCartaoId.value, 10) : cartaoAtualId);
  const cartao = (S.cartoes || []).find(c => c.id === cartaoId);
  if (!cartao) {
    if (typeof alert === 'function' && !dadosOverride) alert('Selecione um cartão válido.');
    return { ok: false, erro: 'Cartão não encontrado' };
  }

  const descRaw = dadosOverride?.desc ?? getElVal('cc-desc');
  const desc = String(descRaw || '').trim();
  if (!desc) {
    if (typeof alert === 'function' && !dadosOverride) alert('Informe a descrição da compra.');
    return { ok: false, erro: 'Descrição obrigatória' };
  }

  const valRaw = dadosOverride?.val ?? getElVal('cc-val');
  const val = parseFloat(String(valRaw).replace(',', '.'));
  if (isNaN(val) || val <= 0) {
    if (typeof alert === 'function' && !dadosOverride) alert('Informe um valor válido maior que zero.');
    return { ok: false, erro: 'Valor inválido' };
  }

  const dataRaw = dadosOverride?.data ?? getElVal('cc-data');
  const data = (dataRaw || new Date().toISOString().slice(0, 10)).trim();

  const catRaw = dadosOverride?.cat ?? getElVal('cc-cat');
  const cat = catRaw || 'nao_planejado';

  const elRecChk = typeof document !== 'undefined' ? document.getElementById('cc-is-recorrente') : null;
  const isRecorrente = Boolean(dadosOverride?.recorrente || dadosOverride?.assinatura || (elRecChk && elRecChk.checked));

  const elParcChk = typeof document !== 'undefined' ? document.getElementById('cc-is-parcelado') : null;
  const isParcelado = !isRecorrente && Boolean(dadosOverride?.parcelado || (elParcChk && elParcChk.checked));

  if (!Array.isArray(S.comprasCartao)) S.comprasCartao = [];

  // Fatia 2 (ADR-003): Determina competência inicial com base no ciclo de fechamento e vencimento
  const diaVencimento = cartao.diaVencimento || 10;
  const diaFechamento = cartao.diaFechamento || Math.max(1, diaVencimento - 7);
  const mesFaturaBase = calcularMesFaturaCompra(data, diaFechamento, diaVencimento);

  if (isRecorrente) {
    // Fatia 2 (ADR-005): Assinatura / Gasto Fixo no Cartão (default: 24 meses)
    let qtdMeses = 24;
    if (dadosOverride?.mesesRecorrente || dadosOverride?.totalMeses) {
      qtdMeses = Math.min(72, Math.max(2, parseInt(dadosOverride.mesesRecorrente || dadosOverride.totalMeses, 10) || 24));
    } else if (typeof document !== 'undefined') {
      const selPrazo = document.getElementById('cc-prazo-recorrente');
      if (selPrazo && selPrazo.value === 'personalizado') {
        const elMeses = document.getElementById('cc-meses-recorrente');
        qtdMeses = Math.min(72, Math.max(2, parseInt(elMeses?.value || '24', 10) || 24));
      } else if (selPrazo) {
        qtdMeses = parseInt(selPrazo.value, 10) || 24;
      }
    }

    const valCheio = Math.round(val * 100) / 100;
    const grupoId = 'crec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const comprasCriadas = [];

    for (let i = 1; i <= qtdMeses; i++) {
      const mesFatura = adicionarMesesYM(mesFaturaBase, i - 1);
      const dt = adicionarMeses(data, i - 1);
      const novaCompra = {
        id: Date.now() + i + Math.floor(Math.random() * 1000),
        cartaoId,
        desc: `${escapeHtml(desc)} (${i}/${qtdMeses})`,
        descOriginal: escapeHtml(desc),
        val: valCheio,
        valTotal: valCheio,
        cat,
        data: dt,
        mesFatura,
        titular: cartao.titular || '',
        recorrente: true,
        assinatura: true,
        parcelado: false,
        mesNum: i,
        totalMeses: qtdMeses,
        canceladaAssinatura: false,
        canceladaNegativacao: false,
        grupoId
      };

      S.comprasCartao.push(novaCompra);
      comprasCriadas.push(novaCompra);
      verificarEReabrirFatura(cartaoId, mesFatura);
    }

    save();
    if (typeof document !== 'undefined') {
      closeM('m-compra-cartao');
      render();
      const modalFatura = document.getElementById('m-fatura-cartao');
      if (modalFatura && modalFatura.classList.contains('open')) {
        abrirFaturaCartao(cartaoId, mesAtual);
      }
    }

    if (typeof alert === 'function' && !dadosOverride) {
      alert(`🔁 Assinatura registrada por ${qtdMeses} meses no cartão ${cartao.nome}!`);
    }

    return { ok: true, comprasCriadas, totalMeses: qtdMeses, grupoId, assinatura: true };

  } else if (isParcelado) {
    const numRaw = dadosOverride?.parcelas ?? getElVal('cc-parcelas');
    const num = Math.min(48, Math.max(2, parseInt(numRaw || '2', 10) || 2));

    const totalCentavos = Math.round(val * 100);
    const baseCentavos = Math.floor(totalCentavos / num);
    const restoCentavos = totalCentavos - (baseCentavos * num);
    const grupoId = 'cc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const comprasCriadas = [];

    for (let i = 1; i <= num; i++) {
      const centavosDesta = baseCentavos + (i === num ? restoCentavos : 0);
      const vParc = centavosDesta / 100;
      const dt = adicionarMeses(data, i - 1);
      const mesFatura = adicionarMesesYM(mesFaturaBase, i - 1);

      const novaCompra = {
        id: Date.now() + i + Math.floor(Math.random() * 1000),
        cartaoId,
        desc: `${escapeHtml(desc)} (${i}/${num})`,
        descOriginal: escapeHtml(desc),
        val: vParc,
        valTotal: Math.round(val * 100) / 100,
        cat,
        data: dt,
        mesFatura,
        titular: cartao.titular || '',
        parcelado: true,
        parcelaNum: i,
        totalParcelas: num,
        canceladaAssinatura: false,
        canceladaNegativacao: false,
        grupoId
      };

      S.comprasCartao.push(novaCompra);
      comprasCriadas.push(novaCompra);
      verificarEReabrirFatura(cartaoId, mesFatura);
    }

    save();
    if (typeof document !== 'undefined') {
      closeM('m-compra-cartao');
      render();
      const modalFatura = document.getElementById('m-fatura-cartao');
      if (modalFatura && modalFatura.classList.contains('open')) {
        abrirFaturaCartao(cartaoId, mesAtual);
      }
    }

    if (typeof alert === 'function' && !dadosOverride) {
      alert(`🛍️ Compra parcelada (${num}x) registrada no cartão ${cartao.nome}!`);
    }

    return { ok: true, comprasCriadas, parcelas: num, grupoId, parcelado: true };

  } else {
    // Compra à vista
    const mesFatura = mesFaturaBase;
    const novaCompra = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      cartaoId,
      desc: escapeHtml(desc),
      val: Math.round(val * 100) / 100,
      valTotal: Math.round(val * 100) / 100,
      cat,
      data,
      mesFatura,
      titular: cartao.titular || '',
      parcelado: false,
      parcelaNum: 1,
      totalParcelas: 1,
      canceladaAssinatura: false,
      canceladaNegativacao: false,
      grupoId: ''
    };

    S.comprasCartao.push(novaCompra);
    verificarEReabrirFatura(cartaoId, mesFatura);

    save();
    if (typeof document !== 'undefined') {
      closeM('m-compra-cartao');
      render();
      const modalFatura = document.getElementById('m-fatura-cartao');
      if (modalFatura && modalFatura.classList.contains('open')) {
        abrirFaturaCartao(cartaoId, mesAtual);
      }
    }

    if (typeof alert === 'function' && !dadosOverride) {
      alert(`🛍️ Compra registrada com sucesso no cartão ${cartao.nome}!`);
    }

    return { ok: true, compra: novaCompra, parcelado: false, mesFatura };
  }
}

// Fatia 2 (ADR-005): Cancela assinatura recorrente a partir das faturas futuras (> mesAtual)
function cancelarAssinaturaCartao(compraId) {
  if (!Array.isArray(S.comprasCartao)) return { ok: false, erro: 'Sem compras registradas' };
  const compra = S.comprasCartao.find(c => c.id === compraId);
  if (!compra) return { ok: false, erro: 'Compra não encontrada' };
  if (!compra.assinatura && !compra.recorrente) return { ok: false, erro: 'Item não é uma assinatura recorrente' };
  if (!compra.grupoId) return { ok: false, erro: 'Assinatura sem grupoId associado' };

  const descAssinatura = compra.descOriginal || compra.desc || 'Assinatura';
  const confirma = typeof confirm === 'function'
    ? confirm(`Deseja cancelar a assinatura "${descAssinatura}" a partir da próxima fatura?\n\nAs cobranças passadas e da fatura atual serão preservadas no histórico.`)
    : true;

  if (!confirma) return { ok: false, cancelado: true };

  let canceladas = 0;
  S.comprasCartao.forEach(c => {
    if (c.grupoId === compra.grupoId && c.mesFatura > mesAtual) {
      c.canceladaAssinatura = true;
      canceladas++;
    }
  });

  save();
  if (typeof render === 'function') render();

  if (typeof document !== 'undefined') {
    const modalFatura = document.getElementById('m-fatura-cartao');
    if (modalFatura && modalFatura.classList.contains('open') && compra.cartaoId) {
      abrirFaturaCartao(compra.cartaoId, mesAtual);
    }
  }

  if (typeof alert === 'function') {
    alert(`🚫 Assinatura "${descAssinatura}" cancelada com sucesso!\n${canceladas} cobrança(s) futura(s) cancelada(s). A fatura atual e as anteriores foram preservadas.`);
  }

  return { ok: true, canceladas, grupoId: compra.grupoId };
}

// Remove compra do cartão
function excluirCompraCartao(compraId, excluirTodasParam) {
  if (!Array.isArray(S.comprasCartao)) return { ok: false };
  const compra = S.comprasCartao.find(x => x.id === compraId);
  if (!compra) return { ok: false, erro: 'Compra não encontrada' };

  let excluirTodas = false;
  if (compra.parcelado && compra.grupoId) {
    if (typeof excluirTodasParam === 'boolean') {
      excluirTodas = excluirTodasParam;
    } else {
      excluirTodas = typeof confirm === 'function'
        ? confirm(`Esta compra faz parte de um parcelamento (${compra.parcelaNum}/${compra.totalParcelas}).\n\nOK = Excluir TODAS as parcelas deste grupo.\nCancelar = Excluir apenas ESTA parcela.`)
        : true;
    }
  } else {
    const confirma = typeof confirm === 'function' ? confirm(`Excluir a compra "${compra.desc}"?`) : true;
    if (!confirma) return { ok: false, cancelado: true };
  }

  if (excluirTodas && compra.grupoId) {
    S.comprasCartao = S.comprasCartao.filter(x => x.grupoId !== compra.grupoId);
  } else {
    S.comprasCartao = S.comprasCartao.filter(x => x.id !== compraId);
  }

  save();
  render();

  const modalFatura = document.getElementById('m-fatura-cartao');
  if (modalFatura && modalFatura.classList.contains('open') && compra.cartaoId) {
    abrirFaturaCartao(compra.cartaoId, mesAtual);
  }
  return { ok: true, removidoId: compraId };
}

// OPERAÇÕES FINANCEIRAS DA FATURA (Fatia 4)

// 1. Quitação integral da fatura
function pagarFaturaTotal(cartaoId, mesYM) {
  const cid = cartaoId || cartaoAtualId;
  const ym = mesYM ? String(mesYM).slice(0, 7) : mesAtual;
  const fatura = calcularFaturaMes(cid, ym);
  if (!fatura.cartao) return { ok: false, erro: 'Cartão não encontrado' };

  if (fatura.valorTotalFatura <= 0) {
    if (typeof alert === 'function') alert('Esta fatura não possui valor a pagar.');
    return { ok: false, erro: 'Fatura sem valor' };
  }

  if (!Array.isArray(S.faturasCartao)) S.faturasCartao = [];
  const idFat = `${cid}_${ym}`;
  let fat = S.faturasCartao.find(f => f.id === idFat || (f.cartaoId === cid && f.mes === ym));

  const valorJaPago = (fat && Number(fat.valorPago)) || 0;
  const saldoPendente = Math.max(0, Math.round((fatura.valorTotalFatura - valorJaPago) * 100) / 100);

  if (saldoPendente <= 0 && fat && fat.pago) {
    if (typeof alert === 'function') alert('Esta fatura já está quitada.');
    return { ok: false, erro: 'Fatura já quitada' };
  }

  if (!fat) {
    fat = {
      id: idFat,
      cartaoId: cid,
      mes: ym,
      valorTotal: fatura.valorTotalFatura,
      valorPago: 0,
      pago: false,
      pagoParcial: false,
      saldoRestante: fatura.valorTotalFatura,
      rotativoRolado: 0,
      negativada: false,
      migradoDivida: false
    };
    S.faturasCartao.push(fat);
  }

  // B2: soma o complemento ao valor já pago acumulado
  fat.valorTotal = fatura.valorTotalFatura;
  fat.valorPago = Math.round((valorJaPago + saldoPendente) * 100) / 100;
  fat.pago = true;
  fat.pagoParcial = false;
  fat.saldoRestante = 0;
  fat.negativada = false;
  fat.migradoDivida = false;
  fat.dataPagamento = new Date().toISOString().slice(0, 10);

  // Fatia A: Ao quitar a fatura do mês atual que acumulou saldo da anterior, marca a fatura anterior como liquidada por absorção/rolagem
  if (fatura.rotativoItem && fatura.rotativoItem.automatico) {
    const mesOrig = fatura.rotativoItem.detalhe?.mesOrigem || adicionarMesesYM(ym, -1);
    let fatAnt = (S.faturasCartao || []).find(f => f.cartaoId === cid && f.mes === mesOrig);
    if (!fatAnt) {
      const idAnt = `${cid}_${mesOrig}`;
      const fatAntInfo = calcularFaturaMes(cid, mesOrig, true);
      fatAnt = {
        id: idAnt,
        cartaoId: cid,
        mes: mesOrig,
        valorTotal: fatAntInfo.valorTotalFatura,
        valorPago: 0,
        pago: true,
        pagoParcial: false,
        saldoRestante: 0,
        rotativoRolado: 0,
        roladoParaProxima: true,
        liquidadaPorRolagem: true,
        negativada: false,
        migradoDivida: false
      };
      S.faturasCartao.push(fatAnt);
    } else {
      fatAnt.pago = true;
      fatAnt.roladoParaProxima = true;
      fatAnt.liquidadaPorRolagem = true;
      fatAnt.saldoRestante = 0;
      fatAnt.negativada = false;
      fatAnt.migradoDivida = false;
    }

    // Registra na fatura atual o rotativo que foi absorvido e quitado
    fat.rotativoRolado = fatura.rotativoItem.val;
    fat.rotativoDetalhe = fatura.rotativoItem.detalhe;
  }

  save();
  render();

  if (typeof alert === 'function') {
    alert(`✅ Fatura de ${mesLabel(ym)} do cartão ${fatura.cartao.nome} marcada como Paga (${fmt(fat.valorPago)})!`);
  }

  const modalFatura = document.getElementById('m-fatura-cartao');
  if (modalFatura && modalFatura.classList.contains('open')) {
    abrirFaturaCartao(cid, ym);
  }

  return { ok: true, fatura: fat };
}

// 2. Abertura do modal de pagamento parcial
function abrirModalPagamentoParcial(cartaoId, mesYM) {
  const cid = cartaoId || cartaoAtualId;
  const ym = mesYM ? String(mesYM).slice(0, 7) : mesAtual;
  cartaoAtualId = cid;
  const fatura = calcularFaturaMes(cid, ym);
  if (!fatura.cartao) return;

  const fatReg = (S.faturasCartao || []).find(f => f.cartaoId === cid && f.mes === ym);
  const valorJaPago = (fatReg && Number(fatReg.valorPago)) || 0;
  const saldoPendente = Math.max(0, Math.round((fatura.valorTotalFatura - valorJaPago) * 100) / 100);

  const elTot = document.getElementById('pp-valor-total');
  if (elTot) elTot.textContent = fmt(saldoPendente > 0 ? saldoPendente : fatura.valorTotalFatura);

  const elTaxa = document.getElementById('pp-taxa-rotativo-txt');
  if (elTaxa) {
    elTaxa.textContent = `Taxa de rotativo: ${fatura.cartao.taxaRotativo || 0}% a.m.`;
  }

  const elPago = document.getElementById('pp-valor-pago');
  if (elPago) elPago.value = '';

  const elPrev = document.getElementById('pp-preview-txt');
  if (elPrev) {
    elPrev.textContent = 'Informe o valor a pagar';
    elPrev.style.color = 'var(--yellow)';
  }

  openM('m-pagto-parcial');
}

// 3. Simulação dinâmica do rotativo
function atualizarPreviewPagamentoParcial() {
  const elPago = document.getElementById('pp-valor-pago');
  const elPrev = document.getElementById('pp-preview-txt');
  if (!elPago || !elPrev || !cartaoAtualId) return;

  const fatura = calcularFaturaMes(cartaoAtualId, mesAtual);
  const fatReg = (S.faturasCartao || []).find(f => f.cartaoId === cartaoAtualId && f.mes === mesAtual);
  const valorJaPago = (fatReg && Number(fatReg.valorPago)) || 0;
  const saldoBase = Math.max(0, Math.round((fatura.valorTotalFatura - valorJaPago) * 100) / 100);

  const valPago = parseFloat(String(elPago.value).replace(',', '.')) || 0;

  if (valPago <= 0) {
    elPrev.textContent = 'Informe um valor maior que zero.';
    elPrev.style.color = 'var(--muted)';
    return;
  }
  if (valPago >= saldoBase) {
    elPrev.textContent = 'O valor deve ser menor que o saldo pendente. Para pagar tudo, use "Pagar Fatura Total".';
    elPrev.style.color = 'var(--red)';
    return;
  }

  const saldoRestante = Math.round((saldoBase - valPago) * 100) / 100;
  const taxa = fatura.cartao.taxaRotativo || 0;
  const encargos = Math.round((saldoRestante * (taxa / 100)) * 100) / 100;
  const totalRolagem = Math.round((saldoRestante + encargos) * 100) / 100;

  elPrev.innerHTML = `Saldo restante: <strong>${fmt(saldoRestante)}</strong> + Juros (${taxa}%): <strong>${fmt(encargos)}</strong> = <strong>${fmt(totalRolagem)}</strong> na próxima fatura.`;
  elPrev.style.color = 'var(--yellow)';
}

// 4. Confirmação do pagamento parcial e rolagem do rotativo
function confirmarPagamentoParcial(dadosOverride) {
  const cid = dadosOverride?.cartaoId || cartaoAtualId;
  const ym = dadosOverride?.mes ? String(dadosOverride.mes).slice(0, 7) : mesAtual;
  const fatura = calcularFaturaMes(cid, ym);
  if (!fatura.cartao) return { ok: false, erro: 'Cartão não encontrado' };

  if (!Array.isArray(S.faturasCartao)) S.faturasCartao = [];
  const idFat = `${cid}_${ym}`;
  let fat = S.faturasCartao.find(f => f.id === idFat || (f.cartaoId === cid && f.mes === ym));

  const valorJaPago = (fat && Number(fat.valorPago)) || 0;
  const saldoBase = Math.max(0, Math.round((fatura.valorTotalFatura - valorJaPago) * 100) / 100);

  const elPago = document.getElementById('pp-valor-pago');
  const valPagoRaw = dadosOverride?.valorPago ?? (elPago ? elPago.value : 0);
  const valorPago = parseFloat(String(valPagoRaw).replace(',', '.'));

  if (isNaN(valorPago) || valorPago <= 0) {
    if (typeof alert === 'function' && !dadosOverride) alert('Informe um valor a pagar válido maior que zero.');
    return { ok: false, erro: 'Valor inválido' };
  }

  if (valorPago >= saldoBase) {
    if (typeof alert === 'function' && !dadosOverride) alert('O pagamento parcial deve ser menor que o saldo pendente. Para quitar tudo, use "Pagar Fatura Total".');
    return { ok: false, erro: 'Valor deve ser menor que saldo pendente' };
  }

  if (!fat) {
    fat = {
      id: idFat,
      cartaoId: cid,
      mes: ym,
      valorTotal: fatura.valorTotalFatura,
      valorPago: 0,
      pago: false,
      pagoParcial: false,
      saldoRestante: fatura.valorTotalFatura,
      rotativoRolado: 0,
      negativada: false,
      migradoDivida: false
    };
    S.faturasCartao.push(fat);
  }

  fat.valorTotal = fatura.valorTotalFatura;
  fat.valorPago = Math.round((valorJaPago + valorPago) * 100) / 100;
  fat.pago = false;
  fat.pagoParcial = true;
  fat.roladoParaProxima = true; // B1: marcação explícita de rolagem
  fat.saldoRestante = Math.round((saldoBase - valorPago) * 100) / 100;
  fat.negativada = false;
  fat.migradoDivida = false;
  fat.dataPagamento = new Date().toISOString().slice(0, 10);

  // Fatia A (Bloqueador 1): Ao pagar parcialmente uma fatura que acumulou saldo da anterior, absorve e liquida a anterior por rolagem
  if (fatura.rotativoItem && fatura.rotativoItem.automatico) {
    const mesOrig = fatura.rotativoItem.detalhe?.mesOrigem || adicionarMesesYM(ym, -1);
    let fatAnt = (S.faturasCartao || []).find(f => f.cartaoId === cid && f.mes === mesOrig);
    if (!fatAnt) {
      const idAnt = `${cid}_${mesOrig}`;
      const fatAntInfo = calcularFaturaMes(cid, mesOrig, true);
      fatAnt = {
        id: idAnt,
        cartaoId: cid,
        mes: mesOrig,
        valorTotal: fatAntInfo.valorTotalFatura,
        valorPago: 0,
        pago: true,
        pagoParcial: false,
        saldoRestante: 0,
        rotativoRolado: 0,
        roladoParaProxima: true,
        liquidadaPorRolagem: true,
        negativada: false,
        migradoDivida: false
      };
      S.faturasCartao.push(fatAnt);
    } else {
      fatAnt.pago = true;
      fatAnt.roladoParaProxima = true;
      fatAnt.liquidadaPorRolagem = true;
      fatAnt.saldoRestante = 0;
      fatAnt.negativada = false;
      fatAnt.migradoDivida = false;
    }
  }

  // Calcula encargos e rolagem para o mês seguinte
  const taxaRotativo = fatura.cartao.taxaRotativo || 0;
  const encargos = Math.round((fat.saldoRestante * (taxaRotativo / 100)) * 100) / 100;
  const rolagemTotal = Math.round((fat.saldoRestante + encargos) * 100) / 100;

  const mesSeguinte = adicionarMesesYM(ym, 1);
  const idProx = `${cid}_${mesSeguinte}`;
  let fatProx = S.faturasCartao.find(f => f.id === idProx || (f.cartaoId === cid && f.mes === mesSeguinte));
  if (!fatProx) {
    fatProx = {
      id: idProx,
      cartaoId: cid,
      mes: mesSeguinte,
      valorTotal: 0,
      valorPago: 0,
      pago: false,
      pagoParcial: false,
      saldoRestante: 0,
      rotativoRolado: 0,
      negativada: false,
      migradoDivida: false
    };
    S.faturasCartao.push(fatProx);
  }

  fatProx.rotativoRolado = rolagemTotal;
  fatProx.rotativoDetalhe = {
    saldoAnterior: fat.saldoRestante,
    principal: fat.saldoRestante,
    taxa: taxaRotativo,
    encargos,
    juros: encargos,
    total: rolagemTotal,
    origemMes: ym,
    mesOrigem: ym
  };

  save();
  closeM('m-pagto-parcial');
  render();

  if (typeof alert === 'function' && !dadosOverride) {
    alert(`💵 Pagamento parcial de ${fmt(valorPago)} confirmado!\nSaldo restante de ${fmt(fat.saldoRestante)} com ${taxaRotativo}% de juros (${fmt(encargos)}) rolado para a fatura de ${mesLabel(mesSeguinte)} (Total: ${fmt(rolagemTotal)}).`);
  }

  const modalFatura = document.getElementById('m-fatura-cartao');
  if (modalFatura && modalFatura.classList.contains('open')) {
    abrirFaturaCartao(cid, ym);
  }

  return {
    ok: true,
    faturaAtual: fat,
    faturaSeguinte: fatProx,
    encargos,
    rolagemTotal
  };
}

// 4.1 Abertura do modal de abatimento / pagamento avulso da fatura (Fatia 4 - ADR-004)
/**
 * Abre o modal de abatimento / pagamento avulso da fatura para o cartão e mês especificados.
 * Exibe o saldo pendente em aberto e configura o campo de valor para digitação.
 *
 * @param {number|string|null} cartaoId - ID do cartão de crédito
 * @param {string|null} mesYM - Competência no formato YYYY-MM
 */
function abrirModalAbaterCartao(cartaoId, mesYM) {
  const cid = cartaoId || cartaoAtualId;
  const ym = mesYM ? String(mesYM).slice(0, 7) : mesAtual;
  cartaoAtualId = cid;
  const fatura = calcularFaturaMes(cid, ym);
  if (!fatura.cartao) return;

  const fatReg = (S.faturasCartao || []).find(f => f.cartaoId === cid && f.mes === ym);
  const valorJaPago = (fatReg && Number(fatReg.valorPago)) || 0;
  const saldoPendente = Math.max(0, Math.round((fatura.valorTotalFatura - valorJaPago) * 100) / 100);

  const elSub = document.getElementById('abater-subtitulo');
  if (elSub) {
    elSub.textContent = `Cartão ${fatura.cartao.nome} • Fatura ${mesLabel(ym)}`;
  }

  const elSaldoTxt = document.getElementById('abater-saldo-txt');
  if (elSaldoTxt) {
    elSaldoTxt.textContent = fmt(saldoPendente);
  }

  const elVal = document.getElementById('abater-valor');
  if (elVal) {
    elVal.value = '';
    elVal.max = saldoPendente > 0 ? String(saldoPendente) : '';
  }

  openM('m-abater-cartao');
}

// 4.2 Confirmação de abatimento / pagamento avulso da fatura (Fatia 4 - ADR-004)
/**
 * Executa o abatimento avulso da fatura amortizando diretamente o saldo devedor.
 * - Amortização direta: incrementa valorPago e reduz saldoRestante.
 * - Liberação de limite imediata: calcularLimiteCartao lê valorPago da fatura do mês atual.
 * - Débito em tempo real do Caixa Real (Painel Verdinho): calcTotais soma faturas pagas/parciais.
 * - Não aciona rolagem nem encargos de rotativo para o mês seguinte (roladoParaProxima permanece falso).
 *
 * @param {Object|null} dadosOverride - Parâmetros opcionais para automação e testes { cartaoId, mes, valor }
 * @returns {Object} Resultado contendo { ok: boolean, fatura: Object, ... }
 */
function confirmarAbatimentoCartao(dadosOverride) {
  const cid = dadosOverride?.cartaoId || cartaoAtualId;
  const ym = dadosOverride?.mes ? String(dadosOverride.mes).slice(0, 7) : (dadosOverride?.mesYM ? String(dadosOverride.mesYM).slice(0, 7) : mesAtual);
  const fatura = calcularFaturaMes(cid, ym);
  if (!fatura.cartao) {
    if (typeof alert === 'function' && !dadosOverride) alert('Cartão de crédito não encontrado.');
    return { ok: false, erro: 'Cartão não encontrado' };
  }

  if (!Array.isArray(S.faturasCartao)) S.faturasCartao = [];
  const idFat = `${cid}_${ym}`;
  let fat = S.faturasCartao.find(f => f.id === idFat || (f.cartaoId === cid && f.mes === ym));

  const valorJaPago = (fat && Number(fat.valorPago)) || 0;
  const saldoPendente = Math.max(0, Math.round((fatura.valorTotalFatura - valorJaPago) * 100) / 100);

  if (saldoPendente <= 0 && fat && fat.pago) {
    if (typeof alert === 'function' && !dadosOverride) alert('Esta fatura já está integralmente quitada.');
    return { ok: false, erro: 'Fatura já quitada' };
  }

  if (saldoPendente <= 0) {
    if (typeof alert === 'function' && !dadosOverride) alert('Esta fatura não possui saldo pendente para abatimento.');
    return { ok: false, erro: 'Sem saldo pendente' };
  }

  const elVal = document.getElementById('abater-valor');
  const valRaw = dadosOverride?.valor ?? dadosOverride?.valorAbater ?? dadosOverride?.valorPago ?? (elVal ? elVal.value : 0);
  const valorAbater = parseFloat(String(valRaw).replace(',', '.'));

  if (isNaN(valorAbater) || valorAbater <= 0) {
    if (typeof alert === 'function' && !dadosOverride) alert('Informe um valor a abater válido maior que zero.');
    return { ok: false, erro: 'Valor inválido' };
  }

  // Compara em centavos inteiros para evitar imprecisões de ponto flutuante (ex: 0.1 + 0.2 !== 0.3)
  const centavosAbater = Math.round(valorAbater * 100);
  const centavosPendente = Math.round(saldoPendente * 100);

  if (centavosAbater > centavosPendente) {
    if (typeof alert === 'function' && !dadosOverride) {
      alert(`O valor a abater (${fmt(valorAbater)}) não pode ser superior ao saldo pendente da fatura (${fmt(saldoPendente)}).`);
    }
    return { ok: false, erro: 'Valor excede saldo pendente' };
  }

  if (!fat) {
    fat = {
      id: idFat,
      cartaoId: cid,
      mes: ym,
      valorTotal: fatura.valorTotalFatura,
      valorPago: 0,
      pago: false,
      pagoParcial: false,
      saldoRestante: fatura.valorTotalFatura,
      rotativoRolado: 0,
      negativada: false,
      migradoDivida: false
    };
    S.faturasCartao.push(fat);
  }

  const novoValorPago = Math.round((valorJaPago + valorAbater) * 100) / 100;
  const novoSaldoRestante = Math.max(0, Math.round((saldoPendente - valorAbater) * 100) / 100);

  fat.valorTotal = fatura.valorTotalFatura;
  fat.valorPago = novoValorPago;
  fat.saldoRestante = novoSaldoRestante;
  fat.negativada = false;
  fat.migradoDivida = false;
  fat.dataPagamento = new Date().toISOString().slice(0, 10);

  if (novoSaldoRestante <= 0) {
    // Quitação total da fatura por abatimento
    fat.pago = true;
    fat.pagoParcial = false;
    fat.saldoRestante = 0;

    // Se quitou totalmente e havia rolagem automática absorvida da fatura anterior, liquida o registro anterior
    if (fatura.rotativoItem && fatura.rotativoItem.automatico) {
      const mesOrig = fatura.rotativoItem.detalhe?.mesOrigem || adicionarMesesYM(ym, -1);
      let fatAnt = (S.faturasCartao || []).find(f => f.cartaoId === cid && f.mes === mesOrig);
      if (!fatAnt) {
        const idAnt = `${cid}_${mesOrig}`;
        const fatAntInfo = calcularFaturaMes(cid, mesOrig, true);
        fatAnt = {
          id: idAnt,
          cartaoId: cid,
          mes: mesOrig,
          valorTotal: fatAntInfo.valorTotalFatura,
          valorPago: 0,
          pago: true,
          pagoParcial: false,
          saldoRestante: 0,
          rotativoRolado: 0,
          roladoParaProxima: true,
          liquidadaPorRolagem: true,
          negativada: false,
          migradoDivida: false
        };
        S.faturasCartao.push(fatAnt);
      } else {
        fatAnt.pago = true;
        fatAnt.roladoParaProxima = true;
        fatAnt.liquidadaPorRolagem = true;
        fatAnt.saldoRestante = 0;
        fatAnt.negativada = false;
        fatAnt.migradoDivida = false;
      }
      fat.rotativoRolado = fatura.rotativoItem.val;
      fat.rotativoDetalhe = fatura.rotativoItem.detalhe;
    }
  } else {
    // Abatimento parcial: a fatura permanece em aberto aguardando vencimento pelo saldo restante.
    // Decisão ADR-004: Não aciona rotativo nem define roladoParaProxima = true.
    // Marca pagoParcial = true para que calcTotais considere o valor desembolsado nas saídas do Caixa Real.
    fat.pago = false;
    fat.pagoParcial = true;
  }

  registrarNotificacaoFamilia({
    tipo: 'financas',
    titulo: 'Abatimento de Fatura',
    texto: `Abatimento de ${fmt(valorAbater)} realizado no cartão ${(fatura.cartao && fatura.cartao.nome) || ''}`,
    valor: valorAbater,
    linkTela: 'resumo'
  });

  save();
  closeM('m-abater-cartao');
  render();

  if (typeof alert === 'function' && !dadosOverride) {
    if (fat.pago) {
      alert(`✅ Abatimento de ${fmt(valorAbater)} confirmado! Fatura quitada integralmente!`);
    } else {
      alert(`💵 Abatimento de ${fmt(valorAbater)} confirmado com sucesso! Saldo pendente restante: ${fmt(fat.saldoRestante)}. Limite liberado imediatamente!`);
    }
  }

  const modalFatura = document.getElementById('m-fatura-cartao');
  if (modalFatura && modalFatura.classList.contains('open')) {
    abrirFaturaCartao(cid, ym);
  }

  return {
    ok: true,
    fatura: fat,
    valorAbatido: valorAbater,
    saldoRestante: fat.saldoRestante,
    valorPago: fat.valorPago,
    pago: fat.pago,
    pagoParcial: fat.pagoParcial
  };
}

// 5. Abertura do modal de antecipação de compras
function abrirModalAnteciparCartao(cartaoId) {
  const cid = cartaoId || cartaoAtualId;
  cartaoAtualId = cid;
  const cartao = (S.cartoes || []).find(c => c.id === cid);
  if (!cartao) return;

  // B3: O destino da antecipação deve ser max(mesAtual, mesRealHoje) — nunca para o passado real
  const mesRealHoje = new Date().toISOString().slice(0, 7);
  const destinoMes = mesAtual < mesRealHoje ? mesRealHoje : mesAtual;

  // B3: Bloqueie se a fatura de destino estiver negativada/migrada
  const fatDestino = (S.faturasCartao || []).find(f => f.cartaoId === cid && f.mes === destinoMes);
  const destinoNegativada = fatDestino && (fatDestino.negativada || fatDestino.migradoDivida);

  const elSub = document.getElementById('antecipar-cartao-subtitulo');
  if (elSub) {
    elSub.textContent = `Cartão: ${cartao.nome} • Puxar compras e parcelas futuras para a fatura de ${mesLabel(destinoMes)}`;
  }

  const elLista = document.getElementById('lista-parcelas-futuras-cartao');
  if (elLista) {
    if (destinoNegativada) {
      elLista.innerHTML = `<p style="color:var(--red);font-size:13px;padding:16px 0;text-align:center;">⚠️ A fatura de destino (${mesLabel(destinoMes)}) está negativada. Antecipação bloqueada.</p>`;
      openM('m-antecipar-cartao');
      return;
    }

    // B3: Só liste compras com mesFatura > destino e não canceladaNegativacao
    const comprasFuturas = (S.comprasCartao || []).filter(c => c.cartaoId === cid && c.mesFatura > destinoMes && !c.canceladaNegativacao);
    comprasFuturas.sort((a, b) => (a.mesFatura || '').localeCompare(b.mesFatura || ''));

    if (!comprasFuturas.length) {
      elLista.innerHTML = '<p style="color:var(--muted);font-size:13px;padding:16px 0;text-align:center;">Nenhuma compra ou parcela futura encontrada para antecipação neste cartão.</p>';
    } else {
      elLista.innerHTML = comprasFuturas.map(c => {
        const parcBadge = c.parcelado ? `<span class="badge b-parc">${c.parcelaNum}/${c.totalParcelas}</span>` : '';
        return `<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.3);border:1px solid var(--border);border-radius:8px;padding:8px 10px;margin-bottom:6px;font-size:12px;">
          <div style="flex:1;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <strong>${escapeHtml(c.desc)}</strong>
            <span class="badge" style="background:rgba(59,130,246,0.2);color:#60a5fa;">Fatura ${mesLabel(c.mesFatura)}</span>
            ${parcBadge}
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-weight:600;color:var(--red);">${fmt(c.val)}</span>
            <button type="button" class="btn" style="width:auto;padding:5px 8px;font-size:11px;background:rgba(59,130,246,0.2);color:#60a5fa;border:1px solid rgba(59,130,246,0.4);" onclick="anteciparCompraCartao(${c.id})">⏩ Antecipar p/ ${mesLabel(destinoMes)}</button>
          </div>
        </div>`;
      }).join('');
    }
  }

  openM('m-antecipar-cartao');
}

// 6. Antecipação de compra ou parcela futura
function anteciparCompraCartao(compraId) {
  if (!Array.isArray(S.comprasCartao)) return { ok: false };
  const compra = S.comprasCartao.find(c => c.id === compraId);
  if (!compra) return { ok: false, erro: 'Compra não encontrada' };

  // B3: O destino da antecipação deve ser max(mesAtual, mesRealHoje) — nunca para o passado real
  const mesRealHoje = new Date().toISOString().slice(0, 7);
  const destinoMes = mesAtual < mesRealHoje ? mesRealHoje : mesAtual;

  // B3: Bloqueie (guarda na função) se a fatura de destino estiver negativada/migrada
  const fatDestino = (S.faturasCartao || []).find(f => f.cartaoId === compra.cartaoId && f.mes === destinoMes);
  if (fatDestino && (fatDestino.negativada || fatDestino.migradoDivida)) {
    if (typeof alert === 'function') alert('Não é possível antecipar para uma fatura negativada.');
    return { ok: false, erro: 'Fatura destino negativada' };
  }

  // B3: Guarda - só permite se compra.mesFatura > destinoMes
  if (compra.mesFatura <= destinoMes) {
    if (typeof alert === 'function') alert('Esta compra já pertence a uma fatura presente ou passada.');
    return { ok: false, erro: 'Compra não é posterior ao destino' };
  }

  const mesOrig = compra.mesFatura;
  compra.mesFaturaOriginal = compra.mesFaturaOriginal || mesOrig;
  compra.mesFatura = destinoMes;
  compra.adiantada = true;

  // B3: Se a fatura destino já estiver paga, aplique a mesma reabertura de B2 (fica saldo pendente)
  verificarEReabrirFatura(compra.cartaoId, destinoMes);

  save();
  render();

  if (typeof alert === 'function') {
    alert(`⏩ Parcela "${compra.desc}" antecipada com sucesso de ${mesLabel(mesOrig)} para a fatura de ${mesLabel(destinoMes)}!`);
  }

  const modalAntecipar = document.getElementById('m-antecipar-cartao');
  if (modalAntecipar && modalAntecipar.classList.contains('open') && compra.cartaoId) {
    abrirModalAnteciparCartao(compra.cartaoId);
  }

  const modalFatura = document.getElementById('m-fatura-cartao');
  if (modalFatura && modalFatura.classList.contains('open') && compra.cartaoId) {
    abrirFaturaCartao(compra.cartaoId, mesAtual);
  }

  return { ok: true, compra, destinoMes };
}

function abrirModalGasto(){
  document.getElementById('g-data').value = dataDefaultParaModal();
  document.getElementById('g-is-parcelado').checked = false;
  document.getElementById('g-bloco-parcelamento').style.display = 'none';
  document.getElementById('g-num-parcelas').value = '2';
  document.getElementById('g-preview-parcela').textContent = '';
  if(document.getElementById('g-origem-divida')) document.getElementById('g-origem-divida').value = '';
  
  if(document.getElementById('g-is-recorrente')) {
    document.getElementById('g-is-recorrente').checked = false;
    document.getElementById('g-bloco-recorrente').style.display = 'none';
    document.getElementById('g-prazo-recorrente').value = '12';
    document.getElementById('g-meses-recorrente').value = '12';
    const rowPers = document.getElementById('g-row-meses-personalizado');
    if(rowPers) rowPers.style.display = 'none';
    document.getElementById('g-preview-recorrente').textContent = '';
  }
  renderCategoriasModalGasto();
  atualizarSelectsTipoDivida();
  openM('m-gasto');
}
function abrirModalReceita(){ document.getElementById('r-data').value=dataDefaultParaModal(); openM('m-receita'); }
function abrirModalDivida(){
  atualizarSelectsTipoDivida();
  openM('m-divida');
}
function abrirModalInvestimento(metaId){
  document.getElementById('inv-meta-id').value = metaId || '';
  document.getElementById('inv-data').value=new Date().toISOString().slice(0,10); 
  openM('m-investimento'); 
}

function brDateToISO(str){
  const m=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec((str||'').trim());
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}

// LEITURA DE COMPROVANTES/HOLERITES COM IA (Gemini Vision — grátis no plano free)
function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(reader.result.split(',')[1]);
    reader.onerror=reject;
    reader.readAsDataURL(file);
  });
}

async function extrairComImagem(file, tipoDoc){
  if(!apiKey){ alert('Configure a Gemini API Key em Configurações primeiro.'); go('config'); return null; }
  const base64=await fileToBase64(file);
  const prompt = tipoDoc==='gasto'
    ? 'Você recebeu a foto ou PDF de um recibo, nota fiscal ou comprovante de pagamento brasileiro. Extraia o valor total pago e uma descrição curta (nome do estabelecimento ou produto/serviço). Responda APENAS em JSON puro, sem markdown, sem texto extra, no formato exato: {"descricao":"string curta","valor":number,"data":"DD/MM/AAAA ou vazio"}. Se não conseguir identificar com confiança, retorne {"descricao":"","valor":0,"data":""}.'
    : 'Você recebeu a foto ou PDF de um holerite, contracheque ou comprovante de depósito/PIX brasileiro. Extraia o valor líquido recebido e uma descrição curta (ex: "Salário", "PLR", "13º salário", "Bônus", "Férias"). Responda APENAS em JSON puro, sem markdown, sem texto extra, no formato exato: {"descricao":"string curta","valor":number,"data":"DD/MM/AAAA ou vazio"}. Se não conseguir identificar com confiança, retorne {"descricao":"","valor":0,"data":""}.';

  const resultado = await chamarGeminiComFallback({
    contents: [{
      role: 'user',
      parts: [
        { text: prompt },
        { inline_data: { mime_type: file.type || 'image/jpeg', data: base64 } }
      ]
    }],
    generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 300 }
  });

  const text = resultado.text;
  if(!text) throw new Error('Sem resposta da IA nos modelos consultados');
  return JSON.parse(text);
}

async function lerGastoComIA(){
  const file=document.getElementById('g-file').files[0];
  const st=document.getElementById('g-ocr-status');
  if(!file){ if(st) st.textContent=''; return; }
  if(st) st.textContent='🔎 Lendo comprovante...';
  try{
    const r=await extrairComImagem(file,'gasto');
    if(r && r.valor>0){
      document.getElementById('g-desc').value=r.descricao||'';
      document.getElementById('g-val').value=r.valor;
      const iso=brDateToISO(r.data); if(iso) document.getElementById('g-data').value=iso;
      if(st) st.textContent='✅ Lido! Confira os valores antes de salvar.';
    } else if(st) st.textContent='⚠️ Não consegui ler os valores — preencha manualmente.';
  }catch(e){ if(st) st.textContent='❌ Erro ao ler: '+e.message; console.error(e); }
}

async function lerReceitaComIA(){
  const file=document.getElementById('r-file').files[0];
  const st=document.getElementById('r-ocr-status');
  if(!file){ if(st) st.textContent=''; return; }
  if(st) st.textContent='🔎 Lendo holerite...';
  try{
    const r=await extrairComImagem(file,'receita');
    if(r && r.valor>0){
      document.getElementById('r-desc').value=r.descricao||'';
      document.getElementById('r-val').value=r.valor;
      const iso=brDateToISO(r.data); if(iso) document.getElementById('r-data').value=iso;
      if(st) st.textContent='✅ Lido! Confira os valores antes de salvar.';
    } else if(st) st.textContent='⚠️ Não consegui ler os valores — preencha manualmente.';
  }catch(e){ if(st) st.textContent='❌ Erro ao ler: '+e.message; console.error(e); }
}

// CRUD
function addReceita(){
  const titular=(document.getElementById('r-titular')?.value||'').trim();
  const desc=document.getElementById('r-desc').value.trim();
  const val=parseFloat(document.getElementById('r-val').value);
  const tipo=document.getElementById('r-tipo').value;
  const data=document.getElementById('r-data').value || new Date().toISOString().slice(0,10);
  if(!desc||!val||val<=0) return;
  S.receitas.push({id:Date.now(),desc,val,tipo,data,titular});
  registrarNotificacaoFamilia({
    tipo: 'financas',
    titulo: 'Receita Registrada',
    texto: `${desc} (${fmt(val)}) por ${titular || 'Família'}`,
    valor: val,
    linkTela: 'receitas'
  });
  save();
  closeM('m-receita');
  render();
  document.getElementById('r-desc').value=''; document.getElementById('r-val').value='';
  if(document.getElementById('r-titular')) document.getElementById('r-titular').value='';
  const rf=document.getElementById('r-file'); if(rf) rf.value='';
  const rst=document.getElementById('r-ocr-status'); if(rst) rst.textContent='';
}

function addGasto(){
  const titular=(document.getElementById('g-titular')?.value||'').trim();
  const desc=document.getElementById('g-desc').value.trim();
  const val=parseFloat(document.getElementById('g-val').value);
  const cat=document.querySelector('#cat-tags .tag.sel')?.dataset.cat||'recorrente';
  const data=document.getElementById('g-data').value || new Date().toISOString().slice(0,10);
  const isParcelado = document.getElementById('g-is-parcelado')?.checked;
  const isRecorrente = document.getElementById('g-is-recorrente')?.checked;
  if(!desc||!val||val<=0) return;

  if (isParcelado) {
    const num = Math.max(2, parseInt(document.getElementById('g-num-parcelas').value) || 2);
    const tipoDivida = document.getElementById('g-tipo-divida')?.value || 'cartao';
    const origemDivida = (document.getElementById('g-origem-divida')?.value || '').trim();
    const baseCentavos = Math.floor((val / num) * 100);
    const restoCentavos = Math.round(val * 100) - (baseCentavos * num);
    const grupoId = 'parc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

    for (let i = 1; i <= num; i++) {
      const centavosDesta = baseCentavos + (i === num ? restoCentavos : 0);
      const vParc = centavosDesta / 100;
      const dt = adicionarMeses(data, i - 1);
      S.gastos.push({
        id: Date.now() + i,
        grupoId,
        desc: `${desc} (${i}/${num})`,
        descOriginal: desc,
        val: vParc,
        valTotal: val,
        cat,
        titular,
        tipoDivida,
        origemDivida,
        parcelado: true,
        recorrente: false,
        parcelaNum: i,
        totalParcelas: num,
        data: dt,
        dataOriginal: dt,
        pago: false,
        dataPagto: null,
        adiantada: false
      });
    }
  } else if (isRecorrente) {
    const prazoSel = document.getElementById('g-prazo-recorrente')?.value || '12';
    let qtdMeses = 12;
    if (prazoSel === 'personalizado') {
      qtdMeses = Math.max(2, parseInt(document.getElementById('g-meses-recorrente')?.value) || 12);
    } else if (prazoSel === 'ano_atual') {
      const mesNum = parseInt(data.split('-')[1]) || 1;
      qtdMeses = Math.max(1, 12 - mesNum + 1);
    } else {
      qtdMeses = Math.max(2, parseInt(prazoSel) || 12);
    }
    const grupoId = 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

    for (let i = 1; i <= qtdMeses; i++) {
      const dt = adicionarMeses(data, i - 1);
      const isPrimeiro = (i === 1);
      S.gastos.push({
        id: Date.now() + i,
        grupoId,
        desc: `${desc} (${i}/${qtdMeses})`,
        descOriginal: desc,
        val: val, // Valor cheio por mês!
        cat,
        titular,
        recorrente: true,
        parcelado: false,
        mesNum: i,
        totalMeses: qtdMeses,
        data: dt,
        dataOriginal: dt,
        pago: isPrimeiro,
        dataPagto: isPrimeiro ? dt : null,
        adiantada: false
      });
    }
  } else {
    S.gastos.push({
      id: Date.now(),
      desc,
      val,
      cat,
      data,
      titular,
      parcelado: false,
      recorrente: false,
      pago: true,
      dataPagto: data
    });
  }

  registrarNotificacaoFamilia({
    tipo: 'financas',
    titulo: 'Novo Gasto Registrado',
    texto: `${desc} (${fmt(val)}) por ${titular || 'Família'}`,
    valor: val,
    linkTela: 'gastos'
  });

  save();
  closeM('m-gasto');
  render();
  document.getElementById('g-desc').value=''; document.getElementById('g-val').value='';
  if(document.getElementById('g-titular')) document.getElementById('g-titular').value='';
  const gf=document.getElementById('g-file'); if(gf) gf.value='';
  const gst=document.getElementById('g-ocr-status'); if(gst) gst.textContent='';
  document.getElementById('g-is-parcelado').checked = false;
  document.getElementById('g-bloco-parcelamento').style.display = 'none';
  document.getElementById('g-preview-parcela').textContent = '';
  if(document.getElementById('g-origem-divida')) document.getElementById('g-origem-divida').value = '';
  if(document.getElementById('g-is-recorrente')) {
    document.getElementById('g-is-recorrente').checked = false;
    document.getElementById('g-bloco-recorrente').style.display = 'none';
    document.getElementById('g-preview-recorrente').textContent = '';
  }
}

function addDivida(){
  const titular=(document.getElementById('d-titular')?.value||'').trim();
  const credor=document.getElementById('d-credor').value.trim();
  const saldo=parseFloat(document.getElementById('d-saldo').value);
  const juros=parseFloat(document.getElementById('d-juros').value)||0;
  const parcela=parseFloat(document.getElementById('d-parcela').value)||0;
  const tipo=document.getElementById('d-tipo').value;
  if(!credor||!saldo||saldo<=0) return;
  S.dividas.push({id:Date.now(),credor,saldo,juros,parcela,tipo,titular,quitada:false,valorQuitado:null,dataQuitacao:null,acordo:null});
  save();
  closeM('m-divida');
  render();
  document.getElementById('d-credor').value=''; document.getElementById('d-saldo').value='';
  document.getElementById('d-juros').value=''; document.getElementById('d-parcela').value='';
  if(document.getElementById('d-titular')) document.getElementById('d-titular').value='';
}

function addMeta(){
  const nome=document.getElementById('mt-nome').value.trim();
  const total=parseFloat(document.getElementById('mt-total').value);
  const atual=parseFloat(document.getElementById('mt-atual').value)||0;
  if(!nome||!total||total<=0) return;
  S.metas.push({id:Date.now(),nome,total,atual});
  save();
  closeM('m-meta');
  render();
  document.getElementById('mt-nome').value=''; document.getElementById('mt-total').value=''; document.getElementById('mt-atual').value='';
}

function del(arr,id){ return arr.filter(i=>i.id!==id); }

// INVESTIMENTOS — evolução automática por juros compostos mensais
function addInvestimento(){
  const titular=(document.getElementById('inv-titular')?.value||'').trim();
  const banco=document.getElementById('inv-banco').value.trim();
  const tipo=document.getElementById('inv-tipo').value;
  const metaId=document.getElementById('inv-meta-id').value;
  const valorInicial=parseFloat(document.getElementById('inv-valor').value);
  const taxaMensal=parseFloat(document.getElementById('inv-taxa').value) || 0;
  const dataInicio=document.getElementById('inv-data').value || new Date().toISOString().slice(0,10);
  if(!banco||!valorInicial||valorInicial<=0){ alert('Preencha banco e valor aportado.'); return; }
  S.investimentos.push({id:Date.now(), metaId: metaId ? parseInt(metaId) : null, tipo, banco, valorInicial, taxaMensal, dataInicio, titular});
  save(); closeM('m-investimento'); render();
  document.getElementById('inv-banco').value=''; document.getElementById('inv-valor').value=''; document.getElementById('inv-taxa').value='';
  if(document.getElementById('inv-titular')) document.getElementById('inv-titular').value='';
  document.getElementById('inv-meta-id').value='';
}

function mesesEntre(dataInicioISO){
  const d1=new Date(dataInicioISO+'T00:00:00');
  const d2=new Date();
  let meses=(d2.getFullYear()-d1.getFullYear())*12+(d2.getMonth()-d1.getMonth());
  if(d2.getDate()<d1.getDate()) meses--; // ainda não fechou o mês corrente
  return Math.max(0,meses);
}
function valorAtualInvestimento(inv){
  const meses=mesesEntre(inv.dataInicio);
  return inv.valorInicial*Math.pow(1+(inv.taxaMensal/100), meses);
}

// DÍVIDAS — quitação direta e acordos parcelados
function saldoRestante(d){
  if(d.acordo) return d.acordo.parcelas.filter(p=>!p.paga).reduce((s,p)=>s+p.valor,0);
  return d.saldo;
}

function marcarQuitada(id){
  const d=S.dividas.find(x=>x.id===id);
  if(!d) return;
  const val=prompt('Valor pago na quitação (R$):', d.saldo);
  if(val===null) return;
  const v=parseFloat(String(val).replace(',','.'));
  if(!v||v<=0){ alert('Informe um valor válido.'); return; }
  d.quitada=true; d.valorQuitado=v; d.dataQuitacao=new Date().toISOString().slice(0,10);
  save(); render();
}

let acordoDividaId=null;
function abrirAcordo(id){
  const d=S.dividas.find(x=>x.id===id);
  if(!d) return;
  acordoDividaId=id;
  document.getElementById('ac-credor').textContent=d.credor;
  document.getElementById('ac-total').value=d.saldo;
  document.getElementById('ac-entrada').value='';
  document.getElementById('ac-parcelas').value='';
  openM('m-acordo');
}
function salvarAcordo(){
  const d=S.dividas.find(x=>x.id===acordoDividaId);
  if(!d) return;
  const total=parseFloat(document.getElementById('ac-total').value);
  const entrada=parseFloat(document.getElementById('ac-entrada').value)||0;
  const num=parseInt(document.getElementById('ac-parcelas').value);
  if(!total||total<=0||!num||num<=0){ if(typeof alert==='function') alert('Preencha o valor total e o número de parcelas.'); return; }
  if(entrada>total){ if(typeof alert==='function') alert('A entrada não pode ser maior que o valor total.'); return; }
  const restante=Math.round((total-entrada)*100)/100;
  const valorParcela=Math.round((restante/num)*100)/100;
  const parcelas=[]; let soma=0;
  const dataHoje = new Date();
  for(let i=1;i<=num;i++){
    const v = i===num ? Math.round((restante-soma)*100)/100 : valorParcela; // última parcela absorve o arredondamento
    soma+=v;
    const dtVenc = new Date(dataHoje);
    dtVenc.setMonth(dtVenc.getMonth() + i);
    parcelas.push({
      num: i,
      valor: v,
      paga: false,
      dataPagto: null,
      dataVencimento: dtVenc.toISOString().slice(0, 10)
    });
  }
  // Fatia 5 (ADR-004): Garante preservação do saldo pré-acordo para rastreabilidade contábil
  if (d.saldoOriginalPreAcordo === undefined || d.saldoOriginalPreAcordo === null) {
    d.saldoOriginalPreAcordo = d.saldo;
  }
  d.acordo={
    valorTotal: total,
    entrada,
    numParcelas: num,
    valorParcela,
    parcelas,
    dataAcordo: new Date().toISOString().slice(0, 10)
  };
  d.quitada=false; d.valorQuitado=null; d.dataQuitacao=null;
  save(); closeM('m-acordo'); render();
}
function toggleParcela(dividaId, num){
  const d=S.dividas.find(x=>x.id===dividaId);
  if(!d||!d.acordo) return;
  const p=d.acordo.parcelas.find(x=>x.num===num);
  if(!p) return;
  p.paga=!p.paga;
  p.dataPagto=p.paga?new Date().toISOString().slice(0,10):null;
  if(d.acordo.parcelas.every(x=>x.paga)){
    d.quitada=true;
    d.valorQuitado=d.acordo.entrada+d.acordo.parcelas.reduce((s,x)=>s+x.valor,0);
    d.dataQuitacao=new Date().toISOString().slice(0,10);
  } else {
    d.quitada=false; d.valorQuitado=null; d.dataQuitacao=null;
  }
  save(); render();
}

// -------------------------------------------------------------
// FATIA 5: QUEBRA DE ACORDO DE DÍVIDAS (ADR-004)
// -------------------------------------------------------------

/**
 * Verifica se uma parcela específica de um acordo está em atraso há 30 dias ou mais.
 * Suporta propriedade direta de dias, data de vencimento ISO (YYYY-MM-DD) ou competência YYYY-MM.
 *
 * @param {Object} parcela - Objeto da parcela { num, valor, paga, dataVencimento, ... }
 * @param {string|Date} [dataReferencia] - Data de corte para cálculo (default: data atual)
 * @returns {boolean}
 */
function parcelaTemAtraso30Dias(parcela, dataReferencia) {
  if (!parcela || parcela.paga) return false;

  // Propriedade explícita de dias de atraso (comum em testes unitários)
  if (typeof parcela.diasAtraso === 'number') {
    return parcela.diasAtraso >= 30;
  }
  if (parcela.atrasada30Dias === true) {
    return true;
  }

  const refDate = dataReferencia ? new Date(dataReferencia) : new Date();
  const refTime = refDate.getTime();

  // Campo de data de vencimento ISO (YYYY-MM-DD)
  const dtVencStr = parcela.dataVencimento || parcela.vencimento || parcela.dataVenc || parcela.data;
  if (dtVencStr && typeof dtVencStr === 'string') {
    const vencDate = new Date(dtVencStr);
    if (!isNaN(vencDate.getTime())) {
      const diffMs = refTime - vencDate.getTime();
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return diffDias >= 30;
    }
  }

  // Campo de competência YYYY-MM
  const mesVenc = parcela.mesVencimento || parcela.mes;
  if (mesVenc && String(mesVenc).length >= 7) {
    const mesRef = String(dataReferencia || new Date().toISOString().slice(0, 7)).slice(0, 7);
    const meses = calcularMesesAtraso(mesVenc, mesRef);
    if (meses >= 2) return true;
    if (meses === 1) {
      return refDate.getDate() >= 1; // Pelo menos 1 mês completo decorrido
    }
  }

  return false;
}

/**
 * Verifica se uma dívida com acordo ativo possui ao menos uma parcela vencida há 30 dias ou mais.
 *
 * @param {Object} divida - Objeto da dívida
 * @param {string|Date} [dataReferencia] - Data de corte
 * @returns {boolean}
 */
function acordoTemParcelaAtrasada30Dias(divida, dataReferencia) {
  if (!divida || !divida.acordo || !Array.isArray(divida.acordo.parcelas)) return false;
  return divida.acordo.parcelas.some(p => parcelaTemAtraso30Dias(p, dataReferencia));
}

/**
 * Executa a quebra de um acordo inadimplido na aba Dívidas (ADR-004).
 * 1. Confirma com o usuário.
 * 2. Amortiza a entrada e todas as parcelas pagas do saldo original pré-acordo.
 * 3. Restaura o saldo restante para a cobrança direta da dívida.
 * 4. Reativa a incidência da taxa de juros original (custoJuros em calcTotais).
 * 5. Remove o acordo (d.acordo = null) e restabelece os botões de quitação/novo acordo.
 *
 * @param {number|string} dividaId - ID da dívida em S.dividas
 * @param {Object|null} [dadosOverride] - Opções de controle (ex: testes sem confirm interativo)
 * @returns {Object} Resultado da operação { ok: boolean, divida: Object, totalAmortizado, novoSaldo, quitada }
 */
function quebrarAcordo(dividaId, dadosOverride = null) {
  const d = (S.dividas || []).find(x => String(x.id) === String(dividaId));
  if (!d) {
    if (typeof alert === 'function' && !dadosOverride) alert('Dívida não encontrada.');
    return { ok: false, erro: 'Dívida não encontrada' };
  }
  if (!d.acordo) {
    if (typeof alert === 'function' && !dadosOverride) alert('Esta dívida não possui um acordo ativo para ser quebrado.');
    return { ok: false, erro: 'Dívida não possui acordo ativo' };
  }

  // Confirmação obrigatória com o usuário
  if (!dadosOverride && typeof confirm === 'function') {
    const confirmou = confirm('Deseja realmente quebrar este acordo? O valor já pago de entrada e parcelas será amortizado, e o saldo restante voltará para a cobrança da dívida com juros reativados.');
    if (!confirmou) {
      return { ok: false, cancelado: true };
    }
  }

  // 1. Total amortizado: entrada paga + parcelas marcadas como pagas
  const entradaPaga = Number(d.acordo.entrada) || 0;
  const parcelasPagas = (d.acordo.parcelas || []).filter(p => p.paga).reduce((s, p) => s + (Number(p.valor ?? p.val) || 0), 0);
  const totalAmortizado = Math.round((entradaPaga + parcelasPagas) * 100) / 100;

  // 2. Saldo base: prioriza saldoOriginalPreAcordo, fallback para d.saldo ou valorTotal do acordo
  const saldoBase = Number(d.saldoOriginalPreAcordo) || Number(d.saldo) || Number(d.acordo.valorTotal) || 0;
  const novoSaldo = Math.max(0, Math.round((saldoBase - totalAmortizado) * 100) / 100);

  // 3. Efetivação da quebra do acordo
  d.saldo = novoSaldo;
  d.historicoQuebraAcordo = {
    data: new Date().toISOString().slice(0, 10),
    totalAmortizado,
    saldoRestaurado: novoSaldo,
    saldoBaseOriginal: saldoBase
  };
  d.acordo = null;

  if (novoSaldo === 0) {
    // Caso raro onde pagamentos anteriores cobriram 100% da dívida
    d.quitada = true;
    d.valorQuitado = totalAmortizado;
    d.dataQuitacao = new Date().toISOString().slice(0, 10);
  } else {
    d.quitada = false;
    d.valorQuitado = null;
    d.dataQuitacao = null;
  }

  registrarNotificacaoFamilia({
    tipo: 'financas',
    titulo: 'Acordo de Dívida Cancelado',
    texto: `Acordo de "${d.credor || 'Dívida'}" cancelado. Saldo restante: ${fmt(novoSaldo)}`,
    valor: novoSaldo,
    linkTela: 'dividas'
  });

  save();
  render();

  if (typeof alert === 'function' && !dadosOverride) {
    if (d.quitada) {
      alert(`✅ Acordo quebrado, mas os pagamentos anteriores (${fmt(totalAmortizado)}) quitaram integralmente o saldo devedor original! Dívida finalizada.`);
    } else {
      alert(`⚠️ Acordo quebrado com sucesso! Total amortizado: ${fmt(totalAmortizado)}. Saldo restante restaurado: ${fmt(novoSaldo)} com juros mensais reativados.`);
    }
  }

  return {
    ok: true,
    divida: d,
    totalAmortizado,
    novoSaldo,
    quitada: d.quitada
  };
}

// CALC
function investimentosDoMes(ym){
  const mes = ym || mesAtual;
  return (S.investimentos || []).filter(inv => (inv.dataInicio || '').slice(0, 7) === mes);
}

function calcSaldoAcumuladoAnterior(targetYM) {
  const mesesSet = new Set();
  (S.receitas || []).forEach(r => { const ym = (r.data||'').slice(0,7); if(ym && ym < targetYM) mesesSet.add(ym); });
  (S.gastos || []).forEach(g => { const ym = (g.data||'').slice(0,7); if(ym && ym < targetYM) mesesSet.add(ym); });
  (S.investimentos || []).forEach(i => { const ym = (i.dataInicio||'').slice(0,7); if(ym && ym < targetYM) mesesSet.add(ym); });
  (S.faturasCartao || []).forEach(f => { const ym = (f.mes||'').slice(0,7); if(ym && ym < targetYM) mesesSet.add(ym); });

  const mesesOrdenados = Array.from(mesesSet).sort();
  let acumulado = 0;
  for (const ym of mesesOrdenados) {
    const rec = (S.receitas || []).filter(r => (r.data||'').slice(0,7) === ym).reduce((s,r) => s + r.val, 0);
    // Gastos do mês pagos no mês anterior (gastos negociados não consumiram caixa no mês original)
    const gasPagos = (S.gastos || []).filter(g => (g.data||'').slice(0,7) === ym && g.pago && !g.negociado).reduce((s,g) => s + g.val, 0);
    // Fatia B: Faturas de cartão de crédito pagas nos meses anteriores
    const fatPagos = (S.faturasCartao || []).filter(f => f.mes === ym).reduce((s,f) => s + (Number(f.valorPago) || 0), 0);
    const inv = (S.investimentos || []).filter(i => (i.dataInicio||'').slice(0,7) === ym).reduce((s,i) => s + (i.valorInicial || 0), 0);
    const saldoDoMes = rec - gasPagos - fatPagos - inv;
    acumulado += saldoDoMes;
  }
  return Math.max(0, Math.round(acumulado * 100) / 100); // Sobra positiva acumula para os meses posteriores
}

function calcTotais(){
  const rec = receitasDoMes(), gas = gastosDoMes().filter(g => !g.negociado && !g.canceladaNegativacao);
  const totalRec = Math.round(rec.reduce((s,r) => s + r.val, 0) * 100) / 100;
  
  // Total das faturas de cartões de crédito ativas no mês atual (evita poluição da lista avulsa e soma direta)
  let totalFaturasCartao = 0;
  (S.cartoes || []).filter(c => c.ativo !== false).forEach(c => {
    const fatReg = (S.faturasCartao || []).find(f => f.cartaoId === c.id && f.mes === mesAtual);
    // Faturas negativadas saem dos gastos operacionais e compõem o saldo na aba Dívidas
    if (fatReg && (fatReg.negativada || fatReg.migradoDivida)) {
      return;
    }

    const f = calcularFaturaMes(c.id, mesAtual);
    const mesSeguinte = adicionarMesesYM(mesAtual, 1);
    const fatSeguinte = (S.faturasCartao || []).find(f => f.cartaoId === c.id && f.mes === mesSeguinte);
    const foiRolada = Boolean((fatReg && fatReg.roladoParaProxima) || (fatSeguinte && Number(fatSeguinte.rotativoRolado) > 0));

    if (foiRolada) {
      // Se rolada: o gasto do mês = valorTotalFatura MENOS o saldo que foi rolado para o mês seguinte (ou seja: valorPago)
      const saldoRolado = (fatSeguinte && (fatSeguinte.rotativoDetalhe?.saldoAnterior || fatSeguinte.rotativoDetalhe?.principal)) || Number(fatReg?.saldoRestante) || 0;
      const gastoMes = Math.max(0, Math.round((f.valorTotalFatura - saldoRolado) * 100) / 100);
      totalFaturasCartao += gastoMes;
    } else {
      // Caso contrário (não rolada): se acumulou automaticamente do mês anterior, o principal do mês anterior
      // já foi computado na competência anterior. O que adiciona no mês corrente são estritamente os ENCARGOS de juros
      let gastoMes = f.valorTotalFatura;
      if (f.rotativoItem && f.rotativoItem.automatico) {
        const principalAcumulado = Number(f.rotativoItem.detalhe?.principal || f.rotativoItem.detalhe?.saldoAnterior || 0);
        gastoMes = Math.max(0, Math.round((f.valorTotalFatura - principalAcumulado) * 100) / 100);
      }
      totalFaturasCartao += gastoMes;
    }
  });
  totalFaturasCartao = Math.round(totalFaturasCartao * 100) / 100;

  const totalGas = Math.round((gas.reduce((s,g) => s + g.val, 0) + totalFaturasCartao) * 100) / 100;
  
  // Aportes de investimentos no mês
  const invMes = investimentosDoMes(mesAtual);
  const totalInv = Math.round(invMes.reduce((s,i) => s + (i.valorInicial || 0), 0) * 100) / 100;
  
  const gasRec = Math.round(gas.filter(g => g.cat === 'recorrente').reduce((s,g) => s + g.val, 0) * 100) / 100;
  const gasLaz = Math.round(gas.filter(g => g.cat === 'lazer').reduce((s,g) => s + g.val, 0) * 100) / 100;
  const gasNP = Math.round(gas.filter(g => g.cat === 'nao_planejado').reduce((s,g) => s + g.val, 0) * 100) / 100;
  const gasVg = Math.round(gas.filter(g => g.cat === 'viagem').reduce((s,g) => s + g.val, 0) * 100) / 100;
  
  const abertas = S.dividas.filter(d => !d.quitada);
  const totalDiv = Math.round(abertas.reduce((s,d) => s + saldoRestante(d), 0) * 100) / 100;
  const custoJuros = Math.round(abertas.filter(d => !d.acordo).reduce((s,d) => s + (d.saldo * (d.juros/100)), 0) * 100) / 100;
  
  // Saldo líquido do mês corrente: Receitas - Gastos - Aportes
  const saldoMes = Math.round((totalRec - totalGas - totalInv) * 100) / 100;
  
  // Sobras acumuladas de meses anteriores
  const saldoAnterior = calcSaldoAcumuladoAnterior(mesAtual);
  
  // Saldo total disponível (regime misto legado)
  const saldoDisp = Math.round((saldoMes + saldoAnterior) * 100) / 100;

  // FATIA B: MÉTRICAS DE FLUXO DE CAIXA REAL EM TEMPO REAL ("PAINEL VERDINHO")
  // 1. Disponível total em caixa (receitas do mês + sobras de caixa anteriores)
  const totalDisponivel = Math.round((totalRec + saldoAnterior) * 100) / 100;

  // 2. Gastos avulsos marcados como pagos até o momento
  const gastosPagos = Math.round(gas.filter(g => g.pago).reduce((s,g) => s + g.val, 0) * 100) / 100;

  // 3. Faturas de cartões de crédito pagas ou parcialmente pagas no mês
  const faturasPagas = Math.round((S.cartoes || []).filter(c => c.ativo !== false).reduce((s,c) => {
    const fReg = (S.faturasCartao || []).find(f => f.cartaoId === c.id && f.mes === mesAtual);
    return s + (fReg && (fReg.pago || fReg.pagoParcial) ? (Number(fReg.valorPago) || 0) : 0);
  }, 0) * 100) / 100;

  // 4. Total de saídas efetivas realizadas da conta (gastos pagos + faturas pagas + aportes)
  const totalPago = Math.round((gastosPagos + faturasPagas + totalInv) * 100) / 100;

  // 5. Saldo em Caixa Real em Tempo Real ("Painel Verdinho")
  const saldoCaixaReal = Math.round((totalDisponivel - totalPago) * 100) / 100;

  // 6. Gastos avulsos em aberto (pendentes)
  const gastosAbertos = Math.round(gas.filter(g => !g.pago).reduce((s,g) => s + g.val, 0) * 100) / 100;

  // 7. Faturas de cartões em aberto (saldo pendente de quitação no mês atual)
  const faturasAbertas = Math.round((S.cartoes || []).filter(c => c.ativo !== false).reduce((s, c) => {
    const fReg = (S.faturasCartao || []).find(f => f.cartaoId === c.id && f.mes === mesAtual);
    if (fReg && (fReg.negativada || fReg.migradoDivida)) return s;

    const f = calcularFaturaMes(c.id, mesAtual);
    const pago = fReg ? (Number(fReg.valorPago) || 0) : 0;

    const mesSeguinte = adicionarMesesYM(mesAtual, 1);
    const fatSeguinte = (S.faturasCartao || []).find(f => f.cartaoId === c.id && f.mes === mesSeguinte);
    const foiRolada = Boolean((fReg && (fReg.roladoParaProxima || fReg.liquidadaPorRolagem)) || (fatSeguinte && Number(fatSeguinte.rotativoRolado) > 0));

    if (foiRolada) {
      // Se foi rolada para o próximo mês: o saldo rolado NÃO é mais desembolso pendente no mês atual
      const saldoRolado = (fatSeguinte && (fatSeguinte.rotativoDetalhe?.saldoAnterior || fatSeguinte.rotativoDetalhe?.principal)) || Number(fReg?.saldoRestante) || 0;
      const abertoMes = Math.max(0, Math.round((f.valorTotalFatura - pago - saldoRolado) * 100) / 100);
      return s + abertoMes;
    } else {
      let valorBaseFatura = f.valorTotalFatura;
      if (f.rotativoItem && f.rotativoItem.automatico) {
        const principalAcumulado = Number(f.rotativoItem.detalhe?.principal || f.rotativoItem.detalhe?.saldoAnterior || 0);
        valorBaseFatura = Math.max(0, Math.round((f.valorTotalFatura - principalAcumulado) * 100) / 100);
      }
      const abertoMes = Math.max(0, Math.round((valorBaseFatura - pago) * 100) / 100);
      return s + abertoMes;
    }
  }, 0) * 100) / 100;

  // 8. Total pendente a pagar no mês
  const totalPendente = Math.round((gastosAbertos + faturasAbertas) * 100) / 100;

  // 9. Previsão de sobra final do mês (Saldo Projetado)
  // Invariante estrita da ADR-002: saldoProjetado === saldoCaixaReal - totalPendente
  const saldoProjetado = Math.round((saldoCaixaReal - totalPendente) * 100) / 100;
  
  return {
    totalRec, totalGas, totalInv, totalFaturasCartao,
    gasRec, gasLaz, gasNP, gasVg,
    totalDiv, custoJuros,
    saldoMes, saldoAnterior, saldoDisp,
    // Fatia B: Caixa Real e Projeção
    totalDisponivel,
    gastosPagos,
    faturasPagas,
    totalPago,
    saldoCaixaReal,
    saldoReal: saldoCaixaReal,
    gastosAbertos,
    faturasAbertas,
    totalPendente,
    saldoProjetado
  };
}

function calcTotaisAno(anoStr){
  const ano = String(anoStr || (mesAtual ? mesAtual.slice(0,4) : new Date().getFullYear()));
  const recAno = (S.receitas || []).filter(r => (r.data||'').slice(0,4) === ano);
  const gasAno = (S.gastos || []).filter(g => (g.data||'').slice(0,4) === ano && !g.negociado && !g.canceladaNegativacao);
  const invAno = (S.investimentos || []).filter(i => (i.dataInicio||'').slice(0,4) === ano);

  const totalRec = Math.round(recAno.reduce((s,r) => s + r.val, 0) * 100) / 100;

  // Faturas de cartões de crédito nos 12 meses do ano
  let totalFaturasAno = 0;
  const cartoesAtivos = (S.cartoes || []).filter(c => c.ativo !== false);
  for (let m = 1; m <= 12; m++) {
    const ym = `${ano}-${String(m).padStart(2, '0')}`;
    cartoesAtivos.forEach(c => {
      const fatReg = (S.faturasCartao || []).find(f => f.cartaoId === c.id && f.mes === ym);
      if (fatReg && (fatReg.negativada || fatReg.migradoDivida)) {
        return;
      }
      const f = calcularFaturaMes(c.id, ym);
      const mesSeguinte = adicionarMesesYM(ym, 1);
      const fatSeguinte = (S.faturasCartao || []).find(f => f.cartaoId === c.id && f.mes === mesSeguinte);
      const foiRolada = Boolean((fatReg && fatReg.roladoParaProxima) || (fatSeguinte && Number(fatSeguinte.rotativoRolado) > 0));

      if (foiRolada) {
        const saldoRolado = (fatSeguinte && (fatSeguinte.rotativoDetalhe?.saldoAnterior || fatSeguinte.rotativoDetalhe?.principal)) || Number(fatReg?.saldoRestante) || 0;
        const gastoMes = Math.max(0, Math.round((f.valorTotalFatura - saldoRolado) * 100) / 100);
        totalFaturasAno += gastoMes;
      } else {
        let gastoMes = f.valorTotalFatura;
        if (f.rotativoItem && f.rotativoItem.automatico) {
          const principalAcumulado = Number(f.rotativoItem.detalhe?.principal || f.rotativoItem.detalhe?.saldoAnterior || 0);
          gastoMes = Math.max(0, Math.round((f.valorTotalFatura - principalAcumulado) * 100) / 100);
        }
        totalFaturasAno += gastoMes;
      }
    });
  }
  totalFaturasAno = Math.round(totalFaturasAno * 100) / 100;

  const totalGas = Math.round((gasAno.reduce((s,g) => s + g.val, 0) + totalFaturasAno) * 100) / 100;
  const totalInv = Math.round(invAno.reduce((s,i) => s + (i.valorInicial || 0), 0) * 100) / 100;

  const gasRec = Math.round(gasAno.filter(g => g.cat === 'recorrente').reduce((s,g) => s + g.val, 0) * 100) / 100;
  const gasLaz = Math.round(gasAno.filter(g => g.cat === 'lazer').reduce((s,g) => s + g.val, 0) * 100) / 100;
  const gasNP = Math.round(gasAno.filter(g => g.cat === 'nao_planejado').reduce((s,g) => s + g.val, 0) * 100) / 100;
  const gasVg = Math.round(gasAno.filter(g => g.cat === 'viagem').reduce((s,g) => s + g.val, 0) * 100) / 100;

  const abertas = S.dividas.filter(d => !d.quitada);
  const totalDiv = Math.round(abertas.reduce((s,d) => s + saldoRestante(d), 0) * 100) / 100;
  const custoJuros = Math.round(abertas.filter(d => !d.acordo).reduce((s,d) => s + (d.saldo * (d.juros/100)), 0) * 100) / 100;

  const saldoLiquido = Math.round((totalRec - totalGas - totalInv) * 100) / 100;

  return {
    ano,
    totalRec,
    totalGas,
    totalInv,
    totalFaturasAno,
    gasRec,
    gasLaz,
    gasNP,
    gasVg,
    totalDiv,
    custoJuros,
    saldoLiquido
  };
}

let modoVisaoResumo = 'mensal'; // 'mensal' | 'anual'
let anoSelecionado = new Date().getFullYear();

function setModoVisao(modo){
  modoVisaoResumo = modo;
  const btnM = document.getElementById('btn-modo-mensal');
  const btnA = document.getElementById('btn-modo-anual');
  const swM = document.getElementById('switch-mes');
  const swA = document.getElementById('switch-ano');

  if(modo === 'mensal'){
    if(btnM) btnM.classList.add('sel');
    if(btnA) btnA.classList.remove('sel');
    if(swM) swM.style.display = 'flex';
    if(swA) swA.style.display = 'none';
  } else {
    if(btnM) btnM.classList.remove('sel');
    if(btnA) btnA.classList.add('sel');
    if(swM) swM.style.display = 'none';
    if(swA) swA.style.display = 'flex';
  }
  renderResumo();
}

function mudarAno(delta){
  anoSelecionado += delta;
  const el = document.getElementById('ano-label');
  if(el) el.textContent = anoSelecionado;
  renderResumo();
}

function abrirModalDivida(){
  atualizarSelectsTipoDivida();
  openM('m-divida');
}

// ============================================================================
// RENDERIZAÇÃO FAMILIAR & DESIGN SYSTEM (Etapa 1)
// ============================================================================

function atualizarBadgesHeader() {
  if (typeof document === 'undefined') return;
  const badgeEl = document.getElementById('notif-badge-count');
  if (!badgeEl) return;

  const naoLidas = (S.notificacoes || []).filter(n => !n.lida).length;
  if (naoLidas > 0) {
    badgeEl.textContent = naoLidas > 99 ? '99+' : String(naoLidas);
    badgeEl.style.display = 'inline-flex';
  } else {
    badgeEl.style.display = 'none';
  }
}

function renderHeaderCirculo() {
  if (typeof document === 'undefined') return;

  // Círculo ativo
  const circulo = obterCirculoAtivo();
  const topNome = document.getElementById('top-circulo-nome');
  if (topNome && circulo) {
    topNome.textContent = circulo.nome;
  }

  // Membro ativo
  const membroAtivo = obterMembroAtivo();
  const avatarBtn = document.getElementById('header-avatar-btn');
  const avatarTxt = document.getElementById('header-avatar-txt');
  const avatarCrown = document.getElementById('header-avatar-crown');

  if (avatarTxt && membroAtivo) {
    avatarTxt.textContent = membroAtivo.iniciais || 'FM';
  }
  if (avatarBtn && membroAtivo) {
    avatarBtn.style.background = membroAtivo.cor || '#5581E3';
  }
  if (avatarCrown && membroAtivo) {
    avatarCrown.style.display = membroAtivo.papel === 'admin' ? 'block' : 'none';
  }

  // Badges
  atualizarBadgesHeader();
}

function renderMuralInicio() {
  if (typeof document === 'undefined') return;
  const grid = document.getElementById('grid-mural-inicio') || document.getElementById('grid-modulos-inicio');
  if (!grid) return;

  const membroAtivo = obterMembroAtivo();
  const isCrianca = membroAtivo && membroAtivo.papel === 'crianca';

  // Filtra módulos: se for perfil criança, blinda e oculta orçamento
  const modulosVisiveis = (S.modulosInicio || []).filter(modId => {
    if (isCrianca && modId === 'orcamento') return false;
    return true;
  });

  if (modulosVisiveis.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:32px 16px; background:var(--card-bg); border-radius:var(--radius); border:1px dashed var(--border2);">
        <p style="font-size:28px; margin-bottom:8px;">🎨</p>
        <p style="font-weight:700; font-size:15px; margin-bottom:4px;">Seu Mural está vazio</p>
        <p style="font-size:13px; color:var(--muted); margin-bottom:16px;">Adicione recursos para organizar a rotina e o dia a dia da família.</p>
        <button class="btn btn-primary" onclick="go('explorar')" style="max-width:220px; margin:0 auto;">Explorar Recursos</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = modulosVisiveis.map(modId => {
    const modDef = MODULOS_INICIO_CATALOGO.find(m => m.id === modId) || {
      id: modId,
      nome: modId,
      desc: 'Módulo do Círculo Familiar',
      icone: '📦',
      cor: '#5581E3',
      bgIcon: 'rgba(85,129,227,0.14)',
      telaAlvo: 'explorar'
    };

    // Card Especial do Orçamento Financeiro
    if (modDef.id === 'orcamento') {
      const totais = calcTotais();
      const corSaldo = (totais.saldoCaixaReal ?? totais.saldoReal) < 0 ? 'var(--red)' : 'var(--green)';
      return `
        <div class="modulo-card card" style="grid-column: 1 / -1; cursor:pointer;" onclick="go('resumo')">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="modulo-icon-bubble" style="background:${modDef.bgIcon}; font-size:22px;">
                ${modDef.icone}
              </div>
              <div>
                <p style="font-weight:700; font-size:16px; margin:0;">${escapeHtml(modDef.nome)}</p>
                <p style="font-size:12px; color:var(--muted); margin:0;">Visão financeira consolidada</p>
              </div>
            </div>
            <span style="font-size:12px; color:var(--blue); font-weight:700;">Ver Detalhes →</span>
          </div>

          <div style="background:var(--bg3); border-radius:var(--radius-sm); padding:12px; display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:8px;">
            <div>
              <p style="font-size:11px; color:var(--muted); margin:0 0 2px;">Saldo em Caixa Real</p>
              <p style="font-size:18px; font-weight:800; color:${corSaldo}; margin:0;">${fmt(totais.saldoCaixaReal ?? totais.saldoReal)}</p>
            </div>
            <div>
              <p style="font-size:11px; color:var(--muted); margin:0 0 2px;">Receitas do Mês</p>
              <p style="font-size:15px; font-weight:700; color:var(--green); margin:0;">${fmt(totais.totalRec)}</p>
            </div>
          </div>
        </div>
      `;
    }

    // Cards Padrão do Grid Familiar
    return `
      <div class="modulo-card card" style="cursor:pointer;" onclick="go('${modDef.telaAlvo || 'explorar'}')">
        <div class="modulo-icon-bubble" style="background:${modDef.bgIcon};">
          ${modDef.icone}
        </div>
        <p class="modulo-card-title">${escapeHtml(modDef.nome)}</p>
        <p class="modulo-card-desc">${escapeHtml(modDef.desc)}</p>
      </div>
    `;
  }).join('');
}

function renderAbaExplorar() {
  if (typeof document === 'undefined') return;
  const grid = document.getElementById('lista-modulos-explorar') || document.getElementById('grid-catalogo-explorar');
  if (!grid) return;

  grid.innerHTML = MODULOS_INICIO_CATALOGO.map(modDef => {
    const estaNoInicio = (S.modulosInicio || []).includes(modDef.id);
    const badgeTipo = modDef.categoria === 'essencial'
      ? '<span style="background:rgba(16,185,129,0.15); color:var(--green); font-size:10px; font-weight:700; padding:2px 6px; border-radius:10px;">Essencial</span>'
      : '<span style="background:rgba(85,129,227,0.15); color:var(--blue); font-size:10px; font-weight:700; padding:2px 6px; border-radius:10px;">Avançado</span>';

    return `
      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; margin-bottom:10px;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <div class="modulo-icon-bubble" style="background:${modDef.bgIcon};">
              ${modDef.icone}
            </div>
            ${badgeTipo}
          </div>
          <p style="font-weight:700; font-size:15px; margin-bottom:4px;">${escapeHtml(modDef.nome)}</p>
          <p style="font-size:12px; color:var(--muted); line-height:1.4; margin-bottom:12px;">${escapeHtml(modDef.desc)}</p>
        </div>

        <div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="btn ${estaNoInicio ? 'btn-primary' : ''}" style="flex:1; padding:8px; font-size:12px;" onclick="toggleModuloInicio('${modDef.id}')">
              ${estaNoInicio ? '✓ No Mural' : '+ Fixar no Mural'}
            </button>
            ${estaNoInicio ? `
              <button class="btn" style="padding:8px 10px; font-size:11px;" title="Mover para cima" onclick="reordenarModuloInicio('${modDef.id}', 'up')">▲</button>
              <button class="btn" style="padding:8px 10px; font-size:11px;" title="Mover para baixo" onclick="reordenarModuloInicio('${modDef.id}', 'down')">▼</button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderMinhaFamilia() {
  if (typeof document === 'undefined') return;

  const circulo = obterCirculoAtivo();
  const boxNome = document.getElementById('fam-circulo-nome-box');
  if (boxNome && circulo) boxNome.textContent = circulo.nome;

  const tagCod = document.getElementById('fam-codigo-tag');
  if (tagCod && circulo) tagCod.textContent = circulo.codigoConvite ? `Código: ${circulo.codigoConvite}` : 'Código Ativo';

  const conviteCodigo = document.getElementById('familia-codigo-convite-card') || document.getElementById('cv-codigo-txt');
  if (conviteCodigo && circulo) {
    conviteCodigo.textContent = circulo.codigoConvite || 'FAM-INICIO';
  }

  // Pílulas de simulação de membro ativo
  const pillsEl = document.getElementById('seletor-membro-ativo-pills');
  if (pillsEl) {
    pillsEl.innerHTML = (S.membrosPerfil || []).map(m => {
      const isAtivo = m.id === S.membroAtivoId;
      return `<button type="button" class="filtro-pill ${isAtivo ? 'sel' : ''}" style="${isAtivo ? 'background:var(--primary);color:#fff;' : ''}" onclick="alternarMembroAtivo('${m.id}')">${escapeHtml(m.nome)} (${m.papel})</button>`;
    }).join('');
  }

  const listaMembros = document.getElementById('lista-membros-familia');
  if (listaMembros) {
    listaMembros.innerHTML = (S.membrosPerfil || []).map(m => {
      const isAtivo = m.id === S.membroAtivoId;
      const papelLabel = m.papel === 'admin' ? 'Administrador' : m.papel === 'crianca' ? 'Criança (Protegido)' : 'Membro Familiar';
      const papelCor = m.papel === 'admin' ? 'var(--blue)' : m.papel === 'crianca' ? 'var(--green)' : 'var(--muted)';

      return `
        <div class="card" style="margin-bottom:10px; border:${isAtivo ? '2px solid var(--blue)' : '1px solid var(--border)'};">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:44px; height:44px; border-radius:50%; background:${m.cor || '#5581E3'}; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:15px; position:relative;">
                ${escapeHtml(m.iniciais || 'FM')}
                ${m.papel === 'admin' ? '<span style="position:absolute; top:-4px; right:-4px; font-size:12px;">👑</span>' : ''}
              </div>
              <div>
                <p style="font-weight:700; font-size:15px; margin:0 0 2px;">
                  ${escapeHtml(m.nome)}
                  ${isAtivo ? '<span style="font-size:11px; background:var(--blue-dim); color:var(--blue); padding:2px 6px; border-radius:10px; font-weight:700; margin-left:6px;">Você</span>' : ''}
                </p>
                <p style="font-size:12px; color:${papelCor}; font-weight:600; margin:0;">${papelLabel}</p>
                ${m.aniversario ? `<p style="font-size:11px; color:var(--muted); margin:2px 0 0;">🎂 Aniversário: ${escapeHtml(m.aniversario)}</p>` : ''}
              </div>
            </div>

            <div style="display:flex; gap:6px; align-items:center;">
              ${!isAtivo ? `<button class="btn" style="padding:6px 10px; font-size:11px;" onclick="alternarMembroAtivo('${m.id}')">Ativar</button>` : ''}
              <button class="btn" style="padding:6px 10px; font-size:11px;" onclick="abrirModalMembro('${m.id}')">Editar</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function filtrarAtividadeTipo(tipo) {
  filtrarAtividadeFeed(tipo);
}

function filtrarAtividadeFeed(tipo) {
  filtroAtividadeAtual = tipo;
  if (typeof document !== 'undefined') {
    const idMap = {
      todos: 'flt-ativ-todos',
      financas: 'flt-ativ-financas',
      financeiro: 'flt-ativ-financas',
      listas: 'flt-ativ-listas',
      lista: 'flt-ativ-listas',
      eventos: 'flt-ativ-eventos',
      evento: 'flt-ativ-eventos',
      sistema: 'flt-ativ-sistema'
    };

    ['flt-ativ-todos', 'flt-ativ-financas', 'flt-ativ-listas', 'flt-ativ-eventos', 'flt-ativ-sistema'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.classList.remove('sel');
    });

    const targetId = idMap[tipo] || 'flt-ativ-todos';
    const activeBtn = document.getElementById(targetId);
    if (activeBtn) activeBtn.classList.add('sel');

    document.querySelectorAll('#filtros-feed-atividade button').forEach(btn => {
      if (btn.dataset.tipo === tipo) {
        btn.classList.add('active');
        btn.style.background = 'var(--blue)';
        btn.style.color = '#fff';
      } else {
        btn.classList.remove('active');
        btn.style.background = 'var(--bg3)';
        btn.style.color = 'var(--text)';
      }
    });
  }
  renderAtividadeFeed();
}

function renderAtividadeFeed() {
  if (typeof document === 'undefined') return;
  const feed = document.getElementById('lista-atividade-feed') || document.getElementById('feed-atividade-lista');
  if (!feed) return;

  const itens = obterFeedAtividade(filtroAtividadeAtual);

  if (itens.length === 0) {
    feed.innerHTML = `
      <div style="text-align:center; padding:32px 16px; color:var(--muted);">
        <p style="font-size:28px; margin-bottom:8px;">⚡</p>
        <p style="font-weight:600; font-size:14px;">Nenhuma atividade recente registrada.</p>
        <p style="font-size:12px;">Gastos, receitas, recados e tarefas aparecerão aqui.</p>
      </div>
    `;
    return;
  }

  feed.innerHTML = itens.map(n => {
    const icone = (n.tipo === 'financas' || n.tipo === 'financeiro') ? '💰' : (n.tipo === 'listas' || n.tipo === 'lista') ? '🛒' : (n.tipo === 'documentos') ? '📂' : '🔔';
    const corBg = (n.tipo === 'financas' || n.tipo === 'financeiro') ? 'rgba(16,185,129,0.14)' : 'rgba(85,129,227,0.14)';
    const dataObj = n.criadoEm ? new Date(n.criadoEm) : new Date();
    const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    return `
      <div class="card" style="margin-bottom:8px; padding:12px; display:flex; gap:12px; align-items:flex-start; ${!n.lida ? 'border-left: 3px solid var(--blue);' : ''}">
        <div style="width:36px; height:36px; border-radius:50%; background:${corBg}; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0;">
          ${icone}
        </div>
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <p style="font-weight:700; font-size:14px; margin:0 0 2px;">${escapeHtml(n.titulo)}</p>
            <span style="font-size:11px; color:var(--muted);">${dataFormatada} às ${horaFormatada}</span>
          </div>
          <p style="font-size:13px; color:var(--text); margin:0; line-height:1.35;">${escapeHtml(n.texto)}</p>
        </div>
      </div>
    `;
  }).join('');
}

// RENDER PRINCIPAL
function render(){
  processarInadimplencia60Dias();
  if (typeof document === 'undefined' || !document.getElementById || !document.getElementById('app') || typeof document.querySelector !== 'function') return;

  // Renderizações do Círculo Familiar (Etapa 1)
  aplicarTema(S.tema || 'claro');
  renderHeaderCirculo();
  renderMuralInicio();
  renderAbaExplorar();
  renderMinhaFamilia();
  renderAtividadeFeed();

  // Renderizações Contábeis Legadas (Zero Regressão)
  atualizarDatalistTitulares();
  atualizarSelectsTipoDivida();
  renderCategoriasModalGasto();
  updateMesLabel();
  renderCartoesTopo();
  renderMetas(); // Atualiza m.atual
  renderResumo();
  renderReceitas();
  renderGastos();
  renderDividas();
  renderConfig();
}

function renderResumo(){
  const $=id=>document.getElementById(id);
  
  if (modoVisaoResumo === 'anual') {
    const tAno = calcTotaisAno(anoSelecionado);
    const anoLbl = $('ano-label');
    if(anoLbl) anoLbl.textContent = anoSelecionado;
    
    const sc = tAno.saldoLiquido < 0 ? 'c-red' : 'c-green';
    const lblSaldo = $('lbl-saldo-disp');
    if(lblSaldo) lblSaldo.textContent = `Saldo Líquido Anual (${anoSelecionado})`;
    const badgeCaixa = $('badge-caixa-status');
    if(badgeCaixa) badgeCaixa.style.display = 'none';
    const blocoProj = $('bloco-projecao-mes');
    if(blocoProj) blocoProj.style.display = 'none';

    if($('saldo-disp')) {
      $('saldo-disp').textContent = fmt(tAno.saldoLiquido);
      $('saldo-disp').className = 'big-num ' + sc;
    }

    const txtSaldoMes = $('txt-saldo-mes');
    if(txtSaldoMes) txtSaldoMes.textContent = `Receitas: ${fmt(tAno.totalRec)} • Gastos: ${fmt(tAno.totalGas)} • Aportes: ${fmt(tAno.totalInv)}`;
    const txtSaldoAnt = $('txt-saldo-anterior');
    if(txtSaldoAnt) txtSaldoAnt.style.display = 'none';

    const pctUsado = tAno.totalRec > 0 ? Math.min(100, Math.round(((tAno.totalGas + tAno.totalInv) / tAno.totalRec) * 100)) : 0;
    const pctLivre = Math.max(0, 100 - pctUsado);
    const fc = pctUsado >= 100 ? 'var(--red)' : pctUsado > 70 ? 'var(--yellow)' : 'var(--green)';
    if($('meter-fill')) {
      $('meter-fill').style.width = pctLivre + '%';
      $('meter-fill').style.background = fc;
    }
    if($('meter-tip')) {
      $('meter-tip').textContent = tAno.totalRec > 0 
        ? `${pctUsado}% da receita anual comprometida — saldo líquido de ${fmt(tAno.saldoLiquido)}`
        : 'Cadastre receitas no ano para acompanhar o progresso.';
    }

    if($('r-rec')) $('r-rec').textContent = fmt(tAno.totalRec);
    if($('r-gas')) $('r-gas').textContent = fmt(tAno.totalGas);
    if($('r-fix')) $('r-fix').textContent = fmt(tAno.gasRec);
    if($('r-div')) $('r-div').textContent = fmt(tAno.totalDiv);
    const rInv = $('r-inv');
    if(rInv) rInv.textContent = fmt(tAno.totalInv);
    const rLiq = $('r-liq');
    if(rLiq) {
      rLiq.textContent = fmt(tAno.saldoLiquido);
      rLiq.className = 'mc-val ' + (tAno.saldoLiquido < 0 ? 'c-red' : 'c-green');
    }

    if($('alerta-box')) {
      $('alerta-box').innerHTML = tAno.saldoLiquido < 0 
        ? `<div class="alert alert-r">⚠️ No consolidado de ${anoSelecionado}, os gastos e aportes superam a receita em ${fmt(Math.abs(tAno.saldoLiquido))}.</div>` 
        : '';
    }

    const cardPrio = $('card-prio-lista');
    if(cardPrio) cardPrio.style.display = 'none';

  } else {
    // Modo Mensal: Painel de Caixa Real em Tempo Real ("Painel Verdinho")
    const t = calcTotais();
    const lblSaldo = $('lbl-saldo-disp');
    if(lblSaldo) lblSaldo.textContent = '🟢 Saldo em Caixa (Tempo Real)';
    const badgeCaixa = $('badge-caixa-status');
    if(badgeCaixa) badgeCaixa.style.display = 'inline-block';
    const blocoProj = $('bloco-projecao-mes');
    if(blocoProj) blocoProj.style.display = 'flex';

    // Se >= 0, verde destacado (c-green); se < 0, vermelho (c-red)
    const sc = t.saldoCaixaReal < 0 ? 'c-red' : 'c-green';
    if($('saldo-disp')) {
      $('saldo-disp').textContent = fmt(t.saldoCaixaReal);
      $('saldo-disp').className = 'big-num ' + sc;
    }

    // Sub-texto claro: Receitas + Sobras vs Já Pago
    const txtSaldoMes = $('txt-saldo-mes');
    if(txtSaldoMes) txtSaldoMes.textContent = `Receitas + Sobras: ${fmt(t.totalDisponivel)} • Já Pago: -${fmt(t.totalPago)}`;
    
    const txtSaldoAnt = $('txt-saldo-anterior');
    if(txtSaldoAnt) {
      if(t.saldoAnterior > 0) {
        txtSaldoAnt.textContent = `Sobras passadas: +${fmt(t.saldoAnterior)}`;
        txtSaldoAnt.style.display = 'inline';
      } else {
        txtSaldoAnt.style.display = 'none';
      }
    }

    // Barra de progresso: porcentagem do recurso disponível ainda no caixa real
    if($('meter-fill')) {
      if(t.totalDisponivel > 0) {
        const pctLivre = Math.max(0, Math.min(100, Math.round((t.saldoCaixaReal / t.totalDisponivel) * 100)));
        const fc = t.saldoCaixaReal < 0 ? 'var(--red)' : pctLivre < 20 ? 'var(--yellow)' : 'var(--green)';
        $('meter-fill').style.width = pctLivre + '%';
        $('meter-fill').style.background = fc;
        if($('meter-tip')) {
          $('meter-tip').textContent = t.saldoCaixaReal < 0
            ? `⚠️ Caixa negativo — saídas pagas excedem o disponível em ${fmt(Math.abs(t.saldoCaixaReal))}`
            : `${pctLivre}% do dinheiro disponível ainda em caixa (${fmt(t.saldoCaixaReal)})`;
        }
      } else {
        $('meter-fill').style.width = '0%';
        if($('meter-tip')) $('meter-tip').textContent = 'Cadastre sua receita para começar';
      }
    }

    // Bloco de Projeção do Mês (Contas e Faturas Pendentes vs Previsão de Sobra Final)
    const txtPendente = $('txt-total-pendente');
    if(txtPendente) txtPendente.textContent = fmt(t.totalPendente);
    const txtProj = $('txt-saldo-projetado');
    if(txtProj) {
      txtProj.textContent = fmt(t.saldoProjetado);
      txtProj.style.color = t.saldoProjetado < 0 ? 'var(--red)' : 'var(--green)';
    }

    if($('r-rec')) $('r-rec').textContent = fmt(t.totalRec);
    if($('r-gas')) $('r-gas').textContent = fmt(t.totalGas);
    if($('r-fix')) $('r-fix').textContent = fmt(t.gasRec);
    if($('r-div')) $('r-div').textContent = fmt(t.totalDiv);
    const rInv = $('r-inv');
    if(rInv) rInv.textContent = fmt(t.totalInv);
    const rLiq = $('r-liq');
    if(rLiq) {
      rLiq.textContent = fmt(t.saldoMes);
      rLiq.className = 'mc-val ' + (t.saldoMes < 0 ? 'c-red' : 'c-green');
    }

    let alertHtml = '';
    if(t.saldoCaixaReal < 0) {
      alertHtml = `<div class="alert alert-r">⚠️ Saldo em caixa negativo em ${fmt(Math.abs(t.saldoCaixaReal))}! Os pagamentos efetuados superam os recursos disponíveis.</div>`;
    } else if(t.saldoProjetado < 0) {
      alertHtml = `<div class="alert alert-y">💡 Atenção: você tem ${fmt(t.saldoCaixaReal)} em caixa, mas as contas pendentes (${fmt(t.totalPendente)}) levarão a um déficit projetado de ${fmt(Math.abs(t.saldoProjetado))} ao fim do mês.</div>`;
    } else if(t.saldoMes < 0 && t.saldoDisp >= 0) {
      alertHtml = `<div class="alert alert-y">💡 Gastos do mês superaram a receita, mas você foi coberto pela sobra de meses anteriores (+${fmt(t.saldoAnterior)}).</div>`;
    }
    if($('alerta-box')) $('alerta-box').innerHTML = alertHtml;

    // Prioridades
    const prios = [];
    const abertas = S.dividas.filter(d => !d.quitada);
    const cartoes = abertas.filter(d => d.tipo === 'cartao' && !d.acordo).sort((a,b) => b.juros - a.juros);
    const emps = abertas.filter(d => d.tipo !== 'cartao' && !d.acordo).sort((a,b) => b.juros - a.juros);
    const acordos = abertas.filter(d => d.acordo);
    if(t.saldoProjetado < 0) prios.push({ c: 'r', tag: '🔴 Urgente', nome: 'Receita insuficiente', det: `Corte ${fmt(Math.abs(t.saldoProjetado))} em gastos para equilibrar o mês.` });
    cartoes.forEach(d => prios.push({ c: 'r', tag: '🔴 Pagar primeiro', nome: d.credor + ' (cartão)', det: `${d.juros}%/mês = ${fmt(d.saldo * (d.juros / 100))} em juros/mês. Use todo saldo livre.` }));
    emps.forEach((d,i) => prios.push({ c: i === 0 ? 'y' : 'g', tag: i === 0 ? '🟡 Em seguida' : '🟢 Manter parcela', nome: d.credor + (d.tipo === 'emprestimo_pf' ? ' (empréstimo PF)' : ' (empréstimo)'), det: `${d.juros}%/mês${d.parcela ? ' — parcela ' + fmt(d.parcela) : ''}. Mantenha em dia.` }));
    acordos.forEach(d => {
      const prox = d.acordo.parcelas.find(p => !p.paga);
      const pagas = d.acordo.parcelas.filter(p => p.paga).length;
      prios.push({ c: 'y', tag: '🤝 Acordo em andamento', nome: d.credor, det: prox ? `Parcela ${prox.num}/${d.acordo.numParcelas} de ${fmt(prox.valor)} — pague e marque como paga na aba Dívidas.` : `${pagas}/${d.acordo.numParcelas} parcelas pagas.` });
    });
    if(t.gasLaz > t.totalRec * 0.15 && t.totalRec > 0) prios.push({ c: 'y', tag: '🟡 Reduzir', nome: 'Lazer acima do ideal', det: `${fmt(t.gasLaz)} em lazer — limite saudável é ${fmt(t.totalRec * 0.15)} (15% da renda).` });
    if(t.gasNP > 0) prios.push({ c: 'g', tag: '🟢 Monitorar', nome: 'Gastos imprevistos', det: `${fmt(t.gasNP)} este mês. Analise o que pode evitar.` });

    const classMap = { r: 'prio prio-r', y: 'prio prio-y', g: 'prio prio-g' };
    if($('prio-lista')) {
      $('prio-lista').innerHTML = prios.length
        ? prios.slice(0,5).map(p => `<div class="${classMap[p.c]}"><p class="prio-tag">${p.tag}</p><p class="prio-name">${p.nome}</p><p class="prio-detail">${p.det}</p></div>`).join('')
        : '<p style="font-size:13px;color:var(--muted);">Cadastre gastos e dívidas para ver as prioridades.</p>';
    }

    const cardPrio = $('card-prio-lista');
    if(cardPrio) cardPrio.style.display = 'block';
  }

  // Metas
  const metasContainer = $('dashboard-metas');
  if(metasContainer){
    if(S.metas.length > 0) {
      metasContainer.innerHTML = S.metas.map(m => {
        const pct = Math.min(100, Math.round((m.atual / m.total) * 100));
        return `<div style="margin-bottom:10px;">
          <div class="prog-row" style="margin-bottom:2px;"><span style="font-weight:600;color:var(--text);">${escapeHtml(m.nome)}</span><span>${pct}%</span></div>
          <div class="prog-row" style="font-size:11px;"><span>${fmt(m.atual)} de ${fmt(m.total)}</span></div>
          <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;"></div></div>
        </div>`;
      }).join('');
      $('dashboard-metas-container').style.display = 'block';
    } else {
      $('dashboard-metas-container').style.display = 'none';
    }
  }

  // Renderiza gráfico
  renderChart();
}

let resumoChart = null;
function renderChart() {
  const ctx = document.getElementById('chart-resumo');
  if (!ctx || typeof Chart === 'undefined') return;

  const mesesStr = [];
  const dadosRec = [];
  const dadosGas = [];
  
  if (modoVisaoResumo === 'anual') {
    const ano = String(anoSelecionado || new Date().getFullYear());
    for (let m = 1; m <= 12; m++) {
      const ym = ano + '-' + String(m).padStart(2, '0');
      mesesStr.push(mesLabel(ym).substring(0,3));
      const recMes = (S.receitas || []).filter(r => (r.data||'').slice(0,7) === ym).reduce((s,r) => s + r.val, 0);
      const gasMes = (S.gastos || []).filter(g => (g.dataOriginal||g.data||'').slice(0,7) === ym && !g.negociado).reduce((s,g) => s + g.val, 0);
      dadosRec.push(recMes);
      dadosGas.push(gasMes);
    }
  } else {
    const [anoAtual, mesAtualNum] = mesAtual.split('-').map(Number);
    for (let i = 11; i >= 0; i--) {
      const d = new Date(anoAtual, mesAtualNum - 1 - i, 1);
      const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      mesesStr.push(mesLabel(ym).substring(0,3) + '/' + String(d.getFullYear()).substring(2,4));
      
      const recMes = (S.receitas || []).filter(r => (r.data||'').slice(0,7) === ym).reduce((s,r) => s + r.val, 0);
      const gasMes = (S.gastos || []).filter(g => (g.dataOriginal||g.data||'').slice(0,7) === ym && !g.negociado).reduce((s,g) => s + g.val, 0);
      
      dadosRec.push(recMes);
      dadosGas.push(gasMes);
    }
  }

  if (resumoChart) {
    resumoChart.destroy();
  }

  Chart.defaults.color = '#888';
  Chart.defaults.font.family = '-apple-system, sans-serif';

  resumoChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: mesesStr,
      datasets: [
        { label: 'Receitas', data: dadosRec, borderColor: '#4ade80', backgroundColor: 'rgba(74,222,128,0.1)', fill: true, tension: 0.3, borderWidth: 2, pointRadius: 2 },
        { label: 'Gastos', data: dadosGas, borderColor: '#f87171', backgroundColor: 'rgba(248,113,113,0.1)', fill: true, tension: 0.3, borderWidth: 2, pointRadius: 2 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } },
        tooltip: { mode: 'index', intersect: false, callbacks: { label: (ctx) => ctx.dataset.label + ': ' + fmt(ctx.parsed.y) } }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: (v) => 'R$' + (v>=1000 ? (v/1000)+'k' : v) } },
        x: { grid: { display: false } }
      }
    }
  });
}

function renderReceitas(){
  renderFiltroTitulares('filtro-titular-receitas', filtroTitularReceita, 'setFiltroTitularReceita');
  const el=document.getElementById('lista-receitas');
  const todas=receitasDoMes();
  const lista=todas.filter(r => filtroTitularReceita === 'todos' || r.titular === filtroTitularReceita);
  if(!lista.length){
    el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhuma receita encontrada para este mês.</p>';
    return;
  }
  const total=lista.reduce((s,r)=>s+r.val,0);
  el.innerHTML=lista.map(r=>{
    const titBadge = r.titular ? `<span class="badge b-titular">${escapeHtml(r.titular)}</span>` : '';
    return `<div class="item-row">
      <div style="flex:1;display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
        <span class="item-name">${escapeHtml(r.desc)}</span>
        ${titBadge}
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <span class="item-val c-green">${fmt(r.val)}</span>
        <span class="item-del" onclick="S.receitas=del(S.receitas,${r.id});save();render()">×</span>
      </div>
    </div>`;
  }).join('') + `<div class="total-row"><span>Total</span><span class="c-green">${fmt(total)}</span></div>`;
}

function renderGastos(){
  renderFiltroTitulares('filtro-titular-gastos', filtroTitularGasto, 'setFiltroTitularGasto');
  renderCartoesTopo();
  const t=calcTotais();
  const bd=document.getElementById('breakdown-gastos');
  const listaMes=gastosDoMes();

  // Coleta compras de cartões ativos na competência do mês para cálculo do breakdown
  const comprasMes = (S.comprasCartao || []).filter(c => {
    if (c.mesFatura !== mesAtual) return false;
    const cartao = (S.cartoes || []).find(x => x.id === c.cartaoId);
    if (!cartao || cartao.ativo === false) return false;
    if (filtroTitularGasto !== 'todos' && c.titular !== filtroTitularGasto) return false;
    return true;
  });

  // Soma de parcelas de anuidades ativas no mês
  let totalAnuidadeMes = 0;
  (S.cartoes || []).filter(c => {
    if (c.ativo === false) return false;
    if (filtroTitularGasto !== 'todos' && c.titular !== filtroTitularGasto) return false;
    return true;
  }).forEach(c => {
    const f = calcularFaturaMes(c.id, mesAtual);
    if (f.anuidadeItem) totalAnuidadeMes += f.valorAnuidade;
  });

  const temItensBreakdown = listaMes.length > 0 || comprasMes.length > 0 || totalAnuidadeMes > 0;
  if(bd){
    if(temItensBreakdown){
      const cats = (S.categoriasGastos || DEFAULT_CATEGORIAS_GASTOS).map(c => {
        const vGasto = listaMes.filter(g => g.cat === c.id && (filtroTitularGasto === 'todos' || g.titular === filtroTitularGasto)).reduce((s,g) => s + g.val, 0);
        const vCompras = comprasMes.filter(cp => cp.cat === c.id).reduce((s,cp) => s + (Number(cp.val) || 0), 0);
        const vAnuidade = (c.id === 'recorrente') ? totalAnuidadeMes : 0;
        const v = Math.round((vGasto + vCompras + vAnuidade) * 100) / 100;
        return { l: c.nome, v, c: c.cor || 'c-muted' };
      }).filter(c => c.v > 0);
      bd.innerHTML = cats.length ? `<div class="grid2">${cats.slice(0, 6).map(c=>`<div class="mc"><p class="mc-label">${escapeHtml(c.l)}</p><p class="mc-val ${c.c}">${fmt(c.v)}</p></div>`).join('')}</div>` : '';
    } else {
      bd.innerHTML = '';
    }
  }

  // Inadimplência acumulada de meses anteriores (contas avulsas + faturas de cartão da Fatia A)
  const inadBox = document.getElementById('inadimplencia-box');
  const inadGeral = gastosInadimplentesDoMes();
  const inadFiltrada = inadGeral.filter(g => filtroTitularGasto === 'todos' || g.titular === filtroTitularGasto);

  // Fatia A: Detecta cartões de crédito acumulando faturas em atraso não pagas do mês anterior
  const faturasAcumuladas = [];
  const mesAnt = adicionarMesesYM(mesAtual, -1);
  (S.cartoes || []).filter(c => c.ativo !== false && !c.negativado).forEach(c => {
    if (filtroTitularGasto !== 'todos' && c.titular !== filtroTitularGasto) return;
    const fAtual = calcularFaturaMes(c.id, mesAtual);
    if (fAtual.rotativoItem && fAtual.rotativoItem.automatico) {
      faturasAcumuladas.push({
        cartao: c,
        mesAnt: mesAnt,
        rotativoItem: fAtual.rotativoItem,
        val: fAtual.rotativoItem.val,
        desc: `Fatura ${c.nome} (${mesLabel(mesAnt)})`
      });
    }
  });

  if (inadBox) {
    const totalItens = inadFiltrada.length + faturasAcumuladas.length;
    if (totalItens > 0) {
      const vGastosInad = inadFiltrada.reduce((s, g) => s + g.val, 0);
      const vFaturasInad = faturasAcumuladas.reduce((s, f) => s + f.val, 0);
      const totalInad = Math.round((vGastosInad + vFaturasInad) * 100) / 100;

      inadBox.innerHTML = `
        <div class="alert alert-r" style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-weight:700;">
            <span>⚠️ Inadimplência Acumulada</span>
            <span>${fmt(totalInad)}</span>
          </div>
          <p style="font-size:12px;margin:4px 0 8px;opacity:0.9;">
            ${totalItens} pendência(s) de meses anteriores não pagas acumularam neste mês:
          </p>
          ${inadFiltrada.map(g => `
            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.3);border-radius:6px;padding:6px 8px;margin-bottom:4px;font-size:12px;">
              <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
                <strong>${escapeHtml(g.desc)}</strong>
                <span class="badge b-inad">${mesLabel((g.data||'').slice(0,7))}</span>
                ${g.titular ? `<span class="badge b-titular">${escapeHtml(g.titular)}</span>` : ''}
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="font-weight:600;color:var(--red);">${fmt(g.val)}</span>
                <button class="status-btn pendente" onclick="togglePagoGasto(${g.id})">✓ Pagar</button>
                <button class="btn-negociar" onclick="abrirModalNegociarGasto(${g.id})">🤝 Negociar</button>
              </div>
            </div>
          `).join('')}
          ${faturasAcumuladas.map(f => `
            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.3);border-radius:6px;padding:6px 8px;margin-bottom:4px;font-size:12px;">
              <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
                <strong>💳 ${escapeHtml(f.desc)}</strong>
                <span class="badge b-inad">${mesLabel(f.mesAnt)}</span>
                <span class="badge" style="background:rgba(234,179,8,0.2);color:#facc15;">+ Rotativo (${f.rotativoItem.detalhe?.taxa || 14.5}%)</span>
                ${f.cartao.titular ? `<span class="badge b-titular">${escapeHtml(f.cartao.titular)}</span>` : ''}
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="font-weight:600;color:var(--red);">${fmt(f.val)}</span>
                <button class="status-btn pendente" onclick="abrirFaturaCartao(${f.cartao.id})">👁️ Ver Fatura</button>
              </div>
            </div>
          `).join('')}
        </div>`;
    } else {
      inadBox.innerHTML = '';
    }
  }

  const el=document.getElementById('lista-gastos');
  const badges={recorrente:'b-rec',nao_planejado:'b-unp',lazer:'b-laz',viagem:'b-vg'};
  
  const previstos = gastosPrevistosDoMes().filter(g => filtroTitularGasto === 'todos' || g.titular === filtroTitularGasto);

  // Faturas consolidadas de cartões de crédito no mês (compras individuais não poluem a lista)
  const cartoesComFatura = (S.cartoes || []).filter(c => {
    if (c.ativo === false) return false;
    if (filtroTitularGasto !== 'todos' && c.titular !== filtroTitularGasto) return false;
    const fatReg = (S.faturasCartao || []).find(f => f.cartaoId === c.id && f.mes === mesAtual);
    // Se a fatura foi negativada (atraso >= 60 dias), sai de gastos e vai para a aba Dívidas
    if (fatReg && (fatReg.negativada || fatReg.migradoDivida)) return false;

    const f = calcularFaturaMes(c.id, mesAtual);
    return f.valorTotalFatura > 0 || (fatReg && fatReg.pago);
  });

  const faturasHtml = cartoesComFatura.map(c => {
    const f = calcularFaturaMes(c.id, mesAtual);
    const fatReg = (S.faturasCartao || []).find(x => x.cartaoId === c.id && x.mes === mesAtual);
    const titBadge = c.titular ? `<span class="badge b-titular">${escapeHtml(c.titular)}</span>` : '';
    let statusFatBadge = '';
    let corVal = 'c-red';
    let valExibir = f.valorTotalFatura;

    if (fatReg && fatReg.pago) {
      statusFatBadge = `<span class="badge" style="background:rgba(34,197,94,0.2);color:#4ade80;">✓ Paga</span>`;
      corVal = 'c-green';
      valExibir = fatReg.valorPago;
    } else if (fatReg && fatReg.pagoParcial) {
      statusFatBadge = `<span class="badge" style="background:rgba(234,179,8,0.2);color:#facc15;">⚠️ Parcial (${fmt(fatReg.saldoRestante)} pendente)</span>`;
      corVal = 'c-yellow';
    }

    return `<div class="item-row" style="background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.3);border-radius:10px;margin-bottom:8px;">
      <div style="flex:1;display:flex;align-items:center;flex-wrap:wrap;gap:6px;">
        <span class="item-name" style="font-weight:700;color:#c084fc;">💳 Fatura ${escapeHtml(c.nome)}</span>
        <span class="badge" style="background:rgba(139,92,246,0.25);color:#d8b4fe;">Cartão de Crédito</span>
        ${titBadge}
        ${statusFatBadge}
        <span style="font-size:11px;color:var(--muted);">Venc: dia ${c.diaVencimento || 10}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="item-val ${corVal}" style="font-weight:700;">${fmt(valExibir)}</span>
        <button class="btn" style="width:auto;padding:5px 10px;font-size:11px;background:rgba(168,85,247,0.2);color:#c084fc;border:1px solid rgba(168,85,247,0.4);" onclick="abrirFaturaCartao(${c.id})">👁️ Ver Fatura</button>
      </div>
    </div>`;
  }).join('');

  if(!previstos.length && !inadFiltrada.length && !cartoesComFatura.length){
    el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhum gasto neste mês.</p>';
    return;
  }
  
  el.innerHTML = faturasHtml + previstos.map(g=>{
    const tipoDivTxt = g.tipoDivida ? (TIPOS_DIVIDA[g.tipoDivida] || g.tipoDivida) : '';
    const origemTxt = g.origemDivida ? `${escapeHtml(g.origemDivida)} • ` : '';
    const parcBadge = g.parcelado ? `<span class="badge b-parc">${origemTxt}${tipoDivTxt ? escapeHtml(tipoDivTxt) + ' ' : ''}${g.parcelaNum}/${g.totalParcelas}</span>` : '';
    const recBadge = g.recorrente ? `<span class="badge b-rec">Fixo ${g.mesNum}/${g.totalMeses}</span>` : '';
    const titBadge = g.titular ? `<span class="badge b-titular">${escapeHtml(g.titular)}</span>` : '';
    const negociadoBadge = g.negociado ? `<span class="badge" style="background:rgba(168,85,247,0.18);color:#c084fc;border:1px solid rgba(168,85,247,0.3);">🤝 Negociado</span>` : '';
    const migradoBadge = g.migradoDivida ? `<span class="badge" style="background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.3);">🔴 Migrado p/ Dívidas</span>` : '';

    // Gastos já migrados para a aba de dívidas não exibem botões de pagar ou negociar para garantir integridade
    const statusHtml = (g.negociado || g.migradoDivida) ? '' : `<button class="status-btn ${g.pago?'pago':'pendente'}" onclick="togglePagoGasto(${g.id})">${g.pago?'✓ Pago':'⏳ Aberto'}</button>`;
    const adiantarHtml = (g.parcelado && !g.migradoDivida) ? `<button class="btn-adiantar" onclick="abrirModalAdiantar('${escapeHtml(g.grupoId)}')">⏩ Adiantar</button>` : '';
    const negociarHtml = (!g.pago && !g.negociado && !g.migradoDivida) ? `<button class="btn-negociar" onclick="abrirModalNegociarGasto(${g.id})">🤝 Negociar</button>` : '';

    return `<div class="item-row">
      <div style="flex:1;display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
        <span class="item-name">${escapeHtml(g.desc)}</span>
        <span class="badge ${badges[g.cat]||'b-rec'}">${escapeHtml(getNomeCategoria(g.cat))}</span>
        ${titBadge}
        ${parcBadge}
        ${recBadge}
        ${negociadoBadge}
        ${migradoBadge}
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <span class="item-val c-red">${fmt(g.val)}</span>
        ${statusHtml}
        ${adiantarHtml}
        ${negociarHtml}
        <span class="item-del" onclick="if(confirm('Excluir este gasto?')){S.gastos=del(S.gastos,${g.id});save();render();}">×</span>
      </div>
    </div>`;
  }).join('');
}

function renderDividas(){
  const t=calcTotais();
  document.getElementById('total-div-big').textContent=fmt(t.totalDiv);
  document.getElementById('custo-juros-txt').textContent=t.custoJuros>0?`Você perde ${fmt(t.custoJuros)} em juros por mês (${fmt(t.custoJuros*12)}/ano)`:'';
  const el=document.getElementById('lista-dividas');
  if(!S.dividas.length){el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhuma dívida cadastrada. Adicione para ver o plano de ataque.</p>';return;}

  const abertas=S.dividas.filter(d=>!d.quitada);
  const quitadas=S.dividas.filter(d=>d.quitada);
  const sorted=[...abertas].sort((a,b)=>saldoRestante(b)-saldoRestante(a));

  let html=sorted.map(d=>{
    const restante=saldoRestante(d);
    const custo=!d.acordo && d.juros ? d.saldo*(d.juros/100) : 0;
    const tipoLabel = TIPOS_DIVIDA[d.tipo] || d.tipo || 'Outro';
    const titBadge = d.titular ? `<span class="badge b-titular">${escapeHtml(d.titular)}</span>` : '';
    const negativadaBadge = d.negativada ? ` <span class="badge" style="background:rgba(239,68,68,0.2);color:#f87171;border:1px solid rgba(239,68,68,0.4);">🔴 Negativada (60+ dias)</span>` : '';
    // Fatia 5 (ADR-004): Identifica se há parcela do acordo em atraso (+30 dias)
    const atraso30Dias = d.acordo && acordoTemParcelaAtrasada30Dias(d);
    const atrasoAcordoBadge = atraso30Dias ? ` <span class="badge" style="background:rgba(239,68,68,0.2);color:#f87171;border:1px solid rgba(239,68,68,0.4);">⚠️ Parcela do Acordo em Atraso (+30 dias)</span>` : '';

    let parcelasHtml='';
    if(d.acordo){
      const pagas=d.acordo.parcelas.filter(p=>p.paga).length;
      parcelasHtml=`
        <div class="div-line"><span style="color:var(--muted);">Entrada</span><span>${fmt(d.acordo.entrada)}</span></div>
        <div class="div-line"><span style="color:var(--muted);">Parcelas pagas</span><span>${pagas}/${d.acordo.numParcelas} (${fmt(d.acordo.valorParcela)} cada)</span></div>
        <div class="parcelas-grid">${d.acordo.parcelas.map(p=>`<span class="parcela-pill ${p.paga?'pp-paga':''}" onclick="toggleParcela(${d.id},${p.num})">${p.num}</span>`).join('')}</div>
        <p style="font-size:11px;color:var(--muted);margin-top:4px;">Toque no número pra marcar/desmarcar a parcela como paga</p>
        <div style="display:flex;gap:6px;margin-top:10px;">
          <button class="btn" style="width:100%;margin:0;padding:8px 10px;font-size:12px;background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.35);cursor:pointer;" onclick="quebrarAcordo(${d.id})">⚠️ Quebrar Acordo</button>
        </div>`;
    }
    return `<div class="div-row">
      <div class="div-header">
        <span class="div-name">${escapeHtml(d.credor)}${titBadge}${negativadaBadge}${d.acordo?' <span class="badge b-rec">Acordo</span>':''}${atrasoAcordoBadge}</span>
        <span class="item-del" onclick="if(confirm('Excluir esta dívida?')){S.dividas=del(S.dividas,${d.id});save();render();}">×</span>
      </div>
      <div class="div-line"><span style="color:var(--muted);">Saldo restante</span><span class="c-red" style="font-weight:600;">${fmt(restante)}</span></div>
      ${!d.acordo && d.juros?`<div class="div-line"><span style="color:var(--muted);">Juros/mês</span><span class="c-yellow">${d.juros}% → ${fmt(custo)}/mês</span></div>`:''}
      ${!d.acordo && d.parcela?`<div class="div-line"><span style="color:var(--muted);">Parcela</span><span>${fmt(d.parcela)}</span></div>`:''}
      <div class="div-line"><span style="color:var(--muted);">Tipo</span><span>${escapeHtml(tipoLabel)}</span></div>
      ${parcelasHtml}
      ${!d.acordo?`<div style="display:flex;gap:6px;margin-top:10px;">
        <button class="btn btn-g" style="margin:0;padding:9px;font-size:12px;" onclick="marcarQuitada(${d.id})">✓ Marcar quitada</button>
        <button class="btn" style="margin:0;padding:9px;font-size:12px;" onclick="abrirAcordo(${d.id})">🤝 Fazer acordo</button>
      </div>`:''}
    </div>`;
  }).join('');

  if(quitadas.length){
    html+=`<p class="sec-title" style="margin-top:20px;font-size:14px;">✅ Dívidas quitadas</p>`;
    html+=quitadas.map(d=>{
      const titBadgeQ = d.titular ? `<span class="badge b-titular">${escapeHtml(d.titular)}</span>` : '';
      const negativadaBadgeQ = d.negativada ? ` <span class="badge" style="background:rgba(239,68,68,0.2);color:#f87171;border:1px solid rgba(239,68,68,0.4);">🔴 Negativada (60+ dias)</span>` : '';
      return `<div class="div-row" style="opacity:0.65;">
        <div class="div-header">
          <span class="div-name">${escapeHtml(d.credor)}${titBadgeQ}${negativadaBadgeQ}</span>
          <span class="item-del" onclick="if(confirm('Excluir este registro?')){S.dividas=del(S.dividas,${d.id});save();render();}">×</span>
        </div>
        <div class="div-line"><span style="color:var(--muted);">Valor quitado</span><span class="c-green" style="font-weight:600;">${fmt(d.valorQuitado||0)}</span></div>
        <div class="div-line"><span style="color:var(--muted);">Data</span><span>${escapeHtml(d.dataQuitacao||'-')}</span></div>
      </div>`;
    }).join('');
  }

  el.innerHTML=html || '<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhuma dívida em aberto. 🎉</p>';
}

const TIPO_INV_LABELS = { caixinha: 'Caixinha/Poupança', cdb: 'CDB/LCI/LCA', tesouro: 'Tesouro Direto', previdencia: 'Previdência Privada', acoes: 'Ações/B3', fii: 'FIIs', exterior: 'Exterior/Stocks', outro: 'Outro' };

function renderMetas(){
  const el=document.getElementById('lista-metas');
  
  // Atualiza o total global de investimentos no topo
  let totalGlobalInv = 0;
  let totalInicialGlobal = 0;
  S.investimentos.forEach(inv => {
    const atual = valorAtualInvestimento(inv);
    totalGlobalInv += atual;
    totalInicialGlobal += inv.valorInicial;
  });
  
  const totalBox = document.getElementById('total-inv-box');
  if(totalBox) {
    if(totalGlobalInv > 0 || S.metas.length > 0) {
      totalBox.style.display = 'block';
      document.getElementById('total-inv-big').textContent = fmt(totalGlobalInv);
      const rendGlobal = totalGlobalInv - totalInicialGlobal;
      document.getElementById('rend-inv-txt').textContent = rendGlobal > 0 ? `Rendimento: +${fmt(rendGlobal)}` : '';
    } else {
      totalBox.style.display = 'none';
    }
  }

  if(!S.metas.length && !S.investimentos.length){
    if(el) el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhuma meta ou investimento criado.</p>';
    return;
  }

  // Agrupar investimentos por meta
  const invsPorMeta = {};
  S.metas.forEach(m => invsPorMeta[m.id] = []);
  const invsSemMeta = [];
  S.investimentos.forEach(inv => {
    if(inv.metaId && invsPorMeta[inv.metaId]) {
      invsPorMeta[inv.metaId].push(inv);
    } else {
      invsSemMeta.push(inv);
    }
  });

  // Atualizar m.atual para cada meta somando os investimentos vinculados
  S.metas.forEach(m => {
    const totalAportes = invsPorMeta[m.id].reduce((acc, inv) => acc + valorAtualInvestimento(inv), 0);
    // Se a meta tiver um m.atual manual maior, mantém ele pra não perder dados legados, senão usa a soma real.
    if (totalAportes > 0) {
      m.atual = totalAportes; 
    }
  });

  let html = S.metas.map(m => {
    const pct=Math.min(100,Math.round((m.atual/m.total)*100));
    const falta=Math.max(0,m.total-m.atual);
    const aportes = invsPorMeta[m.id];
    
    let aportesHtml = '';
    if(aportes.length > 0) {
      aportesHtml = `<div style="margin-top:12px;border-top:1px solid var(--border);padding-top:12px;">
        <p style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Aportes / Investimentos</p>
        ${aportes.map(inv => {
          const meses = mesesEntre(inv.dataInicio);
          const atual = valorAtualInvestimento(inv);
          const tipoStr = TIPO_INV_LABELS[inv.tipo] || inv.tipo || 'Investimento';
          return `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:8px;margin-bottom:6px;font-size:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="font-weight:600;">${escapeHtml(inv.banco)} <span style="font-weight:400;color:var(--muted);font-size:11px;">(${tipoStr})</span></span>
              <span class="item-del" style="font-size:16px;" onclick="if(confirm('Excluir aporte?')){S.investimentos=del(S.investimentos,${inv.id});save();render();}">×</span>
            </div>
            <div style="display:flex;justify-content:space-between;color:var(--muted);margin-bottom:2px;">
              <span>Investido: ${fmt(inv.valorInicial)}</span>
              <span>Rende ${inv.taxaMensal}%/mês (${meses}m)</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-weight:600;color:var(--green);">
              <span>Atual</span>
              <span>${fmt(atual)}</span>
            </div>
          </div>`;
        }).join('')}
      </div>`;
    }

    return `<div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span style="font-weight:600;font-size:15px;">${escapeHtml(m.nome)}</span>
        <span class="item-del" onclick="if(confirm('Excluir esta meta?')){S.metas=del(S.metas,${m.id});save();render()}">×</span>
      </div>
      <div class="prog-wrap">
        <div class="prog-row"><span>${fmt(m.atual)} de ${fmt(m.total)}</span><span>${pct}%</span></div>
        <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;"></div></div>
      </div>
      <p style="font-size:12px;color:var(--muted);margin-top:8px;">Faltam ${fmt(falta)}</p>
      ${aportesHtml}
      <button class="btn" style="margin-top:12px;padding:8px;font-size:12px;border-color:var(--border);" onclick="abrirModalInvestimento(${m.id})">+ Adicionar Aporte</button>
    </div>`;
  }).join('');

  if(invsSemMeta.length > 0) {
    html += `<p class="sec-title" style="margin-top:20px;font-size:14px;">Outros Investimentos (Sem meta)</p>`;
    html += invsSemMeta.map(inv => {
      const meses = mesesEntre(inv.dataInicio);
      const atual = valorAtualInvestimento(inv);
      const tipoStr = TIPO_INV_LABELS[inv.tipo] || inv.tipo || 'Investimento';
      return `<div class="card" style="padding:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-weight:600;font-size:14px;">${escapeHtml(inv.banco)} <span style="font-weight:400;color:var(--muted);font-size:11px;">(${tipoStr})</span></span>
          <span class="item-del" style="font-size:18px;" onclick="if(confirm('Excluir aporte?')){S.investimentos=del(S.investimentos,${inv.id});save();render();}">×</span>
        </div>
        <div style="display:flex;justify-content:space-between;color:var(--muted);font-size:12px;margin-bottom:4px;">
          <span>Investido: ${fmt(inv.valorInicial)}</span>
          <span>${inv.taxaMensal}%/mês (${meses}m)</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-weight:600;color:var(--green);font-size:13px;">
          <span>Atual</span>
          <span>${fmt(atual)}</span>
        </div>
      </div>`;
    }).join('');
    html += `<button class="btn" style="margin-top:12px;" onclick="abrirModalInvestimento()">+ Adicionar Investimento Avulso</button>`;
  }

  if(el) el.innerHTML=html;
}

// AI AGENT (Gemini)
function buildCtx(){
  const t=calcTotais();
  const sorted=[...S.dividas].sort((a,b)=>b.juros-a.juros);
  const titulares=obterTitularesUnicos();
  const inad=gastosInadimplentesDoMes();
  return `Você é um agente financeiro pessoal especialista em finanças familiares brasileiras e recuperação de dívidas. Seja direto, prático e honesto. Use R$ em todos os valores. Evite rodeios.

SITUAÇÃO FINANCEIRA DO MÊS (${mesLabel(mesAtual)}):
- Membros da família / Titulares: ${titulares.join(', ') || 'Família'}
- Receita mensal: ${fmt(t.totalRec)}${S.receitas.length?' ('+S.receitas.map(r=>`${r.desc}${r.titular?' ['+r.titular+']':''}: ${fmt(r.val)}`).join(', ')+')':''}
- Gastos totais: ${fmt(t.totalGas)} | Fixos: ${fmt(t.gasRec)} | Lazer: ${fmt(t.gasLaz)} | Imprevistos: ${fmt(t.gasNP)} | Viagem: ${fmt(t.gasVg)}
${inad.length ? `- INADIMPLÊNCIA / CONTAS ATRASADAS de meses anteriores: ${fmt(inad.reduce((s,g)=>s+g.val,0))} (${inad.map(g=>`${g.desc} - ${fmt(g.val)}`).join(', ')})\n` : ''}- Saldo disponível: ${fmt(t.saldoDisp)}
- Total em dívidas cadastradas: ${fmt(t.totalDiv)} | Custo juros: ${fmt(t.custoJuros)}/mês = ${fmt(t.custoJuros*12)}/ano
${sorted.length?'- Dívidas (maior juro primeiro):\n'+sorted.map((d,i)=>`  ${i+1}. ${d.credor}${d.titular?' ['+d.titular+']':''}: ${fmt(d.saldo)} — ${d.juros}%/mês — ${d.tipo}${d.parcela?' — parcela '+fmt(d.parcela):''}`).join('\n'):''}
${S.metas.length?'- Metas: '+S.metas.map(m=>`${m.nome}: ${fmt(m.atual)} de ${fmt(m.total)}`).join(', '):''}

CONTEXTO: Gestão financeira familiar. Renda extra anual: 13° salário (dez), PLR (set e fev), possível bônus semestral. Objetivo: sair do vermelho, quitar inadimplências e parcelamentos, chegar a R$100k e depois R$1 milhão.

Use metodologia avalanche (maior juro primeiro). Dê planos com números e datas reais quando possível.`;
}

async function ask(q){ document.getElementById('ai-input').value=q; await sendMsg(); }

async function sendMsg(){
  const input=document.getElementById('ai-input');
  const msg=input.value.trim(); if(!msg) return;
  input.value='';
  if(!apiKey){ alert('Configure a Gemini API Key em Configurações para usar o agente.'); go('config'); return; }
  S.chat.push({role:'user',parts:[{text:msg}]});
  renderChat();
  const loadId='ld'+Date.now();
  document.getElementById('chat-msgs').innerHTML+=`<div id="${loadId}" class="ai-msg ai-loading">Analisando suas finanças...</div>`;
  document.getElementById('chat-msgs').scrollTop=99999;

  try {
    const messages=[{role:'user',parts:[{text:buildCtx()+'\n\nPrimeira pergunta: '+S.chat[0]?.parts[0]?.text}]},...S.chat.slice(1)];
    const resultado = await chamarGeminiComFallback({
      contents: messages,
      generationConfig: { maxOutputTokens: 1000 }
    });
    const reply = resultado.text || 'Erro ao obter resposta da inteligência artificial.';
    S.chat.push({role:'model',parts:[{text:reply}]});
    save();
  } catch(e){
    console.error('Erro em sendMsg com roteador Gemini:', e);
    S.chat.push({role:'model',parts:[{text:'Erro: ' + (e.message || 'Erro de conexão ou indisponibilidade de cota nos modelos Gemini.')}]});
  }

  document.getElementById(loadId)?.remove();
  renderChat();
}

function renderChat(){
  const el=document.getElementById('chat-msgs');
  if(!S.chat.length){el.innerHTML='<p style="color:var(--muted);font-size:14px;">Use as sugestões acima ou escreva sua pergunta.</p>';return;}
  el.innerHTML=S.chat.map(m=>{
    const isUser=m.role==='user';
    const txt=(m.parts?.[0]?.text||'').replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
    return `<div class="ai-msg ${isUser?'ai-user':'ai-bot'}">${txt}</div>`;
  }).join('');
  el.scrollTop=99999;
}

// SERVICE WORKER
if(typeof navigator !== 'undefined' && 'serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js').catch(err => {
    console.error('Erro ao registrar Service Worker:', err);
  });
}

// VINCULAÇÃO GLOBAL PARA NAVEGADOR (Resolução de Handlers onclick no HTML)
if (typeof window !== 'undefined') {
  window.go = go;
  window.openM = openM;
  window.closeM = closeM;
  window.alternarTema = alternarTema;
  window.aplicarTema = aplicarTema;
  window.setCarouselSlide = setCarouselSlide;
  window.proximoSlideCarrossel = proximoSlideCarrossel;
  window.abrirModalCirculo = abrirModalCirculo;
  window.salvarNovoCirculo = salvarNovoCirculo;
  window.salvarNovoCirculoModal = salvarNovoCirculoModal;
  window.abrirModalMembro = abrirModalMembro;
  window.selecionarCorMembro = selecionarCorMembro;
  window.salvarModalMembro = salvarModalMembro;
  window.salvarMembroModal = salvarMembroModal;
  window.excluirModalMembro = excluirModalMembro;
  window.excluirMembroModal = excluirMembroModal;
  window.abrirModalConviteCirculo = abrirModalConviteCirculo;
  window.abrirModalConvite = abrirModalConvite;
  window.copiarCodigoConvite = copiarCodigoConvite;
  window.copiarLinkConvite = copiarLinkConvite;
  window.gerarNovoConviteModal = gerarNovoConviteModal;
  window.abrirModalNotifPrefs = abrirModalNotifPrefs;
  window.salvarModalNotifPrefs = salvarModalNotifPrefs;
  window.salvarNotifPrefsModal = salvarNotifPrefsModal;
  window.marcarNotificacoesLidas = marcarNotificacoesLidas;
  window.filtrarAtividadeTipo = filtrarAtividadeTipo;
  window.filtrarAtividadeFeed = filtrarAtividadeFeed;
  window.abrirFabMenu = abrirFabMenu;
  window.fecharFabMenu = fecharFabMenu;
  window.toggleFabMenu = toggleFabMenu;
  window.abrirMenuAcaoRapida = abrirMenuAcaoRapida;
  window.toggleModuloInicio = toggleModuloInicio;
  window.reordenarModuloInicio = reordenarModuloInicio;
  window.alternarMembroAtivo = alternarMembroAtivo;
  window.exibirToastNotificacao = exibirToastNotificacao;
  window.abrirModalReceita = abrirModalReceita;
  window.abrirModalGasto = abrirModalGasto;
  window.abrirModalDivida = abrirModalDivida;
  window.abrirModalInvestimento = abrirModalInvestimento;
  window.fazerLogin = fazerLogin;
  window.fazerCadastro = fazerCadastro;
  window.salvarKey = salvarKey;
  window.pularKey = pularKey;
  window.atualizarKey = atualizarKey;
  window.setModoVisao = setModoVisao;
  window.mudarAno = mudarAno;
  window.ask = ask;
  window.sendMsg = sendMsg;
  window.addReceita = addReceita;
  window.addGasto = addGasto;
  window.addDivida = addDivida;
  window.addMeta = addMeta;
  window.addInvestimento = addInvestimento;
  window.addMembroFamilia = addMembroFamilia;
  window.addCategoriaGasto = addCategoriaGasto;
  window.addTipoDivida = addTipoDivida;
  window.syncDrive = syncDrive;
  window.sair = sair;
  window.salvarFamiliaId = salvarFamiliaId;
  window.selTag = selTag;
  window.salvarNegociacaoGasto = salvarNegociacaoGasto;
  window.confirmarAdiantamento = confirmarAdiantamento;
}

// EXPORTAÇÃO PARA TESTES / NODE.JS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calcularMesesAtraso,
    adicionarMesesYM,
    processarInadimplencia60Dias,
    gastosInadimplentesDoMes,
    gastosPrevistosDoMes,
    gastosDoMes,
    calcTotais,
    calcTotaisAno,
    setMes,
    mudarMes,
    loadState,
    abrirModalCartao,
    salvarCartao,
    excluirCartao,
    toggleAnuidadeCartao,
    atualizarTotalAnuidade,
    calcularFaturaMes,
    renderCartoesTopo,
    abrirFaturaCartao,
    abrirModalCompraCartao,
    salvarCompraCartao,
    excluirCompraCartao,
    toggleCompraParcelada,
    atualizarPreviewCompraParcelada,
    pagarFaturaTotal,
    abrirModalPagamentoParcial,
    atualizarPreviewPagamentoParcial,
    confirmarPagamentoParcial,
    abrirModalAbaterCartao,
    confirmarAbatimentoCartao,
    abrirModalAnteciparCartao,
    anteciparCompraCartao,
    verificarEReabrirFatura,
    calcularMesFaturaCompra,
    cancelarAssinaturaCartao,
    calcularLimiteCartao,
    toggleCompraRecorrente,
    togglePrazoRecorrenteCartao,
    atualizarPreviewCompraModal,
    calcSaldoAcumuladoAnterior,
    togglePagoGasto,
    quebrarAcordo,
    parcelaTemAtraso30Dias,
    acordoTemParcelaAtrasada30Dias,
    saldoRestante,
    salvarAcordo,
    toggleParcela,
    marcarQuitada,
    abrirAcordo,
    renderDividas,
    go,
    openM,
    closeM,
    // Super-App Familiar v2.0 (Etapa 1)
    PALETA_FAMILIAR,
    MODELOS_GEMINI_FALLBACK,
    MODULOS_INICIO_CATALOGO,
    migrarParaUpgradeFamiliarV2,
    aplicarTema,
    alternarTema,
    obterCirculoAtivo,
    criarCirculo,
    selecionarCirculo,
    gerarConviteCirculo,
    obterMembroAtivo,
    alternarMembroAtivo,
    salvarMembroCirculo,
    excluirMembroCirculo,
    verificarHorarioSilencio,
    registrarNotificacaoFamilia,
    obterFeedAtividade,
    marcarNotificacoesLidas,
    salvarPreferenciasNotificacao,
    toggleModuloInicio,
    reordenarModuloInicio,
    setCarouselSlide,
    proximoSlideCarrossel,
    SLIDES_CARROSSEL,
    abrirFabMenu,
    fecharFabMenu,
    toggleFabMenu,
    abrirMenuAcaoRapida,
    filtrarAtividadeTipo,
    filtrarAtividadeFeed,
    abrirModalCirculo,
    salvarNovoCirculo,
    salvarNovoCirculoModal,
    abrirModalMembro,
    selecionarCorMembro,
    salvarModalMembro,
    salvarMembroModal,
    excluirModalMembro,
    excluirMembroModal,
    abrirModalConviteCirculo,
    abrirModalConvite,
    copiarCodigoConvite,
    copiarLinkConvite,
    gerarNovoConviteModal,
    abrirModalNotifPrefs,
    salvarModalNotifPrefs,
    salvarNotifPrefsModal,
    exibirToastNotificacao,
    renderHeaderCirculo,
    renderMuralInicio,
    renderAbaExplorar,
    renderMinhaFamilia,
    renderAtividadeFeed,
    abrirModalReceita,
    abrirModalGasto,
    abrirModalDivida,
    abrirModalInvestimento,
    fazerLogin,
    fazerCadastro,
    salvarKey,
    pularKey,
    atualizarKey,
    setModoVisao,
    mudarAno,
    ask,
    sendMsg,
    addReceita,
    addGasto,
    addDivida,
    addMeta,
    addInvestimento,
    addMembroFamilia,
    addCategoriaGasto,
    addTipoDivida,
    syncDrive,
    sair,
    salvarFamiliaId,
    selTag,
    salvarNegociacaoGasto,
    confirmarAdiantamento,
    chamarGeminiComFallback,
    getState: () => S,
    S
  };
}
