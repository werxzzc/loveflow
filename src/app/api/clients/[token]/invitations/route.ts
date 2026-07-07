import { createServiceClient } from '@/lib/supabase';
import { customAlphabet } from 'nanoid';
import { NextRequest } from 'next/server';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 12);

export async function POST(
  request: NextRequest,
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

  if (client.credits_used >= client.credits_total) {
    return Response.json({ error: 'No credits remaining' }, { status: 403 });
  }

  const body = await request.json();
  const {
    girl_name, title, subtitle, welcome_message,
    description, final_message, theme, questions,
    font, custom_colors,
  } = body;

  const invToken = `inv_${nanoid()}`;

  const { data: invitation, error: invError } = await supabase
    .from('invitations')
    .insert({
      client_id: client.id,
      token: invToken,
      girl_name: girl_name || 'My Love',
      title: title || 'Will You Go Out With Me?',
      subtitle: subtitle || '',
      welcome_message: welcome_message || '',
      description: description || '',
      final_message: final_message || 'Thank you for answering! ❤️',
      theme: theme || 'sakura',
      custom_colors: custom_colors || {},
      font: font || 'Inter',
      questions: questions || [],
      status: 'pending',
    })
    .select()
    .single();

  if (invError) return Response.json({ error: invError.message }, { status: 500 });

  // Increment credits_used
  await supabase
    .from('clients')
    .update({
      credits_used: client.credits_used + 1,
      last_activity: new Date().toISOString(),
    })
    .eq('id', client.id);

  return Response.json(invitation, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await request.json();
  const { invitationId } = body;

  const supabase = createServiceClient();

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('token', token)
    .single();

  if (!client) return Response.json({ error: 'Client not found' }, { status: 404 });

  const { error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', invitationId)
    .eq('client_id', client.id);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Decrement credits_used
  if (client.credits_used > 0) {
    await supabase
      .from('clients')
      .update({ credits_used: client.credits_used - 1 })
      .eq('id', client.id);
  }

  return Response.json({ success: true });
}
