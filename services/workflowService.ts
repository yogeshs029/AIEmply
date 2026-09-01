import type { AIEmplySession, SessionApiResponse } from '@/types/workflow';

// ─────────────────────────────────────────────────────────────
//  Workflow Session Service
//  All database communication goes through /api/sessions.
// ─────────────────────────────────────────────────────────────

const BASE = '/api/sessions';

/**
 * Fetches an existing session from the database.
 * Returns null if the session doesn't exist yet.
 */
export async function fetchSession(sessionId: string): Promise<AIEmplySession | null> {
  const res = await fetch(`${BASE}?sessionId=${encodeURIComponent(sessionId)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fetchSession failed (${res.status}): ${text}`);
  }
  const json: SessionApiResponse = await res.json();
  if (!json.success) throw new Error(json.error ?? 'Unknown error');
  return json.session ?? null;
}

/**
 * Creates a new session in the database.
 * Idempotent — safe to call even if the session already exists.
 */
export async function createSession(sessionId: string): Promise<AIEmplySession | null> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create', sessionId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`createSession failed (${res.status}): ${text}`);
  }
  const json: SessionApiResponse = await res.json();
  if (!json.success) throw new Error(json.error ?? 'Unknown error');
  return json.session ?? null;
}

/**
 * Saves the selected business type & optional description and advances current_step to 2.
 * Called only when the user clicks "Continue" on Step 1.
 */
export async function saveStep1(
  sessionId: string,
  businessType: string,
  businessDescription?: string
): Promise<AIEmplySession | null> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update_step1', sessionId, businessType, businessDescription }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`saveStep1 failed (${res.status}): ${text}`);
  }
  const json: SessionApiResponse = await res.json();
  if (!json.success) throw new Error(json.error ?? 'Unknown error');
  return json.session ?? null;
}

/**
 * Saves the selected needs and advances current_step to 3.
 * Called only when the user clicks "Continue" on Step 2.
 */
export async function saveStep2(sessionId: string, selectedNeeds: string[]): Promise<AIEmplySession | null> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update_step2', sessionId, selectedNeeds }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`saveStep2 failed (${res.status}): ${text}`);
  }
  const json: SessionApiResponse = await res.json();
  if (!json.success) throw new Error(json.error ?? 'Unknown error');
  return json.session ?? null;
}

/**
 * Saves the recommended/selected AI Agent and advances current_step to 4.
 * Called when the user clicks "Try This AI Agent" or chooses an alternate agent.
 */
export async function saveStep3(
  sessionId: string,
  recommendedAgent: string,
  recommendationSource: 'automatic' | 'manual' = 'automatic'
): Promise<AIEmplySession | null> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update_step3', sessionId, recommendedAgent, recommendationSource }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`saveStep3 failed (${res.status}): ${text}`);
  }
  const json: SessionApiResponse = await res.json();
  if (!json.success) throw new Error(json.error ?? 'Unknown error');
  return json.session ?? null;
}
