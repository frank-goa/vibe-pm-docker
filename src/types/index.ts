export type ColumnId = 'todo' | 'in-progress' | 'complete' | 'archive';
export type Priority = 'low' | 'medium' | 'high';

export type LabelColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export interface Label {
  id: string;
  name: string;
  color: LabelColor;
}

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  columnId: ColumnId;
  priority: Priority;
  labels: string[]; // label ids
  dueDate?: string; // ISO date string
  createdAt: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface AppState {
  tasks: KanbanTask[];
  todos: TodoItem[];
  notes: string;
  labels: Label[];
}

// Default labels
export const DEFAULT_LABELS: Label[] = [
  { id: 'bug', name: 'Bug', color: 'red' },
  { id: 'feature', name: 'Feature', color: 'blue' },
  { id: 'design', name: 'Design', color: 'purple' },
  { id: 'docs', name: 'Docs', color: 'yellow' },
  { id: 'urgent', name: 'Urgent', color: 'orange' },
];

export const LABEL_COLORS: Record<LabelColor, string> = {
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  green: 'bg-green-500/20 text-green-400 border-green-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};
