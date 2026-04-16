import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && !allowedRoles.includes(role)) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
