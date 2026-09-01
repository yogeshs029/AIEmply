import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chatService } from '@/services/chatService';
import { getAIAgentById } from '@/config/aiAgents';
import { DemoChatMessage } from '@/types/demoChat';

// ─────────────────────────────────────────────────────────────
//  GET /api/demo-chat?sessionId=<id>
//  Returns the chat history for the session or checks health
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  const action = req.nextUrl.searchParams.get('action');

  if (action === 'health') {
    const health = await chatService.healthCheck();
    return NextResponse.json({ success: true, health });
  }

  if (!sessionId) {
    return NextResponse.json({ success: false, error: 'sessionId required' }, { status: 400 });
  }

  try {
    const rawMessages = await db.getDemoChatMessages(sessionId);
    const messages: DemoChatMessage[] = rawMessages.map((m: any) => ({
      id: m.id,
      sender: m.role as 'user' | 'ai' | 'system',
      text: m.content,
      timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intent: m.intent || undefined,
      isLeadCaptured: m.metadata?.isLeadCaptured || false,
      metadata: m.metadata || undefined,
    }));

    return NextResponse.json({ success: true, messages });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
//  POST /api/demo-chat
//  Actions: 'send_message' | 'save_message' | 'complete_demo'
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: Record<string, any>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { action, sessionId } = body;
  if (!sessionId) {
    return NextResponse.json({ success: false, error: 'sessionId required' }, { status: 400 });
  }

  try {
    // ── SEND MESSAGE ────────────────────────────────────────────
    if (action === 'send_message') {
      const { agentId, businessType, businessDescription, selectedNeeds, message, chatHistory } = body;
      const agent = getAIAgentById(agentId);

      // 1. Asynchronously persist user message
      await db.saveDemoChatMessage(
        sessionId,
        agent.id,
        'user',
        message,
        'user_input'
      );

      // 2. Generate contextual response through multi-provider ChatService (OpenAI -> Ollama -> Mock fallback)
      const response = await chatService.generateResponse({
        sessionId,
        businessType,
        businessDescription,
        selectedNeeds,
        agent,
        userMessage: message,
        chatHistory: chatHistory || [],
      });

      // 3. Asynchronously persist AI message
      await db.saveDemoChatMessage(
        sessionId,
        agent.id,
        'ai',
        response.reply,
        response.intent,
        {
          actionTaken: response.actionTaken,
          leadCaptured: response.leadCaptured,
          source: response.source,
          modelUsed: response.modelUsed,
        }
      );

      // 4. If lead was captured, save lead to demo_leads table
      if (response.leadCaptured && response.leadData) {
        await db.saveDemoLead(
          sessionId,
          agent.id,
          businessType || 'default',
          response.leadData,
          `Captured during conversation: ${message}`
        );

        // Also save system notification message to chat table
        await db.saveDemoChatMessage(
          sessionId,
          agent.id,
          'system',
          '✨ Customer enquiry captured successfully. Logged to workspace.',
          'lead_captured_event',
          { isLeadCaptured: true }
        );
      }

      // 5. Update session to mark interaction if 3+ messages
      const totalUserMsgs = (chatHistory || []).filter((m: any) => m.sender === 'user').length + 1;
      if (totalUserMsgs >= 3 || response.leadCaptured) {
        await db.updateDemoCompleted(sessionId, 4);
      }

      return NextResponse.json({
        success: true,
        reply: response.reply,
        intent: response.intent,
        actionTaken: response.actionTaken,
        leadCaptured: response.leadCaptured,
        leadData: response.leadData,
        source: response.source,
        modelUsed: response.modelUsed,
      });
    }

    // ── SAVE SINGLE MESSAGE (e.g. Greeting) ─────────────────────
    if (action === 'save_message') {
      const { agentId, role, content, intent, metadata } = body;
      const res = await db.saveDemoChatMessage(
        sessionId,
        agentId || 'business_assistant',
        role || 'ai',
        content,
        intent,
        metadata
      );
      return NextResponse.json({ success: true, messageId: res.id });
    }

    // ── COMPLETE DEMO ───────────────────────────────────────────
    if (action === 'complete_demo') {
      const updated = await db.updateDemoCompleted(sessionId, 5);
      return NextResponse.json({ success: true, session: updated });
    }

    return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error';
    console.error(`[API /api/demo-chat action=${action}]`, msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
