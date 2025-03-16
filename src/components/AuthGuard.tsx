import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  // If the session restoration is in progress, show a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // If restoration is complete but no user is found, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected children
  return <>{children}</>;
};

export default AuthGuard;
