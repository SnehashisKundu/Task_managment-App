
import React from 'react';
import { Trash2, Calendar, Sparkles, ChevronDown } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { StatusBadge } from './StatusBadge';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onStatusChange }) => {
  const dateStr = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
              {task.title}
            </h3>
            {task.isAiEnhanced && (
              <div className="flex items-center gap-1 text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-md border border-purple-100">
                <Sparkles size={10} />
                AI Enhanced
              </div>
            )}
          </div>
          <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
            {task.description}
          </p>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Calendar size={14} />
          <span>{dateStr}</span>
        </div>

        <div className="relative group/select">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="appearance-none bg-slate-50 border border-slate-100 text-xs rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 cursor-pointer transition-all"
          >
            {Object.values(TaskStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown size={14} />
          </div>
          <div className="absolute -top-10 left-0 hidden group-hover/select:block">
            <StatusBadge status={task.status} />
          </div>
        </div>
      </div>
    </div>
  );
};
