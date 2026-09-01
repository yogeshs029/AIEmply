// =====================================================
//  Chat Provider & Message Types — AI Emply Step 4
// =====================================================

import { AIAgent } from './aiAgent';
import { DemoChatMessage, DemoLeadData } from './demoChat';

export interface ChatProviderHealth {
  online: boolean;
  provider: 'ollama' | 'mock' | 'openai';
  model?: string;
  error?: string;
}

export interface ChatGenerateParams {
  sessionId?: string;
  businessType?: string | null;
  businessDescription?: string | null;
  selectedNeeds?: string[];
  agent: AIAgent;
  userMessage: string;
  chatHistory: DemoChatMessage[];
}

export interface ChatGenerateResult {
  reply: string;
  intent: string;
  actionTaken?: string;
  leadCaptured?: boolean;
  leadData?: DemoLeadData;
  source: 'ollama' | 'mock';
  modelUsed?: string;
}

export interface ChatProvider {
  healthCheck(): Promise<ChatProviderHealth>;
  generateResponse(params: ChatGenerateParams): Promise<ChatGenerateResult>;
}
