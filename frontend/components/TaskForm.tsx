
import React, { useState } from 'react';
import { Plus, Sparkles, X, Loader2 } from 'lucide-react';
import { enhanceTaskDescription, isGeminiConfigured } from '../services/geminiservice';

interface TaskFormProps {
  onAdd: (title: string, description: string, isAiEnhanced: boolean) => void;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const geminiReady = isGeminiConfigured();
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onAdd(title, description, false);
      setTitle('');
      setDescription('');
    }
  };

  const handleAiEnhance = async () => {
    if (!geminiReady) return;
    if (!title || !description) return;
    setIsEnhancing(true);
    setToast(null);
    try {
      const enhanced = await enhanceTaskDescription(title, description);
      console.log('Original:', description);
      console.log('Enhanced:', enhanced);
      const changed = enhanced && enhanced.trim().toLowerCase() !== description.trim().toLowerCase();
      setDescription(enhanced);
      setToast({ type: changed ? 'success' : 'info', message: changed ? 'Description enhanced by Gemini ✨' : 'No changes suggested' });
      setTimeout(() => setToast(null), 3500);
    } catch (e: any) {
      setToast({ type: 'error', message: 'Enhance failed. Check console for details.' });
      setTimeout(() => setToast(null), 3500);
      console.error(e);
    }
    setIsEnhancing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-800">New Task</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {toast && (
            <div className={`fixed top-4 right-4 text-white px-3 py-2 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-700'}`}>
              {toast.message}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Task Title</label>
            <input
              autoFocus
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete UI Mockups"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-slate-700">Description</label>
              <button
                type="button"
                onClick={handleAiEnhance}
                disabled={!geminiReady || isEnhancing || !title || !description}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                AI Enhance
              </button>
            </div>
            {!geminiReady && (
              <p className="text-[11px] text-slate-500 mb-1">
                Gemini not configured. Set <span className="font-mono">VITE_GEMINI_API_KEY</span> in your .env.
              </p>
            )}
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what needs to be done..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
