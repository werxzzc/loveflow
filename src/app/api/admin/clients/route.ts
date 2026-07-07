import { createServiceClient } from '@/lib/supabase';
import { customAlphabet } from 'nanoid';
import { NextRequest } from 'next/server';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 12);

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data);
  } catch (err: any) {
    return Response.json({ error: err.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, telegram, credits_total, comment } = body;

    const supabase = createServiceClient();
    const token = nanoid();

    const { data, error } = await supabase
      .from('clients')
      .insert({
        name,
        telegram: telegram || null,
        token,
        credits_total: credits_total ?? 3,
        credits_used: 0,
        status: 'active',
        comment: comment || null,
        last_activity: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data, { status: 201 });
  } catch (err: any) {
    return Response.json({ error: err.message || 'Database error' }, { status: 500 });
  }
}

