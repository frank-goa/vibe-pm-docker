# Vibe Project Management - Design Document

## Overview

Vibe is a modern project management application built with Next.js 16, featuring a Kanban board, quick tasks, notes, and comprehensive task management capabilities.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Page.tsx  │  │ Components  │  │   Hooks     │          │
│  │   (Layout)  │  │  (UI/UX)    │  │  (useApi)   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Routes (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  /tasks  │  │  /todos  │  │  /notes  │  │  /labels │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Prisma ORM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                      │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌───────┐  ┌─────────┐       │
│  │ Task │  │ Todo │  │ Note │  │ Label │  │ Subtask │       │
│  └──────┘  └──────┘  └──────┘  └───────┘  └─────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL 16 |
| ORM | Prisma 5.22 |
| Container | Docker & Docker Compose |
| Dev Server | Turbopack |

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Task     │       │  TaskLabel  │       │    Label    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │───┐   │ taskId (FK) │   ┌───│ id (PK)     │
│ title       │   └──▶│ labelId (FK)│◀──┘   │ name        │
│ description │       └─────────────┘       │ color       │
│ columnId    │                             └─────────────┘
│ priority    │       ┌─────────────┐
│ dueDate     │       │   Subtask   │
│ createdAt   │───┐   ├─────────────┤
│ updatedAt   │   │   │ id (PK)     │
└─────────────┘   └──▶│ taskId (FK) │
                      │ text        │
┌─────────────┐       │ completed   │
│    Todo     │       │ createdAt   │
├─────────────┤       └─────────────┘
│ id (PK)     │
│ text        │       ┌─────────────┐
│ completed   │       │    Note     │
│ createdAt   │       ├─────────────┤
│ updatedAt   │       │ id (PK)     │
└─────────────┘       │ content     │
                      │ createdAt   │
                      │ updatedAt   │
                      └─────────────┘
```

### Models

#### Task
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| title | String | Task title |
| description | String? | Optional description |
| columnId | String | Kanban column: 'todo', 'in-progress', 'complete', 'archive' |
| priority | String | 'low', 'medium', 'high' |
| dueDate | DateTime? | Optional due date |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

#### Subtask
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| text | String | Subtask description |
| completed | Boolean | Completion status |
| taskId | UUID | Foreign key to Task |
| createdAt | DateTime | Creation timestamp |

#### Label
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | String | Label name (e.g., 'Bug', 'Feature') |
| color | String | Color identifier |

#### Todo (Quick Tasks)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| text | String | Task description |
| completed | Boolean | Completion status |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

#### Note
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| content | String | Note content (markdown supported) |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Component Hierarchy

```
App (page.tsx)
├── Header
│   ├── Logo
│   └── Connection Status
├── Mobile Tab Navigation (lg:hidden)
│   ├── Board Tab
│   ├── Tasks Tab
│   └── Notes Tab
├── Main Content Area
│   └── KanbanBoard
│       ├── SearchFilter
│       │   ├── Search Input
│       │   └── Filter Panel
│       │       ├── Priority Filters
│       │       └── Label Filters
│       ├── Columns (Todo, In Progress, Complete)
│       │   ├── Column Header (title + count)
│       │   ├── KanbanCard[]
│       │   │   ├── Task Title
│       │   │   ├── Priority Indicator
│       │   │   ├── Due Date Badge
│       │   │   ├── Label Tags
│       │   │   ├── Subtask Progress
│       │   │   └── Action Buttons
│       │   └── Add Task Form
│       ├── Archive Section
│       │   └── Archived KanbanCard[]
│       └── BulkActionBar (floating)
└── Sidebar (Desktop)
    ├── TodoList (Quick Tasks)
    │   ├── Input
    │   └── Draggable Todo Items
    └── Notes
        └── Textarea
```

## API Endpoints

### Tasks API (`/api/tasks`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Fetch all tasks with labels and subtasks |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks | Update an existing task |
| DELETE | /api/tasks?id={id} | Delete a task |

#### Request/Response Examples

**POST /api/tasks**
```json
{
  "title": "Implement feature",
  "columnId": "todo",
  "priority": "high",
  "labels": ["label-uuid-1"],
  "dueDate": "2024-12-25",
  "subtasks": [
    { "text": "Research", "completed": false },
    { "text": "Implementation", "completed": false }
  ]
}
```

### Todos API (`/api/todos`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | Fetch all quick tasks |
| POST | /api/todos | Create a new quick task |
| PUT | /api/todos | Update a quick task |
| DELETE | /api/todos?id={id} | Delete a quick task |

### Notes API (`/api/notes`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notes | Fetch notes |
| PUT | /api/notes | Update notes content |

### Labels API (`/api/labels`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/labels | Fetch all labels |

### Seed API (`/api/seed`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/seed | Seed default labels |

## State Management

The application uses React hooks for state management:

### Custom Hooks (`src/hooks/useApi.ts`)

| Hook | Purpose |
|------|---------|
| `useTasks()` | Manage tasks state and CRUD operations |
| `useTodos()` | Manage quick tasks state and CRUD operations |
| `useNotes()` | Manage notes state and save operations |
| `useLabels()` | Fetch and cache labels |
| `useSeed()` | Trigger database seeding |

### Local Component State

| Component | State | Purpose |
|-----------|-------|---------|
| KanbanBoard | filters | Search and filter criteria |
| KanbanBoard | selectedTasks | Bulk selection tracking |
| KanbanBoard | addingTo | Track which column is adding a task |
| KanbanCard | isEditing | Toggle edit mode |
| SearchFilter | showFilters | Toggle filter panel visibility |

## UI/UX Patterns

### Design System

**Color Palette (Zinc-based dark theme)**
- Background: `zinc-950`
- Surface: `zinc-900`, `zinc-800`
- Border: `zinc-800`, `zinc-700`
- Text Primary: `zinc-100`
- Text Secondary: `zinc-400`, `zinc-500`
- Accent: `pink-500`

**Priority Colors**
- High: `red-500`
- Medium: `amber-600`
- Low: `zinc-600`

**Due Date Indicators**
- Overdue: `red-500` background
- Due Today: `amber-500` background
- Due Soon (≤3 days): `amber-500/20` background
- Normal: `zinc-700` background

### Interaction Patterns

1. **Drag and Drop**
   - Quick Tasks → Kanban columns (converts to task)
   - Kanban cards between columns

2. **Bulk Selection**
   - Shift+click to select multiple cards
   - Floating action bar for bulk operations

3. **Inline Editing**
   - Click edit button to modify task details
   - Escape to cancel, Enter to save

4. **Responsive Design**
   - Desktop: 3-column layout with sidebar
   - Mobile: Tab-based navigation

5. **Layout**
   - Kanban columns expand to fill available space (no fixed max-width)
   - Secondary text uses `zinc-400`/`zinc-500` for readable contrast on dark backgrounds
   - Consistent spacing with Tailwind's gap utilities

## Features Implemented

### Core Features
- [x] Kanban board with 3 columns (Todo, In Progress, Complete)
- [x] Quick Tasks sidebar
- [x] Notes panel
- [x] Task CRUD operations
- [x] Labels/tags system
- [x] Priority levels
- [x] Due dates

### Medium Effort Features (v2)
- [x] Search/Filter tasks
- [x] Bulk actions (move, archive, delete)
- [x] Subtasks/checklists
- [x] Due date reminders (overdue, today, soon indicators)
- [x] Drag Quick Tasks to Kanban
- [x] Archive view with restore functionality

## Future Roadmap

### High Effort Features
- [ ] Keyboard shortcuts (vim-style navigation)
- [ ] Undo/redo functionality
- [ ] Recurring tasks
- [ ] Time tracking
- [ ] Activity log/history
- [ ] Export to CSV/JSON

### Advanced Features
- [ ] Real-time collaboration (WebSockets)
- [ ] User authentication
- [ ] Multiple boards/projects
- [ ] Custom fields
- [ ] Automations/workflows
- [ ] Mobile app (React Native)
- [ ] Calendar view
- [ ] Gantt chart view

## Development Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Quick Start

```bash
# Start database
docker compose up -d db

# Install dependencies
npm install

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://vibepm:vibepm123@localhost:5432/vibepm"
```

## Testing Strategy

### Manual Testing Checklist
- [ ] Create, edit, delete tasks
- [ ] Drag tasks between columns
- [ ] Search and filter tasks
- [ ] Bulk select and perform actions
- [ ] Add/toggle subtasks
- [ ] Archive and restore tasks
- [ ] Drag quick tasks to Kanban
- [ ] Responsive layout on mobile

### Future: Automated Testing
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Playwright

## Performance Considerations

1. **Database**
   - Indexed queries on frequently filtered fields
   - Cascade deletes for related records

2. **Frontend**
   - useMemo for filtered task lists
   - Optimistic updates for better UX
   - Lazy loading for archive section

3. **API**
   - Include related data in single queries
   - Proper error handling with status codes
