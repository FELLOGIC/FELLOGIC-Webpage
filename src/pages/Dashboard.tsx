import { Activity, CheckCircle2, XCircle, Clock, Zap, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Running", value: 3, icon: Activity, className: "status-running" },
  { label: "Completed", value: 47, icon: CheckCircle2, className: "status-completed" },
  { label: "Failed", value: 2, icon: XCircle, className: "status-failed" },
  { label: "Queued", value: 5, icon: Clock, className: "status-queued" },
];

const recentJobs = [
  { id: "JOB-1247", name: "Bulk User Upload", status: "Running", time: "2 min ago", user: "F. Levy" },
  { id: "JOB-1246", name: "Planview Job Stream Report", status: "Completed", time: "15 min ago", user: "F. Levy" },
  { id: "JOB-1245", name: "Create User", status: "Completed", time: "1 hr ago", user: "S. Chen" },
  { id: "JOB-1244", name: "Portfolio Report", status: "Failed", time: "2 hr ago", user: "F. Levy" },
  { id: "JOB-1243", name: "Update User", status: "Completed", time: "3 hr ago", user: "A. Park" },
];

const quickAutomations = [
  { name: "Create User", type: "Form" },
  { name: "Bulk User Upload", type: "File Upload" },
  { name: "Planview Report", type: "Form" },
];

const statusClasses: Record<string, string> = {
  Running: "status-running",
  Completed: "status-completed",
  Failed: "status-failed",
  Queued: "status-queued",
};

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <h1 className="text-xl font-medium">Welcome back, Fabrice</h1>
        <p className="text-muted-foreground text-sm mt-1">A quick overview of your automation activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/70 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${stat.className}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/70 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-medium">Recent Jobs</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/jobs")}>
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center gap-4 p-3 rounded-md hover:bg-accent/40 cursor-pointer transition-colors"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <span className="text-xs font-mono text-muted-foreground w-20">{job.id}</span>
                  <span className="text-sm flex-1 font-medium">{job.name}</span>
                  <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded ${statusClasses[job.status]}`}>
                    {job.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground w-20 text-right">{job.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">Quick Launch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickAutomations.map((automation) => (
              <Button
                key={automation.name}
                variant="outline"
                className="w-full justify-between h-10 border-border/70 hover:bg-accent/40"
                onClick={() => navigate("/automations")}
              >
                <span className="flex items-center gap-2 text-sm">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  {automation.name}
                </span>
                <Badge variant="secondary" className="text-[10px]">{automation.type}</Badge>
              </Button>
            ))}
            <Button variant="ghost" className="w-full text-xs text-muted-foreground mt-2" onClick={() => navigate("/automations")}>
              Browse all automations →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
