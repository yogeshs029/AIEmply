// =====================================================
//  Cloudflare Pages Function: /api/demo-chat
// =====================================================

interface Env {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

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

export async function onRequestGet(context: { request: Request; env: Env }) {
  const url = new URL(context.request.url);
  const action = url.searchParams.get('action');

  if (action === 'health') {
    const key = context.env.OPENAI_API_KEY || '';
    return new Response(
      JSON.stringify({
        success: true,
        health: {
          online: Boolean(key && key.length > 10),
          provider: key ? 'openai' : 'mock',
          model: context.env.OPENAI_MODEL || 'gpt-4o-mini',
        },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(JSON.stringify({ success: true, messages: [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body: any = await context.request.json();
    const { action, agentId, businessType, businessDescription, selectedNeeds, message, chatHistory } = body;

    if (action === 'send_message') {
      const apiKey = context.env.OPENAI_API_KEY;
      const model = context.env.OPENAI_MODEL || 'gpt-4o-mini';

      const userText = (message || '').trim();
      const phoneMatch = userText.match(PHONE_REGEX);
      const emailMatch = userText.match(EMAIL_REGEX);

      const aiMessages = (chatHistory || []).filter((m: any) => m.sender === 'ai');
      const lastAiMsg = (aiMessages[aiMessages.length - 1]?.text || '').toLowerCase();
      const askedForName = /name\b|who to contact|may i have your name/i.test(lastAiMsg);

      let extractedName: string | undefined;
      if (askedForName && !phoneMatch && !emailMatch && userText.split(/\s+/).length <= 4) {
        extractedName = extractCleanName(userText);
      }

      const hasPhone = Boolean(phoneMatch);
      const hasEmail = Boolean(emailMatch);
      const isLeadCaptured = hasPhone || hasEmail;

      let reply = '';

      if (apiKey && apiKey.length > 10) {
        const needsList = (selectedNeeds || []).join(', ') || 'general business communication';
        const systemPrompt = `You are an AI Agent representing a ${businessType || 'business'} on AI Emply.
${businessDescription ? `The business describes themselves as: "${businessDescription}".` : ''}
The business needs help with: ${needsList}.
Your role is to answer questions concisely (2-4 sentences max), qualify interest, and collect contact details naturally.
SAFETY: Never diagnose or provide medical treatment advice. Always maintain a professional, helpful tone.`;

        const messages = [
          { role: 'system', content: systemPrompt },
          ...(chatHistory || []).slice(-6).map((m: any) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          { role: 'user', content: userText },
        ];

        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (aiRes.ok) {
          const data: any = await aiRes.json();
          reply = data.choices?.[0]?.message?.content?.trim() || '';
        }
      }

      if (!reply) {
        reply = `I would be happy to help with your ${businessType || 'business'} requirements! Would you like me to connect you with our team for a personalized walkthrough?`;
      }

      return new Response(
        JSON.stringify({
          success: true,
          reply,
          intent: isLeadCaptured ? 'contact_sharing' : extractedName ? 'name_sharing' : 'general_query',
          actionTaken: isLeadCaptured ? 'lead_captured' : extractedName ? 'ask_contact' : undefined,
          leadCaptured: isLeadCaptured,
          leadData: {
            name: extractedName,
            phone: phoneMatch ? phoneMatch[0] : undefined,
            email: emailMatch ? emailMatch[0] : undefined,
          },
          source: apiKey ? 'openai' : 'mock',
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
