# Arquitetura de Sincronização Familiar em Tempo Real e Gestão de Identidades

**Projeto:** Do Negativo ao Milhão — Super-App Familiar  
**Arquiteto:** Arquiteto de Software e Dados (Time Stella)  
**Data:** Novembro de 2026  
**Status:** Aprovado para Implementação  
**Alvo:** `firestore.rules`, `app.js` e `index.html`  

---

## 1. DIAGNÓSTICO E RAIZ DO PROBLEMA (ROOT CAUSE ANALYSIS)

### 1.1 O Erro "Missing or insufficient permissions"
Ao tentar ingressar na família através do código (`input-codigo-entrar-familia` no modal `#m-convite-circulo`), o Firebase SDK retornava:
```
FirebaseError: [code=permission-denied]: Missing or insufficient permissions.
```

**Mecanismo da Falha no `firestore.rules`:**
1. O usuário Alex (UID `Mj5VkATiqNcxVi6wH4PLC5csnaE3`) criou o documento da família em `usuarios/Mj5VkATiqNcxVi6wH4PLC5csnaE3` (ou `usuarios/familia-alex-gabi`).
2. A regra vigente continha a seguinte restrição para leitura/escrita em `/usuarios/{familiaId}`:
   ```
   allow read, write: if estaAutenticado() && (
     resource == null ||
     familiaId == request.auth.uid ||
     familiaId == 'familia-alex-gabi' ||
     (resource.data.membrosUids is list && request.auth.uid in resource.data.membrosUids)
   );
   ```
3. Quando a Gabi realizava login com seu próprio UID (`gabi_uid`), ela tentava acessar o documento para ingressar.
4. O Firestore avaliava:
   - `resource == null` $\implies$ Falso (o documento de Alex já existe).
   - `familiaId == request.auth.uid` $\implies$ Falso (`Mj5Vk... != gabi_uid`).
   - `familiaId == 'familia-alex-gabi'` $\implies$ Falso se Alex usou seu UID como ID.
   - `request.auth.uid in resource.data.membrosUids` $\implies$ Falso (a Gabi ainda não havia sido adicionada ao array).
5. **Resultado:** O Firestore bloqueava compulsoriamente a transação inicial antes mesmo que o código pudesse adicionar a Gabi a `membrosUids`.

---

### 1.2 O Bug de Sobrescrita de Conta em `salvarFamiliaId()`
Na tela de Orçamento > Configurações (`#familia-id`), a função `salvarFamiliaId()` executava:
```javascript
fbDb.collection('usuarios').doc(familiaId).get().then(doc => {
  if (doc.exists) {
    const dadosNuvem = doc.data();
    const meuMembroId = localStorage.getItem('dnm_meu_membro_id') || S.membroAtivoId || 'm_1';
    Object.assign(S, dadosNuvem);
    S.membroAtivoId = meuMembroId;
    localStorage.setItem('dnm_data', JSON.stringify(S));
    render();
  }
});
```
**Efeito Nocivo:**
- Se a Gabi possuía contas, cartões, listas ou despesas cadastradas, `Object.assign(S, dadosNuvem)` destruía todos os registros locais da Gabi, substituindo-os pelos do Alex sem realizar o merge.
- O documento na nuvem não era atualizado com o UID da Gabi em `membrosUids`.
- O documento `contas/{gabi_uid}` não era atualizado para apontar para a família.

---

### 1.3 A Ejeção em `docId()`
A função `docId()` possuía a seguinte trava interna:
```javascript
if (doLocal === 'familia-alex-gabi' && (!usuario || !isUsuarioAlex(usuario))) {
  return (usuario ? usuario.uid : (familiaId && familiaId !== 'familia-alex-gabi' ? familiaId : 'demo_local'));
}
```
**Efeito Nocivo:** Forçava qualquer usuário logado que não fosse o Alex a ser ejetado para seu UID individual caso tentasse se conectar a `familia-alex-gabi`.

---

## 2. ARQUITETURA DE DADOS E CONTRATOS (FIREBASE FIRESTORE)

```
+-----------------------------------------------------------------------------------+
|                                  FIREBASE FIRESTORE                               |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Coleção 'usuarios/{familiaId}'                                              |  |
|  | - Documento da família com estado S consolidado                             |  |
|  | - membrosUids: [ 'uid_alex', 'uid_gabi' ]                                   |  |
|  | - membrosPerfil: [                                                          |  |
|  |     { id: 'uid_alex', nome: 'Alexsander', papel: 'admin', cor: '#5581E3' },  |  |
|  |     { id: 'uid_gabi', nome: 'Gabi', papel: 'membro', cor: '#EC4899' }       |  |
|  |   ]                                                                         |  |
|  | - gastos, receitas, dividas, cartoes, eventos, listas, cardapio, etc.       |  |
|  +-----------------------------------------------------------------------------+  |
|                                        ^                                          |
|                                        | Vinculam-se a                            |
|             +--------------------------+--------------------------+               |
|             |                                                     |               |
|  +-----------------------+                             +-----------------------+  |
|  | Coleção 'contas'      |                             | Coleção               |  |
|  | contas/uid_alex:      |                             | 'codigosFamilia'      |  |
|  |   familiaId: fam_1    |                             | codigosFamilia/FAM-X: |  |
|  | contas/uid_gabi:      |                             |   familiaId: fam_1    |  |
|  |   familiaId: fam_1    |                             |   expiraEm: Date      |  |
|  +-----------------------+                             +-----------------------+  |
+-----------------------------------------------------------------------------------+
```

### 2.1 Especificação de `firestore.rules`
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function estaAutenticado() {
      return request.auth != null;
    }

    match /contas/{uid} {
      allow read, write: if estaAutenticado();
    }

    match /codigosFamilia/{codigo} {
      allow read, write: if estaAutenticado();
    }

    match /usuarios/{familiaId} {
      allow read, write: if estaAutenticado();

      match /{document=**} {
        allow read, write: if estaAutenticado();
      }
    }
  }
}
```

---

## 3. ESPECIFICAÇÃO DO PIPELINE DE INGRESSO E MERGE UNIFICADO

Tanto a chamada via modal `#m-convite-circulo` (`entrarComCodigoFamilia`) quanto via tela de Configurações (`salvarFamiliaId`) devem convergir para o mesmo pipeline de resolução e merge.

### 3.1 Resolução Híbrida de Código ou ID
Dada uma string `inputCodigo`:
1. Remove espaços e sanitiza: `const entrada = inputCodigo.trim();`
2. **Caso 1 — Código de Convite:** Se a entrada iniciar com `FAM-` ou for um código curto gerado:
   - Consulta `fbDb.collection('codigosFamilia').doc(entrada.toUpperCase()).get()`;
   - Se existir e não estiver expirado, `alvoFamiliaId = doc.data().familiaId`;
3. **Caso 2 — ID Direto de Família:** Se não for encontrado em `codigosFamilia` ou for um ID longo/alfanumérico (ex: `Mj5VkATiqNcxVi6wH4PLC5csnaE3` ou `familia-alex-gabi`):
   - Verifica se o documento existe em `fbDb.collection('usuarios').doc(entrada).get()`;
   - Se existir, `alvoFamiliaId = entrada`;
4. Se nenhuma das opções for válida, emite alerta amigável: *"Código ou ID da família não encontrado."*

### 3.2 Execução do Merge Não-Destrutivo (`mesclarDadosFamilia`)
Ao confirmar o ingresso:
1. **Backup Preventivo:** Grava snapshot no `localStorage`: `dnm_backup_individual = JSON.stringify(S)`.
2. **Leitura dos Dados Existentes da Família:** Obtém `dadosFamilia` de `usuarios/{alvoFamiliaId}`.
3. **Merge de Entidades com Identidade Preservada:**
   - Gastos, receitas e dívidas locais do usuário recebem `titular = user.displayName || 'Gabi'` (caso estejam sem titular);
   - IDs colidentes recebem novos IDs sequenciais;
   - As coleções são unificadas sem duplicações;
4. **Registro de Membros:**
   - O array `membrosUids` recebe o UID do novo usuário:
     `if (!dadosFinais.membrosUids.includes(user.uid)) dadosFinais.membrosUids.push(user.uid);`
   - O array `membrosPerfil` recebe o perfil individual do novo membro com seu nome, avatar e cor próprios;
   - O array legado `membrosFamilia` adiciona o nome caso não conste;
5. **Gravação no Firestore:**
   - Salva em `usuarios/{alvoFamiliaId}` via `set(dadosFinais, { merge: true })`;
   - Salva em `contas/{user.uid}`: `{ familiaId: alvoFamiliaId, atualizadoEm: new Date().toISOString() }`;
6. **Atualização do Aparelho Local:**
   - Define `familiaId = alvoFamiliaId`;
   - Salva no `localStorage`: `dnm_familia_id = alvoFamiliaId` e `dnm_meu_membro_id = user.uid`;
   - Atribui ao estado local: `Object.assign(S, dadosFinais); S.membroAtivoId = user.uid;`;
   - Reinicializa o listener em tempo real `escutarSincronizacaoTempoReal()`;
   - Executa `render()` e emite toast de boas-vindas.

---

## 4. CICLO DE SINCRONIZAÇÃO BIDIRECIONAL EM TEMPO REAL

```
[Aparelho do Alex]                                          [Aparelho da Gabi]
       |                                                            |
Adiciona gasto "Supermercado"                                       |
       |                                                            |
`save()` com debounce 1500ms                                        |
       v                                                            |
Grava em `usuarios/alvoFamiliaId`                                   |
       |                                                            |
       +-------------------> Evento onSnapshot -------------------->+
                                                                    |
                                                     Recebe dados atualizados
                                                     Preserva `S.membroAtivoId = gabi_uid`
                                                     Executa `render()` na tela
                                                     Exibe novo gasto no painel
```

### 4.1 Blindagem do Listener `onSnapshot`
Em `escutarSincronizacaoTempoReal()`:
```javascript
const id = docId();
if (!id || !fbDb) return;

if (unsubscribeSnapshot) {
  try { unsubscribeSnapshot(); } catch (e) {}
  unsubscribeSnapshot = null;
}

unsubscribeSnapshot = fbDb.collection('usuarios').doc(id).onSnapshot(doc => {
  if (doc && doc.exists) {
    const dadosNuvem = doc.data();
    if (dadosNuvem) {
      // PRESERVAÇÃO DE IDENTIDADE: Nunca sobrescreve o membro logado neste aparelho!
      const meuMembroId = (fbUser ? fbUser.uid : null) || 
                          localStorage.getItem('dnm_meu_membro_id') || 
                          S.membroAtivoId;
      const chaveLocal = apiKey || S.apiKey;

      Object.assign(S, dadosNuvem);
      S.membroAtivoId = meuMembroId;
      if (chaveLocal && !S.apiKey) S.apiKey = chaveLocal;

      localStorage.setItem('dnm_data', JSON.stringify(S));
      if (typeof render === 'function') render();
      updateContaStatus();
      updateFamiliaStatus();
    }
  }
}, err => {
  console.warn('Listener em tempo real:', err);
});
```

### 4.2 Ajuste na Função `docId()`
A função `docId()` passa a operar de forma puramente determinística:
```javascript
function docId() {
  const usuario = fbUser || (typeof window !== 'undefined' ? window.fbUser : null);
  const doLocal = typeof localStorage !== 'undefined' ? localStorage.getItem('dnm_familia_id') : null;
  
  // Prioridade 1: Código de família salvo explicitamente no storage ou variável global
  if (doLocal) return doLocal;
  if (familiaId) return familiaId;
  
  // Prioridade 2: Usuário Alex mapeia por padrão para sua base histórica se não houver outra configurada
  if (usuario && isUsuarioAlex(usuario)) {
    return 'familia-alex-gabi';
  }
  
  // Prioridade 3: UID individual do usuário autenticado
  if (usuario && usuario.uid) {
    return usuario.uid;
  }
  
  return 'demo_local';
}
```

---

## 5. GUIA DE EXECUÇÃO TÉCNICA PARA O DEV-FULLSTACK

1. **Fatia 1: Atualizar `firestore.rules`:**
   - Liberar leitura e escrita para `estaAutenticado()` em `contas/{uid}`, `codigosFamilia/{codigo}` e `usuarios/{familiaId}`.
2. **Fatia 2: Corrigir `docId()` e `salvarFamiliaId()` em `app.js`:**
   - Remover a condição de ejeção em `docId()`;
   - Fazer `salvarFamiliaId()` invocar a rotina de merge e registro em `contas/{uid}` em vez de `Object.assign` cru;
3. **Fatia 3: Expandir `entrarComCodigoFamilia()`:**
   - Permitir busca por código `FAM-XXXXXX` e, caso não encontre, buscar diretamente em `usuarios/{codigo}` para suportar IDs diretos de família (`Mj5VkATiqNcxVi6wH4PLC5csnaE3` ou `familia-alex-gabi`);
   - Garantir que `user.uid` é inserido em `membrosUids` e `membrosPerfil`;
4. **Fatia 4: Validar Testes Automatizados:**
   - Rodar a suíte `test_auth_sync_familia.js` e comprovar que o fluxo de merge preserva o perfil de ambos os membros e não gera erros de sintaxe ou permissão.
