import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

export async function POST(req: NextRequest) {
  try {
    const { messages, industryId, role } = await req.json();

    // System prompt tailored for the specific AI Employee persona
    const systemPrompt = `You are a professional AI Employee for Arhan Enterprises working as a "${role}" in the "${industryId}" industry.
Your goal is to assist customers warmly, answer questions accurately, remember previous conversation context, ask qualifying questions when appropriate (such as date, time, name, or phone number), capture lead details, and provide an exceptional representative experience.
Keep your responses concise (2-4 sentences max), helpful, professional, and directly relevant to what the user just said in context.
Do NOT repeat default generic canned taglines if the user provides a specific answer like a date, time, or question. Always answer contextually as the "${role}".`;

    // 1. Check if Ollama is running and list available models
    let activeModel = 'llama3.2';
    let isOllamaOnline = false;

    try {
      const tagsRes = await fetch(`${OLLAMA_HOST}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(1500),
      });

      if (tagsRes.ok) {
        const data = await tagsRes.json();
        if (data.models && data.models.length > 0) {
          isOllamaOnline = true;
          const modelNames = data.models.map((m: any) => m.name);
          const preferred = ['llama3.2', 'llama3', 'mistral', 'gemma', 'phi3', 'qwen2.5', 'codellama', 'myassistant'];
          const matched = preferred.find((p) => modelNames.some((m: string) => m.startsWith(p)));
          activeModel = matched ? modelNames.find((m: string) => m.startsWith(matched)) : modelNames[0];
        }
      }
    } catch (e) {
      isOllamaOnline = false;
    }

    if (!isOllamaOnline) {
      return NextResponse.json({
        available: false,
        reason: 'Ollama server not reachable at http://127.0.0.1:11434',
      });
    }

    // Format full multi-turn conversation history for Ollama
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    ];

    // Query Ollama chat API
    const ollamaRes = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: activeModel,
        messages: formattedMessages,
        stream: false,
        options: {
          temperature: 0.7,
        },
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!ollamaRes.ok) {
      throw new Error(`Ollama returned status ${ollamaRes.status}`);
    }

    const result = await ollamaRes.json();
    const replyText = result.message?.content?.trim() || '';

    // Check if reply triggers lead capture notification
    const triggerLeadCapture = /contact|phone|email|schedule|consultation|book|slot|details|name|number|confirm/i.test(replyText);

    return NextResponse.json({
      available: true,
      source: 'ollama',
      model: activeModel,
      reply: replyText,
      triggerLeadCapture,
    });
  } catch (error: any) {
    console.error('Ollama API route error:', error?.message);
    return NextResponse.json({
      available: false,
      error: error?.message || 'Failed to communicate with local Ollama instance.',
    });
  }
}

// GET endpoint to check Ollama connection status
export async function GET() {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        online: true,
        host: OLLAMA_HOST,
        models: data.models || [],
      });
    }
  } catch (e) {}

  return NextResponse.json({ online: false, host: OLLAMA_HOST });
}
