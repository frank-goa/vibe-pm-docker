'use client';

import { useState } from 'react';
import { KanbanTask, Priority, Label, LABEL_COLORS } from '@/types';

interface KanbanCardProps {
  task: KanbanTask;
  labels: Label[];
  onDelete: (id: string) => void;
  onArchive?: (id: string) => void;
  onEdit: (id: string, updates: Partial<Omit<KanbanTask, 'id' | 'createdAt' | 'columnId'>>) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  isArchived?: boolean;
}

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

function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function KanbanCard({ task, labels, onDelete, onArchive, onEdit, onDragStart, isArchived }: KanbanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editLabels, setEditLabels] = useState<string[]>(task.labels || []);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const taskLabels = labels.filter(l => task.labels?.includes(l.id));
  const overdue = isOverdue(task.dueDate);

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(task.id, {
        title: editTitle.trim(),
        priority: editPriority,
        description: editDesc.trim() || undefined,
        labels: editLabels,
        dueDate: editDueDate || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
      setEditDesc(task.description || '');
      setEditPriority(task.priority);
      setEditLabels(task.labels || []);
      setEditDueDate(task.dueDate || '');
    }
  };

  const toggleLabel = (labelId: string) => {
    setEditLabels(prev =>
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  if (isEditing) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 p-3 rounded">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 mb-2"
          placeholder="Task title"
          autoFocus
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-sm text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none mb-2"
          placeholder="Description (optional)"
          rows={2}
        />

        {/* Priority */}
        <div className="mb-2">
          <span className="text-xs text-zinc-500 block mb-1">Priority</span>
          <div className="flex gap-1">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setEditPriority(p)}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  editPriority === p
                    ? `${priorityColors[p]} text-white`
                    : 'bg-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {priorityLabels[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="mb-2">
          <span className="text-xs text-zinc-500 block mb-1">Labels</span>
          <div className="flex flex-wrap gap-1">
            {labels.map((label) => (
              <button
                key={label.id}
                onClick={() => toggleLabel(label.id)}
                className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                  editLabels.includes(label.id)
                    ? LABEL_COLORS[label.color]
                    : 'bg-zinc-700 text-zinc-400 border-zinc-600 hover:text-zinc-200'
                }`}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-2">
          <span className="text-xs text-zinc-500 block mb-1">Due Date</span>
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
          />
          {editDueDate && (
            <button
              onClick={() => setEditDueDate('')}
              className="ml-2 text-xs text-zinc-500 hover:text-zinc-300"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-200 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditTitle(task.title);
              setEditDesc(task.description || '');
              setEditPriority(task.priority);
              setEditLabels(task.labels || []);
              setEditDueDate(task.dueDate || '');
            }}
            className="text-xs px-2 py-1 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable={!isArchived}
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`bg-zinc-800 border border-zinc-700 rounded hover:border-zinc-600 transition-colors group flex overflow-hidden ${
        isArchived ? 'opacity-60' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      <div className={`w-1 flex-shrink-0 ${priorityColors[task.priority]}`} />
      <div className="flex-1 p-3">
        <div className="flex justify-between items-start gap-2">
          <p className="text-sm text-zinc-100 font-medium flex-1">{task.title}</p>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isArchived && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            {onArchive && !isArchived && (
              <button
                onClick={() => onArchive(task.id)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Archive"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </button>
            )}
            <button
              onClick={() => onDelete(task.id)}
              className="text-zinc-500 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2">{task.description}</p>
        )}

        {/* Labels */}
        {taskLabels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {taskLabels.map(label => (
              <span
                key={label.id}
                className={`text-xs px-1.5 py-0.5 rounded border ${LABEL_COLORS[label.color]}`}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${overdue ? 'text-red-400' : 'text-zinc-500'}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(task.dueDate)}</span>
            {overdue && <span className="font-medium">Overdue</span>}
          </div>
        )}
      </div>
    </div>
  );
}
