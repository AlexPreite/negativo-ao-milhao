// STATE
let S = { receitas:[], gastos:[], dividas:[], metas:[], investimentos:[], chat:[], apiKey:'', onboardingDone:false };
let apiKey = '';

function loadState(){
  try { const d=localStorage.getItem('dnm_data'); if(d) S={...S,...JSON.parse(d)}; } catch(e){}
  try { familiaId=localStorage.getItem('dnm_familia_id')||''; } catch(e){}
  if(S.apiKey) apiKey=S.apiKey;
  if(!S.apiKey){ try{ const legado=localStorage.getItem('dnm_key'); if(legado){ S.apiKey=legado; apiKey=legado; } }catch(e){} }
  if(!S.onboardingDone && (S.apiKey || localStorage.getItem('dnm_skip'))) S.onboardingDone=true;
  // Migração: garante que registros antigos (sem mês/status/titular) continuem funcionando
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
const TITLES={resumo:'Resumo do mês',receitas:'Receitas',gastos:'Gastos',dividas:'Dívidas',investimentos:'Investimentos',metas:'Metas & Economias',agente:'Agente Financeiro',config:'Configurações'};
const SECS=['resumo','receitas','gastos','dividas','investimentos','metas','agente','config'];
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

const TIPOS_DIVIDA = {
  cartao: 'Cartão de crédito',
  emprestimo: 'Empréstimo bancário',
  emprestimo_pf: 'Empréstimo pessoa física'
};

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

// // SANITIZAÇÃO & XSS
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
  const set = new Set();
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
  return (S.gastos||[]).filter(g => (g.data||'').slice(0,7) < mesAtual && !g.pago);
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
  atualizarPreviewParcelas();
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

function abrirModalGasto(){
  document.getElementById('g-data').value = dataDefaultParaModal();
  document.getElementById('g-is-parcelado').checked = false;
  document.getElementById('g-bloco-parcelamento').style.display = 'none';
  document.getElementById('g-num-parcelas').value = '2';
  document.getElementById('g-preview-parcela').textContent = '';
  openM('m-gasto');
}
function abrirModalReceita(){ document.getElementById('r-data').value=dataDefaultParaModal(); openM('m-receita'); }
function abrirModalInvestimento(){ document.getElementById('inv-data').value=new Date().toISOString().slice(0,10); openM('m-investimento'); }

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
  if(!desc||!val||val<=0) return;

  if (isParcelado) {
    const num = Math.max(2, parseInt(document.getElementById('g-num-parcelas').value) || 2);
    const tipoDivida = document.getElementById('g-tipo-divida')?.value || 'cartao';
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
        parcelado: true,
        parcelaNum: i,
        totalParcelas: num,
        data: dt,
        dataOriginal: dt,
        pago: false,
        dataPagto: null,
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
  const valorInicial=parseFloat(document.getElementById('inv-valor').value);
  const taxaMensal=parseFloat(document.getElementById('inv-taxa').value);
  const dataInicio=document.getElementById('inv-data').value || new Date().toISOString().slice(0,10);
  if(!banco||!valorInicial||valorInicial<=0||isNaN(taxaMensal)){ alert('Preencha banco, valor investido e a taxa mensal.'); return; }
  S.investimentos.push({id:Date.now(),banco,valorInicial,taxaMensal,dataInicio,titular});
  save(); closeM('m-investimento'); render();
  document.getElementById('inv-banco').value=''; document.getElementById('inv-valor').value=''; document.getElementById('inv-taxa').value='';
  if(document.getElementById('inv-titular')) document.getElementById('inv-titular').value='';
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

function renderInvestimentos(){
  const el=document.getElementById('lista-investimentos');
  const totalEl=document.getElementById('total-inv-big');
  const rendEl=document.getElementById('rend-inv-txt');
  if(!S.investimentos.length){
    if(el) el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhum investimento cadastrado ainda.</p>';
    if(totalEl) totalEl.textContent=fmt(0);
    if(rendEl) rendEl.textContent='';
    return;
  }
  let totalInicial=0, totalAtual=0;
  const html=S.investimentos.map(inv=>{
    const meses=mesesEntre(inv.dataInicio);
    const atual=valorAtualInvestimento(inv);
    const rendimento=atual-inv.valorInicial;
    totalInicial+=inv.valorInicial; totalAtual+=atual;
    return `<div class="div-row">
      <div class="div-header">
        <span class="div-name">${escapeHtml(inv.banco)}${inv.titular ? ' <span class="badge b-titular">'+escapeHtml(inv.titular)+'</span>' : ''}</span>
        <span class="item-del" onclick="if(confirm('Excluir este investimento?')){S.investimentos=del(S.investimentos,${inv.id});save();render();}">×</span>
      </div>
      <div class="div-line"><span style="color:var(--muted);">Valor investido</span><span>${fmt(inv.valorInicial)}</span></div>
      <div class="div-line"><span style="color:var(--muted);">Taxa</span><span>${inv.taxaMensal}% ao mês</span></div>
      <div class="div-line"><span style="color:var(--muted);">Tempo aplicado</span><span>${meses} ${meses===1?'mês':'meses'}</span></div>
      <div class="div-line"><span style="color:var(--muted);">Valor atual</span><span class="c-green" style="font-weight:600;">${fmt(atual)}</span></div>
      <div class="div-line"><span style="color:var(--muted);">Rendimento</span><span class="c-green">+${fmt(rendimento)}</span></div>
    </div>`;
  }).join('');
  if(el) el.innerHTML=html;
  if(totalEl) totalEl.textContent=fmt(totalAtual);
  if(rendEl) rendEl.textContent=totalAtual>totalInicial?`Rendimento acumulado: +${fmt(totalAtual-totalInicial)} sobre ${fmt(totalInicial)} investidos`:'';
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
function calcTotais(){
  const rec=receitasDoMes(), gas=gastosDoMes();
  const totalRec=rec.reduce((s,r)=>s+r.val,0);
  const totalGas=gas.reduce((s,g)=>s+g.val,0);
  const gasRec=gas.filter(g=>g.cat==='recorrente').reduce((s,g)=>s+g.val,0);
  const gasLaz=gas.filter(g=>g.cat==='lazer').reduce((s,g)=>s+g.val,0);
  const gasNP=gas.filter(g=>g.cat==='nao_planejado').reduce((s,g)=>s+g.val,0);
  const gasVg=gas.filter(g=>g.cat==='viagem').reduce((s,g)=>s+g.val,0);
  const abertas=S.dividas.filter(d=>!d.quitada);
  const totalDiv=abertas.reduce((s,d)=>s+saldoRestante(d),0);
  const custoJuros=abertas.filter(d=>!d.acordo).reduce((s,d)=>s+(d.saldo*(d.juros/100)),0);
  const saldoDisp=totalRec-totalGas;
  return{totalRec,totalGas,gasRec,gasLaz,gasNP,gasVg,totalDiv,custoJuros,saldoDisp};
}

// RENDER
function render(){
  atualizarDatalistTitulares();
  updateMesLabel();
  renderResumo();
  renderReceitas();
  renderGastos();
  renderDividas();
  renderMetas();
  renderInvestimentos();
}

function renderResumo(){
  const t=calcTotais();
  const $=id=>document.getElementById(id);

  const sc=t.saldoDisp<0?'c-red':t.saldoDisp<t.totalRec*0.1&&t.totalRec>0?'c-yellow':'c-green';
  $('saldo-disp').textContent=fmt(t.saldoDisp);
  $('saldo-disp').className='big-num '+sc;

  const pctUsado=t.totalRec>0?Math.min(100,Math.round((t.totalGas/t.totalRec)*100)):0;
  const pctLivre=Math.max(0,100-pctUsado);
  const fc=pctUsado>=100?'var(--red)':pctUsado>70?'var(--yellow)':'var(--green)';
  $('meter-fill').style.width=pctLivre+'%';
  $('meter-fill').style.background=fc;
  if(t.totalRec>0){
    $('meter-tip').textContent=pctUsado>=100
      ?`⚠ Salário esgotado — falta ${fmt(Math.abs(t.saldoDisp))} para cobrir os gastos`
      :`${pctUsado}% comprometido — sobram ${fmt(t.saldoDisp)} (${pctLivre}%)`;
  }

  $('r-rec').textContent=fmt(t.totalRec);
  $('r-gas').textContent=fmt(t.totalGas);
  $('r-fix').textContent=fmt(t.gasRec);
  $('r-div').textContent=fmt(t.totalDiv);

  let alertHtml='';
  if(t.saldoDisp<0) alertHtml=`<div class="alert alert-r">⚠ Gastos superam a receita em ${fmt(Math.abs(t.saldoDisp))} — veja as prioridades abaixo.</div>`;
  else if(t.saldoDisp<t.totalRec*0.1&&t.totalRec>0) alertHtml=`<div class="alert alert-y">Atenção: restam apenas ${fmt(t.saldoDisp)} após os gastos.</div>`;
  $('alerta-box').innerHTML=alertHtml;

  // Prioridades
  const prios=[];
  const abertas=S.dividas.filter(d=>!d.quitada);
  const cartoes=abertas.filter(d=>d.tipo==='cartao'&&!d.acordo).sort((a,b)=>b.juros-a.juros);
  const emps=abertas.filter(d=>d.tipo!=='cartao'&&!d.acordo).sort((a,b)=>b.juros-a.juros);
  const acordos=abertas.filter(d=>d.acordo);
  if(t.saldoDisp<0) prios.push({c:'r',tag:'🔴 Urgente',nome:'Receita insuficiente',det:`Corte ${fmt(Math.abs(t.saldoDisp))} em gastos para equilibrar o mês.`});
  cartoes.forEach(d=>prios.push({c:'r',tag:'🔴 Pagar primeiro',nome:d.credor+' (cartão)',det:`${d.juros}%/mês = ${fmt(d.saldo*(d.juros/100))} em juros/mês. Use todo saldo livre.`}));
  emps.forEach((d,i)=>prios.push({c:i===0?'y':'g',tag:i===0?'🟡 Em seguida':'🟢 Manter parcela',nome:d.credor+(d.tipo==='emprestimo_pf'?' (empréstimo PF)':' (empréstimo)'),det:`${d.juros}%/mês${d.parcela?' — parcela '+fmt(d.parcela):''}. Mantenha em dia.`}));
  acordos.forEach(d=>{
    const prox=d.acordo.parcelas.find(p=>!p.paga);
    const pagas=d.acordo.parcelas.filter(p=>p.paga).length;
    prios.push({c:'y',tag:'🤝 Acordo em andamento',nome:d.credor,det:prox?`Parcela ${prox.num}/${d.acordo.numParcelas} de ${fmt(prox.valor)} — pague e marque como paga na aba Dívidas.`:`${pagas}/${d.acordo.numParcelas} parcelas pagas.`});
  });
  if(t.gasLaz>t.totalRec*0.15&&t.totalRec>0) prios.push({c:'y',tag:'🟡 Reduzir',nome:'Lazer acima do ideal',det:`${fmt(t.gasLaz)} em lazer — limite saudável é ${fmt(t.totalRec*0.15)} (15% da renda).`});
  if(t.gasNP>0) prios.push({c:'g',tag:'🟢 Monitorar',nome:'Gastos imprevistos',det:`${fmt(t.gasNP)} este mês. Analise o que pode evitar.`});

  const classMap={r:'prio prio-r',y:'prio prio-y',g:'prio prio-g'};
  $('prio-lista').innerHTML=prios.length
    ? prios.slice(0,5).map(p=>`<div class="${classMap[p.c]}"><p class="prio-tag">${p.tag}</p><p class="prio-name">${p.nome}</p><p class="prio-detail">${p.det}</p></div>`).join('')
    : '<p style="font-size:13px;color:var(--muted);">Cadastre gastos e dívidas para ver as prioridades.</p>';

  const guardado=S.metas.find(m=>m.nome.toLowerCase().includes('reserva'))?.atual||S.metas[0]?.atual||0;
  const pct100k=Math.min(100,Math.round((guardado/100000)*100));
  $('prog-val').textContent=fmt(guardado)+' guardado';
  $('prog-pct').textContent=pct100k+'%';
  $('prog-fill').style.width=pct100k+'%';
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
    const cats=[{l:'Fixos',v:t.gasRec,c:'c-yellow'},{l:'Lazer',v:t.gasLaz,c:'c-red'},{l:'Imprevistos',v:t.gasNP,c:'c-red'},{l:'Viagem',v:t.gasVg,c:'c-muted'}];
    bd.innerHTML=`<div class="grid2">${cats.filter(c=>c.v>0).slice(0,4).map(c=>`<div class="mc"><p class="mc-label">${c.l}</p><p class="mc-val ${c.c}">${fmt(c.v)}</p></div>`).join('')}</div>`;
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
  const labels={recorrente:'Fixo',nao_planejado:'Imprevisto',lazer:'Lazer',viagem:'Viagem'};
  
  const previstos = gastosPrevistosDoMes().filter(g => filtroTitularGasto === 'todos' || g.titular === filtroTitularGasto);

  if(!previstos.length && !inadFiltrada.length){
    el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhum gasto neste mês.</p>';
    return;
  }
  
  el.innerHTML=previstos.map(g=>{
    const tipoDivTxt = g.tipoDivida ? (TIPOS_DIVIDA[g.tipoDivida] || g.tipoDivida) : '';
    const parcBadge = g.parcelado ? `<span class="badge b-parc">${tipoDivTxt ? escapeHtml(tipoDivTxt) + ' ' : ''}${g.parcelaNum}/${g.totalParcelas}</span>` : '';
    const titBadge = g.titular ? `<span class="badge b-titular">${escapeHtml(g.titular)}</span>` : '';
    const statusHtml = `<button class="status-btn ${g.pago?'pago':'pendente'}" onclick="togglePagoGasto(${g.id})">${g.pago?'✓ Pago':'⏳ Aberto'}</button>`;
    const adiantarHtml = g.parcelado ? `<button class="btn-adiantar" onclick="abrirModalAdiantar('${escapeHtml(g.grupoId)}')">⏩ Adiantar</button>` : '';

    return `<div class="item-row">
      <div style="flex:1;display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
        <span class="item-name">${escapeHtml(g.desc)}</span>
        <span class="badge ${badges[g.cat]||'b-rec'}">${labels[g.cat]||g.cat}</span>
        ${titBadge}
        ${parcBadge}
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <span class="item-val c-red">${fmt(g.val)}</span>
        ${statusHtml}
        ${adiantarHtml}
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
    const tipoLabel = d.tipo==='cartao' ? 'Cartão de crédito' : d.tipo==='emprestimo_pf' ? 'Empréstimo pessoa física' : 'Empréstimo bancário';
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

function renderMetas(){
  const el=document.getElementById('lista-metas');
  if(!S.metas.length){el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhuma meta criada.</p>';return;}
  el.innerHTML=S.metas.map(m=>{
    const pct=Math.min(100,Math.round((m.atual/m.total)*100));
    const falta=Math.max(0,m.total-m.atual);
    return `<div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span style="font-weight:600;font-size:14px;">${escapeHtml(m.nome)}</span>
        <span class="item-del" onclick="S.metas=del(S.metas,${m.id});save();render()">×</span>
      </div>
      <div class="prog-wrap">
        <div class="prog-row"><span>${fmt(m.atual)} de ${fmt(m.total)}</span><span>${pct}%</span></div>
        <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;"></div></div>
      </div>
      <p style="font-size:12px;color:var(--muted);margin-top:8px;">Faltam ${fmt(falta)}</p>
    </div>`;
  }).join('');
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
