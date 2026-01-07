/// <reference types="vite/client" />

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const DEFAULT_MODEL = 'gemini-2.5-flash';
let initialized = false;

export const getGeminiModel = (): string => {
  try {
    const saved = localStorage.getItem('gemini_model');
    return saved || DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
  }
};

export const setGeminiModel = (model: string) => {
  try {
    localStorage.setItem('gemini_model', model);
  } catch {
    // ignore storage errors
  }
};

if (apiKey) {
  initialized = true;
  console.log("Gemini API initialized successfully");
} else {
  console.warn("VITE_GEMINI_API_KEY not set in .env file");
}

const callGeminiAPI = async (prompt: string) => {
  if (!apiKey) throw new Error('API key not configured');
  
  const model = getGeminiModel();
  // Official format from Google docs
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(JSON.stringify(error));
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

export const enhanceTaskDescription = async (title: string, description: string): Promise<string> => {
  if (!initialized) {
    console.warn("AI service not initialized, returning original description");
    return description;
  }
  
  try {
    console.log("Calling Gemini API to enhance description...");
    console.log("Original:", description);
    
    const prompt = `You are a professional task description writer. Rewrite this task description to be concise, professional, and actionable using bullet points.

Task Title: ${title}
Current Description: ${description}

Enhanced Description (write ONLY 3-5 bullet points, each starting with • or -, keep it brief and clear):`;
    
    const enhanced = await callGeminiAPI(prompt);
    console.log("Enhanced:", enhanced);
    return enhanced.trim() || description;
  } catch (error: any) {
    console.error("Gemini API error:", error?.message || error);
    return description;
  }
};

export const isGeminiConfigured = (): boolean => Boolean(apiKey);

export const testGemini = async (): Promise<{ ok: boolean; text?: string; error?: string }> => {
  if (!initialized) {
    return { ok: false, error: 'Gemini not configured' };
  }
  try {
    const text = await callGeminiAPI('Reply with OK');
    return { ok: true, text };
  } catch (error: any) {
    const msg = error?.message || String(error);
    if (msg.includes('429') || msg.includes('quota')) {
      return { ok: false, error: `Quota exceeded for ${getGeminiModel()}. Try later.` };
    }
    return { ok: false, error: msg };
  }
};
