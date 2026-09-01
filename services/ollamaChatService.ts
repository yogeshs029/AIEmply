import {
  ChatProvider,
  ChatProviderHealth,
  ChatGenerateParams,
  ChatGenerateResult,
} from '@/types/chat';
import { defaultChatEngine } from './demoChatEngine';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10,12}\b/;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

function extractCleanName(text: string): string {
  let cleaned = text
    .replace(/^(my name is|i am|this is|call me|name:?|it's|it is)\s+/i, '')
    .trim();
  cleaned = cleaned.replace(/[.,!?;:]+$/, '').trim();
  const words = cleaned.split(/\s+/);
  return words.length > 3 ? words.slice(0, 3).join(' ') : cleaned;
}

export class OllamaProvider implements ChatProvider {
  private baseUrl: string;
  private configuredModel: string;

  constructor() {
    this.baseUrl = OLLAMA_BASE_URL;
    this.configuredModel = DEFAULT_MODEL;
  }

  /**
   * Health check to see if local Ollama daemon is reachable and list models
   */
  async healthCheck(): Promise<ChatProviderHealth> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(1500),
      });

      if (res.ok) {
        const data = await res.json();
        const models = (data.models || []).map((m: any) => m.name);
        const matched = models.find((m: string) => m.startsWith(this.configuredModel)) || models[0];

        return {
          online: true,
          provider: 'ollama',
          model: matched || this.configuredModel,
        };
      }
    } catch (err) {
      // Ollama offline
    }

    return {
      online: false,
      provider: 'ollama',
      error: `Ollama not reachable at ${this.baseUrl}`,
    };
  }

  /**
   * Builds the dynamic contextual system prompt
   */
  private buildSystemPrompt(params: ChatGenerateParams): string {
    const { agent, businessType, selectedNeeds = [], businessDescription } = params;
    const needsList = selectedNeeds.length > 0 ? selectedNeeds.join(', ') : 'general business communication';
    const capabilitiesList = agent.capabilities.join('; ');

    return `You are ${agent.name || 'an AI Agent'}, a professional AI ${agent.role} demonstrated inside the AI Emply discovery experience.
You are configured for the "${businessType || 'general'}" industry.
${businessDescription ? `The business specifically describes their operations as: "${businessDescription}".` : ''}
The business needs your help with: ${needsList}.
Your core capabilities include: ${capabilitiesList}.
Personality: ${agent.personality || 'Professional, friendly, responsive, concise, and helpful'}.

YOUR PURPOSE:
Demonstrate realistically how this AI Agent interacts with prospective customers, answers questions accurately, qualifies interest, and collects contact details.

GUIDELINES:
1. Keep your responses concise (2 to 4 sentences maximum).
2. Communicate naturally and professionally through text.
3. Be proactive: if the user asks about a service or offering, answer clearly and ask a relevant follow-up question (such as their name, timing, or preferred contact info).
4. If the user provides their name, acknowledge it warmly and ask for their phone or email.
5. If the user provides phone or email, confirm that their details have been captured and that the team will follow up.

SAFETY CONSTRAINTS:
- HEALTHCARE: Never diagnose, prescribe medicine, or provide medical treatment advice. Politely advise consulting a licensed physician and offer appointment scheduling.
- REAL ESTATE / RESTAURANT / EDUCATION: This is an interactive demo simulation. Do not claim financial transactions or legally binding reservations have already occurred.

Always respond in character as the AI ${agent.role}.`;
  }

  /**
   * Generates a contextual LLM response via Ollama with structured lead extraction
   */
  async generateResponse(params: ChatGenerateParams): Promise<ChatGenerateResult> {
    const health = await this.healthCheck();

    // Deterministic lead extraction on user's message
    const text = params.userMessage.trim();
    const phoneMatch = text.match(PHONE_REGEX);
    const emailMatch = text.match(EMAIL_REGEX);

    const aiMessages = (params.chatHistory || []).filter((m) => m.sender === 'ai');
    const lastAiMsg = (aiMessages[aiMessages.length - 1]?.text || '').toLowerCase();
    const askedForName = /name\b|who to contact|may i have your name/i.test(lastAiMsg);

    let extractedName: string | undefined;
    if (askedForName && !phoneMatch && !emailMatch && text.split(/\s+/).length <= 4) {
      extractedName = extractCleanName(text);
    }

    // If Ollama is ONLINE, generate dynamic response via local LLM
    if (health.online) {
      try {
        const systemPrompt = this.buildSystemPrompt(params);
        const activeModel = health.model || this.configuredModel;

        // Keep last 8 messages for memory context
        const recentHistory = (params.chatHistory || []).slice(-8);
        const formattedMessages = [
          { role: 'system', content: systemPrompt },
          ...recentHistory.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          { role: 'user', content: text },
        ];

        const ollamaRes = await fetch(`${this.baseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: activeModel,
            messages: formattedMessages,
            stream: false,
            options: {
              temperature: 0.7,
              top_p: 0.9,
            },
          }),
          signal: AbortSignal.timeout(12000),
        });

        if (ollamaRes.ok) {
          const data = await ollamaRes.json();
          const reply = data.message?.content?.trim() || '';

          if (reply) {
            const hasPhone = Boolean(phoneMatch);
            const hasEmail = Boolean(emailMatch);
            const isLeadCaptured = hasPhone || hasEmail;

            return {
              reply,
              intent: isLeadCaptured ? 'contact_sharing' : extractedName ? 'name_sharing' : 'general_query',
              actionTaken: isLeadCaptured ? 'lead_captured' : extractedName ? 'ask_contact' : undefined,
              leadCaptured: isLeadCaptured,
              leadData: {
                name: extractedName,
                phone: phoneMatch ? phoneMatch[0] : undefined,
                email: emailMatch ? emailMatch[0] : undefined,
              },
              source: 'ollama',
              modelUsed: activeModel,
            };
          }
        }
      } catch (err) {
        console.warn('[OllamaProvider] Error generating response, using mock fallback:', (err as Error).message);
      }
    }

    // ── FALLBACK PROVIDER: Structured MockDemoChatEngine ────────
    const fallbackRes = await defaultChatEngine.generateResponse({
      sessionId: params.sessionId,
      businessType: params.businessType,
      selectedNeeds: params.selectedNeeds,
      agent: params.agent,
      userMessage: params.userMessage,
      chatHistory: params.chatHistory,
    });

    return {
      reply: fallbackRes.reply,
      intent: fallbackRes.intent,
      actionTaken: fallbackRes.actionTaken,
      leadCaptured: fallbackRes.leadCaptured,
      leadData: fallbackRes.leadData,
      source: 'mock',
    };
  }
}

export const ollamaChatService = new OllamaProvider();
