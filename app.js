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

let S = {
  receitas:[],
  gastos:[],
  dividas:[],
  metas:[],
  investimentos:[],
  membrosFamilia:['Alex', 'Gabi'],
  categoriasGastos:[...DEFAULT_CATEGORIAS_GASTOS],
  tiposDivida:[...DEFAULT_TIPOS_DIVIDA],
  chat:[],
  apiKey:'',
  onboardingDone:false
};
let apiKey = '';

function loadState(){
  try { const d=localStorage.getItem('dnm_data'); if(d) S={...S,...JSON.parse(d)}; } catch(e){}
  if(!S.membrosFamilia) S.membrosFamilia = ['Alex', 'Gabi'];
  if(!S.categoriasGastos || !S.categoriasGastos.length) S.categoriasGastos = [...DEFAULT_CATEGORIAS_GASTOS];
  if(!S.tiposDivida || !S.tiposDivida.length) S.tiposDivida = [...DEFAULT_TIPOS_DIVIDA];
  sincronizarTiposDividaMap();

  try { familiaId=localStorage.getItem('dnm_familia_id')||''; } catch(e){}
  if(S.apiKey) apiKey=S.apiKey;
  if(!S.apiKey){ try{ const legado=localStorage.getItem('dnm_key'); if(legado){ S.apiKey=legado; apiKey=legado; } }catch(e){} }
  if(!S.onboardingDone && (S.apiKey || localStorage.getItem('dnm_skip'))) S.onboardingDone=true;
  // Migração: garante que registros antigos (sem mês/status/titular/recorrência) continuem funcionando
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
  });
  (S.dividas||[]).forEach(d=>{
    if(d.titular===undefined) d.titular='';
    if(d.quitada===undefined) d.quitada=false;
    if(d.valorQuitado===undefined) d.valorQuitado=null;
    if(d.dataQuitacao===undefined) d.dataQuitacao=null;
    if(d.acordo===undefined) d.acordo=null;
  });
  if(!S.investimentos) S.investimentos=[];
  (S.investimentos||[]).forEach(inv=>{
    if(inv.titular===undefined) inv.titular='';
  });
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
      try{localStorage.setItem('dnm_data',JSON.stringify(S));}catch(e){}
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
      try{localStorage.setItem('dnm_data',JSON.stringify(S));}catch(e){}
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
  try{localStorage.setItem('dnm_data',JSON.stringify(S));}catch(e){}
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
loadState();
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
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
const TITLES={resumo:'Resumo do mês',receitas:'Receitas',gastos:'Gastos',dividas:'Dívidas',metas:'Investimentos & Metas',agente:'Agente Financeiro',config:'Configurações'};
const SECS=['resumo','receitas','gastos','dividas','metas','agente','config'];
function go(id){
  document.querySelectorAll('.section').forEach(s=>s.style.display='none');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('sec-'+id).style.display='block';
  document.querySelectorAll('.nav-btn')[SECS.indexOf(id)].classList.add('active');
  document.getElementById('header-title').textContent=TITLES[id];
  document.getElementById('content').scrollTop=0;
  render();
}

// MODALS
function openM(id){ document.getElementById(id).classList.add('open'); }
function closeM(id){ document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-bg').forEach(m=>{
  m.addEventListener('click',e=>{ if(e.target===m) m.classList.remove('open'); });
});

function selTag(el){ document.querySelectorAll('#cat-tags .tag').forEach(t=>t.classList.remove('sel')); el.classList.add('sel'); }

// VISÃO MENSAL & GESTÃO FAMILIAR
let mesAtual = new Date().toISOString().slice(0,7); // "YYYY-MM"
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

function mudarMes(delta){
  const [y,m]=mesAtual.split('-').map(Number);
  const d=new Date(y, (m-1)+delta, 1);
  mesAtual = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
  render();
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
  return Array.from(set).sort();
}

function atualizarDatalistTitulares() {
  const dl = document.getElementById('titulares-list');
  if (!dl) return;
  const nomes = obterTitularesUnicos();
  dl.innerHTML = nomes.map(n => `<option value="${escapeHtml(n)}"></option>`).join('');
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
  return (S.gastos||[]).filter(g => (g.data||'').slice(0,7) === mesAtual);
}

// Contas de meses anteriores que continuam não pagas acumulam no mês vigente
function gastosInadimplentesDoMes(){
  return (S.gastos||[]).filter(g => (g.data||'').slice(0,7) < mesAtual && !g.pago && !g.negociado);
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
  
  const entrada = parseFloat(document.getElementById('neg-entrada').value) || 0;
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

  const entrada = parseFloat(document.getElementById('neg-entrada').value) || 0;
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

  const resp=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      contents:[{role:'user',parts:[{text:prompt},{inline_data:{mime_type:file.type||'image/jpeg',data:base64}}]}],
      generationConfig:{responseMimeType:'application/json',maxOutputTokens:300}
    })
  });
  const data=await resp.json();
  const text=data.candidates?.[0]?.content?.parts?.[0]?.text;
  if(!text) throw new Error(data.error?.message||'Sem resposta da IA');
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
  if(!total||total<=0||!num||num<=0){ alert('Preencha o valor total e o número de parcelas.'); return; }
  if(entrada>total){ alert('A entrada não pode ser maior que o valor total.'); return; }
  const restante=Math.round((total-entrada)*100)/100;
  const valorParcela=Math.round((restante/num)*100)/100;
  const parcelas=[]; let soma=0;
  for(let i=1;i<=num;i++){
    const v = i===num ? Math.round((restante-soma)*100)/100 : valorParcela; // última parcela absorve o arredondamento
    soma+=v;
    parcelas.push({num:i,valor:v,paga:false,dataPagto:null});
  }
  d.acordo={valorTotal:total,entrada,numParcelas:num,valorParcela,parcelas};
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

  const mesesOrdenados = Array.from(mesesSet).sort();
  let acumulado = 0;
  for (const ym of mesesOrdenados) {
    const rec = (S.receitas || []).filter(r => (r.data||'').slice(0,7) === ym).reduce((s,r) => s + r.val, 0);
    // Gastos do mês pagos no mês anterior (gastos negociados não consumiram caixa no mês original)
    const gasPagos = (S.gastos || []).filter(g => (g.data||'').slice(0,7) === ym && g.pago && !g.negociado).reduce((s,g) => s + g.val, 0);
    const inv = (S.investimentos || []).filter(i => (i.dataInicio||'').slice(0,7) === ym).reduce((s,i) => s + (i.valorInicial || 0), 0);
    const saldoDoMes = rec - gasPagos - inv;
    acumulado += saldoDoMes;
  }
  return Math.max(0, acumulado); // Sobra positiva acumula para os meses posteriores
}

function calcTotais(){
  const rec = receitasDoMes(), gas = gastosDoMes().filter(g => !g.negociado);
  const totalRec = rec.reduce((s,r) => s + r.val, 0);
  const totalGas = gas.reduce((s,g) => s + g.val, 0);
  
  // Aportes de investimentos no mês
  const invMes = investimentosDoMes(mesAtual);
  const totalInv = invMes.reduce((s,i) => s + (i.valorInicial || 0), 0);
  
  const gasRec = gas.filter(g => g.cat === 'recorrente').reduce((s,g) => s + g.val, 0);
  const gasLaz = gas.filter(g => g.cat === 'lazer').reduce((s,g) => s + g.val, 0);
  const gasNP = gas.filter(g => g.cat === 'nao_planejado').reduce((s,g) => s + g.val, 0);
  const gasVg = gas.filter(g => g.cat === 'viagem').reduce((s,g) => s + g.val, 0);
  
  const abertas = S.dividas.filter(d => !d.quitada);
  const totalDiv = abertas.reduce((s,d) => s + saldoRestante(d), 0);
  const custoJuros = abertas.filter(d => !d.acordo).reduce((s,d) => s + (d.saldo * (d.juros/100)), 0);
  
  // Saldo líquido do mês corrente: Receitas - Gastos - Aportes
  const saldoMes = totalRec - totalGas - totalInv;
  
  // Sobras acumuladas de meses anteriores
  const saldoAnterior = calcSaldoAcumuladoAnterior(mesAtual);
  
  // Saldo total disponível
  const saldoDisp = saldoMes + saldoAnterior;
  
  return {
    totalRec, totalGas, totalInv,
    gasRec, gasLaz, gasNP, gasVg,
    totalDiv, custoJuros,
    saldoMes, saldoAnterior, saldoDisp
  };
}

function calcTotaisAno(anoStr){
  const ano = String(anoStr || (mesAtual ? mesAtual.slice(0,4) : new Date().getFullYear()));
  const recAno = (S.receitas || []).filter(r => (r.data||'').slice(0,4) === ano);
  const gasAno = (S.gastos || []).filter(g => (g.data||'').slice(0,4) === ano && !g.negociado);
  const invAno = (S.investimentos || []).filter(i => (i.dataInicio||'').slice(0,4) === ano);

  const totalRec = recAno.reduce((s,r) => s + r.val, 0);
  const totalGas = gasAno.reduce((s,g) => s + g.val, 0);
  const totalInv = invAno.reduce((s,i) => s + (i.valorInicial || 0), 0);

  const gasRec = gasAno.filter(g => g.cat === 'recorrente').reduce((s,g) => s + g.val, 0);
  const gasLaz = gasAno.filter(g => g.cat === 'lazer').reduce((s,g) => s + g.val, 0);
  const gasNP = gasAno.filter(g => g.cat === 'nao_planejado').reduce((s,g) => s + g.val, 0);
  const gasVg = gasAno.filter(g => g.cat === 'viagem').reduce((s,g) => s + g.val, 0);

  const abertas = S.dividas.filter(d => !d.quitada);
  const totalDiv = abertas.reduce((s,d) => s + saldoRestante(d), 0);
  const custoJuros = abertas.filter(d => !d.acordo).reduce((s,d) => s + (d.saldo * (d.juros/100)), 0);

  const saldoLiquido = totalRec - totalGas - totalInv;

  return {
    ano,
    totalRec,
    totalGas,
    totalInv,
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

// RENDER
function render(){
  atualizarDatalistTitulares();
  atualizarSelectsTipoDivida();
  renderCategoriasModalGasto();
  updateMesLabel();
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
    $('saldo-disp').textContent = fmt(tAno.saldoLiquido);
    $('saldo-disp').className = 'big-num ' + sc;

    const txtSaldoMes = $('txt-saldo-mes');
    if(txtSaldoMes) txtSaldoMes.textContent = `Receitas: ${fmt(tAno.totalRec)} • Gastos: ${fmt(tAno.totalGas)} • Aportes: ${fmt(tAno.totalInv)}`;
    const txtSaldoAnt = $('txt-saldo-anterior');
    if(txtSaldoAnt) txtSaldoAnt.style.display = 'none';

    const pctUsado = tAno.totalRec > 0 ? Math.min(100, Math.round(((tAno.totalGas + tAno.totalInv) / tAno.totalRec) * 100)) : 0;
    const pctLivre = Math.max(0, 100 - pctUsado);
    const fc = pctUsado >= 100 ? 'var(--red)' : pctUsado > 70 ? 'var(--yellow)' : 'var(--green)';
    $('meter-fill').style.width = pctLivre + '%';
    $('meter-fill').style.background = fc;
    $('meter-tip').textContent = tAno.totalRec > 0 
      ? `${pctUsado}% da receita anual comprometida — saldo líquido de ${fmt(tAno.saldoLiquido)}`
      : 'Cadastre receitas no ano para acompanhar o progresso.';

    $('r-rec').textContent = fmt(tAno.totalRec);
    $('r-gas').textContent = fmt(tAno.totalGas);
    $('r-fix').textContent = fmt(tAno.gasRec);
    $('r-div').textContent = fmt(tAno.totalDiv);
    const rInv = $('r-inv');
    if(rInv) rInv.textContent = fmt(tAno.totalInv);
    const rLiq = $('r-liq');
    if(rLiq) {
      rLiq.textContent = fmt(tAno.saldoLiquido);
      rLiq.className = 'mc-val ' + (tAno.saldoLiquido < 0 ? 'c-red' : 'c-green');
    }

    $('alerta-box').innerHTML = tAno.saldoLiquido < 0 
      ? `<div class="alert alert-r">⚠️ No consolidado de ${anoSelecionado}, os gastos e aportes superam a receita em ${fmt(Math.abs(tAno.saldoLiquido))}.</div>` 
      : '';

    const cardPrio = $('card-prio-lista');
    if(cardPrio) cardPrio.style.display = 'none';

  } else {
    // Modo Mensal
    const t = calcTotais();
    const lblSaldo = $('lbl-saldo-disp');
    if(lblSaldo) lblSaldo.textContent = 'Saldo disponível no mês';

    const sc = t.saldoDisp < 0 ? 'c-red' : (t.saldoDisp < t.totalRec * 0.1 && t.totalRec > 0 ? 'c-yellow' : 'c-green');
    $('saldo-disp').textContent = fmt(t.saldoDisp);
    $('saldo-disp').className = 'big-num ' + sc;

    const txtSaldoMes = $('txt-saldo-mes');
    if(txtSaldoMes) txtSaldoMes.textContent = `Saldo deste mês: ${fmt(t.saldoMes)} (Receita - Gastos - Aportes)`;
    
    const txtSaldoAnt = $('txt-saldo-anterior');
    if(txtSaldoAnt) {
      if(t.saldoAnterior > 0) {
        txtSaldoAnt.textContent = `Sobras anteriores: +${fmt(t.saldoAnterior)}`;
        txtSaldoAnt.style.display = 'inline';
      } else {
        txtSaldoAnt.style.display = 'none';
      }
    }

    const pctUsado = t.totalRec > 0 ? Math.min(100, Math.round(((t.totalGas + t.totalInv) / t.totalRec) * 100)) : 0;
    const pctLivre = Math.max(0, 100 - pctUsado);
    const fc = pctUsado >= 100 ? 'var(--red)' : pctUsado > 70 ? 'var(--yellow)' : 'var(--green)';
    $('meter-fill').style.width = pctLivre + '%';
    $('meter-fill').style.background = fc;
    if(t.totalRec > 0){
      $('meter-tip').textContent = pctUsado >= 100
        ? `⚠️ Receita do mês esgotada — faltam ${fmt(Math.abs(t.saldoMes))} para cobrir o mês`
        : `${pctUsado}% comprometido — sobram ${fmt(t.saldoDisp)} (${pctLivre}%)`;
    } else {
      $('meter-tip').textContent = 'Cadastre sua receita para começar';
    }

    $('r-rec').textContent = fmt(t.totalRec);
    $('r-gas').textContent = fmt(t.totalGas);
    $('r-fix').textContent = fmt(t.gasRec);
    $('r-div').textContent = fmt(t.totalDiv);
    const rInv = $('r-inv');
    if(rInv) rInv.textContent = fmt(t.totalInv);
    const rLiq = $('r-liq');
    if(rLiq) {
      rLiq.textContent = fmt(t.saldoMes);
      rLiq.className = 'mc-val ' + (t.saldoMes < 0 ? 'c-red' : 'c-green');
    }

    let alertHtml = '';
    if(t.saldoMes < 0 && t.saldoDisp < 0) alertHtml = `<div class="alert alert-r">⚠️ Gastos e aportes superam a receita em ${fmt(Math.abs(t.saldoDisp))} — veja as prioridades abaixo.</div>`;
    else if(t.saldoMes < 0 && t.saldoDisp >= 0) alertHtml = `<div class="alert alert-y">💡 Gastos do mês superaram a receita, mas você foi coberto pela sobra de meses anteriores (+${fmt(t.saldoAnterior)}).</div>`;
    else if(t.saldoDisp < t.totalRec * 0.1 && t.totalRec > 0) alertHtml = `<div class="alert alert-y">Atenção: restam apenas ${fmt(t.saldoDisp)} após os gastos e aportes.</div>`;
    $('alerta-box').innerHTML = alertHtml;

    // Prioridades
    const prios = [];
    const abertas = S.dividas.filter(d => !d.quitada);
    const cartoes = abertas.filter(d => d.tipo === 'cartao' && !d.acordo).sort((a,b) => b.juros - a.juros);
    const emps = abertas.filter(d => d.tipo !== 'cartao' && !d.acordo).sort((a,b) => b.juros - a.juros);
    const acordos = abertas.filter(d => d.acordo);
    if(t.saldoDisp < 0) prios.push({ c: 'r', tag: '🔴 Urgente', nome: 'Receita insuficiente', det: `Corte ${fmt(Math.abs(t.saldoDisp))} em gastos para equilibrar o mês.` });
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
    $('prio-lista').innerHTML = prios.length
      ? prios.slice(0,5).map(p => `<div class="${classMap[p.c]}"><p class="prio-tag">${p.tag}</p><p class="prio-name">${p.nome}</p><p class="prio-detail">${p.det}</p></div>`).join('')
      : '<p style="font-size:13px;color:var(--muted);">Cadastre gastos e dívidas para ver as prioridades.</p>';

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
  const t=calcTotais();
  const bd=document.getElementById('breakdown-gastos');
  const listaMes=gastosDoMes();
  if(listaMes.length){
    const cats = (S.categoriasGastos || DEFAULT_CATEGORIAS_GASTOS).map(c => {
      const v = listaMes.filter(g => g.cat === c.id).reduce((s,g) => s + g.val, 0);
      return { l: c.nome, v, c: c.cor || 'c-muted' };
    }).filter(c => c.v > 0);
    bd.innerHTML = `<div class="grid2">${cats.slice(0, 6).map(c=>`<div class="mc"><p class="mc-label">${escapeHtml(c.l)}</p><p class="mc-val ${c.c}">${fmt(c.v)}</p></div>`).join('')}</div>`;
  } else bd.innerHTML='';

  // Inadimplência acumulada de meses anteriores
  const inadBox = document.getElementById('inadimplencia-box');
  const inadGeral = gastosInadimplentesDoMes();
  const inadFiltrada = inadGeral.filter(g => filtroTitularGasto === 'todos' || g.titular === filtroTitularGasto);
  if(inadBox){
    if(inadFiltrada.length > 0){
      const totalInad = inadFiltrada.reduce((s,g) => s + g.val, 0);
      inadBox.innerHTML = `
        <div class="alert alert-r" style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-weight:700;">
            <span>⚠️ Inadimplência Acumulada</span>
            <span>${fmt(totalInad)}</span>
          </div>
          <p style="font-size:12px;margin:4px 0 8px;opacity:0.9;">
            ${inadFiltrada.length} conta(s) de meses anteriores não pagas acumularam neste mês:
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
        </div>`;
    } else {
      inadBox.innerHTML = '';
    }
  }

  const el=document.getElementById('lista-gastos');
  const badges={recorrente:'b-rec',nao_planejado:'b-unp',lazer:'b-laz',viagem:'b-vg'};
  
  const previstos = gastosPrevistosDoMes().filter(g => filtroTitularGasto === 'todos' || g.titular === filtroTitularGasto);

  if(!previstos.length && !inadFiltrada.length){
    el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhum gasto neste mês.</p>';
    return;
  }
  
  el.innerHTML=previstos.map(g=>{
    const tipoDivTxt = g.tipoDivida ? (TIPOS_DIVIDA[g.tipoDivida] || g.tipoDivida) : '';
    const origemTxt = g.origemDivida ? `${escapeHtml(g.origemDivida)} • ` : '';
    const parcBadge = g.parcelado ? `<span class="badge b-parc">${origemTxt}${tipoDivTxt ? escapeHtml(tipoDivTxt) + ' ' : ''}${g.parcelaNum}/${g.totalParcelas}</span>` : '';
    const recBadge = g.recorrente ? `<span class="badge b-rec">Fixo ${g.mesNum}/${g.totalMeses}</span>` : '';
    const titBadge = g.titular ? `<span class="badge b-titular">${escapeHtml(g.titular)}</span>` : '';
    const negociadoBadge = g.negociado ? `<span class="badge" style="background:rgba(168,85,247,0.18);color:#c084fc;border:1px solid rgba(168,85,247,0.3);">🤝 Negociado</span>` : '';
    const statusHtml = `<button class="status-btn ${g.pago?'pago':'pendente'}" onclick="togglePagoGasto(${g.id})">${g.pago?'✓ Pago':'⏳ Aberto'}</button>`;
    const adiantarHtml = g.parcelado ? `<button class="btn-adiantar" onclick="abrirModalAdiantar('${escapeHtml(g.grupoId)}')">⏩ Adiantar</button>` : '';
    const negociarHtml = (!g.pago && !g.negociado) ? `<button class="btn-negociar" onclick="abrirModalNegociarGasto(${g.id})">🤝 Negociar</button>` : '';

    return `<div class="item-row">
      <div style="flex:1;display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
        <span class="item-name">${escapeHtml(g.desc)}</span>
        <span class="badge ${badges[g.cat]||'b-rec'}">${escapeHtml(getNomeCategoria(g.cat))}</span>
        ${titBadge}
        ${parcBadge}
        ${recBadge}
        ${negociadoBadge}
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <span class="item-val c-red">${fmt(g.val)}</span>
        ${g.negociado ? '' : statusHtml}
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
    let parcelasHtml='';
    if(d.acordo){
      const pagas=d.acordo.parcelas.filter(p=>p.paga).length;
      parcelasHtml=`
        <div class="div-line"><span style="color:var(--muted);">Entrada</span><span>${fmt(d.acordo.entrada)}</span></div>
        <div class="div-line"><span style="color:var(--muted);">Parcelas pagas</span><span>${pagas}/${d.acordo.numParcelas} (${fmt(d.acordo.valorParcela)} cada)</span></div>
        <div class="parcelas-grid">${d.acordo.parcelas.map(p=>`<span class="parcela-pill ${p.paga?'pp-paga':''}" onclick="toggleParcela(${d.id},${p.num})">${p.num}</span>`).join('')}</div>
        <p style="font-size:11px;color:var(--muted);margin-top:4px;">Toque no número pra marcar/desmarcar a parcela como paga</p>`;
    }
    return `<div class="div-row">
      <div class="div-header">
        <span class="div-name">${escapeHtml(d.credor)}${titBadge}${d.acordo?' <span class="badge b-rec">Acordo</span>':''}</span>
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
    html+=quitadas.map(d=>`<div class="div-row" style="opacity:0.65;">
      <div class="div-header">
        <span class="div-name">${escapeHtml(d.credor)}</span>
        <span class="item-del" onclick="if(confirm('Excluir este registro?')){S.dividas=del(S.dividas,${d.id});save();render();}">×</span>
      </div>
      <div class="div-line"><span style="color:var(--muted);">Valor quitado</span><span class="c-green" style="font-weight:600;">${fmt(d.valorQuitado||0)}</span></div>
      <div class="div-line"><span style="color:var(--muted);">Data</span><span>${escapeHtml(d.dataQuitacao||'-')}</span></div>
    </div>`).join('');
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
    const resp=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({contents:messages,generationConfig:{maxOutputTokens:1000}})
    });
    const data=await resp.json();
    const reply=data.candidates?.[0]?.content?.parts?.[0]?.text||'Erro ao obter resposta. Verifique sua API Key.';
    S.chat.push({role:'model',parts:[{text:reply}]});
    save();
  } catch(e){ S.chat.push({role:'model',parts:[{text:'Erro de conexão. Tente novamente.'}]}); }

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
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
