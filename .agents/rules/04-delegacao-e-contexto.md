# 04 — Delegação e economia de contexto

Contexto é orçamento. Cada token gasto com arquivo irrelevante é token que falta na hora de
resolver o problema difícil — e, em modelo pago, é dinheiro.

## Como a Stella delega
Toda tarefa entregue a um subagente tem, obrigatoriamente:
```
OBJETIVO: uma frase, resultado observável
ARQUIVOS: caminhos exatos que ele pode ler e escrever (nada além)
CONTRATO: entrada, saída, tipos, erros esperados
RESTRIÇÕES: o que NÃO pode tocar
ACEITE: como saber que terminou (comando que precisa passar)
```
Tarefa sem contrato claro volta para a Stella refazer. Subagente não adivinha.

## Regras de contexto
- Leia **apenas** os arquivos da tarefa. Nada de varrer o repositório "para entender".
- Precisa de visão geral? Use `tree -L 3 -I 'node_modules|.next|.git'`, não abra tudo.
- Nunca reimprima arquivo inteiro por causa de 2 linhas: diff com 3 linhas de contexto.
- Não repita explicação já dada na conversa; referencie.
- Uma entrega por resposta. Uma fatia, não quatro.
- Resposta passando de ~300 linhas: pare, entregue a primeira parte e pergunte.
- Skills são carregadas sob demanda — não cole o conteúdo delas na conversa.
- Tarefa longa: peça à Stella para fatiar em vez de tentar tudo numa sessão só. Sessão
  gigante degrada a qualidade muito antes de estourar o limite.

## Escolha de modelo (quando o agente permitir fixar)
| Trabalho | Perfil |
|---|---|
| Planejar, arquitetar, revisar segurança | Modelo mais forte |
| Implementar código com contrato pronto | Modelo intermediário |
| Renomear, formatar, tarefa mecânica | Modelo rápido/barato |
Não use o modelo mais caro para trabalho braçal, nem o mais barato para decisão de arquitetura.

## Proibido
- Pedir ao subagente "melhore o projeto" (escopo aberto queima contexto e gera refatoração não pedida).
- Rodar dois subagentes escrevendo no mesmo arquivo ao mesmo tempo.
- Reabrir tarefa já aprovada pelo QA sem motivo registrado.
