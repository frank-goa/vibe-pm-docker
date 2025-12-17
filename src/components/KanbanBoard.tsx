'use client';

import { useState } from 'react';
import { KanbanTask, ColumnId, Priority, Label, LABEL_COLORS } from '@/types';
import { KanbanCard } from './KanbanCard';

interface KanbanBoardProps {
  tasks: KanbanTask[];
  labels: Label[];
  onCreateTask: (task: Omit<KanbanTask, 'id' | 'createdAt'>) => Promise<KanbanTask | undefined>;
  onUpdateTask: (id: string, updates: Partial<KanbanTask>) => Promise<KanbanTask | undefined>;
  onDeleteTask: (id: string) => Promise<void>;
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

export function KanbanBoard({ tasks, labels, onCreateTask, onUpdateTask, onDeleteTask }: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<ColumnId | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskLabels, setNewTaskLabels] = useState<string[]>([]);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [showArchive, setShowArchive] = useState(false);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, columnId: ColumnId) => {
    e.preventDefault();
    if (draggedTaskId) {
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
    });
    resetNewTask();
  };

  const deleteTask = async (id: string) => {
    await onDeleteTask(id);
  };

  const archiveTask = async (id: string) => {
    await onUpdateTask(id, { columnId: 'archive' as ColumnId });
  };

  const editTask = async (id: string, updates: Partial<Omit<KanbanTask, 'id' | 'createdAt' | 'columnId'>>) => {
    await onUpdateTask(id, updates);
  };

  const getColumnTasks = (columnId: ColumnId) => {
    return tasks
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.createdAt - b.createdAt;
      });
  };

  const toggleNewTaskLabel = (labelId: string) => {
    setNewTaskLabels(prev =>
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  const archivedTasks = getColumnTasks('archive');

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-1 min-w-[260px] max-w-[340px] flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                {column.title}
              </h3>
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
                            ? LABEL_COLORS[label.color as keyof typeof LABEL_COLORS]
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
      {archivedTasks.length > 0 && (
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Archive ({archivedTasks.length})
          </button>

          {showArchive && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {archivedTasks.map((task) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  labels={labels}
                  onDelete={deleteTask}
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
  );
}
