import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!supabaseConfigured) {
  console.warn('Supabase credentials missing. Persistence features may be disabled.');
}

export const supabase = (supabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null) as SupabaseClient;

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseConfigured;
};
