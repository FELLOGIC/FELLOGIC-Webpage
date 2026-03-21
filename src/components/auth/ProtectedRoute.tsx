import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return (
      <main className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Restoring session...
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
