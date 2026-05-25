# DevOps LMS

A production-style DevOps learning platform built with Next.js and TypeScript.

This project provides structured tracks, modules, and lessons for modern engineering topics (Linux, Git, CI/CD, Docker, Terraform, AWS, Kubernetes, DevSecOps, and more) with profile-based progress tracking, lesson notes, tasks, and in-app search.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Run with Docker](#run-with-docker)
- [Database and Prisma](#database-and-prisma)
- [Available Scripts](#available-scripts)
- [How Content Is Organized](#how-content-is-organized)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)
- [Roadmap Ideas](#roadmap-ideas)
- [Contributing](#contributing)

## Overview

DevOps LMS is designed as a focused self-learning experience:

- 20 curated tracks from beginner to advanced topics.
- Lesson-first learning with module grouping and exams.
- Multi-profile learning context.
- Search API for quickly finding lessons.
- Fast local development and portable production deployment.

The app currently uses browser storage for user-facing progress and notes state, while Prisma schema and generated client are included for persistent backend-ready expansion.

## Key Features

- 20 learning tracks across DevOps and software engineering domains.
- Track and lesson progression per profile.
- Module-level lesson flow with previous/next navigation.
- Notes support per lesson.
- Search endpoint for lesson discovery.
- Responsive UI with reusable component primitives.
- Theme support and polished dashboard UX.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Prisma 6 (schema + client generation)
- SQLite (configured datasource)
- Radix UI primitives
- Framer Motion
- ESLint 9

## Project Structure

```text
.
|-- app/
|   |-- api/search/route.ts          # Search endpoint
|   |-- tracks/[trackId]/...         # Track/module/lesson routes
|   |-- layout.tsx                   # Root app layout and providers
|   `-- page.tsx                     # Dashboard/home page
|-- components/
|   |-- layout/                      # App shell, nav, sidebar, search dialog
|   |-- lesson/                      # Lesson UI blocks, quiz, notes panel
|   `-- ui/                          # Reusable UI primitives
|-- lib/
|   |-- content/                     # All track/module/lesson definitions
|   |-- hooks/                       # useProfile, useProgress, useNotes, etc.
|   `-- utils.ts
|-- prisma/
|   |-- schema.prisma
|   `-- migrations/
|-- public/
|   `-- screenshots/
|-- Dockerfile
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Atharv1906/DEVOPS_Notes.git
cd DEVOPS_Notes
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
```

### 4. Start development server

```bash
npm run dev
```

Open http://localhost:3000

### 5. Create a production build (optional)

```bash
npm run build
npm run start
```

## Environment Variables

The project reads environment values via Prisma config and Next runtime.

Required:

- `DATABASE_URL`: SQLite URL for Prisma datasource.

Example:

```env
DATABASE_URL="file:./dev.db"
```

## Run with Docker

The repository includes a multi-stage `Dockerfile` using standalone Next.js output.

### Build image

```bash
docker build -t devops-lms .
```

### Run container

```bash
docker run --rm -p 3000:3000 devops-lms
```

Open http://localhost:3000

### Run detached

```bash
docker run -d --name devops-lms -p 3000:3000 devops-lms
```

Stop later:

```bash
docker stop devops-lms
```

## Database and Prisma

Prisma schema is present with models:

- `Profile`
- `Progress`
- `Bookmark`

Current user-facing hooks (`useProfile`, `useProgress`, `useNotes`) store data in `localStorage`.

If you want to initialize the SQLite database for backend work:

```bash
npx prisma migrate dev
npx prisma generate
```

To inspect data:

```bash
npx prisma studio
```

## Available Scripts

From `package.json`:

- `npm run dev` - Start development server.
- `npm run build` - Create production build.
- `npm run start` - Start production server.
- `npm run lint` - Run ESLint.

## How Content Is Organized

All learning content is defined in TypeScript under `lib/content/`.

- Each track is defined in a dedicated file (for example `linux.ts`, `docker.ts`, `kubernetes.ts`).
- `lib/content/index.ts` exports the final ordered `tracks` array.
- Search results are served by `app/api/search/route.ts` using `searchLessons()`.

To add a new track:

1. Add a new track file in `lib/content/`.
2. Export/import it in `lib/content/index.ts`.
3. Ensure ids are unique and routing-safe.

## Screenshots

### Dashboard

![Dashboard](public/screenshots/dashboard.png)

### Track View

![Track](public/screenshots/track.png)

### Lesson View

![Lesson](public/screenshots/lesson.png)

## Troubleshooting

### Remote add fails with "remote origin already exists"

Use:

```bash
git remote set-url origin https://github.com/Atharv1906/DEVOPS_Notes.git
```

### Port 3000 already in use

Use a different port:

```bash
npm run dev -- -p 3001
```

### Prisma complains about DATABASE_URL

Ensure `.env` exists in project root and includes:

```env
DATABASE_URL="file:./dev.db"
```

### Docker build fails

- Ensure Docker Desktop/Engine is running.
- Retry build after dependency install succeeds locally.

## Roadmap Ideas

- Persist progress/notes/bookmarks to Prisma-backed API.
- Add authentication (GitHub/Google/email).
- Add lesson-level coding challenges and auto-evaluation.
- Introduce spaced repetition and personalized study plans.
- Add export/import profile backups.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit with clear messages.
4. Open a pull request with screenshots or sample flow where relevant.

---

If this project helps you, consider starring the repository on GitHub.
