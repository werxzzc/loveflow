import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Invalid password' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set('lf_admin_session', 'authenticated', {
    httpOnly: true,
    path: '/',
    maxAge: 86400,
    sameSite: 'lax',
  });

  return Response.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('lf_admin_session');
  return Response.json({ success: true });
}
