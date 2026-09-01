// =====================================================
//  AI Agent Types — AI Emply Catalog & Recommendation
// =====================================================

export interface DetailedCapability {
  title: string;
  subtitle: string;
  icon: string; // 'chat' | 'calendar' | 'grad_cap' | 'funnel' | 'user' | 'forward' | etc.
}

export interface AIAgent {
  id: string;
  name: string;
  slug?: string;
  role: string;
  tagline: string;
  description: string;
  shortDescription?: string;
  industries: string[];
  supportedIndustries?: string[];
  supportedNeeds: string[];
  capabilities: string[];
  detailedCapabilities?: DetailedCapability[];
  personality?: string;
  demoPersonality?: string;
  demoScenario?: string;
  suggestedPrompts?: string[];
  systemPromptTemplate?: string;
  avatar: string;
  profileImage?: string;
  icon?: string;
  badge?: string;
  priority?: number;
}

export interface RecommendationResult {
  primaryAgent: AIAgent;
  alternativeAgents: AIAgent[];
  rankedAgents?: AIAgent[];
  score: number;
  matchedNeeds?: string[];
  matchedNeedsCount?: number;
  reason?: string;
  whyPoints: string[];
  recommendationSummary?: string;
}
