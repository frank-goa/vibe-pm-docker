'use client';

import { useEffect, useState } from 'react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TodoList } from '@/components/TodoList';
import { Notes } from '@/components/Notes';
import { useTasks, useTodos, useNotes, useLabels, useSeed } from '@/hooks/useApi';

export default function Home() {
  const [seeded, setSeeded] = useState(false);
  const { seed } = useSeed();
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTasks();
  const { todos, loading: todosLoading, createTodo, updateTodo, deleteTodo } = useTodos();
  const { notes, loading: notesLoading, updateNotes } = useNotes();
  const { labels, loading: labelsLoading } = useLabels();

  useEffect(() => {
    if (!seeded) {
      seed();
      setSeeded(true);
    }
  }, [seed, seeded]);

  const loading = tasksLoading || todosLoading || notesLoading || labelsLoading;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-zinc-100">Vibe - Project Management</h1>
          </div>
          <span className="text-xs text-zinc-600">
            {loading ? 'syncing...' : 'connected to database'}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-65px)]">
        {/* Kanban Board - Main Area */}
        <main className="flex-1 p-6 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full text-zinc-600">
              Loading...
            </div>
          ) : (
            <KanbanBoard
              tasks={tasks}
              labels={labels}
              onCreateTask={createTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          )}
        </main>

        {/* Sidebar */}
        <aside className="w-80 border-l border-zinc-800 flex flex-col">
          {/* Todo List */}
          <div className="flex-1 p-4 border-b border-zinc-800 overflow-hidden">
            {loading ? (
              <div className="text-zinc-600 text-sm">Loading...</div>
            ) : (
              <TodoList
                todos={todos}
                onCreateTodo={createTodo}
                onUpdateTodo={updateTodo}
                onDeleteTodo={deleteTodo}
              />
            )}
          </div>

          {/* Notes */}
          <div className="flex-1 p-4 overflow-hidden">
            {loading ? (
              <div className="text-zinc-600 text-sm">Loading...</div>
            ) : (
              <Notes notes={notes} onNotesChange={updateNotes} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
