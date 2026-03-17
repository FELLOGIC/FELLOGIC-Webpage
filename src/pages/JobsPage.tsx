import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const jobs = [
  { id: "JOB-1247", name: "Bulk User Upload", status: "Running", submittedBy: "F. Levy", time: "14:32:01", duration: "01:23" },
  { id: "JOB-1246", name: "Planview Job Stream Report", status: "Completed", submittedBy: "F. Levy", time: "14:15:00", duration: "00:45" },
  { id: "JOB-1245", name: "Create User", status: "Completed", submittedBy: "S. Chen", time: "13:42:00", duration: "00:32" },
  { id: "JOB-1244", name: "Portfolio Report", status: "Failed", submittedBy: "F. Levy", time: "12:30:00", duration: "01:05" },
  { id: "JOB-1243", name: "Update User", status: "Completed", submittedBy: "A. Park", time: "11:15:00", duration: "00:28" },
  { id: "JOB-1242", name: "CMDB Synchronization", status: "Completed", submittedBy: "F. Levy", time: "10:00:00", duration: "02:15" },
  { id: "JOB-1241", name: "Bulk User Upload", status: "Queued", submittedBy: "J. Lee", time: "09:45:00", duration: "—" },
  { id: "JOB-1240", name: "Create User", status: "Completed", submittedBy: "S. Chen", time: "09:30:00", duration: "00:30" },
];

const statusClasses: Record<string, string> = {
  Running: "status-running",
  Completed: "status-completed",
  Failed: "status-failed",
  Queued: "status-queued",
};

const JobsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display">Jobs</h1>
          <p className="text-muted-foreground text-sm mt-1">Track and manage all automation job executions.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search jobs…" className="pl-9 bg-secondary" />
          </div>
          <Button variant="outline" size="icon" className="border-border"><Filter className="h-4 w-4" /></Button>
        </div>
      </div>

      <Card className="bg-card border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs">Job ID</TableHead>
              <TableHead className="text-xs">Automation</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Submitted By</TableHead>
              <TableHead className="text-xs">Time</TableHead>
              <TableHead className="text-xs">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow
                key={job.id}
                className="border-border cursor-pointer hover:bg-accent/30"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <TableCell className="font-mono text-xs text-primary">{job.id}</TableCell>
                <TableCell className="text-sm font-medium">{job.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${statusClasses[job.status]}`}>{job.status}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{job.submittedBy}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{job.time}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{job.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default JobsPage;
