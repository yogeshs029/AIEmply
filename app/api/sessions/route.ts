import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { SessionApiResponse } from '@/types/workflow';

export const dynamic = 'force-static';

// ─────────────────────────────────────────────────────────────
//  GET /api/sessions?sessionId=<uuid>
//  Returns the session row for the given session_id.
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest): Promise<NextResponse<SessionApiResponse>> {
  const sessionId = req.nextUrl.searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ success: false, error: 'sessionId query param required' }, { status: 400 });
  }

  try {
    const session = await db.getSession(sessionId);
    return NextResponse.json({ success: true, session: session ?? undefined });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Database error';
    console.error('[API GET /sessions]', msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
//  POST /api/sessions
//
//  action: "create"       — Idempotent session creation
//  action: "update_step1" — Save business_type & optional description, advance to step 2
//  action: "update_step2" — Save selected_needs, advance to step 3
//  action: "update_step3" — Save recommended_agent & source, advance to step 4
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse<SessionApiResponse>> {
  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { action } = body;

  try {
    // ── CREATE ──────────────────────────────────────────────────
    if (action === 'create') {
      const sessionId = body.sessionId as string;
      if (!sessionId) {
        return NextResponse.json({ success: false, error: 'sessionId is required' }, { status: 400 });
      }

      const session = await db.createSession(sessionId);
      return NextResponse.json({ success: true, session: session ?? undefined });
    }

    // ── UPDATE STEP 1 ───────────────────────────────────────────
    if (action === 'update_step1') {
      const sessionId = body.sessionId as string;
      const businessType = body.businessType as string;
      const businessDescription = body.businessDescription as string | undefined;

      if (!sessionId || !businessType) {
        return NextResponse.json(
          { success: false, error: 'sessionId and businessType are required' },
          { status: 400 }
        );
      }

      const session = await db.updateStep1(sessionId, businessType, businessDescription);
      return NextResponse.json({ success: true, session });
    }

    // ── UPDATE STEP 2 ───────────────────────────────────────────
    if (action === 'update_step2') {
      const sessionId = body.sessionId as string;
      const selectedNeeds = body.selectedNeeds as string[];

      if (!sessionId || !Array.isArray(selectedNeeds) || selectedNeeds.length === 0) {
        return NextResponse.json(
          { success: false, error: 'sessionId and a non-empty selectedNeeds array are required' },
          { status: 400 }
        );
      }

      const session = await db.updateStep2(sessionId, selectedNeeds);
      return NextResponse.json({ success: true, session });
    }

    // ── UPDATE STEP 3 ───────────────────────────────────────────
    if (action === 'update_step3') {
      const sessionId = body.sessionId as string;
      const recommendedAgent = body.recommendedAgent as string;
      const recommendationSource = (body.recommendationSource as 'automatic' | 'manual') || 'automatic';

      if (!sessionId || !recommendedAgent) {
        return NextResponse.json(
          { success: false, error: 'sessionId and recommendedAgent are required' },
          { status: 400 }
        );
      }

      const session = await db.updateStep3(sessionId, recommendedAgent, recommendationSource);
      return NextResponse.json({ success: true, session });
    }

    return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Database error';
    console.error(`[API POST /sessions action=${action}]`, msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
