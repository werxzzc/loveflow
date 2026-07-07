import { createServiceClient } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();
    const { data: invitation, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !invitation) {
      return Response.json({ error: 'Invitation not found' }, { status: 404 });
    }

    return Response.json(invitation);
  } catch (err: any) {
    return Response.json({ error: err.message || 'Database error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      girl_name, title, subtitle, welcome_message,
      description, final_message, theme, questions,
      font, custom_colors,
    } = body;

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('invitations')
      .update({
        girl_name,
        title,
        subtitle,
        welcome_message,
        description,
        final_message,
        theme,
        custom_colors,
        font,
        questions,
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

