# 03 — Stack, padrões de código e comentários

## Stack padrão (custo inicial zero, migração fácil)
Next.js 14+ App Router + TypeScript strict · Tailwind + shadcn/ui · PostgreSQL
(Supabase/Neon) · Prisma · Zod · Auth.js ou JWT próprio · Asaas/Mercado Pago/Pagar.me ·
Resend · Vercel · Sentry · Upstash (rate limit).
Desvio da stack exige justificativa escrita e aprovação do humano.

**Anti-lock-in (obrigatório):** nenhum SDK de terceiro é chamado direto na regra de negócio.
Tudo passa por `src/lib/integrations/<servico>/` com interface própria
(`client.ts` · `types.ts` · `mapper.ts` · `index.ts`). Trocar de gateway = novo adapter,
não refatorar a loja.

**Antes de instalar qualquer dependência:** dá para resolver com o que já existe? tem
manutenção ativa? qual o peso no bundle? qual a licença? Sem as 4 respostas, não instala.

## Estrutura
```
src/
  app/            rotas (App Router) — (shop)/ (admin)/ api/
  components/     ui/ (shadcn) + <dominio>/
  lib/            db.ts · auth/ · integrations/ · validations/ · utils/
  hooks/  types/
prisma/schema.prisma
tests/
```

## Padrões
- `strict: true`, **zero `any`** (exceção exige comentário justificando).
- Zod em toda rota e formulário; tipo derivado com `z.infer`, nunca duplicado à mão.
- Código em inglês; comentários e UI em pt-BR.
- Arquivos `kebab-case` · Componentes `PascalCase` · Constantes `UPPER_SNAKE_CASE`.
- Server Components por padrão; `"use client"` só com interatividade real.
- Sem `catch {}` vazio. Erro é tratado, logado ou propagado.
- Arquivo acima de ~300 linhas: quebrar.
- Caminho completo do arquivo acima de cada bloco de código.

## Comentários — explique o PORQUÊ
```ts
// ✅ Total recalculado a partir do preço do banco, nunca do payload do front:
// o corpo da requisição é editável pelo cliente e é o vetor nº 1 de fraude.
// Centavos em inteiro para evitar erro de ponto flutuante (0.1 + 0.2 !== 0.3).
const totalInCents = items.reduce((s, i) => s + i.priceInCents * i.qty, 0);
```
Comentário obrigatório em: regra de negócio, decisão de segurança, workaround, constante
mágica, trecho contraintuitivo, limite de API externa.

JSDoc em toda função exportada: propósito, `@param`, `@returns`, `@throws`, `@security`
quando envolver segredo, sessão ou dinheiro.

## Testes (responsabilidade do QA, escritos junto da feature)
- Unitário: cálculo de preço, frete, desconto, regra de estoque, validação Zod.
- Integração: rota de API com auth válida, inválida e ausente.
- E2E (Playwright): fluxo de compra completo.
- Sempre um teste de caminho triste: valor adulterado, pedido de outro usuário, webhook
  sem assinatura, cupom expirado.
