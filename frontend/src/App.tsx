import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  ListChecks,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  LayoutGrid,
} from "lucide-react";

import { TaskStatus } from "../types";
import type { Task, FilterType } from "../types";
import { TaskCard } from "../components/Taskcard";
import { TaskForm } from "../components/TaskForm";
import { api } from "../services/api";
import { socketService } from "../services/socket";

import {
  isGeminiConfigured,
  getGeminiModel,
  setGeminiModel,
  testGemini,
} from "../services/geminiservice";

/* ---------- FILTERS (ENUM SAFE) ---------- */
const FILTERS: FilterType[] = [
  "All",
  TaskStatus.PENDING,
  TaskStatus.IN_PROGRESS,
  TaskStatus.COMPLETED,
];

/* ---------- Tailwind-safe color map ---------- */
const colorMap: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);

  /* ---------- Gemini ---------- */
  const [model, setModel] = useState<string>(getGeminiModel());
  const [testMsg, setTestMsg] = useState<string>("");

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = e.target.value;
    setModel(m);
    setGeminiModel(m);
  };

  const handleTestAi = async () => {
    const res = await testGemini();
    setTestMsg(res.ok ? `OK: ${res.text || ""}` : `Error: ${res.error}`);
    setTimeout(() => setTestMsg(""), 3000);
  };

  /* ---------- FETCH TASKS + SOCKET ---------- */
  useEffect(() => {
    api.getTasks()
      .then(setTasks)
      .catch(console.error);

    const socket = socketService.connect();

    socket.on("taskCreated", (task: Task) => {
      setTasks((prev) => [task, ...prev]);
    });

    socket.on("taskUpdated", (updated: Task) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    });

    socket.on("taskDeleted", (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  /* ---------- CRUD ---------- */
  const addTask = async (title: string, description: string) => {
    const task = await api.createTask(title, description, false);
    setTasks((prev) => [task, ...prev]);
    setIsFormOpen(false);
  };

  const deleteTask = async (id: string) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    const updated = await api.updateTaskStatus(id, status);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? updated : t))
    );
  };

  /* ---------- FILTER + STATS ---------- */
  const filteredTasks = useMemo(() => {
    if (filter === "All") return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
    inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* ---------- NAVBAR ---------- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow">
              <ListChecks size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                TaskFlow <span className="text-indigo-600">AI</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Premium Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={model}
              onChange={handleModelChange}
              className="text-sm bg-white border border-slate-200 rounded-xl px-3 py-2"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              <option value="gemini-flash-latest">Gemini Flash Latest</option>
            </select>

            {isGeminiConfigured() && (
              <button
                onClick={handleTestAi}
                className="text-sm px-3 py-2 border border-slate-300 rounded-xl"
              >
                Test AI
              </button>
            )}

            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow hover:bg-indigo-700"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ---------- MAIN ---------- */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Tasks", value: stats.total, icon: LayoutGrid, color: "indigo" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "amber" },
            { label: "In Progress", value: stats.inProgress, icon: Circle, color: "blue" },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "emerald" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border shadow-sm flex gap-4">
              <div className={`p-3 rounded-xl ${colorMap[stat.color]}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-600">
            <Filter size={16} />
            <span className="text-sm font-semibold">Filter Status</span>
          </div>
          <div className="flex gap-2 bg-white border rounded-xl p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks */}
        {filteredTasks.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onStatusChange={updateTaskStatus}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No tasks found
          </div>
        )}
      </main>

      {isFormOpen && (
        <TaskForm onAdd={addTask} onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};

export default App;
