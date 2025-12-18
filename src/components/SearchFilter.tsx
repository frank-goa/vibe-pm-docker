'use client';

import { useState } from 'react';
import { Label, Priority, TaskFilters, LABEL_COLORS, LabelColor } from '@/types';

interface SearchFilterProps {
  labels: Label[];
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

const priorityOptions: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function SearchFilter({ labels, filters, onFiltersChange }: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = filters.priority !== 'all' || filters.labels.length > 0;

  const toggleLabel = (labelId: string) => {
    const newLabels = filters.labels.includes(labelId)
      ? filters.labels.filter((id) => id !== labelId)
      : [...filters.labels, labelId];
    onFiltersChange({ ...filters, labels: newLabels });
  };

  const clearFilters = () => {
    onFiltersChange({ search: '', priority: 'all', labels: [] });
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2 items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder="Search tasks..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md pl-9 pr-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter
          {hasActiveFilters && (
            <span className="bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {(filters.priority !== 'all' ? 1 : 0) + filters.labels.length}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-3 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <div className="flex flex-wrap gap-4">
            {/* Priority Filter */}
            <div>
              <span className="text-xs text-zinc-400 block mb-1.5">Priority</span>
              <div className="flex gap-1">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onFiltersChange({ ...filters, priority: option.value })}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      filters.priority === option.value
                        ? 'bg-zinc-600 text-zinc-100'
                        : 'bg-zinc-700 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Labels Filter */}
            <div>
              <span className="text-xs text-zinc-400 block mb-1.5">Labels</span>
              <div className="flex flex-wrap gap-1">
                {labels.map((label) => (
                  <button
                    key={label.id}
                    onClick={() => toggleLabel(label.id)}
                    className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                      filters.labels.includes(label.id)
                        ? LABEL_COLORS[label.color as LabelColor]
                        : 'bg-zinc-700 text-zinc-400 border-zinc-600 hover:text-zinc-200'
                    }`}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
