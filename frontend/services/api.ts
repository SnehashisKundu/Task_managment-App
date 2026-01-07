import type { Task, TaskStatus } from '../types';
import { enhanceTaskDescription } from './geminiservice';

const API_BASE = 'http://localhost:5000/api/tasks';

const normalizeStatus = (status: string): TaskStatus => {
  if (status === "pending") return "Pending";
  if (status === "in_progress") return "In Progress";
  if (status === "completed") return "Completed";
  return status as TaskStatus;
};

export const api = {
  getTasks: async (): Promise<Task[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Backend error");
    const data = await res.json();

    return data.map((t: any) => ({
        ...t,
        id: String(t.id),
        status: t.status === "pending"
        ? "Pending"
        : t.status === "in_progress"
        ? "In Progress"
        : t.status === "completed"
        ? "Completed"
        : t.status,
       }));
    },

  createTask: async (
    title: string,
    description: string,
    isAiEnhanced: boolean
  ): Promise<Task> => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, isAiEnhanced }),
    });
    if (!res.ok) throw new Error('Backend error');
    return res.json();
  },

  updateTaskStatus: async (
    id: string,
    status: TaskStatus
  ): Promise<Task> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Backend error');
    return res.json();
  },

  deleteTask: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Backend error');
  },

  enhanceDescription: async (title: string, description: string) => {
    return enhanceTaskDescription(title, description);
  }
};
