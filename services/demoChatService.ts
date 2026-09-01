import { DemoChatMessage, DemoChatResponse } from '@/types/demoChat';

// ─────────────────────────────────────────────────────────────
//  Demo Chat Client Service
// ─────────────────────────────────────────────────────────────

const BASE = '/api/demo-chat';

export async function fetchDemoChatMessages(sessionId: string): Promise<DemoChatMessage[]> {
  try {
    const res = await fetch(`${BASE}?sessionId=${encodeURIComponent(sessionId)}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.messages : [];
  } catch (err) {
    console.warn('[DemoChatService] fetchDemoChatMessages failed:', err);
    return [];
  }
}

export async function sendDemoMessage(params: {
  sessionId: string;
  agentId: string;
  businessType?: string | null;
  businessDescription?: string | null;
  selectedNeeds?: string[];
  message: string;
  chatHistory: DemoChatMessage[];
}): Promise<DemoChatResponse | null> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'send_message',
      ...params,
    }),
  });

  if (!res.ok) {
    throw new Error(`Chat API error (${res.status})`);
  }

  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to generate response');
  return json;
}

export async function saveDemoMessageDirect(params: {
  sessionId: string;
  agentId: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  intent?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_message',
        ...params,
      }),
    });
  } catch (err) {
    console.warn('[DemoChatService] saveDemoMessageDirect failed:', err);
  }
}

export async function completeDemoSession(sessionId: string): Promise<void> {
  try {
    await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'complete_demo',
        sessionId,
      }),
    });
  } catch (err) {
    console.warn('[DemoChatService] completeDemoSession failed:', err);
  }
}
