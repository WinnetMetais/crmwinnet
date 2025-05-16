
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Config from "./pages/Config";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Campaigns from "./pages/Campaigns";
import GoogleCampaigns from "./pages/campaigns/GoogleCampaigns";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Content from "./pages/Content";
import ContentPlan from "./pages/content/ContentPlan";
import Social from "./pages/content/Social";
import Ads from "./pages/content/Ads";
import Calendar from "./pages/Calendar";
import Filters from "./pages/Filters";
import Navbar from "./components/Navbar";
import Promotions from "./pages/Promotions";
import Performance from "./pages/Performance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/config" element={<Config />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/google" element={<GoogleCampaigns />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/content" element={<Content />} />
          <Route path="/content/plan" element={<ContentPlan />} />
          <Route path="/content/social" element={<Social />} />
          <Route path="/social" element={<Social />} />
          <Route path="/ads" element={<Ads />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/filters" element={<Filters />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/performance" element={<Performance />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
