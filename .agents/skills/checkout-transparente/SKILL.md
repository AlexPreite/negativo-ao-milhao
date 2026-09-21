---
name: checkout-transparente
description: Regras e fluxo para implementar checkout transparente, PIX, cartão tokenizado e webhook de pagamento em e-commerce brasileiro. Use ao trabalhar em qualquer código de pagamento, cobrança, gateway, Asaas, Mercado Pago, Pagar.me, Stripe, PIX ou webhook de transação.
---
# Checkout transparente

Requisito não-negociável: **o cliente nunca sai do domínio da loja**. Sem redirect, sem
página hospedada pelo gateway.

## Fluxo do cartão
1. Browser captura os dados e **tokeniza pelo SDK oficial do gateway**. Os dados vão do
   navegador direto ao gateway — o servidor nunca vê PAN nem CVV. É isso que mantém o
   projeto fora do escopo pesado de PCI-DSS.
2. Front envia ao back só `{ orderId, paymentToken, installments, payer }`.
3. Back **recalcula o total do zero** a partir do banco (itens, preços, frete, desconto).
   Qualquer valor vindo do cliente é descartado.
4. Back cria a cobrança com a chave secreta, com timeout e `try/catch`, e persiste a
   transação como `PENDING` **antes** de responder.
5. Resposta: aprovado, recusado (com motivo tratado) ou em análise.
6. **Webhook assinado é a fonte da verdade** do status final.

## Fluxo PIX
QR Code + copia-e-cola + expiração visível. Confirmação por webhook; o polling no front
(5s, com limite) é só UX. Ao expirar, liberar o estoque reservado.

## Webhook
- Validar assinatura HMAC. Sem assinatura válida → 401 e log de segurança.
- Idempotência por `event_id` em tabela de eventos: o gateway reenvia.
- Conferir o valor recebido contra o pedido antes de marcar como pago.
- Responder 2xx rápido; processar o pesado depois.
- Registrar toda transição em `OrderStatusHistory`.

## Estados
`PENDING_PAYMENT → PAID → PROCESSING → SHIPPED → DELIVERED`, com `CANCELED`, `REFUNDED`,
`PAYMENT_FAILED`, `IN_ANALYSIS`. Transição inválida é rejeitada no código.

## Antes de considerar pronto
Sandbox testado com cartão aprovado, recusado, sem fundos e em análise · PIX testado com
valor real baixo · antifraude do gateway ligado · chave de idempotência na criação da
cobrança (retry cego cobra duas vezes) · e-mail de confirmação só após `PAID` por webhook.
