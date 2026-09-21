# 05 — Operação no Antigravity

## Onde cada coisa mora
| O quê | Caminho | Quando carrega |
|---|---|---|
| Regras do projeto | `AGENTS.md` (raiz) e `.agents/rules/*.md` | Sempre |
| Regras globais da máquina | `~/.gemini/GEMINI.md` | Sempre, em todo workspace |
| Agentes nomeados | `.agents/agents/<nome>/agent.md` | Ao invocar o agente |
| Skills | `.agents/skills/<pasta>/SKILL.md` | Sob demanda (progressive disclosure) |

⚠️ **Limite de 12.000 caracteres por arquivo de regra.** Passou disso, o resto é ignorado
silenciosamente — por isso as regras estão fatiadas. Ao editar, confira o tamanho.

⚠️ Antigravity muda de versão rápido. Se `/agents` não listar o agente, confirme o caminho
esperado na versão instalada antes de reescrever o conteúdo — o problema costuma ser o
diretório, não o texto.

## Configuração recomendada (Settings → Agent)
- **Agent Non-Workspace File Access: OFF.** O agente não precisa sair do repositório.
- **Terminal Command Auto Execution: Request Review** até o time estar calibrado. Depois,
  no máximo "Always Proceed" com denylist cobrindo `rm -rf`, `git push --force`,
  `prisma migrate reset`, `DROP`, `curl | sh`.
- MCP: conceda só o que a função exige. Subagente de QA não precisa de acesso de escrita.

## Skills vs Regras vs Workflow
- **Regra** = verdade permanente (padrão de código, segurança). Sempre no contexto.
- **Skill** = capacidade consultada quando o assunto aparece (checkout, auditoria). Economiza
  contexto: o agente vê só nome e descrição até precisar.
- **Workflow** = sequência de passos repetível (deploy, release).
Instrução passo a passo em arquivo de regra é desperdício — vira Skill ou Workflow.

## Higiene de sessão
- Uma sessão por fatia vertical. Terminou a fatia, abra sessão nova.
- Sempre que a Stella encerrar uma fatia, ela grava o estado em `docs/ESTADO.md`
  (o que existe, o que falta, decisões tomadas) — é o que permite retomar sem reler o repo.
- Commit pequeno e frequente, mensagem descrevendo o porquê.
