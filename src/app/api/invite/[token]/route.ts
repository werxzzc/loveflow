import { createServiceClient } from '@/lib/supabase';
import { customAlphabet } from 'nanoid';
import { NextRequest } from 'next/server';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 12);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createServiceClient();

  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('id, girl_name, title, subtitle, welcome_message, description, final_message, theme, custom_colors, font, questions, status')
    .eq('token', token)
    .single();

  if (error || !invitation) {
    return Response.json({ error: 'Invitation not found' }, { status: 404 });
  }

  return Response.json(invitation);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createServiceClient();

  const { data: invitation, error: invError } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .single();

  if (invError || !invitation) {
    return Response.json({ error: 'Invitation not found' }, { status: 404 });
  }

  const body = await request.json();
  const { answers, time_taken_seconds } = body;

  const resultToken = `res_${nanoid()}`;
  const now = new Date().toISOString();

  const { data: result, error: resultError } = await supabase
    .from('results')
    .insert({
      invitation_id: invitation.id,
      result_token: resultToken,
      girl_name: invitation.girl_name,
      answers,
      time_taken_seconds: time_taken_seconds ?? 0,
      completed_at: now,
    })
    .select()
    .single();

  if (resultError) {
    return Response.json({ error: resultError.message }, { status: 500 });
  }

  // Mark invitation as completed
  await supabase
    .from('invitations')
    .update({ status: 'completed', completed_at: now })
    .eq('id', invitation.id);

  return Response.json({ result_token: result.result_token }, { status: 201 });
}
