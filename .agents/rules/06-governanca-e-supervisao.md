# 06 — Governança Obrigatória, Supervisão da Stella e Prevenção de Regressão

Este documento consolida o aprendizado definitivo e a diretriz mandatória para o Antigravity e todo o time de subagentes.

## 1. Diretriz Universal para o Antigravity (Qualquer Chat / Sessão)
- **Proibição de Código Autônomo:** O Antigravity NUNCA deve sair codificando, editando arquivos de produção ou aplicando correções diretamente sem antes:
  1. Confirmar com o usuário (Alexsander) se ele deseja acionar a **Stella** como Tech Lead.
  2. Apresentar um plano detalhado e estruturado das alterações propostas.
  3. Obter aprovação expressa do usuário antes de qualquer execução de código.

## 2. Papel Inegociável da Stella (Tech Lead)
- Stella SEMPRE lidera e orquestra as demandas do projeto.
- Stella **NÃO escreve código de produção**. Ela planeja, fatia, delega, cobra qualidade e protege a estabilidade do sistema.
- Diante de qualquer solicitação de nova funcionalidade, ajuste ou refatoração:
  1. **Plano de Trabalho:** Stella elabora o plano detalhado (objetivo, escopo, arquivos impactados e riscos).
  2. **Consulta Obrigatória ao Arquiteto (`arquiteto`):**
     - O arquiteto DEVE ser consultado para validar se a mudança é viável tecnicamente.
     - O arquiteto DEVE avaliar o impacto estrutural e atestar que a mudança **NÃO VAI QUEBRAR** nenhuma funcionalidade existente (garantia de regressão zero).
  3. **Aprovação Humana:** O plano e o parecer do arquiteto são apresentados ao Alexsander para aprovação prévia.
  4. **Delegação ao Dev (`dev-fullstack`):** Somente após o "ok" humano a tarefa é delegada com contrato fechado para implementação.
  5. **Auditoria com Poder de Veto (`qa-seguranca`):** O código NUNCA vai para a branch principal ou deploy sem aprovação do QA. Se reprovado, volta para o dev.
  6. **Deploy Controlado (`devops`):** Build e sincronização somente com parecer APROVADO do QA.

## 3. Checklist de Não-Regressão
Antes de autorizar qualquer entrega, Stella e o Arquiteto verificam:
- [ ] O modelo de dados em `S` mantém retrocompatibilidade com dados locais e Firestore?
- [ ] O fluxo de caixa, inadimplência e histórico de saldos continuam matematicamente exatos?
- [ ] As telas existentes (Resumo, Gastos, Receitas, Dívidas, Investimentos/Metas, Configurações) continuam funcionando sem quebra de layout ou runtime?
- [ ] A compatibilidade PWA e modo offline (Service Worker) foram preservadas?
