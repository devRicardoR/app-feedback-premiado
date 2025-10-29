# App Feedback Premiado

Projeto pessoal idealizado e desenvolvido por Ricardo Cesar Ramos.

## Visão Geral

Este projeto é resultado de uma ideia original, desenvolvida como projeto próprio. Trata-se de uma solução inovadora, integrando funcionalidades de fidelização, tarefas, recompensas e feedbacks entre empresas e clientes, de forma prática e visualmente padronizada.

Agora o projeto conta com três aplicações:

- Backend: API REST com Node.js/Express
- Frontend Web: interface web em React.js
- Frontend Mobile: app mobile em React Native (Expo Router)

## Tecnologias Utilizadas

Backend:
- Node.js / Express
- MongoDB Atlas
- Mongoose
- JSON Web Token (jsonwebtoken)
- Bcrypt.js
- Multer (para upload de arquivos)
- Cors
- Dotenv
- Nodemon (devDependency)

Frontend Web:
- React.js
- Tailwind CSS

Frontend Mobile:
- React Native
- Expo Router
- TypeScript
- React Navigation
- Axios

## Funcionalidades

- Cadastro e autenticação para empresas e clientes
- Painel personalizado para cada perfil de usuário
- Upload e gerenciamento de imagens e arquivos
- Sistema de programas de fidelização com regras e benefícios configuráveis
- Ranking e tarefas para engajamento dos clientes
- Carimbos e prints quando tarefa realizada

## Estrutura do Projeto

app-feedback-premiado/
├─ backend/ # API REST
├─ frontend/ # Web em React.js
└─ feedback-premiado-mobile/ # App mobile React Native

## Instruções de Uso
1. Clone o repositório:  
   ```bash
   git clone https://github.com/devRicardoR/app-feedback-premiado.git
   cd app-feedback-premiado
Backend: 
cd backend
npm install
npm run dev

Frontend Mobile (React Native):
cd feedback-premiado-mobile
npm install
npx expo start

Frontend Web:
cd frontend
npm install
npm run dev

Configure as variáveis de ambiente necessárias (como MONGO_URI, API URL, etc.)

Observações:
Projeto foi feito e entregue ao professor Douglas de React e React Native, da faculdade Estácio e esta em desenvolvimento contínuo sugestões e contribuições são bem-vindas



Desenvolvido por Ricardo Cesar Ramos.
