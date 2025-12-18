'use client';

import { ColumnId } from '@/types';

interface BulkActionBarProps {
  selectedCount: number;
  onMove: (columnId: ColumnId) => void;
  onArchive: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

const columns: { id: ColumnId; label: string }[] = [
  { id: 'todo', label: 'Todo' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'complete', label: 'Complete' },
];

export function BulkActionBar({
  selectedCount,
  onMove,
  onArchive,
  onDelete,
  onClearSelection,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl px-4 py-3 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-zinc-100">
          {selectedCount} selected
        </span>
        <button
          onClick={onClearSelection}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="h-4 w-px bg-zinc-700" />

      {/* Move To */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-zinc-500 mr-1">Move to:</span>
        {columns.map((col) => (
          <button
            key={col.id}
            onClick={() => onMove(col.id)}
            className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300 transition-colors"
          >
            {col.label}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-zinc-700" />

      {/* Archive */}
      <button
        onClick={onArchive}
        className="flex items-center gap-1.5 text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
        Archive
      </button>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex items-center gap-1.5 text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-400 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Delete
      </button>
    </div>
  );
}
