# ADR-006: Sincronização Familiar em Tempo Real, Resolução de Permissões e Identidade Compartilhada

**Status:** Aceito  
**Data:** 01/11/2026  
**Decisores:** Arquiteto de Software e Dados, Stella (Tech Lead)  
**Contexto:** Erro "Missing or insufficient permissions" no ingresso familiar via código/ID e substituição indevida da conta de membros familiares (Alex e Gabi).

---

## 1. Contexto e Problemas Identificados

### 1.1 Bloqueio de Permissão no Firestore ("Missing or insufficient permissions")
No arquivo `firestore.rules`, a regra de acesso a `usuarios/{familiaId}` exigia:
```
allow read, write: if estaAutenticado() && (
  resource == null ||
  familiaId == request.auth.uid ||
  familiaId == 'familia-alex-gabi' ||
  (resource.data.membrosUids is list && request.auth.uid in resource.data.membrosUids)
);
```
**Causa Raiz:** Quando o Alex criou a família sob seu UID (`Mj5VkATiqNcxVi6wH4PLC5csnaE3`) ou base customizada, o documento já existia (`resource != null`). Quando a Gabi tentava ler o documento (via `get()` ou `transaction.get()`) para ingressar, o UID dela ainda não constava em `resource.data.membrosUids`. O Firestore bloqueava a leitura na origem com `PERMISSION_DENIED`, impedindo a conclusão do ingresso.

### 1.2 Sobrescrita Destrutiva em `salvarFamiliaId()`
Na aba Orçamento > Configurações, a função `salvarFamiliaId()` executava:
```javascript
const dadosNuvem = doc.data();
Object.assign(S, dadosNuvem);
```
**Causa Raiz:** A substituição rasa sobrescrevia todo o estado local `S` da Gabi com os dados do Alex, destruindo lançamentos locais e sem adicionar o UID da Gabi a `membrosUids` nem registrar em `contas/{uid}`.

### 1.3 Ejeção de Membros em `docId()`
A função `docId()` continha a seguinte restrição:
```javascript
if (doLocal === 'familia-alex-gabi' && (!usuario || !isUsuarioAlex(usuario))) {
  return (usuario ? usuario.uid : ...);
}
```
**Causa Raiz:** Essa regra ejetava arbitrariamente qualquer usuário que não fosse o Alex de volta para seu UID individual, impedindo que a Gabi permanecesse conectada à base unificada `familia-alex-gabi`.

### 1.4 Incompatibilidade de Formato de Códigos
A função `entrarComCodigoFamilia` aceitava unicamente o formato `FAM-XXXXXX` via consulta à coleção `codigosFamilia`. Quando o usuário copiava e colava o ID direto da família (ex: `Mj5VkATiqNcxVi6wH4PLC5csnaE3` ou `familia-alex-gabi`), o documento não era encontrado.

---

## 2. Decisões Arquiteturais

### 2.1 Atualização Compulsória de `firestore.rules`
As regras de segurança do Firestore devem permitir que **qualquer usuário autenticado** leia e escreva nas coleções necessárias para colaboração familiar:
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
*Justificativa:* O aplicativo é um PWA de gestão familiar compartilhado. O isolamento de acesso ocorre pela autenticação e pelo conhecimento do código/ID da família. Restrições estritas baseadas em `membrosUids` pré-existentes criam um paradoxo do "ovo e da galinha" que inviabiliza a adição de novos membros convidados.

### 2.2 Resolução Neutra de `docId()`
A função `docId()` deve respeitar a escolha explícita do usuário:
1. Se houver `familiaId` definido no estado ou no `localStorage['dnm_familia_id']`, esse ID é retornado.
2. Se o usuário estiver autenticado e não possuir família explicitamente vinculada, retorna seu `usuario.uid`.
3. Elimina-se qualquer trava que force usuários não-Alex a serem ejetados de `familia-alex-gabi`.

### 2.3 Unificação dos Fluxos de Entrada (`entrarComCodigoFamilia` e `salvarFamiliaId`)
Ambos os pontos de entrada no app devem invocar o mesmo pipeline unificado de resolução e merge:
1. **Normalização do Código/ID:**
   - Se começar com `FAM-` (ou tiver 10 caracteres alfanuméricos com prefixo de convite): busca em `codigosFamilia/{codigo}` para resolver o `familiaId`.
   - Se for um ID direto (ex: `Mj5VkATiqNcxVi6wH4PLC5csnaE3` ou `familia-alex-gabi`): utiliza o valor diretamente como `familiaId`.
2. **Merge Inteligente (`mesclarDadosFamilia`):**
   - Nunca executa `Object.assign` cru;
   - Carrega os dados da família na nuvem;
   - Realiza o merge das entidades (gastos, receitas, dívidas, cartões, eventos, listas) evitando duplicidade de IDs;
   - Insere o usuário logado em `membrosPerfil` com seu nome, papel e avatar próprio;
   - Adiciona o UID do usuário ao array `membrosUids`;
   - Preserva o `S.membroAtivoId` da Gabi no aparelho da Gabi e do Alex no aparelho do Alex.
3. **Persistência Relacional:**
   - Atualiza `usuarios/{familiaId}` com os dados mesclados;
   - Atualiza `contas/{user.uid}` apontando para o `familiaId` compartilhado;
   - Salva em `localStorage`: `dnm_familia_id = familiaId` e `dnm_meu_membro_id = user.uid`.
4. **Reativação do Listener em Tempo Real:**
   - Cancela qualquer listener `onSnapshot` anterior;
   - Ativa `escutarSincronizacaoTempoReal()` escutando `usuarios/{familiaId}`.

### 2.4 Listener em Tempo Real Preservador de Identidade Local
No callback do `onSnapshot`:
```javascript
const meuMembroId = (fbUser ? fbUser.uid : null) || localStorage.getItem('dnm_meu_membro_id') || S.membroAtivoId;
Object.assign(S, dadosNuvem);
S.membroAtivoId = meuMembroId; // Garante que a identidade ativa do aparelho nunca é substituída pela do parceiro
```

---

## 3. Consequências

### Positivas
- **Fim do Erro de Permissões:** Gabi e outros membros convidados conseguem ler e ingressar na família sem rejeição de regras.
- **Identidades Preservadas:** Alex e Gabi mantêm seus próprios logins, avatares e nomes, visualizando os mesmos dados de gastos, contas e calendário.
- **Sincronização Bidirecional Fluida:** Alterações feitas pelo Alex aparecem instantaneamente no aparelho da Gabi e vice-versa.
- **Suporte Híbrido a Códigos:** Funciona tanto com convites `FAM-XXXXXX` quanto com IDs diretos de família colados manualmente.

### Riscos e Mitigações
- **Conflito de Concorrência ao Salvar:**
  *Mitigação:* `save()` utiliza debounce de 1500ms e `set(dataToSync, { merge: true })`.
- **Perda de Dados Locais na Entrada:**
  *Mitigação:* `mesclarDadosFamilia` cria backup em `dnm_backup_individual` antes de mesclar e consolida todas as coleções.
