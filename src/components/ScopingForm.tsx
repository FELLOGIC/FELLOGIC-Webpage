import { motion } from "framer-motion";
import { useState } from "react";

const ScopingForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="scoping" className="py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-5">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-mono-label mb-4"
            >
              Engage
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-display text-3xl md:text-4xl text-slate-heading mb-4"
            >
              Request Technical Scoping.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm text-slate-body max-w-[45ch] leading-relaxed"
            >
              Define the platform, describe the objective, and receive a scoping document with architecture, timeline, and cost estimate within 48 hours.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="col-span-12 lg:col-span-6 lg:col-start-7"
          >
            {submitted ? (
              <div className="logic-card p-8 text-center">
                <div className="w-3 h-3 rounded-full bg-primary mx-auto mb-4" />
                <p className="font-display text-xl text-slate-heading">Scoping request received.</p>
                <p className="text-sm text-slate-body mt-2">You'll hear back within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="logic-card p-8 space-y-6">
                <div>
                  <label className="font-mono-label block mb-2">Platform</label>
                  <select
                    required
                    className="w-full px-4 py-3 text-sm bg-secondary border-0 rounded text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="">Select platform</option>
                    <option>Planview</option>
                    <option>Salesforce</option>
                    <option>ServiceNow</option>
                    <option>Multiple / Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono-label block mb-2">Objective</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the automation goal..."
                    className="w-full px-4 py-3 text-sm bg-secondary border-0 rounded text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="font-mono-label block mb-2">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 text-sm bg-secondary border-0 rounded text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-foreground text-primary-foreground text-sm font-medium rounded transition-colors hover:bg-foreground/90"
                >
                  Submit Scoping Request
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ScopingForm;
