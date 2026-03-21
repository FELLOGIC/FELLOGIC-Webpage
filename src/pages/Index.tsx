import { motion } from "framer-motion";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_CREDENTIALS } from "@/lib/auth";

const ease = [0.25, 0.1, 0.25, 1] as const;

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isReady, login } = useAuth();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [error, setError] = useState("");

  if (isReady && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = login(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError("");
    navigate("/dashboard");
  };

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1, ease }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        />
      </div>

      <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center gap-10 px-6 py-12 lg:flex-row lg:items-center lg:gap-16">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-xl space-y-5 text-left"
        >
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary/90">
            Working session login
          </span>
          <h1 className="text-5xl font-medium tracking-tighter text-foreground md:text-7xl [text-wrap:balance]">
            Fellogic now keeps users signed in.
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground md:text-xl [text-wrap:pretty]">
            Sign in to create a persisted session, reach the protected dashboard, and return later without logging in again until the session expires.
          </p>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur">
              <p className="font-medium text-foreground">Session persistence</p>
              <p className="mt-1">Stored in local browser storage and restored on page refresh.</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur">
              <p className="font-medium text-foreground">Protected route</p>
              <p className="mt-1">Only authenticated visitors can reach the dashboard route.</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="w-full max-w-md"
        >
          <Card className="border-border/60 bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>
                Use the seeded demo account below to verify the full login session flow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      className="pl-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error ? (
                  <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                ) : null}

                <Button className="w-full" type="submit">
                  Start session
                </Button>
              </form>

              <div className="mt-6 rounded-xl border border-border/60 bg-secondary/60 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Demo credentials</p>
                <p className="mt-2 font-mono text-xs text-primary">{DEMO_CREDENTIALS.email}</p>
                <p className="mt-1 font-mono text-xs text-primary">{DEMO_CREDENTIALS.password}</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </>
  );
};

export default Index;
