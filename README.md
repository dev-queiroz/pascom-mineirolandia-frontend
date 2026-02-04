# PASCOM Mineirolândia

**Sistema Pastoral da Comunicação** da Paróquia Nossa Senhora do Perpétuo Socorro – Mineirolândia/CE

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Neon Postgres](https://img.shields.io/badge/Neon-Postgres-00D4B4?style=for-the-badge&logo=neon&logoColor=white)](https://neon.tech/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> "A Eucaristia é a minha autoestrada para o céu." – São Carlo Acutis  
> **Evangelizando através da tecnologia e unindo corações para o Reino.**

Portal moderno e seguro para gestão da PASCOM: escalas de serviços, controle financeiro (dízimos/contribuições com comprovantes), administração de membros e área pública com identidade visual forte da paróquia.

## ✨ Funcionalidades Principais

### Área Pública (Home)
- Design imersivo com parallax, animações suaves (Framer Motion) e identidade visual católica
- Seções: Sobre a PASCOM, Padroeiro São Carlo Acutis (ciberapóstolo)
- Botão de login e compartilhamento rápido

### Autenticação & Painel Administrativo
- Login seguro (username + password)
- Área restrita para membros da PASCOM

### Módulos Principais
- **Escalas de Serviços**  
  Visualização mensal, inscrição em vagas, desistência com justificativa obrigatória, download .ics para calendário, convocação WhatsApp (admin)

- **Gestão Financeira**
  Envio de contribuições com comprovante (upload de imagem/PDF)  
  Histórico de pendências e status  
  Validação e exclusão por administradores (com visualização ampliada de comprovantes)

- **Administração** (exclusivo para admins)
    - Cadastro, edição, ativação/inativação e exclusão de membros
    - Criação, edição e exclusão de eventos/escalas
    - Dashboard com estatísticas (pendências financeiras, escalas do mês, saldo, usuários ativos, últimas justificativas)

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 15 (App Router), TypeScript, TanStack Query, Tailwind CSS, Framer Motion, Lucide Icons, Sonner (toasts)
- **UI Components**: shadcn/ui (Button, Input, AlertDialog, etc.)
- **Autenticação & Estado**: Custom hooks (useAuth, useFinancial, useEvents...)
- **Banco de Dados**: Neon/PostgreSQL (ou similar – ajuste conforme seu setup)
- **Outros**: Zod (validação), date-fns, react-hook-form

## 📋 Pré-requisitos

- Node.js ≥ 18
- npm / pnpm / yarn
- Banco de dados PostgreSQL (Neon recomendado)
- Variáveis de ambiente configuradas (veja abaixo)

## 🛠️ Instalação e Execução Local

1. Clone o repositório
   ```bash
   git clone https://github.com/SEU-USUARIO/pascom-mineirolandia.git
   cd pascom-mineirolandia
   ```

2. Instale as dependências
   ```bash
   npm install
   ```
   
3. Configure as variáveis de ambiente
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
    ```
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Execute as migrações do banco de dados
   ```bash
   npx prisma migrate dev --name init
   ```
   
5. Gere o cliente Prisma
   ```bash
   npx prisma generate
   ```
   
6. Inicie o servidor de desenvolvimento
   ```bash
    npm run dev
   ```
   
7. Acesse o aplicativo em `http://localhost:3000`

[//]: # (🌐 Deploy no Vercel &#40;Recomendado&#41;)

[//]: # ()
[//]: # (Conecte o repositório GitHub ao Vercel &#40;ou importe direto&#41;)

[//]: # (No painel do projeto Vercel → Settings → Environment Variables:)

[//]: # (Adicione DATABASE_URL com a string completa do Neon &#40;não exponha como NEXT_PUBLIC_ – mantenha server-side&#41;)

[//]: # ()
[//]: # (Deploy automático em cada push na main)

[//]: # (Vercel cuida de preview branches, serverless functions e otimização Next.js)

[//]: # ()
[//]: # (Nota: Neon escala automaticamente &#40;scale-to-zero incluso no plano free/hobby&#41;, ideal para projetos paroquiais com tráfego variável.)

[//]: # (🛡️ Estrutura de Pastas &#40;visão resumida&#41;)

[//]: # (textapp/                  → rotas &#40;home, login, admin/...&#41;)

[//]: # (components/           → ui &#40;shadcn&#41;, layout &#40;Sidebar, Header&#41;, common)

[//]: # (hooks/                → useAuth, useEvents, useFinancial...)

[//]: # (lib/                  → auth, utils, services)

[//]: # (services/             → API calls &#40;extrasService, dashboardService...&#41;)

[//]: # (types/                → interfaces &#40;User, Event, Contribution...&#41;)

[//]: # (public/assets/        → brasão, imagens da paróquia)

[//]: # (🙏 Contribuição)

[//]: # (Este projeto é mantido pela PASCOM Mineirolândia e voluntários.)

[//]: # (Quer ajudar?)

[//]: # ()
[//]: # (Reporte bugs → Issues)

[//]: # (Sugira melhorias → Pull Requests)

[//]: # (Doe tempo ou recursos para manutenção)

[//]: # ()
[//]: # (Toda contribuição é para a maior glória de Deus &#40;Ad Maiorem Dei Gloriam&#41;.)

[//]: # (📄 Licença)

[//]: # (MIT License – veja o arquivo LICENSE para detalhes.)

[//]: # ()
[//]: # (Paróquia Nossa Senhora do Perpétuo Socorro)

[//]: # (Mineirolândia – Ceará)

[//]: # (© 2026 – Construído com amor e tecnologia para a missão evangelizadora.)

[//]: # (text)


[//]: # (Coloque a parte comentada de forma bonita abaixo)
## 🌐 Deploy no Vercel (Recomendado)

1. Conecte o repositório GitHub ao Vercel (ou importe direto)
2. No painel do projeto Vercel → Settings → Environment Variables:
   - Adicione `DATABASE_URL` com a string completa do Neon (não exponha como `NEXT_PUBLIC_` – mantenha server-side)
3. Deploy automático em cada push na `main`
4. Vercel cuida de preview branches, serverless functions e otimização Next.js

**Nota**: Neon escala automaticamente (scale-to-zero incluso no plano free/hobby), ideal para projetos paroquiais com tráfego variável.

## 🛡️ Estrutura de Pastas (visão resumida)
```
app/                  → rotas (home, login, admin/...)
components/           → ui (shadcn), layout (Sidebar, Header), common
hooks/                → useAuth, useEvents, useFinancial...
lib/                  → auth, utils, services
services/             → API calls (extrasService, dashboardService...)
types/                → interfaces (User, Event, Contribution...)
public/assets/        → brasão, imagens da paróquia
```

## 🙏 Contribuição
Este projeto é mantido pela PASCOM Mineirolândia e voluntários.
Quer ajudar?
- Reporte bugs → Issues
- Sugira melhorias → Pull Requests
- Doe tempo ou recursos para manutenção 

Toda contribuição é para a maior glória de Deus (*Ad Maiorem Dei Gloriam*).

## 📄 Licença
MIT License – veja o arquivo LICENSE para detalhes.

**Paróquia Nossa Senhora do Perpétuo Socorro**
Mineirolândia – Ceará

© 2026 – Construído com amor e tecnologia para a missão evangelizadora.