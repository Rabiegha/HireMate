import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, logout } from '../store/slices/authSlice';
import { supabase } from '../lib/supabase';

const AuthHandler = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const restoreSession = async () => {
            const { data: session, error } = await supabase.auth.getSession();

            if (error || !session) {
                dispatch(logout());
                return;
            }

            const storedTimeStamp = JSON.parse(localStorage.getItem('authTimeStamp'));
            const currentTime = Date.now();
            const timeDifference = currentTime - storedTimeStamp;

            // Auto-logout if session is older than 7 days (adjust this if needed)
            if (timeDifference > 7 * 24 * 60 * 60 * 1000) {
                await supabase.auth.signOut();
                dispatch(logout());
                return;
            }

            dispatch(setUser(session.user));
        };

        restoreSession();

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
