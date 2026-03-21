import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const gigs = [
  {
    id: "SN-001",
    platform: "ServiceNow",
    name: "CMDB Synchronization",
    outcome: "40% reduction in ticket latency",
    detail: "Bi-directional CMDB sync using ServiceNow REST APIs. Automated CI relationship mapping with validation logic to prevent data drift. Includes rollback triggers and audit logging.",
  },
  {
    id: "SF-001",
    platform: "Salesforce",
    name: "Lead Routing Engine",
    outcome: "3x faster lead assignment",
    detail: "Territory-based lead routing with round-robin fallback. Apex triggers with bulkified processing. Integrates with Slack for real-time rep notifications.",
  },
  {
    id: "PV-001",
    platform: "Planview",
    name: "Portfolio Demand Pipeline",
    outcome: "60% faster planning cycles",
    detail: "Automated demand intake from Jira/ADO into Planview portfolios. Scoring logic for priority ranking. OData integration with Power BI for executive dashboards.",
  },
  {
    id: "SF-002",
    platform: "Salesforce",
    name: "CPQ Data Sync",
    outcome: "Zero manual quote entry",
    detail: "ERP-to-Salesforce CPQ synchronization. Product catalog, pricing rules, and discount schedules automated via middleware. Error handling with dead-letter queues.",
  },
  {
    id: "SN-002",
    platform: "ServiceNow",
    name: "Change Management Workflow",
    outcome: "85% auto-approved standard changes",
    detail: "Risk-scored change requests with auto-approval for low-risk items. CAB scheduling automation. Integration with CI/CD pipelines for deployment tracking.",
  },
  {
    id: "PV-002",
    platform: "Planview",
    name: "Resource Capacity Balancing",
    outcome: "25% improved utilization",
    detail: "Real-time resource capacity analysis across portfolios. Automated rebalancing suggestions based on skill matching and availability. Alerts for over-allocation.",
  },
];

const GigList = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="gigs" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono-label mb-4"
        >
          Automation Gigs
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl md:text-4xl text-slate-heading mb-4"
        >
          Pre-scoped solutions.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm text-slate-body mb-12 max-w-[55ch]"
        >
          Each gig is a packaged automation with defined inputs, logic, and measurable outcomes. Click to view technical details.
        </motion.p>

        <div className="overflow-hidden rounded-xl shadow-logic-low bg-card">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border">
            <span className="col-span-2 font-mono-label">ID</span>
            <span className="col-span-2 font-mono-label">Platform</span>
            <span className="col-span-4 font-mono-label">Automation</span>
            <span className="col-span-4 font-mono-label">Outcome</span>
          </div>

          {gigs.map((gig, i) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <button
                onClick={() => setExpanded(expanded === gig.id ? null : gig.id)}
                className="w-full grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 text-left border-b border-border last:border-0 hover:bg-secondary/60 transition-colors"
              >
                <span className="col-span-2 font-mono text-xs text-muted-foreground">{gig.id}</span>
                <span className="col-span-2 text-sm font-medium text-slate-heading">{gig.platform}</span>
                <span className="col-span-4 text-sm text-slate-heading">{gig.name}</span>
                <span className="col-span-4 text-sm text-primary font-medium">{gig.outcome}</span>
              </button>
              <AnimatePresence>
                {expanded === gig.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-secondary/40 border-b border-border">
                      <p className="font-mono-label mb-2">Technical Note</p>
                      <p className="text-sm text-slate-body max-w-[70ch] leading-relaxed">{gig.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GigList;
