import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CustomerEnquiryPayload } from '@/types/enquiry';

// ─────────────────────────────────────────────────────────────
//  GET /api/enquiries?sessionId=<id>&action=prefill
//  Returns pre-fill data or existing submitted enquiry
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  const action = req.nextUrl.searchParams.get('action');

  if (!sessionId) {
    return NextResponse.json({ success: false, error: 'sessionId required' }, { status: 400 });
  }

  try {
    if (action === 'prefill') {
      const demoLead = await db.getDemoLeadBySessionId(sessionId);
      return NextResponse.json({
        success: true,
        lead: demoLead
          ? {
              name: demoLead.name || undefined,
              phone: demoLead.phone || undefined,
              email: demoLead.email || undefined,
            }
          : null,
      });
    }

    const existingEnquiry = await db.getCustomerEnquiry(sessionId);
    return NextResponse.json({ success: true, enquiry: existingEnquiry });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
//  POST /api/enquiries
//  Submits the final Step 5 Customer Enquiry
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: CustomerEnquiryPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { sessionId, fullName, businessName, email, phone } = body;

  // Validation
  if (!sessionId) {
    return NextResponse.json({ success: false, error: 'sessionId required' }, { status: 400 });
  }
  if (!fullName || !fullName.trim()) {
    return NextResponse.json({ success: false, error: 'Full name is required' }, { status: 400 });
  }
  if (!businessName || !businessName.trim()) {
    return NextResponse.json({ success: false, error: 'Business name is required' }, { status: 400 });
  }
  if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ success: false, error: 'A valid email address is required' }, { status: 400 });
  }
  if (!phone || !phone.trim() || phone.replace(/\D/g, '').length < 7) {
    return NextResponse.json({ success: false, error: 'A valid phone number is required' }, { status: 400 });
  }

  try {
    const result = await db.createCustomerEnquiry(body);
    return NextResponse.json({
      success: true,
      enquiry: result.enquiry,
      isDuplicate: result.isDuplicate,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to save enquiry';
    console.error('[API /api/enquiries error]', msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
