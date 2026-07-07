import { createServiceClient } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, telegram, credits_total, comment, status } = body;

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('clients')
      .update({
        name,
        telegram: telegram || null,
        credits_total,
        comment: comment || null,
        status,
        last_activity: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data);
  } catch (err: any) {
    return Response.json({ error: err.message || 'Database error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();

    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message || 'Database error' }, { status: 500 });
  }
}

