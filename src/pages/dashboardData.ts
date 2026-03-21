import { Activity, CheckCircle2, XCircle, Clock } from "lucide-react";

export type DashboardStat = {
  label: string;
  value: number;
  icon: typeof Activity;
  className: string;
};

export type JobStatus = "Running" | "Completed" | "Failed" | "Queued";

export type RecentJob = {
  id: string;
  name: string;
  status: JobStatus;
  time: string;
  user: string;
};

export type QuickAutomation = {
  name: string;
  type: string;
};

export const stats: DashboardStat[] = [
  { label: "Running", value: 3, icon: Activity, className: "status-running" },
  { label: "Completed", value: 47, icon: CheckCircle2, className: "status-completed" },
  { label: "Failed", value: 2, icon: XCircle, className: "status-failed" },
  { label: "Queued", value: 5, icon: Clock, className: "status-queued" },
];

export const recentJobs: RecentJob[] = [
  { id: "JOB-1247", name: "Bulk User Upload", status: "Running", time: "2 min ago", user: "F. Levy" },
  { id: "JOB-1246", name: "Planview Job Stream Report", status: "Completed", time: "15 min ago", user: "F. Levy" },
  { id: "JOB-1245", name: "Create User", status: "Completed", time: "1 hr ago", user: "S. Chen" },
  { id: "JOB-1244", name: "Portfolio Report", status: "Failed", time: "2 hr ago", user: "F. Levy" },
  { id: "JOB-1243", name: "Update User", status: "Completed", time: "3 hr ago", user: "A. Park" },
];

export const quickAutomations: QuickAutomation[] = [
  { name: "Create User", type: "Form" },
  { name: "Bulk User Upload", type: "File Upload" },
  { name: "Planview Report", type: "Form" },
];

export const statusClasses: Record<JobStatus, string> = {
  Running: "status-running",
  Completed: "status-completed",
  Failed: "status-failed",
  Queued: "status-queued",
};
