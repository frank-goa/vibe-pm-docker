'use client';

import { useState, useEffect, useCallback } from 'react';
import { KanbanTask, TodoItem, Label } from '@/types';

// Tasks Hook
export function useTasks() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error('Error fetching tasks:', data.error || 'Invalid response');
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (task: Omit<KanbanTask, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (id: string, updates: Partial<KanbanTask>) => {
    try {
      const existingTask = tasks.find((t) => t.id === id);
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...existingTask, ...updates }),
      });
      const updatedTask = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return { tasks, loading, createTask, updateTask, deleteTask, setTasks };
}

// Todos Hook
export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTodo = async (text: string) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
      return newTodo;
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const updateTodo = async (id: string, updates: Partial<TodoItem>) => {
    try {
      const existingTodo = todos.find((t) => t.id === id);
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...existingTodo, ...updates }),
      });
      const updatedTodo = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
      return updatedTodo;
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return { todos, loading, createTodo, updateTodo, deleteTodo };
}

// Notes Hook
export function useNotes() {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data.content || '');
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const updateNotes = async (content: string) => {
    setNotes(content);
    try {
      await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  return { notes, loading, updateNotes };
}

// Labels Hook
export function useLabels() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLabels = useCallback(async () => {
    try {
      const res = await fetch('/api/labels');
      const data = await res.json();
      setLabels(data);
    } catch (error) {
      console.error('Error fetching labels:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabels();
  }, [fetchLabels]);

  return { labels, loading };
}

// Seed Hook
export function useSeed() {
  const seed = async () => {
    try {
      await fetch('/api/seed', { method: 'POST' });
    } catch (error) {
      console.error('Error seeding:', error);
    }
  };

  return { seed };
}
