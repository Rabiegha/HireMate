import { supabase } from '../lib/supabase';
import { setUser, logout } from '../store/slices/authSlice';
import type { User } from '@supabase/supabase-js';
import type { Dispatch } from '@reduxjs/toolkit';

/** ========================== LOGIN FUNCTION ========================== */
export const loginUser = async (
    email: string,
    password: string,
    dispatch: Dispatch
) => {
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
    });

    if (signInError) {
        throw new Error(
            signInError.message.includes('Invalid login credentials')
                ? 'Invalid email or password. Please check your credentials and try again.'
                : 'An error occurred during login. Please try again.'
        );
    }

    if (!user) throw new Error('No user returned after successful login');

    // Fetch additional user data from the database
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    if (userError) {
        console.error('Error fetching user data:', userError);
        dispatch(setUser({
            id: user.id,
            email: user.email!,
            subscription_tier: 'free',
            created_at: user.created_at,
        }));
    } else if (userData) {
        dispatch(setUser(userData));
    }

    return true; // Successful login
};

/** ========================== LOGOUT FUNCTION ========================== */
export const logoutUser = async (dispatch: Dispatch) => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message || 'Failed to log out');

    dispatch(logout());
};

/** ========================== SESSION RESTORATION ========================== */
export const restoreSession = async (dispatch: Dispatch) => {
    const { data, error } = await supabase.auth.getSession();
    console.log("Session from Supabase:", data.session, "Error:", error);


    if (error || !data.session) {
        dispatch(logout());
        return;
    }

    const storedTimeStamp = JSON.parse(localStorage.getItem('authTimeStamp') || '0');
    console.log("Stored timestamp:", storedTimeStamp);

    const currentTime = Date.now();
    const timeDifference = currentTime - storedTimeStamp;
    console.log("Time difference (ms):", timeDifference);

    // Auto-logout if session is older than 7 days
    if (timeDifference > 7 * 24 * 60 * 60 * 1000) {
        await supabase.auth.signOut();
        dispatch(logout());
        return;
    }

    dispatch(setUser(data.session.user as User));
};
