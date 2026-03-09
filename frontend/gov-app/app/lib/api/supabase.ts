import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type SupabaseLike = any;

let supabase: SupabaseLike;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'gov-app-auth',
    },
  });
} else {
  if (typeof window !== 'undefined') {
    console.warn(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Supabase client will be a no-op stub.'
    );
  }
  // Minimal stub implementing the methods the app calls
  supabase = {
    auth: {
      signInWithPassword: async (_: { email: string; password: string }) => ({
        data: null,
        error: { message: 'Supabase not configured (missing NEXT_PUBLIC_SUPABASE_URL / KEY)' },
      }),
      signOut: async () => ({ error: { message: 'Supabase not configured' } }),
      onAuthStateChange: (_cb: any) => ({ data: null, subscription: { unsubscribe: () => {} } }),
    },
  };
}

export { supabase };

export const clearInvalidSession = async () => {
  try {
    if (supabase?.auth?.signOut) {
      await supabase.auth.signOut();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gov-app-auth');
      localStorage.removeItem('gov_auth');
      localStorage.removeItem('gov_username');
    }
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

// Optional: hook auth state change if available
try {
  supabase?.auth?.onAuthStateChange?.((event: string, session: any) => {
    if (event === 'TOKEN_REFRESHED') console.log('Token refreshed');
    if (event === 'SIGNED_OUT') console.log('Signed out');
    if (event === 'USER_UPDATED') console.log('User updated');
  });
} catch (e) {
  // ignore for stub
}