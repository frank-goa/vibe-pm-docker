# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vibe - Project Management** is a minimal kanban board application for task management. It features a drag-and-drop kanban board, quick tasks checklist, and notes - all persisted to a PostgreSQL database.

## Development Commands

### Essential Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production application
- `npm run lint` - Run ESLint for code quality checks

### Database Operations

- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma migrate dev` - Create and apply new database migration
- `npx prisma studio` - Open Prisma Studio for database inspection

### Docker

- `docker compose up -d` - Start the application with PostgreSQL
- `docker compose down` - Stop containers
- `docker compose logs -f` - View logs

## Architecture Overview

### Core Technology Stack

- **Framework**: Next.js 16 with App Router and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **UI Styling**: Tailwind CSS v4
- **State**: React hooks with custom useApi hook for data fetching

### Database Schema

Key models in `prisma/schema.prisma`:

- `Task` - Kanban board cards with title, description, columnId (todo/inprogress/complete), priority, dueDate
- `Subtask` - Checklist items within tasks with completion tracking
- `Label` - Task categorization with name and color
- `TaskLabel` - Many-to-many join table for Task-Label relationships
- `Todo` - Quick task checklist items with text and completed status
- `Note` - User notes with content field

### App Structure

```
/src
├── app/
│   ├── page.tsx          # Main dashboard with kanban, todos, notes
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles and Tailwind imports
│   └── api/
│       ├── tasks/        # CRUD for kanban tasks
│       ├── todos/        # CRUD for quick tasks
│       ├── notes/        # CRUD for notes
│       ├── labels/       # CRUD for labels
│       └── seed/         # Database seeding endpoint
├── components/
│   ├── KanbanBoard.tsx   # Main kanban board with columns
│   ├── KanbanCard.tsx    # Individual task cards with inline editing
│   ├── SubtaskList.tsx   # Subtasks within cards with progress
│   ├── SearchFilter.tsx  # Search bar and filter controls
│   ├── BulkActionBar.tsx # Bulk action controls for selected tasks
│   ├── ArchiveDialog.tsx # Archive/restore tasks modal
│   ├── TodoList.tsx      # Quick tasks checklist
│   └── Notes.tsx         # Notes textarea with auto-save
├── hooks/
│   ├── useApi.ts         # Data fetching hooks (useTasks, useTodos, useNotes, useLabels)
│   └── useLocalStorage.ts
├── lib/
│   └── prisma.ts         # Prisma client singleton
└── types/
    └── index.ts          # TypeScript types and constants
```

### TypeScript Types

Key types defined in `/src/types/index.ts`:
- `KanbanTask` - Main task interface with subtasks, labels, and metadata
- `Subtask` - Individual checklist item within tasks
- `TodoItem` - Quick task interface
- `Label` - Label interface with color
- `TaskLabel` - Join table for task-label relationships
- Priority and column constants

### Drag and Drop Pattern

The app uses HTML5 native drag and drop API:
- Tasks can be dragged between columns (todo → inprogress → complete)
- Quick tasks can be dragged into Kanban columns to convert them
- Drag events are handled in `KanbanBoard.tsx` with column state updates
- Visual feedback provided during drag with opacity changes

All routes use Next.js Route Handlers with standard REST patterns:

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/tasks` | GET, POST, PUT, DELETE | Kanban task operations |
| `/api/todos` | GET, POST, PUT, DELETE | Quick task operations |
| `/api/notes` | GET, PUT | Notes operations |
| `/api/labels` | GET | Fetch available labels |
| `/api/seed` | POST | Seed database with sample data |

### Data Fetching Pattern

The `useApi.ts` hook provides data fetching with optimistic updates:

```typescript
const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
const { todos, loading, createTodo, updateTodo, deleteTodo } = useTodos();
const { notes, loading, updateNotes } = useNotes();
const { labels, loading } = useLabels();
```

## Key Patterns

### Kanban Columns

Tasks use `columnId` to determine their column:
- `todo` - Todo column
- `in-progress` - In Progress column
- `complete` - Complete column
- `archive` - Archive column (hidden by default)

### Priority Levels

Tasks support three priority levels with color-coded left borders:
- `high` - Red border
- `medium` - Amber/yellow border
- `low` - Gray border

### Subtasks

Tasks can contain subtasks with completion tracking. The progress bar shows completion percentage and completed subtasks sort to the bottom.

### Search & Filter

The search bar filters tasks by title/description text, while priority and label filters help narrow down tasks. Filters work together (AND logic).

### Bulk Actions

Select multiple tasks using Shift+click to perform batch operations:
- Move multiple tasks to different columns
- Archive completed tasks in bulk
- Delete multiple tasks with confirmation

### Archive System

Completed tasks can be archived to clean up the board. Archived tasks are hidden from the main view but can be viewed and restored from the archive.

### Quick Tasks to Kanban

Quick tasks can be dragged directly into Kanban columns to convert them into full tasks.

### Responsive Layout

- **Desktop (lg+)**: Side-by-side layout with kanban board and sidebar
- **Mobile (<lg)**: Tab navigation to switch between Board, Tasks, and Notes views

## Visual Development & Testing

### Design System

The project follows S-Tier SaaS design standards inspired by Stripe, Airbnb, and Linear. All UI development must adhere to:

- **Design Principles**: `/context/design-principles.md` - Comprehensive checklist for world-class UI
- **Style Guide**: `/context/style-guide.md` - Color palette, typography, spacing tokens

### Quick Visual Check

**IMMEDIATELY after implementing any front-end change:**

1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/context/design-principles.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review

For significant UI changes or before merging PRs, use the design review agent:

```bash
/design-review
```

The design review agent will:

- Test all interactive states and user flows
- Verify responsiveness (desktop/tablet/mobile)
- Check accessibility (WCAG 2.1 AA compliance)
- Validate visual polish and consistency
- Test edge cases and error states
- Provide categorized feedback (Blockers/High/Medium/Nitpicks)

### Playwright MCP Integration

#### Essential Commands for UI Testing

```javascript
// Navigation & Screenshots
mcp__playwright__browser_navigate(url); // Navigate to page
mcp__playwright__browser_take_screenshot(); // Capture visual evidence
mcp__playwright__browser_resize(width, height); // Test responsiveness

// Interaction Testing
mcp__playwright__browser_click(element); // Test clicks
mcp__playwright__browser_type(element, text); // Test input
mcp__playwright__browser_hover(element); // Test hover states

// Validation
mcp__playwright__browser_console_messages(); // Check for errors
mcp__playwright__browser_snapshot(); // Accessibility check
mcp__playwright__browser_wait_for(text / element); // Ensure loading
```

### Design Compliance Checklist

When implementing UI features, verify:

- [ ] **Visual Hierarchy**: Clear focus flow, appropriate spacing
- [ ] **Consistency**: Uses design tokens, follows patterns
- [ ] **Responsiveness**: Works on mobile (375px), tablet (768px), desktop (1440px)
- [ ] **Accessibility**: Keyboard navigable, proper contrast, semantic HTML
- [ ] **Performance**: Fast load times, smooth animations (150-300ms)
- [ ] **Error Handling**: Clear error states, helpful messages
- [ ] **Polish**: Micro-interactions, loading states, empty states

## Environment Setup

Requires these environment variables:

- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/vibe`)

## Additional Context

- Design review agent configuration: `/.claude/agents/design-review-agent.md`
- Design principles checklist: `/context/design-principles.md`
- Style guide: `/context/style-guide.md`
- Design review command: `/.claude/commands/design-review.md`
