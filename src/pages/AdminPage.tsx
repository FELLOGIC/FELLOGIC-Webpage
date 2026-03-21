import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Pencil, Trash2, Shield, Clock } from "lucide-react";

const templates = [
  { id: 1, name: "Create User", platform: "Cross-Platform", inputType: "Form", status: "Active", lastEdited: "2 days ago" },
  { id: 2, name: "Update User", platform: "Cross-Platform", inputType: "Form", status: "Active", lastEdited: "5 days ago" },
  { id: 3, name: "Bulk User Upload", platform: "Cross-Platform", inputType: "File Upload", status: "Active", lastEdited: "1 week ago" },
  { id: 4, name: "Planview Job Stream Report", platform: "Planview", inputType: "Form", status: "Active", lastEdited: "3 days ago" },
  { id: 5, name: "CMDB Sync", platform: "ServiceNow", inputType: "Form", status: "Draft", lastEdited: "1 day ago" },
];

const users = [
  { name: "Fabrice Levy", email: "fabrice@company.com", role: "Admin", lastActive: "Just now" },
  { name: "Sarah Chen", email: "s.chen@company.com", role: "Operator", lastActive: "2 hrs ago" },
  { name: "Alex Park", email: "a.park@company.com", role: "Operator", lastActive: "5 hrs ago" },
  { name: "Jordan Lee", email: "j.lee@company.com", role: "Viewer", lastActive: "1 day ago" },
];

const auditLog = [
  { time: "14:32:01", user: "F. Levy", action: "Submitted job JOB-1247", type: "Job" },
  { time: "13:15:22", user: "S. Chen", action: "Modified template 'Create User'", type: "Template" },
  { time: "12:00:01", user: "System", action: "Scheduled cleanup completed", type: "System" },
  { time: "11:45:33", user: "A. Park", action: "Submitted job JOB-1245", type: "Job" },
  { time: "10:30:00", user: "F. Levy", action: "Updated user role for J. Lee", type: "Access" },
];

const AdminPage = () => {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-display">Administration</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage automation templates, access, and audit history.</p>
      </div>

      <Tabs defaultValue="templates">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="access">Access & Roles</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search templates…" className="pl-9 bg-secondary" />
            </div>
            <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1" /> New Template</Button>
          </div>
          <Card className="bg-card border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Platform</TableHead>
                  <TableHead className="text-xs">Input</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Last Edited</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((t) => (
                  <TableRow key={t.id} className="border-border">
                    <TableCell className="font-medium text-sm">{t.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{t.platform}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] border-border">{t.inputType}</Badge></TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${t.status === "Active" ? "status-completed" : "status-queued"}`}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{t.lastEdited}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users…" className="pl-9 bg-secondary" />
            </div>
            <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1" /> Invite User</Button>
          </div>
          <Card className="bg-card border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs">User</TableHead>
                  <TableHead className="text-xs">Role</TableHead>
                  <TableHead className="text-xs">Last Active</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.email} className="border-border">
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${u.role === "Admin" ? "status-running" : "border-border"}`}>
                        <Shield className="h-2.5 w-2.5 mr-1" />{u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="bg-card border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs">Time</TableHead>
                  <TableHead className="text-xs">User</TableHead>
                  <TableHead className="text-xs">Action</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLog.map((entry, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell className="text-xs font-mono text-muted-foreground">{entry.time}</TableCell>
                    <TableCell className="text-sm">{entry.user}</TableCell>
                    <TableCell className="text-sm">{entry.action}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{entry.type}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
