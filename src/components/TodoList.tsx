'use client';

import { useState } from 'react';
import { TodoItem } from '@/types';

interface TodoListProps {
  todos: TodoItem[];
  onCreateTodo: (text: string) => Promise<TodoItem | undefined>;
  onUpdateTodo: (id: string, updates: Partial<TodoItem>) => Promise<TodoItem | undefined>;
  onDeleteTodo: (id: string) => Promise<void>;
}

export function TodoList({ todos, onCreateTodo, onUpdateTodo, onDeleteTodo }: TodoListProps) {
  const [newTodo, setNewTodo] = useState('');

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    await onCreateTodo(newTodo.trim());
    setNewTodo('');
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await onUpdateTodo(id, { completed: !todo.completed });
    }
  };

  const deleteTodo = async (id: string) => {
    await onDeleteTodo(id);
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.createdAt - b.createdAt;
  });

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-3">
        Quick Tasks
      </h2>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          placeholder="Add task..."
        />
        <button
          onClick={addTodo}
          className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded text-sm text-zinc-300 transition-colors"
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {sortedTodos.length === 0 ? (
          <p className="text-xs text-zinc-600 py-4 text-center">No tasks yet</p>
        ) : (
          sortedTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-zinc-800/50 group"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                  todo.completed
                    ? 'bg-zinc-600 border-zinc-600'
                    : 'border-zinc-600 hover:border-zinc-500'
                }`}
              >
                {todo.completed && (
                  <svg className="w-2.5 h-2.5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 text-sm ${
                  todo.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-zinc-600 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
