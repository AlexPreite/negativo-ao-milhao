/**
 * office-3d.js
 * Engine e Lógica de Negócios do Escritório Virtual 3D da Squad (Estilo OpenClaw 3D)
 * Squad: Stella (Tech Lead), Arquiteto, Dev Full Stack, QA & Segurança, DevOps e Agente Norte 2.0.
 * Suporta WebGL (Three.js r128), Fallback Canvas 2.5D e execução em Node.js (testes automatizados).
 */

// ============================================================================
// 1. CATÁLOGO DOS 6 AGENTES DA SQUAD
// ============================================================================

const AGENTES_SQUAD_3D = {
  stella: {
    id: 'stella',
    nome: 'Stella',
    papel: 'Tech Lead & Orquestradora',
    cor: '#8B5CF6',
    corNome: 'Roxo Real',
    icone: '👩‍💼',
    posMesa: { x: 0, y: 0, z: -2.5 },
    rotacaoMesa: 0,
    status: 'ORCHESTRATING',
    statusBadge: '🟣 ORQUESTRANDO',
    tarefaAtual: 'Coordenando entregas e alinhamento com Alexsander',
    progresso: 100,
    arquivoAtivo: 'app.js',
    metricas: '378/378 asserts aprovados • Zero Regressão',
    descricao: 'Líder técnica da squad. Centraliza a orquestração, delega escopos estritos e valida entregas de ponta a ponta.'
  },
  arquiteto: {
    id: 'arquiteto',
    nome: 'Arquiteto de Software',
    papel: 'Arquitetura & Engenharia de Dados',
    cor: '#06B6D4',
    corNome: 'Ciano Neon',
    icone: '📐',
    posMesa: { x: -6.5, y: 0, z: -4.5 },
    rotacaoMesa: Math.PI / 4,
    status: 'DESIGNING',
    statusBadge: '📐 MODELANDO CONTRATOS',
    tarefaAtual: 'Definindo schema e contratos da Squad 3D',
    progresso: 100,
    arquivoAtivo: '001_init_upgrade_familiar_v2.sql',
    metricas: 'Schema v2 consolidado • RLS familiar estrito',
    descricao: 'Projeta arquiteturas escaláveis, contratos de interface limpos e integridade de dados familiares.'
  },
  dev_fullstack: {
    id: 'dev_fullstack',
    nome: 'Dev Full Stack',
    papel: 'Engenharia de Software Full Stack',
    cor: '#3B82F6',
    corNome: 'Azul Elétrico',
    icone: '💻',
    posMesa: { x: -6.5, y: 0, z: 2.5 },
    rotacaoMesa: -Math.PI / 4,
    status: 'WORKING',
    statusBadge: '🟢 CODIFICANDO',
    tarefaAtual: 'Renderizador WebGL Three.js e HUD interativo',
    progresso: 100,
    arquivoAtivo: 'office-3d.js / office-3d.html',
    metricas: 'Zero catch vazio • 100% TypeScript/JS estrito',
    descricao: 'Implementa rigorosamente o que o contrato pede — front, back, banco e integrações 3D.'
  },
  qa_seguranca: {
    id: 'qa_seguranca',
    nome: 'QA & Auditor de Segurança',
    papel: 'Auditoria & Homologação',
    cor: '#10B981',
    corNome: 'Esmeralda',
    icone: '🛡️',
    posMesa: { x: 6.5, y: 0, z: 2.5 },
    rotacaoMesa: Math.PI / 4,
    status: 'VERIFYING',
    statusBadge: '🛡️ VEREDITO: APROVADO',
    tarefaAtual: 'Auditoria de não-regressão e conformidade de RLS',
    progresso: 100,
    arquivoAtivo: 'test_calendario_pro_v2_1.js',
    metricas: '100% testes unitários e de integração verdes',
    descricao: 'Audita cada linha antes da entrega, caça bugs em casos de borda e valida segurança absoluta.'
  },
  devops: {
    id: 'devops',
    nome: 'Engenheiro DevOps & Cloud',
    papel: 'Infraestrutura, Sincronização & CI/CD',
    cor: '#F59E0B',
    corNome: 'Âmbar Dourado',
    icone: '🚀',
    posMesa: { x: 6.5, y: 0, z: -4.5 },
    rotacaoMesa: -Math.PI / 4,
    status: 'DEPLOYED',
    statusBadge: '🚀 DEPLOY CONCLUÍDO',
    tarefaAtual: 'Cluster de Servidores 3D e Service Worker PWA',
    progresso: 100,
    arquivoAtivo: 'sw.js / manifest.json',
    metricas: 'GitHub Pages Live • Supabase Sync Ativo',
    descricao: 'Automação de builds, pipelines de entrega contínua, infraestrutura em nuvem e resiliência offline.'
  },
  norte: {
    id: 'norte',
    nome: 'Agente Norte 2.0',
    papel: 'Inteligência Familiar Omnisciente',
    cor: '#EC4899',
    corNome: 'Magenta Holográfico',
    icone: '🧭',
    posMesa: { x: 0, y: 0, z: 5.5 },
    rotacaoMesa: Math.PI,
    status: 'ONLINE',
    statusBadge: '✨ OMNISCIENTE ONLINE',
    tarefaAtual: 'Monitorando orçamentos, metas e rotina da família',
    progresso: 100,
    arquivoAtivo: 'app.js (Agente Norte 2.0)',
    metricas: 'Sincronizado com dnm_data familiar',
    descricao: 'Núcleo de inteligência financeira e de rotina familiar, conectando os membros aos seus sonhos.'
  }
};

// ============================================================================
// 2. LOCAIS E ÁREAS COMUNS DO ESCRITÓRIO 3D
// ============================================================================

const LOCAIS_ESCRITORIO_3D = {
  war_room: { x: 0, y: 0, z: 1.5, nome: 'Mesa de Reunião Central (War Room)', icone: '🤝' },
  cafe: { x: -8.5, y: 0, z: -1.0, nome: 'Lounge do Café & Espresso 3D', icone: '☕' },
  servidores: { x: 8.5, y: 0, z: -4.5, nome: 'Racks de Servidores & Cloud', icone: '🖥️' },
  painel_holografico: { x: 0, y: 1.8, z: 1.5, nome: 'Holograma Central de Métricas', icone: '📊' }
};

// ============================================================================
// 3. HISTÓRICO REAL DE ENTREGAS DA SQUAD (Negativo ao Milhão)
// ============================================================================

const HISTORICO_ENTREGAS_REAIS = [
  { etapa: 'Etapa 1', nome: 'Círculo Familiar, Convites & Mural', status: 'Homologado', data: '2026-10-25', autor: 'Dev Full Stack' },
  { etapa: 'Etapa 2', nome: 'Listas de Compras & Tarefas Colaborativas', status: 'Homologado', data: '2026-10-25', autor: 'Dev Full Stack' },
  { etapa: 'Etapa 3', nome: 'Calendário Familiar & Aniversários', status: 'Homologado', data: '2026-10-25', autor: 'Dev Full Stack' },
  { etapa: 'Etapa 4', nome: 'Carteiras de Benefícios (VA/VR) & Split', status: 'Homologado', data: '2026-10-25', autor: 'Dev Full Stack' },
  { etapa: 'Etapa 5', nome: 'Scanner Inteligente OCR de Cupons Fiscais', status: 'Homologado', data: '2026-10-25', autor: 'Dev Full Stack' },
  { etapa: 'Etapa 6', nome: 'Mensagens da Família, Recados & Contatos', status: 'Homologado', data: '2026-10-25', autor: 'Dev Full Stack' },
  { etapa: 'Etapa 7', nome: 'Refeições, Cofre de Documentos & Horários', status: 'Homologado', data: '2026-10-25', autor: 'Dev Full Stack' },
  { etapa: 'Etapa 8', nome: 'Agente Norte 2.0, Metas, Tetos & Simulador', status: 'Homologado', data: '2026-10-25', autor: 'Dev Full Stack' },
  { etapa: 'Upgrade v2.1', nome: 'Calendário Pro v2.1 (Feriados Nacionais Brasil & IA)', status: 'Homologado', data: '2026-10-25', autor: 'Dev Full Stack' },
  { etapa: 'Upgrade v2.2', nome: 'Escritório Virtual 3D da Squad (OpenClaw 3D)', status: 'Concluído', data: '2026-10-25', autor: 'Squad Completa' }
];

// ============================================================================
// 4. MÁQUINA DE ESTADOS E SIMULADOR DE MISSÕES 3D
// ============================================================================

let estadoMissaoAtiva = {
  emAndamento: false,
  nomeMissao: '',
  etapaIndice: 0,
  etapas: [],
  intervaloTimer: null
};

const FEIXES_VISUAIS_ATIVOS = [];

/**
 * Registra e despacha um feixe visual 3D luminoso de dados entre dois agentes.
 */
function enviarPacoteVisual3D(origemId, destinoId, tipoMensagem, texto) {
  const agOrigem = AGENTES_SQUAD_3D[origemId];
  const agDestino = AGENTES_SQUAD_3D[destinoId];
  if (!agOrigem || !agDestino) return null;

  const pacote = {
    id: 'pct_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    origemId,
    destinoId,
    origemPos: { ...agOrigem.posMesa },
    destinoPos: { ...agDestino.posMesa },
    cor: agOrigem.cor,
    tipo: tipoMensagem || 'mensagem',
    texto: texto || 'Pacote de dados transmitido',
    progresso: 0, // 0.0 a 1.0
    alturaArco: 2.5,
    criadoEm: Date.now()
  };

  FEIXES_VISUAIS_ATIVOS.push(pacote);

  if (typeof window !== 'undefined' && typeof window.tocarSomSintetizador === 'function') {
    window.tocarSomSintetizador('feixe');
  }

  return pacote;
}

/**
 * Atualiza o status textual e a atividade de um agente.
 */
function atualizarStatusAgente3D(agenteId, novoStatus, statusBadge, tarefaAtual, progresso = 100) {
  const ag = AGENTES_SQUAD_3D[agenteId];
  if (!ag) return false;

  ag.status = novoStatus;
  ag.statusBadge = statusBadge || ag.statusBadge;
  ag.tarefaAtual = tarefaAtual || ag.tarefaAtual;
  ag.progresso = Math.min(100, Math.max(0, progresso));

  // Notifica overlay HTML se no navegador
  if (typeof document !== 'undefined') {
    const elBadge = document.getElementById(`overlay-badge-${agenteId}`);
    const elTarefa = document.getElementById(`overlay-tarefa-${agenteId}`);
    const elProg = document.getElementById(`overlay-prog-${agenteId}`);
    if (elBadge) elBadge.textContent = ag.statusBadge;
    if (elTarefa) elTarefa.textContent = ag.tarefaAtual;
    if (elProg) elProg.style.width = `${ag.progresso}%`;
  }

  return true;
}

/**
 * Inicia a simulação de uma missão passo a passo com animação dos agentes.
 */
function iniciarMissaoSquad3D(tipoMissao = 'ciclo_completo', tituloCustomizado = '') {
  let nomeMissao = 'Ciclo Completo de Feature (Stella → Arquiteto → Dev → QA → DevOps)';
  let roteiro = [];

  if (tipoMissao === 'war_room') {
    nomeMissao = 'Reunião de Alinhamento de Arquitetura na War Room';
    roteiro = [
      {
        de: 'stella', para: 'war_room',
        acao: 'Stella convoca toda a Squad para alinhamento na War Room',
        status: '🟣 CONVOCANDO REUNIÃO', progresso: 25,
        moverTodosWarRoom: true
      },
      {
        de: 'arquiteto', para: 'stella',
        acao: 'Arquiteto apresenta diagrama holográfico de contratos e RLS',
        status: '📐 APRESENTANDO ARQUITETURA', progresso: 50,
        feixe: true
      },
      {
        de: 'dev_fullstack', para: 'arquiteto',
        acao: 'Dev Full Stack valida viabilidade de WebGL e Three.js',
        status: '💻 VALIDANDO IMPLEMENTAÇÃO', progresso: 75,
        feixe: true
      },
      {
        de: 'qa_seguranca', para: 'stella',
        acao: 'QA confirma critérios de aceite com 100% de cobertura',
        status: '🛡️ HOMOLOGANDO ESCOPO', progresso: 100,
        feixe: true,
        restaurarPosicoes: true
      }
    ];
  } else if (tipoMissao === 'auditoria_qa') {
    nomeMissao = 'Auditoria Rigorosa de Segurança e Não-Regressão';
    roteiro = [
      {
        de: 'stella', para: 'qa_seguranca',
        acao: 'Stella aciona bateria de testes de conformidade com QA',
        status: '🟣 SOLICITANDO AUDITORIA', progresso: 20,
        feixe: true
      },
      {
        de: 'qa_seguranca', para: 'dev_fullstack',
        acao: 'QA executa 378 asserts automatizados e checa RLS infantil',
        status: '🛡️ AUDITANDO 378 ASSERTS', progresso: 60,
        feixe: true
      },
      {
        de: 'qa_seguranca', para: 'stella',
        acao: 'QA emite VEREDITO: APROVADO! Zero vulnerabilidades encontradas',
        status: '🛡️ VEREDITO: APROVADO', progresso: 100,
        feixe: true,
        somSucesso: true
      }
    ];
  } else if (tipoMissao === 'deploy_prod') {
    nomeMissao = 'Deploy em Produção (GitHub Pages & Supabase Cloud)';
    roteiro = [
      {
        de: 'stella', para: 'devops',
        acao: 'Stella assina tag de release e autoriza publicação',
        status: '🟣 AUTORIZANDO RELEASE', progresso: 25,
        feixe: true
      },
      {
        de: 'devops', para: 'servidores',
        acao: 'DevOps caminha até os Racks e executa pipeline CI/CD',
        status: '🚀 PUBLICANDO CLOUD', progresso: 70,
        moverDevopsServidor: true
      },
      {
        de: 'devops', para: 'stella',
        acao: 'Deploy ativo e online com sucesso em Produção!',
        status: '🚀 DEPLOY CONCLUÍDO', progresso: 100,
        feixe: true,
        restaurarPosicoes: true,
        somSucesso: true
      }
    ];
  } else {
    // Ciclo Completo Padrão
    if (tituloCustomizado) nomeMissao = `Missão: ${tituloCustomizado}`;
    roteiro = [
      {
        de: 'stella', para: 'arquiteto',
        acao: 'Stella analisa requisito do Alexsander e delega especificação',
        status: '🟣 ESPECIFICANDO CONTRATO', progresso: 15,
        feixe: true
      },
      {
        de: 'arquiteto', para: 'dev_fullstack',
        acao: 'Arquiteto elabora modelo de dados e passa contrato estrito',
        status: '📐 CONTRATO FECHADO', progresso: 35,
        feixe: true
      },
      {
        de: 'dev_fullstack', para: 'qa_seguranca',
        acao: 'Dev Full Stack codifica a feature e envia build para homologação',
        status: '🟢 BUILD CONCLUÍDA', progresso: 65,
        feixe: true
      },
      {
        de: 'qa_seguranca', para: 'stella',
        acao: 'QA roda bateria de testes: VEREDITO APROVADO com zero regressão',
        status: '🛡️ VEREDITO: APROVADO', progresso: 85,
        feixe: true
      },
      {
        de: 'stella', para: 'devops',
        acao: 'Stella autoriza deploy contínuo nos servidores',
        status: '🟣 APROVANDO PUBLICAÇÃO', progresso: 95,
        feixe: true
      },
      {
        de: 'devops', para: 'norte',
        acao: 'Deploy concluído com sucesso! Agente Norte 2.0 ativo para a família',
        status: '🚀 100% HOMOLOGADO', progresso: 100,
        feixe: true,
        somSucesso: true
      }
    ];
  }

  estadoMissaoAtiva = {
    emAndamento: true,
    nomeMissao,
    etapaIndice: 0,
    etapas: roteiro,
    intervaloTimer: null
  };

  if (typeof window !== 'undefined' && typeof window.atualizarHUDMissao === 'function') {
    window.atualizarHUDMissao(estadoMissaoAtiva);
  }

  return estadoMissaoAtiva;
}

/**
 * Avança para o próximo passo do roteiro da missão.
 */
function avancarEtapaMissao3D() {
  if (!estadoMissaoAtiva.emAndamento || estadoMissaoAtiva.etapaIndice >= estadoMissaoAtiva.etapas.length) {
    estadoMissaoAtiva.emAndamento = false;
    return { concluida: true };
  }

  const etapa = estadoMissaoAtiva.etapas[estadoMissaoAtiva.etapaIndice];

  // Atualiza status do agente envolvido
  if (AGENTES_SQUAD_3D[etapa.de]) {
    atualizarStatusAgente3D(etapa.de, 'WORKING', etapa.status, etapa.acao, etapa.progresso);
  }

  // Dispara feixe de comunicação
  if (etapa.feixe && AGENTES_SQUAD_3D[etapa.de] && AGENTES_SQUAD_3D[etapa.para]) {
    enviarPacoteVisual3D(etapa.de, etapa.para, 'missao', etapa.acao);
  }

  // Movimentação se aplicável
  if (etapa.moverTodosWarRoom && typeof window !== 'undefined' && typeof window.moverTodosParaWarRoom === 'function') {
    window.moverTodosParaWarRoom();
  }
  if (etapa.moverDevopsServidor && typeof window !== 'undefined' && typeof window.moverAgentePara === 'function') {
    window.moverAgentePara('devops', LOCAIS_ESCRITORIO_3D.servidores);
  }
  if (etapa.restaurarPosicoes && typeof window !== 'undefined' && typeof window.restaurarPosicoesAgentes === 'function') {
    window.restaurarPosicoesAgentes();
  }

  estadoMissaoAtiva.etapaIndice++;

  if (typeof window !== 'undefined' && typeof window.atualizarHUDMissao === 'function') {
    window.atualizarHUDMissao(estadoMissaoAtiva);
  }

  return { concluida: estadoMissaoAtiva.etapaIndice >= estadoMissaoAtiva.etapas.length, etapa };
}

/**
 * Lê e retorna dados reais do app familiar gravados em localStorage ('dnm_data').
 */
function obterDadosReaisAppFamilia() {
  if (typeof localStorage === 'undefined') {
    return {
      circuloNome: 'Nossa Família',
      totalMembros: 2,
      totalEventos: 0,
      totalListas: 0,
      totalGastos: 0
    };
  }

  try {
    const raw = localStorage.getItem('dnm_data');
    if (!raw) {
      return {
        circuloNome: 'Nossa Família',
        totalMembros: 2,
        totalEventos: 0,
        totalListas: 0,
        totalGastos: 0
      };
    }
    const parsed = JSON.parse(raw);
    return {
      circuloNome: parsed.circulos?.[0]?.nome || 'Nossa Família',
      totalMembros: Array.isArray(parsed.membrosPerfil) ? parsed.membrosPerfil.length : 2,
      totalEventos: Array.isArray(parsed.eventosCalendario) ? parsed.eventosCalendario.length : 0,
      totalListas: Array.isArray(parsed.listas) ? parsed.listas.length : 0,
      totalGastos: Array.isArray(parsed.gastos) ? parsed.gastos.length : 0
    };
  } catch (err) {
    console.error('Erro ao ler dnm_data do localStorage:', err);
    return {
      circuloNome: 'Nossa Família',
      totalMembros: 2,
      totalEventos: 0,
      totalListas: 0,
      totalGastos: 0
    };
  }
}

/**
 * Retorna o resumo consolidado do status de todos os 6 agentes.
 */
function obterResumoSquad3D() {
  const lista = Object.values(AGENTES_SQUAD_3D);
  return {
    totalAgentes: lista.length,
    agentes: lista.map(a => ({
      id: a.id,
      nome: a.nome,
      papel: a.papel,
      statusBadge: a.statusBadge,
      tarefaAtual: a.tarefaAtual,
      progresso: a.progresso,
      cor: a.cor
    })),
    entregasHomologadas: HISTORICO_ENTREGAS_REAIS.length
  };
}

// ============================================================================
// 5. ENGINE GRÁFICA WEBGL THREE.JS (Executada no Navegador)
// ============================================================================

let cena3D, camera3D, renderer3D, controles3D;
let meshesAgentes = {};
let animacaoFrameId = null;

/**
 * Inicializa a cena 3D completa com Three.js r128 ou aciona Fallback Canvas 2.5D.
 */
function iniciarCenaEscritorio3D(containerId = 'canvas-container') {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const container = document.getElementById(containerId);
  if (!container) return;

  // Verifica se Three.js está carregado
  if (typeof THREE === 'undefined') {
    console.warn('Three.js não detectado. Iniciando fallback em Canvas 2.5D.');
    iniciarFallbackCanvas2D(container);
    return;
  }

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // 1. Cena, Câmera e Renderer
  cena3D = new THREE.Scene();
  cena3D.background = new THREE.Color('#0a0d14');
  cena3D.fog = new THREE.FogExp2('#0a0d14', 0.035);

  camera3D = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera3D.position.set(0, 14, 18);
  camera3D.lookAt(0, 1, 0);

  renderer3D = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer3D.setSize(width, height);
  renderer3D.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer3D.shadowMap.enabled = true;
  renderer3D.shadowMap.type = THREE.PCFSoftShadowMap;

  container.innerHTML = '';
  container.appendChild(renderer3D.domElement);

  // 2. Iluminação do Escritório Cyberpunk-Clean
  const luzAmbiente = new THREE.AmbientLight('#ffffff', 0.6);
  cena3D.add(luzAmbiente);

  const luzPrincipal = new THREE.DirectionalLight('#ffffff', 0.85);
  luzPrincipal.position.set(12, 22, 12);
  luzPrincipal.castShadow = true;
  luzPrincipal.shadow.mapSize.width = 2048;
  luzPrincipal.shadow.mapSize.height = 2048;
  luzPrincipal.shadow.camera.near = 0.5;
  luzPrincipal.shadow.camera.far = 60;
  luzPrincipal.shadow.camera.left = -16;
  luzPrincipal.shadow.camera.right = 16;
  luzPrincipal.shadow.camera.top = 16;
  luzPrincipal.shadow.camera.bottom = -16;
  cena3D.add(luzPrincipal);

  // Luzes pontuais neon nas estações
  const pontoLuzStella = new THREE.PointLight('#8B5CF6', 1.5, 8);
  pontoLuzStella.position.set(0, 2.5, -2.5);
  cena3D.add(pontoLuzStella);

  const pontoLuzDev = new THREE.PointLight('#3B82F6', 1.3, 7);
  pontoLuzDev.position.set(-6.5, 2.5, 2.5);
  cena3D.add(pontoLuzDev);

  const pontoLuzQA = new THREE.PointLight('#10B981', 1.3, 7);
  pontoLuzQA.position.set(6.5, 2.5, 2.5);
  cena3D.add(pontoLuzQA);

  // 3. Piso com Grid Neon
  const geoPiso = new THREE.PlaneGeometry(36, 32);
  const matPiso = new THREE.MeshStandardMaterial({
    color: '#0e131f',
    roughness: 0.4,
    metalness: 0.6
  });
  const pisoMesh = new THREE.Mesh(geoPiso, matPiso);
  pisoMesh.rotation.x = -Math.PI / 2;
  pisoMesh.receiveShadow = true;
  cena3D.add(pisoMesh);

  const gridPiso = new THREE.GridHelper(36, 36, '#8B5CF6', '#1e293b');
  gridPiso.position.y = 0.01;
  cena3D.add(gridPiso);

  // 4. Elementos de Arquitetura 3D (War Room, Servidores, Café)
  construirCenarioEscritorio3D();

  // 5. Construção das 6 Estações de Trabalho e Avatares
  construirEstacoesTrabalho3D();

  // 6. Controles de Mouse / Toque Orbitais
  inicializarControlesCameraman(container);

  // 7. Loop de Animação
  loopAnimacao3D();

  window.addEventListener('resize', aoRedimensionarJanela3D);
}

/**
 * Constrói os elementos de cenário: War Room central, Racks de Servidores e Café.
 */
function construirCenarioEscritorio3D() {
  // --- MESA DE REUNIÃO CENTRAL (WAR ROOM) ---
  const geoMesaReuniao = new THREE.CylinderGeometry(2.5, 2.5, 0.15, 32);
  const matMesaReuniao = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.3, metalness: 0.8 });
  const mesaReuniao = new THREE.Mesh(geoMesaReuniao, matMesaReuniao);
  mesaReuniao.position.set(0, 0.75, 1.5);
  mesaReuniao.castShadow = true;
  mesaReuniao.receiveShadow = true;
  cena3D.add(mesaReuniao);

  const geoPeReuniao = new THREE.CylinderGeometry(0.3, 0.3, 0.75, 16);
  const matPe = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.9 });
  const peReuniao = new THREE.Mesh(geoPeReuniao, matPe);
  peReuniao.position.set(0, 0.375, 1.5);
  cena3D.add(peReuniao);

  // Holograma flutuante no centro da War Room
  const geoHolo = new THREE.OctahedronGeometry(0.4, 0);
  const matHolo = new THREE.MeshBasicMaterial({ color: '#8B5CF6', wireframe: true });
  const holoMesh = new THREE.Mesh(geoHolo, matHolo);
  holoMesh.position.set(0, 1.6, 1.5);
  holoMesh.name = 'holograma_central';
  cena3D.add(holoMesh);

  // --- RACKS DE SERVIDORES (DEVOPS CLOUD) ---
  for (let r = 0; r < 3; r++) {
    const geoRack = new THREE.BoxGeometry(0.9, 3.2, 0.8);
    const matRack = new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.5 });
    const rack = new THREE.Mesh(geoRack, matRack);
    rack.position.set(9.5, 1.6, -6.5 + (r * 1.5));
    rack.castShadow = true;
    cena3D.add(rack);

    // Painel frontal com LEDs
    const geoPainel = new THREE.PlaneGeometry(0.7, 3.0);
    const matPainel = new THREE.MeshBasicMaterial({ color: '#111827' });
    const painel = new THREE.Mesh(geoPainel, matPainel);
    painel.position.set(9.04, 1.6, -6.5 + (r * 1.5));
    painel.rotation.y = -Math.PI / 2;
    cena3D.add(painel);
  }

  // --- LOUNGE DO CAFÉ (CANTINHO DO ESPRESSO) ---
  const geoBalcaoCafe = new THREE.BoxGeometry(1.4, 1.0, 3.5);
  const matBalcao = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.4 });
  const balcaoCafe = new THREE.Mesh(geoBalcaoCafe, matBalcao);
  balcaoCafe.position.set(-10, 0.5, -1.0);
  balcaoCafe.castShadow = true;
  cena3D.add(balcaoCafe);

  // Máquina de café express 3D
  const geoEspresso = new THREE.BoxGeometry(0.6, 0.7, 0.8);
  const matEspresso = new THREE.MeshStandardMaterial({ color: '#dc2626', metalness: 0.6 });
  const maquinaCafe = new THREE.Mesh(geoEspresso, matEspresso);
  maquinaCafe.position.set(-10, 1.35, -1.0);
  cena3D.add(maquinaCafe);
}

/**
 * Constrói as 6 mesas completas com computadores, cadeiras e avatares 3D articulados.
 */
function construirEstacoesTrabalho3D() {
  Object.values(AGENTES_SQUAD_3D).forEach(ag => {
    const grupoEstacao = new THREE.Group();
    grupoEstacao.position.set(ag.posMesa.x, ag.posMesa.y, ag.posMesa.z);
    grupoEstacao.rotation.y = ag.rotacaoMesa || 0;

    // 1. Mesa de Trabalho
    const geoTampo = new THREE.BoxGeometry(2.4, 0.08, 1.2);
    const matTampo = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4, metalness: 0.5 });
    const tampo = new THREE.Mesh(geoTampo, matTampo);
    tampo.position.y = 0.75;
    tampo.castShadow = true;
    grupoEstacao.add(tampo);

    // Pés da mesa metálicos
    const matPernas = new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.9 });
    const posPernas = [
      [-1.1, 0.375, -0.5],
      [1.1, 0.375, -0.5],
      [-1.1, 0.375, 0.5],
      [1.1, 0.375, 0.5]
    ];
    posPernas.forEach(p => {
      const geoPerna = new THREE.CylinderGeometry(0.04, 0.04, 0.75, 8);
      const perna = new THREE.Mesh(geoPerna, matPernas);
      perna.position.set(p[0], p[1], p[2]);
      grupoEstacao.add(perna);
    });

    // 2. Monitores Luminosos
    if (ag.id === 'stella') {
      // 3 telas panorâmicas em arco
      [-0.65, 0, 0.65].forEach((offset, idx) => {
        const geoTela = new THREE.BoxGeometry(0.6, 0.42, 0.03);
        const matTela = new THREE.MeshBasicMaterial({ color: idx === 1 ? '#8B5CF6' : '#6366F1' });
        const tela = new THREE.Mesh(geoTela, matTela);
        tela.position.set(offset, 1.15, -0.35);
        tela.rotation.y = offset * -0.3;
        grupoEstacao.add(tela);
      });
    } else {
      // Monitor duplo / wide
      [-0.4, 0.4].forEach((offset, idx) => {
        const geoTela = new THREE.BoxGeometry(0.65, 0.44, 0.03);
        const matTela = new THREE.MeshBasicMaterial({ color: idx === 0 ? ag.cor : '#1e293b' });
        const tela = new THREE.Mesh(geoTela, matTela);
        tela.position.set(offset, 1.15, -0.35);
        tela.rotation.y = offset * -0.15;
        grupoEstacao.add(tela);
      });
    }

    // Teclado e caneca de café
    const geoTeclado = new THREE.BoxGeometry(0.5, 0.02, 0.2);
    const matTeclado = new THREE.MeshStandardMaterial({ color: '#090d16' });
    const teclado = new THREE.Mesh(geoTeclado, matTeclado);
    teclado.position.set(0, 0.8, 0.1);
    grupoEstacao.add(teclado);

    const geoCaneca = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8);
    const matCaneca = new THREE.MeshStandardMaterial({ color: ag.cor });
    const caneca = new THREE.Mesh(geoCaneca, matCaneca);
    caneca.position.set(0.7, 0.84, 0.1);
    grupoEstacao.add(caneca);

    // 3. Avatar 3D Articulado
    const grupoAvatar = new THREE.Group();
    grupoAvatar.position.set(0, 0, 0.55);

    // Tronco / Jaqueta na cor do agente
    const geoCorpo = new THREE.CylinderGeometry(0.24, 0.28, 0.65, 12);
    const matCorpo = new THREE.MeshStandardMaterial({ color: ag.cor, roughness: 0.5 });
    const corpo = new THREE.Mesh(geoCorpo, matCorpo);
    corpo.position.y = 0.8;
    corpo.castShadow = true;
    grupoAvatar.add(corpo);

    // Cabeça
    const geoCabeca = new THREE.SphereGeometry(0.18, 16, 16);
    const matCabeca = new THREE.MeshStandardMaterial({ color: '#fed7aa', roughness: 0.6 });
    const cabeca = new THREE.Mesh(geoCabeca, matCabeca);
    cabeca.position.y = 1.32;
    grupoAvatar.add(cabeca);

    // Olhos luminosos
    const geoOlho = new THREE.SphereGeometry(0.035, 8, 8);
    const matOlho = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const olhoEsq = new THREE.Mesh(geoOlho, matOlho);
    olhoEsq.position.set(-0.065, 1.34, -0.16);
    grupoAvatar.add(olhoEsq);

    const olhoDir = new THREE.Mesh(geoOlho, matOlho);
    olhoDir.position.set(0.065, 1.34, -0.16);
    grupoAvatar.add(olhoDir);

    // Braços articulados para digitação animada
    const geoBraco = new THREE.CylinderGeometry(0.05, 0.05, 0.35, 8);
    const matBraco = new THREE.MeshStandardMaterial({ color: ag.cor });

    const bracoEsq = new THREE.Mesh(geoBraco, matBraco);
    bracoEsq.position.set(-0.28, 0.82, -0.18);
    bracoEsq.rotation.x = Math.PI / 3;
    grupoAvatar.add(bracoEsq);

    const bracoDir = new THREE.Mesh(geoBraco, matBraco);
    bracoDir.position.set(0.28, 0.82, -0.18);
    bracoDir.rotation.x = Math.PI / 3;
    grupoAvatar.add(bracoDir);

    // Aura de luz sob os pés
    const geoAura = new THREE.RingGeometry(0.4, 0.5, 32);
    const matAura = new THREE.MeshBasicMaterial({ color: ag.cor, side: THREE.DoubleSide });
    const aura = new THREE.Mesh(geoAura, matAura);
    aura.rotation.x = Math.PI / 2;
    aura.position.y = 0.02;
    grupoAvatar.add(aura);

    grupoEstacao.add(grupoAvatar);
    cena3D.add(grupoEstacao);

    meshesAgentes[ag.id] = {
      grupoEstacao,
      grupoAvatar,
      cabeca,
      bracoEsq,
      bracoDir,
      posOriginal: { ...ag.posMesa }
    };
  });
}

/**
 * Controla a movimentação da câmera com mouse e toque (órbita 360° e zoom).
 */
function inicializarControlesCameraman(container) {
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let angleX = 0;
  let angleY = 0.55;
  let distance = 24;

  function updateCamera() {
    if (!camera3D) return;
    camera3D.position.x = distance * Math.sin(angleX) * Math.cos(angleY);
    camera3D.position.y = Math.max(3, distance * Math.sin(angleY));
    camera3D.position.z = distance * Math.cos(angleX) * Math.cos(angleY);
    camera3D.lookAt(0, 1.2, 0);
  }

  container.addEventListener('mousedown', e => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  container.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;
    angleX -= deltaX * 0.006;
    angleY = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, angleY + deltaY * 0.006));
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
    updateCamera();
  });

  container.addEventListener('wheel', e => {
    e.preventDefault();
    distance = Math.max(8, Math.min(42, distance + e.deltaY * 0.025));
    updateCamera();
  }, { passive: false });

  // Touch para celular / tablet
  container.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  });

  container.addEventListener('touchmove', e => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMouseX;
    const deltaY = e.touches[0].clientY - prevMouseY;
    angleX -= deltaX * 0.007;
    angleY = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, angleY + deltaY * 0.007));
    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;
    updateCamera();
  });

  container.addEventListener('touchend', () => { isDragging = false; });
  updateCamera();

  // Expor controles rápidos de câmera para botões do HUD
  if (typeof window !== 'undefined') {
    window.focarCameraEm = function(alvoId) {
      if (alvoId === 'visao_geral') {
        angleX = 0; angleY = 0.55; distance = 24;
      } else if (alvoId === 'war_room') {
        angleX = 0; angleY = 0.45; distance = 10;
      } else if (AGENTES_SQUAD_3D[alvoId]) {
        const ag = AGENTES_SQUAD_3D[alvoId];
        angleX = Math.atan2(ag.posMesa.x, ag.posMesa.z);
        angleY = 0.35;
        distance = 9;
      }
      updateCamera();
    };
  }
}

/**
 * Loop principal de animação 3D com sincronização dos balões HTML 2D.
 */
function loopAnimacao3D() {
  animacaoFrameId = requestAnimationFrame(loopAnimacao3D);

  const tempo = performance.now() * 0.003;

  // 1. Anima braços dos avatares digitando e cabeça oscilando sutilmente
  Object.keys(meshesAgentes).forEach(agId => {
    const agMesh = meshesAgentes[agId];
    if (agMesh) {
      if (agMesh.bracoEsq && agMesh.bracoDir) {
        agMesh.bracoEsq.rotation.x = Math.PI / 3 + Math.sin(tempo * 6 + agId.length) * 0.12;
        agMesh.bracoDir.rotation.x = Math.PI / 3 + Math.cos(tempo * 6 + agId.length) * 0.12;
      }
      if (agMesh.cabeca) {
        agMesh.cabeca.rotation.y = Math.sin(tempo * 1.5 + agId.length) * 0.1;
      }
    }
  });

  // 2. Anima holograma central da War Room
  const holo = cena3D ? cena3D.getObjectByName('holograma_central') : null;
  if (holo) {
    holo.rotation.y += 0.015;
    holo.rotation.x += 0.008;
  }

  // 3. Atualiza feixes luminosos 3D em trânsito
  atualizarFeixesVisuais3D();

  // 4. Sincroniza posições dos balões de texto HTML 2D sobre a cabeça dos agentes
  sincronizarOverlays2DCom3D();

  if (renderer3D && cena3D && camera3D) {
    renderer3D.render(cena3D, camera3D);
  }
}

/**
 * Atualiza e renderiza feixes parabólicos 3D luminosos entre os agentes.
 */
function atualizarFeixesVisuais3D() {
  if (!cena3D) return;

  for (let i = FEIXES_VISUAIS_ATIVOS.length - 1; i >= 0; i--) {
    const pct = FEIXES_VISUAIS_ATIVOS[i];
    pct.progresso += 0.02;

    if (!pct.meshParticula) {
      const geoParticula = new THREE.SphereGeometry(0.18, 12, 12);
      const matParticula = new THREE.MeshBasicMaterial({ color: pct.cor });
      pct.meshParticula = new THREE.Mesh(geoParticula, matParticula);
      cena3D.add(pct.meshParticula);
    }

    if (pct.progresso >= 1.0) {
      // Chegou ao destino: remove partícula e cria pequeno flash de impacto
      if (pct.meshParticula) cena3D.remove(pct.meshParticula);
      FEIXES_VISUAIS_ATIVOS.splice(i, 1);
    } else {
      // Trajetória parabólica 3D: Interpolação linear X e Z + arco seno no Y
      const t = pct.progresso;
      const x = pct.origemPos.x + (pct.destinoPos.x - pct.origemPos.x) * t;
      const z = pct.origemPos.z + (pct.destinoPos.z - pct.origemPos.z) * t;
      const y = 0.8 + Math.sin(t * Math.PI) * pct.alturaArco;

      pct.meshParticula.position.set(x, y, z);
    }
  }
}

/**
 * Projeta a posição 3D de cada avatar para coordenadas de tela 2D (CSS top/left).
 */
function sincronizarOverlays2DCom3D() {
  if (typeof document === 'undefined' || !camera3D || !renderer3D) return;

  const canvas = renderer3D.domElement;
  const rect = canvas.getBoundingClientRect();

  Object.values(AGENTES_SQUAD_3D).forEach(ag => {
    const elOverlay = document.getElementById(`overlay-card-${ag.id}`);
    if (!elOverlay) return;

    // Posição no mundo 3D logo acima da cabeça do avatar
    const posMundo = new THREE.Vector3(ag.posMesa.x, 2.2, ag.posMesa.z);
    posMundo.project(camera3D);

    // Se estiver atrás da câmera, oculta
    if (posMundo.z > 1) {
      elOverlay.style.display = 'none';
      return;
    }

    const x = (posMundo.x * 0.5 + 0.5) * rect.width;
    const y = (-(posMundo.y * 0.5) + 0.5) * rect.height;

    elOverlay.style.display = 'block';
    elOverlay.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
  });
}

function aoRedimensionarJanela3D() {
  if (!camera3D || !renderer3D) return;
  const container = renderer3D.domElement.parentElement;
  if (!container) return;

  const w = container.clientWidth || window.innerWidth;
  const h = container.clientHeight || window.innerHeight;

  camera3D.aspect = w / h;
  camera3D.updateProjectionMatrix();
  renderer3D.setSize(w, h);
}

/**
 * Fallback Canvas 2.5D caso WebGL ou Three.js não estejam disponíveis.
 */
function iniciarFallbackCanvas2D(container) {
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth || window.innerWidth;
  canvas.height = container.clientHeight || window.innerHeight;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.innerHTML = '';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function render2D() {
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1e293b';
    ctx.font = '14px sans-serif';
    ctx.fillText('🏢 Squad Office 3D (Modo Canvas 2.5D Fallback)', 20, 30);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Desenha mesas e avatares em vista isométrica simplificada
    Object.values(AGENTES_SQUAD_3D).forEach(ag => {
      const px = cx + ag.posMesa.x * 28;
      const py = cy + ag.posMesa.z * 22;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px - 30, py - 18, 60, 36);

      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fillStyle = ag.cor;
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ag.nome, px, py + 30);
    });

    requestAnimationFrame(render2D);
  }

  render2D();
}

// ============================================================================
// 6. EXPORTAÇÃO PARA NAVEGADOR E NODE.JS (TESTES AUTOMATIZADOS)
// ============================================================================

if (typeof window !== 'undefined') {
  window.AGENTES_SQUAD_3D = AGENTES_SQUAD_3D;
  window.LOCAIS_ESCRITORIO_3D = LOCAIS_ESCRITORIO_3D;
  window.HISTORICO_ENTREGAS_REAIS = HISTORICO_ENTREGAS_REAIS;
  window.enviarPacoteVisual3D = enviarPacoteVisual3D;
  window.atualizarStatusAgente3D = atualizarStatusAgente3D;
  window.iniciarMissaoSquad3D = iniciarMissaoSquad3D;
  window.avancarEtapaMissao3D = avancarEtapaMissao3D;
  window.obterDadosReaisAppFamilia = obterDadosReaisAppFamilia;
  window.obterResumoSquad3D = obterResumoSquad3D;
  window.iniciarCenaEscritorio3D = iniciarCenaEscritorio3D;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AGENTES_SQUAD_3D,
    LOCAIS_ESCRITORIO_3D,
    HISTORICO_ENTREGAS_REAIS,
    FEIXES_VISUAIS_ATIVOS,
    enviarPacoteVisual3D,
    atualizarStatusAgente3D,
    iniciarMissaoSquad3D,
    avancarEtapaMissao3D,
    obterDadosReaisAppFamilia,
    obterResumoSquad3D
  };
}
