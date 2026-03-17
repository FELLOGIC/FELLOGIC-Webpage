import { UserPlus, UserCog, Upload, BarChart3, PieChart, Server } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const automations = [
  {
    id: "create-user",
    icon: UserPlus,
    title: "Create User",
    description: "Provision a new user account across Planview, ServiceNow, and Active Directory with a single form submission.",
    inputType: "Form",
    platform: "Cross-Platform",
  },
  {
    id: "update-user",
    icon: UserCog,
    title: "Update User",
    description: "Modify user attributes, roles, and permissions across connected platforms simultaneously.",
    inputType: "Form",
    platform: "Cross-Platform",
  },
  {
    id: "bulk-upload",
    icon: Upload,
    title: "Bulk User Upload",
    description: "Upload a CSV file to create or update multiple users across systems in a single batch operation.",
    inputType: "File Upload",
    platform: "Cross-Platform",
  },
  {
    id: "job-stream-report",
    icon: BarChart3,
    title: "Planview Job Stream Report",
    description: "Generate detailed job stream reports from Planview with customizable date ranges and filters.",
    inputType: "Form",
    platform: "Planview",
  },
  {
    id: "portfolio-report",
    icon: PieChart,
    title: "Portfolio Report",
    description: "Create comprehensive portfolio analysis reports combining Planview project data with financial metrics.",
    inputType: "Form",
    platform: "Planview",
  },
  {
    id: "cmdb-sync",
    icon: Server,
    title: "CMDB Synchronization",
    description: "Synchronize configuration items between ServiceNow CMDB and infrastructure discovery sources.",
    inputType: "Form",
    platform: "ServiceNow",
  },
];

const AutomationCatalog = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const filtered = automations.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.platform.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display">Automation Catalog</h1>
          <p className="text-muted-foreground text-sm mt-1">Browse and launch available automation services.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Filter automations…" className="pl-9 bg-secondary" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((a) => (
          <Card
            key={a.id}
            className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer group"
            onClick={() => navigate(`/automations/${a.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <a.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">{a.inputType}</Badge>
              </div>
              <h3 className="font-medium text-sm mb-1.5">{a.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{a.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px]">{a.platform}</Badge>
                <Button size="sm" variant="ghost" className="text-xs text-primary h-7 px-3">
                  Launch →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AutomationCatalog;
