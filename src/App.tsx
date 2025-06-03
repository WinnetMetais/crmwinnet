
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
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
import Financial from "./pages/Financial";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Auth from "./pages/Auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="text-gradient text-4xl font-bold">Winnet Metais</div>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

// Main App component with routing
const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<Auth />} />
    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/config" element={<ProtectedRoute><Config /></ProtectedRoute>} />
    <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
    <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
    <Route path="/campaigns/google" element={<ProtectedRoute><GoogleCampaigns /></ProtectedRoute>} />
    <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
    <Route path="/financial" element={<ProtectedRoute><Financial /></ProtectedRoute>} />
    <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
    <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
    <Route path="/content" element={<ProtectedRoute><Content /></ProtectedRoute>} />
    <Route path="/content/plan" element={<ProtectedRoute><ContentPlan /></ProtectedRoute>} />
    <Route path="/content/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
    <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
    <Route path="/ads" element={<ProtectedRoute><Ads /></ProtectedRoute>} />
    <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
    <Route path="/filters" element={<ProtectedRoute><Filters /></ProtectedRoute>} />
    <Route path="/promotions" element={<ProtectedRoute><Promotions /></ProtectedRoute>} />
    <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="winnet-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Routes>
                <Route path="/auth" element={null} />
                <Route path="*" element={<Navbar />} />
              </Routes>
              <main className="flex-1">
                <AppRoutes />
              </main>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
