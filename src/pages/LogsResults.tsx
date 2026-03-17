import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertTriangle, XCircle, Info, Download } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const logLines = [
  { time: "14:32:01.001", step: "INIT", level: "info", msg: "Job JOB-1247 initialized — Bulk User Upload" },
  { time: "14:32:01.042", step: "INIT", level: "info", msg: "Reading input file: users_march_2025.csv (146 rows)" },
  { time: "14:32:03.112", step: "VALIDATE", level: "info", msg: "Input validation started" },
  { time: "14:32:03.445", step: "VALIDATE", level: "warn", msg: "Row 34: Department field empty — defaulting to 'Unassigned'" },
  { time: "14:32:03.446", step: "VALIDATE", level: "warn", msg: "Row 87: Duplicate email detected — john.d@company.com" },
  { time: "14:32:03.501", step: "VALIDATE", level: "info", msg: "Validation complete: 143 valid, 3 warnings, 0 errors" },
  { time: "14:32:05.200", step: "AWX", level: "info", msg: "Triggering AWX playbook: user_provisioning_v3.yml" },
  { time: "14:32:05.301", step: "AWX", level: "info", msg: "AWX job template ID: 847 launched successfully" },
  { time: "14:32:12.100", step: "PROVISION", level: "info", msg: "Creating AD accounts... (batch 1/3)" },
  { time: "14:32:18.200", step: "PROVISION", level: "info", msg: "AD batch 1 complete — 50/50 success" },
  { time: "14:32:24.300", step: "PROVISION", level: "info", msg: "Creating AD accounts... (batch 2/3)" },
  { time: "14:32:30.100", step: "PROVISION", level: "info", msg: "AD batch 2 complete — 50/50 success" },
  { time: "14:32:36.200", step: "PROVISION", level: "info", msg: "Creating AD accounts... (batch 3/3)" },
  { time: "14:32:40.050", step: "PROVISION", level: "error", msg: "Row 112: Failed to create AD account — username conflict 'j.smith'" },
  { time: "14:32:42.300", step: "PROVISION", level: "info", msg: "AD batch 3 complete — 42/43 success" },
  { time: "14:32:42.500", step: "PROVISION", level: "info", msg: "Assigning Planview licenses..." },
  { time: "14:32:48.100", step: "PROVISION", level: "info", msg: "Planview licensing complete — 142/142 assigned" },
];

const levelIcons: Record<string, React.ReactNode> = {
  info: <Info className="h-3 w-3 text-primary shrink-0" />,
  warn: <AlertTriangle className="h-3 w-3 text-[hsl(var(--warning))] shrink-0" />,
  error: <XCircle className="h-3 w-3 text-destructive shrink-0" />,
};

const levelBorder: Record<string, string> = {
  info: "border-transparent",
  warn: "border-[hsl(var(--warning))]/50",
  error: "border-destructive/50",
};

const LogsResults = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("job") || "JOB-1247";

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display">Logs & Results</h1>
          <p className="text-muted-foreground text-sm mt-1">Execution details for {jobId}</p>
        </div>
        <Button variant="outline" size="sm" className="border-border">
          <Download className="h-3.5 w-3.5 mr-1" /> Export Logs
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Steps", value: "17", icon: Info, color: "text-primary" },
          { label: "Info", value: "14", icon: CheckCircle2, color: "text-primary" },
          { label: "Warnings", value: "2", icon: AlertTriangle, color: "text-[hsl(var(--warning))]" },
          { label: "Errors", value: "1", icon: XCircle, color: "text-destructive" },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <div>
                <p className="text-xl font-display">{s.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="logs">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {logLines.map((line, i) => (
                  <div key={i} className={`log-line flex items-start gap-3 py-2 ${levelBorder[line.level]}`} style={{ borderLeftWidth: '3px' }}>
                    <span className="text-[10px] font-mono text-muted-foreground w-28 shrink-0 pt-0.5">{line.time}</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono border-border shrink-0">{line.step}</Badge>
                    {levelIcons[line.level]}
                    <span className="text-xs leading-relaxed">{line.msg}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="output">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap leading-6">{`{
  "job_id": "${jobId}",
  "status": "running",
  "total_records": 146,
  "processed": 142,
  "warnings": 3,
  "errors": 1,
  "systems": {
    "active_directory": { "created": 142, "failed": 1 },
    "planview": { "licensed": 142, "failed": 0 },
    "servicenow": { "pending": true }
  }
}`}</pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-sm text-muted-foreground">
              <p>Email delivery is pending. Results will be sent to <span className="text-foreground">fabrice@company.com</span> upon job completion.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card className="bg-card border-border">
            <CardContent className="p-6 space-y-3">
              {["users_march_2025.csv", "provisioning_report.pdf", "error_log.txt"].map((file) => (
                <div key={file} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-sm font-mono">{file}</span>
                  <Button variant="ghost" size="sm" className="text-xs text-primary"><Download className="h-3 w-3 mr-1" /> Download</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogsResults;
