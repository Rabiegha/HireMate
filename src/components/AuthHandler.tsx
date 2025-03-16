import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, logout } from '../store/slices/authSlice';
import { supabase } from '../lib/supabase';
import { restoreSession } from '../services/authService';

const AuthHandler = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        restoreSession(dispatch);

        // Supabase listener for session changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                dispatch(setUser(session.user));
            } else {
                dispatch(logout());
            }
        });

        return () => authListener.subscription.unsubscribe();
    }, [dispatch]);

    return null;
};

export default AuthHandler;
