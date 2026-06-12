# ⚽ Bolão Copa 2026

Sistema de bolão para palpites da Copa do Mundo entre amigos.

## 🚀 Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Firebase Auth + Firestore (Admin SDK para scripts)
- **API:** API-Football via RapidAPI (apenas nos scripts de sincronização)
- **Hospedagem:** Firebase Hosting
- **CI/Sync:** GitHub Actions (3×/dia)

## 📦 Estrutura

```
src/          → Frontend React (NUNCA chama API externa)
scripts/      → Scripts Node standalone (sync, import, seed)
.github/      → GitHub Actions workflow
├── firebase-admin.ts    → inicialização Admin SDK
├── sync.ts              → sincronização API → Firestore
├── seed-local.ts        → dados mockados para dev local
└── .github/workflows/sync.yml
```

## 🔄 Fluxo de Dados

```
API-Football (RapidAPI)
      ↓  (apenas via GitHub Actions, 3×/dia)
scripts/sync.ts
      ↓  (Admin SDK — ignora regras de segurança)
Firestore
      ↓  (onSnapshot — tempo real)
React App (NUNCA chama API)
```

## 🔧 Setup

### 1. Clonar e instalar

```bash
npm install
```

### 2. Configurar Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um projeto
3. Ative **Authentication** (método: e-mail/senha)
4. Ative **Cloud Firestore**
5. **Configurações do projeto > Seus apps > Web** → copie as credenciais

### 3. Variáveis de ambiente (frontend)

Copie `.env.example` para `.env` e preencha apenas as variáveis `VITE_*`:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

A variável `FOOTBALL_DATA_TOKEN` é usada apenas nos scripts e configurada como **GitHub Secret**.

### 4. Regras do Firestore

Copie `firestore.rules` para o Console do Firebase > Firestore > Regras.

### 5. Rodar local

```bash
npm run dev
```

## 🧪 Seed local (dados mockados)

Para testar sem API configurada:

```bash
export FIREBASE_SERVICE_ACCOUNT='{ ... }'  # service account JSON
npx tsx scripts/seed-local.ts
```

## 🌐 Deploy no Firebase Hosting

```bash
firebase login
firebase init          # selecione Hosting + Firestore, pasta: dist, SPA: sim
npm run build
firebase deploy
```

## ⚙️ Sincronização via GitHub Actions

Configurar **secrets** no repositório GitHub:

| Secret | Descrição |
|---|---|
| `FOOTBALL_DATA_TOKEN` | Token da Football-Data.org v4 |
| `FIREBASE_SERVICE_ACCOUNT` | JSON da service account do Firebase |

O workflow roda automaticamente às 06h, 12h e 18h BRT.

### Import inicial dos jogos

Para popular o banco pela primeira vez:

```bash
npm run sync:import
```

### Sync manual

```bash
npm run sync
```

## 📊 Pontuação

- **3 pontos**: placar exato
- **1 ponto**: vencedor/empate correto
- **0 pontos**: erro

A pontuação considera apenas os 90 minutos regulamentares (prorrogação e pênaltis não contam).

## 🔒 Segurança

- Rotas protegidas via `ProtectedRoute`
- Regras Firestore: cada usuário só edita próprios palpites
- Palpites bloqueados após início da partida
- API de futebol nunca exposta ao cliente

## 🖥️ Comandos

```bash
npm run dev      # servidor dev
npm run build    # build produção
npm run preview  # preview do build
```
