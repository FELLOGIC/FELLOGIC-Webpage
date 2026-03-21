import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { CalendarClock, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ease = [0.25, 0.1, 0.25, 1] as const;

const Dashboard = () => {
  const { isReady, session, logout } = useAuth();

  if (isReady && !session) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]"
      >
        <Card className="border-border/60 bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <ShieldCheck className="size-7 text-primary" />
              Session active
            </CardTitle>
            <CardDescription>
              This route is protected and only renders when a valid browser session exists.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-muted-foreground">
            <div className="rounded-xl border border-border/60 bg-secondary/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-primary/80">Signed in as</p>
              <p className="mt-2 text-lg font-medium text-foreground">{session?.email ?? "Loading..."}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 p-4">
                <p className="font-medium text-foreground">Created</p>
                <p className="mt-2">{session ? new Date(session.createdAt).toLocaleString() : "Loading..."}</p>
              </div>
              <div className="rounded-xl border border-border/60 p-4">
                <p className="font-medium text-foreground">Expires</p>
                <p className="mt-2">{session ? new Date(session.expiresAt).toLocaleString() : "Loading..."}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CalendarClock className="size-6 text-primary" />
              What works now
            </CardTitle>
            <CardDescription>
              The login flow now covers the critical pieces a session-based frontend needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <ul className="space-y-3">
              <li>• Credentials are validated before the user enters the protected area.</li>
              <li>• Sessions persist through refreshes via browser storage.</li>
              <li>• Invalid or expired sessions are cleared automatically.</li>
              <li>• Logout removes the session immediately.</li>
            </ul>
            <Button className="w-full" variant="outline" onClick={logout}>
              <LogOut className="mr-2 size-4" />
              End session
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
};

export default Dashboard;
