# MeritMap

**India's smartest college finder** — a full-stack web application that helps students discover, compare, and shortlist Indian colleges based on entrance exam ranks, fees, placement data, and more.

---

## Features

- **College Explorer** — Browse and filter colleges by state, type (Government / Private / Deemed), max fees, course, and keyword search. Sort by rating, fees, or placement percentage.
- **College Detail Pages** — View in-depth information including placement stats, average/highest packages, courses offered, and user reviews.
- **Rank Predictor** — Enter an entrance exam (JEE, BITSAT, MHT-CET, KCET, TANCET) and rank to get a list of colleges you're likely to be admitted to.
- **Side-by-Side Comparison** — Select up to 3 colleges and compare them across fees, rating, placement, and more.
- **Saved Colleges** — Authenticated users can bookmark colleges for later reference.
- **Auth** — JWT-based registration and login system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |

---

## Project Structure

```
MeritMap/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers (auth, colleges, saved)
│   │   ├── db/
│   │   │   ├── client.ts     # PostgreSQL pool
│   │   │   ├── schema.sql    # Table definitions
│   │   │   └── seed.ts       # Seed data
│   │   ├── middleware/       # JWT auth middleware
│   │   ├── routes/           # Express routers
│   │   └── index.ts          # App entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/
    │   ├── auth/             # Login & register pages
    │   ├── colleges/         # College list & detail pages
    │   ├── compare/          # Side-by-side comparison page
    │   ├── predict/          # Rank predictor page
    │   ├── saved/            # Saved colleges page
    │   └── page.tsx          # Landing page
    ├── components/           # Reusable UI components
    ├── context/              # Auth and Compare context providers
    ├── lib/                  # API client, types, auth helpers
    ├── .env.local.example
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repository

```bash
git clone https://github.com/your-username/MeritMap.git
cd MeritMap
```

### 2. Set up the database

```bash
# Create the database
createdb meritmap

# Run the schema
psql -d meritmap -f backend/src/db/schema.sql
```

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/meritmap
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:3000
```

Generate a secure `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Install backend dependencies and seed data

```bash
cd backend
npm install
npm run seed    # Populate colleges table with sample data
npm run dev     # Starts on http://localhost:4000
```

### 5. Configure the frontend

```bash
cd frontend
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 6. Install frontend dependencies and start

```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:3000
```

---

## API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive a JWT |

### Colleges

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/colleges` | List colleges with filters and pagination |
| `GET` | `/api/colleges/:id` | Get a single college with reviews |
| `GET` | `/api/colleges/states` | List all available states |
| `GET` | `/api/colleges/predict?exam=JEE&rank=5000` | Predict colleges by exam rank |

**College query params:** `search`, `state`, `type`, `fees_max`, `course`, `page`, `limit`, `sort` (`rating` | `fees_min` | `placement_percent` | `name`), `order` (`asc` | `desc`)

### Compare

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/compare` | Compare 2–3 colleges by ID |

### Saved (requires auth)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/saved` | Get the current user's saved colleges |
| `POST` | `/api/saved` | Save a college |
| `DELETE` | `/api/saved/:id` | Remove a saved college |

---

## Available Scripts

**Backend**

```bash
npm run dev      # Development server with hot reload
npm run build    # Compile TypeScript
npm run start    # Run compiled output
npm run seed     # Seed the database
```

**Frontend**

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint
```

---

## Deployment

The app is designed to deploy easily on **Railway** or **Render**.

1. Push backend and frontend as separate services.
2. Set the environment variables in your hosting dashboard (same keys as `.env.example` / `.env.local.example`).
3. Update `FRONTEND_URL` in the backend to your deployed frontend URL, and `NEXT_PUBLIC_API_URL` in the frontend to your deployed backend URL.
4. Run `npm run seed` once against the production database to populate college data.

---

## License

ISC