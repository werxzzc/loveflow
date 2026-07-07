import { createServiceClient } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createServiceClient();

  const { data: result, error } = await supabase
    .from('results')
    .select('*')
    .eq('result_token', token)
    .single();

  if (error || !result) {
    return Response.json({ error: 'Results not found' }, { status: 404 });
  }

  const { data: invitation } = await supabase
    .from('invitations')
    .select('theme, title, girl_name')
    .eq('id', result.invitation_id)
    .single();

  return Response.json({
    result,
    invitation: invitation ?? { theme: 'sakura', title: '' },
  });
}
