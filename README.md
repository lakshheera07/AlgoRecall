# AlgoRecall

AlgoRecall is a full-stack DSA revision tracker that helps you save solved problems, log recall confidence, and review your preparation through a visual analysis dashboard.

It includes:
- **Client**: React + Vite frontend (`/client`)
- **Server**: Express + Prisma + PostgreSQL API (`/server`)

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
