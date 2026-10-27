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
        innerHTML: ''
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
const context = {
  console,
  document: domMock,
  window: global.window,
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
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

console.log('\n====================================================');
console.log(` RESULTADO FINAL: ${passedTests}/${totalTests} TESTES APROVADOS COM SUCESSO!`);
console.log('====================================================\n');
