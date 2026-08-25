// STATE
let S = { receitas:[], gastos:[], dividas:[], metas:[], investimentos:[], chat:[], apiKey:'', onboardingDone:false };
let apiKey = '';

function loadState(){
  try { const d=localStorage.getItem('dnm_data'); if(d) S={...S,...JSON.parse(d)}; } catch(e){}
  try { familiaId=localStorage.getItem('dnm_familia_id')||''; } catch(e){}
  if(S.apiKey) apiKey=S.apiKey;
  if(!S.apiKey){ try{ const legado=localStorage.getItem('dnm_key'); if(legado){ S.apiKey=legado; apiKey=legado; } }catch(e){} }
  if(!S.onboardingDone && (S.apiKey || localStorage.getItem('dnm_skip'))) S.onboardingDone=true;
  // Migração: garante que registros antigos (sem mês/status) continuem aparecendo
  const hoje=new Date().toISOString().slice(0,10);
  (S.receitas||[]).forEach(r=>{ if(!r.data) r.data=hoje; });
  (S.gastos||[]).forEach(g=>{ if(!g.data) g.data=hoje; });
  (S.dividas||[]).forEach(d=>{
    if(d.quitada===undefined) d.quitada=false;
    if(d.valorQuitado===undefined) d.valorQuitado=null;
    if(d.dataQuitacao===undefined) d.dataQuitacao=null;
    if(d.acordo===undefined) d.acordo=null;
  });
  if(!S.investimentos) S.investimentos=[];
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
    .catch(()=>{ msg.textContent='Telefone ou senha incorretos.'; });
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
  if(!v){ alert('Digite um código (ex: preite-familia-2026).'); return; }
  familiaId=v; localStorage.setItem('dnm_familia_id',v);
  updateFamiliaStatus();
  if(fbUser && fbDb){
    loadFromCloud().then(()=>{
      fbDb.collection('usuarios').doc(familiaId).set(S).catch(e=>console.error('Erro ao sincronizar:',e));
      render();
      alert('Código salvo e sincronizado! Use exatamente o mesmo código no aparelho da Gabi, em Configurações.');
    });
  } else {
    alert('Código salvo. Faça login pra sincronizar.');
  }
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
      fbDb.collection('usuarios').doc(id).set(S).catch(e=>console.error('Erro ao sincronizar:',e));
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

// VISÃO MENSAL
let mesAtual = new Date().toISOString().slice(0,7); // "YYYY-MM"

function mesLabel(ym){
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
function receitasDoMes(){ return S.receitas.filter(r=>(r.data||'').slice(0,7)===mesAtual); }
function gastosDoMes(){ return S.gastos.filter(g=>(g.data||'').slice(0,7)===mesAtual); }
function updateMesLabel(){ document.querySelectorAll('.mes-label').forEach(el=>el.textContent=mesLabel(mesAtual)); }

function dataDefaultParaModal(){
  const hojeYM=new Date().toISOString().slice(0,7);
  return mesAtual===hojeYM ? new Date().toISOString().slice(0,10) : mesAtual+'-01';
}
function abrirModalGasto(){ document.getElementById('g-data').value=dataDefaultParaModal(); openM('m-gasto'); }
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
  const desc=document.getElementById('r-desc').value.trim(), val=parseFloat(document.getElementById('r-val').value), tipo=document.getElementById('r-tipo').value;
  const data=document.getElementById('r-data').value || new Date().toISOString().slice(0,10);
  if(!desc||!val||val<=0) return;
  S.receitas.push({id:Date.now(),desc,val,tipo,data}); save(); closeM('m-receita'); render();
  document.getElementById('r-desc').value=''; document.getElementById('r-val').value='';
  const rf=document.getElementById('r-file'); if(rf) rf.value='';
  const rst=document.getElementById('r-ocr-status'); if(rst) rst.textContent='';
}
function addGasto(){
  const desc=document.getElementById('g-desc').value.trim(), val=parseFloat(document.getElementById('g-val').value);
  const cat=document.querySelector('#cat-tags .tag.sel')?.dataset.cat||'recorrente';
  const data=document.getElementById('g-data').value || new Date().toISOString().slice(0,10);
  if(!desc||!val||val<=0) return;
  S.gastos.push({id:Date.now(),desc,val,cat,data}); save(); closeM('m-gasto'); render();
  document.getElementById('g-desc').value=''; document.getElementById('g-val').value='';
  const gf=document.getElementById('g-file'); if(gf) gf.value='';
  const gst=document.getElementById('g-ocr-status'); if(gst) gst.textContent='';
}
function addDivida(){
  const credor=document.getElementById('d-credor').value.trim(), saldo=parseFloat(document.getElementById('d-saldo').value);
  const juros=parseFloat(document.getElementById('d-juros').value)||0;
  const parcela=parseFloat(document.getElementById('d-parcela').value)||0;
  const tipo=document.getElementById('d-tipo').value;
  if(!credor||!saldo||saldo<=0) return;
  S.dividas.push({id:Date.now(),credor,saldo,juros,parcela,tipo,quitada:false,valorQuitado:null,dataQuitacao:null,acordo:null});
  save(); closeM('m-divida'); render();
  document.getElementById('d-credor').value=''; document.getElementById('d-saldo').value='';
  document.getElementById('d-juros').value=''; document.getElementById('d-parcela').value='';
}
function addMeta(){
  const nome=document.getElementById('mt-nome').value.trim(), total=parseFloat(document.getElementById('mt-total').value), atual=parseFloat(document.getElementById('mt-atual').value)||0;
  if(!nome||!total||total<=0) return;
  S.metas.push({id:Date.now(),nome,total,atual}); save(); closeM('m-meta'); render();
  document.getElementById('mt-nome').value=''; document.getElementById('mt-total').value=''; document.getElementById('mt-atual').value='';
}
function del(arr,id){ return arr.filter(i=>i.id!==id); }

// INVESTIMENTOS — evolução automática por juros compostos mensais
function addInvestimento(){
  const banco=document.getElementById('inv-banco').value.trim();
  const valorInicial=parseFloat(document.getElementById('inv-valor').value);
  const taxaMensal=parseFloat(document.getElementById('inv-taxa').value);
  const dataInicio=document.getElementById('inv-data').value || new Date().toISOString().slice(0,10);
  if(!banco||!valorInicial||valorInicial<=0||isNaN(taxaMensal)){ alert('Preencha banco, valor investido e a taxa mensal.'); return; }
  S.investimentos.push({id:Date.now(),banco,valorInicial,taxaMensal,dataInicio});
  save(); closeM('m-investimento'); render();
  document.getElementById('inv-banco').value=''; document.getElementById('inv-valor').value=''; document.getElementById('inv-taxa').value='';
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
        <span class="div-name">${inv.banco}</span>
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
function render(){ updateMesLabel(); renderResumo(); renderReceitas(); renderGastos(); renderDividas(); renderMetas(); renderInvestimentos(); }

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
  const emps=abertas.filter(d=>d.tipo==='emprestimo'&&!d.acordo).sort((a,b)=>b.juros-a.juros);
  const acordos=abertas.filter(d=>d.acordo);
  if(t.saldoDisp<0) prios.push({c:'r',tag:'🔴 Urgente',nome:'Receita insuficiente',det:`Corte ${fmt(Math.abs(t.saldoDisp))} em gastos para equilibrar o mês.`});
  cartoes.forEach(d=>prios.push({c:'r',tag:'🔴 Pagar primeiro',nome:d.credor+' (cartão)',det:`${d.juros}%/mês = ${fmt(d.saldo*(d.juros/100))} em juros/mês. Use todo saldo livre.`}));
  emps.forEach((d,i)=>prios.push({c:i===0?'y':'g',tag:i===0?'🟡 Em seguida':'🟢 Manter parcela',nome:d.credor+' (empréstimo)',det:`${d.juros}%/mês${d.parcela?' — parcela '+fmt(d.parcela):''}. Mantenha em dia.`}));
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
  const el=document.getElementById('lista-receitas');
  const lista=receitasDoMes();
  if(!lista.length){el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhuma receita neste mês.</p>';return;}
  const total=lista.reduce((s,r)=>s+r.val,0);
  el.innerHTML=lista.map(r=>`<div class="item-row"><span class="item-name">${r.desc}</span><span class="item-val c-green">${fmt(r.val)}</span><span class="item-del" onclick="S.receitas=del(S.receitas,${r.id});save();render()">×</span></div>`).join('')
    +`<div class="total-row"><span>Total</span><span class="c-green">${fmt(total)}</span></div>`;
}

function renderGastos(){
  const t=calcTotais();
  const bd=document.getElementById('breakdown-gastos');
  const lista=gastosDoMes();
  if(lista.length){
    const cats=[{l:'Fixos',v:t.gasRec,c:'c-yellow'},{l:'Lazer',v:t.gasLaz,c:'c-red'},{l:'Imprevistos',v:t.gasNP,c:'c-red'},{l:'Viagem',v:t.gasVg,c:'c-muted'}];
    bd.innerHTML=`<div class="grid2">${cats.filter(c=>c.v>0).slice(0,4).map(c=>`<div class="mc"><p class="mc-label">${c.l}</p><p class="mc-val ${c.c}">${fmt(c.v)}</p></div>`).join('')}</div>`;
  } else bd.innerHTML='';

  const el=document.getElementById('lista-gastos');
  const badges={recorrente:'b-rec',nao_planejado:'b-unp',lazer:'b-laz',viagem:'b-vg'};
  const labels={recorrente:'Fixo',nao_planejado:'Imprevisto',lazer:'Lazer',viagem:'Viagem'};
  if(!lista.length){el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhum gasto neste mês.</p>';return;}
  el.innerHTML=lista.map(g=>`<div class="item-row"><span class="item-name">${g.desc}<span class="badge ${badges[g.cat]}">${labels[g.cat]}</span></span><span class="item-val c-red">${fmt(g.val)}</span><span class="item-del" onclick="S.gastos=del(S.gastos,${g.id});save();render()">×</span></div>`).join('');
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
        <span class="div-name">${d.credor}${d.acordo?' <span class="badge b-rec">Acordo</span>':''}</span>
        <span class="item-del" onclick="if(confirm('Excluir esta dívida?')){S.dividas=del(S.dividas,${d.id});save();render();}">×</span>
      </div>
      <div class="div-line"><span style="color:var(--muted);">Saldo restante</span><span class="c-red" style="font-weight:600;">${fmt(restante)}</span></div>
      ${!d.acordo && d.juros?`<div class="div-line"><span style="color:var(--muted);">Juros/mês</span><span class="c-yellow">${d.juros}% → ${fmt(custo)}/mês</span></div>`:''}
      ${!d.acordo && d.parcela?`<div class="div-line"><span style="color:var(--muted);">Parcela</span><span>${fmt(d.parcela)}</span></div>`:''}
      <div class="div-line"><span style="color:var(--muted);">Tipo</span><span>${d.tipo==='cartao'?'Cartão de crédito':'Empréstimo'}</span></div>
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
        <span class="div-name">${d.credor}</span>
        <span class="item-del" onclick="if(confirm('Excluir este registro?')){S.dividas=del(S.dividas,${d.id});save();render();}">×</span>
      </div>
      <div class="div-line"><span style="color:var(--muted);">Valor quitado</span><span class="c-green" style="font-weight:600;">${fmt(d.valorQuitado||0)}</span></div>
      <div class="div-line"><span style="color:var(--muted);">Data</span><span>${d.dataQuitacao||'-'}</span></div>
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
        <span style="font-weight:600;font-size:14px;">${m.nome}</span>
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
  return `Você é um agente financeiro pessoal especialista em finanças brasileiras e recuperação de dívidas. Seja direto, prático e honesto. Use R$ em todos os valores. Evite rodeios.

SITUAÇÃO FINANCEIRA ATUAL:
- Receita mensal: ${fmt(t.totalRec)}${S.receitas.length?' ('+S.receitas.map(r=>r.desc+': '+fmt(r.val)).join(', ')+')':''}
- Gastos totais: ${fmt(t.totalGas)} | Fixos: ${fmt(t.gasRec)} | Lazer: ${fmt(t.gasLaz)} | Imprevistos: ${fmt(t.gasNP)} | Viagem: ${fmt(t.gasVg)}
- Saldo disponível: ${fmt(t.saldoDisp)}
- Total em dívidas: ${fmt(t.totalDiv)} | Custo juros: ${fmt(t.custoJuros)}/mês = ${fmt(t.custoJuros*12)}/ano
${sorted.length?'- Dívidas (maior juro primeiro):\n'+sorted.map((d,i)=>`  ${i+1}. ${d.credor}: ${fmt(d.saldo)} — ${d.juros}%/mês — ${d.tipo}${d.parcela?' — parcela '+fmt(d.parcela):''}`).join('\n'):''}
${S.metas.length?'- Metas: '+S.metas.map(m=>`${m.nome}: ${fmt(m.atual)} de ${fmt(m.total)}`).join(', '):''}

CONTEXTO: Família de 2 pessoas. Renda extra anual: 13° salário (dez), PLR (set e fev), possível bônus semestral. Objetivo: sair do vermelho, chegar a R$100k e depois R$1 milhão.

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
