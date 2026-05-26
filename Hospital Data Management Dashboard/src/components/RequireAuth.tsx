import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-[#E3F2FD] border-t-[#1E88E5] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

