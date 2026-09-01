import { ChatMessage } from '@/types';

export interface OllamaStatus {
  online: boolean;
  model?: string;
}

export async function checkOllamaHealth(): Promise<OllamaStatus> {
  try {
    const res = await fetch('/api/chat', { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      if (data.online) {
        const modelName = data.models?.[0]?.name || 'Ollama LLM';
        return { online: true, model: modelName };
      }
    }
  } catch (e) {}
  return { online: false };
}

export async function sendChatMessage(
  messages: ChatMessage[],
  industryId: string,
  role: string
): Promise<{ reply: string; source: 'ollama' | 'fallback'; model?: string; triggerLeadCapture?: boolean }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, industryId, role }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.available && data.reply) {
        return {
          reply: data.reply,
          source: 'ollama',
          model: data.model,
          triggerLeadCapture: data.triggerLeadCapture,
        };
      }
    }
  } catch (e) {
    console.warn('Ollama client fallback triggered:', e);
  }

  return { reply: '', source: 'fallback' };
}
