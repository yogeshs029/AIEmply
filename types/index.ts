export interface Industry {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface Challenge {
  id: string;
  label: string;
  description: string;
}

export interface AIEmployee {
  id: string;
  role: string;
  tagline: string;
  description: string;
  capabilities: string[];
  detailedCapabilities?: {
    title: string;
    subtitle: string;
    icon: string;
  }[];
  avatar?: string;
  badge?: string;
  disclaimer?: string;
  icon: string;
}

export interface RecommendationRule {
  industryIds: string[];
  challengeIds: string[];
  employeeIds: string[];
}

export type StepId = 'welcome' | 'industry' | 'challenges' | 'recommendation' | 'demo' | 'results' | 'lead_form' | 'success';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  isLeadCaptured?: boolean;
}

export interface PersonaResponse {
  greeting: string;
  suggestedPrompts: string[];
  knowledge: {
    pattern: RegExp;
    reply: string;
    triggerLeadCapture?: boolean;
  }[];
  defaultReply: string;
}
