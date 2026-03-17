import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Info, Zap } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const automationData: Record<string, { title: string; description: string; inputType: string; platform: string; details: string }> = {
  "create-user": {
    title: "Create User",
    description: "Provision a new user account across Planview, ServiceNow, and Active Directory.",
    inputType: "Form",
    platform: "Cross-Platform",
    details: "This automation creates a user across all connected systems. It provisions AD accounts, assigns Planview licenses, and creates ServiceNow records with the appropriate role assignments.",
  },
  "bulk-upload": {
    title: "Bulk User Upload",
    description: "Upload a CSV to create or update multiple users in batch.",
    inputType: "File Upload",
    platform: "Cross-Platform",
    details: "Upload a properly formatted CSV file to process bulk user operations. The system validates all rows before execution and provides a detailed report of successes and failures.",
  },
};

const AutomationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState(false);

  const auto = automationData[id || ""] || {
    title: "Automation",
    description: "Configure and launch this automation.",
    inputType: "Form",
    platform: "Cross-Platform",
    details: "Fill in the required parameters and submit to queue this automation job. You'll be able to track its progress in the Jobs page.",
  };

  const handleSubmit = () => {
    toast({ title: "Job Submitted", description: "Your automation job has been queued for execution." });
    navigate("/jobs/JOB-1248");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <Button variant="ghost" size="sm" className="text-muted-foreground -ml-2" onClick={() => navigate("/automations")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Catalog
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display">{auto.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{auto.description}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-border">{auto.inputType}</Badge>
          <Badge variant="secondary">{auto.platform}</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Input Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {auto.inputType === "File Upload" || id === "bulk-upload" ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    dragOver ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={() => setDragOver(false)}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium mb-1">Drop your file here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Accepts .csv, .xlsx — max 10MB</p>
                  <Button variant="outline" size="sm" className="mt-4">Choose File</Button>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">First Name *</Label>
                      <Input placeholder="Enter first name" className="bg-secondary" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Last Name *</Label>
                      <Input placeholder="Enter last name" className="bg-secondary" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Email *</Label>
                    <Input type="email" placeholder="user@company.com" className="bg-secondary" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Department</Label>
                    <Input placeholder="e.g. Engineering" className="bg-secondary" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Notes</Label>
                    <Textarea placeholder="Additional context for this automation…" className="bg-secondary resize-none" rows={3} />
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Info className="h-4 w-4 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">All inputs are validated before submission. Jobs are queued and executed via the Ansible/AWX backend.</p>
              </div>

              <Button className="w-full h-11" onClick={handleSubmit}>
                <Zap className="h-4 w-4 mr-2" /> Submit Job
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">About this Automation</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-3">
              <p>{auto.details}</p>
              <div className="pt-2 border-t border-border space-y-2">
                <div className="flex justify-between"><span>Backend</span><span className="text-foreground">Ansible/AWX</span></div>
                <div className="flex justify-between"><span>Avg Duration</span><span className="text-foreground">~45s</span></div>
                <div className="flex justify-between"><span>Success Rate</span><span className="text-foreground">98.2%</span></div>
                <div className="flex justify-between"><span>Last Run</span><span className="text-foreground">12 min ago</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AutomationDetail;
