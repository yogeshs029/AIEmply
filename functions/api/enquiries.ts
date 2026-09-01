// =====================================================
//  Cloudflare Pages Function: /api/enquiries
// =====================================================

export async function onRequestPost(context: { request: Request }) {
  try {
    const body: any = await context.request.json();
    return new Response(
      JSON.stringify({
        success: true,
        enquiry: {
          id: crypto.randomUUID(),
          ...body,
          created_at: new Date().toISOString(),
        },
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
