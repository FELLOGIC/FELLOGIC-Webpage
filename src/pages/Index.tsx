import { motion } from "framer-motion";
import { useState } from "react";

const ease = [0.25, 0.1, 0.25, 1] as const;

const Index = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <>
      {/* Grid background */}
      <div className="fixed inset-0 -z-10 bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1, ease }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        />
      </div>

      <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="space-y-3 mb-10"
        >
          <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-primary/80">
            Status: In Development
          </span>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground [text-wrap:balance]">
            Fellogic is being developed.
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[400px] mx-auto [text-wrap:pretty]">
            Building something I would like to use, hopefully! Come back soon.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="w-full max-w-sm"
        >
          <p className="mt-6 text-[10px] text-muted-foreground/40 font-mono uppercase tracking-[0.15em]">
            © 2025 Fellogic
          </p>
        </motion.div>
      </main>
    </>
  );
};

export default Index;
