import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Initialize user session on app load
export const initializeAuth = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    if (session?.user) {
      // Get user data from the public users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user data:', userError);
        return null;
      }

      // If no user data exists, create it
      if (!userData) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{
            id: session.user.id,
            email: session.user.email!,
            subscription_tier: 'free'
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user data:', insertError);
          return null;
        }

        return newUser;
      }

      return userData;
    }

    return null;
  } catch (error) {
    console.error('Error initializing auth:', error);
    return null;
  }
};