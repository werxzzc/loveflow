import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  return url.startsWith('http://') || url.startsWith('https://');
};

export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// Server-side client with service role (bypasses RLS) — server only
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!isValidUrl(supabaseUrl) || !serviceKey) {
    throw new Error('Supabase URL or Service Role Key is missing or invalid in your .env.local file.');
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}

