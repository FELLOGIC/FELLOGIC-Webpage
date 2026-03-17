import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Info, Zap } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const automationData: Record<string, { title: string; description: string; inputType: string; platform: string; details: string }> = {
  "create-user": {
    title: "Create User",
    description: "Launch an Ansible job to create a Planview user from the details below.",
    inputType: "Form",
    platform: "Ansible/AWX",
    details: "This form launches the Create User Ansible job template with your server, service account, and user creation details.",
  },
  "bulk-upload": {
    title: "Bulk User Upload",
    description: "Upload a CSV to create or update multiple users in batch.",
    inputType: "File Upload",
    platform: "Cross-Platform",
    details: "Upload a properly formatted CSV file to process bulk user operations. The system validates all rows before execution and provides a detailed report of successes and failures.",
  },
};

type CreateUserFormData = {
  companyDomainUrl: string;
  datasource: string;
  serviceAccountUserId: string;
  serviceAccountPassword: string;
  userId: string;
  fullName: string;
  userRole: string;
};

const defaultCreateUserForm: CreateUserFormData = {
  companyDomainUrl: "",
  datasource: "",
  serviceAccountUserId: "",
  serviceAccountPassword: "",
  userId: "",
  fullName: "",
  userRole: "",
};

const SAVED_SERVICE_ACCOUNT_KEY = "create-user-service-account";

const AutomationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveServiceAccount, setSaveServiceAccount] = useState(false);
  const [formData, setFormData] = useState<CreateUserFormData>(defaultCreateUserForm);

  const isCreateUser = id === "create-user";

  useEffect(() => {
    if (!isCreateUser) return;

    const raw = window.localStorage.getItem(SAVED_SERVICE_ACCOUNT_KEY);
    if (!raw) return;

    const saved = JSON.parse(raw) as { serviceAccountUserId?: string; serviceAccountPassword?: string };
    setFormData((prev) => ({
      ...prev,
      serviceAccountUserId: saved.serviceAccountUserId || "",
      serviceAccountPassword: saved.serviceAccountPassword || "",
    }));
    setSaveServiceAccount(true);
  }, [isCreateUser]);

  const auto = automationData[id || ""] || {
    title: "Automation",
    description: "Configure and launch this automation.",
    inputType: "Form",
    platform: "Cross-Platform",
    details: "Fill in the required parameters and submit to queue this automation job. You'll be able to track its progress in the Jobs page.",
  };

  const handleCreateUserSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = import.meta.env.VITE_ANSIBLE_JOB_URL || "/api/ansible/jobs/create-user";

      const payload = {
        template: "create-user",
        parameters: {
          server_details: {
            company_domain_url: formData.companyDomainUrl,
            datasource: formData.datasource,
          },
          service_account: {
            user_id: formData.serviceAccountUserId,
            password: formData.serviceAccountPassword,
          },
          creation_details: {
            user_id: formData.userId,
            full_name: formData.fullName,
            user_role: formData.userRole,
          },
        },
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit Ansible job (${response.status})`);
      }

      const result = (await response.json()) as { job_id?: string };

      if (saveServiceAccount) {
        window.localStorage.setItem(
          SAVED_SERVICE_ACCOUNT_KEY,
          JSON.stringify({
            serviceAccountUserId: formData.serviceAccountUserId,
            serviceAccountPassword: formData.serviceAccountPassword,
          }),
        );
      } else {
        window.localStorage.removeItem(SAVED_SERVICE_ACCOUNT_KEY);
      }

      const jobId = result.job_id || "JOB-1248";
      toast({ title: "Ansible Job Submitted", description: `Create User job queued as ${jobId}.` });
      navigate(`/jobs/${jobId}`);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Unable to submit Ansible job.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={() => setDragOver(false)}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium mb-1">Drop your file here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Accepts .csv, .xlsx — max 10MB</p>
                  <Button variant="outline" size="sm" className="mt-4">Choose File</Button>
                </div>
              ) : isCreateUser ? (
                <form className="space-y-5" onSubmit={handleCreateUserSubmit}>
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Server Details</p>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Company Domain URL *</Label>
                      <Input
                        required
                        placeholder="eg. https://tetrapak.pvcloud.com"
                        className="bg-secondary"
                        value={formData.companyDomainUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, companyDomainUrl: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Datasource *</Label>
                      <Input
                        required
                        placeholder="eg. TETSANDBOX"
                        className="bg-secondary"
                        value={formData.datasource}
                        onChange={(e) => setFormData((prev) => ({ ...prev, datasource: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Service Account</p>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">User ID *</Label>
                      <Input
                        required
                        className="bg-secondary"
                        value={formData.serviceAccountUserId}
                        onChange={(e) => setFormData((prev) => ({ ...prev, serviceAccountUserId: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Password *</Label>
                      <Input
                        required
                        type="password"
                        className="bg-secondary"
                        value={formData.serviceAccountPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, serviceAccountPassword: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="save-service-account"
                        checked={saveServiceAccount}
                        onCheckedChange={(checked) => setSaveServiceAccount(checked === true)}
                      />
                      <Label htmlFor="save-service-account" className="text-xs text-muted-foreground font-normal">
                        Save service account for later
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Creation Details</p>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">User ID *</Label>
                      <Input
                        required
                        className="bg-secondary"
                        value={formData.userId}
                        onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Full Name *</Label>
                      <Input
                        required
                        className="bg-secondary"
                        value={formData.fullName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">User Role *</Label>
                      <Input
                        required
                        placeholder="e.g. Resource Manager"
                        className="bg-secondary"
                        value={formData.userRole}
                        onChange={(e) => setFormData((prev) => ({ ...prev, userRole: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <Info className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Submit Job sends these parameters directly to the configured Ansible endpoint.
                    </p>
                  </div>

                  <Button className="w-full h-11" type="submit" disabled={isSubmitting}>
                    <Zap className="h-4 w-4 mr-2" /> {isSubmitting ? "Submitting..." : "Submit Job"}
                  </Button>
                </form>
              ) : null}
            </CardContent>
          </Card>
        </div>

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
