import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AutomationCatalog from "./pages/AutomationCatalog";
import AutomationDetail from "./pages/AutomationDetail";
import FlowDesigner from "./pages/FlowDesigner";
import JobsPage from "./pages/JobsPage";
import JobStatus from "./pages/JobStatus";
import LogsResults from "./pages/LogsResults";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/automations" element={<AutomationCatalog />} />
            <Route path="/automations/:id" element={<AutomationDetail />} />
            <Route path="/flow-designer" element={<FlowDesigner />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId" element={<JobStatus />} />
            <Route path="/logs" element={<LogsResults />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/settings" element={<div className="text-muted-foreground">Settings page coming soon.</div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
