import { v4 as uuidv4 } from 'uuid';

// ─────────────────────────────────────────────────────────────
//  Session utilities — localStorage session ID management
//  Safe to use on client side only.
// ─────────────────────────────────────────────────────────────

const SESSION_KEY = 'ai_emply_session_id';

/**
 * Gets the existing session ID from localStorage, or generates
 * and stores a new UUID if none exists.
 *
 * Must only be called in a browser context (useEffect / event handler).
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';

  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const newId = uuidv4();
  localStorage.setItem(SESSION_KEY, newId);
  return newId;
}

/**
 * Reads the session ID from localStorage without creating one.
 * Returns null if none exists or if called server-side.
 */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

/**
 * Clears the session ID from localStorage (e.g. on restart).
 */
export function clearSessionId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Generates a brand new session ID and replaces the existing one in localStorage.
 */
export function resetSessionId(): string {
  if (typeof window === 'undefined') return uuidv4();
  const newId = uuidv4();
  localStorage.setItem(SESSION_KEY, newId);
  return newId;
}
