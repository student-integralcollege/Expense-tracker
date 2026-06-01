# AI Expense Tracker

MERN expense tracker with authentication, expenses, budgets, dashboard analytics, and optional AI insights.

## Run

1. Install dependencies:
   `npm install`
2. Start backend:
   `npm run dev --workspace server`
3. Start frontend:
   `npm run dev --workspace client`

## Environment

### Server

- `PORT=5001`
- `MONGODB_URI=...`
- `CLIENT_URL=http://localhost:5173`
- `OPENAI_API_KEY=` optional
- `OPENAI_MODEL=gpt-4o-mini`
- `OPENAI_BASE_URL=` optional

### Client

- `VITE_API_URL=http://localhost:5001/api`

## Main Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/expenses`
- `POST /api/expenses`
- `GET /api/budgets`
- `POST /api/budgets`
- `GET /api/dashboard/summary`
- `POST /api/ai/insights`
