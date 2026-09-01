import { CustomerEnquiryPayload, EnquirySubmissionResponse } from '@/types/enquiry';

// ─────────────────────────────────────────────────────────────
//  Customer Enquiry Service — AI Emply Step 5
// ─────────────────────────────────────────────────────────────

const BASE = '/api/enquiries';

/**
 * Optional lifecycle hook for future integrations (Email, Slack, CRM, Webhook).
 * This will be invoked whenever a new enquiry is successfully created.
 */
export async function onEnquiryCreated(
  enquiry: any,
  payload: CustomerEnquiryPayload
): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    console.log('[EnquiryService] New customer enquiry created:', {
      id: enquiry.id,
      name: payload.fullName,
      business: payload.businessName,
      agent: payload.recommendedAgent,
      businessType: payload.businessType,
    });
  }
}

/**
 * Submits the final Step 5 Customer Enquiry
 */
export async function submitCustomerEnquiry(
  payload: CustomerEnquiryPayload
): Promise<EnquirySubmissionResponse> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMsg = `Enquiry submission failed (${res.status})`;
    try {
      const errJson = await res.json();
      if (errJson.error) errorMsg = errJson.error;
    } catch {}
    throw new Error(errorMsg);
  }

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to submit enquiry');
  }

  if (json.enquiry && !json.isDuplicate) {
    await onEnquiryCreated(json.enquiry, payload);
  }

  return json;
}

/**
 * Fetches demo lead data (name, phone, email) if captured in Step 4 for prefilling
 */
export async function fetchDemoLeadForPrefill(sessionId: string): Promise<{
  name?: string;
  phone?: string;
  email?: string;
} | null> {
  try {
    const res = await fetch(`${BASE}?sessionId=${encodeURIComponent(sessionId)}&action=prefill`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success && json.lead ? json.lead : null;
  } catch (err) {
    console.warn('[EnquiryService] fetchDemoLeadForPrefill failed:', err);
    return null;
  }
}
