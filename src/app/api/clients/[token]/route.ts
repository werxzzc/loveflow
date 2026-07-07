import { createServiceClient } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createServiceClient();

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('token', token)
    .single();

  if (clientError || !client) {
    return Response.json({ error: 'Client not found' }, { status: 404 });
  }

  const { data: invitations, error: invError } = await supabase
    .from('invitations')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false });

  if (invError) return Response.json({ error: invError.message }, { status: 500 });

  // Update last_activity
  await supabase
    .from('clients')
    .update({ last_activity: new Date().toISOString() })
    .eq('id', client.id);

  return Response.json({ client, invitations: invitations ?? [] });
}
