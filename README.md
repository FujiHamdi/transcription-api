# Transcription Job API

Built with:

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)

---

# Features

- Create transcription jobs
- Assign reporter
- Assign editor
- Update job workflow
- Calculate payments
- Store data in PostgreSQL

---

# Job Workflow

```txt
NEW
→ ASSIGNED
→ TRANSCRIBED
→ REVIEWED
→ COMPLETED
```

---

# Tech Stack

- Express.js
- TypeScript
- Prisma
- PostgreSQL
- Neon Database

---

# Installation

Clone repository:

```bash
git clone REPOSITORY_URL
```

Go to project folder:

```bash
cd transcription-api
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create `.env` file:

```env
DATABASE_URL="DATABASE_URL"
```

Example using Neon PostgreSQL:

```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
```

---

# Run Prisma Migration

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

---

# Run Project

Development mode:

```bash
npm run dev
```

Build project:

```bash
npm run build
```

Run production build:

```bash
npm start
```

---

# API Endpoints

## Create Job

```http
POST /jobs
```

Body:

```json
{
  "caseName": "Court Interview",
  "duration": 60,
  "city": "Jakarta",
  "jobType": "PHYSICAL"
}
```

---

## Assign Reporter

```http
PUT /jobs/:id/assign-reporter
```

---

## Mark Transcribed

```http
PUT /jobs/:id/transcribed
```

---

## Assign Editor

```http
PUT /jobs/:id/assign-editor
```

---

## Calculate Payment

```http
PUT /jobs/:id/calculate-payment
```

---

## Get All Jobs

```http
GET /jobs
```

---

# Payment Rules

- Reporter: 2000 IDR per minute
- Editor: 50000 IDR flat fee

---

# Project Structure

```txt
src/
├── controllers/
├── routes/
├── prisma.ts
└── server.ts
```

---

# Author

Fuji Hamdi