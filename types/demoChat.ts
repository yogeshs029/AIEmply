// =====================================================
//  Demo Chat Types — AI Emply Step 4
// =====================================================

import { AIAgent } from './aiAgent';

export type ChatRole = 'user' | 'ai' | 'system';

export interface DemoChatMessage {
  id: string;
  sender: ChatRole;
  text: string;
  timestamp: string;
  intent?: string;
  isLeadCaptured?: boolean;
  metadata?: Record<string, any>;
}

export interface DemoLeadData {
  name?: string;
  phone?: string;
  email?: string;
  interest?: string;
}

export interface DemoLeadRecord {
  id: string;
  session_id: string;
  agent_id: string;
  business_type: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  interest: string | null;
  conversation_summary: string | null;
  created_at: string;
}

export interface DemoChatContext {
  sessionId?: string;
  businessType?: string | null;
  selectedNeeds?: string[];
  agent: AIAgent;
  userMessage: string;
  chatHistory: DemoChatMessage[];
}

export interface DemoChatResponse {
  reply: string;
  intent: string;
  actionTaken?: string;
  leadCaptured?: boolean;
  leadData?: DemoLeadData;
  delayMs?: number;
}

export interface ChatEngine {
  generateResponse(context: DemoChatContext): Promise<DemoChatResponse>;
}
