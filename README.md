# Vibe - Project Management (Docker Edition)

A clean, dark-mode project management app built for vibe coders. Features a Kanban board, quick tasks, and notes — with PostgreSQL database persistence.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)

## Features

### Kanban Board
- **Three columns**: Todo, In Progress, Complete
- **Drag and drop**: Move tasks between columns
- **Priorities**: Low, Medium, High — auto-sorted with high priority at top
- **Labels**: Tag tasks with Bug, Feature, Design, Docs, or Urgent
- **Due dates**: Set deadlines with overdue highlighting
- **Archive**: Completed tasks can be archived for a cleaner board

### Quick Tasks
- Simple checkbox-based todo list
- Perfect for small tasks that don't need full Kanban treatment
- Completed tasks sort to the bottom

### Notes
- Freeform textarea for jotting down ideas
- Auto-saves as you type

### Data Persistence
- **PostgreSQL database** for reliable data storage
- **Prisma ORM** for type-safe database access
- Data persists across sessions and browser refreshes

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Containerization**: Docker & Docker Compose
- **Drag & Drop**: Native HTML5 API

## Getting Started

### Option 1: Docker Compose (Recommended)

The easiest way to run the app with PostgreSQL.

```bash
# Clone the repository
git clone https://github.com/frank-goa/vibe-pm-docker.git
cd vibe-pm-docker

# Start with Docker Compose
docker-compose up -d

# Run database migrations
docker-compose run --rm migrate
```

The app will be available at [http://localhost:3000](http://localhost:3000).

To stop:
```bash
docker-compose down
```

To stop and remove data:
```bash
docker-compose down -v
```

### Option 2: Local Development

Run the app locally with a PostgreSQL database.

#### Prerequisites

- Node.js 20+
- npm
- PostgreSQL 16+

#### Setup

```bash
# Clone the repository
git clone https://github.com/frank-goa/vibe-pm-docker.git
cd vibe-pm-docker

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update DATABASE_URL in .env to point to your PostgreSQL instance

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/               # API routes
│   │   ├── tasks/         # Task CRUD endpoints
│   │   ├── todos/         # Todo CRUD endpoints
│   │   ├── notes/         # Notes endpoints
│   │   ├── labels/        # Labels endpoints
│   │   └── seed/          # Database seeding
│   ├── globals.css        # Global styles and dark theme
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main page component
├── components/
│   ├── KanbanBoard.tsx    # Board with columns and drag-drop
│   ├── KanbanCard.tsx     # Individual task card
│   ├── TodoList.tsx       # Quick tasks sidebar
│   └── Notes.tsx          # Notes textarea
├── hooks/
│   └── useApi.ts          # API hooks for data fetching
├── lib/
│   └── prisma.ts          # Prisma client singleton
└── types/
    └── index.ts           # TypeScript types and constants

prisma/
└── schema.prisma          # Database schema
```

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `Task` | Kanban board tasks with title, description, priority, due date |
| `Label` | Labels for categorizing tasks |
| `TaskLabel` | Many-to-many relationship between tasks and labels |
| `Todo` | Quick tasks (checkbox list) |
| `Note` | Notes content (single note) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks` | Update a task |
| DELETE | `/api/tasks?id=` | Delete a task |
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a todo |
| PUT | `/api/todos` | Update a todo |
| DELETE | `/api/todos?id=` | Delete a todo |
| GET | `/api/notes` | Get notes |
| PUT | `/api/notes` | Update notes |
| GET | `/api/labels` | Get all labels |
| POST | `/api/seed` | Seed default data |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/vibepm` |

## Docker Commands

```bash
# Build and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d
docker-compose run --rm migrate
```

## Default Labels

| Label | Color |
|-------|-------|
| Bug | Red |
| Feature | Blue |
| Design | Purple |
| Docs | Yellow |
| Urgent | Orange |

## License

MIT
