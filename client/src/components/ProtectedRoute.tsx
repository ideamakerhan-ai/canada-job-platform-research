import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { getLoginUrl } from "@/const";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "employer" | "job_seeker";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (loading) return;

    // 로그인하지 않은 경우
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    // 역할이 지정된 경우 권한 확인
    if (requiredRole && user?.role !== requiredRole) {
      navigate("/");
      return;
    }
  }, [loading, isAuthenticated, user, requiredRole, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
