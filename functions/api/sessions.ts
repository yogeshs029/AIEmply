// =====================================================
//  Cloudflare Pages Function: /api/sessions
// =====================================================

export async function onRequestGet(context: { request: Request }) {
  const url = new URL(context.request.url);
  const sessionId = url.searchParams.get('sessionId') || '';

  return new Response(
    JSON.stringify({
      success: true,
      session: {
        session_id: sessionId,
        current_step: 1,
        status: 'in_progress',
      },
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

export async function onRequestPost(context: { request: Request }) {
  try {
    const body: any = await context.request.json();
    return new Response(
      JSON.stringify({
        success: true,
        session: body,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
