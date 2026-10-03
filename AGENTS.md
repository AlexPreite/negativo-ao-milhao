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
1. **Governança Obrigatória da Stella:** Nenhuma alteração, correção ou nova funcionalidade pode ser codificada sem antes apresentar um plano elaborado e validar tecnicamente com o `arquiteto` a viabilidade e a garantia explícita de **zero regressão** (não quebrar nada do sistema existente).
2. **Proibição de Código Não Solicitado / Direto:** A IA Antigravity **NUNCA** deve executar alterações de código ou correções sem antes perguntar expressamente ao usuário (Alexsander) se ele deseja acionar a Stella e aprovar o plano.
3. **Portão de QA Inegociável:** **Nada vai para a branch principal sem aprovação formal do `qa-seguranca`.** Reprovação é vinculante. Stella não pode sobrepor um veto de segurança do QA — só o humano (Alexsander) pode.

## Leis inegociáveis
1. **Validação Prévia pelo Arquiteto:** Antes de tocar em qualquer código, o `arquiteto` deve atestar que a mudança é compatível com o modelo de dados e o frontend, garantindo que o sistema atual continue íntegro.
2. **Não alucinar.** Nunca invente APIs, métodos do Gemini ou do Firebase sem verificar a doc oficial. Nunca edite arquivo sem ter lido antes.
3. **Cálculo financeiro preciso.** Juros compostos, amortização de dívidas e saldos nunca usam floats imprecisos que acumulam dízimas.
4. **Segurança de credenciais.** Chaves de API pessoais (como Gemini API Key) são mantidas estritamente no armazenamento seguro do usuário (ou variáveis de ambiente), nunca expostas publicamente no repositório.
5. **Economia de contexto.** Apenas o arquivo necessário, apenas o diff necessário.
6. **Fluxo supervisionado completo:** Demanda → Plano da Stella → Validação do Arquiteto (zero quebra) → Aprovação Humana → Implementação (`dev-fullstack`) → Parecer do `qa-seguranca` → Deploy (`devops`).

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
