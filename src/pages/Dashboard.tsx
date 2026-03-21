import { Activity, CheckCircle2, XCircle, Clock, Zap, ArrowRight, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useMemo } from "react";

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

// Generate mock 90-day user activity data
function generate90DayData() {
  const data = [];
  const now = new Date();
  for (let i = 89; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const weekday = date.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const base = isWeekend ? 3 : 12;
    const variance = Math.floor(Math.random() * 8);
    const trend = Math.floor((90 - i) / 15);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      users: Math.max(1, base + variance + trend),
    });
  }
  return data;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const activityData = useMemo(() => generate90DayData(), []);
  const peakUsers = Math.max(...activityData.map(d => d.users));
  const avgUsers = Math.round(activityData.reduce((s, d) => s + d.users, 0) / activityData.length);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-display">Welcome back, Fabrice</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your automations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${s.className}`}>
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-display">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Activity Chart */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">Active Users — Last 90 Days</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Peak: <span className="text-foreground font-medium">{peakUsers}</span> · Avg: <span className="text-foreground font-medium">{avgUsers}</span> daily
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  interval={13}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))", fontSize: "10px" }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#userGradient)"
                  name="Active Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <Card className="lg:col-span-2 bg-card border-border">
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
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <span className="text-xs font-mono text-muted-foreground w-20">{job.id}</span>
                  <span className="text-sm flex-1 font-medium">{job.name}</span>
                  <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${statusClasses[job.status]}`}>
                    {job.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground w-20 text-right">{job.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Launch */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">Quick Launch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickAutomations.map((a) => (
              <Button
                key={a.name}
                variant="outline"
                className="w-full justify-between h-11 border-border hover:bg-accent/50 hover:border-primary/30"
                onClick={() => navigate("/automations")}
              >
                <span className="flex items-center gap-2 text-sm">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  {a.name}
                </span>
                <Badge variant="secondary" className="text-[10px]">{a.type}</Badge>
              </Button>
            ))}
            <Button variant="ghost" className="w-full text-xs text-muted-foreground mt-2" onClick={() => navigate("/automations")}>
              Browse all automations →
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
};

export default Dashboard;
