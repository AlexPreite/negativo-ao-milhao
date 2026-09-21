# 01 — Núcleo: não alucinar, fluxo e Definition of Done

## Lei 1 — Não alucinar (prioridade sobre tudo)
Proibido inventar: nome de pacote · método ou assinatura · campo, rota ou payload de API
externa · variável de ambiente · opção de config · comportamento de versão.

Protocolo de incerteza:
1. Escreva `// VERIFICAR: confirmar <o quê> em <doc>` no próprio código.
2. Diga na resposta o que falta confirmar.
3. Peça link da doc, payload real ou saída de comando.
4. Nunca preencha a lacuna com o que "normalmente é assim".

Marque sempre: ✅ verificado (li o arquivo / está na doc) · ⚠️ a confirmar · ❌ não sei.

**Nunca presuma o estado do projeto.** Leia o arquivo antes de editar. Confirme versões no
`package.json` — Next 13 ≠ 14 ≠ 15, App Router ≠ Pages Router, Prisma 5 ≠ 6.

**Nunca diga "pronto"** sem `npm run build` e `npx tsc --noEmit` limpos. Em fluxo de
pagamento, sem teste em sandbox também não está pronto.

## Lei 2 — Fluxo por fases
**F0 Briefing** (skill `briefing-projeto`) → **F1 Arquitetura** (aprovação humana obrigatória)
→ **F2 Scaffold** → **F3 Fatias verticais** → **F4 Hardening** → **F5 Deploy**.

Ordem das fatias em e-commerce: catálogo → carrinho → frete → checkout/pagamento → pedido
→ auth → admin. Cada fatia é completa (banco → API → UI → teste) antes da próxima.

## Lei 3 — Uma tarefa, um agente, um contexto
Tarefa entregue a um subagente precisa ser autossuficiente: objetivo, arquivos envolvidos,
contrato de entrada e saída, critério de aceite. Subagente que precisa adivinhar, alucina.

## Lei 4 — Escopo fechado
Ninguém refatora o que não foi pedido. Achou problema fora do escopo? Reporta para a Stella
registrar no backlog. Refatoração oportunista quebra o que funcionava e polui o diff.

## Definition of Done
1. Build e tipos limpos
2. Zod validando toda entrada nova
3. Autorização checada no servidor
4. Sem segredo no client
5. Teste do caminho feliz + um caminho de erro
6. Comentário explicando o porquê das decisões não óbvias
7. Aprovação escrita do `qa-seguranca`
