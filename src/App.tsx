
import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { LoadingFallback } from "@/components/layout/LoadingFallback";
import { GlobalKeyboardShortcuts } from "@/components/shared/GlobalKeyboardShortcuts";
import { routes, contentRoutes, campaignRoutes, NotFound } from "@/config/routes";

// Configuração otimizada do QueryClient para Supabase
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <NotificationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <GlobalKeyboardShortcuts />
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Main routes */}
                    {routes.map((route) => {
                      const Component = route.element;
                      return (
                        <Route 
                          key={route.path} 
                          path={route.path} 
                          element={<Component />} 
                        />
                      );
                    })}
                    
                    {/* Content sub-routes */}
                    {contentRoutes.map((route) => {
                      const Component = route.element;
                      return (
                        <Route 
                          key={route.path} 
                          path={route.path} 
                          element={<Component />} 
                        />
                      );
                    })}
                    
                    {/* Campaign sub-routes */}
                    {campaignRoutes.map((route) => {
                      const Component = route.element;
                      return (
                        <Route 
                          key={route.path} 
                          path={route.path} 
                          element={<Component />} 
                        />
                      );
                    })}
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AuthProvider>
            </BrowserRouter>
          </NotificationProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
