import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Financial from "./pages/Financial";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Analysis from "./pages/Analysis";
import Config from "./pages/Config";
import Commercial from "./pages/Commercial";
import Reports from "./pages/Reports";
import Content from "./pages/Content";
import Campaigns from "./pages/Campaigns";
import CRMOverview from "./pages/CRMOverview";
import ModuleAnalysis from "./pages/ModuleAnalysis";
import Filters from "./pages/Filters";
import Templates from "./pages/Templates";
import Promotions from "./pages/Promotions";
import Calendar from "./pages/Calendar";
import TasksNotifications from "./pages/TasksNotifications";
import UserManagement from "./pages/UserManagement";
import Performance from "./pages/Performance";
import MarketingAutomation from "./pages/MarketingAutomation";
import AIDashboard from "./pages/AIDashboard";
import Backup from "./pages/Backup";
import NotFound from "./pages/NotFound";
import DataQuality from "./pages/DataQuality";
import ContentPlan from "./pages/content/ContentPlan";
import Social from "./pages/content/Social";
import Ads from "./pages/content/Ads";
import GoogleCampaigns from "./pages/campaigns/GoogleCampaigns";
import {
  AccountSettings,
  Appearance,
  NotificationsSettings,
  Privacy,
} from "./pages/config/sub-routes";
import {
  KanbanBoard,
  ProjectManagement,
  TaskList,
} from "./pages/tasks/sub-routes";
import {
  FacebookCampaigns,
  InstagramCampaigns,
  LinkedInCampaigns,
  TwitterCampaigns,
} from "./pages/campaigns/social-media";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <NotificationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/financial" element={<Financial />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/products" element={<Products />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/config" element={<Config />} />
                <Route path="/commercial" element={<Commercial />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/content" element={<Content />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/crm-overview" element={<CRMOverview />} />
                <Route path="/module-analysis" element={<ModuleAnalysis />} />
                <Route path="/filters" element={<Filters />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/tasks" element={<TasksNotifications />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/automation" element={<MarketingAutomation />} />
                <Route path="/ai-dashboard" element={<AIDashboard />} />
                <Route path="/backup" element={<Backup />} />
                <Route path="/data-quality" element={<DataQuality />} />
                
                {/* Content sub-routes */}
                <Route path="/content/plan" element={<ContentPlan />} />
                <Route path="/content/social" element={<Social />} />
                <Route path="/content/ads" element={<Ads />} />
                
                {/* Campaign sub-routes */}
                <Route path="/campaigns/google" element={<GoogleCampaigns />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
