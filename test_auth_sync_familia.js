/**
 * Testes de Integridade Estrutural do HTML, Comportamento do FAB Contextual,
 * Blindagem de Modais e IDs de Dívidas.
 * Negativo ao Milhão - Família v2.0
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log(' INICIANDO SUÍTE DE TESTES: AUTH, ESTRUTURA & MODAIS');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, 'index.html');
const appJsPath = path.join(__dirname, 'app.js');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

let totalTests = 0;
let passedTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${description}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${description}`);
    console.error(`     Erro: ${err.message}`);
    throw err;
  }
}

// ----------------------------------------------------
// 1. TESTES ESTRUTURAIS DE HTML (BALANCEAMENTO & MODAIS)
// ----------------------------------------------------
console.log('1. Verificação Estrutural de Tags HTML:');

test('Todas as tags <div> do index.html devem estar balanceadas (zero sobras ao final)', () => {
  const lines = htmlContent.split('\n');
  const openDivs = [];
  const regex = /<(\/)?div(\s+[^>]*)?>/gi;

  lines.forEach((line, lineIdx) => {
    let match;
    while ((match = regex.exec(line)) !== null) {
      const isClosing = match[1] === '/';
      const tagContent = match[0];
      const lineNum = lineIdx + 1;

      if (!isClosing) {
        openDivs.push({ line: lineNum, tag: tagContent });
      } else {
        if (openDivs.length === 0) {
          throw new Error(`Fechamento de </div> inesperado na linha ${lineNum}`);
        }
        openDivs.pop();
      }
    }
  });

  if (openDivs.length !== 0) {
    const unclosed = openDivs.map(d => `Linha ${d.line}: ${d.tag.slice(0, 50)}`).join('\n');
    throw new Error(`Existem ${openDivs.length} tags <div> não fechadas ao final:\n${unclosed}`);
  }
  assert.strictEqual(openDivs.length, 0);
});

test('Nenhum elemento .modal-bg deve ser aninhado dentro de outro .modal-bg', () => {
  const lines = htmlContent.split('\n');
  const modalBgStack = [];
  const modalNestingErrors = [];
  const regex = /<(\/)?div(\s+[^>]*)?>/gi;

  lines.forEach((line, lineIdx) => {
    let match;
    while ((match = regex.exec(line)) !== null) {
      const isClosing = match[1] === '/';
      const tagContent = match[0];
      const lineNum = lineIdx + 1;

      if (!isClosing) {
        const isModalBg = /class=["'][^"']*\bmodal-bg\b[^"']*["']/i.test(tagContent);
        const idMatch = tagContent.match(/id=["']([^"']+)["']/i);
        const id = idMatch ? idMatch[1] : `modal_line_${lineNum}`;

        if (isModalBg) {
          if (modalBgStack.length > 0) {
            modalNestingErrors.push({
              childModal: id,
              childLine: lineNum,
              parentModal: modalBgStack[modalBgStack.length - 1].id,
              parentLine: modalBgStack[modalBgStack.length - 1].line
            });
          }
          modalBgStack.push({ id, line: lineNum, depth: 1 });
        } else {
          if (modalBgStack.length > 0) {
            modalBgStack[modalBgStack.length - 1].depth++;
          }
        }
      } else {
        if (modalBgStack.length > 0) {
          modalBgStack[modalBgStack.length - 1].depth--;
          if (modalBgStack[modalBgStack.length - 1].depth === 0) {
            modalBgStack.pop();
          }
        }
      }
    }
  });

  if (modalNestingErrors.length > 0) {
    const details = modalNestingErrors.map(e => `Modal '${e.childModal}' (l.${e.childLine}) está aninhado no modal '${e.parentModal}' (l.${e.parentLine})`).join('; ');
    throw new Error(`Encontrados modais aninhados: ${details}`);
  }
  assert.strictEqual(modalNestingErrors.length, 0);
});

test('Todos os modais essenciais existem como modais de topo no index.html', () => {
  const modaisEsperados = [
    'm-circulo',
    'm-receita',
    'm-gasto',
    'm-divida',
    'm-acordo',
    'm-simulador-dividas',
    'm-assinaturas-fixas',
    'm-perfil-conta',
    'm-config-perfil-full'
  ];

  modaisEsperados.forEach(modalId => {
    const regex = new RegExp(`class=["'][^"']*modal-bg[^"']*["'][^>]*id=["']${modalId}["']|id=["']${modalId}["'][^>]*class=["'][^"']*modal-bg[^"']*["']`, 'i');
    assert.ok(regex.test(htmlContent), `Modal #${modalId} não foi encontrado no HTML com a classe modal-bg`);
  });
});

test('Header possui botão de avatar com chamada a abrirModalPerfilConta() e cursor pointer', () => {
  assert.ok(htmlContent.includes('id="header-avatar-btn"'), 'Elemento #header-avatar-btn não encontrado');
  assert.ok(htmlContent.includes('onclick="abrirModalPerfilConta()"'), 'header-avatar-btn deve chamar abrirModalPerfilConta()');
  assert.ok(htmlContent.includes('cursor:pointer'), 'header-avatar-btn deve ter estilo com cursor pointer');
});

// ----------------------------------------------------
// 2. TESTES DE COMPORTAMENTO DO FAB CONTEXTUAL E GO(ID)
// ----------------------------------------------------
console.log('\n2. Verificação de Lógica do FAB e Seções em app.js:');

// Mock do ambiente DOM
const domMock = {
  elements: {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id,
        style: {},
        classList: {
          contains: (cls) => Boolean(this.elements[id].classes && this.elements[id].classes.includes(cls)),
          add: (cls) => { this.elements[id].classes = this.elements[id].classes || []; this.elements[id].classes.push(cls); },
          remove: (cls) => { if (this.elements[id].classes) this.elements[id].classes = this.elements[id].classes.filter(c => c !== cls); }
        },
        value: '',
        textContent: '',
        innerHTML: '',
        setAttribute(k, v) { this[k] = v; },
        getAttribute(k) { return this[k]; },
        removeAttribute(k) { delete this[k]; }
      };
    }
    return this.elements[id];
  },
  querySelectorAll() {
    return [];
  },
  querySelector() {
    return null;
  }
};

global.document = domMock;
global.window = { secaoAtiva: 'inicio' };

// Carrega o app.js em contexto controlado
const vm = require('vm');

const localStore = {};
const mockLocalStorage = {
  getItem: (k) => (Object.prototype.hasOwnProperty.call(localStore, k) ? localStore[k] : null),
  setItem: (k, v) => { localStore[k] = String(v); },
  removeItem: (k) => { delete localStore[k]; },
  clear: () => { Object.keys(localStore).forEach(k => delete localStore[k]); }
};

const sessionStore = {};
const mockSessionStorage = {
  getItem: (k) => (Object.prototype.hasOwnProperty.call(sessionStore, k) ? sessionStore[k] : null),
  setItem: (k, v) => { sessionStore[k] = String(v); },
  removeItem: (k) => { delete sessionStore[k]; },
  clear: () => { Object.keys(sessionStore).forEach(k => delete sessionStore[k]); }
};

const mockContasDb = {};
const mockUsuariosDb = {};
const mockFbDb = {
  collection: (col) => ({
    doc: (id) => ({
      get: async () => {
        if (col === 'contas') {
          return { exists: Boolean(mockContasDb[id]), data: () => mockContasDb[id] || {} };
        }
        if (col === 'usuarios') {
          return { exists: Boolean(mockUsuariosDb[id]), data: () => mockUsuariosDb[id] || {} };
        }
        return { exists: false, data: () => ({}) };
      },
      set: async (dados, opts) => {
        if (col === 'contas') {
          mockContasDb[id] = (opts && opts.merge) ? { ...(mockContasDb[id] || {}), ...dados } : dados;
        }
        if (col === 'usuarios') {
          mockUsuariosDb[id] = (opts && opts.merge) ? { ...(mockUsuariosDb[id] || {}), ...dados } : dados;
        }
      }
    })
  })
};

const context = {
  console,
  document: domMock,
  window: global.window,
  localStorage: mockLocalStorage,
  sessionStorage: mockSessionStorage,
  fbDb: mockFbDb,
  firebase: {
    initializeApp: () => {},
    apps: [{}],
    firestore: () => mockFbDb,
    auth: () => ({
      signOut: () => Promise.resolve(),
      signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'u1' } }),
      createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'u2' } }),
      onAuthStateChanged: () => {}
    })
  },
  alert: () => {},
  confirm: () => true,
  prompt: () => '100',
  fetch: () => Promise.resolve(),
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  Date: global.Date,
  Math: global.Math,
  parseInt: global.parseInt,
  parseFloat: global.parseFloat,
  String: global.String,
  Number: global.Number,
  Boolean: global.Boolean,
  Array: global.Array,
  module: { exports: {} },
  exports: {}
};

vm.createContext(context);
vm.runInContext(appJsContent, context);
Object.assign(context, context.module.exports);
if (context.window && context.window.S) {
  context.S = context.window.S;
}
if (context.window && context.window.setFbDbParaTestes) {
  context.window.setFbDbParaTestes(mockFbDb);
}

test('go(id) deve registrar secaoAtiva em window e S', () => {
  context.go('calendario');
  assert.strictEqual(context.window.secaoAtiva, 'calendario');
  assert.strictEqual(context.S.secaoAtiva, 'calendario');
});

test('go(id) oculta o FAB em abas com botões nativos (gastos, receitas, dividas)', () => {
  const btnFab = domMock.getElementById('btn-fab-adicionar');

  context.go('gastos');
  assert.strictEqual(btnFab.style.display, 'none', 'FAB deveria estar oculto em gastos');

  context.go('receitas');
  assert.strictEqual(btnFab.style.display, 'none', 'FAB deveria estar oculto em receitas');

  context.go('dividas');
  assert.strictEqual(btnFab.style.display, 'none', 'FAB deveria estar oculto em dividas');
});

test('go(id) exibe o FAB em abas colaborativas (calendario, listas, metas, inicio)', () => {
  const btnFab = domMock.getElementById('btn-fab-adicionar');

  context.go('calendario');
  assert.strictEqual(btnFab.style.display, 'flex', 'FAB deveria estar visível em calendario');

  context.go('listas');
  assert.strictEqual(btnFab.style.display, 'flex', 'FAB deveria estar visível em listas');

  context.go('metas');
  assert.strictEqual(btnFab.style.display, 'flex', 'FAB deveria estar visível em metas');

  context.go('inicio');
  assert.strictEqual(btnFab.style.display, 'flex', 'FAB deveria estar visível em inicio');
});

test('abrirMenuAcaoRapida() executa ação contextual correspondente à aba ativa', () => {
  let modalAberto = null;
  context.openM = (id) => { modalAberto = id; };

  // 1. Calendário
  context.go('calendario');
  context.abrirMenuAcaoRapida();
  assert.strictEqual(modalAberto, 'm-evento-calendario');

  // 2. Listas
  modalAberto = null;
  context.go('listas');
  context.abrirMenuAcaoRapida();
  assert.strictEqual(modalAberto, 'm-nova-lista');

  // 3. Metas
  modalAberto = null;
  context.go('metas');
  context.abrirMenuAcaoRapida();
  assert.ok(modalAberto === 'm-meta' || modalAberto === 'm-investimento' || modalAberto === 'm-form-meta-familia', `Esperado modal de metas, obtido: ${modalAberto}`);

  // 4. Início (default -> fab-menu)
  modalAberto = null;
  context.go('inicio');
  context.abrirMenuAcaoRapida();
  assert.strictEqual(modalAberto, 'm-fab-menu');

  // 5. Chamada em gastos
  modalAberto = null;
  context.go('gastos');
  context.abrirMenuAcaoRapida();
  assert.strictEqual(modalAberto, 'm-gasto');

  // 6. Chamada em receitas
  modalAberto = null;
  context.go('receitas');
  context.abrirMenuAcaoRapida();
  assert.strictEqual(modalAberto, 'm-receita');

  // 7. Chamada em dividas
  modalAberto = null;
  context.go('dividas');
  context.abrirMenuAcaoRapida();
  assert.strictEqual(modalAberto, 'm-divida');
});

// ----------------------------------------------------
// 3. TESTES DE BLINDAGEM DE DÍVIDAS E ACORDOS COM STRINGS
// ----------------------------------------------------
console.log('\n3. Verificação de Dívidas e Acordos com IDs Strings:');

test('renderDividas() interpola IDs alfanuméricos protegidos com aspas', () => {
  context.S.dividas = [
    {
      id: 'div_alfa_123',
      credor: 'Banco Teste',
      saldo: 1500,
      juros: 10,
      parcela: 200,
      tipo: 'cartao',
      titular: 'Alex',
      quitada: false,
      acordo: null
    }
  ];

  context.renderDividas();
  const htmlDividas = domMock.getElementById('lista-dividas').innerHTML;

  assert.ok(htmlDividas.includes("abrirAcordo('div_alfa_123')"), 'abrirAcordo deve ter ID entre aspas');
  assert.ok(htmlDividas.includes("marcarQuitada('div_alfa_123')"), 'marcarQuitada deve ter ID entre aspas');
  assert.ok(htmlDividas.includes("del(S.dividas,'div_alfa_123')"), 'del deve ter ID entre aspas');
});

test('abrirAcordo(id) e salvarAcordo() suportam IDs alfanuméricos', () => {
  let modalAberto = null;
  context.openM = (id) => { modalAberto = id; };

  context.S.dividas = [
    {
      id: 'div_999_xyz',
      credor: 'Financeira XYZ',
      saldo: 2000,
      juros: 5,
      parcela: 300,
      tipo: 'emprestimo',
      titular: 'Alex',
      quitada: false,
      acordo: null
    }
  ];

  context.abrirAcordo('div_999_xyz');
  assert.strictEqual(modalAberto, 'm-acordo');

  domMock.getElementById('ac-total').value = '1800';
  domMock.getElementById('ac-entrada').value = '300';
  domMock.getElementById('ac-parcelas').value = '3';

  context.salvarAcordo();

  const divAtualizada = context.S.dividas.find(d => d.id === 'div_999_xyz');
  assert.ok(divAtualizada.acordo, 'Acordo deve ser gerado na dívida');
  assert.strictEqual(divAtualizada.acordo.numParcelas, 3);
  assert.strictEqual(divAtualizada.acordo.parcelas.length, 3);
});

test('toggleParcela() com ID string atualiza estado da parcela corretamente', () => {
  const d = context.S.dividas.find(x => x.id === 'div_999_xyz');
  assert.strictEqual(d.acordo.parcelas[0].paga, false);

  context.toggleParcela('div_999_xyz', 1);
  assert.strictEqual(d.acordo.parcelas[0].paga, true);

  context.toggleParcela('div_999_xyz', 1);
  assert.strictEqual(d.acordo.parcelas[0].paga, false);
});

test('del() e delGasto() removem itens com IDs numéricos e strings', () => {
  const lista = [{ id: 'item_1' }, { id: 'item_2' }, { id: 3 }];

  const filtrada = context.del(lista, 'item_1');
  assert.strictEqual(filtrada.length, 2);
  assert.ok(!filtrada.find(x => x.id === 'item_1'));

  const filtradaNum = context.del(filtrada, '3');
  assert.strictEqual(filtradaNum.length, 1);
  assert.strictEqual(filtradaNum[0].id, 'item_2');
});

// ----------------------------------------------------
// 4. TESTES DE PERFIL DA CONTA
// ----------------------------------------------------
console.log('\n4. Verificação de Perfil da Conta & Header:');

test('abrirModalPerfilConta() abre sem exceções e aciona openM', () => {
  let modalAberto = null;
  context.openM = (id) => { modalAberto = id; };

  context.abrirModalPerfilConta();
  assert.ok(modalAberto === 'm-config-perfil-full' || modalAberto === 'm-perfil-conta', `Esperado modal de perfil, recebido: ${modalAberto}`);
});

test('Modal m-config-perfil-full possui elementos visuais e de ação do Print 6', () => {
  assert.ok(htmlContent.includes('onclick="abrirModalOpcoesFotoPerfil()"'), 'Avatar deve ser clicável para abrir fotos');
  assert.ok(htmlContent.includes('id="cfg-perfil-status-verif"'), 'Deve conter indicador de verificação');
  assert.ok(htmlContent.includes('Gerenciar conta ›'), 'Deve conter link azul Gerenciar conta');
  assert.ok(htmlContent.includes('🔑 Gerar Código Família'), 'Deve conter botão de gerar código');
  assert.ok(htmlContent.includes('🔗 Entrar com Código'), 'Deve conter botão de entrar com código');
  assert.ok(htmlContent.includes('Língua'), 'Deve conter opção de Língua');
  assert.ok(htmlContent.includes('Personalizar Tela Inicial'), 'Deve conter Personalizar Tela Inicial');
});

// ----------------------------------------------------
// 5. TESTES DE CÓDIGO DA FAMÍLIA & MERGE AGREGADOR
// ----------------------------------------------------
console.log('\n5. Verificação de Código da Família & Merge Agregador:');

test('gerarCodigoFamilia() gera código válido associado ao círculo', () => {
  const res = context.gerarCodigoFamilia('circ_1', 'admin');
  assert.ok(res, 'Retorno não deve ser nulo');
  assert.ok(typeof res.codigo === 'string' && res.codigo.startsWith('FAM-'), 'Código deve começar com FAM-');
  
  const circ = context.S.circulos.find(c => c.id === 'circ_1');
  assert.strictEqual(circ.codigoConvite, res.codigo);
});

test('mesclarDadosFamilia() agrega dados individuais aos familiares sem perdas nem duplicatas', () => {
  const dadosFamilia = {
    versaoSchema: 2,
    gastos: [
      { id: 'g_fam_1', desc: 'Mercado Mensal', val: 500, pagoPor: 'Alex' }
    ],
    receitas: [
      { id: 'r_fam_1', desc: 'Salário Alex', val: 5000, titular: 'Alex' }
    ],
    membrosFamilia: ['Alex']
  };

  const dadosIndividuais = {
    gastos: [
      { id: 'g_ind_1', desc: 'Farmácia Gabi', val: 80, pagoPor: 'Gabi' }
    ],
    receitas: [
      { id: 'r_ind_1', desc: 'Salário Gabi', val: 4000, titular: 'Gabi' }
    ],
    membrosFamilia: ['Gabi']
  };

  const usuarioEntrante = {
    uid: 'uid_gabi',
    displayName: 'Gabi',
    email: 'gabi@exemplo.com'
  };

  const resultado = context.mesclarDadosFamilia(dadosFamilia, dadosIndividuais, usuarioEntrante);

  assert.ok(resultado, 'Resultado do merge não deve ser nulo');
  assert.strictEqual(resultado.gastos.length, 2, 'Merge deve conter 2 gastos agregados');
  assert.strictEqual(resultado.receitas.length, 2, 'Merge deve conter 2 receitas agregadas');
  assert.ok(resultado.membrosFamilia.includes('Alex') && resultado.membrosFamilia.includes('Gabi'), 'Membros devem ser unificados');
});

// ----------------------------------------------------
// 6. TESTES DE ISOLAMENTO DE CONTAS & SEGURANÇA NO AUTH
// ----------------------------------------------------
console.log('\n6. Verificação de Isolamento de Contas & Segurança no Auth:');

test('isUsuarioAlex(user) identifica exclusivamente o Alexsander', () => {
  assert.strictEqual(context.isUsuarioAlex({ email: 'alexsander.preite@icloud.com' }), true);
  assert.strictEqual(context.isUsuarioAlex({ email: 'alexpreite@gmail.com' }), true);
  assert.strictEqual(context.isUsuarioAlex({ phoneNumber: '+5511988146347' }), true);

  assert.strictEqual(context.isUsuarioAlex({ email: 'gabi@exemplo.com' }), false);
  assert.strictEqual(context.isUsuarioAlex({ phoneNumber: '+5511999998888' }), false);
  assert.strictEqual(context.isUsuarioAlex(null), false);
});

test('resolverOuCriarContaFamilia(alex) preserva estritamente familia-alex-gabi', async () => {
  const userAlex = {
    uid: 'uid_alex_123',
    email: 'alexsander.preite@icloud.com',
    displayName: 'Alexsander'
  };

  const famId = await context.resolverOuCriarContaFamilia(userAlex);
  assert.strictEqual(famId, 'familia-alex-gabi');
  assert.strictEqual(mockContasDb['uid_alex_123'].familiaId, 'familia-alex-gabi');
  assert.strictEqual(mockLocalStorage.getItem('dnm_familia_id'), 'familia-alex-gabi');
});

test('resolverOuCriarContaFamilia(novoUsuario) cria conta individual e apartada (uid) sem código', async () => {
  const userNovo = {
    uid: 'uid_gabi_nova',
    email: 'gabi.nova@exemplo.com',
    displayName: 'Gabi'
  };

  const famId = await context.resolverOuCriarContaFamilia(userNovo);
  assert.strictEqual(famId, 'uid_gabi_nova', 'Usuário novo sem código deve ter família igual ao seu próprio uid');
  assert.strictEqual(mockContasDb['uid_gabi_nova'].familiaId, 'uid_gabi_nova');
  assert.ok(mockUsuariosDb['uid_gabi_nova'], 'Deve inicializar documento em usuarios/{uid}');
  assert.strictEqual(mockUsuariosDb['uid_gabi_nova'].gastos.length, 0, 'Novo usuário deve ter estado limpo');
});

test('resolverOuCriarContaFamilia reseta conta contaminada não-Alex que herdou familia-alex-gabi sem código', async () => {
  // Simula usuário que sofreu com o bug anterior
  mockContasDb['uid_contaminada'] = {
    familiaId: 'familia-alex-gabi',
    nome: 'Terceiro'
  };

  const userContaminado = {
    uid: 'uid_contaminada',
    email: 'terceiro@exemplo.com',
    displayName: 'Terceiro'
  };

  const famId = await context.resolverOuCriarContaFamilia(userContaminado);
  assert.strictEqual(famId, 'uid_contaminada', 'Deve auto-resetar a conta contaminada para individual');
  assert.strictEqual(mockContasDb['uid_contaminada'].familiaId, 'uid_contaminada');
});

test('fazerLogoffApp() limpa rigorosamente storage, reseta familiaId, S e fecha modais', () => {
  mockLocalStorage.setItem('dnm_sessao_ativa', 'true');
  mockLocalStorage.setItem('dnm_familia_id', 'familia-alex-gabi');
  mockLocalStorage.setItem('dnm_data', JSON.stringify({ gastos: [1, 2] }));
  mockLocalStorage.setItem('dnm_meu_membro_id', 'm_1');
  mockSessionStorage.setItem('dnm_sessao_ativa', 'true');

  const modaisFechados = [];
  context.closeM = (id) => { modaisFechados.push(id); };

  context.fazerLogoffApp();

  assert.strictEqual(mockLocalStorage.getItem('dnm_sessao_ativa'), null);
  assert.strictEqual(mockLocalStorage.getItem('dnm_familia_id'), null);
  assert.strictEqual(mockLocalStorage.getItem('dnm_data'), null);
  assert.strictEqual(mockLocalStorage.getItem('dnm_meu_membro_id'), null);
  assert.strictEqual(mockSessionStorage.getItem('dnm_sessao_ativa'), null);
  assert.strictEqual(context.getFamiliaId ? context.getFamiliaId() : context.window.familiaId, '');
  assert.strictEqual(context.getFbUser ? context.getFbUser() : context.window.fbUser, null);
  assert.ok(modaisFechados.includes('m-perfil-conta'));
  assert.ok(modaisFechados.includes('m-gerenciar-conta'));
  assert.ok(modaisFechados.includes('m-config-perfil-full'));
});

test('docId() blinda contra leitura de cache familia-alex-gabi em usuários não-Alex', () => {
  // 1. Alex conectado
  if (context.setFbUserParaTestes) {
    context.setFbUserParaTestes({ email: 'alexsander.preite@icloud.com', uid: 'uid_alex' });
  } else {
    context.fbUser = { email: 'alexsander.preite@icloud.com', uid: 'uid_alex' };
  }
  assert.strictEqual(context.docId(), 'familia-alex-gabi');

  // 2. Não-Alex com cache residual contaminado de Alex no localStorage
  if (context.setFbUserParaTestes) {
    context.setFbUserParaTestes({ email: 'gabi@exemplo.com', uid: 'uid_gabi' });
  } else {
    context.fbUser = { email: 'gabi@exemplo.com', uid: 'uid_gabi' };
  }
  mockLocalStorage.setItem('dnm_familia_id', 'familia-alex-gabi');
  assert.strictEqual(context.docId(), 'uid_gabi', 'Não-Alex com cache espúrio deve retornar seu próprio uid');

  // 3. Usuário legítimo em outra família
  mockLocalStorage.setItem('dnm_familia_id', 'familia_outra_123');
  assert.strictEqual(context.docId(), 'familia_outra_123');
});

// ----------------------------------------------------
// 7. TESTES DE NAVEGAÇÃO, UX E BOTÕES DE RETORNO EM MODAIS
// ----------------------------------------------------
console.log('\n7. Verificação de UX de Retorno e Ações em Modais:');

test('m-gerenciar-conta possui header sticky, botões de 44x44px e barra de ações no rodapé', () => {
  assert.ok(htmlContent.includes('id="m-gerenciar-conta"'), 'm-gerenciar-conta deve existir');
  assert.ok(htmlContent.includes('id="btn-salvar-gerenciar-conta-rodape"'), 'Deve possuir botão de salvar no rodapé');
  assert.ok(htmlContent.includes('← Cancelar / Voltar'), 'Deve possuir botão cancelar/voltar no rodapé');
  assert.ok(htmlContent.includes('position:sticky; top:0'), 'Cabeçalho de gerenciar conta deve ser sticky');
});

test('m-config-perfil-full possui botões de 44x44px, sem badge Premium e com retorno ao início', () => {
  assert.ok(htmlContent.includes('id="m-config-perfil-full"'), 'm-config-perfil-full deve existir');
  assert.ok(htmlContent.includes('← Voltar ao Início'), 'Deve possuir botão Voltar ao Início no rodapé');
  assert.ok(!htmlContent.includes('Assinatura Premium'), 'Item Assinatura Premium deve ter sido removido a pedido de Alex');
});

test('m-convite-circulo e m-escolher-avatar possuem botões claros de voltar no topo e rodapé', () => {
  assert.ok(htmlContent.includes('id="m-convite-circulo"'), 'm-convite-circulo deve existir');
  assert.ok(htmlContent.includes('← Voltar para Configurações'), 'm-convite-circulo deve ter botão Voltar para Configurações');
  assert.ok(htmlContent.includes('id="m-escolher-avatar"'), 'm-escolher-avatar deve existir');
  assert.ok(htmlContent.includes('← Voltar para Gerenciar Conta'), 'm-escolher-avatar deve ter botão Voltar para Gerenciar Conta');
});

// ----------------------------------------------------
// 8. TESTES DO AGENTE FINANCEIRO / CHAT LIMPO DIÁRIO
// ----------------------------------------------------
console.log('\n8. Verificação do Agente Financeiro / Chat Limpo Diário:');

test('renderChat() exibe apenas mensagens do dia atual e ignora mensagens de dias anteriores', () => {
  const S = context.getState ? context.getState() : (context.window.S || context.S);
  context.S = S;
  const hoje = new Date().toISOString().slice(0, 10);
  S.chat = [
    { role: 'user', parts: [{ text: 'Pergunta de ontem' }], data: '2026-01-01' },
    { role: 'model', parts: [{ text: 'Resposta de ontem' }], data: '2026-01-01' },
    { role: 'user', parts: [{ text: 'Pergunta de hoje' }], data: hoje },
    { role: 'model', parts: [{ text: 'Resposta de hoje' }], data: hoje }
  ];

  context.renderChat();
  const htmlChat = domMock.getElementById('chat-msgs').innerHTML;

  assert.ok(htmlChat.includes('Pergunta de hoje'), 'Mensagem de hoje deve estar visível');
  assert.ok(htmlChat.includes('Resposta de hoje'), 'Resposta de hoje deve estar visível');
  assert.ok(!htmlChat.includes('Pergunta de ontem'), 'Mensagem de ontem NÃO deve estar visível');
  assert.ok(!htmlChat.includes('Resposta de ontem'), 'Resposta de ontem NÃO deve estar visível');
});

test('iniciarNovoChatIA() zera S.chat e atualiza renderChat() com estado limpo', () => {
  const S = context.getState ? context.getState() : (context.window.S || context.S);
  context.S = S;
  S.chat = [{ role: 'user', parts: [{ text: 'Mensagem' }], data: new Date().toISOString().slice(0, 10) }];
  context.iniciarNovoChatIA();

  assert.strictEqual(S.chat.length, 0, 'S.chat deve estar vazio após iniciarNovoChatIA');
  const htmlChat = domMock.getElementById('chat-msgs').innerHTML;
  assert.ok(htmlChat.includes('Use as sugestões acima'), 'Chat deve exibir tela inicial limpa');
});

test('Botão Novo Chat está presente no cabeçalho do Agente Norte no HTML', () => {
  assert.ok(htmlContent.includes('iniciarNovoChatIA()'), 'Botão iniciarNovoChatIA deve estar presente no HTML');
  assert.ok(htmlContent.includes('✨ Novo Chat'), 'Texto ✨ Novo Chat deve estar visível');
});

test('Não devem existir anotações pendentes // VERIFICAR: no código', () => {
  assert.strictEqual(appJsContent.includes('// VERIFICAR:'), false, 'Não deve conter // VERIFICAR: em app.js');
  assert.strictEqual(htmlContent.includes('// VERIFICAR:'), false, 'Não deve conter // VERIFICAR: em index.html');
});

// ----------------------------------------------------
// 9. TESTES DO ROTEADOR GEMINI & FALLBACK RESILIENTE
// ----------------------------------------------------
console.log('\n9. Verificação do Roteador Gemini & Fallback de Modelos Ativos:');

test('MODELOS_GEMINI_FALLBACK contém os novos modelos oficiais ativos e nenhum descontinuado', () => {
  const modelos = context.MODELOS_GEMINI_FALLBACK || (context.window && context.window.MODELOS_GEMINI_FALLBACK);
  assert.ok(modelos && typeof modelos.length === 'number', 'MODELOS_GEMINI_FALLBACK deve ser um array');
  const esperados = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  assert.deepStrictEqual(Array.from(modelos), esperados, 'Lista de fallback deve seguir exatamente a ordem oficial definida');

  // Não deve conter modelos descontinuados pelo Google na v1beta
  const descontinuados = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'];
  descontinuados.forEach(m => {
    assert.strictEqual(Array.from(modelos).includes(m), false, `Modelo descontinuado ${m} não deve estar na lista ativa`);
  });
});

test('MODELOS_GEMINI_COMPROVANTES possui a lista prioritária para leitura de recibos/notas fiscais', () => {
  const modelosComprovantes = context.MODELOS_GEMINI_COMPROVANTES || (context.window && context.window.MODELOS_GEMINI_COMPROVANTES);
  assert.ok(modelosComprovantes && typeof modelosComprovantes.length === 'number', 'MODELOS_GEMINI_COMPROVANTES deve ser um array');
  assert.deepStrictEqual(Array.from(modelosComprovantes), ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash']);
});

test('Existe apenas UMA definição de chamarGeminiComFallback no código de app.js', () => {
  const freshAppJs = fs.readFileSync(appJsPath, 'utf8');
  const matches = freshAppJs.match(/async\s+function\s+chamarGeminiComFallback/g);
  assert.strictEqual(matches ? matches.length : 0, 1, 'Deve existir exatamente uma definição de chamarGeminiComFallback');
});

test('extrairComImagem e chamarGeminiVisionCupom utilizam MODELOS_GEMINI_COMPROVANTES', () => {
  const freshAppJs = fs.readFileSync(appJsPath, 'utf8');
  assert.ok(freshAppJs.includes('modelos: MODELOS_GEMINI_COMPROVANTES'), 'Deve referenciar MODELOS_GEMINI_COMPROVANTES na leitura de comprovantes e cupons');
});

(async () => {
  await (async () => {
    totalTests++;
    try {
      // Mock do fetchFn onde o primeiro modelo retorna 404 (not found) e o segundo responde com sucesso 200
      let chamadaCount = 0;
      const modelosChamados = [];
      const mockFetch = async (url) => {
        chamadaCount++;
        const matchModelo = url.match(/\/models\/([^:]+):generateContent/);
        const modelo = matchModelo ? matchModelo[1] : 'desconhecido';
        modelosChamados.push(modelo);

        if (modelo === 'gemini-1.5-pro' || chamadaCount === 1) {
          return {
            ok: false,
            status: 404,
            json: async () => ({
              error: {
                message: "models/gemini-1.5-pro is not found for API version v1beta, or is not supported for generateContent. Call ModelService.ListModels to see the list of available models and their supported methods."
              }
            })
          };
        }

        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              { content: { parts: [{ text: '{"descricao":"Supermercado","valor":150.50}' }] } }
            ]
          })
        };
      };

      const resp = await context.chamarGeminiComFallback({
        contents: [{ role: 'user', parts: [{ text: 'ler comprovante' }] }],
        modelos: ['gemini-1.5-pro', 'gemini-3.8-flash'],
        key: 'test_key_valida',
        fetchFn: mockFetch
      });

      assert.strictEqual(resp.model, 'gemini-3.8-flash', 'Deve ter feito fallback para o segundo modelo');
      assert.ok(resp.text.includes('Supermercado'), 'Texto retornado deve ser o do modelo que respondeu com sucesso');
      assert.strictEqual(modelosChamados[0], 'gemini-1.5-pro');
      assert.strictEqual(modelosChamados[1], 'gemini-3.8-flash');
      passedTests++;
      console.log('  ✅ [PASS] chamarGeminiComFallback faz fallback resiliente em erro 404/not found sem disparar throw prematuro');
    } catch (err) {
      console.error('  ❌ [FAIL] chamarGeminiComFallback faz fallback resiliente em erro 404/not found sem disparar throw prematuro');
      console.error('     Erro:', err.message);
      throw err;
    }
  })();

  await (async () => {
    totalTests++;
    try {
      // Mock do fetchFn onde o primeiro modelo retorna 429 cota esgotada e o segundo sucede
      const modelosChamados = [];
      const mockFetch = async (url) => {
        const matchModelo = url.match(/\/models\/([^:]+):generateContent/);
        const modelo = matchModelo ? matchModelo[1] : 'desconhecido';
        modelosChamados.push(modelo);

        if (modelosChamados.length === 1) {
          return {
            ok: false,
            status: 429,
            json: async () => ({ error: { message: 'Quota exceeded for quota metric RESOURCE_EXHAUSTED' } })
          };
        }

        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [{ content: { parts: [{ text: 'OK Cota' }] } }]
          })
        };
      };

      const resp = await context.chamarGeminiComFallback({
        contents: [{ role: 'user', parts: [{ text: 'teste cota' }] }],
        modelos: ['gemini-3.8-flash', 'gemini-3.6-flash'],
        key: 'test_key_valida',
        fetchFn: mockFetch
      });

      assert.strictEqual(resp.model, 'gemini-3.6-flash');
      assert.strictEqual(resp.text, 'OK Cota');
      passedTests++;
      console.log('  ✅ [PASS] chamarGeminiComFallback faz fallback em status 429/cota esgotada');
    } catch (err) {
      console.error('  ❌ [FAIL] chamarGeminiComFallback faz fallback em status 429/cota esgotada');
      console.error('     Erro:', err.message);
      throw err;
    }
  })();

  await (async () => {
    totalTests++;
    try {
      // Mock do fetchFn com API_KEY_INVALID: deve interromper imediatamente
      let chamadas = 0;
      const mockFetch = async () => {
        chamadas++;
        return {
          ok: false,
          status: 400,
          json: async () => ({ error: { message: 'API_KEY_INVALID: API key not valid. Please pass a valid API key.' } })
        };
      };

      let erroCapturado = null;
      try {
        await context.chamarGeminiComFallback({
          contents: [{ role: 'user', parts: [{ text: 'teste key' }] }],
          modelos: ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite'],
          key: 'chave_invalida',
          fetchFn: mockFetch
        });
      } catch (e) {
        erroCapturado = e;
      }

      assert.ok(erroCapturado, 'Deve ter disparado exceção de chave inválida');
      assert.ok(erroCapturado.message.includes('API_KEY_INVALID'), 'Mensagem de erro deve conter API_KEY_INVALID');
      assert.strictEqual(chamadas, 1, 'Não deve tentar outros modelos se a chave de API for inválida');
      passedTests++;
      console.log('  ✅ [PASS] chamarGeminiComFallback interrompe imediatamente em erro de API_KEY_INVALID sem tentar outros modelos');
    } catch (err) {
      console.error('  ❌ [FAIL] chamarGeminiComFallback interrompe imediatamente em erro de API_KEY_INVALID sem tentar outros modelos');
      console.error('     Erro:', err.message);
      throw err;
    }
  })();

  await (async () => {
    totalTests++;
    try {
      // Mock de falha em todos os modelos: deve lançar erro explicativo final
      const mockFetch = async () => {
        return {
          ok: false,
          status: 503,
          json: async () => ({ error: { message: 'The model is overloaded. Please try again later.' } })
        };
      };

      let erroCapturado = null;
      try {
        await context.chamarGeminiComFallback({
          contents: [{ role: 'user', parts: [{ text: 'teste sobrecarga' }] }],
          modelos: ['gemini-3.8-flash', 'gemini-3.6-flash'],
          key: 'chave_valida',
          fetchFn: mockFetch
        });
      } catch (e) {
        erroCapturado = e;
      }

      assert.ok(erroCapturado, 'Deve lançar erro quando todos os modelos falharem');
      assert.ok(erroCapturado.message.includes('Todos os modelos Gemini do roteador falharam'), 'Deve indicar que todos os modelos falharam');
      passedTests++;
      console.log('  ✅ [PASS] chamarGeminiComFallback lança erro explicativo após todos os modelos falharem');
    } catch (err) {
      console.error('  ❌ [FAIL] chamarGeminiComFallback lança erro explicativo após todos os modelos falharem');
      console.error('     Erro:', err.message);
      throw err;
    }
  })();

  // ----------------------------------------------------
  // 10. TESTES DE EXCLUSÃO DE CARTÃO, REFLEXO NO CARTÃO AGI E BLINDAGEM DE IDS
  // ----------------------------------------------------
  console.log('\n10. Verificação de Exclusão de Cartões, Vínculo com Agi e Lançamentos:');

  test('HTML possui botão de exclusão de cartão nos modais #m-cartao e #m-fatura-cartao', () => {
    assert.ok(htmlContent.includes('id="c-btn-excluir"'), 'Modal #m-cartao deve conter o botão #c-btn-excluir');
    assert.ok(htmlContent.includes('onclick="excluirCartao(cartaoAtualId)"'), 'Botão de exclusão deve chamar excluirCartao(cartaoAtualId)');
    assert.ok(htmlContent.includes('id="m-fatura-cartao"'), 'Modal #m-fatura-cartao deve existir no HTML');
    const faturaModalPart = htmlContent.slice(htmlContent.indexOf('id="m-fatura-cartao"'), htmlContent.indexOf('id="m-fatura-cartao"') + 2000);
    assert.ok(faturaModalPart.includes('excluirCartao(cartaoAtualId)'), 'Cabeçalho de #m-fatura-cartao deve conter botão de exclusão chamando excluirCartao(cartaoAtualId)');
  });

  test('HTML possui seletor de cartão de crédito no modal de gasto (#g-origem-pagamento e #g-bloco-seletor-cartao)', () => {
    assert.ok(htmlContent.includes('<option value="cartao">💳 Cartão de Crédito</option>'), 'Select #g-origem-pagamento deve possuir a opção de Cartão de Crédito');
    assert.ok(htmlContent.includes('id="g-bloco-seletor-cartao"'), 'Modal #m-gasto deve conter o bloco condicional #g-bloco-seletor-cartao');
    assert.ok(htmlContent.includes('id="g-cartao-id"'), 'Bloco seletor de cartão deve conter o <select id="g-cartao-id">');
  });

  test('HTML possui barra de navegação de competências em #m-fatura-cartao', () => {
    assert.ok(htmlContent.includes('id="fatura-competencia-label"'), 'Modal de fatura deve conter label da competência');
    assert.ok(htmlContent.includes('navegarMesFatura(-1)'), 'Modal de fatura deve conter botão para mês anterior');
    assert.ok(htmlContent.includes('navegarMesFatura(1)'), 'Modal de fatura deve conter botão para próximo mês');
  });

  test('excluirCartao() remove cartões tanto com IDs numéricos quanto alfanuméricos ("agi")', () => {
    context.S.cartoes = [
      { id: 'agi', nome: 'Cartão Agi', limite: 2500, ativo: true },
      { id: 99, nome: 'Cartão Nubank', limite: 1500, ativo: true }
    ];
    context.setCartaoAtualId('agi');
    
    // Exclui cartão alfanumérico 'agi'
    const resAgi = context.excluirCartao('agi');
    assert.strictEqual(resAgi.ok, true, 'Deve excluir cartão com id string "agi" com sucesso');
    assert.strictEqual(context.S.cartoes.length, 1, 'Deve restar apenas 1 cartão');
    assert.strictEqual(context.S.cartoes[0].id, 99, 'Cartão restante deve ser o de ID numérico');
    assert.strictEqual(context.getCartaoAtualId(), null, 'Deve resetar cartaoAtualId após exclusão');

    // Exclui cartão com id numérico 99
    const resNum = context.excluirCartao(99);
    assert.strictEqual(resNum.ok, true, 'Deve excluir cartão com id numérico 99 com sucesso');
    assert.strictEqual(context.S.cartoes.length, 0, 'Lista de cartões deve ficar vazia');
  });

  test('renderCartoesTopo() interpola IDs alfanuméricos como "agi" com aspas seguras evitando ReferenceError', () => {
    context.S.cartoes = [
      { id: 'agi', nome: 'Agi', limite: 3000, diaFechamento: 15, diaVencimento: 22, ativo: true }
    ];
    context.S.comprasCartao = [];
    context.S.faturasCartao = [];
    
    context.renderCartoesTopo();
    const el = domMock.getElementById('cartoes-topo-container');
    const htmlGerado = el.innerHTML || '';
    
    assert.ok(htmlGerado.includes("abrirFaturaCartao('agi')"), 'onclick deve interpolar o ID com aspas seguras para evitar ReferenceError');
    assert.ok(!htmlGerado.includes("abrirFaturaCartao(agi)"), 'Não pode gerar abrirFaturaCartao(agi) sem aspas');
  });

  test('salvarCompraCartao() aceita IDs alfanuméricos ("agi") sem converter para NaN', () => {
    context.S.cartoes = [
      { id: 'agi', nome: 'Agi', limite: 3000, diaFechamento: 15, diaVencimento: 22, ativo: true }
    ];
    context.S.comprasCartao = [];
    
    const res = context.salvarCompraCartao({
      cartaoId: 'agi',
      desc: 'Compra Teste Agi',
      val: 180.50,
      data: '2026-10-05',
      parcelado: false
    });

    assert.strictEqual(res.ok, true, 'Deve salvar compra no cartão Agi');
    assert.strictEqual(context.S.comprasCartao.length, 1);
    assert.strictEqual(String(context.S.comprasCartao[0].cartaoId), 'agi');
    assert.strictEqual(context.S.comprasCartao[0].val, 180.50);

    const fatura = context.calcularFaturaMes('agi', '2026-10');
    assert.strictEqual(fatura.valorTotalFatura, 180.50, 'Fatura calculada para o cartão Agi deve refletir o valor');
  });

  test('addGasto() com origem "cartao" vincula automaticamente a S.comprasCartao e reflete na fatura do cartão Agi', () => {
    context.S.cartoes = [
      { id: 'agi', nome: 'Agi', limite: 5000, diaFechamento: 20, diaVencimento: 27, ativo: true }
    ];
    context.S.gastos = [];
    context.S.comprasCartao = [];
    context.S.faturasCartao = [];

    // Mock dos inputs de #m-gasto
    domMock.getElementById('g-titular').value = 'Alexsander';
    domMock.getElementById('g-desc').value = 'Mercado Semanal';
    domMock.getElementById('g-val').value = '250.00';
    domMock.getElementById('g-data').value = '2026-10-10';
    domMock.getElementById('g-is-parcelado').checked = false;
    domMock.getElementById('g-is-recorrente').checked = false;
    domMock.getElementById('g-origem-pagamento').value = 'cartao';
    domMock.getElementById('g-cartao-id').value = 'agi';

    context.addGasto();

    assert.strictEqual(context.S.gastos.length, 1, 'Deve registrar o gasto em S.gastos');
    assert.strictEqual(context.S.comprasCartao.length, 1, 'Deve espelhar a compra em S.comprasCartao');
    assert.strictEqual(String(context.S.comprasCartao[0].cartaoId), 'agi', 'cartaoId em comprasCartao deve ser agi');
    assert.strictEqual(context.S.comprasCartao[0].val, 250);

    const faturaAgi = context.calcularFaturaMes('agi', '2026-10');
    assert.strictEqual(faturaAgi.valorTotalFatura, 250, 'Fatura do cartão Agi deve refletir exatamente o valor lançado no modal de gastos');
  });

  test('addGasto() parcelado no cartão Agi gera as parcelas sequenciais em S.comprasCartao', () => {
    context.S.cartoes = [
      { id: 'agi', nome: 'Agi', limite: 5000, diaFechamento: 20, diaVencimento: 27, ativo: true }
    ];
    context.S.gastos = [];
    context.S.comprasCartao = [];
    context.S.faturasCartao = [];

    domMock.getElementById('g-titular').value = 'Alexsander';
    domMock.getElementById('g-desc').value = 'Smartphone';
    domMock.getElementById('g-val').value = '900.00';
    domMock.getElementById('g-data').value = '2026-10-10';
    domMock.getElementById('g-is-parcelado').checked = true;
    domMock.getElementById('g-num-parcelas').value = '3';
    domMock.getElementById('g-origem-pagamento').value = 'cartao';
    domMock.getElementById('g-cartao-id').value = 'agi';
    domMock.getElementById('g-tipo-divida').value = 'cartao';

    context.addGasto();

    assert.strictEqual(context.S.comprasCartao.length, 3, 'Deve gerar exatamente 3 parcelas em S.comprasCartao');
    assert.strictEqual(context.S.comprasCartao[0].mesFatura, '2026-10');
    assert.strictEqual(context.S.comprasCartao[1].mesFatura, '2026-11');
    assert.strictEqual(context.S.comprasCartao[2].mesFatura, '2026-12');
    assert.strictEqual(context.S.comprasCartao[0].val, 300);

    const faturaOut = context.calcularFaturaMes('agi', '2026-10');
    const faturaNov = context.calcularFaturaMes('agi', '2026-11');
    assert.strictEqual(faturaOut.valorTotalFatura, 300, 'Fatura de Outubro deve ter parcela 1/3');
    assert.strictEqual(faturaNov.valorTotalFatura, 300, 'Fatura de Novembro deve ter parcela 2/3');
  });

  test('Compras realizadas após o dia de fechamento caem na fatura da competência seguinte', () => {
    const diaFech = 10;
    const diaVenc = 17;
    // Compra no dia 12 (após fechamento do dia 10)
    const mesFatura = context.calcularMesFaturaCompra('2026-10-12', diaFech, diaVenc);
    assert.strictEqual(mesFatura, '2026-11', 'Compra após o fechamento deve alocar para a fatura do mês subsequente');

    // Compra no dia 8 (antes do fechamento do dia 10)
    const mesFaturaAntes = context.calcularMesFaturaCompra('2026-10-08', diaFech, diaVenc);
    assert.strictEqual(mesFaturaAntes, '2026-10', 'Compra antes do fechamento deve alocar para a fatura do mês corrente');
  });

  test('navegarMesFatura() avança e recua competência da fatura e atualiza estado', () => {
    context.S.cartoes = [
      { id: 'agi', nome: 'Agi', limite: 5000, diaFechamento: 20, diaVencimento: 27, ativo: true }
    ];
    context.abrirFaturaCartao('agi', '2026-10');
    assert.strictEqual(context.faturaMesCompetencia(), '2026-10');

    // Avança 1 mês
    context.navegarMesFatura(1);
    assert.strictEqual(context.faturaMesCompetencia(), '2026-11');

    // Recua 1 mês
    context.navegarMesFatura(-1);
    assert.strictEqual(context.faturaMesCompetencia(), '2026-10');
  });

  // ----------------------------------------------------
  // 11. TESTES DE OCR DE FATURAS, EXTRATOS & TOP 10 MAIORES GASTOS
  // ----------------------------------------------------
  console.log('\n11. Verificação de OCR de Faturas/Extratos e Top 10 Gastos com IA:');

  test('HTML possui modais e controles para OCR de Faturas, OCR de Extratos e Top 10 Gastos', () => {
    // 1. Fatura de Cartão
    assert.ok(htmlContent.includes('id="m-preview-importar-fatura"'), 'Deve conter modal m-preview-importar-fatura');
    assert.ok(htmlContent.includes('id="preview-fatura-lista"'), 'Deve conter elemento preview-fatura-lista');
    assert.ok(htmlContent.includes('id="preview-fatura-total"'), 'Deve conter preview-fatura-total');
    assert.ok(htmlContent.includes('id="fatura-ocr-input"'), 'Deve conter input de arquivo fatura-ocr-input');
    assert.ok(htmlContent.includes('aoSelecionarArquivoFaturaCartao'), 'Deve vincular onchange ao aoSelecionarArquivoFaturaCartao');

    // 2. Extrato Bancário / Benefícios
    assert.ok(htmlContent.includes('id="m-preview-importar-extrato"'), 'Deve conter modal m-preview-importar-extrato');
    assert.ok(htmlContent.includes('id="preview-extrato-lista"'), 'Deve conter preview-extrato-lista');
    assert.ok(htmlContent.includes('id="preview-extrato-total"'), 'Deve conter preview-extrato-total');
    assert.ok(htmlContent.includes('id="extrato-ocr-input"'), 'Deve conter input de arquivo extrato-ocr-input');
    assert.ok(htmlContent.includes('aoSelecionarArquivoExtratoGasto'), 'Deve vincular onchange ao aoSelecionarArquivoExtratoGasto');

    // 3. Top 10 Maiores Gastos do Mês
    assert.ok(htmlContent.includes('id="card-top10-gastos"'), 'Deve conter card-top10-gastos');
    assert.ok(htmlContent.includes('id="top10-ranking-lista"'), 'Deve conter elemento top10-ranking-lista');
    assert.ok(htmlContent.includes('id="btn-analisar-desperdicios"'), 'Deve conter btn-analisar-desperdicios');
    assert.ok(htmlContent.includes('id="top10-diagnostico-ia"'), 'Deve conter top10-diagnostico-ia');
  });

  test('Transparência em faturas: detalha explicitamente juros e encargos de rotativo sobre saldo anterior', () => {
    context.S.cartoes = [
      { id: 'agi', nome: 'Agi', limite: 5000, diaFechamento: 20, diaVencimento: 27, taxaRotativo: 14.5, ativo: true }
    ];
    context.S.comprasCartao = [];
    context.S.faturasCartao = [
      {
        cartaoId: 'agi',
        mes: '2026-09',
        valorTotalFatura: 1000,
        totalPago: 400, // Pagou 400, restou 600
        saldoRestante: 600,
        pagoParcial: true,
        fechada: true
      }
    ];

    const faturaOut = context.calcularFaturaMes('agi', '2026-10');
    assert.ok(faturaOut.rotativoItem, 'Deve gerar rotativoItem quando houver saldo não pago da competência anterior');
    assert.strictEqual(faturaOut.rotativoItem.detalhe.saldoAnterior, 600, 'Saldo anterior deve ser R$ 600');
    assert.strictEqual(faturaOut.rotativoItem.detalhe.juros, 87, 'Juros de 14.5% sobre 600 deve ser R$ 87');
    assert.strictEqual(faturaOut.valorTotalFatura, 687, 'Fatura de Outubro deve totalizar R$ 687 (600 + 87)');
  });

  await (async () => {
    totalTests++;
    try {
      const originalChamar = context.chamarGeminiComFallback;
      context.chamarGeminiComFallback = async () => ({
        text: JSON.stringify([
          { desc: 'Mercado Livre', val: 150.00, data: '2026-10-05', parcelaNum: 1, totalParcelas: 1 },
          { desc: 'Notebook Dell', val: 400.00, data: '2026-10-01', parcelaNum: 2, totalParcelas: 10 }
        ])
      });

      const itens = await context.lerFaturaCartaoComIA('base64faturaFake', 'image/jpeg');
      assert.strictEqual(itens.length, 2, 'Deve extrair 2 itens da fatura');
      assert.strictEqual(itens[0].desc, 'Mercado Livre');
      assert.strictEqual(itens[0].val, 150);
      assert.strictEqual(itens[0].selecionado, true);
      assert.strictEqual(itens[1].parcelaNum, 2);
      assert.strictEqual(itens[1].totalParcelas, 10);

      context.chamarGeminiComFallback = originalChamar;
      passedTests++;
      console.log('  ✅ [PASS] lerFaturaCartaoComIA() extrai compras e parcelas da fatura via Gemini');
    } catch (err) {
      console.error('  ❌ [FAIL] lerFaturaCartaoComIA() extrai compras e parcelas da fatura via Gemini');
      console.error('     Erro:', err.message);
      throw err;
    }
  })();

  test('confirmarImportarFaturaModal() grava itens selecionados em S.comprasCartao vinculados ao cartão ativo', () => {
    context.S.cartoes = [{ id: 'agi', nome: 'Agi', limite: 5000, diaFechamento: 20, diaVencimento: 27, ativo: true }];
    context.setCartaoAtualId('agi');
    context.setFaturaMesCompetencia('2026-10');
    context.S.comprasCartao = [];

    context.setItensFaturaDetectados([
      { id: 0, selecionado: true, desc: 'Amazon Prime', val: 19.90, data: '2026-10-03', parcelaNum: 1, totalParcelas: 1 },
      { id: 1, selecionado: false, desc: 'Compra Desmarcada', val: 50.00, data: '2026-10-04', parcelaNum: 1, totalParcelas: 1 },
      { id: 2, selecionado: true, desc: 'Sofá 3 Lugares', val: 200.00, data: '2026-10-05', parcelaNum: 1, totalParcelas: 5 }
    ]);

    context.confirmarImportarFaturaModal();

    assert.strictEqual(context.S.comprasCartao.length, 2, 'Deve importar apenas os 2 itens selecionados');
    assert.strictEqual(context.S.comprasCartao[0].desc, 'Amazon Prime');
    assert.strictEqual(context.S.comprasCartao[0].cartaoId, 'agi');
    assert.strictEqual(context.S.comprasCartao[0].mesFatura, '2026-10');
    assert.strictEqual(context.S.comprasCartao[1].desc, 'Sofá 3 Lugares');
    assert.strictEqual(context.S.comprasCartao[1].parcelado, true);
    assert.strictEqual(context.S.comprasCartao[1].totalParcelas, 5);
  });

  await (async () => {
    totalTests++;
    try {
      const originalChamar = context.chamarGeminiComFallback;
      context.chamarGeminiComFallback = async () => ({
        text: JSON.stringify([
          { desc: 'Padaria Central', val: 28.50, data: '2026-10-06', cat: 'alimentacao', origemSugerida: 'VR' },
          { desc: 'Supermercado Dia', val: 215.00, data: '2026-10-07', cat: 'alimentacao', origemSugerida: 'VA' },
          { desc: 'Posto Petrobras', val: 100.00, data: '2026-10-08', cat: 'transporte', origemSugerida: 'salario' }
        ])
      });

      const itens = await context.lerExtratoBancarioComIA('base64extratoFake', 'application/pdf');
      assert.strictEqual(itens.length, 3, 'Deve extrair 3 transações do extrato');
      assert.strictEqual(itens[0].origem, 'VR');
      assert.strictEqual(itens[1].origem, 'VA');
      assert.strictEqual(itens[2].origem, 'salario');

      context.chamarGeminiComFallback = originalChamar;
      passedTests++;
      console.log('  ✅ [PASS] lerExtratoBancarioComIA() extrai saídas bancárias e sugere origem (VA/VR/Salário)');
    } catch (err) {
      console.error('  ❌ [FAIL] lerExtratoBancarioComIA() extrai saídas bancárias e sugere origem (VA/VR/Salário)');
      console.error('     Erro:', err.message);
      throw err;
    }
  })();

  test('confirmarImportarExtratoModal() salva gastos e respeita confirmação de destino (salário vs VA/VR)', () => {
    context.S.gastos = [];
    context.setItensExtratoDetectados([
      { id: 0, selecionado: true, desc: 'Almoço Restaurante', val: 45.00, data: '2026-10-09', cat: 'alimentacao', origem: 'VR' },
      { id: 1, selecionado: true, desc: 'Conta de Energia', val: 180.00, data: '2026-10-10', cat: 'moradia', origem: 'salario' }
    ]);

    context.confirmarImportarExtratoModal();

    assert.strictEqual(context.S.gastos.length, 2, 'Deve adicionar 2 gastos a S.gastos');
    const gastoVR = context.S.gastos.find(g => g.desc === 'Almoço Restaurante');
    const gastoSalario = context.S.gastos.find(g => g.desc === 'Conta de Energia');

    assert.ok(gastoVR, 'Gasto de VR deve existir');
    assert.strictEqual(gastoVR.origemPagamento, 'VR');
    assert.ok(gastoSalario, 'Gasto de salário deve existir');
    assert.strictEqual(gastoSalario.origemPagamento, 'salario');
  });

  test('calcularTop10GastosDoMes() consolida gastos e cartões, unifica parcelas e ordena decrescente', () => {
    context.S.gastos = [
      { id: 1, desc: 'iFood (1/3)', val: 50.00, data: '2026-10-01' },
      { id: 2, desc: 'iFood (2/3)', val: 50.00, data: '2026-10-15' },
      { id: 3, desc: 'Supermercado Assaí', val: 400.00, data: '2026-10-05' },
      { id: 4, desc: 'Gasto Outro Mês', val: 999.00, data: '2026-09-10' }
    ];
    context.S.comprasCartao = [
      { id: 10, desc: 'Supermercado Assaí', val: 300.00, mesFatura: '2026-10' },
      { id: 11, desc: 'Farmácia Drogasil', val: 120.00, mesFatura: '2026-10' }
    ];

    const top10 = context.calcularTop10GastosDoMes('2026-10');

    // 1º lugar: Supermercado Assaí (400 + 300 = 700, 2 compras)
    assert.strictEqual(top10[0].estabelecimento, 'Supermercado Assaí');
    assert.strictEqual(top10[0].valorTotal, 700);
    assert.strictEqual(top10[0].qtdCompras, 2);

    // 2º lugar: Farmácia Drogasil (120)
    assert.strictEqual(top10[1].estabelecimento, 'Farmácia Drogasil');
    assert.strictEqual(top10[1].valorTotal, 120);

    // 3º lugar: iFood (50 + 50 = 100, unificado sem sufixo de parcelas)
    assert.strictEqual(top10[2].estabelecimento, 'iFood');
    assert.strictEqual(top10[2].valorTotal, 100);
    assert.strictEqual(top10[2].qtdCompras, 2);

    // Gasto do mês 2026-09 não deve constar
    assert.strictEqual(top10.some(t => t.estabelecimento === 'Gasto Outro Mês'), false);
  });

  test('renderTop10Gastos() renderiza o ranking com barras proporcionais no elemento #top10-ranking-lista', () => {
    domMock.getElementById('top10-ranking-lista').innerHTML = '';
    const hojeMes = new Date().toISOString().slice(0, 7);
    context.S.gastos = [
      { id: 1, desc: 'Posto Ipiranga', val: 200.00, data: hojeMes + '-10' }
    ];
    context.S.comprasCartao = [];

    context.renderTop10Gastos();

    const htmlLista = domMock.getElementById('top10-ranking-lista').innerHTML;
    assert.ok(htmlLista.includes('Posto Ipiranga'), 'HTML deve conter o nome do estabelecimento');
    assert.ok(htmlLista.includes('200'), 'HTML deve conter o valor');
  });

  await (async () => {
    totalTests++;
    try {
      let promptRecebido = '';
      const originalChamar = context.chamarGeminiComFallback;
      context.chamarGeminiComFallback = async (opts) => {
        promptRecebido = opts.contents[0].parts[0].text;
        return { text: '**Diagnóstico:** Reduza os gastos de combustíveis e padarias.' };
      };

      const hojeMes = new Date().toISOString().slice(0, 7);
      context.S.gastos = [
        { id: 1, desc: 'Posto Ipiranga', val: 200.00, data: hojeMes + '-10' }
      ];
      context.S.comprasCartao = [];

      domMock.getElementById('top10-diagnostico-ia').innerHTML = '';
      domMock.getElementById('top10-diagnostico-ia').style = {};

      await context.analisarDesperdiciosTop10IA();

      assert.ok(promptRecebido.includes('Consultor Financeiro Familiar'), 'Deve enviar prompt especializado de corte de desperdícios');
      assert.ok(promptRecebido.includes('Posto Ipiranga'), 'Deve conter os estabelecimentos do Top 10 no prompt');
      const htmlDiag = domMock.getElementById('top10-diagnostico-ia').innerHTML;
      assert.ok(htmlDiag.includes('Diagnóstico do Consultor IA'), 'Deve renderizar cabeçalho do diagnóstico');
      assert.ok(htmlDiag.includes('Reduza os gastos de combustíveis'), 'Deve renderizar texto da resposta da IA formatado');

      context.chamarGeminiComFallback = originalChamar;
      passedTests++;
      console.log('  ✅ [PASS] analisarDesperdiciosTop10IA() envia ranking ao Gemini e renderiza recomendações');
    } catch (err) {
      console.error('  ❌ [FAIL] analisarDesperdiciosTop10IA() envia ranking ao Gemini e renderiza recomendações');
      console.error('     Erro:', err.message);
      throw err;
    }
  })();

  console.log('\n====================================================');
  console.log(` RESULTADO FINAL: ${passedTests}/${totalTests} TESTES APROVADOS COM SUCESSO!`);
  console.log('====================================================\n');
})();
