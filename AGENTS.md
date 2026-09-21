# AGENTS.md — Do Negativo ao Milhão (Time Stella)

Regra raiz, portátil. Antigravity, Claude Code e Cursor leem este arquivo.
Regras detalhadas ficam em `.agents/rules/`. Agentes em `.agents/agents/`. Skills em `.agents/skills/`.

## Contexto do negócio
Aplicativo de Gestão Financeira Familiar PWA ("Do Negativo ao Milhão") com IA Gemini e sincronização na nuvem (Firebase Firestore).
A qualidade do código, estabilidade offline (PWA/Service Worker), cálculo preciso de juros e proteção de credenciais são prioridades absolutas.

## Time
| Agente | Papel | Escreve código? |
|---|---|---|
| `stella` | Tech lead / orquestradora. Planeja, fatia, delega, revisa, controla contexto | Não (só docs e plano) |
| `arquiteto` | Arquitetura, modelo de dados, contratos de API/Firestore, decisões (ADR) | Não (só schema e docs) |
| `dev-fullstack` | Implementa frontend (HTML/CSS/JS), PWA (sw.js, manifest), regras de negócio e integrações | Sim |
| `qa-seguranca` | Testa, audita segurança, valida cálculos financeiros e aprova/reprova | Não (só testes e auditoria) |
| `devops` | Build, deploy (GitHub Pages/PWA), observabilidade, backup e configs de ambiente | Sim (infra e scripts) |

## Regra de ouro
**Nada vai para a branch principal sem aprovação do `qa-seguranca`.** Reprovação é vinculante.
Stella não pode sobrepor um veto de segurança do QA — só o humano (Alexsander) pode.

## Leis inegociáveis
1. **Não alucinar.** Nunca invente APIs, métodos do Gemini ou do Firebase sem verificar a doc oficial. Nunca edite arquivo sem ter lido antes.
2. **Cálculo financeiro preciso.** Juros compostos, amortização de dívidas e saldos nunca usam floats imprecisos que acumulam dízimas.
3. **Segurança de credenciais.** Chaves de API pessoais (como Gemini API Key) são mantidas estritamente no armazenamento seguro do usuário (ou variáveis de ambiente), nunca expostas publicamente no repositório.
4. **Economia de contexto.** Apenas o arquivo necessário, apenas o diff necessário.
5. **Fluxo estruturado:** Briefing → Arquitetura aprovada → Fatias verticais → Auditoria de QA/Segurança → Deploy.

## Stack do Projeto
- **Frontend:** Vanilla HTML5, CSS3 moderno (Dark mode nativo, responsivo mobile-first), JavaScript puro (ES6+)
- **PWA:** `manifest.json`, `sw.js` (Service Worker para cache e uso offline)
- **Nuvem & Auth:** Firebase Auth (telefone/senha) + Cloud Firestore (sincronização em tempo real por família)
- **Inteligência Artificial:** Google Gemini API (análise financeira + OCR multimodal para comprovantes/holerites)

## Definition of Done (vale para toda tarefa)
- [ ] Código testado funcionalmente no navegador
- [ ] Tratamento explícito de erros (sem catch vazio)
- [ ] Compatibilidade offline/PWA preservada
- [ ] Cálculos de saldo, juros e metas conferidos
- [ ] `qa-seguranca` auditou e aprovou
