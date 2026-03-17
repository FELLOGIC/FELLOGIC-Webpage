import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Download, Mail, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";

const steps = [
  { label: "Job Queued", status: "done", time: "14:32:01" },
  { label: "Input Validation", status: "done", time: "14:32:03" },
  { label: "AWX Playbook Triggered", status: "done", time: "14:32:05" },
  { label: "Provisioning Accounts", status: "running", time: "14:32:12" },
  { label: "Post-Validation", status: "pending", time: "—" },
  { label: "Result Delivery", status: "pending", time: "—" },
];

const stepIcons: Record<string, React.ReactNode> = {
  done: <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />,
  running: <Loader2 className="h-4 w-4 text-primary animate-spin" />,
  pending: <Clock className="h-4 w-4 text-muted-foreground" />,
};

const JobStatus = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const id = jobId || "JOB-1247";

  return (
    <div className="space-y-6 max-w-5xl">
      <Button variant="ghost" size="sm" className="text-muted-foreground -ml-2" onClick={() => navigate("/jobs")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Jobs
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display">{id}</h1>
            <Badge variant="outline" className="status-running text-xs">Running</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Bulk User Upload — Submitted by F. Levy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border">
            <Download className="h-3.5 w-3.5 mr-1" /> Artifacts
          </Button>
          <Button variant="outline" size="sm" className="border-border" onClick={() => navigate(`/logs?job=${id}`)}>
            View Logs
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Progress */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Execution Progress</CardTitle>
                <span className="text-xs text-muted-foreground">Step 4 of 6</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={60} className="h-2" />
              <div className="space-y-1">
                {steps.map((step, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${step.status === "running" ? "bg-primary/5" : ""}`}>
                    {stepIcons[step.status]}
                    <span className={`text-sm flex-1 ${step.status === "pending" ? "text-muted-foreground" : "font-medium"}`}>{step.label}</span>
                    <span className="text-xs font-mono text-muted-foreground">{step.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Result Summary */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Result Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-[hsl(var(--success))]/10">
                  <p className="text-2xl font-display text-[hsl(var(--success))]">142</p>
                  <p className="text-xs text-muted-foreground mt-1">Processed</p>
                </div>
                <div className="p-4 rounded-lg bg-[hsl(var(--warning))]/10">
                  <p className="text-2xl font-display text-[hsl(var(--warning))]">3</p>
                  <p className="text-xs text-muted-foreground mt-1">Warnings</p>
                </div>
                <div className="p-4 rounded-lg bg-destructive/10">
                  <p className="text-2xl font-display text-destructive">1</p>
                  <p className="text-xs text-muted-foreground mt-1">Errors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Details sidebar */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3">
              {[
                ["Job ID", id],
                ["Automation", "Bulk User Upload"],
                ["Submitted By", "Fabrice Levy"],
                ["Start Time", "2025-03-17 14:32:01"],
                ["Elapsed", "00:01:23"],
                ["Backend", "AWX / Ansible"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-foreground font-medium">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Email Delivery</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">fabrice@company.com</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-[hsl(var(--warning))]" />
                <span className="text-muted-foreground">Pending — sent on completion</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobStatus;
