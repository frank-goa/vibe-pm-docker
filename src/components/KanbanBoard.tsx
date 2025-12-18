'use client';

import { useState, useMemo } from 'react';
import { KanbanTask, ColumnId, Priority, Label, LABEL_COLORS, TaskFilters, LabelColor } from '@/types';
import { KanbanCard } from './KanbanCard';
import { SearchFilter } from './SearchFilter';
import { BulkActionBar } from './BulkActionBar';

interface KanbanBoardProps {
  tasks: KanbanTask[];
  labels: Label[];
  onCreateTask: (task: Omit<KanbanTask, 'id' | 'createdAt'>) => Promise<KanbanTask | undefined>;
  onUpdateTask: (id: string, updates: Partial<KanbanTask>) => Promise<KanbanTask | undefined>;
  onDeleteTask: (id: string) => Promise<void>;
  onTodoDropped?: (todoId: string, columnId: ColumnId) => void;
}

const columns: { id: ColumnId; title: string }[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'complete', title: 'Complete' },
];

const priorityOrder: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const priorityColors: Record<Priority, string> = {
  low: 'bg-zinc-600',
  medium: 'bg-amber-600',
  high: 'bg-red-500',
};

const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Med',
  high: 'High',
};

function getDueUrgency(dueDate?: string): number {
  if (!dueDate) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function KanbanBoard({
  tasks,
  labels,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onTodoDropped,
}: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<ColumnId | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskLabels, setNewTaskLabels] = useState<string[]>([]);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    priority: 'all',
    labels: [],
  });

  const selectionMode = selectedTasks.size > 0;

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDesc = task.description?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // Labels filter
      if (filters.labels.length > 0) {
        const hasMatchingLabel = filters.labels.some((labelId) => task.labels?.includes(labelId));
        if (!hasMatchingLabel) return false;
      }

      return true;
    });
  }, [tasks, filters]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.setData('type', 'task');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, columnId: ColumnId) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const id = e.dataTransfer.getData('text/plain');

    if (type === 'todo' && onTodoDropped) {
      onTodoDropped(id, columnId);
    } else if (draggedTaskId) {
      await onUpdateTask(draggedTaskId, { columnId });
    }
    setDraggedTaskId(null);
  };

  const resetNewTask = () => {
    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setNewTaskLabels([]);
    setNewTaskDueDate('');
    setAddingTo(null);
  };

  const addTask = async (columnId: ColumnId) => {
    if (!newTaskTitle.trim()) return;

    await onCreateTask({
      title: newTaskTitle.trim(),
      columnId,
      priority: newTaskPriority,
      labels: newTaskLabels,
      dueDate: newTaskDueDate || undefined,
      subtasks: [],
    });
    resetNewTask();
  };

  const deleteTask = async (id: string) => {
    await onDeleteTask(id);
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const archiveTask = async (id: string) => {
    await onUpdateTask(id, { columnId: 'archive' as ColumnId });
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const restoreTask = async (id: string) => {
    await onUpdateTask(id, { columnId: 'complete' });
  };

  const editTask = async (id: string, updates: Partial<Omit<KanbanTask, 'id' | 'createdAt' | 'columnId'>>) => {
    await onUpdateTask(id, updates);
  };

  const getColumnTasks = (columnId: ColumnId) => {
    return filteredTasks
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => {
        // Sort by due date urgency first (overdue at top)
        const urgencyA = getDueUrgency(a.dueDate);
        const urgencyB = getDueUrgency(b.dueDate);
        if (urgencyA < 0 && urgencyB >= 0) return -1;
        if (urgencyB < 0 && urgencyA >= 0) return 1;

        // Then by priority
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;

        return a.createdAt - b.createdAt;
      });
  };

  const toggleNewTaskLabel = (labelId: string) => {
    setNewTaskLabels((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    );
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedTasks(new Set());
  };

  // Bulk actions
  const handleBulkMove = async (columnId: ColumnId) => {
    const promises = Array.from(selectedTasks).map((id) => onUpdateTask(id, { columnId }));
    await Promise.all(promises);
    clearSelection();
  };

  const handleBulkArchive = async () => {
    const promises = Array.from(selectedTasks).map((id) =>
      onUpdateTask(id, { columnId: 'archive' as ColumnId })
    );
    await Promise.all(promises);
    clearSelection();
  };

  const handleBulkDelete = async () => {
    const promises = Array.from(selectedTasks).map((id) => onDeleteTask(id));
    await Promise.all(promises);
    clearSelection();
  };

  const archivedTasks = filteredTasks.filter((t) => t.columnId === 'archive');

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter */}
      <SearchFilter labels={labels} filters={filters} onFiltersChange={setFilters} />

      {/* Selection Mode Hint */}
      {!selectionMode && (
        <p className="text-xs text-zinc-400 mb-2">
          Tip: Hold Shift and click cards to select multiple tasks
        </p>
      )}

      <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-1 min-w-[260px] flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">{column.title}</h3>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                {getColumnTasks(column.id).length}
              </span>
            </div>

            <div className="flex-1 space-y-2 min-h-[200px] bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
              {getColumnTasks(column.id).map((task) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  labels={labels}
                  onDelete={deleteTask}
                  onArchive={column.id === 'complete' ? archiveTask : undefined}
                  onEdit={editTask}
                  onDragStart={handleDragStart}
                  isSelected={selectedTasks.has(task.id)}
                  onSelectToggle={toggleTaskSelection}
                  selectionMode={selectionMode}
                />
              ))}

              {addingTo === column.id ? (
                <div className="bg-zinc-800 border border-zinc-700 p-3 rounded">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addTask(column.id);
                      if (e.key === 'Escape') resetNewTask();
                    }}
                    className="w-full bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 mb-2"
                    placeholder="Task title"
                    autoFocus
                  />

                  {/* Priority */}
                  <div className="flex gap-1 mb-2">
                    {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setNewTaskPriority(p)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          newTaskPriority === p
                            ? `${priorityColors[p]} text-white`
                            : 'bg-zinc-700 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {priorityLabels[p]}
                      </button>
                    ))}
                  </div>

                  {/* Labels */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {labels.map((label) => (
                      <button
                        key={label.id}
                        onClick={() => toggleNewTaskLabel(label.id)}
                        className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                          newTaskLabels.includes(label.id)
                            ? LABEL_COLORS[label.color as LabelColor]
                            : 'bg-zinc-700 text-zinc-400 border-zinc-600 hover:text-zinc-200'
                        }`}
                      >
                        {label.name}
                      </button>
                    ))}
                  </div>

                  {/* Due Date */}
                  <div className="mb-2">
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addTask(column.id)}
                      className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-200 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={resetNewTask}
                      className="text-xs px-2 py-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingTo(column.id)}
                  className="w-full text-left text-sm text-zinc-500 hover:text-zinc-300 py-2 px-2 rounded hover:bg-zinc-800/50 transition-colors"
                >
                  + Add task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Archive Section */}
      <div className="mt-4 border-t border-zinc-800 pt-4">
        <button
          onClick={() => setShowArchive(!showArchive)}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-2"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showArchive ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          Archive ({archivedTasks.length})
        </button>

        {showArchive && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            {archivedTasks.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-4">No archived tasks</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {archivedTasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    labels={labels}
                    onDelete={deleteTask}
                    onRestore={restoreTask}
                    onEdit={editTask}
                    onDragStart={handleDragStart}
                    isArchived
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedTasks.size}
        onMove={handleBulkMove}
        onArchive={handleBulkArchive}
        onDelete={handleBulkDelete}
        onClearSelection={clearSelection}
      />
    </div>
  );
}
