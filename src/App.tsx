
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import CRMOverview from './pages/CRMOverview';
import ModuleAnalysis from "@/pages/ModuleAnalysis";
import MarketingAutomation from "@/pages/MarketingAutomation";
import TasksNotifications from "@/pages/TasksNotifications";
import UserManagement from "@/pages/UserManagement";
import Analysis from "@/pages/Analysis";
import Content from "@/pages/Content";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/content" element={<Content />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/crm" element={<CRMOverview />} />
            <Route path="/module-analysis" element={<ModuleAnalysis />} />
            <Route path="/marketing-automation" element={<MarketingAutomation />} />
            <Route path="/tasks" element={<TasksNotifications />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
