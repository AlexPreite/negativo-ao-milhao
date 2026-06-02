# Do Negativo ao Milhão 📈

Seu agente financeiro pessoal com IA integrada ao Google Drive.

## 🚀 Funcionalidades

- **Rastreamento financeiro**: Receitas, gastos, dívidas e metas
- **Agente IA (Gemini)**: Análise de finanças e recomendações em tempo real
- **Sincronização Google Drive**: Salve seus dados na nuvem automaticamente
- **PWA**: Funciona offline e pode ser instalado como app
- **Interface dark mode**: Design elegante e responsivo

## ⚙️ Configuração

### 1. GitHub Pages
A app está hospedada em GitHub Pages. Apenas faça push para `main` que fica online automaticamente.

### 2. Google Drive Integration

1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Ative a **Google Drive API**
3. Crie uma credencial **OAuth 2.0 (Web application)**
4. Copie o **Client ID**
5. Em `app.js`, substitua `YOUR_GOOGLE_CLIENT_ID` pelo seu Client ID

### 3. Gemini API

1. Crie uma API Key em [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Na app, vá para **Config** e cole a chave

## 📦 Estrutura

```
.
├── index.html      # App principal
├── app.js          # Lógica da app + Google Drive
├── manifest.json   # PWA manifest
├── sw.js           # Service Worker (offline)
└── icons/          # Ícones PWA (adicione depois)
```

## 🔄 Como funciona

1. **LocalStorage**: Dados salvos localmente no navegador
2. **Google Drive**: Sincronize manualmente em Configurações
3. **Offline**: PWA funciona offline com Service Worker

## 📱 Instalação

### iOS (Safari)
1. Abra a URL
2. Toque em **Compartilhar** → **Adicionar à Tela de Início**

### Android (Chrome)
1. Abra a URL
2. Menu → **Instalar app**

## 🛠️ Desenvolvimento

Para desenvolver localmente:

```bash
python -m http.server 8000
# Acesse http://localhost:8000
```

## 📝 TODO

- [ ] Adicionar ícones PWA (192x512)
- [ ] Backup automático no Drive
- [ ] Exportar relatórios (PDF)
- [ ] Suporte a múltiplos usuários
- [ ] Tema claro

## 📄 Licença

MIT - Use livremente!
