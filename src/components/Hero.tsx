import { motion } from "framer-motion";
import FellogicLogo from "./FellogicLogo";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
              className="font-mono-label mb-6"
            >
              The interface between your platforms
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.2, 0, 0, 1] }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-slate-heading text-balance leading-[1.05]"
            >
              Your systems talk.
              <br />
              <span className="text-primary">I make them understand.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0, 0, 1] }}
              className="mt-6 text-base leading-relaxed text-slate-body max-w-[58ch]"
            >
              FELLOGIC is the integration layer between Planview, Salesforce, and ServiceNow.
              Engineered connectors that transform, validate, and route data across your enterprise stack — so your platforms work as one.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.2, 0, 0, 1] }}
              className="mt-10 flex gap-4"
            >
              <a
                href="#scoping"
                className="inline-flex items-center px-6 py-3 bg-foreground text-primary-foreground text-sm font-medium rounded transition-colors hover:bg-foreground/90"
              >
                Request Technical Scoping
              </a>
              <a
                href="#platforms"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-slate-body shadow-logic-low rounded transition-all hover:shadow-logic-high"
              >
                View Integrations
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0, 0, 1] }}
            className="col-span-12 lg:col-span-5 hidden lg:flex justify-end"
          >
            <InterfaceDiagram />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/** Shows FELLOGIC as the interface layer between 3 platform nodes */
const InterfaceDiagram = () => (
  <svg viewBox="0 0 360 420" className="w-full max-w-[320px]" fill="none">
    {/* Left platform column */}
    {[
      { y: 30, label: "Planview", sub: "PPM" },
      { y: 160, label: "Salesforce", sub: "CRM" },
      { y: 290, label: "ServiceNow", sub: "ITSM" },
    ].map((p, i) => (
      <motion.g key={p.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
        <rect x="0" y={p.y} width="110" height="56" rx="6" className="fill-secondary stroke-border" strokeWidth="1" />
        <text x="55" y={p.y + 28} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 500, fontFamily: 'monospace' }}>{p.label}</text>
        <text x="55" y={p.y + 43} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9, fontFamily: 'monospace' }}>{p.sub}</text>
      </motion.g>
    ))}

    {/* Connection lines: platforms → FELLOGIC */}
    {[58, 188, 318].map((y, i) => (
      <motion.g key={`conn-${i}`}>
        <motion.line x1="110" y1={y} x2="145" y2={210}
          className="stroke-primary" strokeWidth="1" strokeDasharray="3 3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
        />
        {/* Small dot at connection point */}
        <motion.circle cx="110" cy={y} r="2.5" className="fill-primary"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 + i * 0.1 }}
        />
      </motion.g>
    ))}

    {/* FELLOGIC center node */}
    <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
      <rect x="145" y="175" width="130" height="70" rx="8" className="stroke-primary" strokeWidth="1.5" fill="hsl(221 83% 53% / 0.04)" />
      {/* Interface brackets inside */}
      <path d="M165 195L158 210L165 225" stroke="hsl(221 83% 53%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M255 195L262 210L255 225" stroke="hsl(221 83% 53%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="210" cy="210" r="3.5" fill="hsl(221 83% 53%)" />
      <text x="210" y="256" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 500, fontFamily: 'monospace' }}>FELLOGIC</text>
      <text x="210" y="270" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8, fontFamily: 'monospace' }}>interface layer</text>
    </motion.g>

    {/* Connection lines: FELLOGIC → outputs */}
    {[58, 188, 318].map((y, i) => (
      <motion.g key={`out-${i}`}>
        <motion.line x1="275" y1={210} x2="290" y2={y}
          className="stroke-primary" strokeWidth="1" strokeDasharray="3 3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
        />
        <motion.circle cx="290" cy={y} r="2.5" className="fill-primary"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.3 + i * 0.1 }}
        />
      </motion.g>
    ))}

    {/* Right output column — the transformed outputs */}
    {[
      { y: 30, label: "Portfolios", sub: "synced" },
      { y: 160, label: "Pipelines", sub: "routed" },
      { y: 290, label: "Incidents", sub: "triaged" },
    ].map((p, i) => (
      <motion.g key={p.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 + i * 0.1 }}>
        <rect x="290" y={p.y} width="70" height="56" rx="6" className="fill-secondary stroke-border" strokeWidth="1" />
        <text x="325" y={p.y + 28} textAnchor="middle" className="fill-foreground" style={{ fontSize: 9, fontWeight: 500, fontFamily: 'monospace' }}>{p.label}</text>
        <text x="325" y={p.y + 42} textAnchor="middle" className="fill-primary" style={{ fontSize: 8, fontFamily: 'monospace' }}>{p.sub}</text>
      </motion.g>
    ))}

    {/* Pulse indicator */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
      <circle cx="210" cy="400" r="3" className="fill-primary" />
      <text x="210" y="415" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8, fontFamily: 'monospace' }}>CONNECTED</text>
    </motion.g>
  </svg>
);

export default Hero;
