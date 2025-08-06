
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
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { GlobalKeyboardShortcuts } from "@/components/shared/GlobalKeyboardShortcuts";
import { routes, contentRoutes, campaignRoutes, NotFound } from "@/config/routes";
import ProtectedRoute from "@/components/ProtectedRoute";

// Configuração otimizada do QueryClient para Supabase
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 30 * 1000, // 30 segundos para dados mais atualizados
      gcTime: 2 * 60 * 1000, // 2 minutos
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      networkMode: 'always',
    },
    mutations: {
      retry: 2,
      networkMode: 'always',
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
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
                      const isAuthRoute = route.path === '/auth';
                      const isIndexRoute = route.path === '/';
                      
                      if (isAuthRoute || isIndexRoute) {
                        return (
                          <Route 
                            key={route.path} 
                            path={route.path} 
                            element={<Component />} 
                          />
                        );
                      }
                      
                      return (
                        <Route 
                          key={route.path} 
                          path={route.path} 
                          element={
                            <ProtectedRoute>
                              <Component />
                            </ProtectedRoute>
                          } 
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
    </ErrorBoundary>
  );
}

export default App;
