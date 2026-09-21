---
name: auditoria-seguranca
description: Roteiro de auditoria de segurança e testes de exploração para revisar código de aplicação web antes de aprovar merge ou deploy. Use ao revisar diff, auditar rota de API, validar autenticação, autorização, pagamento, upload ou antes de um go-live.
---
# Auditoria de segurança — roteiro de exploração

Não basta ler o código: **tente quebrar**. Cada item abaixo tem um teste concreto.

## 1. Dinheiro
- Alterar `price`/`total`/`shipping` no payload e enviar → servidor deve recalcular e ignorar.
- Cupom expirado, acima do limite de uso, abaixo do valor mínimo → deve rejeitar.
- Quantidade negativa ou fracionada → deve rejeitar.
- Dois pedidos simultâneos no último item → só um pode passar.

## 2. Autenticação e autorização
- Rota sem token → 401. Token expirado → 401. Token de outro usuário → 403.
- Trocar o ID na URL para o de outro cliente (IDOR) → 403/404, nunca o dado.
- Rota de admin com sessão de cliente comum → 403.
- Força bruta no login → rate limit deve bloquear.
- Mensagem de erro revela se o e-mail existe? → deve ser genérica.

## 3. Pagamento
- Webhook sem assinatura ou com assinatura inválida → rejeitado.
- Mesmo webhook enviado 2x → um único efeito (idempotência).
- Webhook com valor diferente do pedido → rejeitado e alertado.
- `grep` por PAN/CVV em log, banco e Sentry → nada.

## 4. Entrada
- Rota nova sem schema Zod → reprovar.
- Campo de texto com `<script>` e com payload SQL → escapado/parametrizado.
- Upload com extensão trocada (`.php.jpg`), arquivo gigante, MIME falso → rejeitado.

## 5. Exposição
- `grep -r "SECRET\|API_KEY\|sk_live" .next/` → nada no bundle do client.
- Erro em produção vazando stack trace ou query → não pode.
- Endpoint de debug, seed ou docs aberto em produção → reprovar.

## 6. Escala
Query N+1 · listagem sem paginação · coluna filtrada sem índice · chamada externa sem
timeout · trabalho pesado dentro do request.

## Veredito
APROVADO só quando **todos** os testes acima passaram ou não se aplicam (e o "não se aplica"
precisa ser justificado). Qualquer item de 1 a 3 falhando é bloqueador automático.
