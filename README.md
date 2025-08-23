# OneVote (React + Vite • Node/Express • MySQL)

A minimal polling app:
- Create → redirects to Vote
- Vote → redirects to Results
- Results show running totals

## Prereqs
- Node 18+
- MySQL 8+

## 1) Database
```sql
source database.sql;
```

## 2) Backend
```bash
cd backend
cp .env.example .env   # set DB_* values
npm i
npm run dev            # http://localhost:5000
```

## 3) Frontend
```bash
cd frontend
npm i
# Optional: point to API if not localhost:5000
# echo 'VITE_API_URL="http://localhost:5000/api/polls"' > .env
npm run dev            # http://localhost:5173
```

## Notes
- Tables auto-create on first API call.
- CORS enabled for local dev.
- Tailwind is preconfigured.
