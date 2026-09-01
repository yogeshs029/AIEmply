import {
  ChatProvider,
  ChatProviderHealth,
  ChatGenerateParams,
  ChatGenerateResult,
} from '@/types/chat';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

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

export class OpenAIProvider implements ChatProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.model = OPENAI_MODEL;
  }

  /**
   * Checks if OpenAI API key is configured
   */
  async healthCheck(): Promise<ChatProviderHealth> {
    const key = process.env.OPENAI_API_KEY || this.apiKey;
    if (key && key.trim().length > 10) {
      return {
        online: true,
        provider: 'openai',
        model: process.env.OPENAI_MODEL || this.model,
      };
    }

    return {
      online: false,
      provider: 'openai',
      error: 'OPENAI_API_KEY not configured in environment',
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
   * Generates a contextual LLM response via OpenAI API with structured lead extraction
   */
  async generateResponse(params: ChatGenerateParams): Promise<ChatGenerateResult> {
    const key = process.env.OPENAI_API_KEY || this.apiKey;
    const activeModel = process.env.OPENAI_MODEL || this.model;

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

    if (!key) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const systemPrompt = this.buildSystemPrompt(params);
    const recentHistory = (params.chatHistory || []).slice(-8);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
      { role: 'user', content: text },
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: activeModel,
        messages,
        temperature: 0.7,
        max_tokens: 350,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '';

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
      source: 'openai' as any,
      modelUsed: activeModel,
    };
  }
}

export const openAIChatService = new OpenAIProvider();
