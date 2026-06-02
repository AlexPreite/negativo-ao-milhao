// STATE
let S = { receitas:[], gastos:[], dividas:[], metas:[], chat:[] };
let apiKey = '';
let gdriveToken = '';
let gdriveFolderId = '';

function loadState(){
  try { const d=localStorage.getItem('dnm_data'); if(d) S={...S,...JSON.parse(d)}; } catch(e){}
  try { apiKey=localStorage.getItem('dnm_key')||''; } catch(e){}
  try { gdriveToken=localStorage.getItem('dnm_gdrive_token')||''; } catch(e){}
  try { gdriveFolderId=localStorage.getItem('dnm_gdrive_folder')||''; } catch(e){}
}

function save(){ try{localStorage.setItem('dnm_data',JSON.stringify(S));}catch(e){} }
const fmt = v => 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

// GOOGLE DRIVE INTEGRATION
const GOOGLE_CLIENT_ID = '1071645887652-c55v01e2qidqs1nnsa5rfc629ck3bern.apps.googleusercontent.com'; // Replace with your OAuth 2.0 Client ID
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

function initGoogleAPI(){
  gapi.load('client:auth2', () => {
    gapi.client.init({
      clientId: GOOGLE_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => { updateDriveStatus(); });
  });
}

function loginDrive(){
  gapi.auth2.getAuthInstance().signIn().then(() => {
    const user = gapi.auth2.getAuthInstance().currentUser.get();
    gdriveToken = user.getAuthResponse().id_token;
    localStorage.setItem('dnm_gdrive_token', gdriveToken);
    ensureFolder().then(() => { syncDrive(); updateDriveStatus(); });
  }).catch(e => alert('Erro ao conectar com Google Drive: '+e.error_description));
}

function updateDriveStatus(){
  const el = document.getElementById('drive-status');
  if(!el) return;
  const auth = gapi.auth2?.getAuthInstance();
  if(auth?.isSignedIn?.get?.()) {
    el.textContent = '✅ Conectado';
  } else {
    el.textContent = '❌ Desconectado';
  }
}

async function ensureFolder(){
  if(gdriveFolderId) return;
  try {
    const res = await gapi.client.drive.files.list({
      q: "name='Negativo ao Milhão' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      spaces: 'drive',
      pageSize: 1,
      fields: 'files(id)'
    });
    if(res.result.files.length) {
      gdriveFolderId = res.result.files[0].id;
    } else {
      const folderRes = await gapi.client.drive.files.create({
        resource: { name: 'Negativo ao Milhão', mimeType: 'application/vnd.google-apps.folder' },
        fields: 'id'
      });
      gdriveFolderId = folderRes.result.id;
    }
    localStorage.setItem('dnm_gdrive_folder', gdriveFolderId);
  } catch(e) { console.error('Erro ao criar/encontrar pasta:', e); }
}

async function syncDrive(){
  if(!gapi.auth2?.getAuthInstance()?.isSignedIn?.get?.()) { alert('Conecte ao Google Drive primeiro'); return; }
  await ensureFolder();
  try {
    const fileData = JSON.stringify(S, null, 2);
    const blob = new Blob([fileData], {type: 'application/json'});
    const res = await gapi.client.drive.files.list({
      q: `name='dnm-backup.json' and '${gdriveFolderId}' in parents and trashed=false`,
      spaces: 'drive',
      fields: 'files(id)',
      pageSize: 1
    });
    const existingFileId = res.result.files?.[0]?.id;
    if(existingFileId) {
      await gapi.client.drive.files.update({
        fileId: existingFileId,
        resource: { modifiedTime: new Date() },
        media: { mimeType: 'application/json', body: fileData }
      });
    } else {
      await gapi.client.drive.files.create({
        resource: { name: 'dnm-backup.json', parents: [gdriveFolderId] },
        media: { mimeType: 'application/json', body: fileData },
        fields: 'id'
      });
    }
    alert('✅ Dados sincronizados com Google Drive!');
  } catch(e) { alert('Erro ao sincronizar: '+e.message); }
}

// ONBOARDING
loadState();
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init(){
  initGoogleAPI();
  if(apiKey || localStorage.getItem('dnm_skip')){
    document.getElementById('onboarding').style.display='none';
    document.getElementById('app').style.display='flex';
    updateKeyStatus();
    render();
  }
}

function salvarKey(){
  const k=document.getElementById('key-input').value.trim();
  if(!k){alert('Cole a API Key para continuar.');return;}
  apiKey=k; localStorage.setItem('dnm_key',k);
  document.getElementById('onboarding').style.display='none';
  document.getElementById('app').style.display='flex';
  updateKeyStatus(); render();
}
function pularKey(){
  localStorage.setItem('dnm_skip','1');
  document.getElementById('onboarding').style.display='none';
  document.getElementById('app').style.display='flex';
  render();
}
function atualizarKey(){
  const k=document.getElementById('new-key').value.trim();
  if(!k) return;
  apiKey=k; localStorage.setItem('dnm_key',k);
  closeM('m-key'); updateKeyStatus();
  alert('Chave atualizada com sucesso!');
}
function updateKeyStatus(){
  const el=document.getElementById('key-status');
  if(el) el.textContent = apiKey ? '✅ Configurada' : '❌ Não configurada';
}

// NAV
const TITLES={resumo:'Resumo do mês',receitas:'Receitas',gastos:'Gastos',dividas:'Dívidas',metas:'Metas & Economias',agente:'Agente Financeiro',config:'Configurações'};
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

// CRUD
function addReceita(){
  const desc=document.getElementById('r-desc').value.trim(), val=parseFloat(document.getElementById('r-val').value), tipo=document.getElementById('r-tipo').value;
  if(!desc||!val||val<=0) return;
  S.receitas.push({id:Date.now(),desc,val,tipo}); save(); closeM('m-receita'); render();
  document.getElementById('r-desc').value=''; document.getElementById('r-val').value='';
}
function addGasto(){
  const desc=document.getElementById('g-desc').value.trim(), val=parseFloat(document.getElementById('g-val').value);
  const cat=document.querySelector('#cat-tags .tag.sel')?.dataset.cat||'recorrente';
  if(!desc||!val||val<=0) return;
  S.gastos.push({id:Date.now(),desc,val,cat}); save(); closeM('m-gasto'); render();
  document.getElementById('g-desc').value=''; document.getElementById('g-val').value='';
}
function addDivida(){
  const credor=document.getElementById('d-credor').value.trim(), saldo=parseFloat(document.getElementById('d-saldo').value);
  const juros=parseFloat(document.getElementById('d-juros').value)||0;
  const parcela=parseFloat(document.getElementById('d-parcela').value)||0;
  const tipo=document.getElementById('d-tipo').value;
  if(!credor||!saldo||saldo<=0) return;
  S.dividas.push({id:Date.now(),credor,saldo,juros,parcela,tipo}); save(); closeM('m-divida'); render();
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

// CALC
function calcTotais(){
  const totalRec=S.receitas.reduce((s,r)=>s+r.val,0);
  const totalGas=S.gastos.reduce((s,g)=>s+g.val,0);
  const gasRec=S.gastos.filter(g=>g.cat==='recorrente').reduce((s,g)=>s+g.val,0);
  const gasLaz=S.gastos.filter(g=>g.cat==='lazer').reduce((s,g)=>s+g.val,0);
  const gasNP=S.gastos.filter(g=>g.cat==='nao_planejado').reduce((s,g)=>s+g.val,0);
  const gasVg=S.gastos.filter(g=>g.cat==='viagem').reduce((s,g)=>s+g.val,0);
  const totalDiv=S.dividas.reduce((s,d)=>s+d.saldo,0);
  const custoJuros=S.dividas.reduce((s,d)=>s+(d.saldo*(d.juros/100)),0);
  const saldoDisp=totalRec-totalGas;
  return{totalRec,totalGas,gasRec,gasLaz,gasNP,gasVg,totalDiv,custoJuros,saldoDisp};
}

// RENDER
function render(){ renderResumo(); renderReceitas(); renderGastos(); renderDividas(); renderMetas(); }

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
  const cartoes=[...S.dividas].filter(d=>d.tipo==='cartao').sort((a,b)=>b.juros-a.juros);
  const emps=[...S.dividas].filter(d=>d.tipo==='emprestimo').sort((a,b)=>b.juros-a.juros);
  if(t.saldoDisp<0) prios.push({c:'r',tag:'🔴 Urgente',nome:'Receita insuficiente',det:`Corte ${fmt(Math.abs(t.saldoDisp))} em gastos para equilibrar o mês.`});
  cartoes.forEach(d=>prios.push({c:'r',tag:'🔴 Pagar primeiro',nome:d.credor+' (cartão)',det:`${d.juros}%/mês = ${fmt(d.saldo*(d.juros/100))} em juros/mês. Use todo saldo livre.`}));
  emps.forEach((d,i)=>prios.push({c:i===0?'y':'g',tag:i===0?'🟡 Em seguida':'🟢 Manter parcela',nome:d.credor+' (empréstimo)',det:`${d.juros}%/mês${d.parcela?' — parcela '+fmt(d.parcela):''}. Mantenha em dia.`}));
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
  if(!S.receitas.length){el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhuma receita cadastrada.</p>';return;}
  const total=S.receitas.reduce((s,r)=>s+r.val,0);
  el.innerHTML=S.receitas.map(r=>`<div class="item-row"><span class="item-name">${r.desc}</span><span class="item-val c-green">${fmt(r.val)}</span><span class="item-del" onclick="S.receitas=del(S.receitas,${r.id});save();render()">×</span></div>`).join('')
    +`<div class="total-row"><span>Total</span><span class="c-green">${fmt(total)}</span></div>`;
}

function renderGastos(){
  const t=calcTotais();
  const bd=document.getElementById('breakdown-gastos');
  if(S.gastos.length){
    const cats=[{l:'Fixos',v:t.gasRec,c:'c-yellow'},{l:'Lazer',v:t.gasLaz,c:'c-red'},{l:'Imprevistos',v:t.gasNP,c:'c-red'},{l:'Viagem',v:t.gasVg,c:'c-muted'}];
    bd.innerHTML=`<div class="grid2">${cats.filter(c=>c.v>0).slice(0,4).map(c=>`<div class="mc"><p class="mc-label">${c.l}</p><p class="mc-val ${c.c}">${fmt(c.v)}</p></div>`).join('')}</div>`;
  } else bd.innerHTML='';

  const el=document.getElementById('lista-gastos');
  const badges={recorrente:'b-rec',nao_planejado:'b-unp',lazer:'b-laz',viagem:'b-vg'};
  const labels={recorrente:'Fixo',nao_planejado:'Imprevisto',lazer:'Lazer',viagem:'Viagem'};
  if(!S.gastos.length){el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhum gasto registrado.</p>';return;}
  el.innerHTML=S.gastos.map(g=>`<div class="item-row"><span class="item-name">${g.desc}<span class="badge ${badges[g.cat]}">${labels[g.cat]}</span></span><span class="item-val c-red">${fmt(g.val)}</span><span class="item-del" onclick="S.gastos=del(S.gastos,${g.id});save();render()">×</span></div>`).join('');
}

function renderDividas(){
  const t=calcTotais();
  document.getElementById('total-div-big').textContent=fmt(t.totalDiv);
  document.getElementById('custo-juros-txt').textContent=t.custoJuros>0?`Você perde ${fmt(t.custoJuros)} em juros por mês (${fmt(t.custoJuros*12)}/ano)`:
'';
  const el=document.getElementById('lista-dividas');
  if(!S.dividas.length){el.innerHTML='<p style="color:var(--muted);font-size:14px;padding:8px 0;">Nenhuma dívida cadastrada. Adicione para ver o plano de ataque.</p>';return;}
  const sorted=[...S.dividas].sort((a,b)=>b.juros-a.juros);
  const atLabels=['Atacar primeiro','Em seguida','Manter parcela'];
  const atClass=['at-1','at-2','at-3'];
  el.innerHTML=sorted.map((d,i)=>{
    const custo=d.saldo*(d.juros/100);
    const idx=Math.min(i,2);
    return `<div class="div-row">
      <div class="div-header">
        <span class="div-name">${d.credor}</span>
        <div style="display:flex;gap:6px;align-items:center;">
          <span class="ataque-badge ${atClass[idx]}">${atLabels[idx]}</span>
          <span class="item-del" onclick="S.dividas=del(S.dividas,${d.id});save();render()">×</span>
        </div>
      </div>
      <div class="div-line"><span style="color:var(--muted);">Saldo devedor</span><span class="c-red" style="font-weight:600;">${fmt(d.saldo)}</span></div>
      ${d.juros?`<div class="div-line"><span style="color:var(--muted);">Juros/mês</span><span class="c-yellow">${d.juros}% → ${fmt(custo)}/mês</span></div>`:
''}
      ${d.parcela?`<div class="div-line"><span style="color:var(--muted);">Parcela</span><span>${fmt(d.parcela)}</span></div>`:
''}
      <div class="div-line"><span style="color:var(--muted);">Tipo</span><span>${d.tipo==='cartao'?'Cartão de crédito':'Empréstimo'}</span></div>
    </div>`;
  }).join('');
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
    const resp=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,{
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
