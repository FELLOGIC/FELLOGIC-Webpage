import { motion } from "framer-motion";

const platforms = [
  {
    name: "Planview",
    tag: "PPM · Work Management",
    description: "Portfolio optimization, resource allocation automation, and cross-project dependency mapping. Reduce planning cycles by up to 60%.",
    connects: ["Jira", "ADO", "Power BI", "SAP"],
    outcomes: ["Portfolio Sync", "Resource Balancing", "Demand Pipeline"],
    status: "Platform Ready",
  },
  {
    name: "Salesforce",
    tag: "CRM · Revenue Ops",
    description: "Lead routing logic, opportunity stage automation, and bi-directional data sync with ERP systems. Clean pipeline, faster close.",
    connects: ["NetSuite", "HubSpot", "Slack", "ServiceNow"],
    outcomes: ["Lead Routing", "CPQ Automation", "Data Sync"],
    status: "Platform Ready",
  },
  {
    name: "ServiceNow",
    tag: "ITSM · Operations",
    description: "Incident triage automation, CMDB synchronization, and change management workflows. Cut ticket latency by 40%.",
    connects: ["Salesforce", "Planview", "Datadog", "PagerDuty"],
    outcomes: ["CMDB Sync", "Incident Triage", "Change Automation"],
    status: "Platform Ready",
  },
];

const PlatformCards = () => {
  return (
    <section id="platforms" className="py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono-label mb-4"
        >
          Platform Interfaces
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl md:text-4xl text-slate-heading mb-4"
        >
          The connective tissue of your stack.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm text-slate-body mb-16 max-w-[55ch]"
        >
          Each platform becomes a node in a unified data flow. FELLOGIC sits between them — transforming, validating, and routing.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, ease: [0.2, 0, 0, 1] }}
              className="logic-card p-6 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-mono-label">{platform.status}</span>
              </div>
              <h3 className="font-display text-2xl text-slate-heading mt-4">{platform.name}</h3>
              <p className="font-mono-label mt-1 !text-primary">{platform.tag}</p>
              <p className="text-sm leading-relaxed text-slate-body mt-4 flex-1">{platform.description}</p>

              {/* Interface connections */}
              <div className="mt-5 pt-4 border-t border-border">
                <p className="font-mono-label mb-2">Interfaces with</p>
                <div className="flex flex-wrap gap-1.5">
                  {platform.connects.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono bg-secondary text-muted-foreground rounded">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {platform.outcomes.map((o) => (
                  <span key={o} className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded">
                    {o}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cross-platform interface visual */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 logic-card p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <p className="font-mono-label mb-2">Cross-Platform Data Flow</p>
              <p className="text-sm text-slate-body max-w-[50ch]">
                Every integration is bi-directional. Data flows through FELLOGIC's validation layer before reaching any target system — ensuring consistency, compliance, and auditability.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono shrink-0">
              <span className="px-3 py-2 bg-secondary rounded text-foreground">Planview</span>
              <span className="text-primary">⟷</span>
              <span className="px-3 py-2 bg-primary/5 border border-primary/20 rounded text-primary font-medium">FELLOGIC</span>
              <span className="text-primary">⟷</span>
              <span className="px-3 py-2 bg-secondary rounded text-foreground">Salesforce</span>
              <span className="text-primary">⟷</span>
              <span className="px-3 py-2 bg-primary/5 border border-primary/20 rounded text-primary font-medium">FELLOGIC</span>
              <span className="text-primary">⟷</span>
              <span className="px-3 py-2 bg-secondary rounded text-foreground">ServiceNow</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformCards;
