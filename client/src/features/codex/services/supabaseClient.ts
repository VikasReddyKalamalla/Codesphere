import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getSupabaseCredentials = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('codesphere_supabase_url') || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('codesphere_supabase_anon_key') || '' : '';

  const url = localUrl || envUrl;
  const key = localKey || envKey;

  const isConfigured = Boolean(
    url &&
    key &&
    url !== 'https://placeholder.supabase.co' &&
    !url.includes('placeholder')
  );

  return { url, key, isConfigured };
};

const creds = getSupabaseCredentials();

export const isSupabaseConfigured = creds.isConfigured;

// Graceful client creation
export const supabase: SupabaseClient = creds.isConfigured
  ? createClient(creds.url, creds.key)
  : (createClient('https://mock.supabase.co', 'mock-anon-key', {
      auth: { persistSession: false, autoRefreshToken: false },
    }) as SupabaseClient);
