'use client';
import { useSession } from 'next-auth/react';
import Login from './Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return fallback || <div>Loading...</div>;
  }

  if (!session) {
    return <Login />;
  }

  return <>{children}</>;
}
