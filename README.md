# AlgoRecall

AlgoRecall is a full-stack DSA revision tracker that helps you save solved problems, log recall confidence, and review your preparation through a visual analysis dashboard.

It includes:
- **Client**: React + Vite frontend (`/client`)
- **Server**: Express + Prisma + PostgreSQL API (`/server`)

## Screenshots of Application
<img width="1886" height="791" alt="image" src="https://github.com/user-attachments/assets/74fc40cc-4df8-4a01-a689-ac1b739c75c7" />
<img width="1919" height="659" alt="image" src="https://github.com/user-attachments/assets/dc4bb0a3-1b47-41c4-8b38-ea9172f0e232" />
<img width="1859" height="451" alt="image" src="https://github.com/user-attachments/assets/6809c717-fb05-4399-a761-443a09f4a509" />
<img width="1862" height="704" alt="image" src="https://github.com/user-attachments/assets/f76dfbc0-80f8-45bf-a6ab-0b2cbb322b1c" />
<img width="1794" height="409" alt="image" src="https://github.com/user-attachments/assets/4aa5b57a-ecfd-431d-985d-5fffe91d1b71" />
<img width="1220" height="687" alt="image" src="https://github.com/user-attachments/assets/d3c41253-62eb-4ad5-b86e-3b28840ae4c6" />


## Features

- Add, edit, and manage DSA problems
- Revision workflow with confidence logging (1-5)
- Scheduled revision queues (due and upcoming)
- Analysis dashboard with insights (difficulty split, weak/strong patterns, trend charts)

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL

## Project Structure

- `client/` → React app
- `server/` → Express API + Prisma schema

## Environment Setup

### 1) Server env (`server/.env`)

Create `server/.env` with:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/algorecall"
PORT=5000
```

### 2) Client env (optional, `client/.env`)

Only needed if your backend is not running on `http://localhost:5000`:

```env
VITE_API_BASE_URL="http://localhost:5000"
```

## Run Locally

### 1) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2) Initialize database (Prisma)

```bash
cd server
npm run prisma:generate
npm run prisma:push
```

### 3) Start backend

```bash
cd server
npm run dev
```

Backend runs on: `http://localhost:5000`

### 4) Start frontend

Open a second terminal:

```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Useful Endpoints

- Health: `GET /api/health`
- Swagger docs: `http://localhost:5000/api/docs`

## Scripts

### Client
- `npm run dev` → start Vite dev server
- `npm run build` → production build
- `npm run lint` → lint frontend

### Server
- `npm run dev` → start API with nodemon
- `npm run start` → start API in production mode
- `npm run prisma:generate` → generate Prisma client
- `npm run prisma:push` → sync schema to DB
