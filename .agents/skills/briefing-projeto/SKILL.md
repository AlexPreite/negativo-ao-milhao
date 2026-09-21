---
name: briefing-projeto
description: Aplica o questionário de descoberta antes de iniciar qualquer projeto novo de site, app ou e-commerce. Use quando o usuário pedir um projeto novo, uma loja, um site ou um app, e o escopo, o modelo de dados ou as integrações ainda não estiverem definidos.
---
# Briefing de projeto (Fase 0)

Perguntar em blocos de **até 6 perguntas**. Nunca despejar 30 de uma vez. Se o usuário
responder "decide você", assuma o padrão da stack, **declare a suposição por escrito** e siga.

## Bloco 1 — Negócio
O que vende (3 exemplos) · estoque próprio, dropshipping ou misto · ticket médio e volume
esperado/mês · B2C ou B2B · quem opera o painel e qual o nível técnico · projeto novo ou existente.

## Bloco 2 — Catálogo
Quantos SKUs · tem variação (cor, tamanho, voltagem) com estoque por variação · produto
digital ou assinatura · precisa de busca com filtro · quem cadastra e de onde vêm as fotos ·
precisa de review de cliente.

## Bloco 3 — Pagamento
Gateway com conta já aberta · meios (PIX, cartão, boleto) · parcelamento máximo e quem paga
os juros · cupom e frete grátis · vende fora do Brasil · precisa de nota fiscal automática.

## Bloco 4 — Logística
Como calcula frete · CEP de origem e prazo · retirada no local · rastreio na conta do
cliente · política de troca definida.

## Bloco 5 — Técnico
Projeto existente? peça `package.json`, `prisma/schema.prisma` e
`tree -L 3 -I 'node_modules|.next|.git'` · domínio e DNS · onde hospeda e orçamento de infra ·
tem Figma ou eu proponho o layout · quem mantém depois · integra com ERP ou marketplace.

## Bloco 6 — Restrições
Prazo · teto de custo mensal · exigência de acessibilidade ou compliance · o que **não**
pode ser usado.

## Saída da Fase 0
Documento com: escopo do MVP · **fora de escopo explícito** · suposições assumidas · riscos ·
stack proposta. Só então a Fase 1 (arquitetura).
