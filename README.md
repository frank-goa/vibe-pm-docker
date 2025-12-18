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
- **Due dates**: Set deadlines with visual indicators (overdue, today, due soon)
- **Subtasks**: Add checklists within tasks with progress tracking
- **Archive**: Completed tasks can be archived and restored
- **Search & Filter**: Find tasks by text, priority, or labels
- **Bulk Actions**: Select multiple tasks (Shift+click) to move, archive, or delete

### Quick Tasks
- Simple checkbox-based todo list
- Perfect for small tasks that don't need full Kanban treatment
- **Drag to Kanban**: Drag quick tasks directly into Kanban columns to convert them
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

#### Prerequisites

- Docker Desktop installed and running

#### Setup

```bash
# Clone the repository
git clone https://github.com/frank-goa/vibe-pm-docker.git
cd vibe-pm-docker

# Build and start all services
docker compose up -d
```

This starts three services:
- **db**: PostgreSQL 16 database on port 5432
- **app**: Next.js application on port 3000
- **migrate**: Runs Prisma db push to sync the schema (exits after completion)

The app will be available at [http://localhost:3000](http://localhost:3000).

#### Managing the Application

```bash
# Check status of all services
docker compose ps

# View application logs
docker compose logs -f app

# View database logs
docker compose logs -f db

# Restart the application
docker compose restart app

# Stop all services
docker compose down

# Stop and remove all data (reset database)
docker compose down -v
```

#### Rebuild After Code Changes

```bash
# Rebuild and restart
docker compose up -d --build
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
│   ├── KanbanCard.tsx     # Individual task card with subtasks
│   ├── SearchFilter.tsx   # Search and filter controls
│   ├── BulkActionBar.tsx  # Bulk selection action bar
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
| `Subtask` | Checklist items within tasks |
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

## Database Management

### Prisma Studio (Web UI)

Prisma Studio provides a visual interface to browse and edit your database.

```bash
# Run Prisma Studio (from project directory)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vibepm" npx prisma studio
```

Open [http://localhost:5555](http://localhost:5555) in your browser.

To stop Prisma Studio, press `Ctrl+C` in the terminal where it's running.

### Command Line Access

```bash
# List all tables
docker exec vibe-pm-db psql -U postgres -d vibepm -c "\dt"

# View all tasks
docker exec vibe-pm-db psql -U postgres -d vibepm -c 'SELECT * FROM "Task";'

# View all labels
docker exec vibe-pm-db psql -U postgres -d vibepm -c 'SELECT * FROM "Label";'

# View all todos
docker exec vibe-pm-db psql -U postgres -d vibepm -c 'SELECT * FROM "Todo";'

# Interactive psql session
docker exec -it vibe-pm-db psql -U postgres -d vibepm
```

### Database Connection Details

If using a GUI client (TablePlus, DBeaver, pgAdmin):

| Setting | Value |
|---------|-------|
| Host | localhost |
| Port | 5432 |
| Database | vibepm |
| Username | postgres |
| Password | postgres |

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
