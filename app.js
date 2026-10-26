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
const MODELOS_GEMINI_FALLBACK = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

const MODULOS_INICIO_CATALOGO = [
  { id: 'orcamento', nome: 'Orçamento', desc: 'Saldo em Caixa Real e visão financeira', icone: '🐷', cor: '#10B981', bgIcon: 'rgba(16,185,129,0.14)', categoria: 'avancado', telaAlvo: 'resumo' },
  { id: 'listas', nome: 'Listas', desc: 'Compras e tarefas colaborativas', icone: '🛒', cor: '#F59E0B', bgIcon: 'rgba(245,158,11,0.14)', categoria: 'essencial', telaAlvo: 'listas' },
  { id: 'calendario', nome: 'Calendário', desc: 'Rotina familiar e contas a vencer', icone: '📅', cor: '#8B5CF6', bgIcon: 'rgba(139,92,246,0.14)', categoria: 'essencial', telaAlvo: 'calendario' },
  { id: 'familia', nome: 'Minha Família', desc: 'Membros, papéis e convites', icone: '👨‍👩‍👧‍👦', cor: '#5581E3', bgIcon: 'rgba(85,129,227,0.14)', categoria: 'avancado', telaAlvo: 'familia' },
  { id: 'atividade', nome: 'Atividade', desc: 'Linha do tempo e notificações', icone: '⚡', cor: '#3B82F6', bgIcon: 'rgba(59,130,246,0.14)', categoria: 'essencial', telaAlvo: 'atividade' },
  { id: 'aniversarios', nome: 'Aniversários', desc: 'Datas especiais de quem amamos', icone: '🎂', cor: '#EC4899', bgIcon: 'rgba(236,72,153,0.14)', categoria: 'avancado', telaAlvo: 'calendario' },
  { id: 'documentos', nome: 'Documentos', desc: 'Cofre seguro de arquivos da casa', icone: '📂', cor: '#6366F1', bgIcon: 'rgba(99,102,241,0.14)', categoria: 'avancado', telaAlvo: 'explorar' },
  { id: 'refeicoes', nome: 'Refeições', desc: 'Cardápio semanal e receitas', icone: '🍲', cor: '#14B8A6', bgIcon: 'rgba(20,184,166,0.14)', categoria: 'avancado', telaAlvo: 'explorar' },
  { id: 'receitas_cul', nome: 'Receitas', desc: 'Pratos favoritos da família', icone: '📖', cor: '#F97316', bgIcon: 'rgba(249,115,22,0.14)', categoria: 'essencial', telaAlvo: 'explorar' },
  { id: 'mensagens', nome: 'Mural / Mensagens', desc: 'Recados fixados no mural', icone: '💬', cor: '#06B6D4', bgIcon: 'rgba(6,182,212,0.14)', categoria: 'essencial', telaAlvo: 'explorar' },
  { id: 'horario', nome: 'Horário Escolar', desc: 'Aulas e atividades dos filhos', icone: '🎒', cor: '#A855F7', bgIcon: 'rgba(168,85,247,0.14)', categoria: 'avancado', telaAlvo: 'explorar' },
  { id: 'contatos', nome: 'Contatos Úteis', desc: 'Telefones de emergência e médicos', icone: '📞', cor: '#64748B', bgIcon: 'rgba(100,116,139,0.14)', categoria: 'essencial', telaAlvo: 'explorar' },
  { id: 'beneficios', nome: 'Vales VA / VR', desc: 'Carteiras de alimentação e refeição', icone: '🥗', cor: '#10B981', bgIcon: 'rgba(16,185,129,0.14)', categoria: 'avancado', telaAlvo: 'gastos' },
  { id: 'scanner_cupom', nome: 'Scanner de Cupom', desc: 'Leitura inteligente de notas fiscais com IA', icone: '📷', cor: '#3B82F6', bgIcon: 'rgba(59,130,246,0.14)', categoria: 'avancado', telaAlvo: 'gastos' },
  { id: 'metas_fam', nome: 'Metas & Sonhos', desc: 'Objetivos e poupança da família', icone: '🎯', cor: '#EC4899', bgIcon: 'rgba(236,72,153,0.14)', categoria: 'avancado', telaAlvo: 'explorar' }
];

let S = {
  versaoSchema: 2,
  tema: 'claro',
  circulos: [
    { id: 'circ_1', nome: 'Nossa Família', codigoConvite: 'FAM-INICIO', expiraEm: '', criadoEm: new Date().toISOString() }
  ],
  circuloAtivoId: 'circ_1',
  fotoCapaFamiliaUrl: '',
  membrosPerfil: [
    { id: 'm_1', circuloId: 'circ_1', nome: 'Alex', papel: 'admin', cor: '#5581E3', iniciais: 'AL', aniversario: '', fotoUrl: '' },
    { id: 'm_2', circuloId: 'circ_1', nome: 'Gabi', papel: 'membro', cor: '#EC4899', iniciais: 'GA', aniversario: '', fotoUrl: '' }
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
  listas: [],
  historicoCompras: [],
  eventosCalendario: [],
  aniversarios: [],
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
  // Super-App Familiar v2.0 (Etapa 4 - Carteiras VA/VR e Orçamento)
  carteirasBeneficio: [],
  movimentacoesBeneficio: [],
  configOrcamento: {
    diaInicioCiclo: 1,
    filtroOrigemAtivo: 'todos'
  },
  // Super-App Familiar v2.0 (Etapa 5 - Scanner OCR de Cupons e Notas)
  cuponsFiscais: [],
  rascunhoCupomAtual: null,
  // Super-App Familiar v2.0 (Etapa 6 - Mensagens da Família & Contatos)
  mensagensFamilia: [],
  contatosFamilia: [],
  // Super-App Familiar v2.0 (Etapa 7 - Refeições, Receitas, Documentos & Grade Horária)
  receitasCulinarias: [],
  cardapioSemanal: [],
  documentosFamilia: [],
  gradeHoraria: [],
  // Super-App Familiar v2.0 (Etapa 8 - Agente Norte 2.0, Metas/Sonhos, Tetos & Simulador)
  metasFamilia: [],
  tetosCategorias: [],
  // Upgrade Calendário Pro v2.1 (Configurações e Feriados)
  configCalendario: {
    feriadosBrasil: true,
    mostrarNumeroSemana: false,
    primeiroDiaSemana: 0, // 0 = Domingo, 1 = Segunda-feira
    lembretePadraoMin: 30, // 30 minutos antes
    lembreteDiarioAgenda: '08:00',
    limpezaMeses: 6
  },
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

  // 8. Listas Compartilhadas e Histórico de Compras Frequentes (Etapa 2)
  if (!Array.isArray(S.listas) || S.listas.length === 0) {
    const agoraIso = new Date().toISOString();
    const cId = S.circuloAtivoId || 'circ_1';
    const mId = S.membroAtivoId || 'm_1';
    S.listas = [
      {
        id: 'lst_mercado_padrao',
        circuloId: cId,
        titulo: '🛒 Mercado do Mês',
        tipo: 'compras',
        icone: '🛒',
        cor: '#10B981',
        criadoPor: mId,
        criadoEm: agoraIso,
        itens: [
          {
            id: 'item_compra_1',
            nome: 'Arroz 5kg',
            qtd: 1,
            unidade: 'pct',
            categoria: 'mercearia',
            precoEstimado: 29.90,
            comprado: false,
            criadoPorNome: 'Alex',
            criadoPorCor: '#5581E3',
            criadoEm: agoraIso
          },
          {
            id: 'item_compra_2',
            nome: 'Leite Integral (Caixa)',
            qtd: 6,
            unidade: 'un',
            categoria: 'laticinios',
            precoEstimado: 5.49,
            comprado: false,
            criadoPorNome: 'Gabi',
            criadoPorCor: '#EC4899',
            criadoEm: agoraIso
          }
        ]
      },
      {
        id: 'lst_tarefas_padrao',
        circuloId: cId,
        titulo: '✅ Tarefas da Casa',
        tipo: 'tarefas',
        icone: '✅',
        cor: '#5581E3',
        criadoPor: mId,
        criadoEm: agoraIso,
        itens: [
          {
            id: 'item_tarefa_1',
            titulo: 'Organizar despensa e conferir validade',
            responsavelId: mId,
            responsavelNome: 'Alex',
            responsavelCor: '#5581E3',
            prazo: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
            prioridade: 'media',
            recorrencia: 'semanal',
            concluida: false,
            criadoPorNome: 'Alex',
            criadoEm: agoraIso
          },
          {
            id: 'item_tarefa_2',
            titulo: 'Regar as plantas da varanda',
            responsavelId: mId,
            responsavelNome: 'Alex',
            responsavelCor: '#5581E3',
            prazo: new Date().toISOString().slice(0, 10),
            prioridade: 'baixa',
            recorrencia: 'diaria',
            concluida: false,
            criadoPorNome: 'Alex',
            criadoEm: agoraIso
          }
        ]
      }
    ];
  }

  if (!Array.isArray(S.historicoCompras) || S.historicoCompras.length === 0) {
    S.historicoCompras = [
      { nome: 'Arroz', categoria: 'mercearia', precoUltimo: 29.90, vezesUsado: 5 },
      { nome: 'Leite', categoria: 'laticinios', precoUltimo: 5.49, vezesUsado: 8 },
      { nome: 'Café', categoria: 'mercearia', precoUltimo: 18.50, vezesUsado: 4 },
      { nome: 'Sabão em Pó', categoria: 'limpeza', precoUltimo: 22.90, vezesUsado: 3 },
      { nome: 'Frutas (Maçã/Banana)', categoria: 'hortifruti', precoUltimo: 14.00, vezesUsado: 6 },
      { nome: 'Pão Francês', categoria: 'padaria', precoUltimo: 8.50, vezesUsado: 7 }
    ];
  }

  // 9. Calendário Compartilhado e Aniversários Familiares (Etapa 3)
  const agoraIsoEtapa3 = new Date().toISOString();
  const cIdEtapa3 = S.circuloAtivoId || 'circ_1';
  const mIdEtapa3 = S.membroAtivoId || 'm_1';

  if (!Array.isArray(S.eventosCalendario) || S.eventosCalendario.length === 0) {
    const hojeYmd = agoraIsoEtapa3.slice(0, 10);
    S.eventosCalendario = [
      {
        id: 'ev_padrao_1',
        circuloId: cIdEtapa3,
        titulo: 'Reunião Escolar',
        descricao: 'Apresentação pedagógica do bimestre',
        dataInicio: hojeYmd,
        horaInicio: '19:00',
        dataFim: hojeYmd,
        horaFim: '20:30',
        diaInteiro: false,
        local: 'Escola Municipal',
        participantesIds: ['m_1', 'm_2'],
        cor: '#5581E3',
        repeticao: 'nenhuma',
        lembreteMinutos: 60,
        gastoPrevisto: 0,
        criadoPor: mIdEtapa3,
        criadoEm: agoraIsoEtapa3
      },
      {
        id: 'ev_padrao_2',
        circuloId: cIdEtapa3,
        titulo: 'Consulta Médica de Rotina',
        descricao: 'Pediatra das crianças',
        dataInicio: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
        horaInicio: '14:30',
        dataFim: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
        horaFim: '15:30',
        diaInteiro: false,
        local: 'Clínica Infantil',
        participantesIds: ['m_2'],
        cor: '#EC4899',
        repeticao: 'nenhuma',
        lembreteMinutos: 1440,
        gastoPrevisto: 150,
        criadoPor: 'm_2',
        criadoEm: agoraIsoEtapa3
      }
    ];
  }

  if (!Array.isArray(S.aniversarios) || S.aniversarios.length === 0) {
    S.aniversarios = [
      {
        id: 'aniv_1',
        circuloId: cIdEtapa3,
        nomePessoa: 'Alex',
        dataNascimento: '1990-05-15',
        parentesco: 'Pai / Titular',
        membroId: 'm_1',
        avisoDiasAntes: 7,
        criadoEm: agoraIsoEtapa3
      },
      {
        id: 'aniv_2',
        circuloId: cIdEtapa3,
        nomePessoa: 'Gabi',
        dataNascimento: '1992-11-20',
        parentesco: 'Mãe / Titular',
        membroId: 'm_2',
        avisoDiasAntes: 7,
        criadoEm: agoraIsoEtapa3
      },
      {
        id: 'aniv_3',
        circuloId: cIdEtapa3,
        nomePessoa: 'Dudu',
        dataNascimento: '2018-10-29',
        parentesco: 'Filho',
        membroId: 'm_3',
        avisoDiasAntes: 7,
        criadoEm: agoraIsoEtapa3
      }
    ];
  }

  // 10. Carteiras de Benefícios (VA / VR) e Orçamento Familiar (Etapa 4)
  if (!Array.isArray(S.carteirasBeneficio)) {
    S.carteirasBeneficio = [];
  }
  if (!Array.isArray(S.movimentacoesBeneficio)) {
    S.movimentacoesBeneficio = [];
  }
  if (!S.configOrcamento || typeof S.configOrcamento !== 'object') {
    S.configOrcamento = {
      diaInicioCiclo: 1,
      filtroOrigemAtivo: 'todos'
    };
  }
  if (!S.configOrcamento.diaInicioCiclo) {
    S.configOrcamento.diaInicioCiclo = 1;
  }
  if (!S.configOrcamento.filtroOrigemAtivo) {
    S.configOrcamento.filtroOrigemAtivo = 'todos';
  }

  // 11. Cupons Fiscais e Leitura Inteligente (Etapa 5)
  if (!Array.isArray(S.cuponsFiscais)) {
    S.cuponsFiscais = [];
  }
  if (!('rascunhoCupomAtual' in S)) {
    S.rascunhoCupomAtual = null;
  }

  // 12. Mensagens da Família / Mural Compartilhado (Etapa 6)
  const agoraIsoEtapa6 = new Date().toISOString();
  const cIdEtapa6 = S.circuloAtivoId || 'circ_1';
  const mIdEtapa6 = S.membroAtivoId || 'm_1';

  if (!Array.isArray(S.mensagensFamilia) || S.mensagensFamilia.length === 0) {
    S.mensagensFamilia = [
      {
        id: 'msg_inicio_1',
        circuloId: cIdEtapa6,
        membroId: mIdEtapa6,
        membroNome: 'Alex',
        membroCor: '#5581E3',
        membroIniciais: 'AL',
        texto: 'Bem-vindos ao Mural da nossa família! 🏡 Deixem aqui recados, lembretes e avisos importantes.',
        anexoFotoUrl: null,
        fixada: true,
        lidoPorIds: [mIdEtapa6, 'm_2'],
        reacoes: { '❤️': ['m_2'] },
        criadoEm: agoraIsoEtapa6
      }
    ];
  }

  // 13. Contatos Compartilhados da Família (Etapa 6)
  if (!Array.isArray(S.contatosFamilia) || S.contatosFamilia.length === 0) {
    S.contatosFamilia = [
      {
        id: 'cont_emergencia_1',
        circuloId: cIdEtapa6,
        nome: 'SAMU (Emergência)',
        categoria: 'emergencia',
        especialidade: 'Ambulância / Resgate',
        telefone: '192',
        whatsapp: '',
        email: '',
        endereco: 'Central de Atendimento 192',
        observacoes: 'Emergência médica 24h em todo o Brasil',
        emergencia: true,
        criadoPor: mIdEtapa6,
        criadoEm: agoraIsoEtapa6,
        atualizadoEm: agoraIsoEtapa6
      },
      {
        id: 'cont_emergencia_2',
        circuloId: cIdEtapa6,
        nome: 'Bombeiros',
        categoria: 'emergencia',
        especialidade: 'Resgate / Incêndio',
        telefone: '193',
        whatsapp: '',
        email: '',
        endereco: 'Central 193',
        observacoes: 'Acidentes, vazamentos de gás e resgate',
        emergencia: true,
        criadoPor: mIdEtapa6,
        criadoEm: agoraIsoEtapa6,
        atualizadoEm: agoraIsoEtapa6
      },
      {
        id: 'cont_escola_1',
        circuloId: cIdEtapa6,
        nome: 'Escola das Crianças',
        categoria: 'escola',
        especialidade: 'Secretaria e Coordenação',
        telefone: '(11) 4002-8922',
        whatsapp: '551140028922',
        email: 'secretaria@escolamunicipal.com.br',
        endereco: 'Rua das Flores, 120',
        observacoes: 'Horário de atendimento: 07:30 às 17:30',
        emergencia: false,
        criadoPor: 'm_2',
        criadoEm: agoraIsoEtapa6,
        atualizadoEm: agoraIsoEtapa6
      },
      {
        id: 'cont_saude_1',
        circuloId: cIdEtapa6,
        nome: 'Dra. Camila Pediatra',
        categoria: 'saude',
        especialidade: 'Pediatra de Família',
        telefone: '(11) 98765-4321',
        whatsapp: '5511987654321',
        email: 'dracamila@pediatria.med.br',
        endereco: 'Av. Paulista, 1500 - Sala 42',
        observacoes: 'Atende convênio e urgência via WhatsApp',
        emergencia: true,
        criadoPor: 'm_2',
        criadoEm: agoraIsoEtapa6,
        atualizadoEm: agoraIsoEtapa6
      }
    ];
  }

  // 14. Caixa de Receitas Culinárias da Família (Etapa 7)
  const agoraIsoEtapa7 = new Date().toISOString();
  const cIdEtapa7 = S.circuloAtivoId || 'circ_1';
  const mIdEtapa7 = S.membroAtivoId || 'm_1';

  if (!Array.isArray(S.receitasCulinarias) || S.receitasCulinarias.length === 0) {
    S.receitasCulinarias = [
      {
        id: 'rec_padrao_1',
        circuloId: cIdEtapa7,
        titulo: 'Strogonoff de Frango Especial',
        categoria: 'almoco',
        tempoPreparoMin: 35,
        porcoes: 4,
        ingredientes: [
          { nome: 'Peito de Frango', quantidade: '1', unidade: 'kg', corredor: 'carnes' },
          { nome: 'Creme de Leite', quantidade: '2', unidade: 'cx', corredor: 'laticinios' },
          { nome: 'Molho de Tomate', quantidade: '1', unidade: 'sachê', corredor: 'mercearia' },
          { nome: 'Champignon', quantidade: '100', unidade: 'g', corredor: 'mercearia' },
          { nome: 'Batata Palha', quantidade: '1', unidade: 'pct', corredor: 'mercearia' }
        ],
        modoPreparo: 'Corte o frango em cubos, doure com cebola e alho. Adicione o molho, champignon e por fim o creme de leite em fogo baixo.',
        custoEstimado: 45.0,
        criadoPor: mIdEtapa7,
        criadoEm: agoraIsoEtapa7
      },
      {
        id: 'rec_padrao_2',
        circuloId: cIdEtapa7,
        titulo: 'Panqueca de Banana com Aveia',
        categoria: 'cafe',
        tempoPreparoMin: 15,
        porcoes: 2,
        ingredientes: [
          { nome: 'Banana Prata', quantidade: '2', unidade: 'un', corredor: 'hortifruti' },
          { nome: 'Ovo', quantidade: '2', unidade: 'un', corredor: 'laticinios' },
          { nome: 'Farinha de Aveia', quantidade: '4', unidade: 'colheres', corredor: 'mercearia' },
          { nome: 'Canela em Pó', quantidade: '1', unidade: 'pitada', corredor: 'mercearia' }
        ],
        modoPreparo: 'Amasse as bananas, misture os ovos batidos e a aveia. Asse em frigideira antiaderente levemente untada.',
        custoEstimado: 8.5,
        criadoPor: 'm_2',
        criadoEm: agoraIsoEtapa7
      },
      {
        id: 'rec_padrao_3',
        circuloId: cIdEtapa7,
        titulo: 'Sopa Reconfortante de Legumes',
        categoria: 'jantar',
        tempoPreparoMin: 40,
        porcoes: 4,
        ingredientes: [
          { nome: 'Batata Inglesa', quantidade: '3', unidade: 'un', corredor: 'hortifruti' },
          { nome: 'Cenoura', quantidade: '2', unidade: 'un', corredor: 'hortifruti' },
          { nome: 'Abobrinha', quantidade: '1', unidade: 'un', corredor: 'hortifruti' },
          { nome: 'Macarrão Padre Nosso', quantidade: '200', unidade: 'g', corredor: 'mercearia' }
        ],
        modoPreparo: 'Cozinhe os legumes picados até ficarem macios. Adicione o macarrão nos minutos finais e acerte o sal.',
        custoEstimado: 18.0,
        criadoPor: mIdEtapa7,
        criadoEm: agoraIsoEtapa7
      }
    ];
  }

  // 15. Cardápio Semanal Familiar (Etapa 7)
  if (!Array.isArray(S.cardapioSemanal) || S.cardapioSemanal.length === 0) {
    S.cardapioSemanal = [
      {
        id: 'refeicao_segunda_cafe',
        circuloId: cIdEtapa7,
        diaSemana: 'segunda',
        tipoRefeicao: 'cafe',
        receitaId: 'rec_padrao_2',
        pratoLivre: 'Panqueca de Banana com Aveia',
        ingredientesExtras: [],
        criadoEm: agoraIsoEtapa7,
        atualizadoEm: agoraIsoEtapa7
      },
      {
        id: 'refeicao_segunda_almoco',
        circuloId: cIdEtapa7,
        diaSemana: 'segunda',
        tipoRefeicao: 'almoco',
        receitaId: 'rec_padrao_1',
        pratoLivre: 'Strogonoff de Frango Especial',
        ingredientesExtras: [
          { nome: 'Arroz Branco', quantidade: '2', unidade: 'xícara', corredor: 'mercearia' }
        ],
        criadoEm: agoraIsoEtapa7,
        atualizadoEm: agoraIsoEtapa7
      },
      {
        id: 'refeicao_segunda_jantar',
        circuloId: cIdEtapa7,
        diaSemana: 'segunda',
        tipoRefeicao: 'jantar',
        receitaId: 'rec_padrao_3',
        pratoLivre: 'Sopa Reconfortante de Legumes',
        ingredientesExtras: [],
        criadoEm: agoraIsoEtapa7,
        atualizadoEm: agoraIsoEtapa7
      },
      {
        id: 'refeicao_quarta_almoco',
        circuloId: cIdEtapa7,
        diaSemana: 'quarta',
        tipoRefeicao: 'almoco',
        receitaId: null,
        pratoLivre: 'Peixe Grelhado com Salada Verde',
        ingredientesExtras: [
          { nome: 'Filé de Tilápia', quantidade: '800', unidade: 'g', corredor: 'carnes' },
          { nome: 'Alface Americana', quantidade: '1', unidade: 'maço', corredor: 'hortifruti' },
          { nome: 'Tomate Cereja', quantidade: '1', unidade: 'cx', corredor: 'hortifruti' }
        ],
        criadoEm: agoraIsoEtapa7,
        atualizadoEm: agoraIsoEtapa7
      }
    ];
  }

  // 16. Cofre de Documentos da Família (Etapa 7)
  if (!Array.isArray(S.documentosFamilia) || S.documentosFamilia.length === 0) {
    const dataHoje = new Date();
    // Gera data de validade daqui a 20 dias (para testar alerta de <= 30 dias)
    const dataVencendoEmBreve = new Date(dataHoje.getTime() + 20 * 86400000).toISOString().slice(0, 10);
    // Gera data de validade daqui a 180 dias
    const dataValidadeLonga = new Date(dataHoje.getTime() + 180 * 86400000).toISOString().slice(0, 10);

    S.documentosFamilia = [
      {
        id: 'doc_padrao_1',
        circuloId: cIdEtapa7,
        titulo: 'Certidão de Nascimento Dudu',
        pasta: 'familia',
        tipoArquivo: 'imagem',
        conteudoUrlOuBase64: '',
        numeroDocumento: '123456.01.55.2018.1.0001',
        dataValidade: '',
        membroDonoId: mIdEtapa7,
        visivelParaIds: 'todos',
        observacoes: 'Via original no cofre físico da gaveta do quarto',
        criadoEm: agoraIsoEtapa7
      },
      {
        id: 'doc_padrao_2',
        circuloId: cIdEtapa7,
        titulo: 'Apólice do Seguro do Carro',
        pasta: 'casa',
        tipoArquivo: 'pdf',
        conteudoUrlOuBase64: '',
        numeroDocumento: 'AP-987654-BR',
        dataValidade: dataVencendoEmBreve,
        membroDonoId: mIdEtapa7,
        visivelParaIds: 'todos',
        observacoes: 'Seguradora Porto Seguro - Cobertura completa e guincho 24h',
        criadoEm: agoraIsoEtapa7
      },
      {
        id: 'doc_padrao_3',
        circuloId: cIdEtapa7,
        titulo: 'Matrícula Escolar e Calendário Letivo',
        pasta: 'educacao',
        tipoArquivo: 'pdf',
        conteudoUrlOuBase64: '',
        numeroDocumento: 'ESC-2026-DUDU',
        dataValidade: dataValidadeLonga,
        membroDonoId: 'm_2',
        visivelParaIds: 'todos',
        observacoes: 'Ano letivo 2026 - Escola Municipal das Flores',
        criadoEm: agoraIsoEtapa7
      },
      {
        id: 'doc_padrao_4',
        circuloId: cIdEtapa7,
        titulo: 'Contrato de Investimentos / Confidencial',
        pasta: 'privado',
        tipoArquivo: 'texto',
        conteudoUrlOuBase64: '',
        numeroDocumento: 'INV-PRIV-001',
        dataValidade: '',
        membroDonoId: mIdEtapa7,
        visivelParaIds: [mIdEtapa7],
        observacoes: 'Documento confidencial do administrador familiar',
        criadoEm: agoraIsoEtapa7
      }
    ];
  }

  // 17. Grade Horária Semanal / Timetable (Etapa 7)
  if (!Array.isArray(S.gradeHoraria) || S.gradeHoraria.length === 0) {
    S.gradeHoraria = [
      {
        id: 'grade_padrao_1',
        circuloId: cIdEtapa7,
        membroId: 'm_crianca_1',
        membroNome: 'Dudu',
        membroCor: '#10B981',
        titulo: 'Aulas do Ensino Fundamental',
        diaSemana: 'segunda',
        horaInicio: '07:30',
        horaFim: '12:00',
        local: 'Escola Municipal',
        semanaAlternada: 'todas',
        cor: '#10B981'
      },
      {
        id: 'grade_padrao_2',
        circuloId: cIdEtapa7,
        membroId: 'm_crianca_1',
        membroNome: 'Dudu',
        membroCor: '#10B981',
        titulo: 'Natação Infantil',
        diaSemana: 'terca',
        horaInicio: '15:30',
        horaFim: '16:30',
        local: 'Academia Aquática',
        semanaAlternada: 'todas',
        cor: '#10B981'
      },
      {
        id: 'grade_padrao_3',
        circuloId: cIdEtapa7,
        membroId: 'm_crianca_1',
        membroNome: 'Dudu',
        membroCor: '#10B981',
        titulo: 'Aulas de Robótica & Inglês',
        diaSemana: 'quarta',
        horaInicio: '14:00',
        horaFim: '15:30',
        local: 'Sala Maker',
        semanaAlternada: 'semana_a',
        cor: '#8B5CF6'
      },
      {
        id: 'grade_padrao_4',
        circuloId: cIdEtapa7,
        membroId: mIdEtapa7,
        membroNome: 'Alex',
        membroCor: '#5581E3',
        titulo: 'Treino Funcional',
        diaSemana: 'segunda',
        horaInicio: '06:30',
        horaFim: '07:30',
        local: 'Parque Central',
        semanaAlternada: 'todas',
        cor: '#5581E3'
      }
    ];
  }

  // 18. Metas e Sonhos da Família (Etapa 8)
  const cIdEtapa8 = S.circuloAtivoId || 'circ_1';
  const mIdEtapa8 = S.membroAtivoId || 'm_1';
  const agoraIsoEtapa8 = new Date().toISOString();

  if (!Array.isArray(S.metasFamilia) || S.metasFamilia.length === 0) {
    S.metasFamilia = [
      {
        id: 'meta_fam_padrao_1',
        circuloId: cIdEtapa8,
        titulo: 'Reserva de Emergência da Família',
        icone: '🛡️',
        valorAlvo: 15000.0,
        valorAtual: 4500.0,
        prazo: '2026-12-31',
        aportes: [
          { id: 'ap_fam_1', valor: 2000.0, data: '2026-09-10', membroNome: 'Alex', origem: 'Salário' },
          { id: 'ap_fam_2', valor: 2500.0, data: '2026-10-05', membroNome: 'Gabi', origem: 'Salário' }
        ],
        criadoPor: mIdEtapa8,
        criadoEm: agoraIsoEtapa8
      },
      {
        id: 'meta_fam_padrao_2',
        circuloId: cIdEtapa8,
        titulo: 'Viagem de Férias em Família',
        icone: '✈️',
        valorAlvo: 8000.0,
        valorAtual: 2200.0,
        prazo: '2027-01-15',
        aportes: [
          { id: 'ap_fam_3', valor: 1200.0, data: '2026-09-15', membroNome: 'Alex', origem: 'Salário' },
          { id: 'ap_fam_4', valor: 1000.0, data: '2026-10-10', membroNome: 'Gabi', origem: 'Salário' }
        ],
        criadoPor: mIdEtapa8,
        criadoEm: agoraIsoEtapa8
      }
    ];
  }

  // 19. Limites (Tetos) de Orçamento por Categoria (Etapa 8)
  if (!Array.isArray(S.tetosCategorias) || S.tetosCategorias.length === 0) {
    S.tetosCategorias = [
      { categoria: 'lazer', limiteMensal: 600.0 },
      { categoria: 'recorrente', limiteMensal: 3500.0 }
    ];
  }

  // 20. Configurações do Calendário Pro (v2.1)
  const configCalPadrao = {
    feriadosBrasil: true,
    mostrarNumeroSemana: false,
    primeiroDiaSemana: 0, // 0 = Domingo, 1 = Segunda-feira
    lembretePadraoMin: 30, // 30 minutos antes
    lembreteDiarioAgenda: '08:00',
    limpezaMeses: 6
  };
  S.configCalendario = Object.assign({}, configCalPadrao, S.configCalendario || {});
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
      const fotoUrlAtual = dados.fotoUrl !== undefined ? dados.fotoUrl : (S.membrosPerfil[idx].fotoUrl || '');
      S.membrosPerfil[idx] = {
        ...S.membrosPerfil[idx],
        nome: nomeLimpo,
        papel,
        cor,
        iniciais,
        fotoUrl: fotoUrlAtual,
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
      fotoUrl: dados.fotoUrl || '',
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

// ============================================================================
// SUPER-APP FAMILIAR V2.0 - LISTAS DE COMPRAS & TAREFAS TO-DO (Etapa 2)
// ============================================================================

// Categorias organizadas por corredor de mercado (Seção 4.2)
const CATEGORIAS_MERCADO = {
  hortifruti: { id: 'hortifruti', nome: 'Hortifrúti', icone: '🥬', cor: '#10B981' },
  carnes:     { id: 'carnes',     nome: 'Carnes & Frios', icone: '🥩', cor: '#EF4444' },
  laticinios: { id: 'laticinios', nome: 'Laticínios', icone: '🧀', cor: '#F59E0B' },
  mercearia:  { id: 'mercearia',  nome: 'Mercearia', icone: '🍝', cor: '#8B5CF6' },
  padaria:    { id: 'padaria',    nome: 'Padaria', icone: '🥖', cor: '#EC4899' },
  bebidas:    { id: 'bebidas',    nome: 'Bebidas', icone: '🧃', cor: '#3B82F6' },
  limpeza:    { id: 'limpeza',    nome: 'Limpeza', icone: '🧼', cor: '#06B6D4' },
  higiene:    { id: 'higiene',    nome: 'Higiene & Farmácia', icone: '🧴', cor: '#14B8A6' },
  outros:     { id: 'outros',     nome: 'Outros', icone: '📦', cor: '#6B7280' }
};

// Variáveis de estado da tela de listas
let listaAtivaId = null;
let filtroTipoListasAtual = 'todas';
let filtroMembroTarefasAtual = 'todos';
let listaParaConverterId = null;

// Buffer para agrupamento anti-spam de notificações de adição de itens (15s)
const bufferNotifItensLista = {
  listaId: null,
  membroNome: '',
  listaTitulo: '',
  quantidade: 0,
  timestamp: 0
};

/**
 * Registra mutações na fila offline local (S.syncQueue) para persistência e
 * sincronização em segundo plano conforme arquitetura Outbox Pattern (Seção 3.1).
 */
function adicionarNaFilaSync(tabela, operacao, dados) {
  if (!S) return null;
  if (!Array.isArray(S.syncQueue)) S.syncQueue = [];

  const entrada = {
    id: 'sync_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    circuloId: S.circuloAtivoId || 'circ_1',
    tabela,
    operacao,
    dados,
    timestamp: new Date().toISOString(),
    status: 'pendente'
  };

  S.syncQueue.push(entrada);
  // Mantém histórico controlado
  if (S.syncQueue.length > 100) {
    S.syncQueue = S.syncQueue.slice(S.syncQueue.length - 100);
  }
  return entrada;
}

/**
 * Calcula o resumo financeiro ou de tarefas de uma lista com precisão de centavos.
 */
function calcularResumoLista(listaOuId) {
  const lista = typeof listaOuId === 'string'
    ? (S.listas || []).find(l => l.id === listaOuId)
    : listaOuId;

  if (!lista) {
    return {
      totalItens: 0,
      itensPendentes: 0,
      itensComprados: 0,
      concluidas: 0,
      pendentes: 0,
      pctConcluido: 0,
      totalEstimado: 0,
      totalCarrinho: 0,
      totalCarrinhoCentavos: 0,
      totalEstimadoCentavos: 0
    };
  }

  const itens = Array.isArray(lista.itens) ? lista.itens : [];
  const totalItens = itens.length;

  if (lista.tipo === 'compras') {
    const itensPendentes = itens.filter(i => !i.comprado).length;
    const itensComprados = itens.filter(i => i.comprado).length;

    let somaEstimada = 0;
    let somaCarrinho = 0;

    itens.forEach(i => {
      const qtd = Number(i.qtd) > 0 ? Number(i.qtd) : 1;
      const preco = Number(i.precoEstimado) > 0 ? Number(i.precoEstimado) : 0;
      const totalItem = Math.round(qtd * preco * 100) / 100;
      somaEstimada += totalItem;
      if (i.comprado) {
        somaCarrinho += totalItem;
      }
    });

    somaEstimada = Math.round(somaEstimada * 100) / 100;
    somaCarrinho = Math.round(somaCarrinho * 100) / 100;

    return {
      totalItens,
      itensPendentes,
      itensComprados,
      totalEstimado: somaEstimada,
      totalCarrinho: somaCarrinho,
      totalCarrinhoCentavos: Math.round(somaCarrinho * 100),
      totalEstimadoCentavos: Math.round(somaEstimada * 100)
    };
  } else {
    // tipo === 'tarefas'
    const concluidas = itens.filter(i => i.concluida).length;
    const pendentes = totalItens - concluidas;
    const pctConcluido = totalItens > 0 ? Math.round((concluidas / totalItens) * 100) : 0;

    return {
      totalItens,
      concluidas,
      pendentes,
      pctConcluido
    };
  }
}

/**
 * Cria uma nova lista familiar (compras ou tarefas).
 */
function criarListaFamiliar(dados) {
  if (!dados || !dados.titulo) return null;
  const tituloLimpo = dados.titulo.trim();
  if (!tituloLimpo) return null;

  if (!S) return null;
  if (!Array.isArray(S.listas)) S.listas = [];

  const tipo = dados.tipo === 'tarefas' ? 'tarefas' : 'compras';
  const iconePadrao = tipo === 'compras' ? '🛒' : '✅';
  const corPadrao = tipo === 'compras' ? '#10B981' : '#5581E3';

  const novaLista = {
    id: dados.id || ('lst_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6)),
    circuloId: dados.circuloId || S.circuloAtivoId || 'circ_1',
    titulo: tituloLimpo,
    tipo,
    icone: dados.icone || iconePadrao,
    cor: dados.cor || corPadrao,
    criadoPor: dados.criadoPor || S.membroAtivoId || 'm_1',
    criadoEm: dados.criadoEm || new Date().toISOString(),
    itens: Array.isArray(dados.itens) ? dados.itens : []
  };

  S.listas.push(novaLista);
  adicionarNaFilaSync('listas', 'insert', novaLista);

  registrarNotificacaoFamilia({
    tipo: 'listas',
    titulo: 'Nova Lista Familiar',
    texto: `Lista "${tituloLimpo}" criada por ${obterMembroAtivo().nome}`,
    linkTela: 'listas'
  });

  save();
  render();
  return novaLista;
}

/**
 * Exclui uma lista familiar.
 */
function excluirListaFamiliar(listaId) {
  if (!S || !Array.isArray(S.listas)) return false;
  const idx = S.listas.findIndex(l => l.id === listaId);
  if (idx < 0) return false;

  const removida = S.listas.splice(idx, 1)[0];
  if (listaAtivaId === listaId) {
    listaAtivaId = null;
  }

  adicionarNaFilaSync('listas', 'delete', { id: listaId });

  registrarNotificacaoFamilia({
    tipo: 'listas',
    titulo: 'Lista Excluída',
    texto: `Lista "${removida.titulo}" foi removida`,
    linkTela: 'listas'
  });

  save();
  render();
  return true;
}

/**
 * Emite notificações agrupadas para adições consecutivas de itens na mesma lista em 15 segundos.
 */
function dispararNotificacaoAgrupadaItens(lista, membroNome, qtdAdicionada = 1) {
  const agora = Date.now();
  if (bufferNotifItensLista.listaId === lista.id && (agora - bufferNotifItensLista.timestamp) < 15000) {
    bufferNotifItensLista.quantidade += qtdAdicionada;
    bufferNotifItensLista.timestamp = agora;
  } else {
    bufferNotifItensLista.listaId = lista.id;
    bufferNotifItensLista.membroNome = membroNome;
    bufferNotifItensLista.listaTitulo = lista.titulo;
    bufferNotifItensLista.quantidade = qtdAdicionada;
    bufferNotifItensLista.timestamp = agora;
  }

  const texto = bufferNotifItensLista.quantidade > 1
    ? `${membroNome} adicionou ${bufferNotifItensLista.quantidade} itens na lista "${lista.titulo}"`
    : `${membroNome} adicionou item na lista "${lista.titulo}"`;

  registrarNotificacaoFamilia({
    tipo: 'listas',
    titulo: 'Item Adicionado',
    texto,
    linkTela: 'listas'
  });
}

/**
 * Adiciona um item de compra ou tarefa To-Do a uma lista existente.
 */
function adicionarItemLista(listaId, dadosItem) {
  if (!S || !Array.isArray(S.listas) || !dadosItem) return null;
  const lista = S.listas.find(l => l.id === listaId);
  if (!lista) return null;
  if (!Array.isArray(lista.itens)) lista.itens = [];

  const membro = obterMembroAtivo();
  const agoraIso = new Date().toISOString();
  let novoItem = null;

  if (lista.tipo === 'compras') {
    const nomeLimpo = (dadosItem.nome || '').trim();
    if (!nomeLimpo) return null;

    const qtd = Number(dadosItem.qtd) > 0 ? Number(dadosItem.qtd) : 1;
    const unidade = (dadosItem.unidade || 'un').trim();
    const categoria = dadosItem.categoria && CATEGORIAS_MERCADO[dadosItem.categoria] ? dadosItem.categoria : 'mercearia';
    const preco = Number(dadosItem.precoEstimado) >= 0 ? Math.round(Number(dadosItem.precoEstimado) * 100) / 100 : 0;

    novoItem = {
      id: dadosItem.id || ('item_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5)),
      nome: nomeLimpo,
      qtd,
      unidade,
      categoria,
      precoEstimado: preco,
      comprado: Boolean(dadosItem.comprado),
      criadoPorNome: dadosItem.criadoPorNome || membro.nome,
      criadoPorCor: dadosItem.criadoPorCor || membro.cor,
      criadoEm: dadosItem.criadoEm || agoraIso
    };

    lista.itens.push(novoItem);

    // Aprendizado contínuo do histórico de itens frequentes
    if (!Array.isArray(S.historicoCompras)) S.historicoCompras = [];
    const itemHist = S.historicoCompras.find(h => h.nome.toLowerCase() === nomeLimpo.toLowerCase());
    if (itemHist) {
      itemHist.vezesUsado = (itemHist.vezesUsado || 1) + 1;
      if (preco > 0) itemHist.precoUltimo = preco;
      itemHist.categoria = categoria;
    } else {
      S.historicoCompras.push({
        nome: nomeLimpo,
        categoria,
        precoUltimo: preco,
        vezesUsado: 1
      });
    }

  } else {
    // tipo === 'tarefas'
    const tituloLimpo = (dadosItem.titulo || '').trim();
    if (!tituloLimpo) return null;

    const respId = dadosItem.responsavelId || S.membroAtivoId;
    const respObj = (S.membrosPerfil || []).find(m => m.id === respId) || membro;

    novoItem = {
      id: dadosItem.id || ('item_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5)),
      titulo: tituloLimpo,
      responsavelId: respObj.id,
      responsavelNome: respObj.nome,
      responsavelCor: respObj.cor,
      prazo: dadosItem.prazo || '',
      prioridade: ['alta', 'media', 'baixa'].includes(dadosItem.prioridade) ? dadosItem.prioridade : 'media',
      recorrencia: ['nenhuma', 'diaria', 'semanal', 'mensal'].includes(dadosItem.recorrencia) ? dadosItem.recorrencia : 'nenhuma',
      concluida: Boolean(dadosItem.concluida),
      criadoPorNome: dadosItem.criadoPorNome || membro.nome,
      criadoEm: dadosItem.criadoEm || agoraIso
    };

    lista.itens.push(novoItem);
  }

  adicionarNaFilaSync('itens_lista', 'insert', { listaId, item: novoItem });
  dispararNotificacaoAgrupadaItens(lista, membro.nome, 1);

  save();
  render();
  return novoItem;
}

/**
 * Calcula a data da próxima ocorrência para tarefas recorrentes (+1 dia, +7 dias ou +1 mês).
 */
function calcularProximoPrazoRecorrente(prazoBase, recorrencia) {
  const base = prazoBase || new Date().toISOString().slice(0, 10);
  const [y, m, d] = base.split('-').map(Number);
  const dataObj = new Date(y, m - 1, d);

  if (recorrencia === 'diaria') {
    dataObj.setDate(dataObj.getDate() + 1);
  } else if (recorrencia === 'semanal') {
    dataObj.setDate(dataObj.getDate() + 7);
  } else if (recorrencia === 'mensal') {
    dataObj.setMonth(dataObj.getMonth() + 1);
  }

  const ano = dataObj.getFullYear();
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const dia = String(dataObj.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Alterna o estado de um item (comprado em compras, ou concluída em tarefas).
 * Para tarefas recorrentes, cria automaticamente a próxima ocorrência com o novo prazo!
 */
function toggleItemLista(listaId, itemId) {
  if (!S || !Array.isArray(S.listas)) return null;
  const lista = S.listas.find(l => l.id === listaId);
  if (!lista || !Array.isArray(lista.itens)) return null;

  const item = lista.itens.find(i => i.id === itemId);
  if (!item) return null;

  const membro = obterMembroAtivo();

  if (lista.tipo === 'compras') {
    item.comprado = !item.comprado;
    if (item.comprado) {
      item.compradoPor = membro.nome;
      item.compradoEm = new Date().toISOString();
      if (Array.isArray(S.historicoCompras)) {
        const h = S.historicoCompras.find(x => x.nome.toLowerCase() === item.nome.toLowerCase());
        if (h) h.vezesUsado = (h.vezesUsado || 1) + 1;
      }
    } else {
      delete item.compradoPor;
      delete item.compradoEm;
    }

    adicionarNaFilaSync('itens_lista', 'update', { listaId, itemId, comprado: item.comprado });
  } else {
    // tipo === 'tarefas'
    item.concluida = !item.concluida;
    if (item.concluida) {
      item.concluidaPor = membro.nome;
      item.concluidaEm = new Date().toISOString();

      // Tarefa Recorrente: gera automaticamente a próxima ocorrência na lista
      if (item.recorrencia && item.recorrencia !== 'nenhuma') {
        const novoPrazo = calcularProximoPrazoRecorrente(item.prazo, item.recorrencia);
        const proximaTarefa = {
          id: 'item_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
          titulo: item.titulo,
          responsavelId: item.responsavelId,
          responsavelNome: item.responsavelNome,
          responsavelCor: item.responsavelCor,
          prazo: novoPrazo,
          prioridade: item.prioridade,
          recorrencia: item.recorrencia,
          concluida: false,
          criadoPorNome: item.criadoPorNome || membro.nome,
          criadoEm: new Date().toISOString()
        };

        lista.itens.push(proximaTarefa);
        adicionarNaFilaSync('itens_lista', 'insert', { listaId, item: proximaTarefa });

        registrarNotificacaoFamilia({
          tipo: 'listas',
          titulo: 'Tarefa Concluída & Reagendada',
          texto: `"${item.titulo}" concluída por ${membro.nome}! Próxima agendada para ${novoPrazo}`,
          linkTela: 'listas'
        });
      }
    } else {
      delete item.concluidaPor;
      delete item.concluidaEm;
    }

    adicionarNaFilaSync('itens_lista', 'update', { listaId, itemId, concluida: item.concluida });
  }

  save();
  render();
  return item;
}

/**
 * Remove um item da lista.
 */
function excluirItemLista(listaId, itemId) {
  if (!S || !Array.isArray(S.listas)) return false;
  const lista = S.listas.find(l => l.id === listaId);
  if (!lista || !Array.isArray(lista.itens)) return false;

  const idx = lista.itens.findIndex(i => i.id === itemId);
  if (idx < 0) return false;

  lista.itens.splice(idx, 1);
  adicionarNaFilaSync('itens_lista', 'delete', { listaId, itemId });

  save();
  render();
  return true;
}

/**
 * Readiciona com 1 toque um item do histórico frequente de compras à lista.
 */
function readicionarItemFrequente(listaId, nomeItem) {
  if (!S) return null;
  const hist = (S.historicoCompras || []).find(h => h.nome.toLowerCase() === String(nomeItem || '').toLowerCase());
  const dados = {
    nome: hist ? hist.nome : nomeItem,
    qtd: 1,
    unidade: 'un',
    categoria: hist ? hist.categoria : 'mercearia',
    precoEstimado: hist ? (hist.precoUltimo || 0) : 0,
    comprado: false
  };
  return adicionarItemLista(listaId, dados);
}

/**
 * Converte itens de compras comprados no carrinho em um lançamento de gasto financeiro (Seção 4.5).
 * Blindado contra acesso do perfil 'crianca'.
 */
function converterListaEmGasto(listaId, dadosOverride = {}) {
  const membroAtivo = obterMembroAtivo();
  if (membroAtivo && membroAtivo.papel === 'crianca') {
    if (typeof alert === 'function') {
      alert('Acesso financeiro restrito aos responsáveis adultos da família.');
    }
    return { ok: false, motivo: 'perfil_crianca' };
  }

  if (!S || !Array.isArray(S.listas)) return { ok: false, motivo: 'sem_listas' };
  const lista = S.listas.find(l => l.id === listaId);
  if (!lista || lista.tipo !== 'compras') return { ok: false, motivo: 'lista_invalida' };

  const resumo = calcularResumoLista(lista);
  let valorFinal = dadosOverride.valor !== undefined
    ? Number(dadosOverride.valor)
    : resumo.totalCarrinho;

  valorFinal = Math.round((Number(valorFinal) || 0) * 100) / 100;
  if (valorFinal <= 0) {
    if (typeof alert === 'function') {
      alert('Marque pelo menos um item no carrinho com preço estimado para converter em gasto financeiro.');
    }
    return { ok: false, motivo: 'valor_zerado' };
  }

  const titularFinal = dadosOverride.titular || membroAtivo.nome || 'Família';
  const descFinal = dadosOverride.desc || `Mercado: ${lista.titulo}`;
  const dataFinal = dadosOverride.data || new Date().toISOString().slice(0, 10);
  const catFinal = dadosOverride.cat || 'recorrente';

  if (!Array.isArray(S.gastos)) S.gastos = [];

  const origemSel = dadosOverride.origemPagamento || dadosOverride.forcarOrigem || 'auto';
  const novoGastoBase = {
    id: Date.now(),
    desc: descFinal,
    val: valorFinal,
    cat: catFinal,
    titular: titularFinal,
    data: dataFinal,
    origemPagamento: origemSel,
    origemListaId: listaId,
    parcelado: false,
    recorrente: false,
    pago: true,
    dataPagto: dataFinal
  };

  const novoGasto = registrarGastoComBeneficio(novoGastoBase);
  S.gastos.push(novoGasto);
  adicionarNaFilaSync('lancamentos_financeiros', 'insert', novoGasto);

  // Limpa itens comprados da lista após a conversão para gasto
  if (dadosOverride.limparComprados !== false) {
    lista.itens = lista.itens.filter(i => !i.comprado);
  }

  registrarNotificacaoFamilia({
    tipo: 'financas',
    titulo: 'Compras Lançadas no Orçamento',
    texto: `${descFinal} (${fmt(valorFinal)}) por ${titularFinal}`,
    valor: valorFinal,
    linkTela: 'gastos'
  });

  save();
  render();
  return { ok: true, gasto: novoGasto, valor: valorFinal };
}

// --- FUNÇÕES DE NAVEGAÇÃO E MODAIS DE LISTAS ---

function abrirModuloFamiliar(moduloId) {
  if (moduloId === 'listas') {
    go('listas');
  } else {
    go(moduloId);
  }
}

function abrirListaDetalhe(listaId) {
  listaAtivaId = listaId;
  if (typeof document !== 'undefined') {
    const visaoGrade = document.getElementById('listas-visao-grade');
    const visaoDetalhe = document.getElementById('listas-visao-detalhe');
    if (visaoGrade) visaoGrade.style.display = 'none';
    if (visaoDetalhe) visaoDetalhe.style.display = 'block';
  }
  renderListas();
}

function fecharListaDetalhe() {
  listaAtivaId = null;
  if (typeof document !== 'undefined') {
    const visaoGrade = document.getElementById('listas-visao-grade');
    const visaoDetalhe = document.getElementById('listas-visao-detalhe');
    if (visaoGrade) visaoGrade.style.display = 'block';
    if (visaoDetalhe) visaoDetalhe.style.display = 'none';
  }
  renderListas();
}

function filtrarTipoListas(tipo) {
  filtroTipoListasAtual = tipo;
  if (typeof document !== 'undefined') {
    ['flt-listas-todas', 'flt-listas-compras', 'flt-listas-tarefas'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('sel');
    });
    const target = tipo === 'compras' ? 'flt-listas-compras' : tipo === 'tarefas' ? 'flt-listas-tarefas' : 'flt-listas-todas';
    const el = document.getElementById(target);
    if (el) el.classList.add('sel');
  }
  renderListas();
}

function filtrarMembroTarefas(membroId) {
  filtroMembroTarefasAtual = membroId;
  renderListas();
}

function abrirModalNovaLista() {
  if (typeof document === 'undefined') return;
  const tInput = document.getElementById('nl-titulo');
  if (tInput) tInput.value = '';

  const tipoSelect = document.getElementById('nl-tipo');
  if (tipoSelect) tipoSelect.value = 'compras';

  selecionarIconeNovaLista('🛒');
  selecionarCorNovaLista('#10B981');

  // Paleta de cores para lista
  const coresContainer = document.getElementById('nl-cores-grid') || document.getElementById('nl-cor-grid');
  if (coresContainer) {
    coresContainer.innerHTML = PALETA_FAMILIAR.map(c => `
      <div data-cor="${c}" onclick="selecionarCorNovaLista('${c}')" style="width:28px;height:28px;border-radius:50%;background:${c};cursor:pointer;border:2px solid ${c === '#10B981' ? '#fff' : 'transparent'};"></div>
    `).join('');
  }

  openM('m-nova-lista');
}

function atualizarOpcoesNovaListaModal() {
  const tipoSelect = document.getElementById('nl-tipo');
  if (!tipoSelect) return;
  if (tipoSelect.value === 'tarefas') {
    selecionarIconeNovaLista('✅');
    selecionarCorNovaLista('#5581E3');
  } else {
    selecionarIconeNovaLista('🛒');
    selecionarCorNovaLista('#10B981');
  }
}

function selecionarTipoNovaLista() {
  return atualizarOpcoesNovaListaModal();
}

function selecionarIconeNovaLista(icone) {
  const hiddenInput = document.getElementById('nl-icone');
  if (hiddenInput) hiddenInput.value = icone;
  if (typeof document !== 'undefined') {
    document.querySelectorAll('#nl-icones-grid button, #nl-icone-grid button').forEach(btn => {
      if (btn.dataset.icone === icone) btn.classList.add('sel');
      else btn.classList.remove('sel');
    });
  }
}

function selecionarCorNovaLista(cor) {
  const hiddenInput = document.getElementById('nl-cor');
  if (hiddenInput) hiddenInput.value = cor;
  if (typeof document !== 'undefined') {
    document.querySelectorAll('#nl-cores-grid div, #nl-cor-grid div').forEach(d => {
      d.style.borderColor = d.dataset.cor === cor ? '#fff' : 'transparent';
    });
  }
}

function salvarNovaListaModal() {
  const tituloEl = document.getElementById('nl-titulo');
  const tipoEl = document.getElementById('nl-tipo');
  const iconeEl = document.getElementById('nl-icone');
  const corEl = document.getElementById('nl-cor');

  const titulo = tituloEl ? tituloEl.value.trim() : '';
  const tipo = tipoEl ? tipoEl.value : 'compras';
  const icone = iconeEl ? iconeEl.value : (tipo === 'compras' ? '🛒' : '✅');
  const cor = corEl ? corEl.value : '#10B981';

  if (!titulo) {
    if (typeof alert === 'function') alert('Informe o título da lista.');
    return;
  }

  const nova = criarListaFamiliar({ titulo, tipo, icone, cor });
  closeM('m-nova-lista');
  if (nova) {
    abrirListaDetalhe(nova.id);
  }
}

function adicionarItemCompraModal() {
  if (!listaAtivaId) return;
  const nomeEl = document.getElementById('item-compra-nome');
  const qtdEl = document.getElementById('item-compra-qtd');
  const unEl = document.getElementById('item-compra-unidade');
  const precoEl = document.getElementById('item-compra-preco');
  const catEl = document.getElementById('item-compra-categoria');

  const nome = nomeEl ? nomeEl.value.trim() : '';
  const qtd = qtdEl ? parseFloat(qtdEl.value) : 1;
  const unidade = unEl ? unEl.value : 'un';
  const precoEstimado = precoEl ? parseFloat(precoEl.value) || 0 : 0;
  const categoria = catEl ? catEl.value : 'mercearia';

  if (!nome) {
    if (typeof alert === 'function') alert('Informe o nome do item para adicionar à lista.');
    return;
  }

  adicionarItemLista(listaAtivaId, { nome, qtd, unidade, precoEstimado, categoria });
  if (nomeEl) nomeEl.value = '';
  if (precoEl) precoEl.value = '';
}

function adicionarTarefaModal() {
  if (!listaAtivaId) return;
  const titEl = document.getElementById('tarefa-titulo');
  const respEl = document.getElementById('tarefa-responsavel');
  const prazoEl = document.getElementById('tarefa-prazo');
  const prioEl = document.getElementById('tarefa-prioridade');
  const recEl = document.getElementById('tarefa-recorrencia');

  const titulo = titEl ? titEl.value.trim() : '';
  const responsavelId = respEl ? respEl.value : S.membroAtivoId;
  const prazo = prazoEl ? prazoEl.value : '';
  const prioridade = prioEl ? prioEl.value : 'media';
  const recorrencia = recEl ? recEl.value : 'nenhuma';

  if (!titulo) {
    if (typeof alert === 'function') alert('Informe o título da tarefa.');
    return;
  }

  adicionarItemLista(listaAtivaId, { titulo, responsavelId, prazo, prioridade, recorrencia });
  if (titEl) titEl.value = '';
}

function abrirModalConverterGastoLista() {
  if (!listaAtivaId) return;
  const lista = (S.listas || []).find(l => l.id === listaAtivaId);
  if (!lista) return;

  const resumo = calcularResumoLista(lista);
  if (resumo.totalCarrinho <= 0) {
    if (typeof alert === 'function') alert('Marque os itens no carrinho antes de converter para despesa financeira.');
    return;
  }

  listaParaConverterId = listaAtivaId;

  const txtTotal = document.getElementById('cvg-total-carrinho-txt');
  if (txtTotal) txtTotal.textContent = fmt(resumo.totalCarrinho);

  const valorInput = document.getElementById('cvg-valor');
  if (valorInput) valorInput.value = resumo.totalCarrinho.toFixed(2);

  const descInput = document.getElementById('cvg-desc');
  if (descInput) descInput.value = `Mercado: ${lista.titulo}`;

  const dataInput = document.getElementById('cvg-data');
  if (dataInput) dataInput.value = new Date().toISOString().slice(0, 10);

  // Preenche titulares disponíveis
  const titSelect = document.getElementById('cvg-titular');
  if (titSelect) {
    const membros = (S.membrosPerfil || []).filter(m => m.papel !== 'crianca');
    titSelect.innerHTML = membros.map(m => `<option value="${escapeHtml(m.nome)}">${escapeHtml(m.nome)}</option>`).join('');
  }

  // Preenche categorias de finanças
  const catSelect = document.getElementById('cvg-categoria');
  if (catSelect) {
    const cats = S.categoriasGastos || DEFAULT_CATEGORIAS_GASTOS;
    catSelect.innerHTML = cats.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.nome)}</option>`).join('');
  }

  openM('m-converter-gasto-lista');
}

function confirmarConverterGastoModal() {
  if (!listaParaConverterId) return;
  const valorInput = document.getElementById('cvg-valor');
  const descInput = document.getElementById('cvg-desc');
  const titSelect = document.getElementById('cvg-titular');
  const catSelect = document.getElementById('cvg-categoria');
  const dataInput = document.getElementById('cvg-data');
  const limparChk = document.getElementById('cvg-limpar-comprados');

  const valor = valorInput ? parseFloat(valorInput.value) : 0;
  const desc = descInput ? descInput.value.trim() : '';
  const titular = titSelect ? titSelect.value : '';
  const cat = catSelect ? catSelect.value : 'recorrente';
  const data = dataInput ? dataInput.value : '';
  const limparComprados = limparChk ? limparChk.checked : true;

  if (!valor || valor <= 0) {
    if (typeof alert === 'function') alert('Informe um valor válido para o lançamento.');
    return;
  }

  const origemSel = document.getElementById('cvg-origem-pagamento')?.value || 'auto';
  const res = converterListaEmGasto(listaParaConverterId, { valor, desc, titular, cat, data, limparComprados, origemPagamento: origemSel });
  if (res.ok) {
    closeM('m-converter-gasto-lista');
    listaParaConverterId = null;
    exibirToastNotificacao(`Despesa de ${fmt(valor)} lançada no Orçamento!`, '💳');
  }
}

function confirmarExcluirListaAtual() {
  if (!listaAtivaId) return;
  const lista = (S.listas || []).find(l => l.id === listaAtivaId);
  if (!lista) return;

  if (typeof confirm === 'function' && !confirm(`Tem certeza de que deseja excluir a lista "${lista.titulo}"?`)) {
    return;
  }

  excluirListaFamiliar(listaAtivaId);
}

function excluirListaAtualDetalhe() {
  return confirmarExcluirListaAtual();
}

/**
 * Renderizador mestre da interface de Listas e Tarefas da Etapa 2.
 */
function renderListas() {
  if (typeof document === 'undefined') return;

  const visaoGrade = document.getElementById('listas-visao-grade');
  const visaoDetalhe = document.getElementById('listas-visao-detalhe');
  if (!visaoGrade || !visaoDetalhe) return;

  const membroAtivo = obterMembroAtivo();
  const isCrianca = membroAtivo && membroAtivo.papel === 'crianca';

  // Se nenhuma lista específica estiver aberta, exibe a grade geral
  if (!listaAtivaId) {
    visaoGrade.style.display = 'block';
    visaoDetalhe.style.display = 'none';

    const gradeCards = document.getElementById('listas-grade-cards');
    if (!gradeCards) return;

    const listas = (S.listas || []).filter(l => {
      if (filtroTipoListasAtual === 'compras') return l.tipo === 'compras';
      if (filtroTipoListasAtual === 'tarefas') return l.tipo === 'tarefas';
      return true;
    });

    if (listas.length === 0) {
      gradeCards.innerHTML = `
        <div class="card" style="text-align:center;padding:32px 16px;color:var(--muted);">
          <p style="font-size:32px;margin-bottom:8px;">📝</p>
          <p style="font-weight:700;font-size:15px;color:var(--text);margin-bottom:4px;">Nenhuma lista encontrada</p>
          <p style="font-size:12px;margin-bottom:14px;">Crie uma lista de compras para feira e mercado ou tarefas para organizar a casa.</p>
          <button type="button" class="btn btn-primary" style="max-width:200px;margin:0 auto;padding:10px;" onclick="abrirModalNovaLista()">+ Nova Lista</button>
        </div>
      `;
      return;
    }

    gradeCards.innerHTML = listas.map(l => {
      const res = calcularResumoLista(l);
      const isCompras = l.tipo === 'compras';

      let detalheHtml = '';
      if (isCompras) {
        detalheHtml = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:12px;">
            <span style="color:var(--muted);">${res.itensPendentes} pendentes • ${res.itensComprados} no carrinho</span>
            ${!isCrianca && res.totalEstimado > 0 ? `<span style="font-weight:700;color:var(--green);">${fmt(res.totalEstimado)} est.</span>` : ''}
          </div>
        `;
      } else {
        detalheHtml = `
          <div style="margin-top:10px;">
            <div class="prog-row" style="margin-bottom:3px;font-size:11px;">
              <span>${res.concluidas} de ${res.totalItens} concluídas</span>
              <span style="font-weight:700;">${res.pctConcluido}%</span>
            </div>
            <div class="prog-bar"><div class="prog-fill" style="width:${res.pctConcluido}%;background:${l.cor || 'var(--primary)'};"></div></div>
          </div>
        `;
      }

      return `
        <div class="card" style="margin-bottom:8px;cursor:pointer;border-left:4px solid ${l.cor || 'var(--primary)'};" onclick="abrirListaDetalhe('${l.id}')">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:38px;height:38px;border-radius:10px;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:20px;">
                ${l.icone || (isCompras ? '🛒' : '✅')}
              </div>
              <div>
                <h4 style="font-size:15px;font-weight:700;margin:0 0 2px;color:var(--text);">${escapeHtml(l.titulo)}</h4>
                <p style="font-size:11px;color:var(--muted);margin:0;">${isCompras ? 'Lista de Mercado' : 'Tarefas da Rotina'}</p>
              </div>
            </div>
            <span style="font-size:12px;color:var(--primary);font-weight:700;">Abrir →</span>
          </div>
          ${detalheHtml}
        </div>
      `;
    }).join('');

    return;
  }

  // --- VISÃO DETALHADA DA LISTA SELECIONADA ---
  visaoGrade.style.display = 'none';
  visaoDetalhe.style.display = 'block';

  const lista = (S.listas || []).find(l => l.id === listaAtivaId);
  if (!lista) {
    fecharListaDetalhe();
    return;
  }

  const isCompras = lista.tipo === 'compras';
  const res = calcularResumoLista(lista);

  // Preenche dados do card cabeçalho
  const ldIcone = document.getElementById('ld-icone');
  const ldTitulo = document.getElementById('ld-titulo');
  const ldSubinfo = document.getElementById('ld-subinfo');
  const ldBadge = document.getElementById('ld-badge-tipo');
  const ldResumo = document.getElementById('ld-bloco-resumo');

  if (ldIcone) ldIcone.textContent = lista.icone || (isCompras ? '🛒' : '✅');
  if (ldTitulo) ldTitulo.textContent = lista.titulo;
  if (ldSubinfo) {
    const criador = (S.membrosPerfil || []).find(m => m.id === lista.criadoPor);
    ldSubinfo.textContent = `Criada por ${criador ? criador.nome : 'Família'} • ${lista.itens?.length || 0} itens`;
  }
  if (ldBadge) {
    ldBadge.textContent = isCompras ? '🛒 Compras' : '✅ To-Do';
    ldBadge.style.background = isCompras ? 'rgba(16,185,129,0.15)' : 'rgba(85,129,227,0.15)';
    ldBadge.style.color = isCompras ? 'var(--green)' : 'var(--primary)';
  }

  if (ldResumo) {
    if (isCompras) {
      ldResumo.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span style="font-size:11px;color:var(--muted);display:block;">No Carrinho:</span>
            <span style="font-size:18px;font-weight:800;color:var(--green);">${!isCrianca ? fmt(res.totalCarrinho) : `${res.itensComprados} itens`}</span>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11px;color:var(--muted);display:block;">Estimado Total:</span>
            <span style="font-size:15px;font-weight:700;color:var(--text);">${!isCrianca ? fmt(res.totalEstimado) : `${res.totalItens} itens`}</span>
          </div>
        </div>
      `;
    } else {
      ldResumo.innerHTML = `
        <div>
          <div class="prog-row" style="margin-bottom:3px;font-size:11px;">
            <span>${res.concluidas} de ${res.totalItens} tarefas concluídas</span>
            <span style="font-weight:700;">${res.pctConcluido}%</span>
          </div>
          <div class="prog-bar"><div class="prog-fill" style="width:${res.pctConcluido}%;background:${lista.cor || 'var(--primary)'};"></div></div>
        </div>
      `;
    }
  }

  // Alterna formulários
  const fCompra = document.getElementById('form-campos-compra');
  const fTarefa = document.getElementById('form-campos-tarefa');
  const bChips = document.getElementById('ld-bloco-chips-frequentes');
  const bFiltroMembro = document.getElementById('ld-bloco-filtro-membro');
  const bConverterGasto = document.getElementById('ld-bloco-converter-gasto');

  if (isCompras) {
    if (fCompra) fCompra.style.display = 'block';
    if (fTarefa) fTarefa.style.display = 'none';
    if (bFiltroMembro) bFiltroMembro.style.display = 'none';

    // Preenche chips de itens frequentes
    if (bChips) {
      bChips.style.display = 'block';
      const cContainer = document.getElementById('ld-chips-frequentes-container');
      if (cContainer) {
        const frequentes = (S.historicoCompras || []).slice(0, 10);
        cContainer.innerHTML = frequentes.map(item => `
          <button type="button" class="list-chip" onclick="readicionarItemFrequente('${lista.id}', '${escapeHtml(item.nome)}')">
            <span>+ ${escapeHtml(item.nome)}</span>
            ${!isCrianca && item.precoUltimo > 0 ? `<span style="opacity:0.7;font-size:11px;">(${fmt(item.precoUltimo)})</span>` : ''}
          </button>
        `).join('');
      }
    }

    // Botão de converter em gasto
    if (bConverterGasto) {
      bConverterGasto.style.display = (!isCrianca && res.itensComprados > 0) ? 'block' : 'none';
    }

  } else {
    // tipo === 'tarefas'
    if (fCompra) fCompra.style.display = 'none';
    if (fTarefa) fTarefa.style.display = 'block';
    if (bChips) bChips.style.display = 'none';
    if (bConverterGasto) bConverterGasto.style.display = 'none';

    // Preenche seletor de responsáveis no formulário
    const respSelect = document.getElementById('tarefa-responsavel');
    if (respSelect) {
      respSelect.innerHTML = (S.membrosPerfil || []).map(m => `
        <option value="${m.id}" ${m.id === S.membroAtivoId ? 'selected' : ''}>${escapeHtml(m.nome)}</option>
      `).join('');
    }

    // Preenche filtro de responsáveis
    if (bFiltroMembro) {
      bFiltroMembro.style.display = 'block';
      const fMembros = document.getElementById('ld-filtro-membros-container');
      if (fMembros) {
        fMembros.innerHTML = [
          `<button type="button" class="filtro-pill ${filtroMembroTarefasAtual === 'todos' ? 'sel' : ''}" onclick="filtrarMembroTarefas('todos')">Todos</button>`,
          ...(S.membrosPerfil || []).map(m => `
            <button type="button" class="filtro-pill ${filtroMembroTarefasAtual === m.id ? 'sel' : ''}" onclick="filtrarMembroTarefas('${m.id}')">${escapeHtml(m.nome)}</button>
          `)
        ].join('');
      }
    }
  }

  // --- RENDERIZAÇÃO DOS ITENS PENDENTES E CONCLUÍDOS ---
  const pendentesContainer = document.getElementById('ld-itens-pendentes-container');
  const concluidosContainer = document.getElementById('ld-itens-concluidos-container');
  if (!pendentesContainer || !concluidosContainer) return;

  const itens = Array.isArray(lista.itens) ? lista.itens : [];

  if (isCompras) {
    // ITENS DE COMPRA
    const pendentes = itens.filter(i => !i.comprado);
    const comprados = itens.filter(i => i.comprado);

    if (pendentes.length === 0) {
      pendentesContainer.innerHTML = `
        <div class="card" style="text-align:center;padding:20px;color:var(--muted);background:var(--bg2);">
          <p style="font-size:24px;margin-bottom:4px;">🎉</p>
          <p style="font-size:13px;font-weight:600;margin:0;">Nenhum item pendente para comprar.</p>
        </div>
      `;
    } else {
      // Agrupa pendentes por corredor de mercado
      const grupos = {};
      pendentes.forEach(item => {
        const cat = item.categoria || 'outros';
        if (!grupos[cat]) grupos[cat] = [];
        grupos[cat].push(item);
      });

      pendentesContainer.innerHTML = Object.keys(grupos).map(catKey => {
        const catDef = CATEGORIAS_MERCADO[catKey] || CATEGORIAS_MERCADO.outros;
        const itensDesteCorredor = grupos[catKey];

        return `
          <div style="margin-bottom:12px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              <span style="font-size:14px;">${catDef.icone}</span>
              <span class="corredor-badge" style="background:${catDef.cor}22;color:${catDef.cor};">${escapeHtml(catDef.nome)}</span>
              <span style="font-size:11px;color:var(--muted);">(${itensDesteCorredor.length})</span>
            </div>
            ${itensDesteCorredor.map(item => `
              <div class="item-lista-row">
                <div class="chk-lista-custom" onclick="toggleItemLista('${lista.id}', '${item.id}')" title="Marcar como comprado"></div>
                <div style="flex:1;">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="item-txt-principal" style="font-weight:600;font-size:14px;">${escapeHtml(item.nome)}</span>
                    ${!isCrianca && item.precoEstimado > 0 ? `<span style="font-weight:700;font-size:13px;color:var(--text);">${fmt(item.precoEstimado * item.qtd)}</span>` : ''}
                  </div>
                  <div style="display:flex;gap:6px;align-items:center;font-size:11px;color:var(--muted);margin-top:2px;">
                    <span>${item.qtd} ${escapeHtml(item.unidade || 'un')}</span>
                    ${item.criadoPorNome ? `<span>• Por ${escapeHtml(item.criadoPorNome)}</span>` : ''}
                  </div>
                </div>
                <span class="item-del" onclick="excluirItemLista('${lista.id}', '${item.id}')" title="Excluir item">×</span>
              </div>
            `).join('')}
          </div>
        `;
      }).join('');
    }

    // Seção Carrinho (Itens Comprados)
    if (comprados.length > 0) {
      concluidosContainer.innerHTML = `
        <div style="border-top:1px dashed var(--border2);padding-top:12px;">
          <p style="font-size:12px;font-weight:700;color:var(--green);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">
            🛒 No Carrinho (${comprados.length})
          </p>
          ${comprados.map(item => `
            <div class="item-lista-row concluido">
              <div class="chk-lista-custom checked" onclick="toggleItemLista('${lista.id}', '${item.id}')" title="Retirar do carrinho">✓</div>
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span class="item-txt-principal" style="font-weight:600;font-size:14px;">${escapeHtml(item.nome)}</span>
                  ${!isCrianca && item.precoEstimado > 0 ? `<span style="font-weight:700;font-size:13px;color:var(--muted);">${fmt(item.precoEstimado * item.qtd)}</span>` : ''}
                </div>
                <div style="display:flex;gap:6px;font-size:11px;color:var(--muted);margin-top:2px;">
                  <span>${item.qtd} ${escapeHtml(item.unidade || 'un')}</span>
                  ${item.compradoPor ? `<span>• Comprado por ${escapeHtml(item.compradoPor)}</span>` : ''}
                </div>
              </div>
              <span class="item-del" onclick="excluirItemLista('${lista.id}', '${item.id}')" title="Excluir item">×</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      concluidosContainer.innerHTML = '';
    }

  } else {
    // TAREFAS TO-DO
    let tarefasFiltradas = itens;
    if (filtroMembroTarefasAtual && filtroMembroTarefasAtual !== 'todos') {
      tarefasFiltradas = itens.filter(t => t.responsavelId === filtroMembroTarefasAtual);
    }

    const pendentes = tarefasFiltradas.filter(t => !t.concluida);
    const concluidas = tarefasFiltradas.filter(t => t.concluida);

    if (pendentes.length === 0) {
      pendentesContainer.innerHTML = `
        <div class="card" style="text-align:center;padding:20px;color:var(--muted);background:var(--bg2);">
          <p style="font-size:24px;margin-bottom:4px;">✨</p>
          <p style="font-size:13px;font-weight:600;margin:0;">Nenhuma tarefa pendente!</p>
        </div>
      `;
    } else {
      pendentesContainer.innerHTML = pendentes.map(t => {
        const prioClass = t.prioridade === 'alta' ? 'prio-alta' : t.prioridade === 'baixa' ? 'prio-baixa' : 'prio-media';
        const prioLabel = t.prioridade === 'alta' ? 'Alta' : t.prioridade === 'baixa' ? 'Baixa' : 'Média';
        const recLabel = t.recorrencia && t.recorrencia !== 'nenhuma'
          ? `<span class="badge" style="background:rgba(85,129,227,0.15);color:var(--primary);">🔁 ${t.recorrencia}</span>`
          : '';

        return `
          <div class="item-lista-row">
            <div class="chk-lista-custom" onclick="toggleItemLista('${lista.id}', '${t.id}')" title="Concluir tarefa"></div>
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <span class="item-txt-principal" style="font-weight:600;font-size:14px;">${escapeHtml(t.titulo)}</span>
                <span class="prio-pill ${prioClass}">${prioLabel}</span>
              </div>
              <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:11px;color:var(--muted);margin-top:3px;">
                <span style="font-weight:700;color:${t.responsavelCor || 'var(--primary)'};">👤 ${escapeHtml(t.responsavelNome || 'Família')}</span>
                ${t.prazo ? `<span>• 📅 ${t.prazo}</span>` : ''}
                ${recLabel}
              </div>
            </div>
            <span class="item-del" onclick="excluirItemLista('${lista.id}', '${t.id}')" title="Excluir tarefa">×</span>
          </div>
        `;
      }).join('');
    }

    if (concluidas.length > 0) {
      concluidosContainer.innerHTML = `
        <div style="border-top:1px dashed var(--border2);padding-top:12px;">
          <p style="font-size:12px;font-weight:700;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">
            ✓ Concluídas (${concluidas.length})
          </p>
          ${concluidas.map(t => `
            <div class="item-lista-row concluido">
              <div class="chk-lista-custom checked" onclick="toggleItemLista('${lista.id}', '${t.id}')" title="Reabrir tarefa">✓</div>
              <div style="flex:1;">
                <span class="item-txt-principal" style="font-weight:600;font-size:14px;">${escapeHtml(t.titulo)}</span>
                <div style="display:flex;gap:6px;font-size:11px;color:var(--muted);margin-top:2px;">
                  <span>👤 ${escapeHtml(t.responsavelNome || 'Família')}</span>
                  ${t.concluidaPor ? `<span>• Feito por ${escapeHtml(t.concluidaPor)}</span>` : ''}
                </div>
              </div>
              <span class="item-del" onclick="excluirItemLista('${lista.id}', '${t.id}')" title="Excluir tarefa">×</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      concluidosContainer.innerHTML = '';
    }
  }
}

// ============================================================================
// SUPER-APP FAMILIAR V2.0 - CALENDÁRIO COMPARTILHADO & ANIVERSÁRIOS (Etapa 3)
// ============================================================================

// Variáveis de controle e navegação do Calendário
const CORES_CALENDARIO = PALETA_FAMILIAR;

// Upgrade Calendário Pro v2.1 - Catálogo de Cores Nomeadas (Print 2)
const CORES_EVENTO_NOMEADAS = [
  { id: 'hibisco', nome: 'Hibisco', cor: '#D81B60', hex: '#D81B60' },
  { id: 'tangerina', nome: 'Tangerina', cor: '#F4511E', hex: '#F4511E' },
  { id: 'banana', nome: 'Banana', cor: '#F6BF26', hex: '#F6BF26' },
  { id: 'manjericao', nome: 'Manjericão', cor: '#0B8043', hex: '#0B8043' },
  { id: 'salvia', nome: 'Sálvia', cor: '#33B679', hex: '#33B679' },
  { id: 'pavao', nome: 'Pavão', cor: '#039BE5', hex: '#039BE5' },
  { id: 'mirtilo', nome: 'Mirtilo', cor: '#3F51B5', hex: '#3F51B5' },
  { id: 'lavanda', nome: 'Lavanda', cor: '#7986CB', hex: '#7986CB' },
  { id: 'uva', nome: 'Uva', cor: '#8E24AA', hex: '#8E24AA' },
  { id: 'grafite', nome: 'Grafite', cor: '#616161', hex: '#616161' }
];

function obterNomeCorEvento(hexCor) {
  if (!hexCor) return 'Padrão';
  const c = String(hexCor).trim().toUpperCase();
  const encontrada = CORES_EVENTO_NOMEADAS.find(item => item.cor.toUpperCase() === c || (item.hex && item.hex.toUpperCase() === c));
  return encontrada ? encontrada.nome : 'Personalizada';
}

/**
 * Calcula a data do Domingo de Páscoa para qualquer ano do calendário gregoriano.
 * Algoritmo canônico de Meeus/Jones/Butcher.
 * Usa 12:00:00 (meio-dia) para evitar deslocamento de fuso UTC ao serializar data.
 */
function calcularPascoa(ano) {
  const y = Number(ano) || new Date().getFullYear();
  const a = y % 19;
  const b = Math.floor(y / 100);
  const c = y % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const mes = Math.floor((h + L - 7 * m + 114) / 31); // 3 = Março, 4 = Abril
  const dia = ((h + L - 7 * m + 114) % 31) + 1;
  return new Date(y, mes - 1, dia, 12, 0, 0);
}

/**
 * Catálogo e gerador de Feriados Nacionais e Datas Comemorativas do Brasil.
 * Retorna todos os feriados fixos e móveis calculados para o ano solicitado.
 */
function obterFeriadosBrasilAno(ano) {
  const anoNum = Number(ano) || new Date().getFullYear();
  const feriados = [];

  // 1. Feriados Nacionais Fixos do Brasil (formato ISO MM-DD)
  const fixos = [
    { mesDia: '01-01', titulo: 'Confraternização Universal' },
    { mesDia: '04-21', titulo: 'Tiradentes' },
    { mesDia: '05-01', titulo: 'Dia do Trabalho' },
    { mesDia: '09-07', titulo: 'Independência do Brasil' },
    { mesDia: '10-12', titulo: 'Nossa Senhora Aparecida' },
    { mesDia: '10-28', titulo: 'Dia do Servidor Público' },
    { mesDia: '11-02', titulo: 'Finados' },
    { mesDia: '11-15', titulo: 'Proclamação da República' },
    { mesDia: '11-20', titulo: 'Dia da Consciência Negra' },
    { mesDia: '12-25', titulo: 'Natal' }
  ];

  fixos.forEach(f => {
    const dataISO = `${anoNum}-${f.mesDia}`;
    feriados.push({
      id: `feriado_${anoNum}_${f.mesDia.replace('-', '_')}`,
      tipo: 'feriado',
      titulo: f.titulo,
      nome: f.titulo,
      data: dataISO,
      hora: '',
      diaInteiro: true,
      cor: '#10B981',
      icone: '🇧🇷',
      subtexto: 'Feriado Nacional (Brasil)',
      descricao: `Feriado Nacional do Brasil: ${f.titulo}`
    });
  });

  // 2. Feriados Móveis baseados na Páscoa
  const pascoaObj = calcularPascoa(anoNum);

  function somarDias(base, offset) {
    const d = new Date(base);
    d.setDate(d.getDate() + offset);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dia}`;
  }

  // Carnaval: Terça-feira de Carnaval (-47 dias)
  const dataCarnaval = somarDias(pascoaObj, -47);
  feriados.push({
    id: `feriado_${anoNum}_carnaval`,
    tipo: 'feriado',
    titulo: 'Carnaval',
    nome: 'Carnaval',
    data: dataCarnaval,
    hora: '',
    diaInteiro: true,
    cor: '#10B981',
    icone: '🎭',
    subtexto: 'Feriado / Ponto Facultativo',
    descricao: 'Carnaval no Brasil'
  });

  // Sexta-feira Santa: -2 dias da Páscoa
  const dataSextaSanta = somarDias(pascoaObj, -2);
  feriados.push({
    id: `feriado_${anoNum}_sexta_santa`,
    tipo: 'feriado',
    titulo: 'Sexta-feira Santa',
    nome: 'Sexta-feira Santa',
    data: dataSextaSanta,
    hora: '',
    diaInteiro: true,
    cor: '#10B981',
    icone: '🕊️',
    subtexto: 'Feriado Nacional (Brasil)',
    descricao: 'Sexta-feira Santa (Paixão de Cristo)'
  });

  // Domingo de Páscoa
  const dataPascoa = somarDias(pascoaObj, 0);
  feriados.push({
    id: `feriado_${anoNum}_pascoa`,
    tipo: 'feriado',
    titulo: 'Páscoa',
    nome: 'Páscoa',
    data: dataPascoa,
    hora: '',
    diaInteiro: true,
    cor: '#10B981',
    icone: '🐰',
    subtexto: 'Data Comemorativa',
    descricao: 'Domingo de Páscoa'
  });

  // Corpus Christi: +60 dias da Páscoa
  const dataCorpus = somarDias(pascoaObj, 60);
  feriados.push({
    id: `feriado_${anoNum}_corpus_christi`,
    tipo: 'feriado',
    titulo: 'Corpus Christi',
    nome: 'Corpus Christi',
    data: dataCorpus,
    hora: '',
    diaInteiro: true,
    cor: '#10B981',
    icone: '⛪',
    subtexto: 'Ponto Facultativo / Feriado',
    descricao: 'Corpus Christi no Brasil'
  });

  return feriados.sort((a, b) => a.data.localeCompare(b.data));
}

const FERIADOS_BRASIL = obterFeriadosBrasilAno(new Date().getFullYear());

let visaoCalendarioAtual = 'mes'; // 'mes' | 'semana' | 'dia' | 'agenda'
let dataReferenciaCalendario = new Date();
let filtroMembroCalendario = 'todos';
let camadasCalendarioAtivas = {
  eventos: true,
  financas: true,
  tarefas: true,
  aniversarios: true,
  feriados: true
};
let diaSelecionadoCalendario = new Date().toISOString().slice(0, 10);
let eventoEditandoId = null;
let eventoDetalheAtualId = null;

/**
 * Verifica se o membro ativo atual possui permissão para visualizar finanças familiares.
 * O perfil 'crianca' tem bloqueio estrito contra visualização de faturas, contas e gastos previstos.
 */
function membroAtualPodeVerFinancas() {
  const membro = obterMembroAtivo();
  if (!membro) return true;
  return membro.papel !== 'crianca';
}

/**
 * Função mestre de consolidação de compromissos para um determinado período.
 * Agrega:
 * 1. Eventos Familiares (com expansão de repetição diária, semanal, mensal e anual)
 * 2. Contas a Pagar e Pagas (S.gastos) - Se membroAtualPodeVerFinancas() for true
 * 3. Fechamento e Vencimento de Cartões de Crédito (S.cartoes) - Se membroAtualPodeVerFinancas() for true
 * 4. Acordos de Dívidas (S.dividas) - Se membroAtualPodeVerFinancas() for true
 * 5. Tarefas To-Do com Prazo (S.listas)
 * 6. Aniversários da Família com cálculo da idade a completar (S.aniversarios)
 */
function obterEventosConsolidadosPeriodo(dataInicioISO, dataFimISO, filtros = {}) {
  const dtIni = String(dataInicioISO || '').slice(0, 10);
  const dtFim = String(dataFimISO || '').slice(0, 10);
  if (!dtIni || !dtFim) return [];

  const filtroMembro = filtros.membroId || filtroMembroCalendario || 'todos';
  const camadas = Object.assign({}, camadasCalendarioAtivas, filtros.camadas || {});
  const podeVerFinancas = membroAtualPodeVerFinancas();

  const consolidados = [];

  // 1. EVENTOS DO CALENDÁRIO (S.eventosCalendario)
  if (camadas.eventos && Array.isArray(S.eventosCalendario)) {
    S.eventosCalendario.forEach(ev => {
      // Filtro de participante por membro
      if (filtroMembro !== 'todos') {
        const participantes = Array.isArray(ev.participantesIds) ? ev.participantesIds : [];
        if (!participantes.includes(filtroMembro) && ev.criadoPor !== filtroMembro) {
          return;
        }
      }

      const rep = ev.repeticao || 'nenhuma';
      const evDataIni = String(ev.dataInicio || '').slice(0, 10);
      if (!evDataIni) return;

      const gastoVal = podeVerFinancas && Number(ev.gastoPrevisto) > 0 ? Number(ev.gastoPrevisto) : 0;

      // Evento Pontual (sem repetição)
      if (rep === 'nenhuma') {
        if (evDataIni >= dtIni && evDataIni <= dtFim) {
          consolidados.push({
            id: ev.id,
            origemId: ev.id,
            tipo: 'evento',
            titulo: ev.titulo,
            data: evDataIni,
            hora: ev.diaInteiro ? '' : (ev.horaInicio || ''),
            horaFim: ev.diaInteiro ? '' : (ev.horaFim || ''),
            diaInteiro: Boolean(ev.diaInteiro),
            local: ev.local || '',
            descricao: ev.descricao || '',
            cor: ev.cor || '#5581E3',
            icone: '📅',
            subtexto: ev.local ? `📍 ${ev.local}` : (ev.descricao || ''),
            participantesIds: ev.participantesIds || [],
            gastoPrevisto: gastoVal,
            raw: ev
          });
        }
        return;
      }

      // Expansão de Eventos com Repetição (diaria, semanal, mensal, anual)
      const [anoBase, mesBase, diaBase] = evDataIni.split('-').map(Number);
      const [anoFimPeriodo, mesFimPeriodo, diaFimPeriodo] = dtFim.split('-').map(Number);
      const dataObjFim = new Date(anoFimPeriodo, mesFimPeriodo - 1, diaFimPeriodo);

      let dataCursor = new Date(anoBase, mesBase - 1, diaBase);

      // Limite de segurança de iterações para evitar loops infinitos
      let iteracoes = 0;
      const maxIter = 400;

      while (dataCursor <= dataObjFim && iteracoes < maxIter) {
        iteracoes++;
        const anoCur = dataCursor.getFullYear();
        const mesCur = String(dataCursor.getMonth() + 1).padStart(2, '0');
        const diaCur = String(dataCursor.getDate()).padStart(2, '0');
        const dataCurISO = `${anoCur}-${mesCur}-${diaCur}`;

        if (dataCurISO >= dtIni && dataCurISO <= dtFim && dataCurISO >= evDataIni) {
          consolidados.push({
            id: `${ev.id}_rep_${dataCurISO}`,
            origemId: ev.id,
            tipo: 'evento',
            titulo: ev.titulo,
            data: dataCurISO,
            hora: ev.diaInteiro ? '' : (ev.horaInicio || ''),
            horaFim: ev.diaInteiro ? '' : (ev.horaFim || ''),
            diaInteiro: Boolean(ev.diaInteiro),
            local: ev.local || '',
            descricao: ev.descricao || '',
            cor: ev.cor || '#5581E3',
            icone: '📅',
            subtexto: ev.local ? `📍 ${ev.local}` : (ev.descricao || ''),
            participantesIds: ev.participantesIds || [],
            gastoPrevisto: gastoVal,
            repeticao: rep,
            raw: ev
          });
        }

        // Avanço conforme a frequência
        if (rep === 'diaria') {
          dataCursor.setDate(dataCursor.getDate() + 1);
        } else if (rep === 'semanal') {
          dataCursor.setDate(dataCursor.getDate() + 7);
        } else if (rep === 'mensal') {
          dataCursor.setMonth(dataCursor.getMonth() + 1);
        } else if (rep === 'anual') {
          dataCursor.setFullYear(dataCursor.getFullYear() + 1);
        } else {
          break;
        }
      }
    });
  }

  // 2. CONTAS, FATURAS E ACORDOS (Blindagem: NUNCA exibido para perfil 'crianca')
  if (podeVerFinancas && camadas.financas) {
    // 2.1 Despesas de S.gastos
    if (Array.isArray(S.gastos)) {
      S.gastos.forEach(g => {
        const gData = String(g.data || '').slice(0, 10);
        if (gData >= dtIni && gData <= dtFim) {
          const valorVal = Number(g.val) || 0;
          consolidados.push({
            id: `gasto_${g.id}`,
            origemId: g.id,
            tipo: 'conta',
            titulo: `${g.pago ? '✓' : '💸'} ${g.desc} (${fmt(valorVal)})`,
            data: gData,
            hora: '',
            diaInteiro: true,
            cor: g.pago ? '#10B981' : '#EF4444',
            icone: g.pago ? '✓' : '💸',
            subtexto: `${g.titular || 'Família'} • ${g.pago ? 'Pago' : 'A pagar'}`,
            valor: valorVal,
            pago: Boolean(g.pago),
            raw: g
          });
        }
      });
    }

    // 2.2 Vencimento e Fechamento de Cartões de Crédito (S.cartoes)
    if (Array.isArray(S.cartoes)) {
      // Extrai os meses únicos cobertos pelo intervalo
      const [anoI, mesI] = dtIni.split('-').map(Number);
      const [anoF, mesF] = dtFim.split('-').map(Number);
      const mesesNoPeriodo = [];
      let cAno = anoI;
      let cMes = mesI;
      while (cAno < anoF || (cAno === anoF && cMes <= mesF)) {
        mesesNoPeriodo.push(`${cAno}-${String(cMes).padStart(2, '0')}`);
        cMes++;
        if (cMes > 12) {
          cMes = 1;
          cAno++;
        }
      }

      S.cartoes.forEach(cartao => {
        if (!cartao || cartao.ativo === false) return;

        mesesNoPeriodo.forEach(ym => {
          const [aStr, mStr] = ym.split('-');
          const aNum = Number(aStr);
          const mNum = Number(mStr);
          const diasNoMes = new Date(aNum, mNum, 0).getDate();

          // Dia de Fechamento
          const diaFech = Math.min(Number(cartao.diaFechamento) || 1, diasNoMes);
          const dataFechISO = `${ym}-${String(diaFech).padStart(2, '0')}`;
          if (dataFechISO >= dtIni && dataFechISO <= dtFim) {
            consolidados.push({
              id: `fech_cartao_${cartao.id}_${ym}`,
              origemId: cartao.id,
              tipo: 'cartao_fechamento',
              subtipo: 'cartao_fechamento',
              titulo: `🛒 Fechamento Cartão ${cartao.nome}`,
              data: dataFechISO,
              hora: '',
              diaInteiro: true,
              cor: cartao.cor || '#8B5CF6',
              icone: '🛒',
              subtexto: `Melhor dia de compra • Cartão ${cartao.nome}`,
              raw: cartao
            });
          }

          // Dia de Vencimento da Fatura
          const diaVenc = Math.min(Number(cartao.diaVencimento) || 10, diasNoMes);
          const dataVencISO = `${ym}-${String(diaVenc).padStart(2, '0')}`;
          if (dataVencISO >= dtIni && dataVencISO <= dtFim) {
            let valorFatura = 0;
            let faturaPaga = false;
            try {
              if (typeof calcularFaturaMes === 'function') {
                const fat = calcularFaturaMes(cartao.id, ym);
                if (fat) {
                  valorFatura = fat.valorTotal || 0;
                  faturaPaga = Boolean(fat.pago);
                }
              }
            } catch (err) {
              console.warn(`[Calendário] Erro ao calcular fatura para cartão ${cartao.nome}:`, err);
            }

            consolidados.push({
              id: `venc_cartao_${cartao.id}_${ym}`,
              origemId: cartao.id,
              tipo: 'cartao_vencimento',
              subtipo: 'cartao_vencimento',
              titulo: `💳 Vencimento Fatura ${cartao.nome}${valorFatura > 0 ? ' - ' + fmt(valorFatura) : ''}`,
              data: dataVencISO,
              hora: '',
              diaInteiro: true,
              cor: faturaPaga ? '#10B981' : '#EF4444',
              icone: '💳',
              subtexto: faturaPaga ? 'Fatura Paga' : `Fatura ${ym} • Vence dia ${diaVenc}`,
              valor: valorFatura,
              pago: faturaPaga,
              raw: cartao
            });
          }
        });
      });
    }

    // 2.3 Parcelas de Acordos de Dívidas (S.dividas)
    if (Array.isArray(S.dividas)) {
      S.dividas.forEach(div => {
        if (!div || div.quitada || !div.acordo) return;
        const acordo = div.acordo;
        if (Array.isArray(acordo.parcelas)) {
          acordo.parcelas.forEach((p, pIdx) => {
            const pData = String(p.venc || p.data || '').slice(0, 10);
            if (pData >= dtIni && pData <= dtFim && !p.paga) {
              const pVal = Number(p.val) || 0;
              consolidados.push({
                id: `div_acordo_${div.id}_${pIdx}`,
                origemId: div.id,
                tipo: 'acordo',
                titulo: `🤝 Parcela Acordo: ${div.credor} (${fmt(pVal)})`,
                data: pData,
                hora: '',
                diaInteiro: true,
                cor: '#F59E0B',
                icone: '🤝',
                subtexto: `Parcela ${pIdx + 1} de ${acordo.numParcelas || acordo.parcelas.length}`,
                valor: pVal,
                raw: div
              });
            }
          });
        }
      });
    }
  }

  // 3. TAREFAS TO-DO COM PRAZO (S.listas)
  if (camadas.tarefas && Array.isArray(S.listas)) {
    S.listas.forEach(l => {
      if (l.tipo !== 'tarefas' || !Array.isArray(l.itens)) return;
      l.itens.forEach(t => {
        const prazo = String(t.prazo || '').slice(0, 10);
        if (!prazo || prazo < dtIni || prazo > dtFim) return;

        if (filtroMembro !== 'todos' && t.responsavelId !== filtroMembro) {
          return;
        }

        consolidados.push({
          id: `tarefa_${l.id}_${t.id}`,
          origemId: t.id,
          listaId: l.id,
          tipo: 'tarefa',
          titulo: t.titulo,
          tituloOriginal: t.titulo,
          data: prazo,
          hora: '',
          diaInteiro: true,
          cor: t.responsavelCor || l.cor || '#5581E3',
          icone: t.concluida ? '✓' : '✅',
          subtexto: `👤 ${t.responsavelNome || 'Família'} • ${t.concluida ? 'Concluída' : 'Pendente'}`,
          responsavelNome: t.responsavelNome || 'Família',
          responsavelId: t.responsavelId,
          concluida: Boolean(t.concluida),
          raw: t
        });
      });
    });
  }

  // 4. ANIVERSÁRIOS DA FAMÍLIA (S.aniversarios)
  if (camadas.aniversarios && Array.isArray(S.aniversarios)) {
    // Determina os anos cobertos pelo período
    const anoInicio = parseInt(dtIni.slice(0, 4), 10);
    const anoFim = parseInt(dtFim.slice(0, 4), 10);

    S.aniversarios.forEach(aniv => {
      if (!aniv || !aniv.dataNascimento) return;
      const nascStr = String(aniv.dataNascimento).slice(0, 10);
      const partes = nascStr.split('-');
      if (partes.length < 3) return;

      const mesDia = `${partes[1]}-${partes[2]}`;
      const anoNasc = parseInt(partes[0], 10);

      for (let y = anoInicio; y <= anoFim; y++) {
        const dataAnivEsteAno = `${y}-${mesDia}`;
        if (dataAnivEsteAno >= dtIni && dataAnivEsteAno <= dtFim) {
          const idadeACompletar = !isNaN(anoNasc) ? Math.max(0, y - anoNasc) : 0;
          const textoIdade = idadeACompletar > 0 ? ` (faz ${idadeACompletar} anos)` : '';

          consolidados.push({
            id: `aniv_${aniv.id}_${y}`,
            origemId: aniv.id,
            tipo: 'aniversario',
            titulo: `🎂 ${aniv.nomePessoa}${textoIdade}`,
            data: dataAnivEsteAno,
            hora: '',
            diaInteiro: true,
            cor: '#EC4899',
            icone: '🎂',
            subtexto: aniv.parentesco ? `Parentesco: ${aniv.parentesco}` : 'Aniversário Especial',
            idade: idadeACompletar,
            nomePessoa: aniv.nomePessoa,
            raw: aniv
          });
        }
      }
    });
  }

  // 5. FERIADOS NACIONAIS DO BRASIL (se camada feriados ativa e S.configCalendario.feriadosBrasil !== false)
  const feriadosAtivos = camadas.feriados !== false && (!S.configCalendario || S.configCalendario.feriadosBrasil !== false);
  if (feriadosAtivos) {
    const anoInicio = parseInt(dtIni.slice(0, 4), 10);
    const anoFim = parseInt(dtFim.slice(0, 4), 10);
    for (let y = anoInicio; y <= anoFim; y++) {
      const feriadosAno = obterFeriadosBrasilAno(y);
      feriadosAno.forEach(fer => {
        if (fer.data >= dtIni && fer.data <= dtFim) {
          consolidados.push(fer);
        }
      });
    }
  }

  // Ordenação cronológica por data e hora
  consolidados.sort((a, b) => {
    if (a.data !== b.data) return a.data.localeCompare(b.data);
    if (a.diaInteiro && !b.diaInteiro) return -1;
    if (!a.diaInteiro && b.diaInteiro) return 1;
    return (a.hora || '').localeCompare(b.hora || '');
  });

  return consolidados;
}

/**
 * Cria um novo evento no calendário compartilhado com suporte a cores nomeadas,
 * múltiplos lembretes, visibilidade, curtidas e comentários.
 */
function criarEventoCalendario(dados) {
  if (!dados || !dados.titulo) return null;
  const tituloLimpo = String(dados.titulo).trim();
  if (!tituloLimpo) return null;

  if (!S) return null;
  if (!Array.isArray(S.eventosCalendario)) S.eventosCalendario = [];

  const membroAtivo = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : { id: 'm_1', nome: 'Alex', cor: '#5581E3' };
  const agoraIso = new Date().toISOString();
  const dataIni = dados.dataInicio || agoraIso.slice(0, 10);

  // Tratamento de cor e nome da cor
  const corFinal = dados.cor || membroAtivo.cor || '#D81B60';
  const corNomeFinal = dados.corNome || obterNomeCorEvento(corFinal);

  // Tratamento de múltiplos lembretes
  let lembretesArray = [30];
  if (Array.isArray(dados.lembretesMinutos) && dados.lembretesMinutos.length > 0) {
    lembretesArray = dados.lembretesMinutos.map(Number).filter(n => !isNaN(n) && n >= 0);
  } else if (dados.lembreteMinutos !== undefined) {
    const num = Number(dados.lembreteMinutos);
    if (!isNaN(num) && num >= 0) lembretesArray = [num];
  } else if (S.configCalendario && S.configCalendario.lembretePadraoMin !== undefined) {
    lembretesArray = [Number(S.configCalendario.lembretePadraoMin) || 30];
  }

  const novoEvento = {
    id: dados.id || ('ev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6)),
    circuloId: dados.circuloId || S.circuloAtivoId || 'circ_1',
    titulo: tituloLimpo,
    descricao: dados.descricao ? String(dados.descricao).trim() : '',
    dataInicio: dataIni,
    horaInicio: dados.horaInicio || '09:00',
    dataFim: dados.dataFim || dataIni,
    horaFim: dados.horaFim || '10:00',
    diaInteiro: Boolean(dados.diaInteiro),
    local: dados.local ? String(dados.local).trim() : '',
    participantesIds: Array.isArray(dados.participantesIds) && dados.participantesIds.length > 0
      ? dados.participantesIds
      : [membroAtivo.id],
    visivelPara: dados.visivelPara || 'todos', // 'todos' | 'participantes' | 'adultos'
    cor: corFinal,
    corNome: corNomeFinal,
    repeticao: ['nenhuma', 'diaria', 'semanal', 'mensal', 'anual'].includes(dados.repeticao)
      ? dados.repeticao
      : 'nenhuma',
    lembretesMinutos: lembretesArray,
    lembreteMinutos: lembretesArray[0] || 30, // Retrocompatibilidade
    curtidasIds: Array.isArray(dados.curtidasIds) ? dados.curtidasIds : [],
    comentarios: Array.isArray(dados.comentarios) ? dados.comentarios : [],
    gastoPrevisto: Number(dados.gastoPrevisto) > 0 ? Math.round(Number(dados.gastoPrevisto) * 100) / 100 : 0,
    uid: dados.uid || ('uid_' + Date.now().toString(36)),
    criadoPor: dados.criadoPor || membroAtivo.id,
    criadoEm: dados.criadoEm || agoraIso
  };

  S.eventosCalendario.push(novoEvento);
  if (typeof adicionarNaFilaSync === 'function') adicionarNaFilaSync('eventos_calendario', 'insert', novoEvento);

  if (typeof registrarNotificacaoFamilia === 'function') {
    registrarNotificacaoFamilia({
      tipo: 'eventos',
      titulo: 'Novo Evento no Calendário',
      texto: `"${tituloLimpo}" agendado para ${dataIni} por ${membroAtivo.nome}`,
      linkTela: 'calendario'
    });
  }

  if (typeof save === 'function') save();
  if (typeof render === 'function') render();
  return novoEvento;
}

/**
 * Edita um evento existente no calendário.
 */
function editarEventoCalendario(id, dados) {
  if (!S || !Array.isArray(S.eventosCalendario) || !id || !dados) return null;
  const idx = S.eventosCalendario.findIndex(e => e.id === id);
  if (idx < 0) return null;

  const eventoAntigo = S.eventosCalendario[idx];
  const tituloLimpo = dados.titulo !== undefined ? String(dados.titulo).trim() : eventoAntigo.titulo;
  if (!tituloLimpo) return null;

  const corFinal = dados.cor || eventoAntigo.cor || '#5581E3';
  const corNomeFinal = dados.corNome || obterNomeCorEvento(corFinal);

  let lembretesArray = eventoAntigo.lembretesMinutos || [eventoAntigo.lembreteMinutos || 30];
  if (Array.isArray(dados.lembretesMinutos)) {
    lembretesArray = dados.lembretesMinutos.map(Number).filter(n => !isNaN(n) && n >= 0);
  } else if (dados.lembreteMinutos !== undefined) {
    lembretesArray = [Number(dados.lembreteMinutos) || 30];
  }

  const eventoAtualizado = {
    ...eventoAntigo,
    ...dados,
    id: eventoAntigo.id,
    titulo: tituloLimpo,
    cor: corFinal,
    corNome: corNomeFinal,
    lembretesMinutos: lembretesArray,
    lembreteMinutos: lembretesArray[0] || 30,
    atualizadoEm: new Date().toISOString()
  };

  S.eventosCalendario[idx] = eventoAtualizado;
  if (typeof adicionarNaFilaSync === 'function') adicionarNaFilaSync('eventos_calendario', 'update', eventoAtualizado);

  if (typeof save === 'function') save();
  if (typeof render === 'function') render();
  return eventoAtualizado;
}

/**
 * Exclui um evento do calendário.
 */
function excluirEventoCalendario(id) {
  if (!S || !Array.isArray(S.eventosCalendario) || !id) return false;
  const idx = S.eventosCalendario.findIndex(e => e.id === id);
  if (idx < 0) return false;

  const removido = S.eventosCalendario.splice(idx, 1)[0];
  if (typeof adicionarNaFilaSync === 'function') adicionarNaFilaSync('eventos_calendario', 'delete', { id });

  if (typeof registrarNotificacaoFamilia === 'function') {
    registrarNotificacaoFamilia({
      tipo: 'eventos',
      titulo: 'Evento Cancelado',
      texto: `"${removido.titulo}" foi removido do calendário`,
      linkTela: 'calendario'
    });
  }

  if (typeof save === 'function') save();
  if (typeof render === 'function') render();
  return true;
}

/**
 * Alterna a curtida de um membro em um evento da família.
 */
function curtirEventoCalendario(eventoId, membroId) {
  if (!S || !Array.isArray(S.eventosCalendario) || !eventoId) return { ok: false, erro: 'ID inválido' };
  const ev = S.eventosCalendario.find(e => e.id === eventoId);
  if (!ev) return { ok: false, erro: 'Evento não encontrado' };

  if (!Array.isArray(ev.curtidasIds)) ev.curtidasIds = [];
  const mId = membroId || S.membroAtivoId || 'm_1';
  const idx = ev.curtidasIds.indexOf(mId);

  let curtido = false;
  if (idx >= 0) {
    ev.curtidasIds.splice(idx, 1);
    curtido = false;
  } else {
    ev.curtidasIds.push(mId);
    curtido = true;
    const m = (S.membrosPerfil || []).find(x => x.id === mId) || { nome: 'Familiar' };
    if (typeof registrarNotificacaoFamilia === 'function') {
      registrarNotificacaoFamilia({
        tipo: 'eventos',
        titulo: 'Curtida no Evento',
        texto: `${m.nome} curtiu o evento "${ev.titulo}"`,
        linkTela: 'calendario'
      });
    }
  }

  if (typeof adicionarNaFilaSync === 'function') adicionarNaFilaSync('eventos_calendario', 'update', ev);
  if (typeof save === 'function') save();
  if (typeof renderDetalheEventoModal === 'function') renderDetalheEventoModal(ev);

  return { ok: true, curtido, total: ev.curtidasIds.length, totalCurtidas: ev.curtidasIds.length, curtidasIds: ev.curtidasIds };
}

/**
 * Adiciona um comentário a um evento compartilhado da família.
 */
function adicionarComentarioEventoCalendario(eventoId, texto, membroId) {
  if (!S || !Array.isArray(S.eventosCalendario) || !eventoId) return { ok: false, erro: 'ID inválido' };
  const txtLimpo = String(texto || '').trim();
  if (!txtLimpo) return { ok: false, erro: 'Texto do comentário obrigatório' };

  const ev = S.eventosCalendario.find(e => e.id === eventoId);
  if (!ev) return { ok: false, erro: 'Evento não encontrado' };

  if (!Array.isArray(ev.comentarios)) ev.comentarios = [];
  const mId = membroId || S.membroAtivoId || 'm_1';
  const m = (S.membrosPerfil || []).find(x => x.id === mId) || { id: mId, nome: 'Familiar', cor: '#5581E3' };

  const novoComentario = {
    id: 'com_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
    membroId: m.id,
    membroNome: m.nome,
    membroCor: m.cor || '#5581E3',
    texto: txtLimpo,
    criadoEm: new Date().toISOString()
  };

  ev.comentarios.push(novoComentario);

  if (typeof registrarNotificacaoFamilia === 'function') {
    registrarNotificacaoFamilia({
      tipo: 'eventos',
      titulo: 'Novo Comentário no Evento',
      texto: `${m.nome} comentou em "${ev.titulo}": "${txtLimpo}"`,
      linkTela: 'calendario'
    });
  }

  if (typeof adicionarNaFilaSync === 'function') adicionarNaFilaSync('eventos_calendario', 'update', ev);
  if (typeof save === 'function') save();
  if (typeof renderDetalheEventoModal === 'function') renderDetalheEventoModal(ev);

  return { ok: true, total: ev.comentarios.length, comentario: novoComentario, comentarios: ev.comentarios };
}

/**
 * Extrai dados estruturados de evento a partir de texto livre / e-mail / convite (IA / NLP).
 */
function preencherEventoPorTextoIA(textoLivre) {
  const t = String(textoLivre || '').trim();
  if (!t) {
    return {
      titulo: '',
      dataInicio: new Date().toISOString().slice(0, 10),
      horaInicio: '09:00',
      horaFim: '10:00',
      diaInteiro: false,
      local: '',
      descricao: ''
    };
  }

  const hoje = new Date();
  let dataISO = hoje.toISOString().slice(0, 10);
  let horaInicio = '09:00';
  let horaFim = '10:00';
  let diaInteiro = false;
  let local = '';
  let titulo = t;

  // 1. Extração de Data (ex: "dia 28/10", "28/10/2026", "28/10", "amanhã", "hoje")
  const regexData = /\b(?:dia\s+)?(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2,4}))?\b/i;
  const matchData = t.match(regexData);
  if (matchData) {
    const dia = String(matchData[1]).padStart(2, '0');
    const mes = String(matchData[2]).padStart(2, '0');
    const ano = matchData[3] ? (matchData[3].length === 2 ? '20' + matchData[3] : matchData[3]) : String(hoje.getFullYear());
    dataISO = `${ano}-${mes}-${dia}`;
    titulo = titulo.replace(matchData[0], ' ');
  } else if (/\bamanh[ãa]\b/i.test(t)) {
    const amanha = new Date(Date.now() + 86400000);
    dataISO = amanha.toISOString().slice(0, 10);
    titulo = titulo.replace(/\bamanh[ãa]\b/i, ' ');
  } else if (/\bhoje\b/i.test(t)) {
    dataISO = hoje.toISOString().slice(0, 10);
    titulo = titulo.replace(/\bhoje\b/i, ' ');
  }

  // 2. Extração de Horário (ex: "às 15h30", "15:30", "das 14:55 às 18:00", "15h")
  const regexIntervalo = /\bdas?\s*(\d{1,2})(?:[:h](\d{2}))?\s*(?:h|hrs?)?\s*(?:às|ate|até|-)\s*(\d{1,2})(?:[:h](\d{2}))?\s*(?:h|hrs?)?\b/i;
  const matchIntervalo = t.match(regexIntervalo);
  if (matchIntervalo) {
    const h1 = String(matchIntervalo[1]).padStart(2, '0');
    const m1 = String(matchIntervalo[2] || '00').padStart(2, '0');
    const h2 = String(matchIntervalo[3]).padStart(2, '0');
    const m2 = String(matchIntervalo[4] || '00').padStart(2, '0');
    horaInicio = `${h1}:${m1}`;
    horaFim = `${h2}:${m2}`;
    titulo = titulo.replace(matchIntervalo[0], ' ');
  } else {
    const regexHora = /\b(?:às|as)?\s*(\d{1,2})(?:[:h](\d{2}))\s*(?:h|hrs?)?\b/i;
    const matchHora = t.match(regexHora);
    if (matchHora) {
      const h1 = String(matchHora[1]).padStart(2, '0');
      const m1 = String(matchHora[2] || '00').padStart(2, '0');
      horaInicio = `${h1}:${m1}`;
      const hFimNum = (parseInt(h1, 10) + 1) % 24;
      horaFim = `${String(hFimNum).padStart(2, '0')}:${m1}`;
      titulo = titulo.replace(matchHora[0], ' ');
    } else {
      const regexHoraSimples = /\b(\d{1,2})h\b/i;
      const matchHoraSimples = t.match(regexHoraSimples);
      if (matchHoraSimples) {
        const h1 = String(matchHoraSimples[1]).padStart(2, '0');
        horaInicio = `${h1}:00`;
        const hFimNum = (parseInt(h1, 10) + 1) % 24;
        horaFim = `${String(hFimNum).padStart(2, '0')}:00`;
        titulo = titulo.replace(matchHoraSimples[0], ' ');
      }
    }
  }

  // 3. Extração de Gasto Previsto (ex: "R$ 380,00", "R$ 450", "custo de R$ 380")
  let gastoPrevisto = 0;
  const matchGasto = t.match(/R\$\s*(\d+(?:[.,]\d{1,2})?)/i);
  if (matchGasto) {
    gastoPrevisto = parseFloat(matchGasto[1].replace(',', '.'));
    titulo = titulo.replace(matchGasto[0], ' ');
  }

  // 4. Extração de Local (ex: "na Av. Paulista 1000", "no Buffet Alegria com custo...")
  const regexLocal = /\b(?:na|no|em|local:)\s+([^,.\n]+?)(?=\s+com\s+custo|\s+às|[.,\n]|$)/i;
  const matchLocal = t.match(regexLocal);
  if (matchLocal) {
    local = matchLocal[1].trim();
    titulo = titulo.replace(matchLocal[0], ' ');
  }

  // Limpeza final do título
  titulo = titulo.replace(/\s+/g, ' ').trim();
  if (!titulo) titulo = 'Compromisso';

  return {
    titulo,
    dataInicio: dataISO,
    horaInicio,
    horaFim,
    diaInteiro,
    local,
    gastoPrevisto,
    descricao: t
  };
}

/**
 * Busca rápida de eventos, tarefas, aniversários e feriados no calendário.
 */
function buscarEventosCalendario(termo) {
  const t = String(termo || '').trim().toLowerCase();
  if (!t) return [];

  // Intervalo amplo de busca: 1 ano antes e 1 ano depois
  const hoje = new Date();
  const dtIni = `${hoje.getFullYear() - 1}-01-01`;
  const dtFim = `${hoje.getFullYear() + 1}-12-31`;

  const todos = obterEventosConsolidadosPeriodo(dtIni, dtFim);
  return todos.filter(ev => {
    const tit = String(ev.titulo || '').toLowerCase();
    const loc = String(ev.local || '').toLowerCase();
    const sub = String(ev.subtexto || '').toLowerCase();
    const desc = String(ev.descricao || '').toLowerCase();
    const pes = String(ev.nomePessoa || '').toLowerCase();
    return tit.includes(t) || loc.includes(t) || sub.includes(t) || desc.includes(t) || pes.includes(t);
  });
}

/**
 * Salva as configurações gerais do calendário pro.
 */
function salvarConfigCalendario(dados) {
  if (!S) return { ok: false };
  if (!S.configCalendario) S.configCalendario = {};

  if (dados) {
    if (dados.feriadosBrasil !== undefined) S.configCalendario.feriadosBrasil = Boolean(dados.feriadosBrasil);
    if (dados.mostrarNumeroSemana !== undefined) S.configCalendario.mostrarNumeroSemana = Boolean(dados.mostrarNumeroSemana);
    if (dados.primeiroDiaSemana !== undefined) S.configCalendario.primeiroDiaSemana = Number(dados.primeiroDiaSemana) === 1 ? 1 : 0;
    if (dados.lembretePadraoMin !== undefined || dados.lembretePadraoMinutos !== undefined) {
      const valLembrete = Number(dados.lembretePadraoMinutos !== undefined ? dados.lembretePadraoMinutos : dados.lembretePadraoMin) || 30;
      S.configCalendario.lembretePadraoMin = valLembrete;
      S.configCalendario.lembretePadraoMinutos = valLembrete;
    }
    if (dados.lembreteDiarioAgenda !== undefined) S.configCalendario.lembreteDiarioAgenda = String(dados.lembreteDiarioAgenda);
    if (dados.limpezaMeses !== undefined) S.configCalendario.limpezaMeses = Number(dados.limpezaMeses) || 6;

    if (dados.camadas) {
      camadasCalendarioAtivas = Object.assign({}, camadasCalendarioAtivas, dados.camadas);
    }
  }

  if (typeof save === 'function') save();
  if (typeof renderCalendario === 'function') renderCalendario();
  return { ok: true, config: S.configCalendario, camadas: camadasCalendarioAtivas };
}

/**
 * Remove eventos pontuais do calendário anteriores a uma quantidade de meses.
 */
function limparEventosAntigosCalendario(mesesAntes = 6) {
  if (!S || !Array.isArray(S.eventosCalendario)) return { ok: false, removidos: 0 };
  const m = Number(mesesAntes) || 6;
  const limiteData = new Date(Date.now() - m * 30 * 86400000).toISOString().slice(0, 10);

  const totalAntes = S.eventosCalendario.length;
  S.eventosCalendario = S.eventosCalendario.filter(ev => {
    // Preserva eventos recorrentes
    if (ev.repeticao && ev.repeticao !== 'nenhuma') return true;
    const dtEv = ev.dataFim || ev.dataInicio || '';
    return dtEv >= limiteData;
  });

  const removidos = totalAntes - S.eventosCalendario.length;
  if (typeof save === 'function') save();
  if (typeof renderCalendario === 'function') renderCalendario();

  return { ok: true, removidos, restantes: S.eventosCalendario.length };
}

/**
 * Adiciona um aniversariante à base da família.
 */
function adicionarAniversariante(dados) {
  if (!dados || !dados.nomePessoa || !dados.dataNascimento) return null;
  const nomeLimpo = String(dados.nomePessoa).trim();
  const dataNasc = String(dados.dataNascimento).slice(0, 10);
  if (!nomeLimpo || !dataNasc) return null;

  if (!S) return null;
  if (!Array.isArray(S.aniversarios)) S.aniversarios = [];

  const novo = {
    id: dados.id || ('aniv_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6)),
    circuloId: dados.circuloId || S.circuloAtivoId || 'circ_1',
    nomePessoa: nomeLimpo,
    dataNascimento: dataNasc,
    parentesco: dados.parentesco ? String(dados.parentesco).trim() : '',
    membroId: dados.membroId || '',
    avisoDiasAntes: Number(dados.avisoDiasAntes) > 0 ? Number(dados.avisoDiasAntes) : 7,
    criadoEm: new Date().toISOString()
  };

  S.aniversarios.push(novo);
  adicionarNaFilaSync('aniversarios', 'insert', novo);

  registrarNotificacaoFamilia({
    tipo: 'eventos',
    titulo: 'Aniversário Cadastrado',
    texto: `Data especial de ${nomeLimpo} adicionada ao calendário!`,
    linkTela: 'calendario'
  });

  save();
  render();
  return novo;
}

/**
 * Exclui um aniversariante da base da família.
 */
function excluirAniversariante(id) {
  if (!S || !Array.isArray(S.aniversarios) || !id) return false;
  const idx = S.aniversarios.findIndex(a => a.id === id);
  if (idx < 0) return false;

  S.aniversarios.splice(idx, 1);
  adicionarNaFilaSync('aniversarios', 'delete', { id });

  save();
  render();
  return true;
}

/**
 * Calcula os dias restantes para o próximo aniversário e a idade a completar.
 */
function calcularProximoAniversario(dataNascStr) {
  if (!dataNascStr) return { diasRestantes: 0, idade: 0, proximaData: '' };
  const partes = String(dataNascStr).slice(0, 10).split('-');
  if (partes.length < 3) return { diasRestantes: 0, idade: 0, proximaData: '' };

  const anoNasc = parseInt(partes[0], 10);
  const mesNasc = parseInt(partes[1], 10);
  const diaNasc = parseInt(partes[2], 10);

  const hoje = new Date();
  const hojeAno = hoje.getFullYear();
  const hojeMes = hoje.getMonth() + 1;
  const hojeDia = hoje.getDate();

  let anoProximo = hojeAno;
  if (mesNasc < hojeMes || (mesNasc === hojeMes && diaNasc < hojeDia)) {
    anoProximo = hojeAno + 1;
  }

  const dataProximo = new Date(anoProximo, mesNasc - 1, diaNasc);
  const dataHojeZero = new Date(hojeAno, hojeMes - 1, hojeDia);
  const diffMs = dataProximo.getTime() - dataHojeZero.getTime();
  const diasRestantes = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const idade = !isNaN(anoNasc) ? anoProximo - anoNasc : 0;
  const proximaData = `${anoProximo}-${String(mesNasc).padStart(2, '0')}-${String(diaNasc).padStart(2, '0')}`;

  return { diasRestantes, idade, proximaData };
}

/**
 * Parser de formato iCalendar (.ics) com deduplicação por UID.
 * Permite sincronizar agendas do Google Calendar, Outlook, Apple iCloud e escolas.
 */
function importarEventosICal(conteudoIcs) {
  if (!conteudoIcs || typeof conteudoIcs !== 'string') {
    return { ok: false, importados: 0, total: 0, erro: 'Conteúdo iCal vazio' };
  }

  if (!S) return { ok: false, importados: 0, total: 0, erro: 'Estado não inicializado' };
  if (!Array.isArray(S.eventosCalendario)) S.eventosCalendario = [];

  // Junta linhas desdobradas do iCal (começadas com espaço ou tab)
  const linhasCruas = conteudoIcs.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const linhas = [];
  linhasCruas.forEach(l => {
    if ((l.startsWith(' ') || l.startsWith('\t')) && linhas.length > 0) {
      linhas[linhas.length - 1] += l.trim();
    } else {
      linhas.push(l);
    }
  });

  const blocosEventos = [];
  let blocoAtual = null;

  linhas.forEach(linha => {
    const lTrim = linha.trim();
    if (lTrim === 'BEGIN:VEVENT') {
      blocoAtual = {};
    } else if (lTrim === 'END:VEVENT') {
      if (blocoAtual) blocosEventos.push(blocoAtual);
      blocoAtual = null;
    } else if (blocoAtual) {
      const idxColon = linha.indexOf(':');
      if (idxColon > 0) {
        const chaveCompleta = linha.substring(0, idxColon).trim();
        const valor = linha.substring(idxColon + 1).trim();
        const chaveBase = chaveCompleta.split(';')[0].toUpperCase();
        blocoAtual[chaveBase] = valor;
      }
    }
  });

  if (blocosEventos.length === 0) {
    return { ok: false, importados: 0, total: 0, erro: 'Nenhum bloco VEVENT encontrado no arquivo' };
  }

  function converterDataICal(str) {
    if (!str) return { data: new Date().toISOString().slice(0, 10), hora: '09:00', diaInteiro: true };
    const limpo = str.trim();
    if (limpo.length >= 8) {
      const y = limpo.substring(0, 4);
      const m = limpo.substring(4, 6);
      const d = limpo.substring(6, 8);
      const data = `${y}-${m}-${d}`;
      let hora = '';
      let diaInteiro = true;
      if (limpo.includes('T') && limpo.length >= 13) {
        const tIdx = limpo.indexOf('T');
        const h = limpo.substring(tIdx + 1, tIdx + 3);
        const min = limpo.substring(tIdx + 3, tIdx + 5);
        hora = `${h}:${min}`;
        diaInteiro = false;
      }
      return { data, hora, diaInteiro };
    }
    return { data: new Date().toISOString().slice(0, 10), hora: '09:00', diaInteiro: true };
  }

  let importados = 0;
  let atualizados = 0;
  const membroAtivo = obterMembroAtivo();
  const cId = S.circuloAtivoId || 'circ_1';

  blocosEventos.forEach(b => {
    const titulo = b.SUMMARY ? b.SUMMARY.replace(/\\,/g, ',').replace(/\\n/g, ' ') : 'Evento Importado';
    const uid = b.UID || ('uid_' + Math.random().toString(36).substring(2, 9));
    const dtStart = converterDataICal(b.DTSTART);
    const dtEnd = converterDataICal(b.DTEND || b.DTSTART);

    let repeticao = 'nenhuma';
    if (b.RRULE) {
      const rruleUpper = b.RRULE.toUpperCase();
      if (rruleUpper.includes('FREQ=DAILY')) repeticao = 'diaria';
      else if (rruleUpper.includes('FREQ=WEEKLY')) repeticao = 'semanal';
      else if (rruleUpper.includes('FREQ=MONTHLY')) repeticao = 'mensal';
      else if (rruleUpper.includes('FREQ=YEARLY')) repeticao = 'anual';
    }

    // Deduplicação inteligente por UID
    const idxExistente = S.eventosCalendario.findIndex(e => e.uid === uid);
    if (idxExistente >= 0) {
      S.eventosCalendario[idxExistente] = {
        ...S.eventosCalendario[idxExistente],
        titulo,
        dataInicio: dtStart.data,
        horaInicio: dtStart.hora || '09:00',
        dataFim: dtEnd.data || dtStart.data,
        horaFim: dtEnd.hora || '10:00',
        diaInteiro: dtStart.diaInteiro,
        local: b.LOCATION ? b.LOCATION.replace(/\\,/g, ',') : '',
        descricao: b.DESCRIPTION ? b.DESCRIPTION.replace(/\\n/g, '\n').replace(/\\,/g, ',') : '',
        repeticao,
        atualizadoEm: new Date().toISOString()
      };
      atualizados++;
    } else {
      const novoEv = {
        id: 'ev_ical_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
        circuloId: cId,
        titulo,
        descricao: b.DESCRIPTION ? b.DESCRIPTION.replace(/\\n/g, '\n').replace(/\\,/g, ',') : '',
        dataInicio: dtStart.data,
        horaInicio: dtStart.hora || '09:00',
        dataFim: dtEnd.data || dtStart.data,
        horaFim: dtEnd.hora || '10:00',
        diaInteiro: dtStart.diaInteiro,
        local: b.LOCATION ? b.LOCATION.replace(/\\,/g, ',') : '',
        participantesIds: [membroAtivo.id],
        cor: membroAtivo.cor || '#5581E3',
        repeticao,
        lembreteMinutos: 60,
        gastoPrevisto: 0,
        uid,
        criadoPor: membroAtivo.id,
        criadoEm: new Date().toISOString()
      };
      S.eventosCalendario.push(novoEv);
      adicionarNaFilaSync('eventos_calendario', 'insert', novoEv);
      importados++;
    }
  });

  registrarNotificacaoFamilia({
    tipo: 'eventos',
    titulo: 'Calendário iCal Sincronizado',
    texto: `${importados} novos eventos adicionados e ${atualizados} atualizados.`,
    linkTela: 'calendario'
  });

  save();
  render();
  return { ok: true, importados, atualizados, total: blocosEventos.length };
}

// --- CONTROLADORES DE INTERFACE E VISÕES DO CALENDÁRIO ---

function setVisaoCalendario(visao) {
  if (!['mes', 'semana', 'dia', 'agenda'].includes(visao)) visao = 'mes';
  visaoCalendarioAtual = visao;

  if (typeof document !== 'undefined') {
    ['mes', 'semana', 'dia', 'agenda'].forEach(v => {
      const btn = document.getElementById(`btn-cal-visao-${v}`);
      const sec = document.getElementById(`cal-visao-${v}`);
      if (btn && btn.classList) {
        if (v === visao) btn.classList.add('sel');
        else btn.classList.remove('sel');
      }
      if (sec && sec.style) {
        sec.style.display = (v === visao) ? 'block' : 'none';
      }
    });
  }

  renderCalendario();
}

function mudarPeriodoCalendario(delta) {
  if (delta === 0) {
    dataReferenciaCalendario = new Date();
  } else {
    if (visaoCalendarioAtual === 'mes' || visaoCalendarioAtual === 'agenda') {
      dataReferenciaCalendario.setMonth(dataReferenciaCalendario.getMonth() + delta);
    } else if (visaoCalendarioAtual === 'semana') {
      dataReferenciaCalendario.setDate(dataReferenciaCalendario.getDate() + (delta * 7));
    } else if (visaoCalendarioAtual === 'dia') {
      dataReferenciaCalendario.setDate(dataReferenciaCalendario.getDate() + delta);
    }
  }
  renderCalendario();
}

function filtrarCalendarioMembro(membroId) {
  filtroMembroCalendario = membroId;
  renderCalendario();
}

function toggleCamadaCalendario(camada) {
  if (camadasCalendarioAtivas[camada] !== undefined) {
    camadasCalendarioAtivas[camada] = !camadasCalendarioAtivas[camada];
  }
  renderCalendario();
}

function abrirDiaCalendario(diaISO) {
  diaSelecionadoCalendario = diaISO;
  if (typeof document === 'undefined') return;

  const modal = document.getElementById('m-detalhe-dia-calendario');
  const titEl = document.getElementById('ddia-titulo');
  const subEl = document.getElementById('ddia-subinfo');
  const container = document.getElementById('ddia-itens-container');
  if (!modal || !container) return;

  const [y, m, d] = diaISO.split('-').map(Number);
  const dataObj = new Date(y, m - 1, d);
  const diasSemanaNomes = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  if (titEl) titEl.textContent = `📅 ${diasSemanaNomes[dataObj.getDay()]}, ${d} de ${mesesNomes[m - 1]}`;
  if (subEl) subEl.textContent = `${diaISO} • Compromissos e rotina da família`;

  const itensDoDia = obterEventosConsolidadosPeriodo(diaISO, diaISO);

  if (itensDoDia.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align:center;padding:24px 12px;color:var(--muted);background:var(--bg3);">
        <p style="font-size:24px;margin-bottom:4px;">✨</p>
        <p style="font-size:13px;font-weight:700;margin:0 0 4px;color:var(--text);">Nenhum compromisso neste dia</p>
        <p style="font-size:11px;margin:0;">Toque em "+ Evento" para agendar um compromisso ou atividade.</p>
      </div>
    `;
  } else {
    container.innerHTML = itensDoDia.map(it => {
      const horaStr = it.hora ? `⏰ ${it.hora}` : 'Dia Inteiro';
      const gastoStr = it.gastoPrevisto > 0 ? `<span style="font-size:11px;color:var(--green);font-weight:700;">Gasto est: ${fmt(it.gastoPrevisto)}</span>` : '';
      const isEventoProprio = it.tipo === 'evento';

      return `
        <div class="cal-item-card" style="border-left: 4px solid ${it.cor};" ${isEventoProprio ? `onclick="closeM('m-detalhe-dia-calendario');abrirModalEventoCalendario('${it.origemId}')"` : ''}>
          <div style="font-size:20px;line-height:1;">${it.icone}</div>
          <div style="flex:1;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
              <p style="font-weight:700;font-size:13px;margin:0 0 2px;">${escapeHtml(it.titulo)}</p>
              <span style="font-size:11px;color:var(--muted);">${horaStr}</span>
            </div>
            ${it.subtexto ? `<p style="font-size:11px;color:var(--muted);margin:0 0 4px;">${escapeHtml(it.subtexto)}</p>` : ''}
            ${gastoStr}
          </div>
          ${isEventoProprio ? '<span style="font-size:11px;color:var(--primary);font-weight:700;">Editar →</span>' : ''}
        </div>
      `;
    }).join('');
  }

  openM('m-detalhe-dia-calendario');
}

function adicionarEventoNoDiaModal() {
  closeM('m-detalhe-dia-calendario');
  abrirModalEventoCalendario(null, diaSelecionadoCalendario);
}

// --- MODAIS DO CALENDÁRIO ---

// --- ESTADO AUXILIAR DO CALENDÁRIO PRO v2.1 ---
let lembretesEditandoForm = [30];
let eventoVisualizandoDetalheId = null;

// --- MODAIS DO CALENDÁRIO PRO v2.1 ---

/**
 * Abre o modal de criação/edição de evento com suporte Pro v2.1:
 * Cores nomeadas dinâmicas, avatares de participantes, visibilidade e múltiplos lembretes.
 */
function abrirModalEventoCalendario(eventoId = null, dataPadrao = null, dadosPreenchidosIA = null) {
  if (typeof document === 'undefined') return;

  eventoEditandoId = eventoId;
  const titModal = document.getElementById('ev-modal-title');
  const btnExcluir = document.getElementById('btn-excluir-evento');
  const idHidden = document.getElementById('ev-id');
  const titInput = document.getElementById('ev-titulo');
  const diaIntChk = document.getElementById('ev-dia-inteiro');
  const dtIniInput = document.getElementById('ev-data-inicio');
  const hrIniInput = document.getElementById('ev-hora-inicio');
  const dtFimInput = document.getElementById('ev-data-fim');
  const hrFimInput = document.getElementById('ev-hora-fim');
  const localInput = document.getElementById('ev-local');
  const descInput = document.getElementById('ev-descricao');
  const repSelect = document.getElementById('ev-repeticao');
  const visivelSelect = document.getElementById('ev-visivel-para');
  const gastoInput = document.getElementById('ev-gasto-previsto');
  const blocoGasto = document.getElementById('ev-bloco-gasto');

  // Controle de visibilidade de finanças no modal (RLS de proteção infantil)
  if (blocoGasto) {
    blocoGasto.style.display = membroAtualPodeVerFinancas() ? 'block' : 'none';
  }

  let participantesSel = [];
  let corSel = '#5581E3';
  let visivelPara = 'todos';
  lembretesEditandoForm = [S.configCalendario?.lembretePadraoMinutos || 30];

  if (dadosPreenchidosIA) {
    // Evento pré-preenchido pelo Parser IA
    if (titModal) titModal.textContent = '✨ Revisar Evento Criado com IA';
    if (btnExcluir) btnExcluir.style.display = 'none';
    if (idHidden) idHidden.value = '';
    if (titInput) titInput.value = dadosPreenchidosIA.titulo || '';
    if (diaIntChk) diaIntChk.checked = Boolean(dadosPreenchidosIA.diaInteiro);
    if (dtIniInput) dtIniInput.value = dadosPreenchidosIA.dataInicio || new Date().toISOString().slice(0, 10);
    if (hrIniInput) hrIniInput.value = dadosPreenchidosIA.horaInicio || '09:00';
    if (dtFimInput) dtFimInput.value = dadosPreenchidosIA.dataFim || dadosPreenchidosIA.dataInicio || new Date().toISOString().slice(0, 10);
    if (hrFimInput) hrFimInput.value = dadosPreenchidosIA.horaFim || '10:00';
    if (localInput) localInput.value = dadosPreenchidosIA.local || '';
    if (descInput) descInput.value = dadosPreenchidosIA.descricao || '';
    if (repSelect) repSelect.value = dadosPreenchidosIA.repeticao || 'nenhuma';
    if (visivelSelect) visivelSelect.value = dadosPreenchidosIA.visivelPara || 'todos';
    if (gastoInput) gastoInput.value = dadosPreenchidosIA.gastoPrevisto > 0 ? dadosPreenchidosIA.gastoPrevisto.toFixed(2) : '';

    corSel = dadosPreenchidosIA.cor || '#5581E3';
    participantesSel = Array.isArray(dadosPreenchidosIA.participantesIds) && dadosPreenchidosIA.participantesIds.length > 0
      ? [...dadosPreenchidosIA.participantesIds]
      : [S.membroAtivoId || 'm_1'];

    if (Array.isArray(dadosPreenchidosIA.lembretesMinutos) && dadosPreenchidosIA.lembretesMinutos.length > 0) {
      lembretesEditandoForm = [...dadosPreenchidosIA.lembretesMinutos];
    }
  } else if (eventoId) {
    const evento = (S.eventosCalendario || []).find(e => e.id === eventoId);
    if (!evento) return;

    if (titModal) titModal.textContent = '✏️ Editar Evento Familiar';
    if (btnExcluir) btnExcluir.style.display = 'block';
    if (idHidden) idHidden.value = evento.id;
    if (titInput) titInput.value = evento.titulo || '';
    if (diaIntChk) diaIntChk.checked = Boolean(evento.diaInteiro);
    if (dtIniInput) dtIniInput.value = evento.dataInicio || '';
    if (hrIniInput) hrIniInput.value = evento.horaInicio || '09:00';
    if (dtFimInput) dtFimInput.value = evento.dataFim || evento.dataInicio || '';
    if (hrFimInput) hrFimInput.value = evento.horaFim || '10:00';
    if (localInput) localInput.value = evento.local || '';
    if (descInput) descInput.value = evento.descricao || '';
    if (repSelect) repSelect.value = evento.repeticao || 'nenhuma';
    if (visivelSelect) visivelSelect.value = evento.visivelPara || 'todos';
    if (gastoInput) gastoInput.value = evento.gastoPrevisto > 0 ? evento.gastoPrevisto.toFixed(2) : '';

    participantesSel = Array.isArray(evento.participantesIds) ? [...evento.participantesIds] : [];
    corSel = evento.cor || '#5581E3';
    visivelPara = evento.visivelPara || 'todos';

    if (Array.isArray(evento.lembretesMinutos) && evento.lembretesMinutos.length > 0) {
      lembretesEditandoForm = [...evento.lembretesMinutos];
    } else if (evento.lembreteMinutos !== undefined) {
      lembretesEditandoForm = [Number(evento.lembreteMinutos)];
    }
  } else {
    if (titModal) titModal.textContent = '📅 Novo Evento Familiar';
    if (btnExcluir) btnExcluir.style.display = 'none';
    if (idHidden) idHidden.value = '';
    if (titInput) titInput.value = '';
    if (diaIntChk) diaIntChk.checked = false;

    const dataPadraoFinal = dataPadrao || new Date().toISOString().slice(0, 10);
    if (dtIniInput) dtIniInput.value = dataPadraoFinal;
    if (hrIniInput) hrIniInput.value = '09:00';
    if (dtFimInput) dtFimInput.value = dataPadraoFinal;
    if (hrFimInput) hrFimInput.value = '10:00';
    if (localInput) localInput.value = '';
    if (descInput) descInput.value = '';
    if (repSelect) repSelect.value = 'nenhuma';
    if (visivelSelect) visivelSelect.value = 'todos';
    if (gastoInput) gastoInput.value = '';

    participantesSel = [S.membroAtivoId || 'm_1'];
    const membro = obterMembroAtivo();
    corSel = membro?.cor || '#5581E3';
  }

  // Renderiza avatares circulares de participantes
  renderParticipantesAvataresEventoModal(participantesSel);

  // Renderiza paleta de 10 cores nomeadas e aplica ao header do modal
  renderCoresNomeadasEventoModal(corSel);

  // Renderiza lista de múltiplos lembretes
  renderLembretesEventoForm();

  toggleDiaInteiroEventoModal();
  openM('m-evento-calendario');
}

/**
 * Renderiza os avatares circulares dos membros com botão "👥 Todos" (Print 2).
 */
function renderParticipantesAvataresEventoModal(participantesSel = []) {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('ev-participantes-container');
  if (!container) return;

  const membros = S.membrosPerfil || [];
  const todosMarcados = membros.length > 0 && membros.every(m => participantesSel.includes(m.id));

  let html = `
    <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:6px;align-items:center;width:100%;">
      <!-- Botão Marcar Todos -->
      <button type="button" class="btn ${todosMarcados ? 'btn-primary' : ''}" style="width:auto;margin:0;padding:6px 10px;font-size:11px;border-radius:20px;white-space:nowrap;" onclick="toggleTodosParticipantesEventoModal()">
        👥 Todos
      </button>
  `;

  membros.forEach(m => {
    const isSel = participantesSel.includes(m.id);
    const iniciais = (m.nome || 'M').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    html += `
      <div class="cal-avatar-part-wrap" onclick="toggleParticipanteAvatarModal('${m.id}')" style="display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;min-width:48px;">
        <div class="cal-avatar-circ ${isSel ? 'sel' : ''}" data-mid="${m.id}" style="width:40px;height:40px;border-radius:50%;background:${m.cor || 'var(--primary)'};display:flex;align-items:center;justify-content:center;position:relative;border:2.5px solid ${isSel ? '#ffffff' : 'transparent'};box-shadow:${isSel ? '0 0 0 2px ' + (m.cor || 'var(--primary)') : 'none'};transition:all 0.15s ease;">
          <span style="color:#ffffff;font-size:12px;font-weight:800;">${iniciais}</span>
          ${isSel ? '<span class="cal-avatar-check" style="position:absolute;bottom:-2px;right:-2px;background:#10B981;color:#ffffff;width:16px;height:16px;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center;border:1.5px solid #ffffff;font-weight:900;">✓</span>' : ''}
        </div>
        <span style="font-size:10px;color:var(--text);margin-top:4px;max-width:54px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:${isSel ? '700' : '400'};">${escapeHtml(m.nome.split(' ')[0])}</span>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

function toggleParticipanteAvatarModal(membroId) {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('ev-participantes-container');
  if (!container) return;

  const circ = container.querySelector(`.cal-avatar-circ[data-mid="${membroId}"]`);
  if (!circ) return;

  const wrap = circ.closest('.cal-avatar-part-wrap');
  const nomeLabel = wrap ? wrap.querySelector('span:last-child') : null;
  const membro = (S.membrosPerfil || []).find(m => m.id === membroId);
  const cor = membro?.cor || 'var(--primary)';

  if (circ.classList.contains('sel')) {
    circ.classList.remove('sel');
    circ.style.borderColor = 'transparent';
    circ.style.boxShadow = 'none';
    const chk = circ.querySelector('.cal-avatar-check');
    if (chk) chk.remove();
    if (nomeLabel) nomeLabel.style.fontWeight = '400';
  } else {
    circ.classList.add('sel');
    circ.style.borderColor = '#ffffff';
    circ.style.boxShadow = `0 0 0 2px ${cor}`;
    if (!circ.querySelector('.cal-avatar-check')) {
      const chk = document.createElement('span');
      chk.className = 'cal-avatar-check';
      chk.style.cssText = 'position:absolute;bottom:-2px;right:-2px;background:#10B981;color:#ffffff;width:16px;height:16px;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center;border:1.5px solid #ffffff;font-weight:900;';
      chk.textContent = '✓';
      circ.appendChild(chk);
    }
    if (nomeLabel) nomeLabel.style.fontWeight = '700';
  }
}

function toggleParticipanteEventoModal(membroId) {
  return toggleParticipanteAvatarModal(membroId);
}

function toggleTodosParticipantesEventoModal() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('ev-participantes-container');
  if (!container) return;

  const circs = Array.from(container.querySelectorAll('.cal-avatar-circ'));
  const todosMarcados = circs.length > 0 && circs.every(c => c.classList.contains('sel'));

  circs.forEach(c => {
    const mid = c.dataset.mid;
    if (todosMarcados) {
      if (c.classList.contains('sel')) toggleParticipanteAvatarModal(mid);
    } else {
      if (!c.classList.contains('sel')) toggleParticipanteAvatarModal(mid);
    }
  });
}

/**
 * Renderiza as 10 cores nomeadas com indicador textual e estilização do header (Print 2).
 */
function renderCoresNomeadasEventoModal(corAtiva = '#5581E3') {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('ev-cores-grid');
  const corHidden = document.getElementById('ev-cor');
  const nomeLabel = document.getElementById('ev-cor-nome-label');
  const headerModal = document.getElementById('ev-modal-header');

  if (corHidden) corHidden.value = corAtiva;
  if (nomeLabel) nomeLabel.textContent = obterNomeCorEvento(corAtiva);

  if (headerModal) {
    headerModal.style.background = corAtiva;
    headerModal.style.color = '#ffffff';
  }

  if (container) {
    container.innerHTML = CORES_EVENTO_NOMEADAS.map(c => {
      const isSel = c.hex.toLowerCase() === corAtiva.toLowerCase();
      return `
        <div data-cor="${c.hex}" title="${c.nome}" onclick="selecionarCorEventoNomeada('${c.hex}')" style="width:28px;height:28px;border-radius:50%;background:${c.hex};cursor:pointer;border:2.5px solid ${isSel ? '#ffffff' : 'transparent'};box-shadow:${isSel ? '0 0 0 2px ' + c.hex : 'none'};transition:all 0.15s ease;" role="button" aria-label="${c.nome}"></div>
      `;
    }).join('');
  }
}

function selecionarCorEventoNomeada(hex) {
  renderCoresNomeadasEventoModal(hex);
}

function selecionarCorEventoModal(cor) {
  // Alias de compatibilidade
  selecionarCorEventoNomeada(cor);
}

function formatarMinutosLembreteLegivel(minutos) {
  const m = Number(minutos);
  if (m === 0) return 'Na hora do evento';
  if (m === 5) return '5 minutos antes';
  if (m === 10) return '10 minutos antes';
  if (m === 15) return '15 minutos antes';
  if (m === 30) return '30 minutos antes';
  if (m === 60) return '1 hora antes';
  if (m === 120) return '2 horas antes';
  if (m === 1440) return '1 dia antes';
  if (m === 2880) return '2 dias antes';
  return `${m} min antes`;
}

/**
 * Renderiza a lista dinâmica de múltiplos lembretes configurados para o evento.
 */
function renderLembretesEventoForm() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('ev-lembretes-lista');
  if (!container) return;

  if (lembretesEditandoForm.length === 0) {
    container.innerHTML = '<span style="font-size:11px;color:var(--muted);">Nenhum lembrete configurado.</span>';
    return;
  }

  container.innerHTML = lembretesEditandoForm.map((min, idx) => `
    <span class="badge" style="background:var(--bg3);color:var(--text);border:1px solid var(--border2);padding:4px 8px;font-size:11px;display:inline-flex;align-items:center;gap:6px;border-radius:14px;">
      🔔 ${formatarMinutosLembreteLegivel(min)}
      <span style="cursor:pointer;font-weight:800;color:var(--red);font-size:12px;" onclick="removerLembreteEventoForm(${idx})" title="Remover lembrete">✕</span>
    </span>
  `).join('');
}

function adicionarLembreteEventoForm() {
  if (typeof document === 'undefined') return;
  const select = document.getElementById('ev-lembrete-seletor-novo');
  if (!select) return;

  const min = parseInt(select.value, 10);
  if (!isNaN(min) && !lembretesEditandoForm.includes(min)) {
    lembretesEditandoForm.push(min);
    lembretesEditandoForm.sort((a, b) => a - b);
    renderLembretesEventoForm();
  }
}

function removerLembreteEventoForm(index) {
  if (index >= 0 && index < lembretesEditandoForm.length) {
    lembretesEditandoForm.splice(index, 1);
    renderLembretesEventoForm();
  }
}

function toggleDiaInteiroEventoModal() {
  const diaIntChk = document.getElementById('ev-dia-inteiro');
  const colHrIni = document.getElementById('ev-col-hora-inicio');
  const colHrFim = document.getElementById('ev-col-hora-fim');
  if (!diaIntChk) return;

  const isDiaInteiro = diaIntChk.checked;
  if (colHrIni) colHrIni.style.display = isDiaInteiro ? 'none' : 'block';
  if (colHrFim) colHrFim.style.display = isDiaInteiro ? 'none' : 'block';
}

function salvarEventoCalendarioModal() {
  const titInput = document.getElementById('ev-titulo');
  const diaIntChk = document.getElementById('ev-dia-inteiro');
  const dtIniInput = document.getElementById('ev-data-inicio');
  const hrIniInput = document.getElementById('ev-hora-inicio');
  const dtFimInput = document.getElementById('ev-data-fim');
  const hrFimInput = document.getElementById('ev-hora-fim');
  const localInput = document.getElementById('ev-local');
  const descInput = document.getElementById('ev-descricao');
  const corHidden = document.getElementById('ev-cor');
  const repSelect = document.getElementById('ev-repeticao');
  const visivelSelect = document.getElementById('ev-visivel-para');
  const gastoInput = document.getElementById('ev-gasto-previsto');

  const titulo = titInput ? titInput.value.trim() : '';
  if (!titulo) {
    if (typeof alert === 'function') alert('Informe o título do evento.');
    return;
  }

  const dataInicio = dtIniInput ? dtIniInput.value : new Date().toISOString().slice(0, 10);
  const dataFim = dtFimInput ? dtFimInput.value : dataInicio;
  const diaInteiro = diaIntChk ? diaIntChk.checked : false;
  const horaInicio = diaInteiro ? '' : (hrIniInput ? hrIniInput.value : '09:00');
  const horaFim = diaInteiro ? '' : (hrFimInput ? hrFimInput.value : '10:00');
  const local = localInput ? localInput.value.trim() : '';
  const descricao = descInput ? descInput.value.trim() : '';
  const cor = corHidden ? corHidden.value : '#5581E3';
  const corNome = obterNomeCorEvento(cor);
  const repeticao = repSelect ? repSelect.value : 'nenhuma';
  const visivelPara = visivelSelect ? visivelSelect.value : 'todos';
  const lembretesMinutos = Array.isArray(lembretesEditandoForm) && lembretesEditandoForm.length > 0
    ? [...lembretesEditandoForm]
    : [30];
  const lembreteMinutos = lembretesMinutos[0] || 30; // Compatibilidade legada
  const gastoPrevisto = gastoInput && membroAtualPodeVerFinancas() ? parseFloat(gastoInput.value) || 0 : 0;

  // Participantes selecionados nos avatares
  const participantesIds = [];
  if (typeof document !== 'undefined') {
    document.querySelectorAll('#ev-participantes-container .cal-avatar-circ.sel').forEach(circ => {
      if (circ.dataset.mid) participantesIds.push(circ.dataset.mid);
    });
  }
  if (participantesIds.length === 0) {
    participantesIds.push(S.membroAtivoId || 'm_1');
  }

  const dadosEvento = {
    titulo,
    dataInicio,
    horaInicio,
    dataFim,
    horaFim,
    diaInteiro,
    local,
    descricao,
    participantesIds,
    cor,
    corNome,
    repeticao,
    visivelPara,
    lembretesMinutos,
    lembreteMinutos,
    gastoPrevisto
  };

  if (eventoEditandoId) {
    editarEventoCalendario(eventoEditandoId, dadosEvento);
  } else {
    criarEventoCalendario(dadosEvento);
  }

  closeM('m-evento-calendario');
  eventoEditandoId = null;
  exibirToastNotificacao(`Evento "${titulo}" salvo na agenda!`, '📅');
}

function excluirEventoCalendarioModal() {
  if (!eventoEditandoId) return;
  if (typeof confirm === 'function' && !confirm('Tem certeza de que deseja excluir este evento?')) {
    return;
  }
  excluirEventoCalendario(eventoEditandoId);
  closeM('m-evento-calendario');
  eventoEditandoId = null;
  exibirToastNotificacao('Evento removido do calendário', '🗑️');
}

// --- MODAL DETALHES DO EVENTO (PRINT 1 - Calendário Pro v2.1) ---

/**
 * Abre o modal de Detalhes Ricos do Evento:
 * Cabeçalho colorido, data extensa, participantes com foto, cor, lembretes,
 * local com botão de rota e preview de mapa, além de curtidas e feed de comentários.
 */
function abrirDetalheEventoCalendario(eventoId) {
  if (typeof document === 'undefined') return;

  // Procura em S.eventosCalendario ou evento consolidado
  let evento = (S.eventosCalendario || []).find(e => e.id === eventoId);
  if (!evento) {
    // Tenta obter evento consolidado por ID
    const consolidados = obterEventosConsolidadosPeriodo('2020-01-01', '2030-12-31');
    evento = consolidados.find(e => e.origemId === eventoId || e.id === eventoId);
  }

  if (!evento) return;
  eventoVisualizandoDetalheId = evento.id || evento.origemId;

  renderDetalheEventoModal(evento);
  openM('m-detalhe-evento-calendario');
}

function fecharDetalheEventoCalendario() {
  closeM('m-detalhe-evento-calendario');
  eventoVisualizandoDetalheId = null;
}

function editarEventoAtualModal() {
  const id = eventoVisualizandoDetalheId;
  fecharDetalheEventoCalendario();
  if (id) {
    abrirModalEventoCalendario(id);
  }
}

function confirmarExcluirEventoAtualModal() {
  const id = eventoVisualizandoDetalheId;
  if (!id) return;
  if (typeof confirm === 'function' && !confirm('Deseja realmente excluir este evento?')) {
    return;
  }
  fecharDetalheEventoCalendario();
  excluirEventoCalendario(id);
  exibirToastNotificacao('Evento removido com sucesso.', '🗑️');
}

/**
 * Renderiza o conteúdo rico de `#m-detalhe-evento-calendario` (Print 1).
 */
function renderDetalheEventoModal(evento) {
  if (typeof document === 'undefined') return;

  const headerEl = document.getElementById('ev-det-header');
  const titEl = document.getElementById('ev-det-titulo');
  const dataEl = document.getElementById('ev-det-data-hora');
  const partEl = document.getElementById('ev-det-participantes');
  const corEl = document.getElementById('ev-det-cor-tag');
  const lembretesEl = document.getElementById('ev-det-lembretes');
  const localEl = document.getElementById('ev-det-local-container');
  const descEl = document.getElementById('ev-det-descricao-container');
  const curtidasBtn = document.getElementById('ev-det-btn-curtir');
  const curtidasTexto = document.getElementById('ev-det-curtidas-texto');
  const comentariosContainer = document.getElementById('ev-det-comentarios-lista');

  const corHex = evento.cor || '#5581E3';
  const corNome = evento.corNome || obterNomeCorEvento(corHex);

  // 1. Cabeçalho colorido
  if (headerEl) {
    headerEl.style.background = corHex;
    headerEl.style.color = '#ffffff';
  }

  // 2. Título
  if (titEl) {
    titEl.textContent = evento.titulo || 'Evento';
  }

  // 3. Data e Horário por Extenso
  if (dataEl) {
    const dataIso = evento.dataInicio || evento.data || '';
    let dataFormatada = dataIso;
    if (dataIso) {
      const [y, m, d] = dataIso.split('-').map(Number);
      const dtObj = new Date(y, m - 1, d);
      const diasSemanaNomes = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      dataFormatada = `${diasSemanaNomes[dtObj.getDay()]}, ${d} de ${mesesNomes[m - 1]} de ${y}`;
    }

    const horarioStr = evento.diaInteiro
      ? 'Dia inteiro'
      : (evento.horaInicio ? `${evento.horaInicio}${evento.horaFim ? ' – ' + evento.horaFim : ''}` : 'Horário não definido');

    dataEl.innerHTML = `
      <div style="font-size:13px;font-weight:700;color:var(--text);">${dataFormatada}</div>
      <div style="font-size:12px;color:var(--muted);">${horarioStr}</div>
    `;
  }

  // 4. Participantes
  if (partEl) {
    const partIds = Array.isArray(evento.participantesIds) ? evento.participantesIds : [];
    const membros = (S.membrosPerfil || []).filter(m => partIds.includes(m.id));

    if (membros.length === 0) {
      partEl.innerHTML = '<span style="font-size:12px;color:var(--muted);">Toda a família</span>';
    } else {
      partEl.innerHTML = `
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
          ${membros.map(m => {
            const iniciais = (m.nome || 'M').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
            return `
              <span class="badge" style="background:${m.cor}22;color:${m.cor};border:1px solid ${m.cor}44;padding:3px 8px;font-size:11px;display:inline-flex;align-items:center;gap:4px;border-radius:12px;">
                <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${m.cor};color:#fff;font-size:9px;line-height:16px;text-align:center;font-weight:800;">${iniciais}</span>
                ${escapeHtml(m.nome)}
              </span>
            `;
          }).join('')}
        </div>
      `;
    }
  }

  // 5. Cor
  if (corEl) {
    corEl.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;">
        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${corHex};"></span>
        ${escapeHtml(corNome)}
      </span>
    `;
  }

  // 6. Lembretes
  if (lembretesEl) {
    const lembretes = Array.isArray(evento.lembretesMinutos) && evento.lembretesMinutos.length > 0
      ? evento.lembretesMinutos
      : (evento.lembreteMinutos !== undefined ? [evento.lembreteMinutos] : [30]);

    lembretesEl.innerHTML = lembretes.map(min => `
      <span class="badge" style="background:var(--bg3);color:var(--text);border:1px solid var(--border2);font-size:11px;padding:3px 8px;border-radius:10px;">
        🔔 ${formatarMinutosLembreteLegivel(min)}
      </span>
    `).join(' ');
  }

  // 7. Local com Botão e Preview de Mapa
  if (localEl) {
    if (evento.local && evento.local.trim()) {
      const localEncoded = encodeURIComponent(evento.local.trim());
      localEl.style.display = 'block';
      localEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:15px;">📍</span>
            <span style="font-size:13px;font-weight:700;color:var(--text);">${escapeHtml(evento.local)}</span>
          </div>
          <a href="https://www.google.com/maps/search/?api=1&query=${localEncoded}" target="_blank" rel="noopener noreferrer" class="btn" style="width:auto;margin:0;padding:4px 8px;font-size:11px;text-decoration:none;">
            🗺️ Rota
          </a>
        </div>
        <!-- Card Visual de Preview do Mapa -->
        <div class="cal-map-preview" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${localEncoded}','_blank')" style="background:linear-gradient(135deg, #1e293b, #0f172a);border-radius:8px;padding:12px;display:flex;align-items:center;gap:12px;cursor:pointer;border:1px solid var(--border2);">
          <div style="width:36px;height:36px;border-radius:50%;background:rgba(239,68,68,0.2);display:flex;align-items:center;justify-content:center;color:#ef4444;font-size:18px;">
            📍
          </div>
          <div>
            <div style="font-size:12px;font-weight:700;color:#ffffff;">Visualizar no Google Maps</div>
            <div style="font-size:10px;color:#94a3b8;">${escapeHtml(evento.local)}</div>
          </div>
        </div>
      `;
    } else {
      localEl.style.display = 'none';
      localEl.innerHTML = '';
    }
  }

  // 8. Descrição
  if (descEl) {
    if (evento.descricao && evento.descricao.trim()) {
      descEl.style.display = 'block';
      descEl.innerHTML = `
        <div style="font-size:11px;color:var(--muted);margin-bottom:2px;font-weight:700;">OBSERVAÇÕES</div>
        <p style="font-size:12px;color:var(--text);margin:0;white-space:pre-line;">${escapeHtml(evento.descricao)}</p>
      `;
    } else {
      descEl.style.display = 'none';
      descEl.innerHTML = '';
    }
  }

  // 9. Bloco Social: Curtidas
  const membroAtivoId = S.membroAtivoId || 'm_1';
  const curtidas = Array.isArray(evento.curtidasIds) ? evento.curtidasIds : [];
  const jaCurtiu = curtidas.includes(membroAtivoId);

  if (curtidasBtn) {
    curtidasBtn.innerHTML = jaCurtiu ? '❤️ Curtido' : '🤍 Curtir';
    curtidasBtn.style.color = jaCurtiu ? '#EF4444' : 'var(--text)';
  }

  if (curtidasTexto) {
    if (curtidas.length === 0) {
      curtidasTexto.textContent = 'Seja o primeiro a curtir este compromisso!';
    } else {
      const nomes = (S.membrosPerfil || [])
        .filter(m => curtidas.includes(m.id))
        .map(m => m.id === membroAtivoId ? 'Você' : m.nome.split(' ')[0]);
      curtidasTexto.textContent = `${nomes.join(', ')} curtiram (${curtidas.length})`;
    }
  }

  // 10. Bloco Social: Feed de Comentários
  if (comentariosContainer) {
    const comentarios = Array.isArray(evento.comentarios) ? evento.comentarios : [];
    if (comentarios.length === 0) {
      comentariosContainer.innerHTML = '<p style="font-size:11px;color:var(--muted);margin:4px 0;">Nenhum comentário ainda. Deixe uma mensagem para a família!</p>';
    } else {
      comentariosContainer.innerHTML = comentarios.map(c => `
        <div style="background:var(--bg3);border-radius:8px;padding:8px 10px;margin-bottom:6px;border:1px solid var(--border);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
            <span style="font-size:11px;font-weight:700;color:var(--text);">${escapeHtml(c.membroNome || 'Familiar')}</span>
            <span style="font-size:10px;color:var(--muted);">${c.criadoEm ? new Date(c.criadoEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
          </div>
          <p style="font-size:12px;margin:0;color:var(--text);">${escapeHtml(c.texto)}</p>
        </div>
      `).join('');
    }
  }
}

function curtirEventoAtualDetalhe() {
  if (!eventoVisualizandoDetalheId) return;
  const res = curtirEventoCalendario(eventoVisualizandoDetalheId);
  if (res.ok) {
    const evento = (S.eventosCalendario || []).find(e => e.id === eventoVisualizandoDetalheId);
    if (evento) renderDetalheEventoModal(evento);
  }
}

function enviarComentarioEventoDetalhe() {
  if (!eventoVisualizandoDetalheId) return;
  const input = document.getElementById('ev-detalhe-novo-comentario');
  if (!input) return;

  const texto = input.value.trim();
  if (!texto) return;

  const res = adicionarComentarioEventoCalendario(eventoVisualizandoDetalheId, texto);
  if (res.ok) {
    input.value = '';
    const evento = (S.eventosCalendario || []).find(e => e.id === eventoVisualizandoDetalheId);
    if (evento) renderDetalheEventoModal(evento);
  }
}

// --- MODAL CONFIGURAÇÕES DO CALENDÁRIO (PRINTS 3 e 4) ---

function abrirModalConfigCalendario() {
  if (typeof document === 'undefined') return;

  const cfg = S.configCalendario || {};

  // Checkboxes de Camadas
  const chkEventos = document.getElementById('cfg-cal-camada-eventos');
  const chkTarefas = document.getElementById('cfg-cal-camada-tarefas');
  const chkFeriados = document.getElementById('cfg-cal-camada-feriados');
  const chkAniv = document.getElementById('cfg-cal-camada-aniversarios');
  const chkFin = document.getElementById('cfg-cal-camada-financas');
  const wrapFin = document.getElementById('cfg-cal-wrap-financas');

  if (chkEventos) chkEventos.checked = Boolean(camadasCalendarioAtivas.eventos);
  if (chkTarefas) chkTarefas.checked = Boolean(camadasCalendarioAtivas.tarefas);
  if (chkFeriados) chkFeriados.checked = Boolean(camadasCalendarioAtivas.feriados);
  if (chkAniv) chkAniv.checked = Boolean(camadasCalendarioAtivas.aniversarios);

  if (wrapFin) {
    wrapFin.style.display = membroAtualPodeVerFinancas() ? 'block' : 'none';
  }
  if (chkFin) {
    chkFin.checked = Boolean(camadasCalendarioAtivas.financas);
  }

  // Preferências
  const swFeriadosBrasil = document.getElementById('cfg-cal-feriados-brasil');
  const swNumSemana = document.getElementById('cfg-cal-num-semana');
  const selDiaSemana = document.getElementById('cfg-cal-primeiro-dia');
  const selLembretePadrao = document.getElementById('cfg-cal-lembrete-padrao');
  const swLembreteDiario = document.getElementById('cfg-cal-lembrete-diario');

  if (swFeriadosBrasil) swFeriadosBrasil.checked = cfg.feriadosBrasil !== false;
  if (swNumSemana) swNumSemana.checked = Boolean(cfg.mostrarNumeroSemana);
  if (selDiaSemana) selDiaSemana.value = String(cfg.primeiroDiaSemana || 0);
  if (selLembretePadrao) selLembretePadrao.value = String(cfg.lembretePadraoMinutos || 30);
  if (swLembreteDiario) swLembreteDiario.checked = Boolean(cfg.lembreteDiarioAgenda);

  openM('m-config-calendario');
}

function fecharModalConfigCalendario() {
  closeM('m-config-calendario');
}

function salvarConfigCalendarioModal() {
  const swFeriadosBrasil = document.getElementById('cfg-cal-feriados-brasil');
  const swNumSemana = document.getElementById('cfg-cal-num-semana');
  const selDiaSemana = document.getElementById('cfg-cal-primeiro-dia');
  const selLembretePadrao = document.getElementById('cfg-cal-lembrete-padrao');
  const swLembreteDiario = document.getElementById('cfg-cal-lembrete-diario');

  const chkEventos = document.getElementById('cfg-cal-camada-eventos');
  const chkTarefas = document.getElementById('cfg-cal-camada-tarefas');
  const chkFeriados = document.getElementById('cfg-cal-camada-feriados');
  const chkAniv = document.getElementById('cfg-cal-camada-aniversarios');
  const chkFin = document.getElementById('cfg-cal-camada-financas');

  // Atualiza camadas
  if (chkEventos) camadasCalendarioAtivas.eventos = chkEventos.checked;
  if (chkTarefas) camadasCalendarioAtivas.tarefas = chkTarefas.checked;
  if (chkFeriados) camadasCalendarioAtivas.feriados = chkFeriados.checked;
  if (chkAniv) camadasCalendarioAtivas.aniversarios = chkAniv.checked;
  if (chkFin && membroAtualPodeVerFinancas()) camadasCalendarioAtivas.financas = chkFin.checked;

  const dadosConfig = {
    feriadosBrasil: swFeriadosBrasil ? swFeriadosBrasil.checked : true,
    mostrarNumeroSemana: swNumSemana ? swNumSemana.checked : false,
    primeiroDiaSemana: selDiaSemana ? parseInt(selDiaSemana.value, 10) : 0,
    lembretePadraoMinutos: selLembretePadrao ? parseInt(selLembretePadrao.value, 10) : 30,
    lembreteDiarioAgenda: swLembreteDiario ? swLembreteDiario.checked : false
  };

  salvarConfigCalendario(dadosConfig);
  closeM('m-config-calendario');
  exibirToastNotificacao('Configurações do Calendário salvas!', '⚙️');
}

function executarLimpezaEventosAntigosModal() {
  if (typeof confirm === 'function' && !confirm('Deseja remover eventos antigos com mais de 3 meses do calendário? Contas e finanças não serão afetadas.')) {
    return;
  }
  const res = limparEventosAntigosCalendario(3);
  exibirToastNotificacao(`Limpeza concluída: ${res.removidos} eventos antigos removidos.`, '🧹');
}

// --- MODAL DE BUSCA NO CALENDÁRIO ---

function abrirModalBuscaCalendario() {
  if (typeof document === 'undefined') return;
  const input = document.getElementById('cal-busca-termo');
  const container = document.getElementById('cal-busca-resultados');
  if (input) input.value = '';
  if (container) container.innerHTML = '<p style="font-size:12px;color:var(--muted);text-align:center;padding:16px;">Digite acima para buscar eventos, locais, pessoas ou feriados...</p>';
  openM('m-busca-calendario');
  if (input) setTimeout(() => input.focus(), 100);
}

function fecharModalBuscaCalendario() {
  closeM('m-busca-calendario');
}

function executarBuscaCalendarioModal() {
  if (typeof document === 'undefined') return;
  const input = document.getElementById('cal-busca-termo');
  const container = document.getElementById('cal-busca-resultados');
  if (!input || !container) return;

  const termo = input.value.trim();
  if (!termo) {
    container.innerHTML = '<p style="font-size:12px;color:var(--muted);text-align:center;padding:16px;">Digite algo para buscar.</p>';
    return;
  }

  const resultados = buscarEventosCalendario(termo);
  if (resultados.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:24px;color:var(--muted);">
        <p style="font-size:24px;margin-bottom:6px;">🔍</p>
        <p style="font-size:13px;font-weight:700;color:var(--text);margin:0 0 2px;">Nenhum evento encontrado</p>
        <p style="font-size:11px;margin:0;">Tente outro termo ou verifique se as camadas estão ativas.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = resultados.map(r => `
    <div class="cal-item-card" style="border-left:4px solid ${r.cor};margin-bottom:8px;" onclick="closeM('m-busca-calendario');${r.tipo === 'evento' ? `abrirDetalheEventoCalendario('${r.origemId}')` : `abrirDiaCalendario('${r.data}')`}">
      <div style="font-size:20px;">${r.icone}</div>
      <div style="flex:1;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:13px;font-weight:800;color:var(--text);">${escapeHtml(r.titulo)}</span>
          <span style="font-size:11px;color:var(--muted);">${r.data}</span>
        </div>
        ${r.subtexto ? `<div style="font-size:11px;color:var(--muted);margin-top:2px;">${escapeHtml(r.subtexto)}</div>` : ''}
        ${r.local ? `<div style="font-size:11px;color:var(--primary);margin-top:2px;">📍 ${escapeHtml(r.local)}</div>` : ''}
      </div>
    </div>
  `).join('');
}

// --- MODAL DE CRIAÇÃO DE EVENTO POR TEXTO LIVRE / IA (Print 2 Banner) ---

function abrirModalParserTextoIA() {
  if (typeof document === 'undefined') return;
  const input = document.getElementById('parser-texto-ia-input');
  if (input) input.value = '';
  openM('m-parser-texto-ia');
  if (input) setTimeout(() => input.focus(), 100);
}

function fecharModalParserTextoIA() {
  closeM('m-parser-texto-ia');
}

function processarParserTextoIAModal() {
  if (typeof document === 'undefined') return;
  const input = document.getElementById('parser-texto-ia-input');
  const texto = input ? input.value.trim() : '';
  if (!texto) {
    if (typeof alert === 'function') alert('Cole uma mensagem de WhatsApp, e-mail ou convite para processar.');
    return;
  }

  const dadosDetectados = preencherEventoPorTextoIA(texto);
  fecharModalParserTextoIA();

  // Abre o modal de evento já pré-preenchido pela IA para revisão
  abrirModalEventoCalendario(null, null, dadosDetectados);
  exibirToastNotificacao('Dados preenchidos pela IA! Revise e confirme.', '✨');
}

// --- ANIVERSÁRIOS ---

function abrirModalAniversarios() {
  if (typeof document === 'undefined') return;

  const container = document.getElementById('aniv-lista-container');
  const membroSelect = document.getElementById('aniv-membro-id');

  if (membroSelect) {
    membroSelect.innerHTML = [
      '<option value="">Não vincular (Externo)</option>',
      ...(S.membrosPerfil || []).map(m => `<option value="${m.id}">${escapeHtml(m.nome)}</option>`)
    ].join('');
  }

  if (container) {
    const lista = S.aniversarios || [];
    if (lista.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align:center;padding:16px;color:var(--muted);background:var(--bg2);">
          <p style="font-size:24px;margin-bottom:4px;">🎂</p>
          <p style="font-size:12px;margin:0;">Nenhum aniversário cadastrado ainda.</p>
        </div>
      `;
    } else {
      // Ordena por proximidade dos próximos aniversários
      const ordenados = [...lista].map(a => {
        const prox = calcularProximoAniversario(a.dataNascimento);
        return { ...a, ...prox };
      }).sort((x, y) => x.diasRestantes - y.diasRestantes);

      container.innerHTML = ordenados.map(a => {
        const [y, m, d] = a.dataNascimento.split('-');
        const diasTxt = a.diasRestantes === 0
          ? '🎉 É HOJE!'
          : a.diasRestantes === 1
          ? 'Amanhã!'
          : `Em ${a.diasRestantes} dias`;
        const corDias = a.diasRestantes <= 7 ? 'var(--red)' : 'var(--primary)';

        return `
          <div class="card" style="padding:10px 12px;margin:0;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #EC4899;">
            <div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="font-size:16px;">🎂</span>
                <span style="font-weight:700;font-size:14px;">${escapeHtml(a.nomePessoa)}</span>
                ${a.parentesco ? `<span style="font-size:11px;color:var(--muted);">(${escapeHtml(a.parentesco)})</span>` : ''}
              </div>
              <p style="font-size:11px;color:var(--muted);margin:2px 0 0;">
                Nasc: ${d}/${m}/${y} • Vai fazer <strong>${a.idade} anos</strong>
              </p>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:11px;font-weight:700;color:${corDias};">${diasTxt}</span>
              <span style="cursor:pointer;color:var(--muted);font-size:16px;padding:2px 6px;" onclick="excluirAniversarianteModal('${a.id}')" title="Excluir">×</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  openM('m-aniversarios');
}

function salvarAniversarianteModal() {
  const nomeInput = document.getElementById('aniv-nome');
  const dataInput = document.getElementById('aniv-data');
  const parentescoInput = document.getElementById('aniv-parentesco');
  const membroSelect = document.getElementById('aniv-membro-id');
  const lembreteSelect = document.getElementById('aniv-lembrete-dias');

  const nomePessoa = nomeInput ? nomeInput.value.trim() : '';
  const dataNascimento = dataInput ? dataInput.value : '';
  const parentesco = parentescoInput ? parentescoInput.value.trim() : '';
  const membroId = membroSelect ? membroSelect.value : '';
  const avisoDiasAntes = lembreteSelect ? parseInt(lembreteSelect.value, 10) : 7;

  if (!nomePessoa || !dataNascimento) {
    if (typeof alert === 'function') alert('Preencha o nome e a data de nascimento.');
    return;
  }

  adicionarAniversariante({
    nomePessoa,
    dataNascimento,
    parentesco,
    membroId,
    avisoDiasAntes
  });

  if (nomeInput) nomeInput.value = '';
  if (dataInput) dataInput.value = '';
  if (parentescoInput) parentescoInput.value = '';

  abrirModalAniversarios(); // Atualiza listagem
}

function excluirAniversarianteModal(id) {
  if (typeof confirm === 'function' && !confirm('Deseja excluir este aniversariante?')) {
    return;
  }
  excluirAniversariante(id);
  abrirModalAniversarios();
}

// --- IMPORTADOR ICAL (.ICS) ---

function abrirModalImportarICal() {
  if (typeof document === 'undefined') return;
  const msg = document.getElementById('ical-status-msg');
  if (msg) msg.textContent = '';
  const txt = document.getElementById('ical-conteudo');
  if (txt) txt.value = '';
  const f = document.getElementById('ical-file');
  if (f) f.value = '';
  bufferImportacaoICal = '';
  openM('m-importar-ical');
}

function lerArquivoICal(input) {
  if (!input || !input.files || !input.files[0]) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    bufferImportacaoICal = e.target.result || '';
    const txt = document.getElementById('ical-conteudo');
    if (txt) txt.value = bufferImportacaoICal;
    const msg = document.getElementById('ical-status-msg');
    if (msg) msg.textContent = `Arquivo carregado: ${file.name} (${file.size} bytes)`;
  };
  reader.onerror = function(err) {
    console.error('Erro ao ler arquivo iCal:', err);
    const msg = document.getElementById('ical-status-msg');
    if (msg) msg.textContent = 'Erro ao ler o arquivo selecionado.';
  };
  reader.readAsText(file);
}

function confirmarImportarICalModal() {
  const txt = document.getElementById('ical-conteudo');
  const conteudo = (txt && txt.value.trim()) ? txt.value.trim() : bufferImportacaoICal;
  const msg = document.getElementById('ical-status-msg');

  if (!conteudo) {
    if (typeof alert === 'function') alert('Selecione um arquivo .ics ou cole o conteúdo do calendário.');
    return;
  }

  const res = importarEventosICal(conteudo);
  if (res.ok) {
    closeM('m-importar-ical');
    exibirToastNotificacao(`Importados ${res.importados} novos eventos com sucesso!`, '📥');
  } else {
    if (msg) msg.textContent = `Erro: ${res.erro || 'Falha ao processar arquivo'}`;
  }
}

/**
 * Retorna o número da semana ISO (W1..W52) para exibição de badge no calendário.
 */
function obterNumeroSemanaISO(data) {
  const d = new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Seleciona um dia na grade do calendário iOS Split View e atualiza os compromissos exibidos abaixo.
 */
function selecionarDiaCalendarioSplit(diaISO) {
  diaSelecionadoCalendario = diaISO;
  renderCalendario();
}

/**
 * Renderizador mestre da interface do Calendário Compartilhado Pro (Padrão iPhone iOS / FamilyWall).
 * Células compactas de 48px, número circular Apple, pontinhos coloridos de eventos
 * e Split View interativa exibindo os compromissos do dia selecionado.
 */
function renderCalendario() {
  if (typeof document === 'undefined') return;

  const refDate = dataReferenciaCalendario || new Date();
  const anoRef = refDate.getFullYear();
  const mesRef = refDate.getMonth(); // 0-11
  const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const mesesNomesAbrev = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const cfg = S.configCalendario || {};
  const primeiroDiaSem = cfg.primeiroDiaSemana === 1 ? 1 : 0; // 0=Dom, 1=Seg
  const mostrarSemana = Boolean(cfg.mostrarNumeroSemana);

  // Ordem dos dias da semana no cabeçalho
  const diasSemanaNomes = primeiroDiaSem === 1
    ? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Atualiza título do período no cabeçalho
  const titPeriodo = document.getElementById('cal-titulo-periodo');
  if (titPeriodo) {
    if (visaoCalendarioAtual === 'mes') {
      titPeriodo.textContent = `${mesesNomes[mesRef]} ${anoRef}`;
    } else if (visaoCalendarioAtual === 'semana') {
      const dtSemanaIni = new Date(refDate);
      const diff = dtSemanaIni.getDay() - primeiroDiaSem;
      dtSemanaIni.setDate(refDate.getDate() - (diff < 0 ? diff + 7 : diff));
      const dtSemanaFim = new Date(dtSemanaIni);
      dtSemanaFim.setDate(dtSemanaIni.getDate() + 6);
      titPeriodo.textContent = `${dtSemanaIni.getDate()} ${mesesNomesAbrev[dtSemanaIni.getMonth()]} - ${dtSemanaFim.getDate()} ${mesesNomesAbrev[dtSemanaFim.getMonth()]} ${anoRef}`;
    } else if (visaoCalendarioAtual === 'dia') {
      titPeriodo.textContent = `${refDate.getDate()} de ${mesesNomes[mesRef]} de ${anoRef}`;
    } else {
      titPeriodo.textContent = `Agenda: ${mesesNomes[mesRef]} ${anoRef}`;
    }
  }

  // Renderiza Chips de Filtro por Membro
  const fMembrosContainer = document.getElementById('cal-filtros-membros-container');
  if (fMembrosContainer) {
    const membros = S.membrosPerfil || [];
    fMembrosContainer.innerHTML = [
      `<button type="button" class="filtro-pill ${filtroMembroCalendario === 'todos' ? 'sel' : ''}" onclick="filtrarCalendarioMembro('todos')">Todos</button>`,
      ...membros.map(m => `
        <button type="button" class="filtro-pill ${filtroMembroCalendario === m.id ? 'sel' : ''}" style="${filtroMembroCalendario === m.id ? `background:${m.cor};color:#fff;border-color:${m.cor};` : ''}" onclick="filtrarCalendarioMembro('${m.id}')">
          👤 ${escapeHtml(m.nome)}
        </button>
      `)
    ].join('');
  }

  // Toggles de Camadas (oculta 'financas' se for criança - RLS infantil)
  const podeVerFin = membroAtualPodeVerFinancas();
  const btnFinancas = document.getElementById('toggle-camada-financas');
  if (btnFinancas) {
    btnFinancas.style.display = podeVerFin ? 'inline-block' : 'none';
  }

  ['eventos', 'financas', 'tarefas', 'aniversarios', 'feriados'].forEach(camada => {
    const btn = document.getElementById(`toggle-camada-${camada}`);
    if (btn) {
      if (camadasCalendarioAtivas[camada]) btn.classList.add('sel');
      else btn.classList.remove('sel');
    }
  });

  // Data atual em formato YYYY-MM-DD
  const hojeISO = new Date().toISOString().slice(0, 10);

  // --- 1. VISÃO MÊS (Padrão iPhone iOS Calendar / Split View) ---
  const secMes = document.getElementById('cal-visao-mes');
  if (secMes && visaoCalendarioAtual === 'mes') {
    const dia1Obj = new Date(anoRef, mesRef, 1);
    const totalDiasMes = new Date(anoRef, mesRef + 1, 0).getDate();
    const totalDiasMesAnt = new Date(anoRef, mesRef, 0).getDate();

    if (!diaSelecionadoCalendario) {
      diaSelecionadoCalendario = hojeISO;
    }

    // Cálculo do deslocamento inicial respeitando primeiroDiaSemana
    let primeiroDiaSemanaOffset = dia1Obj.getDay(); // 0=Dom..6=Sáb
    if (primeiroDiaSem === 1) {
      // 1=Segunda: Seg(1)->0, Ter(2)->1, ..., Dom(0)->6
      primeiroDiaSemanaOffset = (primeiroDiaSemanaOffset + 6) % 7;
    }

    // Intervalo estendido cobrindo bordas do mês para obter eventos completos
    const dtIniMesAnt = new Date(anoRef, mesRef, 1 - primeiroDiaSemanaOffset);
    const totalCelulas = primeiroDiaSemanaOffset + totalDiasMes;
    const celulasFinais = (7 - (totalCelulas % 7)) % 7;
    const dtFimMesProx = new Date(anoRef, mesRef, totalDiasMes + celulasFinais);

    const dtIniRange = dtIniMesAnt.toISOString().slice(0, 10);
    const dtFimRange = dtFimMesProx.toISOString().slice(0, 10);
    const eventosDoMes = obterEventosConsolidadosPeriodo(dtIniRange, dtFimRange);

    // Mapeia eventos por dia 'YYYY-MM-DD'
    const mapaEventosDia = {};
    eventosDoMes.forEach(ev => {
      if (!mapaEventosDia[ev.data]) mapaEventosDia[ev.data] = [];
      mapaEventosDia[ev.data].push(ev);
    });

    let htmlGrade = `
      <div class="cal-grid-dias" style="display:grid;grid-template-columns:${mostrarSemana ? '32px ' : ''}repeat(7, 1fr);gap:3px;margin-bottom:6px;">
        ${mostrarSemana ? '<div class="cal-header-dia" style="font-size:10px;color:var(--muted);text-align:center;">#Sem</div>' : ''}
        ${diasSemanaNomes.map(d => `<div class="cal-header-dia">${d}</div>`).join('')}
      </div>
      <div class="cal-grid-dias" style="display:grid;grid-template-columns:${mostrarSemana ? '32px ' : ''}repeat(7, 1fr);gap:3px;">
    `;

    // Função auxiliar para renderizar célula de dia compacta estilo iOS
    function renderCelulaDia(diaISO, numDia, isOutroMes, numSemana = null) {
      const isHoje = diaISO === hojeISO;
      const isSel = diaISO === diaSelecionadoCalendario;
      const itensDoDia = mapaEventosDia[diaISO] || [];

      // Pontinhos coloridos estilo iOS (até 4 pontinhos por dia)
      const dotsHtml = itensDoDia.slice(0, 4).map(it => `
        <span class="cal-dot" style="background:${it.cor || 'var(--primary)'};"></span>
      `).join('');

      const badgeSemanaHtml = (mostrarSemana && numSemana !== null)
        ? `<div class="cal-col-semana">W${numSemana}</div>`
        : '';

      return `
        ${badgeSemanaHtml}
        <div class="cal-celula-dia ${isOutroMes ? 'outro-mes' : ''} ${isHoje ? 'hoje' : ''} ${isSel ? 'selecionado' : ''}" onclick="selecionarDiaCalendarioSplit('${diaISO}')" title="${diaISO}: ${itensDoDia.length} eventos">
          <div class="cal-dia-num-badge">${numDia}</div>
          <div class="cal-dots-wrap">
            ${dotsHtml}
          </div>
        </div>
      `;
    }

    let contadorColunaSemana = 0;

    // 1. Dias do mês anterior
    for (let i = primeiroDiaSemanaOffset - 1; i >= 0; i--) {
      const numDia = totalDiasMesAnt - i;
      const mesAntRef = mesRef === 0 ? 11 : mesRef - 1;
      const anoAntRef = mesRef === 0 ? anoRef - 1 : anoRef;
      const diaISO = `${anoAntRef}-${String(mesAntRef + 1).padStart(2, '0')}-${String(numDia).padStart(2, '0')}`;
      const dtObj = new Date(anoAntRef, mesAntRef, numDia);
      const isInicioSemana = contadorColunaSemana % 7 === 0;
      const numSem = isInicioSemana ? obterNumeroSemanaISO(dtObj) : null;

      htmlGrade += renderCelulaDia(diaISO, numDia, true, numSem);
      contadorColunaSemana++;
    }

    // 2. Dias do mês atual
    for (let d = 1; d <= totalDiasMes; d++) {
      const diaISO = `${anoRef}-${String(mesRef + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dtObj = new Date(anoRef, mesRef, d);
      const isInicioSemana = contadorColunaSemana % 7 === 0;
      const numSem = isInicioSemana ? obterNumeroSemanaISO(dtObj) : null;

      htmlGrade += renderCelulaDia(diaISO, d, false, numSem);
      contadorColunaSemana++;
    }

    // 3. Dias do próximo mês
    for (let d = 1; d <= celulasFinais; d++) {
      const mesProxRef = mesRef === 11 ? 0 : mesRef + 1;
      const anoProxRef = mesRef === 11 ? anoRef + 1 : anoRef;
      const diaISO = `${anoProxRef}-${String(mesProxRef + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dtObj = new Date(anoProxRef, mesProxRef, d);
      const isInicioSemana = contadorColunaSemana % 7 === 0;
      const numSem = isInicioSemana ? obterNumeroSemanaISO(dtObj) : null;

      htmlGrade += renderCelulaDia(diaISO, d, true, numSem);
      contadorColunaSemana++;
    }

    htmlGrade += '</div>';

    // --- SEÇÃO SPLIT VIEW DO DIA SELECIONADO (iOS Split View) ---
    const itensDiaSel = mapaEventosDia[diaSelecionadoCalendario] || obterEventosConsolidadosPeriodo(diaSelecionadoCalendario, diaSelecionadoCalendario);
    const [selAno, selMes, selDia] = diaSelecionadoCalendario.split('-').map(Number);
    const dtSelObj = new Date(selAno, selMes - 1, selDia);
    const diasSemanaLongos = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const nomeDiaSem = diasSemanaLongos[dtSelObj.getDay()] || '';
    const nomeMesExtenso = mesesNomes[selMes - 1] || '';
    const isSelHoje = diaSelecionadoCalendario === hojeISO;
    const labelDataHeader = isSelHoje
      ? `Hoje, ${selDia} de ${nomeMesExtenso}`
      : `${nomeDiaSem}, ${selDia} de ${nomeMesExtenso}`;

    let htmlSplit = `
      <div id="cal-split-dia-selecionado" class="card" style="margin-top:14px;padding:14px;border-radius:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div>
            <h4 style="font-size:15px;font-weight:800;margin:0 0 2px;color:var(--text);">${labelDataHeader}</h4>
            <p style="font-size:11.5px;color:var(--muted);margin:0;">${itensDiaSel.length} ${itensDiaSel.length === 1 ? 'compromisso' : 'compromissos'}</p>
          </div>
          <button type="button" class="btn btn-primary" style="width:auto;margin:0;padding:6px 12px;font-size:12px;font-weight:700;" onclick="abrirModalEventoCalendario(null, '${diaSelecionadoCalendario}')">
            + Evento
          </button>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;">
    `;

    if (itensDiaSel.length === 0) {
      htmlSplit += `
        <div style="text-align:center;padding:20px 12px;color:var(--muted);">
          <p style="font-size:20px;margin-bottom:4px;">🏖️</p>
          <p style="font-size:12.5px;font-weight:600;margin:0 0 2px;color:var(--text);">Nenhum compromisso marcado</p>
          <p style="font-size:11px;margin:0;">Toque em "+ Evento" para agendar uma atividade.</p>
        </div>
      `;
    } else {
      htmlSplit += itensDiaSel.map(it => {
        const cliqueAcao = (it.tipo === 'evento' && it.origemId)
          ? `abrirDetalheEventoCalendario('${it.origemId}')`
          : `abrirDiaCalendario('${diaSelecionadoCalendario}')`;

        return `
          <div class="cal-item-card" onclick="${cliqueAcao}">
            <div class="cal-hora-col">${it.hora || 'Dia todo'}</div>
            <div style="width:4px;height:24px;border-radius:2px;background:${it.cor || 'var(--primary)'};flex-shrink:0;"></div>
            <div style="flex:1;min-width:0;">
              <p style="font-size:13px;font-weight:700;margin:0 0 2px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${it.icone ? it.icone + ' ' : ''}${escapeHtml(it.titulo)}
              </p>
              <p style="font-size:11px;color:var(--muted);margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${escapeHtml(it.subinfo || it.descricao || (it.tipo === 'evento' ? 'Evento Familiar' : it.tipo))}
              </p>
            </div>
            <span style="font-size:14px;color:var(--muted);padding-left:4px;">›</span>
          </div>
        `;
      }).join('');
    }

    htmlSplit += `
        </div>
      </div>
    `;

    secMes.innerHTML = htmlGrade + htmlSplit;
  }

  // --- 2. VISÃO SEMANA ---
  const secSemana = document.getElementById('cal-visao-semana');
  if (secSemana && visaoCalendarioAtual === 'semana') {
    const dtSemanaIni = new Date(refDate);
    const diff = dtSemanaIni.getDay() - primeiroDiaSem;
    dtSemanaIni.setDate(refDate.getDate() - (diff < 0 ? diff + 7 : diff));
    const dtSemanaFim = new Date(dtSemanaIni);
    dtSemanaFim.setDate(dtSemanaIni.getDate() + 6);

    const dtSemIniISO = dtSemanaIni.toISOString().slice(0, 10);
    const dtSemFimISO = dtSemanaFim.toISOString().slice(0, 10);
    const eventosSemana = obterEventosConsolidadosPeriodo(dtSemIniISO, dtSemFimISO);

    const mapaSemana = {};
    eventosSemana.forEach(e => {
      if (!mapaSemana[e.data]) mapaSemana[e.data] = [];
      mapaSemana[e.data].push(e);
    });

    let htmlSemana = '<div style="display:flex;flex-direction:column;gap:10px;">';

    for (let i = 0; i < 7; i++) {
      const curDiaObj = new Date(dtSemanaIni);
      curDiaObj.setDate(dtSemanaIni.getDate() + i);
      const curDiaISO = curDiaObj.toISOString().slice(0, 10);
      const isHoje = curDiaISO === hojeISO;
      const diaNum = curDiaObj.getDate();
      const diaNome = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][curDiaObj.getDay()];
      const itensDesteDia = mapaSemana[curDiaISO] || [];

      htmlSemana += `
        <div class="card" style="padding:10px;margin:0;border-left:4px solid ${isHoje ? 'var(--primary)' : 'var(--border2)'};">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-weight:800;font-size:14px;${isHoje ? 'color:var(--primary);' : ''}">${diaNome}, ${diaNum}</span>
              ${isHoje ? '<span class="badge" style="background:var(--blue-dim);color:var(--primary);">Hoje</span>' : ''}
            </div>
            <button type="button" class="btn" style="width:auto;margin:0;padding:4px 8px;font-size:11px;" onclick="abrirModalEventoCalendario(null, '${curDiaISO}')">+ Evento</button>
          </div>

          <div style="display:flex;flex-direction:column;gap:6px;">
            ${itensDesteDia.length === 0 ? '<p style="font-size:11px;color:var(--muted);margin:0;">Nenhum compromisso.</p>' : itensDesteDia.map(it => `
              <div style="background:var(--bg3);border-radius:6px;padding:6px 8px;display:flex;justify-content:space-between;align-items:center;border-left:3px solid ${it.cor};cursor:pointer;" onclick="${it.tipo === 'evento' && it.origemId ? `abrirDetalheEventoCalendario('${it.origemId}')` : `abrirDiaCalendario('${curDiaISO}')`}">
                <span style="font-size:12px;font-weight:600;">${it.icone} ${escapeHtml(it.titulo)}</span>
                <span style="font-size:10px;color:var(--muted);">${it.hora || 'Dia inteiro'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    htmlSemana += '</div>';
    secSemana.innerHTML = htmlSemana;
  }

  // --- 3. VISÃO DIA ---
  const secDia = document.getElementById('cal-visao-dia');
  if (secDia && visaoCalendarioAtual === 'dia') {
    const diaISO = refDate.toISOString().slice(0, 10);
    const eventosDia = obterEventosConsolidadosPeriodo(diaISO, diaISO);

    let htmlDia = `
      <div class="card" style="margin-bottom:12px;padding:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <h4 style="font-size:16px;font-weight:800;margin:0 0 2px;">${refDate.getDate()} de ${mesesNomes[mesRef]}</h4>
            <p style="font-size:12px;color:var(--muted);margin:0;">${eventosDia.length} compromissos agendados</p>
          </div>
          <button type="button" class="btn btn-primary" style="width:auto;margin:0;padding:6px 12px;font-size:11px;" onclick="abrirModalEventoCalendario(null, '${diaISO}')">+ Evento</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
    `;

    if (eventosDia.length === 0) {
      htmlDia += `
        <div class="card" style="text-align:center;padding:32px 16px;color:var(--muted);">
          <p style="font-size:28px;margin-bottom:4px;">✨</p>
          <p style="font-size:14px;font-weight:700;margin:0 0 4px;color:var(--text);">Dia livre!</p>
          <p style="font-size:12px;margin:0;">Aproveite o tempo em família ou adicione um compromisso.</p>
        </div>
      `;
    } else {
      htmlDia += eventosDia.map(it => `
        <div class="cal-item-card" style="border-left: 4px solid ${it.cor};" onclick="${it.tipo === 'evento' && it.origemId ? `abrirDetalheEventoCalendario('${it.origemId}')` : `abrirDiaCalendario('${diaISO}')`}">
          <div class="cal-hora-col">${it.hora || 'Dia'}</div>
          <div style="flex:1;">
            <p style="font-weight:700;font-size:14px;margin:0 0 2px;">${it.icone} ${escapeHtml(it.titulo)}</p>
            ${it.subtexto ? `<p style="font-size:12px;color:var(--muted);margin:0;">${escapeHtml(it.subtexto)}</p>` : ''}
          </div>
        </div>
      `).join('');
    }

    htmlDia += '</div>';
    secDia.innerHTML = htmlDia;
  }

  // --- 4. VISÃO AGENDA ---
  const secAgenda = document.getElementById('cal-visao-agenda');
  if (secAgenda && visaoCalendarioAtual === 'agenda') {
    const totalDiasMes = new Date(anoRef, mesRef + 1, 0).getDate();
    const dtIniMes = `${anoRef}-${String(mesRef + 1).padStart(2, '0')}-01`;
    const dtFimMes = `${anoRef}-${String(mesRef + 1).padStart(2, '0')}-${String(totalDiasMes).padStart(2, '0')}`;
    const eventosAgenda = obterEventosConsolidadosPeriodo(dtIniMes, dtFimMes);

    if (eventosAgenda.length === 0) {
      secAgenda.innerHTML = `
        <div class="card" style="text-align:center;padding:32px 16px;color:var(--muted);">
          <p style="font-size:28px;margin-bottom:4px;">📅</p>
          <p style="font-size:14px;font-weight:700;margin:0 0 4px;color:var(--text);">Agenda vazia neste mês</p>
          <p style="font-size:12px;margin:0;">Adicione eventos familiares, contas ou aniversários.</p>
        </div>
      `;
    } else {
      // Agrupa eventos por data
      const grupos = {};
      eventosAgenda.forEach(it => {
        if (!grupos[it.data]) grupos[it.data] = [];
        grupos[it.data].push(it);
      });

      secAgenda.innerHTML = Object.keys(grupos).map(dataKey => {
        const [y, m, d] = dataKey.split('-').map(Number);
        const dataObj = new Date(y, m - 1, d);
        const diaNome = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dataObj.getDay()];
        const isHoje = dataKey === hojeISO;
        const itensDaData = grupos[dataKey];

        return `
          <div style="margin-bottom:14px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <span style="font-size:13px;font-weight:800;color:var(--text);">${diaNome}, ${d} de ${mesesNomes[m - 1]}</span>
              ${isHoje ? '<span class="badge" style="background:var(--blue-dim);color:var(--primary);">Hoje</span>' : ''}
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${itensDaData.map(it => `
                <div class="cal-item-card" style="border-left:4px solid ${it.cor};margin-bottom:0;" onclick="${it.tipo === 'evento' && it.origemId ? `abrirDetalheEventoCalendario('${it.origemId}')` : `abrirDiaCalendario('${dataKey}')`}">
                  <div class="cal-hora-col">${it.hora || 'Dia'}</div>
                  <div style="flex:1;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                      <p style="font-weight:700;font-size:13px;margin:0 0 2px;">${it.icone} ${escapeHtml(it.titulo)}</p>
                    </div>
                    ${it.subtexto ? `<p style="font-size:11px;color:var(--muted);margin:0;">${escapeHtml(it.subtexto)}</p>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function loadState(overrideState){
  if (overrideState && typeof overrideState === 'object') {
    Object.assign(S, overrideState);
    if (Array.isArray(overrideState.membrosPerfil) && overrideState.membrosPerfil.length > 0) {
      S.membrosPerfil = overrideState.membrosPerfil;
      S.membrosFamilia = overrideState.membrosPerfil.map(m => m.nome);
    }
  } else {
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
  }

  // Migração segura para o Super-App Familiar v2.0 (Etapa 1)
  migrarParaUpgradeFamiliarV2();
  if(!S.membrosFamilia) S.membrosFamilia = ['Alex', 'Gabi'];
  if(!S.categoriasGastos || !S.categoriasGastos.length) S.categoriasGastos = [...DEFAULT_CATEGORIAS_GASTOS];
  if(!S.tiposDivida || !S.tiposDivida.length) S.tiposDivida = [...DEFAULT_TIPOS_DIVIDA];
  sincronizarTiposDividaMap();

  try {
    if (typeof localStorage !== 'undefined') {
      familiaId = localStorage.getItem('dnm_familia_id') || 'familia-alex-gabi';
      const meuMembro = localStorage.getItem('dnm_meu_membro_id');
      if (meuMembro) S.membroAtivoId = meuMembro;
    }
  } catch(e){
    console.error('Erro ao ler dnm_familia_id e dnm_meu_membro_id:', e);
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
let familiaId = 'familia-alex-gabi';
let unsubscribeSnapshot = null;

/**
 * Permite injetar uma instância ou mock do Firestore durante testes automatizados.
 * 
 * @param {object|null} db - Instância do Firestore ou mock de testes
 */
function setFbDbParaTestes(db) {
  fbDb = db;
}

/**
 * Controla o Login Gate obrigatório no carregamento e mudanças de autenticação.
 * Decisão de design: Atende à prioridade 1 ("O App não pediu login para entrar").
 * Se deslogado: esconde a área autenticada (#app) e o onboarding (#onboarding), exibindo estritamente #tela-login.
 * Se autenticado: esconde #tela-login e exibe #app (ou #onboarding se chave da IA ainda não configurada).
 * 
 * @param {boolean} estaLogado - Flag booleana indicando se o usuário possui sessão ativa
 */
function aplicarLoginGate(estaLogado) {
  if (typeof document === 'undefined') return;
  const telaLogin = document.getElementById('tela-login');
  const appEl = document.getElementById('app');
  const onbEl = document.getElementById('onboarding');

  if (estaLogado) {
    if (telaLogin) telaLogin.style.display = 'none';
    if (S.onboardingDone) {
      if (appEl) appEl.style.display = 'flex';
      if (onbEl) onbEl.style.display = 'none';
      if (typeof render === 'function') render();
    } else {
      if (appEl) appEl.style.display = 'none';
      if (onbEl) onbEl.style.display = 'flex';
    }
  } else {
    if (appEl) appEl.style.display = 'none';
    if (onbEl) onbEl.style.display = 'none';
    if (telaLogin) telaLogin.style.display = 'flex';
  }
  updateContaStatus();
  updateFamiliaStatus();
}

/**
 * Inicializa a conexão com o Firebase Authentication e Firestore.
 * Conecta Alex e Gabi na base unificada 'usuarios/familia-alex-gabi' em tempo real.
 */
function initFirebase() {
  if (typeof firebase === 'undefined') {
    // Se a biblioteca do Firebase não estiver carregada (ex: offline), verifica sessão local
    const sessaoAtiva = (typeof localStorage !== 'undefined' && localStorage.getItem('dnm_sessao_ativa') === 'true') ||
                        (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('dnm_sessao_ativa') === 'true');
    aplicarLoginGate(sessaoAtiva);
    return;
  }

  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    fbDb = firebase.firestore();

    // Habilita persistência offline se suportada pelo navegador
    try {
      if (typeof fbDb.enablePersistence === 'function') {
        fbDb.enablePersistence({ synchronizeTabs: true }).catch(errPersist => {
          console.warn('Persistência offline do Firestore não pôde ser ativada:', errPersist.message);
        });
      }
    } catch (ePersist) {
      console.warn('Aviso ao inicializar persistência offline Firestore:', ePersist.message);
    }

    firebase.auth().onAuthStateChanged(async user => {
      fbUser = user;
      if (user) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('dnm_sessao_ativa', 'true');
        }
        detectarMembroPorIdentificador(user.email || user.displayName || '');
        await loadFromCloud();
        escutarSincronizacaoTempoReal();
        aplicarLoginGate(true);
      } else {
        const sessaoLocal = (typeof localStorage !== 'undefined' && localStorage.getItem('dnm_sessao_ativa') === 'true') ||
                            (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('dnm_sessao_ativa') === 'true');
        if (!sessaoLocal) {
          if (unsubscribeSnapshot) {
            try { unsubscribeSnapshot(); } catch (eUnsub) { console.error('Erro ao cancelar listener do snapshot:', eUnsub); }
            unsubscribeSnapshot = null;
          }
          aplicarLoginGate(false);
        }
      }
    });
  } catch(e) {
    console.error('Erro ao iniciar Firebase. Confira o firebaseConfig.', e);
  }
}

/**
 * Escuta atualizações no Firestore em tempo real via onSnapshot.
 * Decisão de design: Atende à prioridade 4 ("E quando a Gabi logar ela tem que ter acesso e visualizar a mesma coisa que eu").
 * Permite que Alex e Gabi vejam inclusões de gastos, compras e metas mutuamente sem recarregar a tela.
 * Preserva o membro ativo do dispositivo local (dnm_meu_membro_id) para manter a visão personalizada de cada um.
 */
function escutarSincronizacaoTempoReal() {
  if (!fbDb) return;
  const id = docId();
  if (!id) return;

  if (unsubscribeSnapshot) {
    try { unsubscribeSnapshot(); } catch (eUnsub) { console.error('Erro ao cancelar snapshot anterior:', eUnsub); }
    unsubscribeSnapshot = null;
  }

  try {
    unsubscribeSnapshot = fbDb.collection('usuarios').doc(id).onSnapshot(doc => {
      if (doc && doc.exists) {
        const dadosNuvem = doc.data();
        if (dadosNuvem) {
          // Preserva o membro do aparelho local (Alex = m_1, Gabi = m_2)
          const meuMembroId = (typeof localStorage !== 'undefined' && localStorage.getItem('dnm_meu_membro_id')) || S.membroAtivoId || 'm_1';
          const chaveLocal = apiKey || S.apiKey;

          Object.assign(S, dadosNuvem);
          S.membroAtivoId = meuMembroId;
          if (chaveLocal && !S.apiKey) S.apiKey = chaveLocal;

          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('dnm_data', JSON.stringify(S));
            }
          } catch(e) {
            console.error('Erro ao persistir dados do snapshot Firestore no localStorage:', e);
          }

          if (typeof render === 'function') {
            const appEl = typeof document !== 'undefined' ? document.getElementById('app') : null;
            if (appEl && appEl.style.display !== 'none') {
              render();
            }
          }
          updateContaStatus();
          updateFamiliaStatus();
        }
      }
    }, erro => {
      console.warn('Aviso no listener em tempo real do Firestore:', erro);
    });
  } catch (e) {
    console.error('Erro ao configurar listener em tempo real do Firestore:', e);
  }
}

// Converte telefone num identificador seguro de e-mail interno para o Firebase Auth
function telefoneParaEmail(tel) {
  const d = (tel || '').replace(/\D/g, '');
  return d + '@negativoaomilhao.app';
}

/**
 * Detecta se o usuário que está logando é Alex ou Gabi e sincroniza o perfil do aparelho.
 */
function detectarMembroPorIdentificador(texto) {
  const t = (texto || '').toLowerCase();
  if (t.includes('gabi') || t.includes('gabriela')) {
    selecionarMembroLogin('m_2', 'Gabi');
  } else if (t.includes('alex') || t.includes('alexsander')) {
    selecionarMembroLogin('m_1', 'Alex');
  }
}

/**
 * Seleciona quem está acessando o app na tela de login.
 * 
 * @param {string} membroId - ID do membro ('m_1' para Alex, 'm_2' para Gabi)
 * @param {string} nome - Nome de exibição
 */
function selecionarMembroLogin(membroId, nome) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('dnm_meu_membro_id', membroId);
  }
  S.membroAtivoId = membroId;

  if (typeof document !== 'undefined') {
    document.querySelectorAll('.login-membro-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.membro === membroId);
    });
    const telInput = document.getElementById('login-tel');
    if (telInput && (!telInput.value || telInput.value === 'alex' || telInput.value === 'gabi')) {
      telInput.placeholder = `Telefone ou e-mail de ${nome}`;
    }
  }
}

/**
 * Altera o membro titular vinculado ao aparelho atual (Alex ou Gabi).
 */
function selecionarMembroAparelho(membroId) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('dnm_meu_membro_id', membroId);
  }
  S.membroAtivoId = membroId;
  save();
  render();
  atualizarModalPerfilConta();
}

/**
 * Abre o modal de perfil e conta familiar.
 */
function abrirModalPerfilConta() {
  atualizarModalPerfilConta();
  if (typeof openM === 'function') {
    openM('m-perfil-conta');
  }
}

/**
 * Atualiza os dados exibidos no modal de perfil e conta.
 */
function atualizarModalPerfilConta() {
  if (typeof document === 'undefined') return;
  const membroAtual = (typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null) ||
    (S.membrosPerfil || []).find(m => m.id === S.membroAtivoId) ||
    { nome: 'Alex', papel: 'admin', cor: '#5581E3', iniciais: 'AL' };

  const avatarEl = document.getElementById('perfil-avatar-preview');
  const btnRemoverFoto = document.getElementById('btn-remover-foto-perfil');
  if (avatarEl) {
    if (membroAtual.fotoUrl) {
      avatarEl.style.backgroundImage = `url("${membroAtual.fotoUrl}")`;
      avatarEl.style.backgroundSize = 'cover';
      avatarEl.style.backgroundPosition = 'center';
      avatarEl.textContent = '';
      if (btnRemoverFoto) btnRemoverFoto.style.display = 'inline-block';
    } else {
      avatarEl.style.backgroundImage = 'none';
      avatarEl.style.background = membroAtual.cor || '#5581E3';
      avatarEl.textContent = membroAtual.iniciais || membroAtual.nome.slice(0, 2).toUpperCase();
      if (btnRemoverFoto) btnRemoverFoto.style.display = 'none';
    }
  }

  const nomeEl = document.getElementById('perfil-nome-exibicao') || document.getElementById('perfil-nome-usuario');
  if (nomeEl) nomeEl.textContent = membroAtual.nome;

  const papelEl = document.getElementById('perfil-papel-exibicao') || document.getElementById('perfil-papel-badge');
  if (papelEl) {
    papelEl.textContent = membroAtual.papel === 'admin' ? '👑 Admin' : '💜 Família';
  }

  const emailEl = document.getElementById('perfil-email-exibicao') || document.getElementById('perfil-email-tel');
  if (emailEl) {
    emailEl.textContent = fbUser?.email || (typeof localStorage !== 'undefined' && localStorage.getItem('dnm_sessao_ativa') === 'true' ? 'Conectado na nuvem' : 'Desconectado');
  }

  const circuloNomeEl = document.getElementById('perfil-circulo-nome');
  if (circuloNomeEl) {
    circuloNomeEl.textContent = typeof docId === 'function' ? docId() : 'familia-alex-gabi';
  }

  const statusCloudEl = document.getElementById('perfil-status-nuvem');
  if (statusCloudEl) {
    const cod = typeof docId === 'function' ? docId() : 'familia-alex-gabi';
    statusCloudEl.innerHTML = fbUser
      ? `🟢 Conectado à Nuvem (Família: <strong>${escapeHtml(cod)}</strong>)`
      : `🟠 Modo Local (Família: <strong>${escapeHtml(cod)}</strong>)`;
  }

  const seletorMembrosEl = document.getElementById('perfil-seletor-membros');
  if (seletorMembrosEl && Array.isArray(S.membrosPerfil)) {
    seletorMembrosEl.innerHTML = S.membrosPerfil.map(m => {
      const isAtivo = m.id === S.membroAtivoId;
      return `
        <button type="button" class="login-membro-chip ${isAtivo ? 'active' : ''}" style="margin: 0; padding: 6px 14px;" onclick="selecionarMembroAparelho('${m.id}')">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${m.cor || '#5581E3'};margin-right:6px;"></span>
          ${escapeHtml(m.nome)} ${isAtivo ? '✓' : ''}
        </button>
      `;
    }).join('');
  }
}

/**
 * Aplica máscara de telefone brasileiro em tempo real ou preserva digitação de e-mail.
 * Padrões:
 * - 11 dígitos: (11) 98814-6347
 * - 10 dígitos: (11) 8814-6347
 */
function formatarTelefoneBR(valor) {
  if (!valor) return '';
  const d = String(valor).replace(/\D/g, '');
  if (!d) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}

/**
 * Evento disparado em tempo real ao digitar no campo de identificador (telefone ou e-mail).
 */
function aoDigitarIdentificadorLogin(input) {
  if (!input) return;
  const val = input.value || '';
  const chipsContainer = typeof document !== 'undefined' ? document.getElementById('login-email-chips') : null;

  // Se contém '@' ou letras, é fluxo de e-mail
  if (/[a-zA-Z@]/.test(val)) {
    if (chipsContainer) {
      chipsContainer.style.display = 'flex';
    }
    if (typeof detectarMembroPorIdentificador === 'function') {
      detectarMembroPorIdentificador(val);
    }
    return;
  }

  // Se são números ou símbolos de telefone, aplica máscara de telefone e oculta chips de e-mail
  if (chipsContainer) {
    chipsContainer.style.display = 'none';
  }
  const formatado = formatarTelefoneBR(val);
  input.value = formatado;
  if (typeof detectarMembroPorIdentificador === 'function') {
    detectarMembroPorIdentificador(val);
  }
}

/**
 * Aplica o provedor selecionado ao e-mail que o usuário começou a digitar.
 */
function aplicarProvedorEmail(provedor) {
  if (typeof document === 'undefined') return;
  const telInput = document.getElementById('login-tel-email') || document.getElementById('login-tel');
  if (!telInput) return;

  let val = (telInput.value || '').trim();
  if (val.includes('@')) {
    val = val.split('@')[0];
  }
  if (!val) {
    val = 'usuario';
  }
  telInput.value = val + provedor;

  const chipsContainer = document.getElementById('login-email-chips');
  if (chipsContainer) {
    chipsContainer.style.display = 'none';
  }

  if (typeof detectarMembroPorIdentificador === 'function') {
    detectarMembroPorIdentificador(telInput.value);
  }

  const senhaInput = document.getElementById('login-senha');
  if (senhaInput && typeof senhaInput.focus === 'function') {
    senhaInput.focus();
  }
}

/**
 * Criação de conta no app com suporte a e-mail ou telefone brasileiro.
 */
function fazerCadastro() {
  const telInput = document.getElementById('login-tel-email') || document.getElementById('login-tel');
  const senhaInput = document.getElementById('login-senha');
  const msg = document.getElementById('login-msg');
  const identificador = telInput ? telInput.value.trim() : '';
  const senha = senhaInput ? senhaInput.value : '';

  if (!identificador || !senha) {
    if (msg) msg.textContent = 'Preencha telefone ou e-mail e senha.';
    return;
  }

  let emailFormatado = identificador;
  if (!identificador.includes('@')) {
    const d = identificador.replace(/\D/g, '');
    if (d.length < 10) {
      if (msg) msg.textContent = 'Digite um telefone válido com DDD (ex: (11) 98814-6347).';
      return;
    }
    emailFormatado = telefoneParaEmail(d);
  }

  if (senha.length < 6) {
    if (msg) msg.textContent = 'A senha precisa ter pelo menos 6 caracteres.';
    return;
  }

  detectarMembroPorIdentificador(identificador);

  if (typeof firebase === 'undefined' || !firebase.auth) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dnm_sessao_ativa', 'true');
    }
    S.onboardingDone = true;
    aplicarLoginGate(true);
    return;
  }

  if (msg) msg.textContent = 'Criando conta da família...';
  firebase.auth().createUserWithEmailAndPassword(emailFormatado, senha)
    .then(cred => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('dnm_sessao_ativa', 'true');
      }
      if (msg) msg.textContent = '';
      detectarMembroPorIdentificador(cred.user?.email || identificador);
      // Abre o app direto sem exigir que digite tudo de novo!
      S.onboardingDone = true;
      aplicarLoginGate(true);
    })
    .catch(e => {
      console.error('Erro no cadastro Firebase:', e);
      if (e.code === 'auth/email-already-in-use') {
        if (msg) msg.innerHTML = 'Esse telefone/e-mail já possui cadastro. Toque em <strong>Entrar na Conta</strong> acima.';
      } else {
        if (msg) msg.textContent = 'Erro ao criar conta: ' + (e.message || e);
      }
    });
}

/**
 * Login com suporte a e-mail ou telefone brasileiro.
 */
function fazerLogin() {
  const telInput = document.getElementById('login-tel-email') || document.getElementById('login-tel');
  const senhaInput = document.getElementById('login-senha');
  const msg = document.getElementById('login-msg');
  const identificador = telInput ? telInput.value.trim() : '';
  const senha = senhaInput ? senhaInput.value : '';

  if (!identificador || !senha) {
    if (msg) msg.textContent = 'Preencha telefone ou e-mail e senha.';
    return;
  }

  let emailFormatado = identificador;
  if (!identificador.includes('@')) {
    const d = identificador.replace(/\D/g, '');
    if (d.length < 10) {
      if (msg) msg.textContent = 'Digite um telefone válido com DDD (ex: (11) 98814-6347).';
      return;
    }
    emailFormatado = telefoneParaEmail(d);
  }

  detectarMembroPorIdentificador(identificador);

  if (typeof firebase === 'undefined' || !firebase.auth) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dnm_sessao_ativa', 'true');
    }
    S.onboardingDone = true;
    aplicarLoginGate(true);
    return;
  }

  if (msg) msg.textContent = 'Entrando...';
  firebase.auth().signInWithEmailAndPassword(emailFormatado, senha)
    .then(cred => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('dnm_sessao_ativa', 'true');
      }
      if (msg) msg.textContent = '';
      detectarMembroPorIdentificador(cred.user?.email || identificador);
      S.onboardingDone = true;
      aplicarLoginGate(true);
    })
    .catch(e => {
      console.error('Erro no login Firebase:', e);
      if (e.code === 'auth/user-not-found') {
        if (msg) msg.innerHTML = 'Essa conta ainda não existe. Toque em <strong>Criar Conta da Família</strong> logo abaixo.';
      } else if (e.code === 'auth/wrong-password') {
        if (msg) msg.textContent = 'Senha incorreta. Verifique e tente novamente.';
      } else if (e.code === 'auth/invalid-credential') {
        if (msg) msg.innerHTML = 'Credenciais não encontradas ou incorretas. Se ainda não possui acesso, toque em <strong>Criar Conta da Família</strong> abaixo.';
      } else if (e.code === 'auth/invalid-email') {
        if (msg) msg.textContent = 'Formato de telefone ou e-mail inválido.';
      } else {
        if (msg) msg.textContent = 'Erro ao entrar: ' + (e.message || e);
      }
    });
}

/**
 * Autenticação via Google com tratamento gracioso de auth/unauthorized-domain.
 */
function fazerLoginGoogle() {
  const msg = document.getElementById('login-msg');
  if (typeof firebase === 'undefined' || !firebase.auth) {
    if (msg) msg.textContent = 'Firebase Auth indisponível no momento.';
    return;
  }
  if (msg) msg.textContent = 'Conectando com o Google...';
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(cred => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('dnm_sessao_ativa', 'true');
      }
      if (msg) msg.textContent = '';
      detectarMembroPorIdentificador(cred.user?.email || cred.user?.displayName || '');
      S.onboardingDone = true;
      aplicarLoginGate(true);
    })
    .catch(e => {
      console.warn('Erro na autenticação Google:', e.code, e.message);
      if (e.code === 'auth/unauthorized-domain') {
        if (msg) {
          msg.innerHTML = '⚠️ <strong>Domínio não autorizado pelo Google:</strong> Entre pelo seu <strong>Telefone ou E-mail</strong> acima (ou autorize <code>alexpreite.github.io</code> no Firebase Console).';
        }
        return;
      }
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/cancelled-popup-request') {
        firebase.auth().signInWithRedirect(provider).catch(err => {
          if (err.code === 'auth/unauthorized-domain') {
            if (msg) {
              msg.innerHTML = '⚠️ <strong>Domínio não autorizado pelo Google:</strong> Entre pelo seu <strong>Telefone ou E-mail</strong> acima (ou autorize <code>alexpreite.github.io</code> no Firebase Console).';
            }
          } else if (msg) {
            msg.textContent = 'Erro ao entrar com Google: ' + (err.message || err);
          }
        });
        return;
      }
      if (msg) msg.textContent = 'Erro ao entrar com Google: ' + (e.message || e);
    });
}

/**
 * Permite usar o app em modo local/demonstração sem autenticação na nuvem.
 */
function entrarModoLocal() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('dnm_sessao_ativa', 'true');
  }
  aplicarLoginGate(true);
}

/**
 * Realiza o logoff seguro do usuário no aparelho e volta à tela de login.
 * Decisão de design: Atende à prioridade 2 ("E também não tem aonde fazer logoff").
 */
function fazerLogoffApp() {
  if (typeof confirm === 'function') {
    if (!confirm('Deseja realmente sair da conta neste aparelho?')) return;
  }

  if (unsubscribeSnapshot) {
    try { unsubscribeSnapshot(); } catch (eUnsub) { console.error('Erro ao encerrar snapshot:', eUnsub); }
    unsubscribeSnapshot = null;
  }

  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      firebase.auth().signOut().catch(e => console.error('Erro no signOut do Firebase:', e));
    } catch (e) {
      console.error('Erro ao invocar signOut:', e);
    }
  }

  fbUser = null;
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('dnm_sessao_ativa');
  }
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('dnm_sessao_ativa');
  }

  if (typeof closeM === 'function') {
    closeM('m-perfil-conta');
  }

  if (typeof document !== 'undefined') {
    const senhaEl = document.getElementById('login-senha');
    if (senhaEl) senhaEl.value = '';
    const msgEl = document.getElementById('login-msg');
    if (msgEl) msgEl.textContent = 'Você saiu da conta.';
  }

  aplicarLoginGate(false);
}

// Retrocompatibilidade para chamadas legadas
function sair() {
  fazerLogoffApp();
}

function updateContaStatus() {
  const el = document.getElementById('conta-status');
  if (el) el.textContent = fbUser ? '✅ Conectado' : '❌ Desconectado';
}

/**
 * Retorna o ID do documento compartilhado no Firestore.
 * Padrão familiar: 'familia-alex-gabi' para sincronia mútua entre Alex e Gabi.
 */
function docId() {
  return familiaId || (typeof localStorage !== 'undefined' && localStorage.getItem('dnm_familia_id')) || 'familia-alex-gabi';
}

async function loadFromCloud() {
  if (!fbDb) return;
  const id = docId();
  if (!id) return;
  try {
    const doc = await fbDb.collection('usuarios').doc(id).get();
    if (doc.exists) {
      const dadosNuvem = doc.data();
      const meuMembroId = (typeof localStorage !== 'undefined' && localStorage.getItem('dnm_meu_membro_id')) || S.membroAtivoId || 'm_1';
      const chaveLocal = apiKey || S.apiKey;

      Object.assign(S, dadosNuvem);
      S.membroAtivoId = meuMembroId; // Preserva membro local
      if (chaveLocal && !S.apiKey) S.apiKey = chaveLocal;

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('dnm_data', JSON.stringify(S));
        }
      } catch (e) {
        console.error('Erro ao gravar dnm_data no localStorage em loadFromCloud:', e);
      }
    } else {
      // Primeira inicialização do documento compartilhado
      const dataToSync = { ...S };
      delete dataToSync.apiKey;
      await fbDb.collection('usuarios').doc(id).set(dataToSync);
    }
  } catch(e) {
    console.error('Erro ao carregar dados da nuvem:', e);
  }
}

async function syncDrive() {
  if (!fbDb) { alert('Conecte-se à internet primeiro.'); return; }
  const id = docId();
  if (!id) { alert('Defina um código de família antes de sincronizar.'); return; }
  try {
    const dataToSync = { ...S };
    delete dataToSync.apiKey;
    await fbDb.collection('usuarios').doc(id).set(dataToSync, { merge: true });
    alert('✅ Dados sincronizados com sucesso na nuvem familiar!');
  } catch(e) {
    alert('Erro ao sincronizar: ' + e.message);
  }
}

function salvarFamiliaId() {
  const v = document.getElementById('familia-id').value.trim();
  if (!v) { alert('Digite um código de família.'); return; }
  familiaId = v;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('dnm_familia_id', v);
  }
  updateFamiliaStatus();

  if (!fbDb) {
    alert('Código salvo localmente!');
    return;
  }

  fbDb.collection('usuarios').doc(familiaId).get().then(doc => {
    if (doc.exists) {
      const dadosNuvem = doc.data();
      const meuMembroId = (typeof localStorage !== 'undefined' && localStorage.getItem('dnm_meu_membro_id')) || S.membroAtivoId || 'm_1';
      Object.assign(S, dadosNuvem);
      S.membroAtivoId = meuMembroId;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('dnm_data', JSON.stringify(S));
        }
      } catch (e) {
        console.error('Erro ao gravar dnm_data no localStorage em salvarFamiliaId:', e);
      }
      render();
      alert('Código vinculado! Os dados da família foram carregados com sucesso.');
    } else {
      const dataToSync = { ...S };
      delete dataToSync.apiKey;
      fbDb.collection('usuarios').doc(familiaId).set(dataToSync)
        .then(() => alert('Código salvo! Este aparelho é a base da família.'))
        .catch(e => alert('Erro ao gravar na nuvem: ' + e.message));
    }
    escutarSincronizacaoTempoReal();
  }).catch(e => {
    alert('Erro ao acessar a nuvem: ' + e.message);
    console.error(e);
  });
}

function salvarCodigoFamiliaLogin() {
  const el = document.getElementById('login-codigo-familia');
  const cod = (el ? el.value.trim() : '') || 'familia-alex-gabi';
  familiaId = cod;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('dnm_familia_id', cod);
  }
  const msg = document.getElementById('login-msg');
  if (msg) msg.textContent = `Código vinculado: ${cod}`;
  updateFamiliaStatus();
}

function updateFamiliaStatus() {
  const el = document.getElementById('familia-status');
  if (el) el.textContent = familiaId || 'familia-alex-gabi';
  const elModal = document.getElementById('perfil-status-nuvem');
  if (elModal) {
    const cod = docId();
    elModal.innerHTML = fbUser
      ? `🟢 Conectado à Nuvem (Família: <strong>${escapeHtml(cod)}</strong>)`
      : `🟠 Modo Local (Família: <strong>${escapeHtml(cod)}</strong>)`;
  }
}

// Salva local sempre; se logado, sincroniza na nuvem com debounce de 1500ms
function save() {
  S.apiKey = apiKey;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dnm_data', JSON.stringify(S));
    }
  } catch(e) {
    console.error('Erro ao salvar no localStorage em save():', e);
  }

  const id = docId();
  if (fbDb && id) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const dataToSync = { ...S };
      delete dataToSync.apiKey; // Segurança: nunca envia chave pessoal de IA para base compartilhada
      if (typeof fbDb.collection === 'function') {
        const docRef = fbDb.collection('usuarios').doc(id);
        if (docRef && typeof docRef.set === 'function') {
          docRef.set(dataToSync, { merge: true })
            .catch(e => console.error('Erro ao sincronizar Firestore:', e));
        }
      }
    }, 1500);
  }
}

// ONBOARDING / AUTENTICAÇÃO
if (typeof localStorage !== 'undefined') loadState();
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

function init() {
  try {
    if (typeof localStorage !== 'undefined') {
      familiaId = localStorage.getItem('dnm_familia_id') || 'familia-alex-gabi';
      localStorage.setItem('dnm_familia_id', familiaId);

      const meuMembro = localStorage.getItem('dnm_meu_membro_id');
      if (meuMembro) S.membroAtivoId = meuMembro;
    }
  } catch (e) {
    console.error('Erro ao ler dados de inicialização da família:', e);
  }

  const sessaoAtiva = (typeof localStorage !== 'undefined' && localStorage.getItem('dnm_sessao_ativa') === 'true') ||
                      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('dnm_sessao_ativa') === 'true');

  if (!sessaoAtiva && !fbUser) {
    aplicarLoginGate(false);
  } else {
    aplicarLoginGate(true);
  }

  initFirebase();
}

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
  calendario: 'Calendário Compartilhado',
  listas: 'Listas & Tarefas Compartilhadas',
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
const SECS = ['inicio', 'calendario', 'listas', 'explorar', 'familia', 'atividade', 'resumo', 'receitas', 'gastos', 'dividas', 'metas', 'agente', 'config'];
const ROTAS_FINANCEIRAS = ['resumo', 'receitas', 'gastos', 'dividas', 'metas'];

function go(id) {
  if (!id) id = 'inicio';
  if (id === 'norte') id = 'agente';

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

  // Exibe a seção ativa (suporta tanto sec-agente quanto sec-norte)
  let targetSec = document.getElementById('sec-' + id);
  if (!targetSec && id === 'agente') targetSec = document.getElementById('sec-norte');
  if (!targetSec && id === 'norte') targetSec = document.getElementById('sec-agente');
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
  const fotoPreview = document.getElementById('mb-foto-preview');
  const fotoInputUrl = document.getElementById('mb-foto-url');
  const btnRemoverFoto = document.getElementById('mb-btn-remover-foto');
  const fileInput = document.getElementById('mb-foto-input');
  if (fileInput) fileInput.value = '';

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

      if (fotoInputUrl) fotoInputUrl.value = membro.fotoUrl || '';
      if (fotoPreview) {
        if (membro.fotoUrl) {
          fotoPreview.style.backgroundImage = `url('${membro.fotoUrl}')`;
          fotoPreview.textContent = '';
          if (btnRemoverFoto) btnRemoverFoto.style.display = 'inline-block';
        } else {
          fotoPreview.style.backgroundImage = 'none';
          fotoPreview.style.background = membro.cor || '#5581E3';
          fotoPreview.textContent = membro.iniciais || '👤';
          if (btnRemoverFoto) btnRemoverFoto.style.display = 'none';
        }
      }
    }
  } else {
    if (mIdInput) mIdInput.value = '';
    if (nomeInput) nomeInput.value = '';
    if (papelSelect) papelSelect.value = 'membro';
    if (anivInput) anivInput.value = '';
    if (corInput) corInput.value = PALETA_FAMILIAR[0] || '#5581E3';
    membroCor = PALETA_FAMILIAR[0] || '#5581E3';
    if (btnExcluir) btnExcluir.style.display = 'none';
    if (fotoInputUrl) fotoInputUrl.value = '';
    if (fotoPreview) {
      fotoPreview.style.backgroundImage = 'none';
      fotoPreview.style.background = membroCor;
      fotoPreview.textContent = '👤';
    }
    if (btnRemoverFoto) btnRemoverFoto.style.display = 'none';
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
  const fotoInputUrl = document.getElementById('mb-foto-url');

  const id = mIdInput ? mIdInput.value.trim() : '';
  const nome = nomeInput ? nomeInput.value.trim() : '';
  const papel = papelSelect ? papelSelect.value : 'membro';
  const aniversario = anivInput ? anivInput.value.trim() : '';
  const cor = corInput ? corInput.value.trim() : '';
  const fotoUrl = fotoInputUrl ? fotoInputUrl.value.trim() : '';

  if (!nome) {
    if (typeof alert === 'function') alert('Informe o nome do membro.');
    return;
  }

  salvarMembroCirculo({ id, nome, papel, aniversario, cor, fotoUrl });
  closeM('m-membro');
}

/**
 * Upload e pré-visualização de foto de perfil no modal de edição de membro.
 */
function aoSelecionarFotoMembroModal(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const preview = document.getElementById('mb-foto-preview');
    const inputUrl = document.getElementById('mb-foto-url');
    const btnRemover = document.getElementById('mb-btn-remover-foto');
    if (preview) {
      preview.style.backgroundImage = `url('${dataUrl}')`;
      preview.textContent = '';
    }
    if (inputUrl) inputUrl.value = dataUrl;
    if (btnRemover) btnRemover.style.display = 'inline-block';
  };
  reader.readAsDataURL(file);
}

function removerFotoMembroModal() {
  const preview = document.getElementById('mb-foto-preview');
  const inputUrl = document.getElementById('mb-foto-url');
  const btnRemover = document.getElementById('mb-btn-remover-foto');
  const fileInput = document.getElementById('mb-foto-input');
  if (preview) {
    preview.style.backgroundImage = 'none';
    preview.textContent = '👤';
  }
  if (inputUrl) inputUrl.value = '';
  if (btnRemover) btnRemover.style.display = 'none';
  if (fileInput) fileInput.value = '';
}

/**
 * Upload de foto de perfil direto pelo modal de Perfil & Conta.
 */
function aoSelecionarFotoPerfilConta(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const membro = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
    if (membro) {
      membro.fotoUrl = dataUrl;
      save();
      render();
      atualizarModalPerfilConta();
    }
  };
  reader.readAsDataURL(file);
}

function removerFotoPerfilAtual() {
  const membro = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
  if (membro) {
    membro.fotoUrl = '';
    save();
    render();
    atualizarModalPerfilConta();
  }
}

/**
 * Upload e configuração da foto de capa familiar no carrossel do mural.
 */
function aoSelecionarCapaFamilia(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    S.fotoCapaFamiliaUrl = dataUrl;
    save();
    renderMuralInicio();
  };
  reader.readAsDataURL(file);
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
  if (typeof document === 'undefined') return;
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
    const origemSel = document.getElementById('g-origem-pagamento')?.value || 'auto';
    const novoGastoBase = {
      id: Date.now(),
      desc,
      val,
      cat,
      data,
      titular,
      origemPagamento: origemSel,
      parcelado: false,
      recorrente: false,
      pago: true,
      dataPagto: data
    };
    const gastoFinal = registrarGastoComBeneficio(novoGastoBase);
    S.gastos.push(gastoFinal);
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
  const gOrig = document.getElementById('g-origem-pagamento'); if (gOrig) gOrig.value = 'auto';
  const gPrev = document.getElementById('g-preview-beneficio'); if (gPrev) { gPrev.style.display = 'none'; gPrev.innerHTML = ''; }
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

function del(arr, id) {
  if (arr === S.gastos) {
    estornarBeneficioDeGasto(id);
  }
  return arr.filter(i => i.id !== id);
}

function delGasto(id) {
  estornarBeneficioDeGasto(id);
  if (Array.isArray(S.gastos)) {
    S.gastos = S.gastos.filter(g => g.id !== id);
  }
  if (typeof save === 'function') save();
  if (typeof render === 'function') render();
}

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
    // Gastos do mês pagos no mês anterior (apenas a parcela que efetivamente saiu do salário)
    const gasPagos = (S.gastos || []).filter(g => (g.data||'').slice(0,7) === ym && g.pago && !g.negociado).reduce((s,g) => {
      const vSalario = g.valorPagoSalario !== undefined ? Number(g.valorPagoSalario) : Math.max(0, (Number(g.val) || 0) - (Number(g.valorPagoBeneficio) || 0));
      return s + vSalario;
    }, 0);
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

  // Regra de Ouro (Etapa 4): frações pagas com VA/VR (valorPagoBeneficio) NÃO reduzem o salário disponível
  const getValorSalario = (g) => {
    if (g.valorPagoSalario !== undefined) return Number(g.valorPagoSalario) || 0;
    const vBeneficio = Number(g.valorPagoBeneficio) || 0;
    return Math.max(0, Math.round(((Number(g.val) || 0) - vBeneficio) * 100) / 100);
  };
  const getValorBeneficio = (g) => Number(g.valorPagoBeneficio) || 0;

  const totalGasSalario = Math.round((gas.reduce((s,g) => s + getValorSalario(g), 0) + totalFaturasCartao) * 100) / 100;
  const totalGasBruto = Math.round((gas.reduce((s,g) => s + g.val, 0) + totalFaturasCartao) * 100) / 100;
  const totalGasBeneficios = Math.round(gas.reduce((s,g) => s + getValorBeneficio(g), 0) * 100) / 100;

  // Saldo bancário e caixa consomem estritamente totalGasSalario
  const totalGas = totalGasSalario;
  
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
  
  // Saldo líquido do mês corrente: Receitas - Gastos Salário - Aportes
  const saldoMes = Math.round((totalRec - totalGas - totalInv) * 100) / 100;
  
  // Sobras acumuladas de meses anteriores
  const saldoAnterior = calcSaldoAcumuladoAnterior(mesAtual);
  
  // Saldo total disponível (regime misto legado)
  const saldoDisp = Math.round((saldoMes + saldoAnterior) * 100) / 100;

  // FATIA B: MÉTRICAS DE FLUXO DE CAIXA REAL EM TEMPO REAL ("PAINEL VERDINHO")
  // 1. Disponível total em caixa (receitas do mês + sobras de caixa anteriores)
  const totalDisponivel = Math.round((totalRec + saldoAnterior) * 100) / 100;

  // 2. Gastos avulsos marcados como pagos até o momento (apenas fração paga em dinheiro/salário)
  const gastosPagos = Math.round(gas.filter(g => g.pago).reduce((s,g) => s + getValorSalario(g), 0) * 100) / 100;

  // 3. Faturas de cartões de crédito pagas ou parcialmente pagas no mês
  const faturasPagas = Math.round((S.cartoes || []).filter(c => c.ativo !== false).reduce((s,c) => {
    const fReg = (S.faturasCartao || []).find(f => f.cartaoId === c.id && f.mes === mesAtual);
    return s + (fReg && (fReg.pago || fReg.pagoParcial) ? (Number(fReg.valorPago) || 0) : 0);
  }, 0) * 100) / 100;

  // 4. Total de saídas efetivas realizadas da conta (gastos pagos + faturas pagas + aportes)
  const totalPago = Math.round((gastosPagos + faturasPagas + totalInv) * 100) / 100;

  // 5. Saldo em Caixa Real em Tempo Real ("Painel Verdinho")
  const saldoCaixaReal = Math.round((totalDisponivel - totalPago) * 100) / 100;

  // 6. Gastos avulsos em aberto (pendentes do salário)
  const gastosAbertos = Math.round(gas.filter(g => !g.pago).reduce((s,g) => s + getValorSalario(g), 0) * 100) / 100;

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

  // 10. Totais de benefícios VA / VR da família (Etapa 4)
  const totalBeneficiosDisponivel = Math.round((S.carteirasBeneficio || []).reduce((s, c) => s + (Number(c.saldoAtual) || 0), 0) * 100) / 100;
  const totalBeneficiosRecargaPrevista = Math.round((S.carteirasBeneficio || []).reduce((s, c) => {
    const met = calcularMetricasCarteiraBeneficio(c.id);
    return s + (met && met.statusRecarga === 'prevista' ? (Number(c.recargaMensal) || 0) : 0);
  }, 0) * 100) / 100;
  
  return {
    totalRec, totalGas, totalGasSalario, totalGasBruto, totalGasBeneficios, totalInv, totalFaturasCartao,
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
    saldoProjetado,
    // Etapa 4: Benefícios VA / VR
    totalBeneficiosDisponivel,
    totalBeneficiosRecargaPrevista
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
  const circulo = typeof obterCirculoAtivo === 'function' ? obterCirculoAtivo() : null;
  const topNome = document.getElementById('top-circulo-nome');
  if (topNome && circulo) {
    topNome.textContent = circulo.nome;
  }

  // Membro ativo
  const membroAtivo = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
  const avatarBtn = document.getElementById('header-avatar-btn');
  const avatarTxt = document.getElementById('header-avatar-txt');
  const avatarCrown = document.getElementById('header-avatar-crown');

  if (avatarTxt && membroAtivo) {
    avatarTxt.textContent = membroAtivo.fotoUrl ? '' : (membroAtivo.iniciais || 'FM');
  }
  if (avatarBtn && membroAtivo) {
    if (membroAtivo.fotoUrl) {
      avatarBtn.style.backgroundImage = `url("${membroAtivo.fotoUrl}")`;
      avatarBtn.style.backgroundSize = 'cover';
      avatarBtn.style.backgroundPosition = 'center';
      avatarBtn.style.backgroundColor = 'transparent';
    } else {
      avatarBtn.style.backgroundImage = 'none';
      avatarBtn.style.background = membroAtivo.cor || '#5581E3';
    }
  }
  if (avatarCrown && membroAtivo) {
    avatarCrown.style.display = membroAtivo.papel === 'admin' ? 'block' : 'none';
  }

  // Badges
  if (typeof atualizarBadgesHeader === 'function') {
    atualizarBadgesHeader();
  }
}

function renderMuralInicio() {
  if (typeof document === 'undefined') return;

  // 1. Banner com Foto Familiar no Carrossel Superior
  const bannerEl = document.getElementById('carousel-family-banner');
  if (bannerEl) {
    if (S.fotoCapaFamiliaUrl) {
      bannerEl.style.backgroundImage = `linear-gradient(180deg, rgba(30,41,59,0.2) 0%, rgba(15,23,42,0.85) 100%), url("${S.fotoCapaFamiliaUrl}")`;
    } else {
      bannerEl.style.backgroundImage = `linear-gradient(180deg, rgba(30,41,59,0.3) 0%, rgba(15,23,42,0.85) 100%), url('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80')`;
    }
  }

  // 2. Grade de Módulos em 2 Colunas Idêntica ao Print de Referência
  const grid = document.getElementById('grid-mural-inicio') || document.getElementById('grid-modulos-inicio');
  if (!grid) return;

  const membroAtivo = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
  const isCrianca = membroAtivo && membroAtivo.papel === 'crianca';

  // Métricas rápidas para exibição nos cards
  const totaisFin = typeof calcTotais === 'function' ? calcTotais() : { saldoCaixaReal: 0, saldoReal: 0 };
  const saldoOrc = typeof fmt === 'function' ? fmt(totaisFin.saldoCaixaReal ?? totaisFin.saldoReal ?? 0) : 'R$ 0,00';

  const listas = S.listas || [];
  let totalPendenciasListas = 0;
  listas.forEach(l => {
    if (typeof calcularResumoLista === 'function') {
      const res = calcularResumoLista(l);
      totalPendenciasListas += (res.itensPendentes || res.pendentes || 0);
    }
  });

  const hoje = new Date();
  const dtIni = hoje.toISOString().slice(0, 10);
  const dtFimObj = new Date(hoje);
  dtFimObj.setDate(hoje.getDate() + 7);
  const dtFim = dtFimObj.toISOString().slice(0, 10);
  const eventosSemana = typeof obterEventosConsolidadosPeriodo === 'function'
    ? obterEventosConsolidadosPeriodo(dtIni, dtFim)
    : [];

  const alertasDocs = typeof obterAlertasDocumentosVencendo === 'function'
    ? obterAlertasDocumentosVencendo(30)
    : [];

  // Definição dos 8 cards exatos em 2 colunas do print
  const cardsPrint = [
    {
      id: 'listas',
      titulo: 'Listas',
      sub: totalPendenciasListas > 0 ? `${totalPendenciasListas} itens ativos` : 'Compras e tarefas',
      icone: '📝',
      bgIcon: '#FEF3C7',
      corIcon: '#D97706',
      acao: "go('listas')"
    },
    {
      id: 'calendario',
      titulo: 'Calendário',
      sub: eventosSemana.length > 0 ? `${eventosSemana.length} compromissos` : 'Compromissos',
      icone: '📅',
      bgIcon: '#EDE9FE',
      corIcon: '#7C3AED',
      acao: "go('calendario')"
    },
    {
      id: 'orcamento',
      titulo: isCrianca ? 'Cofrinho' : 'Orçamento',
      sub: isCrianca ? 'Mesada & poupança' : `Saldo: ${saldoOrc}`,
      icone: '💰',
      bgIcon: '#D1FAE5',
      corIcon: '#059669',
      acao: isCrianca ? "alert('Área financeira restrita aos adultos.')" : "go('resumo')"
    },
    {
      id: 'documentos',
      titulo: 'Documentos',
      sub: alertasDocs.length > 0 ? `⚠️ ${alertasDocs.length} vencendo` : 'Pastas e notas',
      icone: '📁',
      bgIcon: '#DBEAFE',
      corIcon: '#2563EB',
      acao: "abrirModalDocumentosFamilia()"
    },
    {
      id: 'aniversarios',
      titulo: 'Aniversários',
      sub: 'Datas especiais',
      icone: '⭐',
      bgIcon: '#FFEDD5',
      corIcon: '#EA580C',
      acao: "abrirModalAniversarios()"
    },
    {
      id: 'refeicoes',
      titulo: 'Refeições',
      sub: 'Cardápio semanal',
      icone: '🍽️',
      bgIcon: '#E0F2FE',
      corIcon: '#0284C7',
      acao: "abrirModalRefeicoesFamilia('cardapio')"
    },
    {
      id: 'horario',
      titulo: 'Horário',
      sub: 'Grade e rotina',
      icone: '⏰',
      bgIcon: '#FCE7F3',
      corIcon: '#DB2777',
      acao: "abrirModalGradeHoraria()"
    },
    {
      id: 'receitas_cul',
      titulo: 'Caixa de receitas',
      sub: 'Pratos favoritos',
      icone: '🍳',
      bgIcon: '#FEF3C7',
      corIcon: '#B45309',
      acao: "abrirModalRefeicoesFamilia('receitas')"
    }
  ];

  grid.innerHTML = cardsPrint.map(c => `
    <div class="mural-card-ref" onclick="${c.acao}">
      <h4 class="mural-card-title">${escapeHtml(c.titulo)}</h4>
      <p class="mural-card-sub">${escapeHtml(c.sub)}</p>
      <div class="mural-card-icon-bubble" style="background:${c.bgIcon}; color:${c.corIcon};">
        ${c.icone}
      </div>
    </div>
  `).join('');
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
  renderListas();
  renderCalendario();

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
  if (typeof document === 'undefined' || !document.getElementById) return;
  renderFiltroTitulares('filtro-titular-gastos', filtroTitularGasto, 'setFiltroTitularGasto');
  renderCartoesTopo();
  renderBeneficiosTopo();
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
  
  const fltOrigem = S.configOrcamento?.filtroOrigemAtivo || 'todos';
  const selOrigem = document.getElementById('filtro-origem-gastos');
  if (selOrigem && selOrigem.value !== fltOrigem) {
    selOrigem.value = fltOrigem;
  }

  let previstos = gastosPrevistosDoMes().filter(g => filtroTitularGasto === 'todos' || g.titular === filtroTitularGasto);

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

  let faturasHtml = cartoesComFatura.map(c => {
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

  // Aplicação do filtro de origem (todos, salario, VA, VR, cartao)
  if (fltOrigem === 'salario') {
    previstos = previstos.filter(g => (g.valorPagoSalario !== undefined ? g.valorPagoSalario > 0 : !g.valorPagoBeneficio));
  } else if (fltOrigem === 'VA') {
    previstos = previstos.filter(g => g.origemBeneficio === 'VA' || (g.valorPagoBeneficio > 0 && g.origemBeneficio === 'VA'));
    faturasHtml = '';
  } else if (fltOrigem === 'VR') {
    previstos = previstos.filter(g => g.origemBeneficio === 'VR' || (g.valorPagoBeneficio > 0 && g.origemBeneficio === 'VR'));
    faturasHtml = '';
  } else if (fltOrigem === 'cartao') {
    previstos = previstos.filter(g => g.tipoDivida === 'cartao' || g.parcelado);
  }

  if(!previstos.length && !inadFiltrada.length && !faturasHtml){
    el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhum gasto encontrado para os filtros selecionados.</p>';
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

    let benefBadge = '';
    if (g.valorPagoBeneficio > 0) {
      if (g.splitBeneficio) {
        benefBadge = `<span class="badge badge-split" title="Pago ${fmt(g.valorPagoBeneficio)} no ${escapeHtml(g.origemBeneficio || 'Vale')} e ${fmt(g.valorPagoSalario)} no Salário">⚡ Split (${escapeHtml(g.origemBeneficio || 'Vale')} + Salário)</span>`;
      } else if (g.origemBeneficio === 'VA') {
        benefBadge = `<span class="badge badge-va" title="Pago 100% com Vale-Alimentação">🥗 VA 100%</span>`;
      } else if (g.origemBeneficio === 'VR') {
        benefBadge = `<span class="badge badge-vr" title="Pago 100% com Vale-Refeição">🍽️ VR 100%</span>`;
      } else {
        benefBadge = `<span class="badge badge-va">🥗 Benefício</span>`;
      }
    }

    // Gastos já migrados para a aba de dívidas não exibem botões de pagar ou negociar para garantir integridade
    const statusHtml = (g.negociado || g.migradoDivida) ? '' : `<button class="status-btn ${g.pago?'pago':'pendente'}" onclick="togglePagoGasto(${g.id})">${g.pago?'✓ Pago':'⏳ Aberto'}</button>`;
    const adiantarHtml = (g.parcelado && !g.migradoDivida) ? `<button class="btn-adiantar" onclick="abrirModalAdiantar('${escapeHtml(g.grupoId)}')">⏩ Adiantar</button>` : '';
    const negociarHtml = (!g.pago && !g.negociado && !g.migradoDivida) ? `<button class="btn-negociar" onclick="abrirModalNegociarGasto(${g.id})">🤝 Negociar</button>` : '';

    return `<div class="item-row">
      <div style="flex:1;display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
        <span class="item-name">${escapeHtml(g.desc)}</span>
        <span class="badge ${badges[g.cat]||'b-rec'}">${escapeHtml(getNomeCategoria(g.cat))}</span>
        ${titBadge}
        ${benefBadge}
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
        <span class="item-del" onclick="if(confirm('Excluir este gasto?')){delGasto(${g.id});}">×</span>
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

/**
 * Executa chamadas à API Gemini com fallback resiliente entre os modelos em cascata.
 * Decisão de design: Atende à diretriz de contingência ("Sempre quando atingir o limite em um modelo de IA altere para o próximo melhor").
 * Ordem estrita: gemini-2.5-flash -> gemini-2.5-pro -> gemini-2.0-flash -> gemini-1.5-flash -> gemini-1.5-pro.
 * Em caso de status HTTP 429 (Rate Limit / Quota Exceeded), 503 (Overloaded) ou erro com indicação de cota/limite,
 * passa imediatamente para o próximo modelo sem travar a experiência do usuário.
 * 
 * @param {object} requisicao - Parâmetros da requisição contendo contents e generationConfig
 * @returns {Promise<{text: string, model: string, raw: object}>} Resposta com o texto extraído e o modelo que respondeu
 */
async function chamarGeminiComFallback(requisicao) {
  const chave = requisicao?.key || apiKey || S.apiKey;
  if (!chave || !chave.trim()) {
    throw new Error('Chave de API do Gemini não configurada.');
  }

  const corpo = {
    contents: requisicao.contents || [],
    ...(requisicao.generationConfig ? { generationConfig: requisicao.generationConfig } : {})
  };

  const listaModelos = Array.isArray(MODELOS_GEMINI_FALLBACK) && MODELOS_GEMINI_FALLBACK.length > 0
    ? MODELOS_GEMINI_FALLBACK
    : ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

  let ultimoErro = null;

  for (let i = 0; i < listaModelos.length; i++) {
    const modeloAtual = listaModelos[i];
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modeloAtual}:generateContent?key=${encodeURIComponent(chave)}`;

    try {
      const resposta = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo)
      });

      // Status 429: Rate Limit / Quota Exceeded; 503: Service Unavailable; 500: Erro interno temporário
      if (resposta.status === 429 || resposta.status === 503 || resposta.status === 500) {
        let detalheErro = `HTTP ${resposta.status}`;
        try {
          const errData = await resposta.json();
          if (errData?.error?.message) detalheErro = errData.error.message;
        } catch (eJson) {
          // Erro de parse JSON tratado explicitamente; mantém o código HTTP
          detalheErro = `HTTP ${resposta.status} (corpo não-JSON)`;
        }
        console.warn(`[Gemini Fallback] Modelo ${modeloAtual} atingiu limite (${detalheErro}). Alternando para o próximo modelo da lista...`);
        ultimoErro = new Error(`Modelo ${modeloAtual} excedeu quota (${detalheErro})`);
        continue;
      }

      if (!resposta.ok) {
        let msgErro = `HTTP ${resposta.status}`;
        try {
          const errData = await resposta.json();
          if (errData?.error?.message) msgErro = errData.error.message;
        } catch (eParse) {
          // Erro de parse JSON tratado explicitamente
          msgErro = `HTTP ${resposta.status} (falha ao ler mensagem de erro)`;
        }

        const msgLower = msgErro.toLowerCase();
        if (msgLower.includes('quota') || msgLower.includes('exhausted') || msgLower.includes('rate limit')) {
          console.warn(`[Gemini Fallback] Quota esgotada em ${modeloAtual} (${msgErro}). Alternando para o próximo modelo...`);
          ultimoErro = new Error(`Quota esgotada em ${modeloAtual}: ${msgErro}`);
          continue;
        }

        // Se for erro definitivo (ex: prompt inválido ou chave sem permissão), interrompe imediatamente
        throw new Error(`Erro na API Gemini (${modeloAtual}): ${msgErro}`);
      }

      const jsonResposta = await resposta.json();
      const textoFinal = jsonResposta.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return {
        text: textoFinal,
        model: modeloAtual,
        raw: jsonResposta
      };
    } catch (err) {
      const msgErr = (err?.message || '').toLowerCase();
      const erroTratavel = msgErr.includes('429') || msgErr.includes('quota') || msgErr.includes('exhausted') || msgErr.includes('rate limit') || msgErr.includes('503');

      if (erroTratavel && i < listaModelos.length - 1) {
        console.warn(`[Gemini Fallback] Exceção tratada em ${modeloAtual}. Tentando próximo modelo... Detalhe:`, err.message);
        ultimoErro = err;
        continue;
      }

      // Se for a última tentativa ou erro fatal de autenticação
      ultimoErro = err;
      if (msgErr.includes('api_key_invalid') || msgErr.includes('api key not valid')) {
        throw err;
      }
    }
  }

  throw ultimoErro || new Error('Todos os modelos de IA da lista de contingência falharam.');
}

async function ask(q) {
  const el = document.getElementById('ai-input');
  if (el) el.value = q;
  await sendMsg();
}

async function sendMsg() {
  const input = document.getElementById('ai-input');
  const msg = input ? input.value.trim() : '';
  if (!msg) return;
  if (input) input.value = '';

  const membroAtivo = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
  const mId = membroAtivo ? membroAtivo.id : (S.membroAtivoId || 'm_1');

  S.chat.push({ role: 'user', parts: [{ text: msg }] });
  renderChat();
  const loadId = 'ld' + Date.now();
  const chatMsgsEl = document.getElementById('chat-msgs');
  if (chatMsgsEl) {
    chatMsgsEl.innerHTML += `<div id="${loadId}" class="ai-msg ai-loading">Agente Norte analisando informações...</div>`;
    chatMsgsEl.scrollTop = 99999;
  }

  // Se não houver apiKey configurada, responde imediatamente com o motor local omnisciente (offline-ready)
  if (!apiKey && (!S.apiKey || !S.apiKey.trim())) {
    const respostaLocal = typeof responderPerguntaNorteLocal === 'function'
      ? responderPerguntaNorteLocal(msg, mId)
      : 'Agente Norte ativo em modo local offline.';
    S.chat.push({ role: 'model', parts: [{ text: respostaLocal }] });
    if (typeof save === 'function') save();
    document.getElementById(loadId)?.remove();
    renderChat();
    return;
  }

  try {
    const ctx = typeof construirContextoAgenteNorte === 'function'
      ? construirContextoAgenteNorte(mId)
      : { promptTexto: buildCtx() };
    const messages = [
      { role: 'user', parts: [{ text: (ctx.promptTexto || buildCtx()) + '\n\nPrimeira pergunta: ' + (S.chat[0]?.parts[0]?.text || msg) }] },
      ...S.chat.slice(1)
    ];
    const resultado = await chamarGeminiComFallback({
      contents: messages,
      generationConfig: { maxOutputTokens: 1000 }
    });
    const reply = resultado.text || (typeof responderPerguntaNorteLocal === 'function' ? responderPerguntaNorteLocal(msg, mId) : 'Resposta recebida.');
    S.chat.push({ role: 'model', parts: [{ text: reply }] });
    if (typeof save === 'function') save();
  } catch (e) {
    console.warn('Fallback para resposta determinística local do Agente Norte:', e);
    const replyFallback = typeof responderPerguntaNorteLocal === 'function'
      ? responderPerguntaNorteLocal(msg, mId)
      : ('Erro: ' + (e.message || 'Erro de conexão nos modelos Gemini.'));
    S.chat.push({ role: 'model', parts: [{ text: replyFallback }] });
    if (typeof save === 'function') save();
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

// ======================================================================
// SUPER-APP FAMILIAR v2.0 - ETAPA 4: CARTEIRAS DE BENEFÍCIOS (VA / VR) & ORÇAMENTO
// ======================================================================

/**
 * Retorna a quantidade de dias existentes no mês e ano informados.
 */
function obterDiasNoMes(ano, mes1a12) {
  const y = Number(ano) || new Date().getFullYear();
  const m = Number(mes1a12) || (new Date().getMonth() + 1);
  return new Date(y, m, 0).getDate();
}

/**
 * Ajusta o dia de recarga configurado para não ultrapassar o último dia de meses curtos.
 * Por exemplo, dia 31 em fevereiro (28/29 dias) ou abril (30 dias) vira o último dia do mês.
 */
function obterDataRecargaNoMes(diaConfigurado, ano, mes1a12) {
  const maxDias = obterDiasNoMes(ano, mes1a12);
  const diaAlvo = Math.max(1, Math.min(31, parseInt(diaConfigurado, 10) || 25));
  return Math.min(diaAlvo, maxDias);
}

/**
 * Calcula métricas e indicadores de uma carteira de benefício:
 * - Dias até a próxima recarga
 * - Cota diária recomendada (saldoAtual / diasAteRecarga)
 * - Status da recarga ('prevista' antes da data, 'creditada' a partir da data)
 * - Alerta de saldo baixo (< 15% da recarga mensal)
 */
function calcularMetricasCarteiraBeneficio(carteiraId, dataReferenciaISO) {
  if (!S || !Array.isArray(S.carteirasBeneficio)) return null;
  const carteira = S.carteirasBeneficio.find(c => c.id === carteiraId);
  if (!carteira) return null;

  let ano, mes1a12, diaHoje;
  if (dataReferenciaISO && typeof dataReferenciaISO === 'string' && dataReferenciaISO.length >= 10) {
    const partes = dataReferenciaISO.slice(0, 10).split('-').map(Number);
    ano = partes[0];
    mes1a12 = partes[1];
    diaHoje = partes[2];
  } else {
    const agora = new Date();
    ano = agora.getFullYear();
    mes1a12 = agora.getMonth() + 1;
    diaHoje = agora.getDate();
  }

  const diaRecargaEsteMes = obterDataRecargaNoMes(carteira.diaRecarga, ano, mes1a12);
  let diasAteRecarga = 0;
  let statusRecarga = 'creditada';
  let proximaDataISO = '';

  if (diaHoje < diaRecargaEsteMes) {
    statusRecarga = 'prevista';
    diasAteRecarga = diaRecargaEsteMes - diaHoje;
    proximaDataISO = `${ano}-${String(mes1a12).padStart(2, '0')}-${String(diaRecargaEsteMes).padStart(2, '0')}`;
  } else {
    statusRecarga = 'creditada';
    let proxMes = mes1a12 + 1;
    let proxAno = ano;
    if (proxMes > 12) {
      proxMes = 1;
      proxAno++;
    }
    const diaRecargaProxMes = obterDataRecargaNoMes(carteira.diaRecarga, proxAno, proxMes);
    proximaDataISO = `${proxAno}-${String(proxMes).padStart(2, '0')}-${String(diaRecargaProxMes).padStart(2, '0')}`;

    // Diferença em dias com UTC puro para imunidade total a fusos horários locais
    const dataHojeUtc = Date.UTC(ano, mes1a12 - 1, diaHoje);
    const dataProxUtc = Date.UTC(proxAno, proxMes - 1, diaRecargaProxMes);
    diasAteRecarga = Math.max(1, Math.round((dataProxUtc - dataHojeUtc) / (1000 * 60 * 60 * 24)));
  }

  const saldoAtual = Math.round((Number(carteira.saldoAtual) || 0) * 100) / 100;
  const recargaMensal = Math.round((Number(carteira.recargaMensal) || 0) * 100) / 100;
  const divisorDias = Math.max(1, diasAteRecarga);
  const cotaDiaria = Math.round((saldoAtual / divisorDias) * 100) / 100;
  const alertaSaldoBaixo = recargaMensal > 0 && saldoAtual < (recargaMensal * 0.15);
  const percentualRestante = recargaMensal > 0 ? Math.round((saldoAtual / recargaMensal) * 100) : 0;

  return {
    carteiraId: carteira.id,
    nome: carteira.nome,
    tipo: carteira.tipo,
    titular: carteira.titular,
    saldoAtual,
    recargaMensal,
    diaRecarga: carteira.diaRecarga || 25,
    diasAteRecarga,
    cotaDiaria: Math.max(0, cotaDiaria),
    statusRecarga,
    proximaDataRecargaISO: proximaDataISO,
    alertaSaldoBaixo,
    percentualRestante
  };
}

/**
 * Processa recargas automáticas de VA e VR para as carteiras cadastradas.
 * REGRA ESSENCIAL: O saldo NUNCA é zerado na virada do mês! Ele acumula
 * (ex.: sobrou 150 + recarga 800 = 950).
 */
function processarRecargasBeneficiosAutomaticas(dataReferenciaISO) {
  if (!S || !Array.isArray(S.carteirasBeneficio) || S.carteirasBeneficio.length === 0) {
    return [];
  }

  let ano, mes1a12, diaHoje;
  if (dataReferenciaISO && typeof dataReferenciaISO === 'string' && dataReferenciaISO.length >= 10) {
    const partes = dataReferenciaISO.slice(0, 10).split('-').map(Number);
    ano = partes[0];
    mes1a12 = partes[1];
    diaHoje = partes[2];
  } else {
    const agora = new Date();
    ano = agora.getFullYear();
    mes1a12 = agora.getMonth() + 1;
    diaHoje = agora.getDate();
  }
  const mesYM = `${ano}-${String(mes1a12).padStart(2, '0')}`;

  const recargasExecutadas = [];
  if (!Array.isArray(S.movimentacoesBeneficio)) S.movimentacoesBeneficio = [];

  S.carteirasBeneficio.forEach(carteira => {
    carteira.recargasProcessadas = Array.isArray(carteira.recargasProcessadas) ? carteira.recargasProcessadas : [];
    // Se já processou recarga para este mês, não duplica
    if (carteira.recargasProcessadas.includes(mesYM)) {
      return;
    }

    const diaRecargaEfetivo = obterDataRecargaNoMes(carteira.diaRecarga, ano, mes1a12);
    // Se a data de referência já atingiu ou passou o dia de recarga no mês
    if (diaHoje >= diaRecargaEfetivo) {
      const valorRecarga = Math.round((Number(carteira.recargaMensal) || 0) * 100) / 100;
      if (valorRecarga > 0) {
        // Acúmulo sem perda de saldo residual anterior
        carteira.saldoAtual = Math.round(((Number(carteira.saldoAtual) || 0) + valorRecarga) * 100) / 100;
        carteira.recargasProcessadas.push(mesYM);

        const mov = {
          id: 'mov_rec_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          carteiraId: carteira.id,
          tipo: 'recarga',
          valor: valorRecarga,
          dataISO: dataReferenciaISO ? String(dataReferenciaISO) : new Date().toISOString(),
          mesYM,
          gastoId: null,
          descricao: `Recarga mensal programada (${carteira.tipo} - ${carteira.nome})`,
          saldoApos: carteira.saldoAtual
        };
        S.movimentacoesBeneficio.push(mov);
        recargasExecutadas.push({ carteiraId: carteira.id, valor: valorRecarga, saldoAtual: carteira.saldoAtual });
      }
    }
  });

  if (recargasExecutadas.length > 0) {
    if (typeof save === 'function') save();
  }
  return recargasExecutadas;
}

/**
 * Permite antecipar ou forçar uma recarga mensal para uma carteira específica.
 */
function creditarRecargaManual(carteiraId, mesYM) {
  if (!S || !Array.isArray(S.carteirasBeneficio)) return { ok: false, motivo: 'sem_carteiras' };
  const carteira = S.carteirasBeneficio.find(c => c.id === carteiraId);
  if (!carteira) return { ok: false, motivo: 'carteira_nao_encontrada' };

  const ymAlvo = mesYM || mesAtual;
  carteira.recargasProcessadas = Array.isArray(carteira.recargasProcessadas) ? carteira.recargasProcessadas : [];
  if (carteira.recargasProcessadas.includes(ymAlvo)) {
    return { ok: false, motivo: 'ja_recarregada_no_mes', carteira };
  }

  const valor = Math.round((Number(carteira.recargaMensal) || 0) * 100) / 100;
  carteira.saldoAtual = Math.round(((Number(carteira.saldoAtual) || 0) + valor) * 100) / 100;
  carteira.recargasProcessadas.push(ymAlvo);

  if (!Array.isArray(S.movimentacoesBeneficio)) S.movimentacoesBeneficio = [];
  S.movimentacoesBeneficio.push({
    id: 'mov_rec_man_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    carteiraId: carteira.id,
    tipo: 'recarga',
    valor,
    dataISO: new Date().toISOString(),
    mesYM: ymAlvo,
    gastoId: null,
    descricao: `Recarga manual antecipada (${carteira.tipo} - ${carteira.nome})`,
    saldoApos: carteira.saldoAtual
  });

  if (typeof save === 'function') save();
  if (typeof render === 'function') render();
  return { ok: true, carteira, valorCreditado: valor };
}

/**
 * Calcula a divisão de pagamento entre Benefício (VA/VR) e Salário (Split).
 * - Se o saldo cobrir 100%, débito total do benefício e R$ 0 do salário.
 * - Se o saldo for insuficiente, debita o saldo existente do vale e a diferença vai para o salário.
 * - Suporta forçar VA, VR, Salário ou detecção automática por palavras-chave.
 */
function calcularDivisaoPagamentoBeneficio(opts = {}) {
  const valorTotal = Math.round((Number(opts.valorTotal) || 0) * 100) / 100;
  if (valorTotal <= 0) {
    return {
      valorTotal: 0,
      valorPagoBeneficio: 0,
      valorPagoSalario: 0,
      carteiraId: null,
      tipoBeneficio: null,
      split: false,
      descricaoSplit: 'R$ 0,00'
    };
  }

  const forcarOrigem = opts.forcarOrigem || 'auto';
  const forcarCarteiraId = opts.forcarCarteiraId || null;
  const membroId = opts.membroId || null;
  const titular = (opts.titular || '').trim();
  const categoria = (opts.categoria || '').toLowerCase();
  const descricao = (opts.descricao || '').toLowerCase();
  const subcategoria = (opts.subcategoria || '').toLowerCase();

  if (forcarOrigem === 'salario') {
    return {
      valorTotal,
      valorPagoBeneficio: 0,
      valorPagoSalario: valorTotal,
      carteiraId: null,
      tipoBeneficio: null,
      split: false,
      descricaoSplit: '100% no Salário'
    };
  }

  let tipoAlvo = null;
  if (forcarOrigem === 'VA') {
    tipoAlvo = 'VA';
  } else if (forcarOrigem === 'VR') {
    tipoAlvo = 'VR';
  } else {
    const textoCompleto = `${categoria} ${subcategoria} ${descricao}`;
    const termosVA = ['mercado', 'supermercado', 'hortifruti', 'mercearia', 'acougue', 'padaria', 'alimentacao', 'feira', 'sacolao', 'compras', 'atacadista', 'hipermercado'];
    const termosVR = ['refeicao', 'restaurante', 'almoco', 'jantar', 'lanche', 'delivery', 'ifood', 'rappi', 'pizzaria', 'hamburgueria', 'comida', 'bar', 'cafeteria'];

    const ehVA = termosVA.some(t => textoCompleto.includes(t));
    const ehVR = termosVR.some(t => textoCompleto.includes(t));

    if (ehVA && !ehVR) {
      tipoAlvo = 'VA';
    } else if (ehVR && !ehVA) {
      tipoAlvo = 'VR';
    } else if (ehVA && ehVR) {
      tipoAlvo = termosVR.some(t => descricao.includes(t)) ? 'VR' : 'VA';
    } else {
      tipoAlvo = null;
    }
  }

  if (!tipoAlvo && !forcarCarteiraId) {
    return {
      valorTotal,
      valorPagoBeneficio: 0,
      valorPagoSalario: valorTotal,
      carteiraId: null,
      tipoBeneficio: null,
      split: false,
      descricaoSplit: '100% no Salário'
    };
  }

  const carteiras = S.carteirasBeneficio || [];
  let carteiraCandidata = null;

  if (forcarCarteiraId) {
    carteiraCandidata = carteiras.find(c => c.id === forcarCarteiraId);
  } else {
    // 1. Tenta carteira do titular com saldo positivo
    if (membroId) {
      carteiraCandidata = carteiras.find(c => c.membroId === membroId && c.tipo === tipoAlvo && Number(c.saldoAtual) > 0);
    }
    if (!carteiraCandidata && titular) {
      carteiraCandidata = carteiras.find(c => (c.titular || '').toLowerCase() === titular.toLowerCase() && c.tipo === tipoAlvo && Number(c.saldoAtual) > 0);
    }
    // 2. Se o titular não tiver saldo, tenta qualquer carteira do mesmo tipo com saldo positivo
    if (!carteiraCandidata) {
      carteiraCandidata = carteiras.find(c => c.tipo === tipoAlvo && Number(c.saldoAtual) > 0);
    }
    // 3. Fallback: carteira do titular mesmo sem saldo ou primeira do tipo
    if (!carteiraCandidata && titular) {
      carteiraCandidata = carteiras.find(c => (c.titular || '').toLowerCase() === titular.toLowerCase() && c.tipo === tipoAlvo);
    }
    if (!carteiraCandidata) {
      carteiraCandidata = carteiras.find(c => c.tipo === tipoAlvo);
    }
  }

  if (!carteiraCandidata) {
    return {
      valorTotal,
      valorPagoBeneficio: 0,
      valorPagoSalario: valorTotal,
      carteiraId: null,
      tipoBeneficio: null,
      split: false,
      descricaoSplit: '100% no Salário'
    };
  }

  const saldoDisponivel = Math.max(0, Math.round((Number(carteiraCandidata.saldoAtual) || 0) * 100) / 100);

  // Cenário 1: Benefício cobre 100% do gasto
  if (saldoDisponivel >= valorTotal) {
    return {
      valorTotal,
      valorPagoBeneficio: valorTotal,
      valorPagoSalario: 0,
      carteiraId: carteiraCandidata.id,
      tipoBeneficio: carteiraCandidata.tipo,
      split: false,
      descricaoSplit: `100% no ${carteiraCandidata.tipo}`
    };
  }

  // Cenário 2: Split Automático (saldo parcial no benefício + restante no salário)
  if (saldoDisponivel > 0 && saldoDisponivel < valorTotal) {
    const valorPagoSalario = Math.round((valorTotal - saldoDisponivel) * 100) / 100;
    return {
      valorTotal,
      valorPagoBeneficio: saldoDisponivel,
      valorPagoSalario,
      carteiraId: carteiraCandidata.id,
      tipoBeneficio: carteiraCandidata.tipo,
      split: true,
      descricaoSplit: `Split: ${carteiraCandidata.tipo} ${fmt(saldoDisponivel)} + Salário ${fmt(valorPagoSalario)}`
    };
  }

  // Cenário 3: Saldo de benefício zerado -> 100% no salário
  return {
    valorTotal,
    valorPagoBeneficio: 0,
    valorPagoSalario: valorTotal,
    carteiraId: carteiraCandidata.id,
    tipoBeneficio: carteiraCandidata.tipo,
    split: false,
    descricaoSplit: `100% no Salário (${carteiraCandidata.tipo} zerado)`
  };
}

/**
 * Registra um gasto consumindo benefício (se aplicável) e debitando o saldo da carteira.
 */
function registrarGastoComBeneficio(dadosGasto) {
  if (!dadosGasto || typeof dadosGasto !== 'object') return null;

  const divisao = calcularDivisaoPagamentoBeneficio({
    valorTotal: dadosGasto.val,
    categoria: dadosGasto.cat,
    subcategoria: dadosGasto.subcategoria,
    descricao: dadosGasto.desc,
    titular: dadosGasto.titular,
    membroId: dadosGasto.membroId,
    forcarOrigem: dadosGasto.origemPagamento || dadosGasto.forcarOrigem,
    forcarCarteiraId: dadosGasto.carteiraBeneficioId || dadosGasto.forcarCarteiraId
  });

  const gastoPreparado = Object.assign({}, dadosGasto, {
    val: divisao.valorTotal,
    valorPagoBeneficio: divisao.valorPagoBeneficio,
    valorPagoSalario: divisao.valorPagoSalario,
    carteiraBeneficioId: divisao.carteiraId,
    origemBeneficio: divisao.tipoBeneficio,
    splitBeneficio: divisao.split
  });

  if (divisao.valorPagoBeneficio > 0 && divisao.carteiraId) {
    const carteira = (S.carteirasBeneficio || []).find(c => c.id === divisao.carteiraId);
    if (carteira) {
      carteira.saldoAtual = Math.max(0, Math.round(((Number(carteira.saldoAtual) || 0) - divisao.valorPagoBeneficio) * 100) / 100);

      if (!Array.isArray(S.movimentacoesBeneficio)) S.movimentacoesBeneficio = [];
      const movDeb = {
        id: 'mov_deb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        carteiraId: carteira.id,
        tipo: 'debito',
        valor: divisao.valorPagoBeneficio,
        dataISO: gastoPreparado.data ? `${gastoPreparado.data}T12:00:00.000Z` : new Date().toISOString(),
        mesYM: (gastoPreparado.data || '').slice(0, 7) || mesAtual,
        gastoId: gastoPreparado.id,
        descricao: `Débito compra: ${gastoPreparado.desc || 'Gasto'}`,
        saldoApos: carteira.saldoAtual
      };
      S.movimentacoesBeneficio.push(movDeb);
    }
  }

  return gastoPreparado;
}

/**
 * Estorna o valor de benefício de um gasto de volta à carteira correspondente.
 * Registra movimentação do tipo 'estorno'.
 */
function estornarBeneficioDeGasto(gastoId) {
  if (!S || !Array.isArray(S.gastos)) return false;
  const gasto = S.gastos.find(g => g.id === gastoId);
  if (!gasto) return false;

  const valorBeneficio = Number(gasto.valorPagoBeneficio) || 0;
  const carteiraId = gasto.carteiraBeneficioId;

  if (valorBeneficio > 0 && carteiraId && Array.isArray(S.carteirasBeneficio)) {
    const carteira = S.carteirasBeneficio.find(c => c.id === carteiraId);
    if (carteira) {
      carteira.saldoAtual = Math.round(((Number(carteira.saldoAtual) || 0) + valorBeneficio) * 100) / 100;

      if (!Array.isArray(S.movimentacoesBeneficio)) S.movimentacoesBeneficio = [];
      const movEst = {
        id: 'mov_est_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        carteiraId: carteira.id,
        tipo: 'estorno',
        valor: valorBeneficio,
        dataISO: new Date().toISOString(),
        mesYM: (gasto.data || '').slice(0, 7) || mesAtual,
        gastoId: gasto.id,
        descricao: `Estorno de gasto excluído: ${gasto.desc || 'Gasto'}`,
        saldoApos: carteira.saldoAtual
      };
      S.movimentacoesBeneficio.push(movEst);
    }
  }

  gasto.valorPagoBeneficio = 0;
  gasto.valorPagoSalario = gasto.val;
  gasto.carteiraBeneficioId = null;
  return true;
}

/**
 * Cadastra ou edita uma carteira de benefício.
 * Blindado contra vinculação a perfis do tipo 'crianca'.
 */
function criarOuEditarCarteiraBeneficio(dados) {
  if (!dados || typeof dados !== 'object') return { ok: false, motivo: 'dados_invalidos' };
  if (!S) S = {};
  if (!Array.isArray(S.carteirasBeneficio)) S.carteirasBeneficio = [];

  const membroAtivo = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
  if (membroAtivo && membroAtivo.papel === 'crianca') {
    if (typeof alert === 'function') {
      alert('Benefícios corporativos (VA/VR) só podem ser gerenciados por membros responsáveis adultos.');
    }
    return { ok: false, motivo: 'perfil_crianca_bloqueado' };
  }

  const membro = (S.membrosPerfil || []).find(m => (dados.membroId && m.id === dados.membroId) || (dados.titular && (m.nome || '').toLowerCase() === (dados.titular || '').toLowerCase()));
  if (membro && membro.papel === 'crianca') {
    if (typeof alert === 'function') {
      alert('Benefícios corporativos (VA/VR) só podem ser atribuídos a membros responsáveis adultos.');
    }
    return { ok: false, motivo: 'perfil_crianca_bloqueado' };
  }

  const tipo = (dados.tipo === 'VR') ? 'VR' : 'VA';
  const nome = (dados.nome || `${tipo} ${membro ? membro.nome : 'Família'}`).trim();
  const recargaMensal = Math.max(0, Math.round((Number(dados.recargaMensal) || 0) * 100) / 100);
  const diaRecarga = Math.min(31, Math.max(1, parseInt(dados.diaRecarga, 10) || 25));
  const permitirOutroVale = dados.permitirOutroVale !== false;
  const titular = membro ? membro.nome : (dados.titular || 'Família');
  const membroId = membro ? membro.id : (dados.membroId || 'm_1');
  const circuloId = S.circuloAtivoId || 'circ_1';

  let carteira = null;
  if (dados.id) {
    carteira = S.carteirasBeneficio.find(c => c.id === dados.id);
  }

  if (carteira) {
    carteira.tipo = tipo;
    carteira.nome = nome;
    carteira.titular = titular;
    carteira.membroId = membroId;
    carteira.recargaMensal = recargaMensal;
    carteira.diaRecarga = diaRecarga;
    carteira.permitirOutroVale = permitirOutroVale;
    if (dados.saldoAtual !== undefined) {
      carteira.saldoAtual = Math.round((Number(dados.saldoAtual) || 0) * 100) / 100;
    }
  } else {
    const saldoInicial = Math.max(0, Math.round((Number(dados.saldoAtual !== undefined ? dados.saldoAtual : dados.saldoInicial) || 0) * 100) / 100);
    carteira = {
      id: 'cb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      circuloId,
      membroId,
      titular,
      tipo,
      nome,
      recargaMensal,
      saldoAtual: saldoInicial,
      diaRecarga,
      permitirOutroVale,
      categoriasMapeadas: tipo === 'VA' ? ['mercado', 'hortifruti', 'alimentacao'] : ['restaurante', 'refeicao', 'delivery'],
      recargasProcessadas: []
    };
    S.carteirasBeneficio.push(carteira);

    if (saldoInicial > 0) {
      if (!Array.isArray(S.movimentacoesBeneficio)) S.movimentacoesBeneficio = [];
      S.movimentacoesBeneficio.push({
        id: 'mov_ini_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        carteiraId: carteira.id,
        tipo: 'recarga',
        valor: saldoInicial,
        dataISO: new Date().toISOString(),
        mesYM: mesAtual,
        gastoId: null,
        descricao: `Saldo inicial da carteira (${tipo} - ${nome})`,
        saldoApos: saldoInicial
      });
    }
  }

  if (typeof save === 'function') save();
  if (typeof render === 'function') render();
  return { ok: true, carteira };
}

/**
 * Exclui uma carteira de benefício.
 */
function excluirCarteiraBeneficio(carteiraId) {
  if (!S || !Array.isArray(S.carteirasBeneficio)) return false;
  S.carteirasBeneficio = S.carteirasBeneficio.filter(c => c.id !== carteiraId);
  if (typeof save === 'function') save();
  if (typeof render === 'function') render();
  return true;
}

// --- CONTROLE DE UI & TELAS (Etapa 4) ---

function setTabBeneficios(tab) {
  if (typeof document === 'undefined') return;
  const tabs = ['lista', 'extrato', 'form'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tb-beneficios-${t}`);
    const painel = document.getElementById(`painel-beneficios-${t}`);
    if (btn) btn.classList.toggle('sel', t === tab);
    if (painel) painel.style.display = t === tab ? 'block' : 'none';
  });

  if (tab === 'lista') renderCarteirasBeneficioModal();
  if (tab === 'extrato') renderExtratoBeneficiosModal();
}

function abrirModalCarteirasBeneficio() {
  if (typeof document === 'undefined') return;
  const membroAtivo = obterMembroAtivo();
  if (membroAtivo && membroAtivo.papel === 'crianca') {
    if (typeof alert === 'function') {
      alert('Acesso restrito aos responsáveis adultos.');
    }
    return;
  }

  processarRecargasBeneficiosAutomaticas();
  setTabBeneficios('lista');
  openM('m-carteiras-beneficio');
}

function renderCarteirasBeneficioModal() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('lista-carteiras-beneficio');
  if (!container) return;

  const carteiras = S.carteirasBeneficio || [];
  if (carteiras.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:24px 12px;background:var(--bg3);border-radius:var(--radius-sm);border:1px dashed var(--border2);">
        <p style="font-size:28px;margin-bottom:6px;">🥗</p>
        <p style="font-weight:700;font-size:14px;margin-bottom:2px;">Nenhuma carteira de benefício</p>
        <p style="font-size:12px;color:var(--muted);margin-bottom:12px;">Cadastre seu Vale-Alimentação (VA) ou Vale-Refeição (VR) para automatizar o orçamento familiar.</p>
        <button type="button" class="btn btn-primary" onclick="abrirFormNovaCarteiraBeneficio()">+ Cadastrar Vale</button>
      </div>
    `;
    return;
  }

  container.innerHTML = carteiras.map(c => {
    const met = calcularMetricasCarteiraBeneficio(c.id);
    const badgeCor = c.tipo === 'VA' ? 'badge-va' : 'badge-vr';
    const alertaHtml = met && met.alertaSaldoBaixo ? `<span class="badge" style="background:rgba(239,68,68,0.2);color:#f87171;">⚠️ Saldo Baixo (&lt; 15%)</span>` : '';
    const proxRecargaTxt = met && met.statusRecarga === 'prevista' ? `Recarga em ${met.diasAteRecarga} dias (dia ${c.diaRecarga})` : `Recarga feita este mês (próx: ${met ? met.diasAteRecarga : 30}d)`;

    return `
      <div class="card card-beneficio-item" style="border-left: 4px solid ${c.tipo === 'VA' ? 'var(--green)' : 'var(--yellow)'};">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
          <div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
              <span class="badge ${badgeCor}">${c.tipo}</span>
              <strong style="font-size:14px;">${escapeHtml(c.nome)}</strong>
            </div>
            <p style="font-size:11px;color:var(--muted);margin:0;">Titular: ${escapeHtml(c.titular || 'Família')} • Recarga mensal: ${fmt(c.recargaMensal)}</p>
          </div>
          <button type="button" class="btn" style="width:auto;margin:0;padding:4px 9px;font-size:11px;" onclick="editarCarteiraBeneficioModal('${c.id}')">✏️ Editar</button>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px;background:var(--bg3);padding:8px 12px;border-radius:10px;">
          <div>
            <p style="font-size:11px;color:var(--muted);margin:0 0 2px;">Saldo Disponível</p>
            <p style="font-size:20px;font-weight:800;color:${c.tipo === 'VA' ? 'var(--green)' : 'var(--yellow)'};margin:0;">${fmt(c.saldoAtual)}</p>
          </div>
          <div style="text-align:right;">
            <p style="font-size:11px;color:var(--muted);margin:0 0 2px;">Cota Diária</p>
            <p style="font-size:13px;font-weight:700;margin:0;">${fmt(met ? met.cotaDiaria : 0)}/dia</p>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-size:11px;color:var(--muted);">
          <span>📅 ${proxRecargaTxt}</span>
          ${alertaHtml}
        </div>
      </div>
    `;
  }).join('');
}

function abrirFormNovaCarteiraBeneficio() {
  document.getElementById('cb-edit-id').value = '';
  document.getElementById('cb-form-titulo').textContent = 'Cadastrar Nova Carteira';
  document.getElementById('cb-nome').value = '';
  document.getElementById('cb-recarga').value = '';
  document.getElementById('cb-saldo-inicial').value = '';
  document.getElementById('cb-dia-recarga').value = '25';
  document.getElementById('cb-permitir-outro-vale').checked = true;
  document.getElementById('cb-btn-excluir').style.display = 'none';

  const titSel = document.getElementById('cb-titular');
  if (titSel) {
    const membrosAdultos = (S.membrosPerfil || []).filter(m => m.papel !== 'crianca');
    titSel.innerHTML = membrosAdultos.map(m => `<option value="${escapeHtml(m.id)}">${escapeHtml(m.nome)}</option>`).join('');
  }

  setTabBeneficios('form');
}

function editarCarteiraBeneficioModal(carteiraId) {
  const carteira = (S.carteirasBeneficio || []).find(c => c.id === carteiraId);
  if (!carteira) return;

  document.getElementById('cb-edit-id').value = carteira.id;
  document.getElementById('cb-form-titulo').textContent = `Editar Carteira (${carteira.tipo})`;
  document.getElementById('cb-tipo').value = carteira.tipo;
  document.getElementById('cb-nome').value = carteira.nome;
  document.getElementById('cb-recarga').value = carteira.recargaMensal;
  document.getElementById('cb-saldo-inicial').value = carteira.saldoAtual;
  document.getElementById('cb-dia-recarga').value = carteira.diaRecarga || 25;
  document.getElementById('cb-permitir-outro-vale').checked = carteira.permitirOutroVale !== false;
  document.getElementById('cb-btn-excluir').style.display = 'block';

  const titSel = document.getElementById('cb-titular');
  if (titSel) {
    const membrosAdultos = (S.membrosPerfil || []).filter(m => m.papel !== 'crianca');
    titSel.innerHTML = membrosAdultos.map(m => `<option value="${escapeHtml(m.id)}" ${m.id === carteira.membroId ? 'selected' : ''}>${escapeHtml(m.nome)}</option>`).join('');
  }

  setTabBeneficios('form');
}

function salvarCarteiraBeneficioModal() {
  const id = document.getElementById('cb-edit-id')?.value || null;
  const tipo = document.getElementById('cb-tipo')?.value || 'VA';
  const nome = (document.getElementById('cb-nome')?.value || '').trim();
  const membroId = document.getElementById('cb-titular')?.value || null;
  const recargaMensal = parseFloat(document.getElementById('cb-recarga')?.value) || 0;
  const saldoAtual = parseFloat(document.getElementById('cb-saldo-inicial')?.value) || 0;
  const diaRecarga = parseInt(document.getElementById('cb-dia-recarga')?.value, 10) || 25;
  const permitirOutroVale = document.getElementById('cb-permitir-outro-vale')?.checked;

  if (!nome) {
    if (typeof alert === 'function') alert('Informe o nome da carteira (ex: Flash Alimentação).');
    return;
  }

  const res = criarOuEditarCarteiraBeneficio({
    id,
    tipo,
    nome,
    membroId,
    recargaMensal,
    saldoAtual,
    diaRecarga,
    permitirOutroVale
  });

  if (res.ok) {
    exibirToastNotificacao(`Carteira ${res.carteira.nome} salva com sucesso!`, '🥗');
    setTabBeneficios('lista');
  }
}

function excluirCarteiraBeneficioModal() {
  const id = document.getElementById('cb-edit-id')?.value;
  if (!id) return;
  if (typeof confirm === 'function' && !confirm('Excluir esta carteira de benefícios?')) {
    return;
  }
  excluirCarteiraBeneficio(id);
  exibirToastNotificacao('Carteira excluída com sucesso.', '🗑️');
  setTabBeneficios('lista');
}

function renderExtratoBeneficiosModal() {
  if (typeof document === 'undefined') return;
  const selectCarteira = document.getElementById('flt-extrato-carteira');
  const container = document.getElementById('extrato-beneficios-conteudo');
  if (!container) return;

  const carteiras = S.carteirasBeneficio || [];
  if (selectCarteira) {
    const atualVal = selectCarteira.value;
    selectCarteira.innerHTML = `<option value="todas">Todas as Carteiras</option>` + carteiras.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.nome)} (${c.tipo})</option>`).join('');
    if (atualVal) selectCarteira.value = atualVal;
  }

  const fltId = selectCarteira ? selectCarteira.value : 'todas';
  const movs = (S.movimentacoesBeneficio || []).filter(m => {
    if (fltId !== 'todas' && m.carteiraId !== fltId) return false;
    return true;
  }).slice().reverse();

  if (movs.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:var(--muted);font-size:13px;padding:24px 0;">Nenhuma movimentação registrada.</p>`;
    return;
  }

  container.innerHTML = movs.map(m => {
    const isCredito = m.tipo === 'recarga' || m.tipo === 'estorno';
    const corVal = isCredito ? 'c-green' : 'c-red';
    const sinal = isCredito ? '+' : '-';
    const icone = m.tipo === 'recarga' ? '📥 Recarga' : (m.tipo === 'estorno' ? '↩️ Estorno' : '🛒 Débito');
    const dataFmt = m.dataISO ? m.dataISO.slice(0, 10).split('-').reverse().join('/') : '';

    return `
      <div class="extrato-row">
        <div>
          <p style="font-size:13px;font-weight:600;margin:0 0 2px;">${icone}: ${escapeHtml(m.descricao || 'Movimentação')}</p>
          <p style="font-size:11px;color:var(--muted);margin:0;">${dataFmt} • Saldo após: ${fmt(m.saldoApos)}</p>
        </div>
        <div style="font-weight:700;font-size:14px;" class="${corVal}">
          ${sinal} ${fmt(m.valor)}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Atualiza dinamicamente o preview de divisão no modal de novo gasto manual (#m-gasto).
 */
function atualizarPreviewBeneficioGasto() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('g-preview-beneficio');
  if (!container) return;

  const val = parseFloat(document.getElementById('g-val')?.value) || 0;
  const desc = document.getElementById('g-desc')?.value || '';
  const titular = document.getElementById('g-titular')?.value || '';
  const catSel = document.querySelector('#cat-tags .tag.sel')?.dataset.cat || 'recorrente';
  const origemSel = document.getElementById('g-origem-pagamento')?.value || 'auto';

  if (val <= 0) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  const divisao = calcularDivisaoPagamentoBeneficio({
    valorTotal: val,
    descricao: desc,
    titular,
    categoria: catSel,
    forcarOrigem: origemSel
  });

  if (divisao.valorPagoBeneficio > 0 || divisao.split) {
    container.style.display = 'block';
    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span>💳 Divisão estimada:</span>
        <strong style="color:var(--green);">${escapeHtml(divisao.descricaoSplit)}</strong>
      </div>
      <p style="font-size:11px;color:var(--muted);margin:4px 0 0;">O valor coberto por benefício (${fmt(divisao.valorPagoBeneficio)}) não reduzirá o salário da família.</p>
    `;
  } else if (origemSel !== 'auto' && origemSel !== 'salario') {
    container.style.display = 'block';
    container.innerHTML = `<span style="color:var(--yellow);">⚠️ Saldo do ${escapeHtml(origemSel)} zerado ou insuficiente. Valor debitado 100% no Salário.</span>`;
  } else {
    container.style.display = 'none';
    container.innerHTML = '';
  }
}

/**
 * Atualiza dinamicamente o preview de divisão no modal de conversão de compras (#m-converter-gasto-lista).
 */
function atualizarPreviewBeneficioConverter() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('cvg-preview-beneficio');
  if (!container) return;

  const val = parseFloat(document.getElementById('cvg-valor')?.value) || 0;
  const desc = document.getElementById('cvg-desc')?.value || 'Mercado';
  const titular = document.getElementById('cvg-titular')?.value || '';
  const cat = document.getElementById('cvg-categoria')?.value || 'recorrente';
  const origemSel = document.getElementById('cvg-origem-pagamento')?.value || 'auto';

  if (val <= 0) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  const divisao = calcularDivisaoPagamentoBeneficio({
    valorTotal: val,
    descricao: desc,
    titular,
    categoria: cat,
    forcarOrigem: origemSel
  });

  if (divisao.valorPagoBeneficio > 0 || divisao.split) {
    container.style.display = 'block';
    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span>💳 Divisão do Mercado:</span>
        <strong style="color:var(--green);">${escapeHtml(divisao.descricaoSplit)}</strong>
      </div>
      <p style="font-size:11px;color:var(--muted);margin:4px 0 0;">O valor do VA (${fmt(divisao.valorPagoBeneficio)}) não consome o caixa do salário.</p>
    `;
  } else {
    container.style.display = 'block';
    container.innerHTML = `<span style="color:var(--muted);">Débito integral em Conta Salário (R$ ${fmt(val)}).</span>`;
  }
}

/**
 * Renderiza os cards de saldo de VA e VR no topo da tela de Gastos (#sec-gastos).
 */
function renderBeneficiosTopo() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('beneficios-topo-container');
  if (!container) return;

  const membroAtivo = obterMembroAtivo();
  if (membroAtivo && membroAtivo.papel === 'crianca') {
    container.style.display = 'none';
    return;
  }

  const carteiras = S.carteirasBeneficio || [];
  if (carteiras.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  let totalVA = 0;
  let totalVR = 0;
  let qtdVA = 0;
  let qtdVR = 0;

  carteiras.forEach(c => {
    if (c.tipo === 'VA') {
      totalVA += Number(c.saldoAtual) || 0;
      qtdVA++;
    } else {
      totalVR += Number(c.saldoAtual) || 0;
      qtdVR++;
    }
  });

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
      <div class="card" style="margin:0;padding:12px;border-left:4px solid var(--green);cursor:pointer;" onclick="abrirModalCarteirasBeneficio()" title="Gerenciar Vales de Benefício">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span class="badge badge-va" style="font-size:10px;">🥗 VA Mercado</span>
          <span style="font-size:11px;color:var(--muted);">${qtdVA} ${qtdVA === 1 ? 'cartão' : 'cartões'}</span>
        </div>
        <p style="font-size:18px;font-weight:800;color:var(--green);margin:0;">${fmt(totalVA)}</p>
        <p style="font-size:10px;color:var(--muted);margin:2px 0 0;">Saldo livre acumulado</p>
      </div>

      <div class="card" style="margin:0;padding:12px;border-left:4px solid var(--yellow);cursor:pointer;" onclick="abrirModalCarteirasBeneficio()" title="Gerenciar Vales de Benefício">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span class="badge badge-vr" style="font-size:10px;">🍽️ VR Refeição</span>
          <span style="font-size:11px;color:var(--muted);">${qtdVR} ${qtdVR === 1 ? 'cartão' : 'cartões'}</span>
        </div>
        <p style="font-size:18px;font-weight:800;color:var(--yellow);margin:0;">${fmt(totalVR)}</p>
        <p style="font-size:10px;color:var(--muted);margin:2px 0 0;">Saldo livre acumulado</p>
      </div>
    </div>
  `;
}

/**
 * Altera o filtro ativo de origem dos gastos ('todos', 'salario', 'VA', 'VR', 'cartao').
 */
function setFiltroOrigemGasto(origem) {
  if (!S.configOrcamento) S.configOrcamento = {};
  S.configOrcamento.filtroOrigemAtivo = origem || 'todos';
  if (typeof renderGastos === 'function' && typeof document !== 'undefined') {
    renderGastos();
  }
}

/**
 * Salva o dia de início do ciclo de orçamento configurado pelo usuário.
 */
function salvarConfigCicloOrcamentoModal() {
  if (typeof document === 'undefined') return;
  const diaInput = document.getElementById('cfg-dia-inicio-ciclo');
  const dia = diaInput ? parseInt(diaInput.value, 10) : 1;
  const diaFinal = Math.min(31, Math.max(1, dia || 1));

  if (!S.configOrcamento) S.configOrcamento = {};
  S.configOrcamento.diaInicioCiclo = diaFinal;

  if (typeof save === 'function') save();
  if (typeof exibirToastNotificacao === 'function') {
    exibirToastNotificacao(`Ciclo do orçamento configurado: dia ${diaFinal} de cada mês.`, '⚙️');
  }
}

// ============================================================================
// ETAPA 5: SCANNER INTELIGENTE DE CUPOM FISCAL, NOTA FISCAL E COMPROVANTE (OCR)
// ============================================================================

/**
 * Realiza o parsing determinístico de linhas de itens a partir do texto de cupom fiscal/SAT.
 */
function parsearItensCupomTexto(linhas, valorTotalNota) {
  const itens = [];
  const palavrasIgnoradas = [
    'total', 'subtotal', 'desconto', 'acrescimo', 'pagamento', 'forma', 'troco',
    'dinheiro', 'vale', 'cartao', 'chave', 'cnpj', 'cpf', 'data', 'hora',
    'cupom', 'fiscal', 'danfe', 'nfc-e', 'sat', 'serie', 'numero', 'extrato',
    'itens', 'item', 'codigo', 'descricao', 'qtd', 'un', 'vl_unit', 'vl_total',
    'tributos', 'impostos', 'icms', 'issqn', 'procon', 'sefaz', 'volte', 'sempre',
    'obrigado', 'atendente', 'caixa', 'operador', 'consumidor'
  ];

  for (const linha of (linhas || [])) {
    const lTrim = String(linha || '').trim();
    if (!lTrim || lTrim.length < 5) continue;
    const lLower = lTrim.toLowerCase();

    // Linhas de cabeçalho ou totais
    const primeiraPalavra = lLower.split(/[\s:]+/)[0];
    if (palavrasIgnoradas.includes(primeiraPalavra)) continue;
    if (lLower.startsWith('valor total') || lLower.startsWith('total r$') || lLower.startsWith('total a pagar') || lLower.startsWith('forma de pag')) continue;

    // Procura por números no final da linha (valor total do item)
    const matchFim = lTrim.match(/([\d\.\,]+)\s*$/);
    if (!matchFim) continue;

    const strValTotal = matchFim[1].replace(',', '.');
    const valTotalItem = parseFloat(strValTotal);
    if (isNaN(valTotalItem) || valTotalItem <= 0 || valTotalItem > 100000) continue;

    const restoLinha = lTrim.slice(0, matchFim.index).trim();
    if (!restoLinha) continue;

    let qtd = 1;
    let un = 'un';
    let unitVal = valTotalItem;
    let desc = restoLinha;

    // Analisa se restoLinha termina com valor unitário (ex: "ARROZ BRANCO 5KG 1 UN 29,90" ou "4 x 5,49")
    const matchUnit = restoLinha.match(/(?:(\d+(?:[\.\,]\d+)?)\s*(un|kg|g|l|ml|pct|cx|dz|lt)?\s*(?:x|\*|\@)?\s*)?([\d\.\,]+)\s*$/i);
    if (matchUnit && matchUnit[3]) {
      const parsedUnit = parseFloat(matchUnit[3].replace(',', '.'));
      if (!isNaN(parsedUnit) && parsedUnit > 0) {
        unitVal = parsedUnit;
        if (matchUnit[1]) {
          qtd = parseFloat(matchUnit[1].replace(',', '.')) || 1;
        } else if (valTotalItem > 0 && unitVal > 0) {
          qtd = Math.round((valTotalItem / unitVal) * 100) / 100 || 1;
        }
        if (matchUnit[2]) un = matchUnit[2].toLowerCase();
        desc = restoLinha.slice(0, matchUnit.index).trim();
      }
    }

    // Remove códigos numéricos no início da descrição (ex: "001 ", "7891234567890 ")
    desc = desc.replace(/^\d{1,14}\s+/, '').trim();
    if (!desc || desc.length < 2) continue;

    itens.push({
      descricao: desc,
      quantidade: qtd,
      unidade: un,
      valorUnitario: Math.round(unitVal * 100) / 100,
      valorTotal: Math.round(valTotalItem * 100) / 100
    });
  }

  // Se nenhum item foi extraído mas há valor total na nota, gera item consolidado
  if (itens.length === 0 && valorTotalNota > 0) {
    itens.push({
      descricao: 'Compra Geral / Cupom Fiscal',
      quantidade: 1,
      unidade: 'un',
      valorUnitario: valorTotalNota,
      valorTotal: valorTotalNota
    });
  }

  return itens;
}

/**
 * Extrai deterministicamente dados de um cupom a partir de texto puro, URL da SEFAZ ou payload de QR Code.
 */
function extrairDadosCupomTextoOuQR(textoOuQR) {
  const raw = String(textoOuQR || '').trim();
  if (!raw) {
    return {
      id: 'cupom_' + Date.now(),
      estabelecimento: 'Cupom Não Identificado',
      cnpj: null,
      data: new Date().toISOString().slice(0, 10),
      hora: '12:00',
      chaveAcesso: null,
      valorTotal: 0,
      valorTotalCentavos: 0,
      descontos: 0,
      acrescimos: 0,
      formaPagamentoDetectada: 'auto',
      categoriaSugerida: 'outros',
      itens: [],
      confiancaCampos: {
        estabelecimento: 0.1,
        data: 0.1,
        valorTotal: 0.0,
        formaPagamento: 0.1
      }
    };
  }

  // 1. Extração de Chave de Acesso (44 dígitos contínuos ou em URL com p=...)
  let chaveAcesso = null;
  const matchChave = raw.match(/\b(\d{44})\b/);
  if (matchChave) {
    chaveAcesso = matchChave[1];
  } else {
    const matchUrlP = raw.match(/[?&]p=([0-9]{44})/i);
    if (matchUrlP) chaveAcesso = matchUrlP[1];
  }

  // 2. Extração de CNPJ
  let cnpj = null;
  const matchCnpj = raw.match(/\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/);
  if (matchCnpj) {
    cnpj = matchCnpj[0];
  } else if (chaveAcesso && chaveAcesso.length === 44) {
    // Na chave de 44 dígitos: posições 6 a 19 são os 14 dígitos do CNPJ
    const cNum = chaveAcesso.slice(6, 20);
    cnpj = `${cNum.slice(0, 2)}.${cNum.slice(2, 5)}.${cNum.slice(5, 8)}/${cNum.slice(8, 12)}-${cNum.slice(12, 14)}`;
  } else {
    const matchCnpjNum = raw.match(/(?:CNPJ|CGC)[:\s]*(\d{14})\b/i);
    if (matchCnpjNum) {
      const cNum = matchCnpjNum[1];
      cnpj = `${cNum.slice(0, 2)}.${cNum.slice(2, 5)}.${cNum.slice(5, 8)}/${cNum.slice(8, 12)}-${cNum.slice(12, 14)}`;
    }
  }

  // 3. Extração de Data e Hora
  let data = null;
  let matchDataEncontrada = false;
  const matchDataBr = raw.match(/\b(\d{2})[\/\-](\d{2})[\/\-](\d{4})\b/);
  if (matchDataBr) {
    const [, d, m, a] = matchDataBr;
    data = `${a}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    matchDataEncontrada = true;
  } else if (chaveAcesso && chaveAcesso.length === 44) {
    // Posições 2 a 5 da chave indicam ano (2 dígitos) e mês (2 dígitos)
    const ano = '20' + chaveAcesso.slice(2, 4);
    const mes = chaveAcesso.slice(4, 6);
    data = `${ano}-${mes}-01`;
  } else {
    data = new Date().toISOString().slice(0, 10);
  }

  let hora = '12:00';
  const matchHora = raw.match(/\b([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?\b/);
  if (matchHora) {
    hora = `${matchHora[1]}:${matchHora[2]}`;
  }

  // 4. Extração de Valor Total
  let valorTotal = 0;
  let matchTotalEncontrado = false;
  const matchTotal = raw.match(/(?:VALOR\s+TOTAL|TOTAL\s+A\s+PAGAR|VALOR\s+PAGO|VALOR\s+RECEBIDO|TOTAL\s*R?\$|VALOR\s+LIQUIDO|TOTAL)[:\s]*R?\$?\s*([\d\.\,]+)/i);
  if (matchTotal) {
    const limpo = matchTotal[1].replace(',', '.');
    const parsed = parseFloat(limpo);
    if (!isNaN(parsed) && parsed > 0) {
      valorTotal = parsed;
      matchTotalEncontrado = true;
    }
  }

  // 5. Linhas do texto para itens e estabelecimento
  const linhas = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const itens = parsearItensCupomTexto(linhas, valorTotal);

  // Se não achou na linha de total mas há itens, soma os itens
  if (valorTotal === 0 && itens.length > 0) {
    const somaItens = itens.reduce((acc, it) => acc + (it.valorTotal || 0), 0);
    if (somaItens > 0) {
      valorTotal = Math.round(somaItens * 100) / 100;
      matchTotalEncontrado = true;
    }
  }

  // 6. Extração de Descontos e Acréscimos
  let descontos = 0;
  const matchDesc = raw.match(/(?:DESCONTO|DESCONTOS)[:\s]*R?\$?\s*([\d\.\,]+)/i);
  if (matchDesc) descontos = parseFloat(matchDesc[1].replace(',', '.')) || 0;

  let acrescimos = 0;
  const matchAcre = raw.match(/(?:ACRESCIMO|ACRESCIMOS|TAXA\s+SERVICO)[:\s]*R?\$?\s*([\d\.\,]+)/i);
  if (matchAcre) acrescimos = parseFloat(matchAcre[1].replace(',', '.')) || 0;

  // 7. Detecção de Forma de Pagamento
  let formaPagamento = 'auto';
  const rawLower = raw.toLowerCase();
  if (rawLower.includes('vale alimentacao') || rawLower.includes('vale-alimentacao') || rawLower.includes('alelo alimentacao') || rawLower.includes('sodexo alimentacao') || rawLower.includes('ticket alimentacao') || rawLower.includes('cartao alimentacao') || rawLower.includes('va alimentacao') || /\bva\b/i.test(raw)) {
    formaPagamento = 'VA';
  } else if (rawLower.includes('vale refeicao') || rawLower.includes('vale-refeicao') || rawLower.includes('alelo refeicao') || rawLower.includes('sodexo refeicao') || rawLower.includes('ticket restaurante') || rawLower.includes('cartao refeicao') || rawLower.includes('vr refeicao') || /\bvr\b/i.test(raw)) {
    formaPagamento = 'VR';
  } else if (rawLower.includes('credito') || rawLower.includes('cartao de credito')) {
    formaPagamento = 'credito';
  } else if (rawLower.includes('debito') || rawLower.includes('cartao de debito')) {
    formaPagamento = 'debito';
  } else if (rawLower.includes('pix')) {
    formaPagamento = 'pix';
  } else if (rawLower.includes('dinheiro') || rawLower.includes('especie')) {
    formaPagamento = 'dinheiro';
  }

  // 8. Estabelecimento
  let estabelecimento = '';
  for (const l of linhas) {
    const lLow = l.toLowerCase();
    if (lLow.includes('danfe') || lLow.includes('nfc-e') || lLow.includes('documento auxiliar') || lLow.includes('cupom fiscal') || lLow.includes('sefaz') || lLow.includes('extrato') || lLow.includes('http') || lLow.startsWith('cnpj') || lLow.startsWith('data')) {
      continue;
    }
    if (/[a-zA-Z]{3,}/.test(l)) {
      estabelecimento = l;
      break;
    }
  }
  if (!estabelecimento) {
    estabelecimento = cnpj ? `Estabelecimento ${cnpj}` : 'Estabelecimento Comercial';
  }

  // 9. Categoria Sugerida
  let categoria = 'outros';
  const termosMercado = ['mercado', 'supermercado', 'hipermercado', 'atacado', 'atacadão', 'atacadao', 'mercearia', 'hortifruti', 'acougue', 'açougue', 'sacolao', 'sacolão', 'carrefour', 'pao de acucar', 'pão de açúcar', 'assai', 'assaí', 'extra', 'feira'];
  const termosRestaurante = ['restaurante', 'lanchonete', 'pizzaria', 'hamburgueria', 'padaria', 'bar', 'cafe', 'café', 'cafeteria', 'bistro', 'bistrô', 'churrascaria', 'grill', 'delivery', 'ifood', 'almoço', 'jantar'];
  const termosFarmacia = ['farmacia', 'farmácia', 'drogaria', 'medicamento', 'droga', 'panvel', 'raia', 'drogasil', 'pague menos'];
  const termosTransporte = ['posto', 'combustivel', 'combustível', 'gasolina', 'etanol', 'diesel', 'auto posto', 'uber', '99'];
  const termosLazer = ['cinema', 'teatro', 'parque', 'show', 'ingresso'];

  if (termosMercado.some(t => rawLower.includes(t))) {
    categoria = 'mercado';
  } else if (termosRestaurante.some(t => rawLower.includes(t))) {
    categoria = 'restaurante';
  } else if (termosFarmacia.some(t => rawLower.includes(t))) {
    categoria = 'farmacia';
  } else if (termosTransporte.some(t => rawLower.includes(t))) {
    categoria = 'transporte';
  } else if (termosLazer.some(t => rawLower.includes(t))) {
    categoria = 'lazer';
  } else if (formaPagamento === 'VA') {
    categoria = 'mercado';
  } else if (formaPagamento === 'VR') {
    categoria = 'restaurante';
  }

  // 10. Cálculo de Confiança dos Campos
  const confiancaCampos = {
    estabelecimento: (estabelecimento && !estabelecimento.startsWith('Estabelecimento Comercial') && !estabelecimento.startsWith('Cupom Não Identificado')) ? 0.95 : 0.50,
    data: matchDataEncontrada ? 0.95 : (chaveAcesso ? 0.85 : 0.60),
    valorTotal: (valorTotal > 0 && matchTotalEncontrado) ? 0.98 : (valorTotal > 0 ? 0.70 : 0.0),
    formaPagamento: formaPagamento !== 'auto' ? 0.90 : 0.50
  };

  return {
    id: 'cupom_' + Date.now(),
    estabelecimento,
    cnpj,
    data,
    hora,
    chaveAcesso,
    valorTotal,
    valorTotalCentavos: Math.round(valorTotal * 100),
    descontos,
    acrescimos,
    formaPagamentoDetectada: formaPagamento,
    categoriaSugerida: categoria,
    itens,
    confiancaCampos
  };
}

/**
 * Gera um identificador único determinístico para o cupom fiscal (chave de 44 dígitos ou tupla estabelecimento/cnpj + data + total).
 */
function gerarHashCupomFiscal(dados) {
  if (!dados) return '';
  const chave = dados.chaveAcesso ? String(dados.chaveAcesso).replace(/\D/g, '') : '';
  if (chave && chave.length === 44) {
    return 'chave_' + chave;
  }
  const estab = (dados.cnpj || dados.estabelecimento || 'sem_estab')
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
  const dataYmd = (dados.data || new Date().toISOString().slice(0, 10)).slice(0, 10);
  const centavos = Math.round((Number(dados.valorTotal) || 0) * 100);
  return `${estab}|${dataYmd}|${centavos}`;
}

/**
 * Verifica se o cupom já foi registrado no histórico da família (em S.cuponsFiscais ou S.gastos).
 */
function verificarCupomDuplicado(hashCupom) {
  if (!hashCupom) return false;
  const emCupons = (S.cuponsFiscais || []).some(c => c.hashCupom === hashCupom);
  if (emCupons) return true;
  const emGastos = (S.gastos || []).some(g => g.hashCupom === hashCupom);
  if (emGastos) return true;
  const emCompras = (S.comprasCartao || []).some(c => c.hashCupom === hashCupom);
  if (emCompras) return true;
  return false;
}

/**
 * Cruza os itens extraídos do cupom fiscal com os itens pendentes nas listas de compras ativas.
 */
function cruzarItensCupomComListaCompras(itensCupom, listas) {
  const listasAlvo = (listas || S.listas || []).filter(l => l.tipo === 'compras');
  if (!Array.isArray(itensCupom) || itensCupom.length === 0 || listasAlvo.length === 0) {
    return [];
  }

  function normalizar(txt) {
    return String(txt || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .trim();
  }

  const matches = [];
  const itemListaIdsAdicionados = new Set();

  listasAlvo.forEach(lista => {
    (lista.itens || []).forEach(itemLista => {
      if (itemLista.comprado) return;
      if (itemListaIdsAdicionados.has(itemLista.id)) return;

      const normLista = normalizar(itemLista.nome);
      if (!normLista) return;

      const tokensLista = normLista.split(/\s+/).filter(t => t.length >= 3 && !['pct', 'caixa', 'lata', 'litro', 'quilo', 'unid'].includes(t));

      for (const itemCupom of itensCupom) {
        const normCupom = normalizar(itemCupom.descricao);
        const contemNomeExato = normCupom.includes(normLista);
        const contemTokens = tokensLista.length > 0 && tokensLista.every(t => normCupom.includes(t));

        if (contemNomeExato || contemTokens) {
          itemListaIdsAdicionados.add(itemLista.id);
          matches.push({
            itemListaId: itemLista.id,
            listaId: lista.id,
            nomeLista: lista.titulo,
            itemNome: itemLista.nome,
            cupomItemDescricao: itemCupom.descricao,
            precoUnitarioCupom: itemCupom.valorUnitario || itemCupom.valorTotal,
            quantidadeCupom: itemCupom.quantidade || 1
          });
          break;
        }
      }
    });
  });

  return matches;
}

/**
 * Envia o documento para o Gemini Vision utilizando a cadeia de fallback de 5 modelos resilientes.
 */
async function chamarGeminiVisionCupom(base64, mimeType = 'image/jpeg') {
  if (!apiKey && (!S || !S.apiKey)) {
    throw new Error('Configure a Gemini API Key em Configurações para usar a inteligência artificial.');
  }

  const prompt = `Você é um leitor especialista em notas fiscais eletrônicas brasileiras (NFC-e, NF-e, SAT, CF-e e comprovantes de pagamento).
Analise a imagem/documento fornecido e extraia todos os dados com máxima precisão.
Responda ESTRITAMENTE em formato JSON puro, sem blocos de código markdown (\`\`\`json), sem textos extras antes ou depois.

Formato do JSON esperado:
{
  "estabelecimento": "Nome da loja/mercado/restaurante",
  "cnpj": "00.000.000/0000-00",
  "data": "YYYY-MM-DD",
  "hora": "HH:MM",
  "chaveAcesso": "44 dígitos se visível ou vazio",
  "valorTotal": 0.00,
  "descontos": 0.00,
  "acrescimos": 0.00,
  "formaPagamento": "VA|VR|credito|debito|pix|dinheiro",
  "categoria": "mercado|restaurante|farmacia|transporte|lazer|recorrente|outros",
  "itens": [
    {
      "descricao": "Nome do produto ou serviço",
      "quantidade": 1.0,
      "unidade": "un|kg|pct|cx|l|g",
      "valorUnitario": 0.00,
      "valorTotal": 0.00
    }
  ],
  "confianca": {
    "estabelecimento": 0.95,
    "data": 0.95,
    "valorTotal": 0.98,
    "formaPagamento": 0.90
  }
}`;

  const resultado = await chamarGeminiComFallback({
    contents: [{
      role: 'user',
      parts: [
        { text: prompt },
        { inline_data: { mime_type: mimeType, data: base64 } }
      ]
    }],
    generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 1200 }
  });

  const texto = resultado.text;
  if (!texto) throw new Error('Sem resposta dos modelos Gemini na extração do cupom fiscal.');

  const limpo = texto.replace(/```json/gi, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(limpo);

  const valorTotal = typeof parsed.valorTotal === 'number' ? parsed.valorTotal : parseFloat(parsed.valorTotal) || 0;
  return {
    id: 'cupom_' + Date.now(),
    estabelecimento: parsed.estabelecimento || 'Estabelecimento Comercial',
    cnpj: parsed.cnpj || null,
    data: parsed.data || new Date().toISOString().slice(0, 10),
    hora: parsed.hora || '12:00',
    chaveAcesso: parsed.chaveAcesso ? String(parsed.chaveAcesso).replace(/\D/g, '') : null,
    valorTotal,
    valorTotalCentavos: Math.round(valorTotal * 100),
    descontos: parseFloat(parsed.descontos) || 0,
    acrescimos: parseFloat(parsed.acrescimos) || 0,
    formaPagamentoDetectada: parsed.formaPagamento || 'auto',
    categoriaSugerida: parsed.categoria || 'outros',
    itens: Array.isArray(parsed.itens) ? parsed.itens.map(i => ({
      descricao: i.descricao || 'Item',
      quantidade: parseFloat(i.quantidade) || 1,
      unidade: i.unidade || 'un',
      valorUnitario: parseFloat(i.valorUnitario) || parseFloat(i.valorTotal) || 0,
      valorTotal: parseFloat(i.valorTotal) || 0
    })) : [],
    confiancaCampos: parsed.confianca || {
      estabelecimento: 0.95,
      data: 0.90,
      valorTotal: 0.98,
      formaPagamento: 0.85
    }
  };
}

/**
 * Processa o documento fiscal (imagem, QR ou texto), gerando um rascunho de conferência.
 * Regra de Ouro: NUNCA lança direto em S.gastos sem confirmação expressa do usuário!
 */
function processarDocumentoFiscal(dadosEntrada) {
  // 1. Blindagem estrita do perfil crianca
  const membroAtivo = obterMembroAtivo();
  if (membroAtivo && membroAtivo.papel === 'crianca') {
    return {
      ok: false,
      motivo: 'perfil_crianca_bloqueado',
      mensagem: 'Perfil de criança não tem permissão para ler ou lançar cupons fiscais.'
    };
  }

  let rascunho = null;

  // 2. Extração via mock direto (usado na suíte de testes) ou parser determinístico
  if (dadosEntrada && dadosEntrada.mockVisionResultado) {
    rascunho = Object.assign({}, dadosEntrada.mockVisionResultado);
    if (!rascunho.id) rascunho.id = 'cupom_' + Date.now();
    if (!rascunho.valorTotalCentavos) {
      rascunho.valorTotalCentavos = Math.round(Number(rascunho.valorTotal || 0) * 100);
    }
    if (!rascunho.formaPagamentoDetectada && rascunho.formaPagamento) {
      rascunho.formaPagamentoDetectada = rascunho.formaPagamento;
    }
    if (!rascunho.categoriaSugerida && rascunho.categoria) {
      rascunho.categoriaSugerida = rascunho.categoria;
    }
    if (!rascunho.confiancaCampos) {
      rascunho.confiancaCampos = rascunho.confianca || {
        estabelecimento: 0.95,
        data: 0.95,
        valorTotal: 0.98,
        formaPagamento: 0.90
      };
    }
  } else {
    const textoParaExtrair = typeof dadosEntrada === 'string'
      ? dadosEntrada
      : (dadosEntrada?.conteudo || dadosEntrada?.texto || dadosEntrada?.payloadQR || '');

    rascunho = extrairDadosCupomTextoOuQR(textoParaExtrair);
  }

  // 3. Hash e verificação anti-duplicidade
  const hash = gerarHashCupomFiscal(rascunho);
  rascunho.hashCupom = hash;
  rascunho.duplicado = verificarCupomDuplicado(hash);

  // 4. Cruzamento inteligente com a lista de compras
  rascunho.itensCorrespondentesLista = cruzarItensCupomComListaCompras(rascunho.itens, S.listas);

  // 5. Salva no rascunho para revisão do usuário
  S.rascunhoCupomAtual = rascunho;

  // 6. Atualiza a tela de revisão se estiver em ambiente DOM
  if (typeof document !== 'undefined' && typeof renderRevisaoCupomModal === 'function') {
    renderRevisaoCupomModal();
  }

  return {
    ok: true,
    rascunho
  };
}

/**
 * Confirma o lançamento do cupom fiscal após conferência/edição do usuário.
 */
function confirmarLancamentoCupomFiscal(opcoes = {}) {
  // 1. Blindagem estrita do perfil crianca
  const membroAtivo = obterMembroAtivo();
  if (membroAtivo && membroAtivo.papel === 'crianca') {
    return {
      ok: false,
      motivo: 'perfil_crianca_bloqueado',
      mensagem: 'Perfil de criança não tem permissão para lançar despesas fiscais.'
    };
  }

  // 2. Rascunho da nota
  const rascunho = opcoes.rascunhoOverride || S.rascunhoCupomAtual;
  if (!rascunho) {
    return {
      ok: false,
      motivo: 'sem_rascunho',
      mensagem: 'Nenhum rascunho de cupom fiscal em conferência.'
    };
  }

  // 3. Anti-duplicidade
  const hash = rascunho.hashCupom || gerarHashCupomFiscal(rascunho);
  const duplicado = verificarCupomDuplicado(hash);
  if (duplicado && !opcoes.forcarDuplicado) {
    return {
      ok: false,
      motivo: 'cupom_duplicado',
      mensagem: 'Atenção: Este cupom fiscal já foi lançado anteriormente!'
    };
  }

  // 4. Parâmetros de consolidação
  const estabFinal = (opcoes.estabelecimento !== undefined ? opcoes.estabelecimento : rascunho.estabelecimento) || 'Estabelecimento';
  const valorFinal = Math.round((opcoes.valorTotal !== undefined ? Number(opcoes.valorTotal) : Number(rascunho.valorTotal || 0)) * 100) / 100;
  const dataFinal = (opcoes.data || rascunho.data || new Date().toISOString().slice(0, 10)).slice(0, 10);
  const horaFinal = opcoes.hora || rascunho.hora || '12:00';
  const catFinal = opcoes.categoria || rascunho.categoriaSugerida || 'outros';
  const titularFinal = opcoes.titular || (membroAtivo ? membroAtivo.nome : 'Família');
  const origemFinal = opcoes.origemPagamento || rascunho.formaPagamentoDetectada || 'auto';
  const cartaoIdFinal = opcoes.cartaoId || null;

  let gastoCriado = null;
  let compraCartaoCriada = null;

  const cupomId = rascunho.id || ('cupom_' + Date.now());

  // 5. Lançamento Financeiro (Cartão de Crédito ou VA / VR / Salário com Split)
  if (origemFinal === 'cartao' && cartaoIdFinal) {
    const cartao = (S.cartoes || []).find(c => c.id === cartaoIdFinal);
    const mesFatura = cartao
      ? calcularMesFaturaCompra(dataFinal, cartao.diaFechamento, cartao.diaVencimento)
      : mesAtual;

    compraCartaoCriada = {
      id: Date.now(),
      cartaoId: cartaoIdFinal,
      desc: estabFinal,
      valorTotal: valorFinal,
      parcelas: 1,
      parcelaAtual: 1,
      valorParcela: valorFinal,
      dataCompra: dataFinal,
      mesFatura,
      titular: titularFinal,
      categoria: catFinal,
      cupomFiscalId: cupomId,
      hashCupom: hash
    };
    if (!Array.isArray(S.comprasCartao)) S.comprasCartao = [];
    S.comprasCartao.push(compraCartaoCriada);

    if (typeof verificarEReabrirFatura === 'function') {
      verificarEReabrirFatura(cartaoIdFinal, mesFatura);
    }
  } else {
    // Lança via registrarGastoComBeneficio (respeita VA / VR / Split e Regra de Ouro!)
    const gastoId = Date.now();
    gastoCriado = registrarGastoComBeneficio({
      id: gastoId,
      desc: estabFinal,
      val: valorFinal,
      cat: catFinal,
      titular: titularFinal,
      data: dataFinal,
      pago: true,
      origemPagamento: origemFinal
    });
    gastoCriado.cupomFiscalId = cupomId;
    gastoCriado.hashCupom = hash;
    if (!Array.isArray(S.gastos)) S.gastos = [];
    S.gastos.push(gastoCriado);
  }

  // 6. Registro oficial em S.cuponsFiscais
  const novoCupom = {
    id: cupomId,
    circuloId: S.circuloAtivoId || 'circ_1',
    membroId: S.membroAtivoId || null,
    gastoId: gastoCriado ? gastoCriado.id : null,
    compraCartaoId: compraCartaoCriada ? compraCartaoCriada.id : null,
    estabelecimento: estabFinal,
    cnpj: rascunho.cnpj || null,
    data: dataFinal,
    hora: horaFinal,
    valorTotal: valorFinal,
    valorTotalCentavos: Math.round(valorFinal * 100),
    descontos: rascunho.descontos || 0,
    acrescimos: rascunho.acrescimos || 0,
    formaPagamento: origemFinal,
    categoria: catFinal,
    chaveAcesso: rascunho.chaveAcesso || null,
    hashCupom: hash,
    itens: rascunho.itens || [],
    confiancaCampos: rascunho.confiancaCampos || {},
    criadoPor: S.membroAtivoId,
    criadoEm: new Date().toISOString()
  };

  if (!Array.isArray(S.cuponsFiscais)) S.cuponsFiscais = [];
  S.cuponsFiscais.push(novoCupom);

  // 7. Atualização de itens correspondentes na Lista de Compras
  const itensParaComprarIds = opcoes.itensListaParaComprar || (rascunho.itensCorrespondentesLista || []).map(m => m.itemListaId);
  if (Array.isArray(itensParaComprarIds) && itensParaComprarIds.length > 0) {
    (S.listas || []).forEach(lista => {
      if (lista.tipo !== 'compras') return;
      (lista.itens || []).forEach(it => {
        if (itensParaComprarIds.includes(it.id)) {
          it.comprado = true;
          it.compradoEm = new Date().toISOString();
          it.compradoPor = titularFinal;
        }
      });
    });
  }

  // 8. Atualização do Histórico de Compras Inteligente (preço unitário real e frequência)
  if (!Array.isArray(S.historicoCompras)) S.historicoCompras = [];
  (rascunho.itens || []).forEach(it => {
    const nomeLimpo = (it.descricao || '').trim();
    if (!nomeLimpo) return;
    const preco = it.valorUnitario || it.valorTotal || 0;
    const existente = S.historicoCompras.find(h => h.nome.toLowerCase() === nomeLimpo.toLowerCase());
    if (existente) {
      existente.vezesUsado = (existente.vezesUsado || 1) + 1;
      if (preco > 0) existente.precoUltimo = preco;
    } else {
      S.historicoCompras.push({
        nome: nomeLimpo,
        categoria: catFinal,
        precoUltimo: preco,
        vezesUsado: 1
      });
    }
  });

  // 9. Registro no feed de atividades da família
  if (typeof registrarAtividadeFamilia === 'function') {
    registrarAtividadeFamilia(
      'financeiro',
      `Cupom fiscal lançado: ${estabFinal} (R$ ${fmt ? fmt(valorFinal) : valorFinal})`,
      { cupomId: novoCupom.id, gastoId: novoCupom.gastoId }
    );
  }

  // 10. Limpa rascunho
  S.rascunhoCupomAtual = null;

  if (typeof save === 'function') save();
  if (typeof render === 'function' && typeof document !== 'undefined') render();

  return {
    ok: true,
    cupom: novoCupom,
    gasto: gastoCriado || compraCartaoCriada
  };
}

/**
 * Exclui um cupom fiscal do histórico.
 */
function excluirCupomFiscal(cupomId) {
  const membroAtivo = obterMembroAtivo();
  if (membroAtivo && membroAtivo.papel === 'crianca') {
    return { ok: false, motivo: 'perfil_crianca_bloqueado' };
  }
  if (!Array.isArray(S.cuponsFiscais)) return { ok: false };
  S.cuponsFiscais = S.cuponsFiscais.filter(c => c.id !== cupomId);
  if (typeof save === 'function') save();
  if (typeof render === 'function' && typeof document !== 'undefined') render();
  return { ok: true };
}

/**
 * Abre o modal do scanner de cupom fiscal com validação de perfil de criança.
 */
function abrirScannerCupom() {
  const membroAtivo = obterMembroAtivo();
  if (membroAtivo && membroAtivo.papel === 'crianca') {
    if (typeof exibirToastNotificacao === 'function') {
      exibirToastNotificacao('Acesso restrito aos administradores e adultos da família.', '🔒');
    } else if (typeof alert === 'function') {
      alert('Acesso restrito aos responsáveis adultos.');
    }
    return false;
  }

  if (typeof document === 'undefined') return true;

  const fileInput = document.getElementById('scan-cupom-file');
  if (fileInput) fileInput.value = '';
  const st = document.getElementById('scan-cupom-status');
  if (st) st.textContent = '';
  const qrInput = document.getElementById('scan-cupom-qr-input');
  if (qrInput) qrInput.value = '';
  const textoInput = document.getElementById('scan-cupom-texto-input');
  if (textoInput) textoInput.value = '';

  const revEl = document.getElementById('scan-cupom-revisao');
  if (revEl) revEl.style.display = 'none';
  const capturaEl = document.getElementById('scan-cupom-captura');
  if (capturaEl) capturaEl.style.display = 'block';

  if (typeof setTabScanner === 'function') setTabScanner('foto');

  if (typeof openM === 'function') {
    openM('m-scanner-cupom');
  }
  return true;
}

function fecharScannerCupom() {
  if (typeof closeM === 'function') {
    closeM('m-scanner-cupom');
  }
}

function setTabScanner(tab) {
  if (typeof document === 'undefined') return;
  const tabs = ['foto', 'qr', 'texto'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tb-scan-${t}`);
    if (btn) btn.classList.toggle('sel', t === tab);
  });

  const pnlFoto = document.getElementById('scan-tab-arquivo');
  const pnlQr = document.getElementById('scan-tab-qr');
  const pnlTexto = document.getElementById('scan-tab-texto');

  if (pnlFoto) pnlFoto.style.display = tab === 'foto' ? 'block' : 'none';
  if (pnlQr) pnlQr.style.display = tab === 'qr' ? 'block' : 'none';
  if (pnlTexto) pnlTexto.style.display = tab === 'texto' ? 'block' : 'none';
}

async function aoSelecionarArquivoCupom(event) {
  if (typeof document === 'undefined') return;
  const file = event?.target?.files?.[0] || document.getElementById('scan-cupom-file')?.files?.[0];
  const st = document.getElementById('scan-cupom-status');
  if (!file) return;

  if (st) st.textContent = '🔎 Lendo e analisando documento...';

  try {
    const base64 = await fileToBase64(file);
    let dadosRascunho = null;

    if (apiKey || (S && S.apiKey)) {
      if (st) st.textContent = '🤖 Extraindo dados com Gemini Vision...';
      dadosRascunho = await chamarGeminiVisionCupom(base64, file.type || 'image/jpeg');
    }

    const res = processarDocumentoFiscal({
      tipoEntrada: file.type === 'application/pdf' ? 'pdf' : 'imagem',
      conteudo: file.name,
      mockVisionResultado: dadosRascunho
    });

    if (st) st.textContent = res.ok ? '✅ Leitura concluída! Confira os dados abaixo.' : '⚠️ Preencha manualmente os campos.';
  } catch (err) {
    console.error('Erro em aoSelecionarArquivoCupom:', err);
    if (st) st.textContent = '❌ Erro ao ler comprovante: ' + (err.message || 'Falha no processamento.');
  }
}

function processarQRCupomModal() {
  if (typeof document === 'undefined') return;
  const input = document.getElementById('scan-cupom-qr-input');
  const val = (input?.value || '').trim();
  if (!val) {
    if (typeof alert === 'function') alert('Cole a URL do QR Code da NFC-e ou chave de 44 dígitos.');
    return;
  }
  const res = processarDocumentoFiscal(val);
  if (!res.ok) {
    if (typeof alert === 'function') alert(res.mensagem || 'Erro ao processar QR Code.');
  }
}

function processarTextoCupomModal() {
  if (typeof document === 'undefined') return;
  const input = document.getElementById('scan-cupom-texto-input');
  const val = (input?.value || '').trim();
  if (!val) {
    if (typeof alert === 'function') alert('Cole o texto do cupom fiscal.');
    return;
  }
  const res = processarDocumentoFiscal(val);
  if (!res.ok) {
    if (typeof alert === 'function') alert(res.mensagem || 'Erro ao processar texto.');
  }
}

function renderRevisaoCupomModal() {
  if (typeof document === 'undefined') return;
  const rascunho = S.rascunhoCupomAtual;
  if (!rascunho) return;

  const revEl = document.getElementById('scan-cupom-revisao');
  if (!revEl) return;
  revEl.style.display = 'block';

  const capturaEl = document.getElementById('scan-cupom-captura');
  if (capturaEl) capturaEl.style.display = 'none';

  // 1. Dados básicos
  const estEl = document.getElementById('scan-rev-estabelecimento');
  if (estEl) estEl.value = rascunho.estabelecimento || '';

  const cnpjEl = document.getElementById('scan-rev-cnpj');
  if (cnpjEl) cnpjEl.value = rascunho.cnpj || '';

  const dataEl = document.getElementById('scan-rev-data');
  if (dataEl) dataEl.value = rascunho.data || new Date().toISOString().slice(0, 10);

  const horaEl = document.getElementById('scan-rev-hora');
  if (horaEl) horaEl.value = rascunho.hora || '12:00';

  const valEl = document.getElementById('scan-rev-valor-total');
  if (valEl) valEl.value = rascunho.valorTotal || 0;

  const catEl = document.getElementById('scan-rev-categoria');
  if (catEl && rascunho.categoriaSugerida) catEl.value = rascunho.categoriaSugerida;

  // 2. Titulares adultos
  const titEl = document.getElementById('scan-rev-titular');
  if (titEl) {
    const adultos = (S.membrosPerfil || []).filter(m => m.papel !== 'crianca');
    titEl.innerHTML = adultos.map(m => `<option value="${escapeHtml(m.nome)}">${escapeHtml(m.nome)}</option>`).join('');
    const ativo = obterMembroAtivo();
    if (ativo && ativo.papel !== 'crianca') titEl.value = ativo.nome;
  }

  // 3. Origem de pagamento sugerida
  const origEl = document.getElementById('scan-rev-origem-pagamento');
  if (origEl) {
    if (['VA', 'VR', 'credito', 'debito', 'pix', 'dinheiro'].includes(rascunho.formaPagamentoDetectada)) {
      if (rascunho.formaPagamentoDetectada === 'credito') origEl.value = 'cartao';
      else if (rascunho.formaPagamentoDetectada === 'debito' || rascunho.formaPagamentoDetectada === 'pix' || rascunho.formaPagamentoDetectada === 'dinheiro') origEl.value = 'salario';
      else origEl.value = rascunho.formaPagamentoDetectada;
    } else {
      origEl.value = 'auto';
    }
  }

  // 4. Cartões disponíveis
  const cartaoSel = document.getElementById('scan-rev-cartao-id');
  if (cartaoSel) {
    const cartoes = (S.cartoes || []).filter(c => c.ativo !== false);
    cartaoSel.innerHTML = cartoes.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.nome)} (Final ${escapeHtml(c.ultimosDigitos || '****')})</option>`).join('');
  }
  const boxCartao = document.getElementById('scan-rev-box-cartao');
  if (boxCartao) {
    boxCartao.style.display = origEl && origEl.value === 'cartao' ? 'block' : 'none';
  }

  // 5. Alerta de duplicidade
  const avisoDup = document.getElementById('scan-aviso-duplicado');
  const boxForcarDup = document.getElementById('scan-rev-box-forcar-duplicado');
  if (avisoDup) avisoDup.style.display = rascunho.duplicado ? 'block' : 'none';
  if (boxForcarDup) boxForcarDup.style.display = rascunho.duplicado ? 'block' : 'none';
  const chkForcar = document.getElementById('scan-rev-forcar-duplicado');
  if (chkForcar) chkForcar.checked = false;

  // 6. Alerta de baixa confiança (< 0.80)
  const avisoConf = document.getElementById('scan-aviso-baixa-confianca');
  const conf = rascunho.confiancaCampos || {};
  const camposBaixa = Object.entries(conf).filter(([k, v]) => Number(v) < 0.80);
  if (avisoConf) {
    if (camposBaixa.length > 0) {
      avisoConf.style.display = 'block';
      const nomes = camposBaixa.map(([k]) => {
        if (k === 'estabelecimento') return 'Estabelecimento';
        if (k === 'data') return 'Data';
        if (k === 'valorTotal') return 'Valor Total';
        if (k === 'formaPagamento') return 'Forma de Pagamento';
        return k;
      }).join(', ');
      avisoConf.innerHTML = `<strong>⚠️ Baixa confiança em (${escapeHtml(nomes)}) — confira os valores destacados em amarelo antes de salvar.</strong>`;
    } else {
      avisoConf.style.display = 'none';
    }
  }

  if (estEl) estEl.style.borderColor = (conf.estabelecimento < 0.80) ? 'var(--yellow)' : '';
  if (dataEl) dataEl.style.borderColor = (conf.data < 0.80) ? 'var(--yellow)' : '';
  if (valEl) valEl.style.borderColor = (conf.valorTotal < 0.80) ? 'var(--yellow)' : '';
  if (origEl) origEl.style.borderColor = (conf.formaPagamento < 0.80) ? 'var(--yellow)' : '';

  // 7. Lista de itens
  const itensContainer = document.getElementById('scan-rev-itens-container');
  if (itensContainer) {
    const itens = rascunho.itens || [];
    if (itens.length === 0) {
      itensContainer.innerHTML = `<p style="font-size:12px;color:var(--muted);margin:0;">Nenhum item discriminado no cupom.</p>`;
    } else {
      itensContainer.innerHTML = itens.map((it, idx) => `
        <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg2);padding:6px 8px;border-radius:6px;font-size:12px;">
          <div>
            <strong>${idx + 1}. ${escapeHtml(it.descricao)}</strong>
            <div style="font-size:10px;color:var(--muted);">${it.quantidade || 1} ${it.unidade || 'un'} × ${fmt(it.valorUnitario || it.valorTotal)}</div>
          </div>
          <div style="font-weight:700;">${fmt(it.valorTotal)}</div>
        </div>
      `).join('');
    }
  }

  // 8. Cruzamento com Lista de Compras
  const boxLista = document.getElementById('scan-rev-box-lista-compras');
  const listaContainer = document.getElementById('scan-rev-lista-compras-container');
  const matches = rascunho.itensCorrespondentesLista || [];
  if (boxLista && listaContainer) {
    if (matches.length > 0) {
      boxLista.style.display = 'block';
      listaContainer.innerHTML = matches.map(m => `
        <label style="display:flex;align-items:center;gap:8px;font-size:12px;background:var(--bg2);padding:6px 8px;border-radius:6px;cursor:pointer;">
          <input type="checkbox" class="chk-match-lista-compras" value="${escapeHtml(m.itemListaId)}" checked style="width:16px;height:16px;accent-color:var(--green);"/>
          <span>Dar baixa em <strong>${escapeHtml(m.itemNome)}</strong> (${escapeHtml(m.nomeLista)})</span>
        </label>
      `).join('');
    } else {
      boxLista.style.display = 'none';
      listaContainer.innerHTML = '';
    }
  }

  // 9. Atualiza preview
  atualizarPreviewDivisaoCupom();
}

function aoMudarOrigemPagamentoCupom() {
  const sel = document.getElementById('scan-rev-origem-pagamento')?.value;
  const boxCartao = document.getElementById('scan-rev-box-cartao');
  if (boxCartao) {
    boxCartao.style.display = sel === 'cartao' ? 'block' : 'none';
  }
  atualizarPreviewDivisaoCupom();
}

function atualizarPreviewDivisaoCupom() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('scan-rev-preview-beneficio');
  if (!container) return;

  const val = parseFloat(document.getElementById('scan-rev-valor-total')?.value) || 0;
  const desc = document.getElementById('scan-rev-estabelecimento')?.value || '';
  const titular = document.getElementById('scan-rev-titular')?.value || '';
  const cat = document.getElementById('scan-rev-categoria')?.value || 'mercado';
  const origemSel = document.getElementById('scan-rev-origem-pagamento')?.value || 'auto';

  if (val <= 0) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  if (origemSel === 'cartao') {
    container.style.display = 'block';
    container.innerHTML = `<span>💳 Lançamento integral em Fatura de Cartão de Crédito (${fmt(val)}).</span>`;
    return;
  }

  const divisao = calcularDivisaoPagamentoBeneficio({
    valorTotal: val,
    descricao: desc,
    titular,
    categoria: cat,
    forcarOrigem: origemSel
  });

  if (divisao.valorPagoBeneficio > 0 || divisao.split) {
    container.style.display = 'block';
    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span>💳 Divisão do Cupom:</span>
        <strong style="color:var(--green);">${escapeHtml(divisao.descricaoSplit)}</strong>
      </div>
      <p style="font-size:11px;color:var(--muted);margin:4px 0 0;">O valor em benefício (${fmt(divisao.valorPagoBeneficio)}) não consumirá o salário nem caixa da família.</p>
    `;
  } else if (origemSel !== 'auto' && origemSel !== 'salario') {
    container.style.display = 'block';
    container.innerHTML = `<span style="color:var(--yellow);">⚠️ Saldo do ${escapeHtml(origemSel)} zerado ou insuficiente. Valor debitado 100% no Salário.</span>`;
  } else {
    container.style.display = 'block';
    container.innerHTML = `<span style="color:var(--muted);">Débito integral em Conta Salário (${fmt(val)}).</span>`;
  }
}

function confirmarLancamentoCupomModal() {
  if (typeof document === 'undefined') return;
  const rascunho = S.rascunhoCupomAtual;
  if (!rascunho) {
    if (typeof alert === 'function') alert('Nenhum rascunho ativo.');
    return;
  }

  const est = (document.getElementById('scan-rev-estabelecimento')?.value || '').trim();
  const cnpj = (document.getElementById('scan-rev-cnpj')?.value || '').trim();
  const data = document.getElementById('scan-rev-data')?.value || '';
  const hora = document.getElementById('scan-rev-hora')?.value || '12:00';
  const val = parseFloat(document.getElementById('scan-rev-valor-total')?.value) || 0;
  const cat = document.getElementById('scan-rev-categoria')?.value || 'mercado';
  const titular = document.getElementById('scan-rev-titular')?.value || '';
  const origem = document.getElementById('scan-rev-origem-pagamento')?.value || 'auto';
  const cartaoId = document.getElementById('scan-rev-cartao-id')?.value || null;
  const forcarDuplicado = document.getElementById('scan-rev-forcar-duplicado')?.checked || false;

  const chks = document.querySelectorAll('.chk-match-lista-compras:checked');
  const itensListaParaComprar = Array.from(chks).map(c => c.value);

  if (!est) {
    if (typeof alert === 'function') alert('Informe o nome do estabelecimento.');
    return;
  }
  if (val <= 0) {
    if (typeof alert === 'function') alert('Informe o valor total do cupom.');
    return;
  }

  rascunho.estabelecimento = est;
  rascunho.cnpj = cnpj;
  rascunho.data = data;
  rascunho.hora = hora;
  rascunho.valorTotal = val;
  rascunho.categoriaSugerida = cat;
  rascunho.titular = titular;
  rascunho.formaPagamentoDetectada = origem;

  const res = confirmarLancamentoCupomFiscal({
    rascunhoOverride: rascunho,
    estabelecimento: est,
    valorTotal: val,
    data,
    hora,
    categoria: cat,
    titular,
    origemPagamento: origem,
    cartaoId,
    forcarDuplicado,
    itensListaParaComprar
  });

  if (res.ok) {
    if (typeof exibirToastNotificacao === 'function') {
      exibirToastNotificacao(`Cupom de ${est} (${fmt(val)}) lançado com sucesso!`, '🧾');
    }
    fecharScannerCupom();
  } else {
    if (res.motivo === 'cupom_duplicado') {
      if (typeof alert === 'function') {
        alert('Este cupom é duplicado! Marque a opção "Confirmar lançamento mesmo sendo cupom duplicado" se deseja registrar novamente.');
      }
      const boxForcar = document.getElementById('scan-rev-box-forcar-duplicado');
      if (boxForcar) boxForcar.style.display = 'block';
    } else {
      if (typeof alert === 'function') alert(res.mensagem || 'Erro ao confirmar lançamento do cupom.');
    }
  }
}

function cancelarRevisaoCupomModal() {
  S.rascunhoCupomAtual = null;
  if (typeof document === 'undefined') return;
  const revEl = document.getElementById('scan-cupom-revisao');
  if (revEl) revEl.style.display = 'none';
  const capturaEl = document.getElementById('scan-cupom-captura');
  if (capturaEl) capturaEl.style.display = 'block';
  const st = document.getElementById('scan-cupom-status');
  if (st) st.textContent = '';
  const fileInput = document.getElementById('scan-cupom-file');
  if (fileInput) fileInput.value = '';
}

function abrirDetalheCupomFiscal(cupomId) {
  const membroAtivo = obterMembroAtivo();
  if (membroAtivo && membroAtivo.papel === 'crianca') {
    if (typeof alert === 'function') alert('Acesso restrito aos responsáveis adultos.');
    return { ok: false, motivo: 'perfil_crianca_bloqueado' };
  }

  const cupom = (S.cuponsFiscais || []).find(c => c.id === cupomId);
  if (!cupom) {
    if (typeof alert === 'function') alert('Cupom fiscal não encontrado.');
    return { ok: false, motivo: 'cupom_nao_encontrado' };
  }

  if (typeof document !== 'undefined') {
    const container = document.getElementById('detalhe-cupom-conteudo');
    if (container) {
      const dataFmt = cupom.data ? cupom.data.slice(0, 10).split('-').reverse().join('/') : '';
      const horaFmt = cupom.hora || '';
      const chaveHtml = cupom.chaveAcesso
        ? `<div style="background:var(--bg3);padding:8px;border-radius:6px;margin:8px 0;word-break:break-all;font-family:monospace;font-size:11px;">
             <strong>Chave de Acesso:</strong> ${escapeHtml(cupom.chaveAcesso)}
           </div>`
        : '';

      const itensHtml = (cupom.itens || []).map((it, idx) => `
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;">
          <div>
            <strong>${idx + 1}. ${escapeHtml(it.descricao)}</strong>
            <div style="font-size:11px;color:var(--muted);">${it.quantidade || 1} ${it.unidade || 'un'} × ${fmt(it.valorUnitario || it.valorTotal)}</div>
          </div>
          <div style="font-weight:700;">${fmt(it.valorTotal)}</div>
        </div>
      `).join('');

      container.innerHTML = `
        <div style="margin-bottom:12px;">
          <h4 style="margin:0 0 2px;font-size:16px;">${escapeHtml(cupom.estabelecimento)}</h4>
          <p style="font-size:12px;color:var(--muted);margin:0;">CNPJ: ${escapeHtml(cupom.cnpj || 'Não informado')} • ${dataFmt} ${horaFmt}</p>
        </div>
        ${chaveHtml}
        <div style="margin:12px 0;">
          <p style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:6px;">Itens da Nota (${(cupom.itens || []).length})</p>
          <div style="max-height:220px;overflow-y:auto;">
            ${itensHtml || '<p style="color:var(--muted);font-size:12px;">Nenhum item discriminado.</p>'}
          </div>
        </div>
        <div style="background:var(--bg3);padding:10px;border-radius:8px;margin-top:12px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
            <span>Forma de Pagamento:</span>
            <strong>${escapeHtml(cupom.formaPagamento)}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;color:var(--green);">
            <span>Valor Total:</span>
            <span>${fmt(cupom.valorTotal)}</span>
          </div>
        </div>
      `;
    }

    if (typeof openM === 'function') {
      openM('m-detalhe-cupom');
    }
  }

  return { ok: true, cupom };
}

function fecharDetalheCupomModal() {
  if (typeof closeM === 'function') {
    closeM('m-detalhe-cupom');
  }
}

// ============================================================================
// SUPER-APP FAMILIAR v2.0 - ETAPA 6: MENSAGENS DA FAMÍLIA (CHAT & MURAL FIXADO)
// E CONTATOS COMPARTILHADOS DA FAMÍLIA (Seções 4.4 e 4.16)
// ============================================================================

/**
 * Aliases de conformidade com contratos de governança do Time Stella.
 * Garante compatibilidade semântica com ADRs e documentações de sincronização e atividade.
 */
function enfileirarSync(tabela, operacao, dados) {
  try {
    return adicionarNaFilaSync(tabela, operacao, dados);
  } catch (err) {
    console.error('Erro em enfileirarSync:', err);
    return null;
  }
}

function registrarAtividadeFamilia(dados) {
  try {
    return registrarNotificacaoFamilia(dados);
  } catch (err) {
    console.error('Erro em registrarAtividadeFamilia:', err);
    return null;
  }
}

// ----------------------------------------------------------------------------
// MÓDULO 4.4: MENSAGENS DA FAMÍLIA & CHAT COM RECADOS FIXADOS NO MURAL
// ----------------------------------------------------------------------------

let fotoAnexoRascunhoChat = null;

/**
 * Retorna todas as mensagens do círculo especificado (ou do círculo ativo).
 */
function obterMensagensFamilia(circuloId) {
  try {
    const cId = circuloId || S.circuloAtivoId || 'circ_1';
    return (S.mensagensFamilia || []).filter(m => m.circuloId === cId);
  } catch (err) {
    console.error('Erro ao obter mensagens da família:', err);
    return [];
  }
}

/**
 * Retorna as mensagens fixadas no mural do círculo ativo,
 * ordenadas da mais recente para a mais antiga.
 */
function obterMensagensFixadasFamilia(circuloId) {
  try {
    return obterMensagensFamilia(circuloId)
      .filter(m => !!m.fixada)
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
  } catch (err) {
    console.error('Erro ao obter mensagens fixadas:', err);
    return [];
  }
}

/**
 * Calcula a quantidade de mensagens não lidas pelo membro especificado.
 */
function obterContagemMensagensNaoLidas(membroId) {
  try {
    const mId = membroId || S.membroAtivoId || 'm_1';
    const cId = S.circuloAtivoId || 'circ_1';
    return (S.mensagensFamilia || []).filter(m => {
      if (m.circuloId !== cId) return false;
      const lidos = Array.isArray(m.lidoPorIds) ? m.lidoPorIds : [];
      return !lidos.includes(mId);
    }).length;
  } catch (err) {
    console.error('Erro ao calcular mensagens não lidas:', err);
    return 0;
  }
}

/**
 * Marca todas as mensagens do círculo ativo como lidas pelo membro especificado.
 */
function marcarMensagensComoLidas(membroId) {
  try {
    const mId = membroId || S.membroAtivoId || 'm_1';
    const cId = S.circuloAtivoId || 'circ_1';
    let alterado = false;

    (S.mensagensFamilia || []).forEach(m => {
      if (m.circuloId === cId) {
        if (!Array.isArray(m.lidoPorIds)) {
          m.lidoPorIds = [];
        }
        if (!m.lidoPorIds.includes(mId)) {
          m.lidoPorIds.push(mId);
          alterado = true;
        }
      }
    });

    if (alterado) {
      save();
      if (typeof renderMuralInicio === 'function') {
        renderMuralInicio();
      }
      atualizarBadgesHeader();
    }
    return true;
  } catch (err) {
    console.error('Erro ao marcar mensagens como lidas:', err);
    return false;
  }
}

/**
 * Envia uma nova mensagem no chat familiar.
 * Acesso universal: todos os papéis da família (incluindo perfil 'crianca') podem enviar.
 * Sanitiza o conteúdo contra XSS, registra autor, gera ID único e enfileira na fila offline.
 */
function enviarMensagemFamilia(params = {}) {
  try {
    const textoOriginal = params.texto != null ? String(params.texto).trim() : '';
    const anexoFotoUrl = params.anexoFotoUrl || null;
    const fixarNoTopo = !!params.fixarNoTopo;

    if (!textoOriginal && !anexoFotoUrl) {
      if (typeof alert === 'function') {
        alert('Por favor, escreva um recado ou selecione uma foto.');
      }
      return { ok: false, motivo: 'mensagem_vazia' };
    }

    const autor = obterMembroAtivo() || {
      id: 'm_1',
      nome: 'Alex',
      cor: '#5581E3',
      iniciais: 'AL',
      papel: 'admin'
    };
    const cId = S.circuloAtivoId || 'circ_1';

    const novaMensagem = {
      id: 'msg_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
      circuloId: cId,
      membroId: autor.id,
      membroNome: autor.nome,
      membroCor: autor.cor || '#5581E3',
      membroIniciais: autor.iniciais || autor.nome.slice(0, 2).toUpperCase(),
      texto: escapeHtml(textoOriginal),
      anexoFotoUrl: anexoFotoUrl,
      fixada: fixarNoTopo,
      lidoPorIds: [autor.id],
      reacoes: {},
      criadoEm: new Date().toISOString()
    };

    if (!Array.isArray(S.mensagensFamilia)) {
      S.mensagensFamilia = [];
    }
    S.mensagensFamilia.push(novaMensagem);

    // Registra no feed familiar e central de notificações
    registrarNotificacaoFamilia({
      tipo: 'mensagens',
      titulo: fixarNoTopo ? '📌 Novo Recado no Mural' : '💬 Mensagem no Chat Familiar',
      texto: `${autor.nome}: ${textoOriginal.slice(0, 60)}`,
      icone: fixarNoTopo ? '📌' : '💬'
    });

    // Enfileira na mutação offline (Outbox Pattern)
    adicionarNaFilaSync('mensagens', 'insert', novaMensagem);

    save();

    if (typeof document !== 'undefined') {
      renderChatFamiliaModal();
      renderMuralInicio();
      atualizarBadgesHeader();
    }

    return { ok: true, mensagem: novaMensagem };
  } catch (err) {
    console.error('Erro ao enviar mensagem da família:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

/**
 * Alterna a fixação de uma mensagem no topo do mural.
 */
function alternarFixarMensagemFamilia(msgId) {
  try {
    const msg = (S.mensagensFamilia || []).find(m => m.id === msgId);
    if (!msg) {
      return { ok: false, motivo: 'mensagem_nao_encontrada' };
    }

    msg.fixada = !msg.fixada;

    if (msg.fixada) {
      const textoLimpo = (msg.texto || '').replace(/<[^>]*>/g, '').slice(0, 60);
      registrarNotificacaoFamilia({
        tipo: 'mensagens',
        titulo: '📌 Recado Fixado no Mural',
        texto: textoLimpo || 'Mensagem fixada no mural da família',
        icone: '📌'
      });
    }

    adicionarNaFilaSync('mensagens', 'update', { id: msg.id, fixada: msg.fixada });
    save();

    if (typeof document !== 'undefined') {
      renderChatFamiliaModal();
      renderMuralInicio();
    }

    return { ok: true, fixada: msg.fixada };
  } catch (err) {
    console.error('Erro ao alternar fixação da mensagem:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

/**
 * Adiciona ou remove uma reação emoji a uma mensagem (comportamento de toggle).
 */
function reagirMensagemFamilia(msgId, emoji) {
  try {
    const msg = (S.mensagensFamilia || []).find(m => m.id === msgId);
    if (!msg) {
      return { ok: false, motivo: 'mensagem_nao_encontrada' };
    }
    if (!emoji || typeof emoji !== 'string') {
      return { ok: false, motivo: 'emoji_invalido' };
    }

    const membro = obterMembroAtivo();
    const mId = membro ? membro.id : (S.membroAtivoId || 'm_1');

    if (!msg.reacoes || typeof msg.reacoes !== 'object') {
      msg.reacoes = {};
    }
    if (!Array.isArray(msg.reacoes[emoji])) {
      msg.reacoes[emoji] = [];
    }

    const pos = msg.reacoes[emoji].indexOf(mId);
    if (pos >= 0) {
      // Toggle off: remove a reação se o membro já reagiu
      msg.reacoes[emoji].splice(pos, 1);
      if (msg.reacoes[emoji].length === 0) {
        delete msg.reacoes[emoji];
      }
    } else {
      // Toggle on: adiciona a reação do membro
      msg.reacoes[emoji].push(mId);
    }

    adicionarNaFilaSync('mensagens', 'update', { id: msg.id, reacoes: msg.reacoes });
    save();

    if (typeof document !== 'undefined') {
      renderChatFamiliaModal();
    }

    return { ok: true, reacoes: msg.reacoes };
  } catch (err) {
    console.error('Erro ao reagir à mensagem:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

/**
 * Exclui uma mensagem do chat e do mural.
 */
function excluirMensagemFamilia(msgId) {
  try {
    const idx = (S.mensagensFamilia || []).findIndex(m => m.id === msgId);
    if (idx < 0) {
      return { ok: false, motivo: 'mensagem_nao_encontrada' };
    }

    S.mensagensFamilia.splice(idx, 1);
    adicionarNaFilaSync('mensagens', 'delete', { id: msgId });
    save();

    if (typeof document !== 'undefined') {
      renderChatFamiliaModal();
      renderMuralInicio();
      atualizarBadgesHeader();
    }

    return { ok: true };
  } catch (err) {
    console.error('Erro ao excluir mensagem:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

// ----------------------------------------------------------------------------
// MÓDULO 4.16: CONTATOS COMPARTILHADOS DA FAMÍLIA (AGENDA & EMERGÊNCIAS)
// ----------------------------------------------------------------------------

const CATEGORIAS_CONTATO_FAMILIA = [
  { id: 'emergencia', nome: 'Emergência', icone: '🚨', cor: '#EF4444' },
  { id: 'saude', nome: 'Saúde & Médicos', icone: '🏥', cor: '#10B981' },
  { id: 'escola', nome: 'Escola & Filhos', icone: '🎒', cor: '#8B5CF6' },
  { id: 'casa', nome: 'Serviços da Casa', icone: '🏠', cor: '#F59E0B' },
  { id: 'familia', nome: 'Família & Pessoal', icone: '👨‍👩‍👧‍👦', cor: '#5581E3' },
  { id: 'outros', nome: 'Outros', icone: '📦', cor: '#64748B' }
];

let filtroCategoriaContatoAtivo = 'todos';

/**
 * Filtra contatos da família no círculo ativo com ordenação prioritária de emergência.
 */
function filtrarContatosFamilia(filtros = {}) {
  try {
    const cId = S.circuloAtivoId || 'circ_1';
    const categoria = filtros.categoria || 'todos';
    const busca = (filtros.busca || '').trim().toLowerCase();
    const apenasEmergencia = !!filtros.apenasEmergencia;

    let contatos = (S.contatosFamilia || []).filter(c => c.circuloId === cId);

    if (apenasEmergencia) {
      contatos = contatos.filter(c => !!c.emergencia);
    }

    if (categoria && categoria !== 'todos') {
      contatos = contatos.filter(c => c.categoria === categoria);
    }

    if (busca) {
      contatos = contatos.filter(c => {
        const n = (c.nome || '').toLowerCase();
        const esp = (c.especialidade || '').toLowerCase();
        const tel = (c.telefone || '').replace(/\D/g, '');
        const telFmt = (c.telefone || '').toLowerCase();
        const wa = (c.whatsapp || '').replace(/\D/g, '');
        const em = (c.email || '').toLowerCase();
        const end = (c.endereco || '').toLowerCase();
        const obs = (c.observacoes || '').toLowerCase();
        const bDig = busca.replace(/\D/g, '');

        return n.includes(busca) ||
               esp.includes(busca) ||
               telFmt.includes(busca) ||
               (bDig && tel.includes(bDig)) ||
               (bDig && wa.includes(bDig)) ||
               em.includes(busca) ||
               end.includes(busca) ||
               obs.includes(busca);
      });
    }

    // Regra determinística: Contatos de Emergência aparecem no topo absoluto,
    // seguidos por ordenação alfabética pelo nome.
    return contatos.sort((a, b) => {
      if (a.emergencia && !b.emergencia) return -1;
      if (!a.emergencia && b.emergencia) return 1;
      return (a.nome || '').localeCompare(b.nome || '', 'pt-BR');
    });
  } catch (err) {
    console.error('Erro ao filtrar contatos da família:', err);
    return [];
  }
}

/**
 * Salva ou atualiza um contato compartilhado da família.
 * Acesso universal: inclusive perfil 'crianca' pode consultar e utilizar discagem rápida.
 */
function salvarContatoFamilia(dados = {}) {
  try {
    const nome = dados.nome != null ? String(dados.nome).trim() : '';
    const telefone = dados.telefone != null ? String(dados.telefone).trim() : '';
    const whatsapp = dados.whatsapp != null ? String(dados.whatsapp).trim() : '';
    const email = dados.email != null ? String(dados.email).trim() : '';

    if (!nome) {
      if (typeof alert === 'function') {
        alert('O nome do contato ou da instituição é obrigatório.');
      }
      return { ok: false, motivo: 'nome_obrigatorio' };
    }

    if (!telefone && !whatsapp && !email) {
      if (typeof alert === 'function') {
        alert('Informe pelo menos um número de telefone, WhatsApp ou endereço de e-mail.');
      }
      return { ok: false, motivo: 'meio_contato_obrigatorio' };
    }

    if (!Array.isArray(S.contatosFamilia)) {
      S.contatosFamilia = [];
    }

    const cId = S.circuloAtivoId || 'circ_1';
    const membroAtivo = obterMembroAtivo();
    const agoraIso = new Date().toISOString();
    const ehEmergencia = !!dados.emergencia || dados.categoria === 'emergencia';

    let contato = null;
    let operacao = 'insert';

    if (dados.id) {
      const idx = S.contatosFamilia.findIndex(c => c.id === dados.id);
      if (idx >= 0) {
        contato = S.contatosFamilia[idx];
        contato.nome = nome;
        contato.categoria = dados.categoria || contato.categoria || 'outros';
        contato.especialidade = dados.especialidade != null ? String(dados.especialidade).trim() : '';
        contato.telefone = telefone;
        contato.whatsapp = whatsapp;
        contato.email = email;
        contato.endereco = dados.endereco != null ? String(dados.endereco).trim() : '';
        contato.observacoes = dados.observacoes != null ? String(dados.observacoes).trim() : '';
        contato.emergencia = ehEmergencia;
        contato.atualizadoEm = agoraIso;
        operacao = 'update';
      }
    }

    if (!contato) {
      contato = {
        id: dados.id || ('cont_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7)),
        circuloId: cId,
        nome,
        categoria: dados.categoria || (ehEmergencia ? 'emergencia' : 'outros'),
        especialidade: dados.especialidade != null ? String(dados.especialidade).trim() : '',
        telefone,
        whatsapp,
        email,
        endereco: dados.endereco != null ? String(dados.endereco).trim() : '',
        observacoes: dados.observacoes != null ? String(dados.observacoes).trim() : '',
        emergencia: ehEmergencia,
        criadoPor: membroAtivo ? membroAtivo.id : (S.membroAtivoId || 'm_1'),
        criadoEm: agoraIso,
        atualizadoEm: agoraIso
      };
      S.contatosFamilia.push(contato);
    }

    adicionarNaFilaSync('contatos', operacao, contato);

    registrarNotificacaoFamilia({
      tipo: 'geral',
      titulo: ehEmergencia ? '🚨 Contato de Emergência Salvo' : '📞 Contato da Família Salvo',
      texto: `${contato.nome} (${contato.especialidade || contato.categoria})`,
      icone: ehEmergencia ? '🚨' : '📞'
    });

    save();

    if (typeof document !== 'undefined') {
      renderContatosFamiliaModal();
      renderMuralInicio();
    }

    return { ok: true, contato };
  } catch (err) {
    console.error('Erro ao salvar contato da família:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

/**
 * Exclui um contato compartilhado da família.
 */
function excluirContatoFamilia(contatoId) {
  try {
    const idx = (S.contatosFamilia || []).findIndex(c => c.id === contatoId);
    if (idx < 0) {
      return { ok: false, motivo: 'contato_nao_encontrado' };
    }

    S.contatosFamilia.splice(idx, 1);
    adicionarNaFilaSync('contatos', 'delete', { id: contatoId });
    save();

    if (typeof document !== 'undefined') {
      renderContatosFamiliaModal();
      renderMuralInicio();
    }

    return { ok: true };
  } catch (err) {
    console.error('Erro ao excluir contato:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

// ----------------------------------------------------------------------------
// INTERFACE & CONTROLADORES DE MODAL (DOM)
// ----------------------------------------------------------------------------

function renderChatFamiliaModal() {
  if (typeof document === 'undefined') return;

  const fixadosContainer = document.getElementById('chat-familia-fixados-container');
  const msgsContainer = document.getElementById('chat-familia-mensagens-container');
  if (!msgsContainer) return;

  const mAtivo = obterMembroAtivo() || { id: 'm_1', nome: 'Alex', cor: '#5581E3' };
  const fixadas = obterMensagensFixadasFamilia();
  const todasMsgs = obterMensagensFamilia();

  // 1. Renderiza recados fixados no topo do chat
  if (fixadosContainer) {
    if (fixadas.length === 0) {
      fixadosContainer.style.display = 'none';
      fixadosContainer.innerHTML = '';
    } else {
      fixadosContainer.style.display = 'block';
      fixadosContainer.innerHTML = `
        <div style="font-size:11px; font-weight:800; color:var(--yellow); text-transform:uppercase; margin-bottom:6px; display:flex; align-items:center; gap:4px;">
          <span>📌</span> Recados Fixados no Mural (${fixadas.length})
        </div>
        ${fixadas.map(f => `
          <div class="chat-recado-fixado-card">
            <div style="flex:1;">
              <div style="font-size:11px; font-weight:700; color:var(--text); margin-bottom:2px;">
                <span style="color:${f.membroCor};">${escapeHtml(f.membroNome)}</span>
                <span style="color:var(--muted); font-size:10px; font-weight:normal; margin-left:6px;">${new Date(f.criadoEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div style="font-size:12px; color:var(--text);">${f.texto}</div>
              ${f.anexoFotoUrl ? `
                <div style="margin-top:6px;">
                  <img src="${f.anexoFotoUrl}" style="max-height:80px; border-radius:6px; object-fit:cover;"/>
                </div>
              ` : ''}
            </div>
            <button type="button" class="btn" style="padding:4px 8px; font-size:11px; flex-shrink:0;" title="Desfixar recado" onclick="alternarFixarMensagemFamilia('${f.id}')">
              📌 Desfixar
            </button>
          </div>
        `).join('')}
      `;
    }
  }

  // 2. Renderiza lista rolante de mensagens
  if (todasMsgs.length === 0) {
    msgsContainer.innerHTML = `
      <div style="text-align:center; padding:36px 16px; color:var(--muted); margin:auto;">
        <div style="font-size:36px; margin-bottom:8px;">💬</div>
        <p style="font-weight:700; font-size:15px; margin:0 0 4px; color:var(--text);">Nenhum recado ainda</p>
        <p style="font-size:12px; margin:0;">Envie uma mensagem, foto ou recado para a família!</p>
      </div>
    `;
    return;
  }

  msgsContainer.innerHTML = todasMsgs.map(msg => {
    const souAutor = msg.membroId === mAtivo.id;
    const horaFmt = new Date(msg.criadoEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const reacoesKeys = msg.reacoes ? Object.keys(msg.reacoes) : [];

    return `
      <div class="chat-msg-row ${souAutor ? 'minha' : ''}">
        ${!souAutor ? `
          <div style="width:32px; height:32px; border-radius:50%; background:${msg.membroCor || '#5581E3'}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; flex-shrink:0;">
            ${escapeHtml(msg.membroIniciais || 'FM')}
          </div>
        ` : ''}

        <div class="chat-bubble ${souAutor ? 'chat-bubble-minha' : 'chat-bubble-outra'}">
          ${!souAutor ? `
            <div style="font-size:11px; font-weight:800; color:${msg.membroCor || 'var(--blue)'}; margin-bottom:3px;">
              ${escapeHtml(msg.membroNome)}
            </div>
          ` : ''}

          ${msg.anexoFotoUrl ? `
            <div style="margin-bottom:6px;">
              <img src="${msg.anexoFotoUrl}" style="max-width:100%; max-height:220px; border-radius:8px; display:block; cursor:pointer;" onclick="window.open('${msg.anexoFotoUrl}')"/>
            </div>
          ` : ''}

          <div>${msg.texto}</div>

          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:6px; font-size:10px; opacity:0.85;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span>${horaFmt}</span>
              ${msg.fixada ? '<span title="Fixado no Mural">📌</span>' : ''}
            </div>

            <!-- MENU DE AÇÕES RÁPIDAS (REAGIR, FIXAR, EXCLUIR) -->
            <div style="display:flex; align-items:center; gap:4px;">
              <button type="button" style="background:transparent; border:none; cursor:pointer; font-size:12px; padding:0 2px;" title="Reagir" onclick="reagirMensagemFamilia('${msg.id}', '❤️')">❤️</button>
              <button type="button" style="background:transparent; border:none; cursor:pointer; font-size:12px; padding:0 2px;" title="Reagir" onclick="reagirMensagemFamilia('${msg.id}', '👍')">👍</button>
              <button type="button" style="background:transparent; border:none; cursor:pointer; font-size:12px; padding:0 2px;" title="${msg.fixada ? 'Desfixar' : 'Fixar no Mural'}" onclick="alternarFixarMensagemFamilia('${msg.id}')">📌</button>
              <button type="button" style="background:transparent; border:none; cursor:pointer; font-size:11px; padding:0 2px; color:inherit; opacity:0.7;" title="Excluir" onclick="confirmarExcluirMensagemModal('${msg.id}')">🗑️</button>
            </div>
          </div>

          <!-- LISTA DE REAÇÕES EXISTENTES -->
          ${reacoesKeys.length > 0 ? `
            <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px;">
              ${reacoesKeys.map(emoji => {
                const membrosReagiram = msg.reacoes[emoji] || [];
                const euReagi = membrosReagiram.includes(mAtivo.id);
                return `
                  <span class="chat-reacao-badge ${euReagi ? 'minha' : ''}" onclick="reagirMensagemFamilia('${msg.id}', '${emoji}')" title="${membrosReagiram.length} reação(ões)">
                    ${emoji} ${membrosReagiram.length}
                  </span>
                `;
              }).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Rola suavemente até o final da conversa
  setTimeout(() => {
    try {
      msgsContainer.scrollTop = msgsContainer.scrollHeight;
    } catch (err) {
      console.error('Erro ao rolar chat:', err);
    }
  }, 50);
}

function abrirModalChatFamilia() {
  if (typeof document === 'undefined') return;

  marcarMensagensComoLidas();
  renderChatFamiliaModal();

  if (typeof openM === 'function') {
    openM('m-chat-familia');
  }

  const inputTxt = document.getElementById('chat-familia-input-texto');
  if (inputTxt) {
    setTimeout(() => inputTxt.focus(), 200);
  }
}

function fecharModalChatFamilia() {
  if (typeof closeM === 'function') {
    closeM('m-chat-familia');
  }
  removerFotoAnexoChat();
}

function aoSelecionarFotoChat(event) {
  if (typeof document === 'undefined') return;
  const file = event && event.target && event.target.files ? event.target.files[0] : null;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    fotoAnexoRascunhoChat = e.target.result;
    const previewBox = document.getElementById('chat-familia-foto-preview-box');
    const previewImg = document.getElementById('chat-familia-foto-preview-img');
    if (previewBox && previewImg) {
      previewImg.src = fotoAnexoRascunhoChat;
      previewBox.style.display = 'flex';
    }
  };
  reader.onerror = function(err) {
    console.error('Erro ao ler foto para chat:', err);
    if (typeof alert === 'function') alert('Não foi possível carregar a imagem selecionada.');
  };
  reader.readAsDataURL(file);
}

function removerFotoAnexoChat() {
  fotoAnexoRascunhoChat = null;
  if (typeof document === 'undefined') return;
  const previewBox = document.getElementById('chat-familia-foto-preview-box');
  const fileInput = document.getElementById('chat-familia-input-foto');
  if (previewBox) previewBox.style.display = 'none';
  if (fileInput) fileInput.value = '';
}

function enviarMensagemChatModal() {
  if (typeof document === 'undefined') return;

  const inputTxt = document.getElementById('chat-familia-input-texto');
  const checkFixar = document.getElementById('chat-familia-check-fixar');

  const texto = inputTxt ? inputTxt.value : '';
  const fixarNoTopo = checkFixar ? checkFixar.checked : false;

  const res = enviarMensagemFamilia({
    texto,
    anexoFotoUrl: fotoAnexoRascunhoChat,
    fixarNoTopo
  });

  if (res.ok) {
    if (inputTxt) inputTxt.value = '';
    if (checkFixar) checkFixar.checked = false;
    removerFotoAnexoChat();
  }
}

function confirmarExcluirMensagemModal(msgId) {
  if (typeof confirm === 'function') {
    if (!confirm('Deseja realmente apagar esta mensagem do chat?')) return;
  }
  excluirMensagemFamilia(msgId);
}

// ----------------------------------------------------------------------------
// INTERFACE DE CONTATOS COMPARTILHADOS
// ----------------------------------------------------------------------------

function renderContatosFamiliaModal() {
  if (typeof document === 'undefined') return;

  const container = document.getElementById('contatos-lista-container');
  const pillsEl = document.getElementById('contatos-filtros-pills');
  const buscaInput = document.getElementById('contatos-busca-input');

  const busca = buscaInput ? buscaInput.value : '';
  const contatos = filtrarContatosFamilia({
    categoria: filtroCategoriaContatoAtivo,
    busca
  });

  // 1. Renderiza pílulas de filtro
  if (pillsEl) {
    pillsEl.innerHTML = [
      { id: 'todos', nome: 'Todos', icone: '👥' },
      ...CATEGORIAS_CONTATO_FAMILIA
    ].map(cat => {
      const isSel = filtroCategoriaContatoAtivo === cat.id;
      return `
        <button type="button" class="filtro-pill ${isSel ? 'sel' : ''}" style="${isSel ? 'background:var(--primary);color:#fff;' : ''}; font-size:11px; white-space:nowrap;" onclick="filtrarCategoriaContatosModal('${cat.id}')">
          ${cat.icone} ${cat.nome}
        </button>
      `;
    }).join('');
  }

  // 2. Renderiza lista de contatos
  if (!container) return;

  if (contatos.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:32px 16px; color:var(--muted);">
        <p style="font-size:32px; margin-bottom:8px;">🔍</p>
        <p style="font-weight:700; font-size:14px; margin-bottom:4px; color:var(--text);">Nenhum contato encontrado</p>
        <p style="font-size:12px; margin:0 0 14px;">Adicione telefones de emergência, médicos, escola ou serviços da casa.</p>
        <button type="button" class="btn btn-primary" onclick="abrirModalNovoContato()">+ Adicionar Contato</button>
      </div>
    `;
    return;
  }

  container.innerHTML = contatos.map(c => {
    const catDef = CATEGORIAS_CONTATO_FAMILIA.find(k => k.id === c.categoria) || { nome: c.categoria, icone: '📞', cor: '#64748B' };
    const telDig = (c.telefone || '').replace(/\D/g, '');
    const waDig = (c.whatsapp || '').replace(/\D/g, '');

    return `
      <div class="contato-card ${c.emergencia ? 'emergencia' : ''}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:18px;">${catDef.icone}</span>
              <h4 style="margin:0; font-size:15px; font-weight:800; color:var(--text);">${escapeHtml(c.nome)}</h4>
            </div>
            ${c.especialidade ? `
              <p style="margin:2px 0 0 24px; font-size:12px; color:var(--muted);">${escapeHtml(c.especialidade)}</p>
            ` : ''}
          </div>

          <div style="display:flex; align-items:center; gap:6px;">
            ${c.emergencia ? `
              <span class="badge-emergencia">🚨 EMERGÊNCIA</span>
            ` : `
              <span style="font-size:10px; font-weight:700; padding:2px 6px; border-radius:6px; background:${catDef.cor}22; color:${catDef.cor};">${catDef.nome}</span>
            `}
          </div>
        </div>

        ${c.endereco ? `
          <div style="font-size:11px; color:var(--muted); margin-bottom:6px; display:flex; align-items:center; gap:4px;">
            <span>📍</span> <span>${escapeHtml(c.endereco)}</span>
          </div>
        ` : ''}

        ${c.observacoes ? `
          <div style="font-size:11px; background:var(--bg3); padding:6px 8px; border-radius:6px; margin-bottom:8px; color:var(--text);">
            ℹ️ ${escapeHtml(c.observacoes)}
          </div>
        ` : ''}

        <!-- AÇÕES RÁPIDAS: LIGAR, WHATSAPP, COPIAR, EDITAR, EXCLUIR -->
        <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center; justify-content:space-between; margin-top:8px; padding-top:6px; border-top:1px solid var(--border);">
          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
            ${c.telefone ? `
              <a href="tel:${telDig}" class="btn ${c.emergencia ? 'btn-g' : 'btn-primary'}" style="padding:6px 10px; font-size:12px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                📞 Ligar (${escapeHtml(c.telefone)})
              </a>
            ` : ''}

            ${c.whatsapp ? `
              <a href="https://wa.me/${waDig}" target="_blank" class="btn" style="padding:6px 10px; font-size:12px; font-weight:700; color:var(--green); text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                💬 WhatsApp
              </a>
            ` : ''}

            <button type="button" class="btn" style="padding:6px 8px; font-size:11px;" title="Copiar Telefone" onclick="copiarTextoContato('${escapeHtml(c.telefone || c.whatsapp)}')">
              📋 Copiar
            </button>
          </div>

          <div style="display:flex; gap:4px;">
            <button type="button" class="btn" style="padding:6px 8px; font-size:11px;" title="Editar Contato" onclick="editarContatoModal('${c.id}')">
              ✏️
            </button>
            <button type="button" class="btn" style="padding:6px 8px; font-size:11px; color:var(--red);" title="Excluir Contato" onclick="confirmarExcluirContatoModal('${c.id}')">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filtrarCategoriaContatosModal(catId) {
  filtroCategoriaContatoAtivo = catId;
  renderContatosFamiliaModal();
}

function abrirModalContatosFamilia() {
  if (typeof document === 'undefined') return;
  filtroCategoriaContatoAtivo = 'todos';
  const buscaInput = document.getElementById('contatos-busca-input');
  if (buscaInput) buscaInput.value = '';

  renderContatosFamiliaModal();

  if (typeof openM === 'function') {
    openM('m-contatos-familia');
  }
}

function fecharModalContatosFamilia() {
  if (typeof closeM === 'function') {
    closeM('m-contatos-familia');
  }
}

function abrirModalNovoContato() {
  if (typeof document === 'undefined') return;

  const idEl = document.getElementById('form-contato-id');
  const nomeEl = document.getElementById('form-contato-nome');
  const catEl = document.getElementById('form-contato-categoria');
  const espEl = document.getElementById('form-contato-especialidade');
  const telEl = document.getElementById('form-contato-telefone');
  const waEl = document.getElementById('form-contato-whatsapp');
  const emailEl = document.getElementById('form-contato-email');
  const endEl = document.getElementById('form-contato-endereco');
  const obsEl = document.getElementById('form-contato-observacoes');
  const emergEl = document.getElementById('form-contato-emergencia');
  const titEl = document.getElementById('form-contato-titulo');

  if (idEl) idEl.value = '';
  if (nomeEl) nomeEl.value = '';
  if (catEl) catEl.value = 'outros';
  if (espEl) espEl.value = '';
  if (telEl) telEl.value = '';
  if (waEl) waEl.value = '';
  if (emailEl) emailEl.value = '';
  if (endEl) endEl.value = '';
  if (obsEl) obsEl.value = '';
  if (emergEl) emergEl.checked = false;
  if (titEl) titEl.textContent = '✨ Novo Contato Compartilhado';

  if (typeof openM === 'function') {
    openM('m-form-contato');
  }
}

function editarContatoModal(contatoId) {
  if (typeof document === 'undefined') return;
  const contato = (S.contatosFamilia || []).find(c => c.id === contatoId);
  if (!contato) return;

  const idEl = document.getElementById('form-contato-id');
  const nomeEl = document.getElementById('form-contato-nome');
  const catEl = document.getElementById('form-contato-categoria');
  const espEl = document.getElementById('form-contato-especialidade');
  const telEl = document.getElementById('form-contato-telefone');
  const waEl = document.getElementById('form-contato-whatsapp');
  const emailEl = document.getElementById('form-contato-email');
  const endEl = document.getElementById('form-contato-endereco');
  const obsEl = document.getElementById('form-contato-observacoes');
  const emergEl = document.getElementById('form-contato-emergencia');
  const titEl = document.getElementById('form-contato-titulo');

  if (idEl) idEl.value = contato.id;
  if (nomeEl) nomeEl.value = contato.nome || '';
  if (catEl) catEl.value = contato.categoria || 'outros';
  if (espEl) espEl.value = contato.especialidade || '';
  if (telEl) telEl.value = contato.telefone || '';
  if (waEl) waEl.value = contato.whatsapp || '';
  if (emailEl) emailEl.value = contato.email || '';
  if (endEl) endEl.value = contato.endereco || '';
  if (obsEl) obsEl.value = contato.observacoes || '';
  if (emergEl) emergEl.checked = !!contato.emergencia;
  if (titEl) titEl.textContent = '✏️ Editar Contato Compartilhado';

  if (typeof openM === 'function') {
    openM('m-form-contato');
  }
}

function aoMudarCategoriaContatoForm() {
  if (typeof document === 'undefined') return;
  const catEl = document.getElementById('form-contato-categoria');
  const emergEl = document.getElementById('form-contato-emergencia');
  if (catEl && emergEl && catEl.value === 'emergencia') {
    emergEl.checked = true;
  }
}

function salvarContatoModal() {
  if (typeof document === 'undefined') return;

  const id = document.getElementById('form-contato-id')?.value || '';
  const nome = document.getElementById('form-contato-nome')?.value || '';
  const categoria = document.getElementById('form-contato-categoria')?.value || 'outros';
  const especialidade = document.getElementById('form-contato-especialidade')?.value || '';
  const telefone = document.getElementById('form-contato-telefone')?.value || '';
  const whatsapp = document.getElementById('form-contato-whatsapp')?.value || '';
  const email = document.getElementById('form-contato-email')?.value || '';
  const endereco = document.getElementById('form-contato-endereco')?.value || '';
  const observacoes = document.getElementById('form-contato-observacoes')?.value || '';
  const emergencia = document.getElementById('form-contato-emergencia')?.checked || false;

  const res = salvarContatoFamilia({
    id,
    nome,
    categoria,
    especialidade,
    telefone,
    whatsapp,
    email,
    endereco,
    observacoes,
    emergencia
  });

  if (res.ok) {
    if (typeof closeM === 'function') {
      closeM('m-form-contato');
    }
  }
}

function confirmarExcluirContatoModal(contatoId) {
  if (typeof confirm === 'function') {
    if (!confirm('Deseja excluir este contato da família?')) return;
  }
  excluirContatoFamilia(contatoId);
}

function copiarTextoContato(texto) {
  if (!texto) return;
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(() => {
        exibirToastNotificacao('Contato copiado com sucesso!', '📋');
      }).catch(err => {
        console.error('Erro ao copiar para clipboard:', err);
      });
    } else {
      exibirToastNotificacao('Contato: ' + texto, '📋');
    }
  } catch (err) {
    console.error('Erro em copiarTextoContato:', err);
  }
}

// ============================================================================
// SUPER-APP FAMILIAR v2.0 - ETAPA 7:
// 1. PLANEJADOR DE REFEIÇÕES & CAIXA DE RECEITAS (COM GERAÇÃO DE LISTA DE COMPRAS)
// 2. COFRE DE DOCUMENTOS DA FAMÍLIA (4 PASTAS PADRÃO COM BLINDAGEM DE PRIVACIDADE)
// 3. GRADE HORÁRIA SEMANAL / TIMETABLE (COM SUPORTE A SEMANAS ALTERNADAS)
// ============================================================================

// ----------------------------------------------------------------------------
// MÓDULO 4.6: REFEIÇÕES, RECEITAS CULINÁRIAS E GERAÇÃO DE LISTA DE COMPRAS
// ----------------------------------------------------------------------------

const DIAS_SEMANA_NOMES = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

const DIAS_SEMANA_LABELS = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
  domingo: 'Domingo'
};

const TURNOS_REFEICAO_LABELS = {
  cafe: '☕ Café da Manhã',
  almoco: '🍽️ Almoço',
  jantar: '🍲 Jantar',
  lanche: '🥪 Lanche'
};

let tabRefeicoesAtiva = 'cardapio'; // 'cardapio' | 'receitas'

/**
 * Salva ou edita uma receita culinária na Caixa de Receitas Familiar.
 */
function salvarReceitaCulinaria(dados = {}) {
  try {
    const titulo = dados.titulo != null ? String(dados.titulo).trim() : '';
    if (!titulo) {
      if (typeof alert === 'function') alert('O título da receita é obrigatório.');
      return { ok: false, motivo: 'titulo_obrigatorio' };
    }

    if (!Array.isArray(S.receitasCulinarias)) {
      S.receitasCulinarias = [];
    }

    const cId = S.circuloAtivoId || 'circ_1';
    const membro = obterMembroAtivo();
    const agoraIso = new Date().toISOString();

    // Normalização dos ingredientes
    const ingredientes = Array.isArray(dados.ingredientes)
      ? dados.ingredientes.map(ing => ({
          nome: String(ing.nome || '').trim(),
          quantidade: String(ing.quantidade || '1').trim(),
          unidade: String(ing.unidade || 'un').trim(),
          corredor: (ing.corredor && CATEGORIAS_MERCADO[ing.corredor]) ? ing.corredor : 'mercearia'
        })).filter(ing => !!ing.nome)
      : [];

    let receita = null;
    let operacao = 'insert';

    if (dados.id) {
      const idx = S.receitasCulinarias.findIndex(r => r.id === dados.id);
      if (idx >= 0) {
        receita = S.receitasCulinarias[idx];
        receita.titulo = titulo;
        receita.categoria = dados.categoria || receita.categoria || 'almoco';
        receita.tempoPreparoMin = Number(dados.tempoPreparoMin) > 0 ? Number(dados.tempoPreparoMin) : 30;
        receita.porcoes = Number(dados.porcoes) > 0 ? Number(dados.porcoes) : 4;
        receita.ingredientes = ingredientes;
        receita.modoPreparo = dados.modoPreparo != null ? String(dados.modoPreparo).trim() : '';
        receita.custoEstimado = Number(dados.custoEstimado) >= 0 ? Number(dados.custoEstimado) : 0;
        receita.atualizadoEm = agoraIso;
        operacao = 'update';
      }
    }

    if (!receita) {
      receita = {
        id: dados.id || ('rec_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7)),
        circuloId: cId,
        titulo,
        categoria: dados.categoria || 'almoco',
        tempoPreparoMin: Number(dados.tempoPreparoMin) > 0 ? Number(dados.tempoPreparoMin) : 30,
        porcoes: Number(dados.porcoes) > 0 ? Number(dados.porcoes) : 4,
        ingredientes,
        modoPreparo: dados.modoPreparo != null ? String(dados.modoPreparo).trim() : '',
        custoEstimado: Number(dados.custoEstimado) >= 0 ? Number(dados.custoEstimado) : 0,
        criadoPor: membro ? membro.id : (S.membroAtivoId || 'm_1'),
        criadoEm: agoraIso
      };
      S.receitasCulinarias.push(receita);
    }

    adicionarNaFilaSync('receitas_culinarias', operacao, receita);

    registrarNotificacaoFamilia({
      tipo: 'geral',
      titulo: '📖 Receita Salva',
      texto: `${receita.titulo} (${receita.tempoPreparoMin} min)`,
      icone: '📖'
    });

    save();

    if (typeof document !== 'undefined') {
      renderRefeicoesFamiliaModal();
      renderMuralInicio();
    }

    return { ok: true, receita };
  } catch (err) {
    console.error('Erro ao salvar receita culinária:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

/**
 * Exclui uma receita da Caixa de Receitas.
 */
function excluirReceitaCulinaria(receitaId) {
  try {
    const idx = (S.receitasCulinarias || []).findIndex(r => r.id === receitaId);
    if (idx < 0) {
      return { ok: false, motivo: 'receita_nao_encontrada' };
    }

    S.receitasCulinarias.splice(idx, 1);
    adicionarNaFilaSync('receitas_culinarias', 'delete', { id: receitaId });
    save();

    if (typeof document !== 'undefined') {
      renderRefeicoesFamiliaModal();
      renderMuralInicio();
    }

    return { ok: true };
  } catch (err) {
    console.error('Erro ao excluir receita culinária:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

/**
 * Define ou atualiza uma refeição no Cardápio Semanal (segunda a domingo, cafe/almoco/jantar).
 */
function definirRefeicaoCardapio(params = {}) {
  try {
    const diaSemana = String(params.diaSemana || '').toLowerCase().trim();
    const tipoRefeicao = String(params.tipoRefeicao || '').toLowerCase().trim();
    const receitaId = params.receitaId || null;
    let pratoLivre = params.pratoLivre != null ? String(params.pratoLivre).trim() : '';

    if (!diaSemana || !tipoRefeicao) {
      return { ok: false, motivo: 'dia_ou_turno_invalido' };
    }

    let receitaRef = null;
    if (receitaId) {
      receitaRef = (S.receitasCulinarias || []).find(r => r.id === receitaId);
      if (receitaRef && !pratoLivre) {
        pratoLivre = receitaRef.titulo;
      }
    }

    if (!pratoLivre && !receitaId) {
      if (typeof alert === 'function') alert('Informe o nome do prato ou selecione uma receita da caixa.');
      return { ok: false, motivo: 'prato_obrigatorio' };
    }

    if (!Array.isArray(S.cardapioSemanal)) {
      S.cardapioSemanal = [];
    }

    const cId = S.circuloAtivoId || 'circ_1';
    const agoraIso = new Date().toISOString();

    const ingredientesExtras = Array.isArray(params.ingredientesExtras)
      ? params.ingredientesExtras.map(i => ({
          nome: String(i.nome || '').trim(),
          quantidade: String(i.quantidade || '1').trim(),
          unidade: String(i.unidade || 'un').trim(),
          corredor: (i.corredor && CATEGORIAS_MERCADO[i.corredor]) ? i.corredor : 'mercearia'
        })).filter(i => !!i.nome)
      : [];

    const slotExistente = S.cardapioSemanal.find(r =>
      r.circuloId === cId && r.diaSemana === diaSemana && r.tipoRefeicao === tipoRefeicao
    );

    let refeicaoSlot = null;
    let operacao = 'insert';

    if (slotExistente) {
      refeicaoSlot = slotExistente;
      refeicaoSlot.receitaId = receitaId;
      refeicaoSlot.pratoLivre = pratoLivre;
      refeicaoSlot.ingredientesExtras = ingredientesExtras;
      refeicaoSlot.atualizadoEm = agoraIso;
      operacao = 'update';
    } else {
      refeicaoSlot = {
        id: `refeicao_${diaSemana}_${tipoRefeicao}_${Date.now().toString(36)}`,
        circuloId: cId,
        diaSemana,
        tipoRefeicao,
        receitaId,
        pratoLivre,
        ingredientesExtras,
        criadoEm: agoraIso,
        atualizadoEm: agoraIso
      };
      S.cardapioSemanal.push(refeicaoSlot);
    }

    adicionarNaFilaSync('cardapio_semanal', operacao, refeicaoSlot);

    save();

    if (typeof document !== 'undefined') {
      renderRefeicoesFamiliaModal();
      renderMuralInicio();
    }

    return { ok: true, refeicao: refeicaoSlot };
  } catch (err) {
    console.error('Erro ao definir refeição do cardápio:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

/**
 * Remove uma refeição agendada do cardápio semanal.
 */
function limparRefeicaoCardapio(diaSemana, tipoRefeicao) {
  try {
    const cId = S.circuloAtivoId || 'circ_1';
    const dLimpo = String(diaSemana || '').toLowerCase().trim();
    const tLimpo = String(tipoRefeicao || '').toLowerCase().trim();

    const idx = (S.cardapioSemanal || []).findIndex(r =>
      r.circuloId === cId && r.diaSemana === dLimpo && r.tipoRefeicao === tLimpo
    );

    if (idx < 0) {
      return { ok: false, motivo: 'refeicao_nao_encontrada' };
    }

    const removido = S.cardapioSemanal.splice(idx, 1)[0];
    adicionarNaFilaSync('cardapio_semanal', 'delete', { id: removido.id });
    save();

    if (typeof document !== 'undefined') {
      renderRefeicoesFamiliaModal();
      renderMuralInicio();
    }

    return { ok: true };
  } catch (err) {
    console.error('Erro ao limpar refeição do cardápio:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

/**
 * Varre todo o cardápio da semana e retorna os ingredientes necessários
 * que ainda NÃO estão comprados e NÃO estão pendentes na lista de compras.
 */
function obterIngredientesFaltantesCardapio() {
  try {
    const cId = S.circuloAtivoId || 'circ_1';
    const refeicoesSemana = (S.cardapioSemanal || []).filter(r => r.circuloId === cId);

    // 1. Coleta todos os ingredientes das receitas vinculadas e extras
    const todosIngredientes = [];
    refeicoesSemana.forEach(ref => {
      if (ref.receitaId) {
        const rec = (S.receitasCulinarias || []).find(r => r.id === ref.receitaId);
        if (rec && Array.isArray(rec.ingredientes)) {
          rec.ingredientes.forEach(ing => {
            todosIngredientes.push({
              nome: ing.nome,
              quantidade: ing.quantidade || '1',
              unidade: ing.unidade || 'un',
              corredor: ing.corredor || 'mercearia',
              origem: rec.titulo
            });
          });
        }
      }
      if (Array.isArray(ref.ingredientesExtras)) {
        ref.ingredientesExtras.forEach(ing => {
          todosIngredientes.push({
            nome: ing.nome,
            quantidade: ing.quantidade || '1',
            unidade: ing.unidade || 'un',
            corredor: ing.corredor || 'mercearia',
            origem: ref.pratoLivre || 'Cardápio Semanal'
          });
        });
      }
    });

    // 2. Coleta itens já presentes nas listas de compras ativas (pendentes ou comprados)
    const nomesJaNaLista = new Set();
    (S.listas || []).filter(l => l.tipo === 'compras' && l.circuloId === cId).forEach(l => {
      (l.itens || []).forEach(it => {
        if (it && it.nome) {
          nomesJaNaLista.add(it.nome.toLowerCase().trim());
        }
      });
    });

    // 3. Filtra apenas os ingredientes faltantes
    const faltantes = [];
    const nomesFaltantesAdicionados = new Set();

    todosIngredientes.forEach(ing => {
      const nomeLower = (ing.nome || '').toLowerCase().trim();
      if (!nomeLower) return;

      if (!nomesJaNaLista.has(nomeLower) && !nomesFaltantesAdicionados.has(nomeLower)) {
        faltantes.push(ing);
        nomesFaltantesAdicionados.add(nomeLower);
      }
    });

    return faltantes;
  } catch (err) {
    console.error('Erro ao obter ingredientes faltantes do cardápio:', err);
    return [];
  }
}

/**
 * Gera automaticamente uma Lista de Compras completa com base nos ingredientes
 * das receitas agendadas no Cardápio Semanal, categorizando cada item no seu corredor correto
 * e evitando duplicações desnecessárias.
 */
function gerarListaComprasDoCardapio(opcoes = {}) {
  try {
    const cId = S.circuloAtivoId || 'circ_1';
    const refeicoesSemana = (S.cardapioSemanal || []).filter(r => r.circuloId === cId);

    if (refeicoesSemana.length === 0) {
      if (typeof alert === 'function') alert('O cardápio da semana está vazio. Adicione pratos e receitas primeiro!');
      return { ok: false, motivo: 'cardapio_vazio' };
    }

    if (!Array.isArray(S.listas)) {
      S.listas = [];
    }

    // Localiza ou cria a lista de mercado de destino
    let listaMercado = (S.listas || []).find(l => l.tipo === 'compras' && l.circuloId === cId);
    if (!listaMercado) {
      listaMercado = criarListaFamiliar({
        titulo: '🛒 Mercado (Cardápio da Semana)',
        tipo: 'compras',
        icone: '🛒',
        cor: '#10B981'
      });
    }

    if (!listaMercado) {
      return { ok: false, motivo: 'erro_criar_lista' };
    }

    // Coleta todos os ingredientes da semana
    const ingredientesParaAdicionar = [];
    refeicoesSemana.forEach(ref => {
      if (ref.receitaId) {
        const rec = (S.receitasCulinarias || []).find(r => r.id === ref.receitaId);
        if (rec && Array.isArray(rec.ingredientes)) {
          rec.ingredientes.forEach(ing => {
            if (ing && ing.nome) ingredientesParaAdicionar.push(ing);
          });
        }
      }
      if (Array.isArray(ref.ingredientesExtras)) {
        ref.ingredientesExtras.forEach(ing => {
          if (ing && ing.nome) ingredientesParaAdicionar.push(ing);
        });
      }
    });

    let totalAdicionados = 0;
    const itensAdicionados = [];

    ingredientesParaAdicionar.forEach(ing => {
      const nomeLimpo = (ing.nome || '').trim();
      if (!nomeLimpo) return;

      const jaExistePendente = (listaMercado.itens || []).some(
        it => !it.comprado && it.nome.toLowerCase() === nomeLimpo.toLowerCase()
      );

      // Regra de ouro: se já estiver pendente na lista, evita duplicar item idêntico
      if (jaExistePendente && !opcoes.forcarDuplicatas) {
        return;
      }

      const qtdNum = parseFloat(String(ing.quantidade).replace(',', '.')) || 1;
      const corredor = (ing.corredor && CATEGORIAS_MERCADO[ing.corredor]) ? ing.corredor : 'mercearia';

      const itemCriado = adicionarItemLista(listaMercado.id, {
        nome: nomeLimpo,
        qtd: qtdNum,
        unidade: ing.unidade || 'un',
        categoria: corredor,
        precoEstimado: 0
      });

      if (itemCriado) {
        totalAdicionados++;
        itensAdicionados.push(itemCriado);
      }
    });

    registrarNotificacaoFamilia({
      tipo: 'listas',
      titulo: '🛒 Lista de Compras Atualizada',
      texto: `${totalAdicionados} ingrediente(s) do cardápio adicionado(s) na lista "${listaMercado.titulo}".`,
      icone: '🛒'
    });

    save();

    if (typeof document !== 'undefined') {
      renderRefeicoesFamiliaModal();
      renderMuralInicio();
      if (typeof renderListas === 'function') renderListas();
    }

    return {
      ok: true,
      listaId: listaMercado.id,
      listaTitulo: listaMercado.titulo,
      totalAdicionados,
      itensAdicionados
    };
  } catch (err) {
    console.error('Erro ao gerar lista de compras do cardápio:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

// ----------------------------------------------------------------------------
// MÓDULO 4.7 & 5.5: COFRE DE DOCUMENTOS DA FAMÍLIA (4 PASTAS COM RLS/PRIVACIDADE)
// ----------------------------------------------------------------------------

const PASTAS_DOCUMENTOS_PADRAO = [
  { id: 'privado', nome: '🔒 Privado (Dono & Admin)', icone: '🔒', cor: '#EF4444', desc: 'Contratos, finanças e dados confidenciais' },
  { id: 'educacao', nome: '🎓 Educação & Escola', icone: '🎓', cor: '#8B5CF6', desc: 'Boletins, matrículas e certificados' },
  { id: 'casa', nome: '🏠 Casa & Veículos', icone: '🏠', cor: '#F59E0B', desc: 'Apólices, IPVA, escrituras e manuais' },
  { id: 'familia', nome: '👨‍👩‍👧 Saúde & Família', icone: '👨‍👩‍👧', cor: '#10B981', desc: 'Vacinas, certidões, RG, passaportes e exames' }
];

let pastaDocumentosAtiva = 'todas';

/**
 * Salva ou atualiza um documento no cofre familiar.
 * Aplica regra inegociável de segurança: documentos da pasta 'privado'
 * NUNCA podem ter permissão concedida a membros com papel 'crianca'.
 */
function salvarDocumentoFamilia(dados = {}) {
  try {
    const titulo = dados.titulo != null ? String(dados.titulo).trim() : '';
    if (!titulo) {
      if (typeof alert === 'function') alert('O título do documento é obrigatório.');
      return { ok: false, motivo: 'titulo_obrigatorio' };
    }

    const pastaValida = ['privado', 'educacao', 'casa', 'familia'].includes(dados.pasta)
      ? dados.pasta
      : 'familia';

    if (!Array.isArray(S.documentosFamilia)) {
      S.documentosFamilia = [];
    }

    const cId = S.circuloAtivoId || 'circ_1';
    const membro = obterMembroAtivo();
    const agoraIso = new Date().toISOString();

    // Sanitização de visibilidade: se a pasta for privada, blinda 100% contra crianças
    let visivelParaIds = dados.visivelParaIds;
    if (pastaValida === 'privado') {
      const criancasIds = (S.membrosPerfil || []).filter(m => m.papel === 'crianca').map(m => m.id);
      if (Array.isArray(visivelParaIds)) {
        visivelParaIds = visivelParaIds.filter(id => !criancasIds.includes(id));
      } else {
        // Se for privado e não tiver lista restrita, restringe ao próprio dono
        visivelParaIds = [membro ? membro.id : (S.membroAtivoId || 'm_1')];
      }
    } else if (!visivelParaIds) {
      visivelParaIds = 'todos';
    }

    let doc = null;
    let operacao = 'insert';

    if (dados.id) {
      const idx = S.documentosFamilia.findIndex(d => d.id === dados.id);
      if (idx >= 0) {
        doc = S.documentosFamilia[idx];
        doc.titulo = titulo;
        doc.pasta = pastaValida;
        doc.tipoArquivo = dados.tipoArquivo || doc.tipoArquivo || 'pdf';
        doc.conteudoUrlOuBase64 = dados.conteudoUrlOuBase64 || doc.conteudoUrlOuBase64 || '';
        doc.numeroDocumento = dados.numeroDocumento != null ? String(dados.numeroDocumento).trim() : '';
        doc.dataValidade = dados.dataValidade != null ? String(dados.dataValidade).trim() : '';
        doc.visivelParaIds = visivelParaIds;
        doc.observacoes = dados.observacoes != null ? String(dados.observacoes).trim() : '';
        doc.atualizadoEm = agoraIso;
        operacao = 'update';
      }
    }

    if (!doc) {
      doc = {
        id: dados.id || ('doc_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7)),
        circuloId: cId,
        titulo,
        pasta: pastaValida,
        tipoArquivo: dados.tipoArquivo || 'pdf',
        conteudoUrlOuBase64: dados.conteudoUrlOuBase64 || '',
        numeroDocumento: dados.numeroDocumento != null ? String(dados.numeroDocumento).trim() : '',
        dataValidade: dados.dataValidade != null ? String(dados.dataValidade).trim() : '',
        membroDonoId: dados.membroDonoId || (membro ? membro.id : (S.membroAtivoId || 'm_1')),
        visivelParaIds,
        observacoes: dados.observacoes != null ? String(dados.observacoes).trim() : '',
        criadoEm: agoraIso
      };
      S.documentosFamilia.push(doc);
    }

    adicionarNaFilaSync('documentos', operacao, doc);

    // Registra notificação familiar apenas se o documento NÃO for privado
    if (doc.pasta !== 'privado') {
      registrarNotificacaoFamilia({
        tipo: 'documentos',
        titulo: '📂 Novo Documento Familiar',
        texto: `${doc.titulo} arquivado na pasta ${doc.pasta}.`,
        icone: '📂'
      });
    }

    save();

    if (typeof document !== 'undefined') {
      renderDocumentosFamiliaModal();
      renderMuralInicio();
    }

    return { ok: true, documento: doc };
  } catch (err) {
    console.error('Erro ao salvar documento da família:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

/**
 * Exclui um documento do cofre familiar.
 */
function excluirDocumentoFamilia(docId) {
  try {
    const idx = (S.documentosFamilia || []).findIndex(d => d.id === docId);
    if (idx < 0) {
      return { ok: false, motivo: 'documento_nao_encontrado' };
    }

    S.documentosFamilia.splice(idx, 1);
    adicionarNaFilaSync('documentos', 'delete', { id: docId });
    save();

    if (typeof document !== 'undefined') {
      renderDocumentosFamiliaModal();
      renderMuralInicio();
    }

    return { ok: true };
  } catch (err) {
    console.error('Erro ao excluir documento:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

/**
 * Lista todos os documentos visíveis para um membro específico no círculo familiar.
 * POLÍTICA DE SEGURANÇA ESTRITA:
 * - Se membro.papel === 'crianca': 100% dos documentos da pasta 'privado' são ocultados.
 * - Documentos da pasta 'privado' são visíveis apenas para o próprio autor ou para administradores.
 * - Pastas públicas ('educacao', 'casa', 'familia') são compartilhadas com todos os membros.
 */
function listarDocumentosVisiveisParaMembro(membroId, filtroPasta = 'todas', busca = '') {
  try {
    const cId = S.circuloAtivoId || 'circ_1';
    const mId = membroId || S.membroAtivoId || 'm_1';
    const membro = (S.membrosPerfil || []).find(m => m.id === mId) || { id: mId, papel: 'membro' };

    const termoBusca = (busca || '').toLowerCase().trim();

    return (S.documentosFamilia || []).filter(doc => {
      if (doc.circuloId !== cId) return false;

      // 1. Verificação de Privacidade e Papel
      if (doc.pasta === 'privado') {
        // Criança NUNCA pode ver documentos privados
        if (membro.papel === 'crianca') {
          return false;
        }
        // Apenas o dono ou um admin pode ver documentos privados
        const ehDono = doc.membroDonoId === membro.id;
        const ehAdmin = membro.papel === 'admin';
        if (!ehDono && !ehAdmin) {
          return false;
        }
      } else {
        // Pastas educacao, casa, familia: verifica se não foi excluído explicitamente
        if (Array.isArray(doc.visivelParaIds) && !doc.visivelParaIds.includes(membro.id)) {
          return false;
        }
      }

      // 2. Filtro de pasta
      if (filtroPasta && filtroPasta !== 'todas') {
        if (doc.pasta !== filtroPasta) return false;
      }

      // 3. Filtro textual de busca
      if (termoBusca) {
        const tit = (doc.titulo || '').toLowerCase();
        const num = (doc.numeroDocumento || '').toLowerCase();
        const obs = (doc.observacoes || '').toLowerCase();
        if (!tit.includes(termoBusca) && !num.includes(termoBusca) && !obs.includes(termoBusca)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime());
  } catch (err) {
    console.error('Erro ao listar documentos visíveis:', err);
    return [];
  }
}

/**
 * Retorna documentos que estão vencendo nos próximos N dias (padrão: 30 dias)
 * ou que já se encontram vencidos.
 */
function obterAlertasDocumentosVencendo(diasAntecedencia = 30) {
  try {
    const mAtivo = obterMembroAtivo();
    const docs = listarDocumentosVisiveisParaMembro(mAtivo ? mAtivo.id : null);
    // Data base consistente em ISO para evitar divergências de fuso horário
    const hojeStr = new Date().toISOString().slice(0, 10);
    const hoje = new Date(hojeStr + 'T00:00:00');

    const alertas = [];

    docs.forEach(doc => {
      if (!doc.dataValidade) return;
      const dataVal = new Date(doc.dataValidade + 'T00:00:00');
      if (isNaN(dataVal.getTime())) return;

      const diffMs = dataVal.getTime() - hoje.getTime();
      const diasRestantes = Math.round(diffMs / 86400000);

      if (diasRestantes <= diasAntecedencia) {
        alertas.push({
          ...doc,
          diasRestantes,
          statusVencimento: diasRestantes < 0 ? 'vencido' : (diasRestantes <= 16 ? 'urgente' : 'proximo')
        });
      }
    });

    return alertas.sort((a, b) => a.diasRestantes - b.diasRestantes);
  } catch (err) {
    console.error('Erro ao obter alertas de vencimento:', err);
    return [];
  }
}

// ----------------------------------------------------------------------------
// MÓDULO 4.8: GRADE HORÁRIA SEMANAL / TIMETABLE (COM SEMANAS ALTERNADAS)
// ----------------------------------------------------------------------------

let filtroMembroGradeAtivo = 'todos';
let filtroSemanaAlternadaAtiva = 'todas'; // 'todas' | 'semana_a' | 'semana_b'

/**
 * Salva ou atualiza uma atividade recorrente na Grade Horária Semanal.
 */
function salvarItemGradeHoraria(dados = {}) {
  try {
    const titulo = dados.titulo != null ? String(dados.titulo).trim() : '';
    const membroId = dados.membroId || S.membroAtivoId || 'm_1';
    const diaSemana = String(dados.diaSemana || 'segunda').toLowerCase().trim();
    const horaInicio = String(dados.horaInicio || '08:00').trim();

    if (!titulo) {
      if (typeof alert === 'function') alert('O título da atividade na grade é obrigatório.');
      return { ok: false, motivo: 'titulo_obrigatorio' };
    }

    if (!Array.isArray(S.gradeHoraria)) {
      S.gradeHoraria = [];
    }

    const cId = S.circuloAtivoId || 'circ_1';
    const membro = (S.membrosPerfil || []).find(m => m.id === membroId) || obterMembroAtivo() || { id: membroId, nome: 'Familiar', cor: '#5581E3' };
    const agoraIso = new Date().toISOString();

    const semanaAlternada = ['todas', 'semana_a', 'semana_b'].includes(dados.semanaAlternada)
      ? dados.semanaAlternada
      : 'todas';

    let item = null;
    let operacao = 'insert';

    if (dados.id) {
      const idx = S.gradeHoraria.findIndex(g => g.id === dados.id);
      if (idx >= 0) {
        item = S.gradeHoraria[idx];
        item.titulo = titulo;
        item.membroId = membroId;
        item.membroNome = membro.nome;
        item.membroCor = membro.cor;
        item.diaSemana = diaSemana;
        item.horaInicio = horaInicio;
        item.horaFim = dados.horaFim != null ? String(dados.horaFim).trim() : '';
        item.local = dados.local != null ? String(dados.local).trim() : '';
        item.semanaAlternada = semanaAlternada;
        item.cor = dados.cor || item.cor || membro.cor || '#5581E3';
        item.atualizadoEm = agoraIso;
        operacao = 'update';
      }
    }

    if (!item) {
      item = {
        id: dados.id || ('grade_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7)),
        circuloId: cId,
        membroId,
        membroNome: membro.nome,
        membroCor: membro.cor,
        titulo,
        diaSemana,
        horaInicio,
        horaFim: dados.horaFim != null ? String(dados.horaFim).trim() : '',
        local: dados.local != null ? String(dados.local).trim() : '',
        semanaAlternada,
        cor: dados.cor || membro.cor || '#5581E3',
        criadoEm: agoraIso
      };
      S.gradeHoraria.push(item);
    }

    adicionarNaFilaSync('grade_horaria', operacao, item);

    registrarNotificacaoFamilia({
      tipo: 'eventos',
      titulo: '🕒 Atividade na Grade Horária',
      texto: `${item.membroNome}: ${item.titulo} (${item.diaSemana} às ${item.horaInicio})`,
      icone: '🕒'
    });

    save();

    if (typeof document !== 'undefined') {
      renderGradeHorariaModal();
      renderMuralInicio();
    }

    return { ok: true, item };
  } catch (err) {
    console.error('Erro ao salvar item na grade horária:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

/**
 * Exclui uma atividade da Grade Horária.
 */
function excluirItemGradeHoraria(itemId) {
  try {
    const idx = (S.gradeHoraria || []).findIndex(g => g.id === itemId);
    if (idx < 0) {
      return { ok: false, motivo: 'item_nao_encontrado' };
    }

    S.gradeHoraria.splice(idx, 1);
    adicionarNaFilaSync('grade_horaria', 'delete', { id: itemId });
    save();

    if (typeof document !== 'undefined') {
      renderGradeHorariaModal();
      renderMuralInicio();
    }

    return { ok: true };
  } catch (err) {
    console.error('Erro ao excluir item da grade horária:', err);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

/**
 * Filtra itens da Grade Horária Semanal considerando membro, dia e semana alternada.
 */
function listarGradeHorariaFiltrada(filtros = {}) {
  try {
    const cId = S.circuloAtivoId || 'circ_1';
    const membroId = filtros.membroId || 'todos';
    const diaSemana = filtros.diaSemana || 'todos';
    const semanaTipo = filtros.semanaTipo || 'todas';

    const DIAS_ORDEM = { segunda: 1, terca: 2, quarta: 3, quinta: 4, sexta: 5, sabado: 6, domingo: 7 };

    return (S.gradeHoraria || []).filter(item => {
      if (item.circuloId !== cId) return false;

      if (membroId !== 'todos' && item.membroId !== membroId) {
        return false;
      }

      if (diaSemana !== 'todos' && item.diaSemana !== diaSemana) {
        return false;
      }

      // Regra de semanas alternadas: 'todas' combina com tudo; semana_a ou semana_b filtra específico
      if (semanaTipo !== 'todas') {
        if (item.semanaAlternada !== 'todas' && item.semanaAlternada !== semanaTipo) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const oA = DIAS_ORDEM[a.diaSemana] || 99;
      const oB = DIAS_ORDEM[b.diaSemana] || 99;
      if (oA !== oB) return oA - oB;
      return (a.horaInicio || '').localeCompare(b.horaInicio || '');
    });
  } catch (err) {
    console.error('Erro ao filtrar grade horária:', err);
    return [];
  }
}

// ----------------------------------------------------------------------------
// CONTROLADORES DE INTERFACE E MODAIS (DOM) - ETAPA 7
// ----------------------------------------------------------------------------

function renderRefeicoesFamiliaModal(tab = 'cardapio') {
  if (typeof document === 'undefined') return;
  tabRefeicoesAtiva = tab;

  const btnCardapio = document.getElementById('tab-btn-cardapio-semanal');
  const btnReceitas = document.getElementById('tab-btn-caixa-receitas');
  const secCardapio = document.getElementById('sec-tab-cardapio-semanal');
  const secReceitas = document.getElementById('sec-tab-caixa-receitas');

  if (btnCardapio && btnReceitas) {
    if (tab === 'cardapio') {
      btnCardapio.classList.add('btn-primary');
      btnReceitas.classList.remove('btn-primary');
      if (secCardapio) secCardapio.style.display = 'block';
      if (secReceitas) secReceitas.style.display = 'none';
    } else {
      btnReceitas.classList.add('btn-primary');
      btnCardapio.classList.remove('btn-primary');
      if (secCardapio) secCardapio.style.display = 'none';
      if (secReceitas) secReceitas.style.display = 'block';
    }
  }

  // 1. Renderiza o Cardápio Semanal (segunda a domingo)
  const containerCardapio = document.getElementById('cardapio-semanal-grid-container');
  if (containerCardapio) {
    const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    const turnos = ['cafe', 'almoco', 'jantar'];
    const cId = S.circuloAtivoId || 'circ_1';
    const refeicoes = (S.cardapioSemanal || []).filter(r => r.circuloId === cId);

    containerCardapio.innerHTML = dias.map(d => {
      return `
        <div class="card" style="margin-bottom:12px; padding:12px; background:var(--bg2);">
          <h4 style="margin:0 0 8px; font-size:14px; font-weight:800; color:var(--text);">${DIAS_SEMANA_LABELS[d]}</h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:8px;">
            ${turnos.map(t => {
              const ref = refeicoes.find(r => r.diaSemana === d && r.tipoRefeicao === t);
              return `
                <div style="background:var(--bg3); border-radius:8px; padding:8px; border:1px solid var(--border); display:flex; flex-direction:column; justify-content:space-between; min-height:75px;">
                  <div>
                    <span style="font-size:10px; font-weight:700; color:var(--muted); text-transform:uppercase;">${TURNOS_REFEICAO_LABELS[t]}</span>
                    <p style="margin:4px 0 0; font-size:12px; font-weight:700; color:var(--text); line-height:1.2;">
                      ${ref ? escapeHtml(ref.pratoLivre) : '<span style="color:var(--muted); font-weight:normal; font-style:italic;">Não definido</span>'}
                    </p>
                  </div>
                  <div style="display:flex; justify-content:flex-end; gap:4px; margin-top:6px;">
                    <button type="button" class="btn" style="padding:2px 6px; font-size:10px;" onclick="abrirModalDefinirRefeicao('${d}', '${t}')" title="Definir prato">✏️</button>
                    ${ref ? `<button type="button" class="btn" style="padding:2px 6px; font-size:10px; color:var(--red);" onclick="limparRefeicaoModal('${d}', '${t}')" title="Limpar">✕</button>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // 2. Renderiza a Caixa de Receitas
  const containerReceitas = document.getElementById('caixa-receitas-grid-container');
  if (containerReceitas) {
    const receitas = S.receitasCulinarias || [];
    if (receitas.length === 0) {
      containerReceitas.innerHTML = `
        <div style="text-align:center; padding:32px 16px; color:var(--muted);">
          <p style="font-size:32px; margin-bottom:8px;">📖</p>
          <p style="font-weight:700; font-size:14px; margin-bottom:4px; color:var(--text);">Nenhuma receita cadastrada</p>
          <p style="font-size:12px; margin:0 0 14px;">Adicione pratos favoritos da família com tempo de preparo e ingredientes.</p>
          <button type="button" class="btn btn-primary" onclick="abrirModalNovaReceita()">+ Nova Receita</button>
        </div>
      `;
    } else {
      containerReceitas.innerHTML = receitas.map(r => `
        <div class="card" style="margin-bottom:10px; padding:12px; background:var(--bg2);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
            <div>
              <h4 style="margin:0; font-size:15px; font-weight:800; color:var(--text);">${escapeHtml(r.titulo)}</h4>
              <p style="margin:2px 0 0; font-size:11px; color:var(--muted);">⏱️ ${r.tempoPreparoMin} min • 🍽️ ${r.porcoes} porções • R$ ${Number(r.custoEstimado || 0).toFixed(2)}</p>
            </div>
            <div style="display:flex; gap:4px;">
              <button type="button" class="btn" style="padding:4px 8px; font-size:11px;" onclick="editarReceitaModal('${r.id}')">✏️</button>
              <button type="button" class="btn" style="padding:4px 8px; font-size:11px; color:var(--red);" onclick="confirmarExcluirReceitaModal('${r.id}')">🗑️</button>
            </div>
          </div>
          <div style="font-size:11px; color:var(--text); background:var(--bg3); padding:6px 8px; border-radius:6px; margin-top:6px;">
            <strong>Ingredientes (${(r.ingredientes || []).length}):</strong> ${(r.ingredientes || []).map(i => `${i.quantidade || ''} ${i.unidade || ''} ${i.nome}`).join(', ')}
          </div>
        </div>
      `).join('');
    }
  }

  // 3. Atualiza contador de ingredientes faltantes no botão
  const faltantesCountEl = document.getElementById('cardapio-btn-faltantes-count');
  if (faltantesCountEl) {
    const f = obterIngredientesFaltantesCardapio();
    faltantesCountEl.textContent = f.length > 0 ? `(${f.length} itens a comprar)` : '';
  }
}

function abrirModalRefeicoesFamilia(tab = 'cardapio') {
  if (typeof document === 'undefined') return;
  renderRefeicoesFamiliaModal(tab);
  if (typeof openM === 'function') openM('m-refeicoes-familia');
}

function fecharModalRefeicoesFamilia() {
  if (typeof closeM === 'function') closeM('m-refeicoes-familia');
}

function abrirModalNovaReceita() {
  if (typeof document === 'undefined') return;
  const idEl = document.getElementById('form-rec-id');
  const titEl = document.getElementById('form-rec-titulo');
  const catEl = document.getElementById('form-rec-categoria');
  const tempoEl = document.getElementById('form-rec-tempo');
  const porcoesEl = document.getElementById('form-rec-porcoes');
  const custoEl = document.getElementById('form-rec-custo');
  const ingsEl = document.getElementById('form-rec-ingredientes');
  const modoEl = document.getElementById('form-rec-modo');

  if (idEl) idEl.value = '';
  if (titEl) titEl.value = '';
  if (catEl) catEl.value = 'almoco';
  if (tempoEl) tempoEl.value = '30';
  if (porcoesEl) porcoesEl.value = '4';
  if (custoEl) custoEl.value = '';
  if (ingsEl) ingsEl.value = '';
  if (modoEl) modoEl.value = '';

  const titModal = document.getElementById('form-rec-modal-title');
  if (titModal) titModal.textContent = '✨ Nova Receita da Família';

  if (typeof openM === 'function') openM('m-form-receita');
}

function editarReceitaModal(receitaId) {
  if (typeof document === 'undefined') return;
  const rec = (S.receitasCulinarias || []).find(r => r.id === receitaId);
  if (!rec) return;

  const idEl = document.getElementById('form-rec-id');
  const titEl = document.getElementById('form-rec-titulo');
  const catEl = document.getElementById('form-rec-categoria');
  const tempoEl = document.getElementById('form-rec-tempo');
  const porcoesEl = document.getElementById('form-rec-porcoes');
  const custoEl = document.getElementById('form-rec-custo');
  const ingsEl = document.getElementById('form-rec-ingredientes');
  const modoEl = document.getElementById('form-rec-modo');

  if (idEl) idEl.value = rec.id;
  if (titEl) titEl.value = rec.titulo || '';
  if (catEl) catEl.value = rec.categoria || 'almoco';
  if (tempoEl) tempoEl.value = rec.tempoPreparoMin || 30;
  if (porcoesEl) porcoesEl.value = rec.porcoes || 4;
  if (custoEl) custoEl.value = rec.custoEstimado || '';
  if (modoEl) modoEl.value = rec.modoPreparo || '';

  if (ingsEl) {
    ingsEl.value = (rec.ingredientes || []).map(i => `${i.quantidade || '1'} ${i.unidade || 'un'} de ${i.nome} (${i.corredor || 'mercearia'})`).join('\n');
  }

  const titModal = document.getElementById('form-rec-modal-title');
  if (titModal) titModal.textContent = '✏️ Editar Receita';

  if (typeof openM === 'function') openM('m-form-receita');
}

function salvarReceitaModal() {
  if (typeof document === 'undefined') return;

  const id = document.getElementById('form-rec-id')?.value || '';
  const titulo = document.getElementById('form-rec-titulo')?.value || '';
  const categoria = document.getElementById('form-rec-categoria')?.value || 'almoco';
  const tempoPreparoMin = Number(document.getElementById('form-rec-tempo')?.value) || 30;
  const porcoes = Number(document.getElementById('form-rec-porcoes')?.value) || 4;
  const custoEstimado = parseFloat(document.getElementById('form-rec-custo')?.value) || 0;
  const modoPreparo = document.getElementById('form-rec-modo')?.value || '';
  const ingsRaw = document.getElementById('form-rec-ingredientes')?.value || '';

  // Parser simples de ingredientes a partir do texto multilinha
  const ingredientes = ingsRaw.split('\n').map(l => l.trim()).filter(Boolean).map(linha => {
    // Ex: "1 kg de Peito de Frango (carnes)" ou "2 un Ovo"
    const corredorMatch = linha.match(/\((.*?)\)$/);
    const corredor = corredorMatch ? corredorMatch[1].trim() : 'mercearia';
    const limpa = linha.replace(/\((.*?)\)$/, '').trim();
    const partes = limpa.split(/\s+/);
    let qtd = '1';
    let un = 'un';
    let nome = limpa;

    if (partes.length >= 2 && !isNaN(parseFloat(partes[0].replace(',', '.')))) {
      qtd = partes[0];
      un = partes[1];
      nome = partes.slice(2).join(' ').replace(/^de\s+/i, '').trim();
      if (!nome) {
        nome = un;
        un = 'un';
      }
    }

    return { nome, quantidade: qtd, unidade: un, corredor };
  });

  const res = salvarReceitaCulinaria({
    id,
    titulo,
    categoria,
    tempoPreparoMin,
    porcoes,
    custoEstimado,
    modoPreparo,
    ingredientes
  });

  if (res.ok && typeof closeM === 'function') {
    closeM('m-form-receita');
  }
}

function confirmarExcluirReceitaModal(receitaId) {
  if (typeof confirm === 'function') {
    if (!confirm('Deseja excluir esta receita da Caixa de Receitas?')) return;
  }
  excluirReceitaCulinaria(receitaId);
}

function abrirModalDefinirRefeicao(diaSemana, tipoRefeicao) {
  if (typeof document === 'undefined') return;
  const diaInput = document.getElementById('def-ref-dia');
  const turnoInput = document.getElementById('def-ref-turno');
  const selectReceita = document.getElementById('def-ref-receita-select');
  const pratoLivreInput = document.getElementById('def-ref-prato-livre');
  const extrasInput = document.getElementById('def-ref-extras');

  if (diaInput) diaInput.value = diaSemana;
  if (turnoInput) turnoInput.value = tipoRefeicao;

  const slot = (S.cardapioSemanal || []).find(r => r.diaSemana === diaSemana && r.tipoRefeicao === tipoRefeicao);

  if (selectReceita) {
    selectReceita.innerHTML = '<option value="">-- Nenhuma (Prato Livre Personalizado) --</option>' +
      (S.receitasCulinarias || []).map(r => `<option value="${r.id}" ${slot && slot.receitaId === r.id ? 'selected' : ''}>📖 ${escapeHtml(r.titulo)}</option>`).join('');
  }

  if (pratoLivreInput) pratoLivreInput.value = slot ? slot.pratoLivre || '' : '';
  if (extrasInput) extrasInput.value = slot && Array.isArray(slot.ingredientesExtras) ? slot.ingredientesExtras.map(i => i.nome).join(', ') : '';

  const labelTitle = document.getElementById('def-ref-modal-title');
  if (labelTitle) labelTitle.textContent = `🍽️ ${DIAS_SEMANA_LABELS[diaSemana] || diaSemana} - ${TURNOS_REFEICAO_LABELS[tipoRefeicao] || tipoRefeicao}`;

  if (typeof openM === 'function') openM('m-definir-refeicao');
}

function salvarDefinicaoRefeicaoModal() {
  if (typeof document === 'undefined') return;
  const diaSemana = document.getElementById('def-ref-dia')?.value || '';
  const tipoRefeicao = document.getElementById('def-ref-turno')?.value || '';
  const receitaId = document.getElementById('def-ref-receita-select')?.value || null;
  const pratoLivre = document.getElementById('def-ref-prato-livre')?.value || '';
  const extrasRaw = document.getElementById('def-ref-extras')?.value || '';

  const ingredientesExtras = extrasRaw.split(',').map(s => s.trim()).filter(Boolean).map(nome => ({
    nome,
    quantidade: '1',
    unidade: 'un',
    corredor: 'mercearia'
  }));

  const res = definirRefeicaoCardapio({
    diaSemana,
    tipoRefeicao,
    receitaId,
    pratoLivre,
    ingredientesExtras
  });

  if (res.ok && typeof closeM === 'function') {
    closeM('m-definir-refeicao');
  }
}

function limparRefeicaoModal(diaSemana, tipoRefeicao) {
  limparRefeicaoCardapio(diaSemana, tipoRefeicao);
}

function gerarListaComprasCardapioModal() {
  const res = gerarListaComprasDoCardapio();
  if (res.ok) {
    if (typeof exibirToastNotificacao === 'function') {
      exibirToastNotificacao(`Lista gerada! ${res.totalAdicionados} itens adicionados.`, '🛒');
    }
  }
}

// ----------------------------------------------------------------------------
// CONTROLADORES DE DOCUMENTOS DA FAMÍLIA (DOM)
// ----------------------------------------------------------------------------

function renderDocumentosFamiliaModal(pasta = 'todas') {
  if (typeof document === 'undefined') return;
  pastaDocumentosAtiva = pasta;

  const mAtivo = obterMembroAtivo();
  const mId = mAtivo ? mAtivo.id : (S.membroAtivoId || 'm_1');
  const busca = document.getElementById('docs-busca-input')?.value || '';

  const docs = listarDocumentosVisiveisParaMembro(mId, pastaDocumentosAtiva, busca);
  const container = document.getElementById('docs-lista-container');
  const pillsEl = document.getElementById('docs-pastas-pills');

  // 1. Pílulas das 4 pastas
  if (pillsEl) {
    const pastasDefs = [
      { id: 'todas', nome: 'Todas as Pastas', icone: '📂' },
      ...PASTAS_DOCUMENTOS_PADRAO
    ];

    // Se for criança, oculta a pasta 'privado' das pílulas visíveis
    const pastasVisiveis = pastasDefs.filter(p => !(mAtivo && mAtivo.papel === 'crianca' && p.id === 'privado'));

    pillsEl.innerHTML = pastasVisiveis.map(p => {
      const isSel = pastaDocumentosAtiva === p.id;
      return `
        <button type="button" class="filtro-pill ${isSel ? 'sel' : ''}" style="${isSel ? 'background:var(--primary);color:#fff;' : ''}; font-size:11px; white-space:nowrap;" onclick="filtrarPastaDocumentosModal('${p.id}')">
          ${p.icone} ${p.nome}
        </button>
      `;
    }).join('');
  }

  // 2. Banner de Alertas de Vencimento
  const bannerAlerta = document.getElementById('docs-banner-alertas');
  if (bannerAlerta) {
    const alertas = obterAlertasDocumentosVencendo(30);
    if (alertas.length > 0) {
      bannerAlerta.style.display = 'block';
      bannerAlerta.innerHTML = `
        <div style="background:rgba(239, 68, 68, 0.12); border:1px solid rgba(239, 68, 68, 0.35); border-radius:8px; padding:10px 12px; margin-bottom:12px;">
          <div style="font-size:12px; font-weight:800; color:var(--red); display:flex; align-items:center; gap:6px;">
            <span>⚠️</span> Alerta de Vencimento de Documentos (${alertas.length})
          </div>
          <div style="margin-top:4px; font-size:11px; color:var(--text);">
            ${alertas.map(a => `
              <div>• <strong>${escapeHtml(a.titulo)}</strong>: ${a.diasRestantes < 0 ? 'Já vencido!' : `Vence em ${a.diasRestantes} dia(s)`} (${a.dataValidade})</div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      bannerAlerta.style.display = 'none';
      bannerAlerta.innerHTML = '';
    }
  }

  // 3. Lista de documentos
  if (!container) return;

  if (docs.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:32px 16px; color:var(--muted);">
        <p style="font-size:32px; margin-bottom:8px;">🔒</p>
        <p style="font-weight:700; font-size:14px; margin-bottom:4px; color:var(--text);">Nenhum documento encontrado</p>
        <p style="font-size:12px; margin:0 0 14px;">Arquive exames, certidões, apólices e carteirinhas com segurança.</p>
        <button type="button" class="btn btn-primary" onclick="abrirModalNovoDocumento()">+ Novo Documento</button>
      </div>
    `;
    return;
  }

  container.innerHTML = docs.map(doc => {
    const pastaDef = PASTAS_DOCUMENTOS_PADRAO.find(p => p.id === doc.pasta) || { nome: doc.pasta, icone: '📂', cor: '#5581E3' };
    const temValidade = !!doc.dataValidade;
    let badgeValidade = '';

    if (temValidade) {
      const hoje = new Date();
      hoje.setHours(0,0,0,0);
      const val = new Date(doc.dataValidade + 'T00:00:00');
      const dias = Math.ceil((val.getTime() - hoje.getTime()) / 86400000);
      if (dias < 0) {
        badgeValidade = `<span style="background:rgba(239, 68, 68, 0.2); color:var(--red); font-size:10px; font-weight:800; padding:2px 6px; border-radius:6px;">VENCIDO</span>`;
      } else if (dias <= 30) {
        badgeValidade = `<span style="background:rgba(245, 158, 11, 0.2); color:var(--yellow); font-size:10px; font-weight:800; padding:2px 6px; border-radius:6px;">VENCE EM ${dias}d</span>`;
      } else {
        badgeValidade = `<span style="font-size:10px; color:var(--muted);">Validade: ${doc.dataValidade}</span>`;
      }
    }

    return `
      <div class="card" style="margin-bottom:10px; padding:12px; background:var(--bg2);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="font-size:20px;">${pastaDef.icone}</span>
            <div>
              <h4 style="margin:0; font-size:14px; font-weight:800; color:var(--text);">${escapeHtml(doc.titulo)}</h4>
              <p style="margin:2px 0 0; font-size:11px; color:var(--muted);">
                ${pastaDef.nome} ${doc.numeroDocumento ? `• Nº ${escapeHtml(doc.numeroDocumento)}` : ''}
              </p>
            </div>
          </div>
          <div>
            ${badgeValidade}
          </div>
        </div>

        ${doc.observacoes ? `
          <div style="font-size:11px; background:var(--bg3); padding:6px 8px; border-radius:6px; margin:6px 0; color:var(--text);">
            ℹ️ ${escapeHtml(doc.observacoes)}
          </div>
        ` : ''}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; padding-top:6px; border-top:1px solid var(--border);">
          <span style="font-size:10px; color:var(--muted);">Formato: ${String(doc.tipoArquivo || 'pdf').toUpperCase()}</span>
          <div style="display:flex; gap:4px;">
            <button type="button" class="btn" style="padding:4px 8px; font-size:11px;" onclick="editarDocumentoModal('${doc.id}')">✏️</button>
            <button type="button" class="btn" style="padding:4px 8px; font-size:11px; color:var(--red);" onclick="confirmarExcluirDocumentoModal('${doc.id}')">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filtrarPastaDocumentosModal(pasta) {
  renderDocumentosFamiliaModal(pasta);
}

function abrirModalDocumentosFamilia(pasta = 'todas') {
  if (typeof document === 'undefined') return;
  renderDocumentosFamiliaModal(pasta);
  if (typeof openM === 'function') openM('m-documentos-familia');
}

function fecharModalDocumentosFamilia() {
  if (typeof closeM === 'function') closeM('m-documentos-familia');
}

function abrirModalNovoDocumento() {
  if (typeof document === 'undefined') return;
  const idEl = document.getElementById('form-doc-id');
  const titEl = document.getElementById('form-doc-titulo');
  const pastaEl = document.getElementById('form-doc-pasta');
  const tipoEl = document.getElementById('form-doc-tipo');
  const numEl = document.getElementById('form-doc-numero');
  const valEl = document.getElementById('form-doc-validade');
  const obsEl = document.getElementById('form-doc-observacoes');

  if (idEl) idEl.value = '';
  if (titEl) titEl.value = '';
  if (pastaEl) pastaEl.value = 'familia';
  if (tipoEl) tipoEl.value = 'pdf';
  if (numEl) numEl.value = '';
  if (valEl) valEl.value = '';
  if (obsEl) obsEl.value = '';

  const titModal = document.getElementById('form-doc-modal-title');
  if (titModal) titModal.textContent = '✨ Novo Documento Familiar';

  if (typeof openM === 'function') openM('m-form-documento');
}

function editarDocumentoModal(docId) {
  if (typeof document === 'undefined') return;
  const doc = (S.documentosFamilia || []).find(d => d.id === docId);
  if (!doc) return;

  const idEl = document.getElementById('form-doc-id');
  const titEl = document.getElementById('form-doc-titulo');
  const pastaEl = document.getElementById('form-doc-pasta');
  const tipoEl = document.getElementById('form-doc-tipo');
  const numEl = document.getElementById('form-doc-numero');
  const valEl = document.getElementById('form-doc-validade');
  const obsEl = document.getElementById('form-doc-observacoes');

  if (idEl) idEl.value = doc.id;
  if (titEl) titEl.value = doc.titulo || '';
  if (pastaEl) pastaEl.value = doc.pasta || 'familia';
  if (tipoEl) tipoEl.value = doc.tipoArquivo || 'pdf';
  if (numEl) numEl.value = doc.numeroDocumento || '';
  if (valEl) valEl.value = doc.dataValidade || '';
  if (obsEl) obsEl.value = doc.observacoes || '';

  const titModal = document.getElementById('form-doc-modal-title');
  if (titModal) titModal.textContent = '✏️ Editar Documento';

  if (typeof openM === 'function') openM('m-form-documento');
}

function salvarDocumentoModal() {
  if (typeof document === 'undefined') return;

  const id = document.getElementById('form-doc-id')?.value || '';
  const titulo = document.getElementById('form-doc-titulo')?.value || '';
  const pasta = document.getElementById('form-doc-pasta')?.value || 'familia';
  const tipoArquivo = document.getElementById('form-doc-tipo')?.value || 'pdf';
  const numeroDocumento = document.getElementById('form-doc-numero')?.value || '';
  const dataValidade = document.getElementById('form-doc-validade')?.value || '';
  const observacoes = document.getElementById('form-doc-observacoes')?.value || '';

  const res = salvarDocumentoFamilia({
    id,
    titulo,
    pasta,
    tipoArquivo,
    numeroDocumento,
    dataValidade,
    observacoes
  });

  if (res.ok && typeof closeM === 'function') {
    closeM('m-form-documento');
  }
}

function confirmarExcluirDocumentoModal(docId) {
  if (typeof confirm === 'function') {
    if (!confirm('Deseja excluir este documento da família?')) return;
  }
  excluirDocumentoFamilia(docId);
}

function aoSelecionarArquivoDocumento(event) {
  if (typeof document === 'undefined') return;
  const file = event && event.target && event.target.files ? event.target.files[0] : null;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    if (typeof exibirToastNotificacao === 'function') {
      exibirToastNotificacao(`Arquivo carregado: ${file.name}`, '📂');
    }
  };
  reader.readAsDataURL(file);
}

// ----------------------------------------------------------------------------
// CONTROLADORES DA GRADE HORÁRIA SEMANAL (DOM)
// ----------------------------------------------------------------------------

function renderGradeHorariaModal() {
  if (typeof document === 'undefined') return;

  const container = document.getElementById('grade-horaria-container');
  const pillsMembro = document.getElementById('grade-membros-pills');
  const pillsSemana = document.getElementById('grade-semanas-pills');

  // 1. Pílulas de filtro por membro
  if (pillsMembro) {
    pillsMembro.innerHTML = [
      { id: 'todos', nome: 'Todos da Casa' },
      ...(S.membrosPerfil || []).map(m => ({ id: m.id, nome: m.nome, cor: m.cor }))
    ].map(m => {
      const isSel = filtroMembroGradeAtivo === m.id;
      return `
        <button type="button" class="filtro-pill ${isSel ? 'sel' : ''}" style="${isSel ? 'background:var(--primary);color:#fff;' : ''}; font-size:11px; white-space:nowrap;" onclick="filtrarMembroGradeModal('${m.id}')">
          ${m.cor ? `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${m.cor};margin-right:4px;"></span>` : ''}
          ${escapeHtml(m.nome)}
        </button>
      `;
    }).join('');
  }

  // 2. Pílulas de semanas alternadas
  if (pillsSemana) {
    const semanas = [
      { id: 'todas', nome: 'Todas as Semanas' },
      { id: 'semana_a', nome: 'Semana A' },
      { id: 'semana_b', nome: 'Semana B' }
    ];
    pillsSemana.innerHTML = semanas.map(s => {
      const isSel = filtroSemanaAlternadaAtiva === s.id;
      return `
        <button type="button" class="filtro-pill ${isSel ? 'sel' : ''}" style="${isSel ? 'background:var(--primary);color:#fff;' : ''}; font-size:10px; white-space:nowrap;" onclick="filtrarSemanaAlternadaModal('${s.id}')">
          ${s.nome}
        </button>
      `;
    }).join('');
  }

  // 3. Grade agrupada por dias da semana
  if (!container) return;

  const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
  const itens = listarGradeHorariaFiltrada({
    membroId: filtroMembroGradeAtivo,
    semanaTipo: filtroSemanaAlternadaAtiva
  });

  if (itens.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:32px 16px; color:var(--muted);">
        <p style="font-size:32px; margin-bottom:8px;">🕒</p>
        <p style="font-weight:700; font-size:14px; margin-bottom:4px; color:var(--text);">Nenhuma atividade cadastrada</p>
        <p style="font-size:12px; margin:0 0 14px;">Organize horários escolares, esportes, idiomas e plantões da família.</p>
        <button type="button" class="btn btn-primary" onclick="abrirModalNovoItemGrade()">+ Nova Atividade</button>
      </div>
    `;
    return;
  }

  container.innerHTML = dias.map(d => {
    const itensDia = itens.filter(i => i.diaSemana === d);
    if (itensDia.length === 0) return '';

    return `
      <div class="card" style="margin-bottom:12px; padding:12px; background:var(--bg2);">
        <h4 style="margin:0 0 8px; font-size:13px; font-weight:800; color:var(--text); text-transform:uppercase;">${DIAS_SEMANA_LABELS[d]}</h4>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${itensDia.map(it => `
            <div style="background:var(--bg3); border-left:4px solid ${it.cor || 'var(--primary)'}; border-radius:6px; padding:8px 10px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <span style="font-size:11px; font-weight:800; color:${it.cor || 'var(--primary)'};">${escapeHtml(it.membroNome)}</span>
                  ${it.semanaAlternada !== 'todas' ? `<span style="font-size:9px; font-weight:700; padding:1px 5px; border-radius:4px; background:rgba(139,92,246,0.2); color:#c084fc;">${it.semanaAlternada.toUpperCase()}</span>` : ''}
                </div>
                <div style="font-size:13px; font-weight:700; color:var(--text); margin-top:2px;">${escapeHtml(it.titulo)}</div>
                <div style="font-size:11px; color:var(--muted); margin-top:2px;">
                  🕒 ${it.horaInicio} ${it.horaFim ? `às ${it.horaFim}` : ''} ${it.local ? `• 📍 ${escapeHtml(it.local)}` : ''}
                </div>
              </div>
              <div style="display:flex; gap:4px;">
                <button type="button" class="btn" style="padding:4px 8px; font-size:11px;" onclick="editarItemGradeModal('${it.id}')">✏️</button>
                <button type="button" class="btn" style="padding:4px 8px; font-size:11px; color:var(--red);" onclick="confirmarExcluirItemGradeModal('${it.id}')">🗑️</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function filtrarMembroGradeModal(membroId) {
  filtroMembroGradeAtivo = membroId;
  renderGradeHorariaModal();
}

function filtrarSemanaAlternadaModal(semanaTipo) {
  filtroSemanaAlternadaAtiva = semanaTipo;
  renderGradeHorariaModal();
}

function abrirModalGradeHoraria() {
  if (typeof document === 'undefined') return;
  filtroMembroGradeAtivo = 'todos';
  filtroSemanaAlternadaAtiva = 'todas';
  renderGradeHorariaModal();
  if (typeof openM === 'function') openM('m-grade-horaria');
}

function fecharModalGradeHoraria() {
  if (typeof closeM === 'function') closeM('m-grade-horaria');
}

function abrirModalNovoItemGrade() {
  if (typeof document === 'undefined') return;
  const idEl = document.getElementById('form-grade-id');
  const titEl = document.getElementById('form-grade-titulo');
  const membroEl = document.getElementById('form-grade-membro');
  const diaEl = document.getElementById('form-grade-dia');
  const inicioEl = document.getElementById('form-grade-inicio');
  const fimEl = document.getElementById('form-grade-fim');
  const localEl = document.getElementById('form-grade-local');
  const semEl = document.getElementById('form-grade-semana');

  if (idEl) idEl.value = '';
  if (titEl) titEl.value = '';
  if (membroEl) {
    membroEl.innerHTML = (S.membrosPerfil || []).map(m => `<option value="${m.id}">${escapeHtml(m.nome)}</option>`).join('');
    membroEl.value = S.membroAtivoId || (S.membrosPerfil[0] && S.membrosPerfil[0].id) || '';
  }
  if (diaEl) diaEl.value = 'segunda';
  if (inicioEl) inicioEl.value = '08:00';
  if (fimEl) fimEl.value = '09:00';
  if (localEl) localEl.value = '';
  if (semEl) semEl.value = 'todas';

  const titModal = document.getElementById('form-grade-modal-title');
  if (titModal) titModal.textContent = '✨ Nova Atividade na Grade Horária';

  if (typeof openM === 'function') openM('m-form-grade-horaria');
}

function editarItemGradeModal(itemId) {
  if (typeof document === 'undefined') return;
  const item = (S.gradeHoraria || []).find(g => g.id === itemId);
  if (!item) return;

  const idEl = document.getElementById('form-grade-id');
  const titEl = document.getElementById('form-grade-titulo');
  const membroEl = document.getElementById('form-grade-membro');
  const diaEl = document.getElementById('form-grade-dia');
  const inicioEl = document.getElementById('form-grade-inicio');
  const fimEl = document.getElementById('form-grade-fim');
  const localEl = document.getElementById('form-grade-local');
  const semEl = document.getElementById('form-grade-semana');

  if (idEl) idEl.value = item.id;
  if (titEl) titEl.value = item.titulo || '';
  if (membroEl) {
    membroEl.innerHTML = (S.membrosPerfil || []).map(m => `<option value="${m.id}" ${m.id === item.membroId ? 'selected' : ''}>${escapeHtml(m.nome)}</option>`).join('');
  }
  if (diaEl) diaEl.value = item.diaSemana || 'segunda';
  if (inicioEl) inicioEl.value = item.horaInicio || '08:00';
  if (fimEl) fimEl.value = item.horaFim || '';
  if (localEl) localEl.value = item.local || '';
  if (semEl) semEl.value = item.semanaAlternada || 'todas';

  const titModal = document.getElementById('form-grade-modal-title');
  if (titModal) titModal.textContent = '✏️ Editar Atividade na Grade';

  if (typeof openM === 'function') openM('m-form-grade-horaria');
}

function salvarItemGradeModal() {
  if (typeof document === 'undefined') return;

  const id = document.getElementById('form-grade-id')?.value || '';
  const titulo = document.getElementById('form-grade-titulo')?.value || '';
  const membroId = document.getElementById('form-grade-membro')?.value || S.membroAtivoId || 'm_1';
  const diaSemana = document.getElementById('form-grade-dia')?.value || 'segunda';
  const horaInicio = document.getElementById('form-grade-inicio')?.value || '08:00';
  const horaFim = document.getElementById('form-grade-fim')?.value || '';
  const local = document.getElementById('form-grade-local')?.value || '';
  const semanaAlternada = document.getElementById('form-grade-semana')?.value || 'todas';

  const res = salvarItemGradeHoraria({
    id,
    titulo,
    membroId,
    diaSemana,
    horaInicio,
    horaFim,
    local,
    semanaAlternada
  });

  if (res.ok && typeof closeM === 'function') {
    closeM('m-form-grade-horaria');
  }
}

function confirmarExcluirItemGradeModal(itemId) {
  if (typeof confirm === 'function') {
    if (!confirm('Deseja excluir esta atividade da grade horária?')) return;
  }
  excluirItemGradeHoraria(itemId);
}

function abrirModuloExplorar(moduloId) {
  if (moduloId === 'mensagens') {
    abrirModalChatFamilia();
    return;
  }
  if (moduloId === 'contatos') {
    abrirModalContatosFamilia();
    return;
  }
  if (moduloId === 'scanner_cupom') {
    abrirScannerCupom();
    return;
  }
  if (moduloId === 'beneficios') {
    abrirModalCarteirasBeneficio();
    return;
  }
  // Super-App Familiar v2.0 (Etapa 7)
  if (moduloId === 'refeicoes') {
    abrirModalRefeicoesFamilia('cardapio');
    return;
  }
  if (moduloId === 'receitas_cul') {
    abrirModalRefeicoesFamilia('receitas');
    return;
  }
  if (moduloId === 'documentos') {
    abrirModalDocumentosFamilia();
    return;
  }
  if (moduloId === 'horario' || moduloId === 'grade_horaria') {
    abrirModalGradeHoraria();
    return;
  }
  // Super-App Familiar v2.0 (Etapa 8 - Metas, Tetos, Simulador e Assinaturas)
  if (moduloId === 'metas_fam' || moduloId === 'metas') {
    abrirModalMetasFamilia();
    return;
  }
  if (moduloId === 'tetos_orcamento' || moduloId === 'tetos') {
    abrirModalTetosCategorias();
    return;
  }
  if (moduloId === 'simulador_dividas') {
    abrirModalSimuladorDividas();
    return;
  }
  if (moduloId === 'assinaturas_fixas') {
    abrirModalAssinaturasFixas();
    return;
  }
  const modDef = MODULOS_INICIO_CATALOGO.find(m => m.id === moduloId);
  if (modDef && modDef.telaAlvo && typeof go === 'function') {
    go(modDef.telaAlvo);
  }
}

// ============================================================================
// SUPER-APP FAMILIAR v2.0 - ETAPA 8: AGENTE NORTE 2.0 OMNISCIENTE & DIFERENCIAIS
// ============================================================================

/**
 * Construtor de Contexto Unificado e Seguro do Agente Norte 2.0.
 * Lê todos os módulos do Círculo Familiar (Agenda, Listas, Cardápio, Grade, Documentos, Finanças).
 * REGRA DE SEGURANÇA RLS: Se o membro for 'crianca', NUNCA expõe dados financeiros, dívidas,
 * saldos, VA/VR ou documentos da pasta 'privado'.
 */
function construirContextoAgenteNorte(membroId) {
  try {
    const mId = membroId || S.membroAtivoId || (S.membrosPerfil && S.membrosPerfil[0]?.id) || 'm_1';
    const membro = (S.membrosPerfil || []).find(m => m.id === mId) || { id: mId, papel: 'membro', nome: 'Familiar' };
    const isCrianca = membro.papel === 'crianca';

    const hojeStr = new Date().toISOString().slice(0, 10);
    const em7Dias = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

    // 1. Agenda e Eventos da Semana (próximos 7 dias)
    const eventosConsolidados = typeof obterEventosConsolidadosPeriodo === 'function'
      ? obterEventosConsolidadosPeriodo(hojeStr, em7Dias)
      : [];
    const eventosSemana = eventosConsolidados.filter(e => {
      const dt = (e.dataInicio || e.data || '').slice(0, 10);
      return dt >= hojeStr && dt <= em7Dias;
    });

    // Se for criança, o gasto previsto em R$ é estritamente ocultado (0)
    const totalGastoPrevistoEventos = isCrianca ? 0 : Math.round(
      eventosSemana.reduce((s, e) => s + (Number(e.gastoPrevisto) || 0), 0) * 100
    ) / 100;

    // 2. Listas de Compras e Tarefas
    const listaCompras = (S.listas || []).find(l => l.tipo === 'compras');
    const itensMercadoPendentes = listaCompras ? (listaCompras.itens || []).filter(i => !i.comprado).length : 0;

    const tarefasPendentes = (S.listas || []).filter(l => l.tipo === 'tarefas').flatMap(l => l.itens || []).filter(i => {
      if (i.concluida) return false;
      if (isCrianca) return i.responsavelId === membro.id || !i.responsavelId;
      return true;
    });

    // 3. Cardápio Semanal e Ingredientes Faltantes
    const ingredientesFaltantesCardapio = typeof obterIngredientesFaltantesCardapio === 'function'
      ? obterIngredientesFaltantesCardapio()
      : [];

    // 4. Grade Horária do Dia
    const diasMap = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const diaHojeNome = diasMap[new Date().getDay()] || 'segunda';
    const gradeHoje = (S.gradeHoraria || []).filter(g => {
      if (g.diaSemana !== diaHojeNome) return false;
      if (isCrianca && g.membroId !== membro.id) return false;
      return true;
    });

    // 5. Documentos com Alerta de Vencimento (<= 30 dias)
    let documentosAlertas = [];
    if (isCrianca) {
      const docsVis = typeof listarDocumentosVisiveisParaMembro === 'function'
        ? listarDocumentosVisiveisParaMembro(membro.id)
        : [];
      const hoje = new Date(hojeStr + 'T00:00:00');
      documentosAlertas = docsVis.filter(d => {
        if (!d.dataValidade || d.pasta === 'privado') return false;
        const dVal = new Date(d.dataValidade + 'T00:00:00');
        if (isNaN(dVal.getTime())) return false;
        const diff = Math.round((dVal.getTime() - hoje.getTime()) / 86400000);
        return diff <= 30;
      });
    } else {
      documentosAlertas = typeof obterAlertasDocumentosVencendo === 'function'
        ? obterAlertasDocumentosVencendo(30)
        : [];
    }

    // 6. Finanças, Contas a Vencer, Dívidas e Carteiras VA/VR (RLS estrito)
    let contasVencer7Dias = [];
    let totalContasVencer7Dias = 0;
    let cotasBeneficios = [];
    let fraseCotaBeneficios = '';
    let statusTetos = [];
    let alertaTetosTexto = '';
    let totaisFinanceiros = null;
    let metasFamilia = [];

    if (!isCrianca) {
      // Contas a vencer nos próximos 7 dias
      const contas = (S.gastos || []).filter(g => {
        if (g.pago || g.negociado || g.canceladaNegativacao || g.migradoDivida) return false;
        const dt = (g.data || '').slice(0, 10);
        return dt >= hojeStr && dt <= em7Dias;
      });
      contasVencer7Dias = contas.map(g => ({ id: g.id, desc: g.desc, val: Number(g.val) || 0, data: g.data }));
      totalContasVencer7Dias = Math.round(contasVencer7Dias.reduce((s, c) => s + c.val, 0) * 100) / 100;

      // Cotas diárias de VA / VR
      (S.carteirasBeneficio || []).forEach(c => {
        const met = typeof calcularMetricasCarteiraBeneficio === 'function'
          ? calcularMetricasCarteiraBeneficio(c.id)
          : null;
        if (met) {
          cotasBeneficios.push(met);
          if (!fraseCotaBeneficios && met.cotaDiaria > 0) {
            fraseCotaBeneficios = `🥗 Com o saldo atual de ${c.nome || c.tipo.toUpperCase()} (${fmt(met.saldoAtual)}), dá para gastar ${fmt(met.cotaDiaria)} por dia até a recarga do dia ${met.diaRecarga || 25}. `;
          }
        }
      });

      // Status dos Tetos de Categoria
      statusTetos = typeof calcularStatusTetosCategorias === 'function'
        ? calcularStatusTetosCategorias()
        : [];
      const tetosAlerta = statusTetos.filter(t => t.statusAlerta === 'atencao_80' || t.statusAlerta === 'estourado_100');
      if (tetosAlerta.length > 0) {
        alertaTetosTexto = `⚠️ Tetos de gastos em alerta: ${tetosAlerta.map(t => `${t.categoria} (${t.percentual}%)`).join(', ')}. `;
      }

      totaisFinanceiros = typeof calcTotais === 'function' ? calcTotais() : null;
      metasFamilia = S.metasFamilia || [];
    }

    // Montagem do Prompt textual para o Agente Norte
    let promptTexto = `Você é o Agente Norte 2.0, orientador familiar e financeiro de alta precisão.\n`;
    promptTexto += `Usuário: ${membro.nome} (papel: ${membro.papel}). Data hoje: ${hojeStr} (${diaHojeNome}).\n\n`;

    if (isCrianca) {
      promptTexto += `[BLINDAGEM RLS CRIANÇA ATIVA]\n`;
      promptTexto += `Você NÃO DEVE divulgar valores em dinheiro, contas, dívidas ou documentos confidenciais.\n`;
      promptTexto += `Concentre-se em incentivar a rotina, estudos e tarefas da casa.\n`;
      promptTexto += `- Tarefas pendentes: ${tarefasPendentes.length}.\n`;
      promptTexto += `- Compromissos da semana: ${eventosSemana.length}.\n`;
      promptTexto += `- Grade hoje: ${gradeHoje.map(g => `${g.horaInicio} ${g.titulo}`).join(', ') || 'Sem aulas hoje'}.\n`;
    } else {
      promptTexto += `[PANORAMA FAMILIAR E FINANCEIRO]\n`;
      promptTexto += `- Contas a vencer em 7 dias: ${fmt(totalContasVencer7Dias)} (${contasVencer7Dias.length} contas).\n`;
      promptTexto += `- Compromissos nos próximos 7 dias: ${eventosSemana.length} eventos (Gasto previsto: ${fmt(totalGastoPrevistoEventos)}).\n`;
      promptTexto += `- Lista de mercado: ${itensMercadoPendentes} itens pendentes.\n`;
      promptTexto += `- Ingredientes faltantes do cardápio: ${ingredientesFaltantesCardapio.length}.\n`;
      promptTexto += `- Documentos em alerta: ${documentosAlertas.length}.\n`;
      if (totaisFinanceiros) {
        promptTexto += `- Caixa Real: ${fmt(totaisFinanceiros.saldoCaixaReal ?? totaisFinanceiros.saldoReal)} | Saldo Projetado: ${fmt(totaisFinanceiros.saldoProjetado)} | Dívidas: ${fmt(totaisFinanceiros.totalDiv)}.\n`;
      }
      if (cotasBeneficios.length > 0) {
        promptTexto += `- Benefícios VA/VR: ${cotasBeneficios.map(b => `${b.nome}: saldo ${fmt(b.saldoAtual)}, cota ${fmt(b.cotaDiaria)}/dia até dia ${b.diaRecarga}`).join('; ')}.\n`;
      }
      if (metasFamilia.length > 0) {
        promptTexto += `- Metas: ${metasFamilia.map(m => `${m.titulo}: ${fmt(m.valorAtual)}/${fmt(m.valorAlvo)}`).join('; ')}.\n`;
      }
    }

    return {
      membro,
      isCrianca,
      hojeStr,
      diaHojeNome,
      eventosSemana,
      totalGastoPrevistoEventos,
      itensMercadoPendentes,
      tarefasPendentes,
      ingredientesFaltantesCardapio,
      gradeHoje,
      documentosAlertas,
      contasVencer7Dias,
      totalContasVencer7Dias,
      cotasBeneficios,
      fraseCotaBeneficios,
      statusTetos,
      alertaTetosTexto,
      totaisFinanceiros,
      metasFamilia,
      promptTexto
    };
  } catch (err) {
    console.error('Erro em construirContextoAgenteNorte:', err);
    return {
      membro: { id: membroId, papel: 'membro', nome: 'Familiar' },
      isCrianca: false,
      eventosSemana: [],
      totalGastoPrevistoEventos: 0,
      itensMercadoPendentes: 0,
      tarefasPendentes: [],
      ingredientesFaltantesCardapio: [],
      gradeHoje: [],
      documentosAlertas: [],
      contasVencer7Dias: [],
      totalContasVencer7Dias: 0,
      cotasBeneficios: [],
      fraseCotaBeneficios: '',
      statusTetos: [],
      alertaTetosTexto: '',
      totaisFinanceiros: null,
      metasFamilia: [],
      promptTexto: 'Erro ao gerar contexto.'
    };
  }
}

/**
 * Gera o Resumo Semanal da Família estruturado e acolhedor.
 */
function gerarResumoSemanalNorte(membroId) {
  const ctx = construirContextoAgenteNorte(membroId);
  if (ctx.isCrianca) {
    return `📅 Olá, ${ctx.membro.nome}! Esta semana você tem ${ctx.eventosSemana.length} compromissos agendados e ${ctx.tarefasPendentes.length} tarefas na rotina da casa. 🍽️ O cardápio semanal já está pronto com refeições planejadas e sua grade escolar está em dia! Bom aproveitamento da sua semana!`;
  }

  let texto = `📅 Esta semana vencem ${fmt(ctx.totalContasVencer7Dias)} em contas e há ${ctx.eventosSemana.length} eventos com gasto previsto de ${fmt(ctx.totalGastoPrevistoEventos)}. 🛒 Faltam ${ctx.itensMercadoPendentes} itens na lista de mercado e o cardápio precisa de ${ctx.ingredientesFaltantesCardapio.length} ingredientes que não estão nela. ${ctx.fraseCotaBeneficios || ''}${ctx.alertaTetosTexto || ''}`.trim();
  return texto;
}

/**
 * Motor determinístico local de respostas rápidas para o Agente Norte (offline-ready).
 */
function responderPerguntaNorteLocal(pergunta, membroId) {
  try {
    const ctx = construirContextoAgenteNorte(membroId);
    const p = String(pergunta || '').toLowerCase().trim();

    // 1. Resumo da Semana
    if (p.includes('resumo') || p.includes('semana') || p.includes('panorama') || p.includes('geral')) {
      return gerarResumoSemanalNorte(membroId);
    }

    // 2. Benefícios / VA / VR
    if (p.includes('va') || p.includes('vr') || p.includes('beneficio') || p.includes('alimentacao') || p.includes('refeicao') || p.includes('quanto posso gastar')) {
      if (ctx.isCrianca) {
        return '🔒 Informações financeiras sobre vales e benefícios são reservadas aos responsáveis da família.';
      }
      if (ctx.cotasBeneficios.length === 0) {
        return '🥗 Nenhuma carteira de benefício VA/VR cadastrada. Configure na aba Gastos > Carteiras VA/VR.';
      }
      let resp = '🥗 Cotas Diárias de Benefícios (VA / VR):\n';
      ctx.cotasBeneficios.forEach(b => {
        resp += `• ${b.nome} (${b.tipo.toUpperCase()}): Saldo de ${fmt(b.saldoAtual)} — Cota recomendada: ${fmt(b.cotaDiaria)}/dia até a recarga do dia ${b.diaRecarga} (${b.diasAteRecarga} dias restantes).\n`;
      });
      return resp.trim();
    }

    // 3. Cardápio / Ingredientes
    if (p.includes('cardapio') || p.includes('ingrediente') || p.includes('comprar') || p.includes('receita') || p.includes('mercado')) {
      if (ctx.ingredientesFaltantesCardapio.length === 0) {
        return '🛒 Boa notícia! Todos os ingredientes necessários para as receitas do cardápio semanal já estão na lista de compras ou em estoque!';
      }
      const nomes = ctx.ingredientesFaltantesCardapio.slice(0, 5).map(i => `${i.nome} (${i.quantidade} ${i.unidade})`).join(', ');
      return `🛒 Faltam ${ctx.ingredientesFaltantesCardapio.length} ingredientes do cardápio semanal que ainda não estão na lista de compras: ${nomes}${ctx.ingredientesFaltantesCardapio.length > 5 ? ' e mais...' : ''}. Abra o módulo de Refeições para adicioná-los automaticamente com 1 clique!`;
    }

    // 4. Simulador de Dívidas: Bola de Neve vs Avalanche
    if (p.includes('bola de neve') || p.includes('avalanche') || p.includes('divida') || p.includes('quitar') || p.includes('simular')) {
      if (ctx.isCrianca) {
        return '🔒 Informações financeiras sobre dívidas são restritas aos adultos da família.';
      }
      const sim = simularQuitacaoDividas(0);
      if (sim.bolaDeNeve.mesesParaQuitar === 0) {
        return '🎉 Parabéns! A família não possui dívidas ativas para simulação no momento.';
      }
      let resp = '⛄ Simulação de Quitação de Dívidas:\n';
      resp += `• Bola de Neve: Quitação em ${sim.bolaDeNeve.mesesParaQuitar} meses (Total: ${fmt(sim.bolaDeNeve.totalPago)}). Foco na motivação quitando as menores primeiro!\n`;
      resp += `• Avalanche: Quitação em ${sim.avalanche.mesesParaQuitar} meses (Total: ${fmt(sim.avalanche.totalPago)}). Economia de ${fmt(sim.avalanche.economiaJuros || (sim.bolaDeNeve.totalPago - sim.avalanche.totalPago))} em juros!\n`;
      resp += `💡 ${sim.recomendacao}`;
      return resp;
    }

    // 5. Metas da Família
    if (p.includes('meta') || p.includes('sonho') || p.includes('poupanca') || p.includes('objetivo')) {
      if (ctx.metasFamilia.length === 0) {
        return '🎯 A família ainda não cadastrou Metas & Sonhos no círculo. Defina um objetivo para acompanhar o progresso!';
      }
      if (ctx.isCrianca) {
        return `🎯 Nossas Metas da Família: ${ctx.metasFamilia.map(m => `${m.icone || '🎯'} ${m.titulo}`).join(', ')}. Vamos juntos conquistar cada uma delas!`;
      }
      let resp = '🎯 Progresso das Metas & Sonhos da Família:\n';
      ctx.metasFamilia.forEach(m => {
        const pct = m.valorAlvo > 0 ? Math.min(100, Math.round((m.valorAtual / m.valorAlvo) * 100)) : 0;
        resp += `• ${m.icone || '🎯'} ${m.titulo}: ${fmt(m.valorAtual)} de ${fmt(m.valorAlvo)} (${pct}% concluído)\n`;
      });
      return resp.trim();
    }

    // 6. Contas Fixas & Assinaturas
    if (p.includes('assinatura') || p.includes('fixa') || p.includes('recorrente') || p.includes('recorrencia')) {
      if (ctx.isCrianca) {
        return '🔒 Informações financeiras reservadas aos responsáveis.';
      }
      const fixas = typeof detectarAssinaturasEContasFixas === 'function' ? detectarAssinaturasEContasFixas() : { itens: [], totalMensalRecorrente: 0, totalAnualProjetado: 0 };
      return `🔄 A família possui ${fixas.itens.length} despesas fixas e assinaturas ativas, totalizando ${fmt(fixas.totalMensalRecorrente)}/mês (${fmt(fixas.totalAnualProjetado)}/ano). Abra o detector na aba Gastos para conferir oportunidades de corte!`;
    }

    // Fallback geral
    if (ctx.isCrianca) {
      return `Olá, ${ctx.membro.nome}! Posso ajudar você a conferir suas tarefas da casa, os horários das suas aulas e as refeições do cardápio semanal! O que gostaria de ver?`;
    }

    return `Olá, ${ctx.membro.nome}! Posso ajudar você com o Resumo Semanal, cotas de VA/VR, ingredientes do cardápio, simulador Bola de Neve vs Avalanche ou o progresso das metas familiares!`;
  } catch (err) {
    console.error('Erro em responderPerguntaNorteLocal:', err);
    return 'Desculpe, ocorreu um erro ao processar sua solicitação localmente.';
  }
}

// --- SEÇÃO 7.1: METAS E SONHOS DA FAMÍLIA ---

function salvarMetaFamilia(dados) {
  if (!dados || !dados.titulo || !String(dados.titulo).trim()) {
    return { ok: false, erro: 'Título da meta é obrigatório' };
  }
  const valorAlvo = Number(dados.valorAlvo) || 0;
  if (valorAlvo <= 0) {
    return { ok: false, erro: 'Valor alvo deve ser maior que zero' };
  }

  if (!Array.isArray(S.metasFamilia)) S.metasFamilia = [];

  const mAtivo = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
  const agoraIso = new Date().toISOString();
  let metaSalva = null;

  if (dados.id) {
    const idx = S.metasFamilia.findIndex(m => m.id === dados.id);
    if (idx >= 0) {
      S.metasFamilia[idx] = {
        ...S.metasFamilia[idx],
        titulo: String(dados.titulo).trim(),
        icone: dados.icone || S.metasFamilia[idx].icone || '🎯',
        valorAlvo: Math.round(valorAlvo * 100) / 100,
        prazo: dados.prazo || S.metasFamilia[idx].prazo || '',
        atualizadoEm: agoraIso
      };
      metaSalva = S.metasFamilia[idx];
    }
  }

  if (!metaSalva) {
    metaSalva = {
      id: 'meta_fam_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      circuloId: S.circuloAtivoId || 'circ_1',
      titulo: String(dados.titulo).trim(),
      icone: dados.icone || '🎯',
      valorAlvo: Math.round(valorAlvo * 100) / 100,
      valorAtual: Math.round((Number(dados.valorAtual) || 0) * 100) / 100,
      prazo: dados.prazo || '',
      aportes: [],
      criadoPor: mAtivo ? mAtivo.id : 'm_1',
      criadoEm: agoraIso
    };
    S.metasFamilia.push(metaSalva);
  }

  if (typeof registrarNotificacaoFamilia === 'function') {
    registrarNotificacaoFamilia({
      tipo: 'financas',
      titulo: 'Meta Familiar Atualizada',
      texto: `Meta "${metaSalva.titulo}" (${fmt(metaSalva.valorAlvo)}) ativa no círculo.`,
      valor: metaSalva.valorAlvo
    });
  }

  if (typeof enfileirarSync === 'function') {
    enfileirarSync('metas_familia', 'upsert', metaSalva);
  }

  if (typeof save === 'function') save();
  if (typeof render === 'function') render();
  return { ok: true, meta: metaSalva };
}

function aportarNaMetaFamilia(metaId, valor, origem = 'Salário', membroNome = '') {
  if (!metaId) return { ok: false, erro: 'ID da meta obrigatório' };
  const v = Number(valor) || 0;
  if (v <= 0) return { ok: false, erro: 'Valor do aporte deve ser maior que zero' };

  if (!Array.isArray(S.metasFamilia)) S.metasFamilia = [];
  const meta = S.metasFamilia.find(m => m.id === metaId);
  if (!meta) return { ok: false, erro: 'Meta familiar não encontrada' };

  const vAporte = Math.round(v * 100) / 100;
  meta.valorAtual = Math.round(((Number(meta.valorAtual) || 0) + vAporte) * 100) / 100;
  if (!Array.isArray(meta.aportes)) meta.aportes = [];

  const mAtivo = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
  const nomeAportante = membroNome || (mAtivo ? mAtivo.nome : 'Alex');

  const novoAporte = {
    id: 'ap_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    valor: vAporte,
    origem: origem || 'Salário',
    membroNome: nomeAportante,
    data: new Date().toISOString().slice(0, 10)
  };
  meta.aportes.push(novoAporte);

  if (typeof registrarNotificacaoFamilia === 'function') {
    registrarNotificacaoFamilia({
      tipo: 'financas',
      titulo: 'Novo Aporte em Meta Familiar',
      texto: `${nomeAportante} aportou ${fmt(vAporte)} na meta "${meta.titulo}". Saldo atual: ${fmt(meta.valorAtual)}.`,
      valor: vAporte
    });
  }

  if (typeof enfileirarSync === 'function') {
    enfileirarSync('metas_familia', 'upsert', meta);
  }

  if (typeof save === 'function') save();
  if (typeof render === 'function') render();
  return { ok: true, meta, novoSaldo: meta.valorAtual, aporte: novoAporte };
}

function excluirMetaFamilia(metaId) {
  if (!metaId) return { ok: false, erro: 'ID obrigatório' };
  if (!Array.isArray(S.metasFamilia)) return { ok: false, erro: 'Sem metas' };

  const meta = S.metasFamilia.find(m => m.id === metaId);
  if (!meta) return { ok: false, erro: 'Meta não encontrada' };

  S.metasFamilia = S.metasFamilia.filter(m => m.id !== metaId);

  if (typeof enfileirarSync === 'function') {
    enfileirarSync('metas_familia', 'delete', { id: metaId });
  }

  if (typeof save === 'function') save();
  if (typeof render === 'function') render();
  return { ok: true, id: metaId };
}

// --- SEÇÃO 7.2: LIMITES (TETOS) DE ORÇAMENTO POR CATEGORIA ---

function definirTetoCategoria(categoria, limiteMensal) {
  if (!categoria || typeof categoria !== 'string') return { ok: false, erro: 'Categoria inválida' };
  const catLimpa = categoria.trim();
  if (!Array.isArray(S.tetosCategorias)) S.tetosCategorias = [];

  const limite = Number(limiteMensal) || 0;
  if (limite <= 0) {
    S.tetosCategorias = S.tetosCategorias.filter(t => t.categoria !== catLimpa);
    if (typeof save === 'function') save();
    if (typeof render === 'function') render();
    return { ok: true, removido: true, categoria: catLimpa };
  }

  const limiteFormatado = Math.round(limite * 100) / 100;
  const existente = S.tetosCategorias.find(t => t.categoria === catLimpa);
  if (existente) {
    existente.limiteMensal = limiteFormatado;
  } else {
    S.tetosCategorias.push({ categoria: catLimpa, limiteMensal: limiteFormatado });
  }

  if (typeof save === 'function') save();
  if (typeof render === 'function') render();
  return { ok: true, teto: { categoria: catLimpa, limiteMensal: limiteFormatado } };
}

function calcularStatusTetosCategorias(mesYM) {
  if (!Array.isArray(S.tetosCategorias)) S.tetosCategorias = [];
  const ym = mesYM ? String(mesYM).slice(0, 7) : (mesAtual || new Date().toISOString().slice(0, 7));

  return S.tetosCategorias.map(teto => {
    let centavosGastos = 0;
    (S.gastos || []).forEach(g => {
      if (g.cat === teto.categoria && (g.data || '').slice(0, 7) === ym && !g.negociado && !g.canceladaNegativacao && !g.migradoDivida) {
        centavosGastos += Math.round((Number(g.val) || 0) * 100);
      }
    });

    (S.comprasCartao || []).forEach(cp => {
      if (cp.cat === teto.categoria && cp.mesFatura === ym && !cp.cancelada && !cp.canceladaNegativacao) {
        centavosGastos += Math.round((Number(cp.val) || 0) * 100);
      }
    });

    const gastoAtual = Math.round(centavosGastos) / 100;
    const limite = Number(teto.limiteMensal) || 0;
    const percentual = limite > 0 ? Math.round((gastoAtual / limite) * 100) : 0;

    let statusAlerta = 'normal';
    if (percentual >= 100) {
      statusAlerta = 'estourado_100';
    } else if (percentual >= 80) {
      statusAlerta = 'atencao_80';
    }

    const valorRestante = Math.max(0, Math.round((limite - gastoAtual) * 100) / 100);

    return {
      categoria: teto.categoria,
      limiteMensal: limite,
      gastoAtual,
      percentual,
      statusAlerta,
      valorRestante
    };
  });
}

// --- SEÇÃO 7.3: SIMULADOR DE QUITAÇÃO DE DÍVIDAS (BOLA DE NEVE VS AVALANCHE) ---

function simularQuitacaoDividas(aporteMensalExtra = 0) {
  const abertas = (S.dividas || []).filter(d => !d.quitada && (Number(d.saldo) || 0) > 0);
  if (abertas.length === 0) {
    return {
      bolaDeNeve: { mesesParaQuitar: 0, totalPago: 0, totalJuros: 0, economiaJuros: 0, ordemQuitacao: [] },
      avalanche: { mesesParaQuitar: 0, totalPago: 0, totalJuros: 0, economiaJuros: 0, ordemQuitacao: [] },
      recomendacao: 'Parabéns! Nenhuma dívida ativa para simular no momento.'
    };
  }

  const extra = Math.max(0, Number(aporteMensalExtra) || 0);

  function simularEstrategia(ordenacao) {
    let divs = abertas.map(d => ({
      credor: d.credor || 'Dívida',
      saldo: Number(d.saldo) || 0,
      juros: Number(d.juros) || 0,
      parcela: Number(d.parcela) || 0
    }));

    if (ordenacao === 'bola_de_neve') {
      divs.sort((a, b) => a.saldo - b.saldo);
    } else {
      divs.sort((a, b) => b.juros - a.juros);
    }

    // Calcula parcela mínima padrão para cada dívida
    divs.forEach(d => {
      if (d.parcela <= 0) {
        const jurosMin = d.saldo * (d.juros / 100);
        d.parcela = Math.max(50, Math.round((jurosMin + d.saldo * 0.03) * 100) / 100);
      }
    });

    let mes = 0;
    let totalJuros = 0;
    let totalPago = 0;
    const ordemQuitacao = [];
    let bolaNeveAcumulada = 0;

    while (divs.some(d => d.saldo > 0.01) && mes < 360) {
      mes++;
      // 1. Aplica juros do mês
      divs.forEach(d => {
        if (d.saldo > 0) {
          const j = Math.round(d.saldo * (d.juros / 100) * 100) / 100;
          totalJuros += j;
          d.saldo = Math.round((d.saldo + j) * 100) / 100;
        }
      });

      // 2. Amortização regular de parcelas
      divs.forEach(d => {
        if (d.saldo > 0) {
          const pag = Math.min(d.saldo, d.parcela);
          d.saldo = Math.round((d.saldo - pag) * 100) / 100;
          totalPago += pag;
          if (d.saldo <= 0) {
            bolaNeveAcumulada += d.parcela;
            if (!ordemQuitacao.some(o => o.credor === d.credor)) {
              ordemQuitacao.push({ credor: d.credor, mes });
            }
          }
        }
      });

      // 3. Aplica aporte extra + bola de neve acumulada na primeira dívida não quitada
      let extraDisponivel = extra + bolaNeveAcumulada;
      for (const d of divs) {
        if (d.saldo > 0 && extraDisponivel > 0) {
          const amortizar = Math.min(d.saldo, extraDisponivel);
          d.saldo = Math.round((d.saldo - amortizar) * 100) / 100;
          totalPago += amortizar;
          extraDisponivel -= amortizar;
          if (d.saldo <= 0) {
            bolaNeveAcumulada += d.parcela;
            if (!ordemQuitacao.some(o => o.credor === d.credor)) {
              ordemQuitacao.push({ credor: d.credor, mes });
            }
          }
        }
      }
    }

    return {
      mesesParaQuitar: mes,
      totalPago: Math.round(totalPago * 100) / 100,
      totalJuros: Math.round(totalJuros * 100) / 100,
      ordemQuitacao
    };
  }

  const bolaDeNeve = simularEstrategia('bola_de_neve');
  const avalanche = simularEstrategia('avalanche');

  const economiaJuros = Math.max(0, Math.round((bolaDeNeve.totalJuros - avalanche.totalJuros) * 100) / 100);
  bolaDeNeve.economiaJuros = 0;
  avalanche.economiaJuros = economiaJuros;

  let recomendacao = '';
  if (economiaJuros > 0) {
    const mesesDif = bolaDeNeve.mesesParaQuitar - avalanche.mesesParaQuitar;
    const tempoTxt = mesesDif > 0 ? ` e quita ${mesesDif} mês(es) antes` : '';
    const primeiraQuitada = bolaDeNeve.ordemQuitacao[0]?.credor || 'a primeira dívida';
    recomendacao = `A estratégia Avalanche é matematicamente recomendada: você economiza ${fmt(economiaJuros)} em juros${tempoTxt}. A Bola de Neve é indicada se a família busca motivação imediata, quitando '${primeiraQuitada}' já no início.`;
  } else {
    recomendacao = 'Ambas as estratégias (Avalanche e Bola de Neve) apresentam resultado equivalente no montante de juros para o perfil atual das dívidas.';
  }

  return {
    bolaDeNeve,
    avalanche,
    recomendacao
  };
}

// --- SEÇÃO 7.4: DETECTOR DE CONTAS FIXAS E ASSINATURAS RECORRENTES ---

function detectarAssinaturasEContasFixas() {
  const itens = [];
  const vistos = new Set();

  (S.gastos || []).forEach(g => {
    if ((g.recorrente === true || g.cat === 'recorrente') && !g.canceladaNegativacao && !g.migradoDivida) {
      const chave = g.grupoId ? `g_grupo_${g.grupoId}` : `g_desc_${g.desc}_${g.val}`;
      if (!vistos.has(chave)) {
        vistos.add(chave);
        itens.push({
          id: g.id,
          nome: g.descOriginal || g.desc || 'Despesa Recorrente',
          valor: Number(g.val) || 0,
          tipo: 'conta_fixa',
          origem: 'Salário / Conta Corrente',
          titular: g.titular || '',
          categoria: g.cat || 'recorrente'
        });
      }
    }
  });

  (S.comprasCartao || []).forEach(c => {
    if ((c.recorrente === true || (c.id && String(c.id).startsWith('crec_'))) && !c.cancelada && !c.canceladaNegativacao) {
      const chave = c.recorrenteId ? `cartao_rec_${c.recorrenteId}` : `cartao_${c.desc}_${c.val}`;
      if (!vistos.has(chave)) {
        vistos.add(chave);
        const cartao = (S.cartoes || []).find(x => x.id === c.cartaoId);
        itens.push({
          id: c.id,
          nome: c.desc || 'Assinatura no Cartão',
          valor: Number(c.val) || 0,
          tipo: 'assinatura_cartao',
          origem: cartao ? cartao.nome : 'Cartão de Crédito',
          titular: c.titular || (cartao ? cartao.titular : ''),
          categoria: c.cat || 'servicos'
        });
      }
    }
  });

  const totalMensalRecorrente = Math.round(itens.reduce((s, x) => s + (Number(x.valor) || 0), 0) * 100) / 100;
  const totalAnualProjetado = Math.round(totalMensalRecorrente * 12 * 100) / 100;

  return {
    itens,
    totalMensalRecorrente,
    totalAnualProjetado,
    quantidade: itens.length
  };
}

// --- RENDERIZADORES E HANDLERS DE MODAL DA ETAPA 8 ---

function renderMetasFamiliaModal() {
  if (typeof document === 'undefined') return;
  const listaEl = document.getElementById('lista-metas-familia-modal');
  if (!listaEl) return;

  const mAtivo = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
  if (mAtivo && mAtivo.papel === 'crianca') {
    listaEl.innerHTML = `
      <div style="text-align:center; padding:24px 16px; color:var(--muted);">
        <p style="font-size:32px; margin-bottom:8px;">🔒</p>
        <p style="font-weight:700; color:var(--text); margin-bottom:4px;">Área Restrita aos Responsáveis</p>
        <p style="font-size:12px;">Os valores das metas financeiras são gerenciados pelos adultos da família.</p>
      </div>
    `;
    return;
  }

  const metas = S.metasFamilia || [];
  if (metas.length === 0) {
    listaEl.innerHTML = `
      <div style="text-align:center; padding:32px 16px; color:var(--muted);">
        <p style="font-size:32px; margin-bottom:8px;">🎯</p>
        <p style="font-weight:700; color:var(--text); margin-bottom:4px;">Nenhuma meta cadastrada</p>
        <p style="font-size:12px; margin-bottom:14px;">Crie metas conjuntas como Reserva de Emergência ou Viagem de Férias.</p>
        <button type="button" class="btn btn-primary" onclick="abrirModalNovaMetaFamilia()" style="max-width:200px; margin:0 auto;">+ Nova Meta</button>
      </div>
    `;
    return;
  }

  listaEl.innerHTML = metas.map(m => {
    const pct = m.valorAlvo > 0 ? Math.min(100, Math.round((m.valorAtual / m.valorAlvo) * 100)) : 0;
    const falta = Math.max(0, Math.round((m.valorAlvo - m.valorAtual) * 100) / 100);
    const aportes = m.aportes || [];
    const ultimosAportes = aportes.slice(-3).reverse();

    return `
      <div class="card" style="margin-bottom:12px; border:1px solid var(--border); padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:24px;">${m.icone || '🎯'}</span>
            <div>
              <p style="font-weight:700; font-size:15px; margin:0;">${escapeHtml(m.titulo)}</p>
              ${m.prazo ? `<span style="font-size:11px; color:var(--muted);">📅 Prazo: ${m.prazo.split('-').reverse().join('/')}</span>` : ''}
            </div>
          </div>
          <button type="button" class="item-del" style="font-size:18px;" onclick="confirmarExcluirMetaFamiliaModal('${m.id}')">×</button>
        </div>

        <div class="prog-wrap" style="margin-bottom:8px;">
          <div class="prog-row" style="font-size:12px; margin-bottom:4px;">
            <span style="font-weight:700; color:var(--green);">${fmt(m.valorAtual)}</span>
            <span style="color:var(--muted);">de ${fmt(m.valorAlvo)} (${pct}%)</span>
          </div>
          <div class="prog-bar" style="height:8px;">
            <div class="prog-fill" style="width:${pct}%; background:var(--green);"></div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--muted); margin-bottom:10px;">
          <span>${falta > 0 ? `Faltam ${fmt(falta)}` : '🎉 Meta atingida!'}</span>
          <span>${aportes.length} aporte(s)</span>
        </div>

        ${ultimosAportes.length > 0 ? `
          <div style="background:var(--bg3); border-radius:6px; padding:8px; margin-bottom:10px; font-size:11px;">
            <p style="font-weight:700; margin:0 0 4px; color:var(--muted);">Últimos Aportes:</p>
            ${ultimosAportes.map(a => `
              <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                <span>${escapeHtml(a.membroNome || 'Família')} (${a.data ? a.data.split('-').reverse().slice(0, 2).join('/') : ''}):</span>
                <span style="font-weight:600; color:var(--green);">+${fmt(a.valor)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <button type="button" class="btn btn-g" style="padding:8px; font-size:12px; font-weight:700;" onclick="abrirModalAportarMeta('${m.id}')">
          + Registrar Aporte
        </button>
      </div>
    `;
  }).join('');
}

function abrirModalMetasFamilia() {
  const mAtivo = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
  if (mAtivo && mAtivo.papel === 'crianca') {
    if (typeof alert === 'function') alert('Área de metas financeiras restrita aos responsáveis da família.');
    return;
  }
  renderMetasFamiliaModal();
  if (typeof openM === 'function') openM('m-metas-familia');
}

function fecharModalMetasFamilia() {
  if (typeof closeM === 'function') closeM('m-metas-familia');
}

function abrirModalNovaMetaFamilia() {
  if (typeof document === 'undefined') return;
  const tEl = document.getElementById('form-meta-titulo');
  const vEl = document.getElementById('form-meta-alvo');
  const pEl = document.getElementById('form-meta-prazo');
  const iEl = document.getElementById('form-meta-icone');
  if (tEl) tEl.value = '';
  if (vEl) vEl.value = '';
  if (pEl) pEl.value = '';
  if (iEl) iEl.value = '🎯';
  if (typeof openM === 'function') openM('m-form-meta-familia');
}

function salvarMetaFamiliaModal() {
  if (typeof document === 'undefined') return;
  const titulo = document.getElementById('form-meta-titulo')?.value || '';
  const valorAlvo = parseFloat(document.getElementById('form-meta-alvo')?.value || '0');
  const prazo = document.getElementById('form-meta-prazo')?.value || '';
  const icone = document.getElementById('form-meta-icone')?.value || '🎯';

  const res = salvarMetaFamilia({ titulo, valorAlvo, prazo, icone });
  if (res.ok) {
    if (typeof closeM === 'function') closeM('m-form-meta-familia');
    renderMetasFamiliaModal();
  } else if (typeof alert === 'function') {
    alert(res.erro || 'Erro ao salvar meta');
  }
}

function abrirModalAportarMeta(metaId) {
  if (typeof document === 'undefined') return;
  const idEl = document.getElementById('form-aporte-meta-id');
  const vEl = document.getElementById('form-aporte-valor');
  const oEl = document.getElementById('form-aporte-origem');
  if (idEl) idEl.value = metaId;
  if (vEl) vEl.value = '';
  if (oEl) oEl.value = 'Salário';

  const meta = (S.metasFamilia || []).find(m => m.id === metaId);
  const titEl = document.getElementById('form-aporte-meta-nome');
  if (titEl && meta) titEl.textContent = `Meta: ${meta.titulo}`;

  if (typeof openM === 'function') openM('m-form-aporte-meta');
}

function confirmarAporteMetaModal() {
  if (typeof document === 'undefined') return;
  const metaId = document.getElementById('form-aporte-meta-id')?.value || '';
  const valor = parseFloat(document.getElementById('form-aporte-valor')?.value || '0');
  const origem = document.getElementById('form-aporte-origem')?.value || 'Salário';

  const res = aportarNaMetaFamilia(metaId, valor, origem);
  if (res.ok) {
    if (typeof closeM === 'function') closeM('m-form-aporte-meta');
    renderMetasFamiliaModal();
  } else if (typeof alert === 'function') {
    alert(res.erro || 'Erro ao registrar aporte');
  }
}

function confirmarExcluirMetaFamiliaModal(metaId) {
  if (typeof confirm === 'function') {
    if (!confirm('Deseja excluir esta meta familiar?')) return;
  }
  excluirMetaFamilia(metaId);
  renderMetasFamiliaModal();
}

function renderTetosCategoriasModal() {
  if (typeof document === 'undefined') return;
  const listaEl = document.getElementById('lista-tetos-categorias-modal');
  if (!listaEl) return;

  const status = calcularStatusTetosCategorias();

  // Atualiza select de categorias disponíveis
  const selCat = document.getElementById('form-teto-categoria');
  if (selCat) {
    const cats = S.categoriasGastos || DEFAULT_CATEGORIAS_GASTOS;
    selCat.innerHTML = cats.map(c => `<option value="${c.id}">${escapeHtml(c.nome)}</option>`).join('');
  }

  if (status.length === 0) {
    listaEl.innerHTML = `
      <div style="text-align:center; padding:24px 16px; color:var(--muted);">
        <p style="font-size:28px; margin-bottom:8px;">🎯</p>
        <p style="font-weight:700; color:var(--text); margin-bottom:4px;">Nenhum teto configurado</p>
        <p style="font-size:12px;">Defina um limite mensal para receber alertas preventivos de 80% e 100%.</p>
      </div>
    `;
    return;
  }

  listaEl.innerHTML = status.map(t => {
    let corBadge = 'var(--green)';
    let textoBadge = 'Normal';
    let corBarra = 'var(--green)';

    if (t.statusAlerta === 'estourado_100') {
      corBadge = 'var(--red)';
      textoBadge = '🚨 Estourado!';
      corBarra = 'var(--red)';
    } else if (t.statusAlerta === 'atencao_80') {
      corBadge = 'var(--yellow)';
      textoBadge = '⚠️ Atenção 80%';
      corBarra = 'var(--yellow)';
    }

    const catObj = (S.categoriasGastos || []).find(c => c.id === t.categoria) || { nome: t.categoria };

    return `
      <div class="card" style="margin-bottom:10px; padding:12px; border:1px solid var(--border);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div>
            <span style="font-weight:700; font-size:14px;">${escapeHtml(catObj.nome)}</span>
            <span style="margin-left:6px; font-size:10px; font-weight:700; color:${corBadge}; background:rgba(0,0,0,0.15); padding:2px 6px; border-radius:10px;">${textoBadge}</span>
          </div>
          <button type="button" class="item-del" style="font-size:18px;" onclick="removerTetoCategoriaModal('${t.categoria}')">×</button>
        </div>

        <div class="prog-wrap" style="margin-bottom:6px;">
          <div class="prog-row" style="font-size:12px; margin-bottom:4px;">
            <span>${fmt(t.gastoAtual)}</span>
            <span style="color:var(--muted);">de ${fmt(t.limiteMensal)} (${t.percentual}%)</span>
          </div>
          <div class="prog-bar" style="height:6px;">
            <div class="prog-fill" style="width:${Math.min(100, t.percentual)}%; background:${corBarra};"></div>
          </div>
        </div>

        <p style="font-size:11px; color:var(--muted); margin:0;">
          ${t.valorRestante > 0 ? `Restam ${fmt(t.valorRestante)} disponíveis este mês` : `Excedido em ${fmt(Math.abs(t.gastoAtual - t.limiteMensal))}`}
        </p>
      </div>
    `;
  }).join('');
}

function abrirModalTetosCategorias() {
  const mAtivo = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
  if (mAtivo && mAtivo.papel === 'crianca') {
    if (typeof alert === 'function') alert('Configuração de tetos restrita aos adultos.');
    return;
  }
  renderTetosCategoriasModal();
  if (typeof openM === 'function') openM('m-tetos-categorias');
}

function fecharModalTetosCategorias() {
  if (typeof closeM === 'function') closeM('m-tetos-categorias');
}

function salvarTetoCategoriaModal() {
  if (typeof document === 'undefined') return;
  const categoria = document.getElementById('form-teto-categoria')?.value || '';
  const limite = parseFloat(document.getElementById('form-teto-limite')?.value || '0');

  const res = definirTetoCategoria(categoria, limite);
  if (res.ok) {
    const limEl = document.getElementById('form-teto-limite');
    if (limEl) limEl.value = '';
    renderTetosCategoriasModal();
  } else if (typeof alert === 'function') {
    alert(res.erro || 'Erro ao definir teto');
  }
}

function removerTetoCategoriaModal(cat) {
  definirTetoCategoria(cat, 0);
  renderTetosCategoriasModal();
}

function renderSimuladorDividasModal(resultado) {
  if (typeof document === 'undefined') return;
  const resEl = document.getElementById('resultado-simulador-dividas');
  if (!resEl) return;

  const sim = resultado || simularQuitacaoDividas(0);
  const b = sim.bolaDeNeve;
  const a = sim.avalanche;

  resEl.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
      <div class="card" style="padding:12px; border:1px solid rgba(59,130,246,0.3); background:rgba(59,130,246,0.06);">
        <p style="font-weight:700; font-size:13px; color:var(--blue); margin:0 0 6px;">⛄ Bola de Neve</p>
        <p style="font-size:11px; color:var(--muted); margin:0 0 2px;">Prazo Total</p>
        <p style="font-size:16px; font-weight:800; margin:0 0 6px;">${b.mesesParaQuitar} meses</p>
        <p style="font-size:11px; color:var(--muted); margin:0 0 2px;">Total Pago</p>
        <p style="font-size:13px; font-weight:700; color:var(--text); margin:0 0 6px;">${fmt(b.totalPago)}</p>
        <span style="font-size:10px; background:rgba(59,130,246,0.15); color:var(--blue); padding:2px 6px; border-radius:8px;">Foco Motivacional</span>
      </div>

      <div class="card" style="padding:12px; border:1px solid rgba(16,185,129,0.3); background:rgba(16,185,129,0.06);">
        <p style="font-weight:700; font-size:13px; color:var(--green); margin:0 0 6px;">🏔️ Avalanche</p>
        <p style="font-size:11px; color:var(--muted); margin:0 0 2px;">Prazo Total</p>
        <p style="font-size:16px; font-weight:800; margin:0 0 6px;">${a.mesesParaQuitar} meses</p>
        <p style="font-size:11px; color:var(--muted); margin:0 0 2px;">Total Pago</p>
        <p style="font-size:13px; font-weight:700; color:var(--text); margin:0 0 6px;">${fmt(a.totalPago)}</p>
        <span style="font-size:10px; background:rgba(16,185,129,0.15); color:var(--green); padding:2px 6px; border-radius:8px;">Economia Máxima</span>
      </div>
    </div>

    ${a.economiaJuros > 0 ? `
      <div style="background:rgba(16,185,129,0.15); border:1px solid var(--green); border-radius:var(--radius-sm); padding:10px; margin-bottom:12px; text-align:center;">
        <p style="font-size:12px; font-weight:700; color:var(--green); margin:0;">
          💰 A Avalanche economiza ${fmt(a.economiaJuros)} em juros!
        </p>
      </div>
    ` : ''}

    <div class="card" style="padding:12px; background:var(--bg3); border-radius:var(--radius-sm); margin-bottom:12px;">
      <p style="font-weight:700; font-size:12px; color:var(--muted); margin:0 0 6px;">💡 RECOMENDAÇÃO DO AGENTE NORTE:</p>
      <p style="font-size:13px; line-height:1.4; margin:0;">${escapeHtml(sim.recomendacao)}</p>
    </div>
  `;
}

function abrirModalSimuladorDividas() {
  const mAtivo = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
  if (mAtivo && mAtivo.papel === 'crianca') {
    if (typeof alert === 'function') alert('Simulador de dívidas restrito aos adultos.');
    return;
  }
  renderSimuladorDividasModal();
  if (typeof openM === 'function') openM('m-simulador-dividas');
}

function fecharModalSimuladorDividas() {
  if (typeof closeM === 'function') closeM('m-simulador-dividas');
}

function calcularSimulacaoDividasModal() {
  if (typeof document === 'undefined') return;
  const extra = parseFloat(document.getElementById('simulador-aporte-extra')?.value || '0');
  const res = simularQuitacaoDividas(extra);
  renderSimuladorDividasModal(res);
}

function renderAssinaturasFixasModal() {
  if (typeof document === 'undefined') return;
  const listaEl = document.getElementById('lista-assinaturas-fixas-modal');
  const resumoEl = document.getElementById('resumo-assinaturas-fixas-modal');
  if (!listaEl) return;

  const dados = detectarAssinaturasEContasFixas();

  if (resumoEl) {
    resumoEl.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
        <div class="card" style="padding:12px; text-align:center;">
          <p style="font-size:11px; color:var(--muted); margin:0 0 2px;">Custo Fixo Mensal</p>
          <p style="font-size:18px; font-weight:800; color:var(--red); margin:0;">${fmt(dados.totalMensalRecorrente)}</p>
        </div>
        <div class="card" style="padding:12px; text-align:center;">
          <p style="font-size:11px; color:var(--muted); margin:0 0 2px;">Projeção Anual</p>
          <p style="font-size:18px; font-weight:800; color:var(--yellow); margin:0;">${fmt(dados.totalAnualProjetado)}</p>
        </div>
      </div>
    `;
  }

  if (dados.itens.length === 0) {
    listaEl.innerHTML = `
      <div style="text-align:center; padding:24px 16px; color:var(--muted);">
        <p style="font-size:28px; margin-bottom:8px;">🔍</p>
        <p style="font-weight:700; color:var(--text); margin-bottom:4px;">Nenhuma assinatura detectada</p>
        <p style="font-size:12px;">Gastos fixos ou compras de cartão recorrentes aparecerão aqui.</p>
      </div>
    `;
    return;
  }

  listaEl.innerHTML = dados.itens.map(item => `
    <div class="item-row" style="margin-bottom:8px; padding:10px; border-radius:8px; background:var(--bg3);">
      <div style="flex:1;">
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-weight:700; font-size:13px;">${escapeHtml(item.nome)}</span>
          <span class="badge ${item.tipo === 'assinatura_cartao' ? 'b-parc' : 'b-rec'}">${item.tipo === 'assinatura_cartao' ? 'Cartão' : 'Conta'}</span>
          ${item.titular ? `<span class="badge b-titular">${escapeHtml(item.titular)}</span>` : ''}
        </div>
        <span style="font-size:11px; color:var(--muted);">${escapeHtml(item.origem)}</span>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:700; color:var(--red); font-size:14px;">${fmt(item.valor)}/mês</span>
        <p style="font-size:10px; color:var(--muted); margin:2px 0 0;">${fmt(item.valor * 12)}/ano</p>
      </div>
    </div>
  `).join('');
}

function abrirModalAssinaturasFixas() {
  const mAtivo = typeof obterMembroAtivo === 'function' ? obterMembroAtivo() : null;
  if (mAtivo && mAtivo.papel === 'crianca') {
    if (typeof alert === 'function') alert('Acesso restrito aos adultos.');
    return;
  }
  renderAssinaturasFixasModal();
  if (typeof openM === 'function') openM('m-assinaturas-fixas');
}

function fecharModalAssinaturasFixas() {
  if (typeof closeM === 'function') closeM('m-assinaturas-fixas');
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
  // Super-App Familiar v2.0 - Listas & Tarefas (Etapa 2)
  window.CATEGORIAS_MERCADO = CATEGORIAS_MERCADO;
  window.criarListaFamiliar = criarListaFamiliar;
  window.excluirListaFamiliar = excluirListaFamiliar;
  window.adicionarNaFilaSync = adicionarNaFilaSync;
  window.dispararNotificacaoAgrupadaItens = dispararNotificacaoAgrupadaItens;
  window.adicionarItemLista = adicionarItemLista;
  window.calcularProximoPrazoRecorrente = calcularProximoPrazoRecorrente;
  window.toggleItemLista = toggleItemLista;
  window.excluirItemLista = excluirItemLista;
  window.readicionarItemFrequente = readicionarItemFrequente;
  window.converterListaEmGasto = converterListaEmGasto;
  window.calcularResumoLista = calcularResumoLista;
  window.abrirModuloFamiliar = abrirModuloFamiliar;
  window.abrirListaDetalhe = abrirListaDetalhe;
  window.fecharListaDetalhe = fecharListaDetalhe;
  window.filtrarTipoListas = filtrarTipoListas;
  window.filtrarMembroTarefas = filtrarMembroTarefas;
  window.abrirModalNovaLista = abrirModalNovaLista;
  window.atualizarOpcoesNovaListaModal = atualizarOpcoesNovaListaModal;
  window.selecionarIconeNovaLista = selecionarIconeNovaLista;
  window.selecionarCorNovaLista = selecionarCorNovaLista;
  window.salvarNovaListaModal = salvarNovaListaModal;
  window.adicionarItemCompraModal = adicionarItemCompraModal;
  window.adicionarTarefaModal = adicionarTarefaModal;
  window.abrirModalConverterGastoLista = abrirModalConverterGastoLista;
  window.confirmarConverterGastoModal = confirmarConverterGastoModal;
  window.confirmarExcluirListaAtual = confirmarExcluirListaAtual;
  window.excluirListaAtualDetalhe = excluirListaAtualDetalhe;
  window.selecionarTipoNovaLista = selecionarTipoNovaLista;
  window.renderListas = renderListas;
  // Super-App Familiar v2.0 - Calendário Pro v2.1 (Etapa 3)
  window.CORES_CALENDARIO = CORES_CALENDARIO;
  window.CORES_EVENTO_NOMEADAS = CORES_EVENTO_NOMEADAS;
  window.obterNomeCorEvento = obterNomeCorEvento;
  window.FERIADOS_BRASIL = FERIADOS_BRASIL;
  window.calcularPascoa = calcularPascoa;
  window.obterFeriadosBrasilAno = obterFeriadosBrasilAno;
  window.membroAtualPodeVerFinancas = membroAtualPodeVerFinancas;
  window.obterEventosConsolidadosPeriodo = obterEventosConsolidadosPeriodo;
  window.criarEventoCalendario = criarEventoCalendario;
  window.editarEventoCalendario = editarEventoCalendario;
  window.excluirEventoCalendario = excluirEventoCalendario;
  window.curtirEventoCalendario = curtirEventoCalendario;
  window.adicionarComentarioEventoCalendario = adicionarComentarioEventoCalendario;
  window.preencherEventoPorTextoIA = preencherEventoPorTextoIA;
  window.buscarEventosCalendario = buscarEventosCalendario;
  window.salvarConfigCalendario = salvarConfigCalendario;
  window.limparEventosAntigosCalendario = limparEventosAntigosCalendario;
  window.adicionarAniversariante = adicionarAniversariante;
  window.excluirAniversariante = excluirAniversariante;
  window.calcularProximoAniversario = calcularProximoAniversario;
  window.importarEventosICal = importarEventosICal;
  window.setVisaoCalendario = setVisaoCalendario;
  window.mudarPeriodoCalendario = mudarPeriodoCalendario;
  window.filtrarCalendarioMembro = filtrarCalendarioMembro;
  window.toggleCamadaCalendario = toggleCamadaCalendario;
  window.abrirDiaCalendario = abrirDiaCalendario;
  window.adicionarEventoNoDiaModal = adicionarEventoNoDiaModal;
  window.abrirModalEventoCalendario = abrirModalEventoCalendario;
  window.renderParticipantesAvataresEventoModal = renderParticipantesAvataresEventoModal;
  window.toggleParticipanteAvatarModal = toggleParticipanteAvatarModal;
  window.toggleTodosParticipantesEventoModal = toggleTodosParticipantesEventoModal;
  window.renderCoresNomeadasEventoModal = renderCoresNomeadasEventoModal;
  window.selecionarCorEventoNomeada = selecionarCorEventoNomeada;
  window.renderLembretesEventoForm = renderLembretesEventoForm;
  window.adicionarLembreteEventoForm = adicionarLembreteEventoForm;
  window.removerLembreteEventoForm = removerLembreteEventoForm;
  window.toggleDiaInteiroEventoModal = toggleDiaInteiroEventoModal;
  window.toggleParticipanteEventoModal = toggleParticipanteEventoModal;
  window.selecionarCorEventoModal = selecionarCorEventoModal;
  window.salvarEventoCalendarioModal = salvarEventoCalendarioModal;
  window.excluirEventoCalendarioModal = excluirEventoCalendarioModal;
  window.abrirDetalheEventoCalendario = abrirDetalheEventoCalendario;
  window.fecharDetalheEventoCalendario = fecharDetalheEventoCalendario;
  window.renderDetalheEventoModal = renderDetalheEventoModal;
  window.editarEventoAtualModal = editarEventoAtualModal;
  window.confirmarExcluirEventoAtualModal = confirmarExcluirEventoAtualModal;
  window.curtirEventoAtualDetalhe = curtirEventoAtualDetalhe;
  window.enviarComentarioEventoDetalhe = enviarComentarioEventoDetalhe;
  window.abrirModalConfigCalendario = abrirModalConfigCalendario;
  window.fecharModalConfigCalendario = fecharModalConfigCalendario;
  window.salvarConfigCalendarioModal = salvarConfigCalendarioModal;
  window.executarLimpezaEventosAntigosModal = executarLimpezaEventosAntigosModal;
  window.abrirModalBuscaCalendario = abrirModalBuscaCalendario;
  window.fecharModalBuscaCalendario = fecharModalBuscaCalendario;
  window.executarBuscaCalendarioModal = executarBuscaCalendarioModal;
  window.abrirModalParserTextoIA = abrirModalParserTextoIA;
  window.fecharModalParserTextoIA = fecharModalParserTextoIA;
  window.processarParserTextoIAModal = processarParserTextoIAModal;
  window.abrirModalAniversarios = abrirModalAniversarios;
  window.salvarAniversarianteModal = salvarAniversarianteModal;
  window.excluirAniversarianteModal = excluirAniversarianteModal;
  window.abrirModalImportarICal = abrirModalImportarICal;
  window.lerArquivoICal = lerArquivoICal;
  window.confirmarImportarICalModal = confirmarImportarICalModal;
  window.obterNumeroSemanaISO = obterNumeroSemanaISO;
  window.renderCalendario = renderCalendario;
  // Super-App Familiar v2.0 - Carteiras VA/VR & Orçamento (Etapa 4)
  window.obterDiasNoMes = obterDiasNoMes;
  window.obterDataRecargaNoMes = obterDataRecargaNoMes;
  window.calcularMetricasCarteiraBeneficio = calcularMetricasCarteiraBeneficio;
  window.processarRecargasBeneficiosAutomaticas = processarRecargasBeneficiosAutomaticas;
  window.creditarRecargaManual = creditarRecargaManual;
  window.calcularDivisaoPagamentoBeneficio = calcularDivisaoPagamentoBeneficio;
  window.registrarGastoComBeneficio = registrarGastoComBeneficio;
  window.estornarBeneficioDeGasto = estornarBeneficioDeGasto;
  window.criarOuEditarCarteiraBeneficio = criarOuEditarCarteiraBeneficio;
  window.excluirCarteiraBeneficio = excluirCarteiraBeneficio;
  window.delGasto = delGasto;
  window.abrirModalCarteirasBeneficio = abrirModalCarteirasBeneficio;
  window.setTabBeneficios = setTabBeneficios;
  window.renderCarteirasBeneficioModal = renderCarteirasBeneficioModal;
  window.abrirFormNovaCarteiraBeneficio = abrirFormNovaCarteiraBeneficio;
  window.editarCarteiraBeneficioModal = editarCarteiraBeneficioModal;
  window.salvarCarteiraBeneficioModal = salvarCarteiraBeneficioModal;
  window.excluirCarteiraBeneficioModal = excluirCarteiraBeneficioModal;
  window.renderExtratoBeneficiosModal = renderExtratoBeneficiosModal;
  window.atualizarPreviewBeneficioGasto = atualizarPreviewBeneficioGasto;
  window.atualizarPreviewBeneficioConverter = atualizarPreviewBeneficioConverter;
  window.renderBeneficiosTopo = renderBeneficiosTopo;
  window.setFiltroOrigemGasto = setFiltroOrigemGasto;
  window.salvarConfigCicloOrcamentoModal = salvarConfigCicloOrcamentoModal;
  // Super-App Familiar v2.0 (Etapa 5 - Scanner OCR de Cupons e Notas)
  window.parsearItensCupomTexto = parsearItensCupomTexto;
  window.extrairDadosCupomTextoOuQR = extrairDadosCupomTextoOuQR;
  window.gerarHashCupomFiscal = gerarHashCupomFiscal;
  window.verificarCupomDuplicado = verificarCupomDuplicado;
  window.cruzarItensCupomComListaCompras = cruzarItensCupomComListaCompras;
  window.chamarGeminiVisionCupom = chamarGeminiVisionCupom;
  window.processarDocumentoFiscal = processarDocumentoFiscal;
  window.confirmarLancamentoCupomFiscal = confirmarLancamentoCupomFiscal;
  window.excluirCupomFiscal = excluirCupomFiscal;
  window.abrirScannerCupom = abrirScannerCupom;
  window.fecharScannerCupom = fecharScannerCupom;
  window.setTabScanner = setTabScanner;
  window.aoSelecionarArquivoCupom = aoSelecionarArquivoCupom;
  window.processarQRCupomModal = processarQRCupomModal;
  window.processarTextoCupomModal = processarTextoCupomModal;
  window.renderRevisaoCupomModal = renderRevisaoCupomModal;
  window.aoMudarOrigemPagamentoCupom = aoMudarOrigemPagamentoCupom;
  window.atualizarPreviewDivisaoCupom = atualizarPreviewDivisaoCupom;
  window.confirmarLancamentoCupomModal = confirmarLancamentoCupomModal;
  window.cancelarRevisaoCupomModal = cancelarRevisaoCupomModal;
  window.abrirDetalheCupomFiscal = abrirDetalheCupomFiscal;
  window.fecharDetalheCupomModal = fecharDetalheCupomModal;
  window.abrirModuloExplorar = abrirModuloExplorar;
  // Super-App Familiar v2.0 (Etapa 6 - Mensagens da Família & Contatos)
  window.enfileirarSync = enfileirarSync;
  window.registrarAtividadeFamilia = registrarAtividadeFamilia;
  window.obterMensagensFamilia = obterMensagensFamilia;
  window.obterMensagensFixadasFamilia = obterMensagensFixadasFamilia;
  window.obterContagemMensagensNaoLidas = obterContagemMensagensNaoLidas;
  window.marcarMensagensComoLidas = marcarMensagensComoLidas;
  window.enviarMensagemFamilia = enviarMensagemFamilia;
  window.alternarFixarMensagemFamilia = alternarFixarMensagemFamilia;
  window.reagirMensagemFamilia = reagirMensagemFamilia;
  window.excluirMensagemFamilia = excluirMensagemFamilia;
  window.CATEGORIAS_CONTATO_FAMILIA = CATEGORIAS_CONTATO_FAMILIA;
  window.filtrarContatosFamilia = filtrarContatosFamilia;
  window.salvarContatoFamilia = salvarContatoFamilia;
  window.excluirContatoFamilia = excluirContatoFamilia;
  window.renderChatFamiliaModal = renderChatFamiliaModal;
  window.abrirModalChatFamilia = abrirModalChatFamilia;
  window.fecharModalChatFamilia = fecharModalChatFamilia;
  window.aoSelecionarFotoChat = aoSelecionarFotoChat;
  window.removerFotoAnexoChat = removerFotoAnexoChat;
  window.enviarMensagemChatModal = enviarMensagemChatModal;
  window.confirmarExcluirMensagemModal = confirmarExcluirMensagemModal;
  window.renderContatosFamiliaModal = renderContatosFamiliaModal;
  window.filtrarCategoriaContatosModal = filtrarCategoriaContatosModal;
  window.abrirModalContatosFamilia = abrirModalContatosFamilia;
  window.fecharModalContatosFamilia = fecharModalContatosFamilia;
  window.abrirModalNovoContato = abrirModalNovoContato;
  window.editarContatoModal = editarContatoModal;
  window.aoMudarCategoriaContatoForm = aoMudarCategoriaContatoForm;
  window.salvarContatoModal = salvarContatoModal;
  window.confirmarExcluirContatoModal = confirmarExcluirContatoModal;
  window.copiarTextoContato = copiarTextoContato;
  // Super-App Familiar v2.0 (Etapa 7 - Refeições, Documentos & Grade Horária)
  window.DIAS_SEMANA_NOMES = DIAS_SEMANA_NOMES;
  window.DIAS_SEMANA_LABELS = DIAS_SEMANA_LABELS;
  window.TURNOS_REFEICAO_LABELS = TURNOS_REFEICAO_LABELS;
  window.PASTAS_DOCUMENTOS_PADRAO = PASTAS_DOCUMENTOS_PADRAO;
  window.salvarReceitaCulinaria = salvarReceitaCulinaria;
  window.excluirReceitaCulinaria = excluirReceitaCulinaria;
  window.definirRefeicaoCardapio = definirRefeicaoCardapio;
  window.limparRefeicaoCardapio = limparRefeicaoCardapio;
  window.obterIngredientesFaltantesCardapio = obterIngredientesFaltantesCardapio;
  window.gerarListaComprasDoCardapio = gerarListaComprasDoCardapio;
  window.salvarDocumentoFamilia = salvarDocumentoFamilia;
  window.excluirDocumentoFamilia = excluirDocumentoFamilia;
  window.listarDocumentosVisiveisParaMembro = listarDocumentosVisiveisParaMembro;
  window.obterAlertasDocumentosVencendo = obterAlertasDocumentosVencendo;
  window.salvarItemGradeHoraria = salvarItemGradeHoraria;
  window.excluirItemGradeHoraria = excluirItemGradeHoraria;
  window.listarGradeHorariaFiltrada = listarGradeHorariaFiltrada;
  window.renderRefeicoesFamiliaModal = renderRefeicoesFamiliaModal;
  window.abrirModalRefeicoesFamilia = abrirModalRefeicoesFamilia;
  window.fecharModalRefeicoesFamilia = fecharModalRefeicoesFamilia;
  window.abrirModalNovaReceita = abrirModalNovaReceita;
  window.editarReceitaModal = editarReceitaModal;
  window.salvarReceitaModal = salvarReceitaModal;
  window.confirmarExcluirReceitaModal = confirmarExcluirReceitaModal;
  window.abrirModalDefinirRefeicao = abrirModalDefinirRefeicao;
  window.salvarDefinicaoRefeicaoModal = salvarDefinicaoRefeicaoModal;
  window.limparRefeicaoModal = limparRefeicaoModal;
  window.gerarListaComprasCardapioModal = gerarListaComprasCardapioModal;
  window.renderDocumentosFamiliaModal = renderDocumentosFamiliaModal;
  window.abrirModalDocumentosFamilia = abrirModalDocumentosFamilia;
  window.fecharModalDocumentosFamilia = fecharModalDocumentosFamilia;
  window.filtrarPastaDocumentosModal = filtrarPastaDocumentosModal;
  window.abrirModalNovoDocumento = abrirModalNovoDocumento;
  window.editarDocumentoModal = editarDocumentoModal;
  window.salvarDocumentoModal = salvarDocumentoModal;
  window.confirmarExcluirDocumentoModal = confirmarExcluirDocumentoModal;
  window.aoSelecionarArquivoDocumento = aoSelecionarArquivoDocumento;
  window.renderGradeHorariaModal = renderGradeHorariaModal;
  window.abrirModalGradeHoraria = abrirModalGradeHoraria;
  window.fecharModalGradeHoraria = fecharModalGradeHoraria;
  window.filtrarMembroGradeModal = filtrarMembroGradeModal;
  window.filtrarSemanaAlternadaModal = filtrarSemanaAlternadaModal;
  window.abrirModalNovoItemGrade = abrirModalNovoItemGrade;
  window.editarItemGradeModal = editarItemGradeModal;
  window.salvarItemGradeModal = salvarItemGradeModal;
  window.confirmarExcluirItemGradeModal = confirmarExcluirItemGradeModal;
  // Super-App Familiar v2.0 (Etapa 8 - Agente Norte 2.0, Metas, Tetos, Simulador & Assinaturas)
  window.construirContextoAgenteNorte = construirContextoAgenteNorte;
  window.gerarResumoSemanalNorte = gerarResumoSemanalNorte;
  window.responderPerguntaNorteLocal = responderPerguntaNorteLocal;
  window.salvarMetaFamilia = salvarMetaFamilia;
  window.aportarNaMetaFamilia = aportarNaMetaFamilia;
  window.excluirMetaFamilia = excluirMetaFamilia;
  window.definirTetoCategoria = definirTetoCategoria;
  window.calcularStatusTetosCategorias = calcularStatusTetosCategorias;
  window.simularQuitacaoDividas = simularQuitacaoDividas;
  window.detectarAssinaturasEContasFixas = detectarAssinaturasEContasFixas;
  window.renderMetasFamiliaModal = renderMetasFamiliaModal;
  window.abrirModalMetasFamilia = abrirModalMetasFamilia;
  window.fecharModalMetasFamilia = fecharModalMetasFamilia;
  window.abrirModalNovaMetaFamilia = abrirModalNovaMetaFamilia;
  window.salvarMetaFamiliaModal = salvarMetaFamiliaModal;
  window.abrirModalAportarMeta = abrirModalAportarMeta;
  window.confirmarAporteMetaModal = confirmarAporteMetaModal;
  window.confirmarExcluirMetaFamiliaModal = confirmarExcluirMetaFamiliaModal;
  window.renderTetosCategoriasModal = renderTetosCategoriasModal;
  window.abrirModalTetosCategorias = abrirModalTetosCategorias;
  window.fecharModalTetosCategorias = fecharModalTetosCategorias;
  window.salvarTetoCategoriaModal = salvarTetoCategoriaModal;
  window.removerTetoCategoriaModal = removerTetoCategoriaModal;
  window.renderSimuladorDividasModal = renderSimuladorDividasModal;
  window.abrirModalSimuladorDividas = abrirModalSimuladorDividas;
  window.fecharModalSimuladorDividas = fecharModalSimuladorDividas;
  window.calcularSimulacaoDividasModal = calcularSimulacaoDividasModal;
  window.renderAssinaturasFixasModal = renderAssinaturasFixasModal;
  window.abrirModalAssinaturasFixas = abrirModalAssinaturasFixas;
  window.fecharModalAssinaturasFixas = fecharModalAssinaturasFixas;
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
    initFirebase,
    setFbDbParaTestes,
    fazerLogin,
    fazerCadastro,
    fazerLoginGoogle,
    entrarModoLocal,
    fazerLogoffApp,
    aplicarLoginGate,
    selecionarMembroLogin,
    selecionarMembroAparelho,
    abrirModalPerfilConta,
    atualizarModalPerfilConta,
    escutarSincronizacaoTempoReal,
    docId,
    loadFromCloud,
    MODELOS_GEMINI_FALLBACK,
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
    salvarCodigoFamiliaLogin,
    selTag,
    salvarNegociacaoGasto,
    confirmarAdiantamento,
    chamarGeminiComFallback,
    // Super-App Familiar v2.0 (Etapa 2 - Listas & Tarefas)
    CATEGORIAS_MERCADO,
    criarListaFamiliar,
    excluirListaFamiliar,
    adicionarNaFilaSync,
    dispararNotificacaoAgrupadaItens,
    adicionarItemLista,
    calcularProximoPrazoRecorrente,
    toggleItemLista,
    excluirItemLista,
    readicionarItemFrequente,
    converterListaEmGasto,
    calcularResumoLista,
    abrirModuloFamiliar,
    abrirListaDetalhe,
    fecharListaDetalhe,
    filtrarTipoListas,
    filtrarMembroTarefas,
    abrirModalNovaLista,
    atualizarOpcoesNovaListaModal,
    selecionarIconeNovaLista,
    selecionarCorNovaLista,
    salvarNovaListaModal,
    adicionarItemCompraModal,
    adicionarTarefaModal,
    abrirModalConverterGastoLista,
    confirmarConverterGastoModal,
    confirmarExcluirListaAtual,
    excluirListaAtualDetalhe,
    selecionarTipoNovaLista,
    renderListas,
    // Super-App Familiar v2.0 (Etapa 3 - Calendário Pro v2.1)
    CORES_CALENDARIO,
    CORES_EVENTO_NOMEADAS,
    obterNomeCorEvento,
    FERIADOS_BRASIL,
    calcularPascoa,
    obterFeriadosBrasilAno,
    membroAtualPodeVerFinancas,
    obterEventosConsolidadosPeriodo,
    criarEventoCalendario,
    editarEventoCalendario,
    excluirEventoCalendario,
    curtirEventoCalendario,
    adicionarComentarioEventoCalendario,
    preencherEventoPorTextoIA,
    buscarEventosCalendario,
    salvarConfigCalendario,
    limparEventosAntigosCalendario,
    adicionarAniversariante,
    excluirAniversariante,
    calcularProximoAniversario,
    importarEventosICal,
    setVisaoCalendario,
    mudarPeriodoCalendario,
    filtrarCalendarioMembro,
    toggleCamadaCalendario,
    abrirDiaCalendario,
    adicionarEventoNoDiaModal,
    abrirModalEventoCalendario,
    renderParticipantesAvataresEventoModal,
    toggleParticipanteAvatarModal,
    toggleTodosParticipantesEventoModal,
    renderCoresNomeadasEventoModal,
    selecionarCorEventoNomeada,
    renderLembretesEventoForm,
    adicionarLembreteEventoForm,
    removerLembreteEventoForm,
    toggleDiaInteiroEventoModal,
    toggleParticipanteEventoModal,
    selecionarCorEventoModal,
    salvarEventoCalendarioModal,
    excluirEventoCalendarioModal,
    abrirDetalheEventoCalendario,
    fecharDetalheEventoCalendario,
    renderDetalheEventoModal,
    editarEventoAtualModal,
    confirmarExcluirEventoAtualModal,
    curtirEventoAtualDetalhe,
    enviarComentarioEventoDetalhe,
    abrirModalConfigCalendario,
    fecharModalConfigCalendario,
    salvarConfigCalendarioModal,
    executarLimpezaEventosAntigosModal,
    abrirModalBuscaCalendario,
    fecharModalBuscaCalendario,
    executarBuscaCalendarioModal,
    abrirModalParserTextoIA,
    fecharModalParserTextoIA,
    processarParserTextoIAModal,
    abrirModalAniversarios,
    salvarAniversarianteModal,
    excluirAniversarianteModal,
    abrirModalImportarICal,
    lerArquivoICal,
    confirmarImportarICalModal,
    obterNumeroSemanaISO,
    renderCalendario,
    // Super-App Familiar v2.0 (Etapa 4 - Carteiras VA/VR e Orçamento)
    obterDiasNoMes,
    obterDataRecargaNoMes,
    calcularMetricasCarteiraBeneficio,
    processarRecargasBeneficiosAutomaticas,
    creditarRecargaManual,
    calcularDivisaoPagamentoBeneficio,
    registrarGastoComBeneficio,
    estornarBeneficioDeGasto,
    criarOuEditarCarteiraBeneficio,
    excluirCarteiraBeneficio,
    delGasto,
    abrirModalCarteirasBeneficio,
    setTabBeneficios,
    renderCarteirasBeneficioModal,
    abrirFormNovaCarteiraBeneficio,
    editarCarteiraBeneficioModal,
    salvarCarteiraBeneficioModal,
    excluirCarteiraBeneficioModal,
    renderExtratoBeneficiosModal,
    atualizarPreviewBeneficioGasto,
    atualizarPreviewBeneficioConverter,
    renderBeneficiosTopo,
    setFiltroOrigemGasto,
    salvarConfigCicloOrcamentoModal,
    // Super-App Familiar v2.0 (Etapa 5 - Scanner OCR de Cupons e Notas)
    parsearItensCupomTexto,
    extrairDadosCupomTextoOuQR,
    gerarHashCupomFiscal,
    verificarCupomDuplicado,
    cruzarItensCupomComListaCompras,
    chamarGeminiVisionCupom,
    processarDocumentoFiscal,
    confirmarLancamentoCupomFiscal,
    excluirCupomFiscal,
    abrirScannerCupom,
    fecharScannerCupom,
    setTabScanner,
    aoSelecionarArquivoCupom,
    processarQRCupomModal,
    processarTextoCupomModal,
    renderRevisaoCupomModal,
    aoMudarOrigemPagamentoCupom,
    atualizarPreviewDivisaoCupom,
    confirmarLancamentoCupomModal,
    cancelarRevisaoCupomModal,
    abrirDetalheCupomFiscal,
    fecharDetalheCupomModal,
    abrirModuloExplorar,
    // Super-App Familiar v2.0 (Etapa 6 - Mensagens da Família & Contatos)
    enfileirarSync,
    registrarAtividadeFamilia,
    obterMensagensFamilia,
    obterMensagensFixadasFamilia,
    obterContagemMensagensNaoLidas,
    marcarMensagensComoLidas,
    enviarMensagemFamilia,
    alternarFixarMensagemFamilia,
    reagirMensagemFamilia,
    excluirMensagemFamilia,
    CATEGORIAS_CONTATO_FAMILIA,
    filtrarContatosFamilia,
    salvarContatoFamilia,
    excluirContatoFamilia,
    renderChatFamiliaModal,
    abrirModalChatFamilia,
    fecharModalChatFamilia,
    aoSelecionarFotoChat,
    removerFotoAnexoChat,
    enviarMensagemChatModal,
    confirmarExcluirMensagemModal,
    renderContatosFamiliaModal,
    filtrarCategoriaContatosModal,
    abrirModalContatosFamilia,
    fecharModalContatosFamilia,
    abrirModalNovoContato,
    editarContatoModal,
    aoMudarCategoriaContatoForm,
    salvarContatoModal,
    confirmarExcluirContatoModal,
    copiarTextoContato,
    // Super-App Familiar v2.0 (Etapa 7 - Refeições, Documentos & Grade Horária)
    DIAS_SEMANA_NOMES,
    DIAS_SEMANA_LABELS,
    TURNOS_REFEICAO_LABELS,
    PASTAS_DOCUMENTOS_PADRAO,
    salvarReceitaCulinaria,
    excluirReceitaCulinaria,
    definirRefeicaoCardapio,
    limparRefeicaoCardapio,
    obterIngredientesFaltantesCardapio,
    gerarListaComprasDoCardapio,
    salvarDocumentoFamilia,
    excluirDocumentoFamilia,
    listarDocumentosVisiveisParaMembro,
    obterAlertasDocumentosVencendo,
    salvarItemGradeHoraria,
    excluirItemGradeHoraria,
    listarGradeHorariaFiltrada,
    renderRefeicoesFamiliaModal,
    abrirModalRefeicoesFamilia,
    fecharModalRefeicoesFamilia,
    abrirModalNovaReceita,
    editarReceitaModal,
    salvarReceitaModal,
    confirmarExcluirReceitaModal,
    abrirModalDefinirRefeicao,
    salvarDefinicaoRefeicaoModal,
    limparRefeicaoModal,
    gerarListaComprasCardapioModal,
    renderDocumentosFamiliaModal,
    abrirModalDocumentosFamilia,
    fecharModalDocumentosFamilia,
    filtrarPastaDocumentosModal,
    abrirModalNovoDocumento,
    editarDocumentoModal,
    salvarDocumentoModal,
    confirmarExcluirDocumentoModal,
    aoSelecionarArquivoDocumento,
    renderGradeHorariaModal,
    abrirModalGradeHoraria,
    fecharModalGradeHoraria,
    filtrarMembroGradeModal,
    filtrarSemanaAlternadaModal,
    abrirModalNovoItemGrade,
    editarItemGradeModal,
    salvarItemGradeModal,
    confirmarExcluirItemGradeModal,
    // Super-App Familiar v2.0 (Etapa 8 - Agente Norte 2.0, Metas, Tetos, Simulador & Assinaturas)
    construirContextoAgenteNorte,
    gerarResumoSemanalNorte,
    responderPerguntaNorteLocal,
    salvarMetaFamilia,
    aportarNaMetaFamilia,
    excluirMetaFamilia,
    definirTetoCategoria,
    calcularStatusTetosCategorias,
    simularQuitacaoDividas,
    detectarAssinaturasEContasFixas,
    renderMetasFamiliaModal,
    abrirModalMetasFamilia,
    fecharModalMetasFamilia,
    abrirModalNovaMetaFamilia,
    salvarMetaFamiliaModal,
    abrirModalAportarMeta,
    confirmarAporteMetaModal,
    confirmarExcluirMetaFamiliaModal,
    renderTetosCategoriasModal,
    abrirModalTetosCategorias,
    fecharModalTetosCategorias,
    salvarTetoCategoriaModal,
    removerTetoCategoriaModal,
    renderSimuladorDividasModal,
    abrirModalSimuladorDividas,
    fecharModalSimuladorDividas,
    calcularSimulacaoDividasModal,
    renderAssinaturasFixasModal,
    abrirModalAssinaturasFixas,
    fecharModalAssinaturasFixas,
    aoSelecionarFotoMembroModal,
    removerFotoMembroModal,
    aoSelecionarFotoPerfilConta,
    removerFotoPerfilAtual,
    aoSelecionarCapaFamilia,
    selecionarDiaCalendarioSplit,
    formatarTelefoneBR,
    aoDigitarIdentificadorLogin,
    aplicarProvedorEmail,
    getState: () => S,
    S
  };
}

if (typeof window !== 'undefined') {
  window.MODELOS_GEMINI_FALLBACK = MODELOS_GEMINI_FALLBACK;
  window.chamarGeminiComFallback = chamarGeminiComFallback;
  window.aplicarLoginGate = aplicarLoginGate;
  window.selecionarMembroLogin = selecionarMembroLogin;
  window.selecionarMembroAparelho = selecionarMembroAparelho;
  window.abrirModalPerfilConta = abrirModalPerfilConta;
  window.atualizarModalPerfilConta = atualizarModalPerfilConta;
  window.fazerLoginGoogle = fazerLoginGoogle;
  window.fazerLogin = fazerLogin;
  window.fazerCadastro = fazerCadastro;
  window.entrarModoLocal = entrarModoLocal;
  window.fazerLogoffApp = fazerLogoffApp;
  window.sair = sair;
  window.escutarSincronizacaoTempoReal = escutarSincronizacaoTempoReal;
  window.docId = docId;
  window.loadFromCloud = loadFromCloud;
  window.salvarCodigoFamiliaLogin = salvarCodigoFamiliaLogin;
  window.initFirebase = initFirebase;
  window.setFbDbParaTestes = setFbDbParaTestes;
  window.aoSelecionarFotoMembroModal = aoSelecionarFotoMembroModal;
  window.removerFotoMembroModal = removerFotoMembroModal;
  window.aoSelecionarFotoPerfilConta = aoSelecionarFotoPerfilConta;
  window.removerFotoPerfilAtual = removerFotoPerfilAtual;
  window.aoSelecionarCapaFamilia = aoSelecionarCapaFamilia;
  window.selecionarDiaCalendarioSplit = selecionarDiaCalendarioSplit;
  window.formatarTelefoneBR = formatarTelefoneBR;
  window.aoDigitarIdentificadorLogin = aoDigitarIdentificadorLogin;
  window.aplicarProvedorEmail = aplicarProvedorEmail;
}

