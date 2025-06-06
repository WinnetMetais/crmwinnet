import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Financial from './pages/Financial';
import Reports from './pages/Reports';
import Filters from './pages/Filters';
import CRMOverview from './pages/CRMOverview';
import ModuleAnalysis from "@/pages/ModuleAnalysis";
import MarketingAutomation from "@/pages/MarketingAutomation";
import TasksNotifications from "@/pages/TasksNotifications";
import UserManagement from "@/pages/UserManagement";
import Analysis from "@/pages/Analysis";
import Content from "@/pages/Content";
import Config from "@/pages/Config";
import Backup from "@/pages/Backup";
import Templates from "@/pages/Templates";
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
            <Route path="/financial" element={<Financial />} />
            <Route path="/crm" element={<CRMOverview />} />
            <Route path="/module-analysis" element={<ModuleAnalysis />} />
            <Route path="/marketing-automation" element={<MarketingAutomation />} />
            <Route path="/tasks" element={<TasksNotifications />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/filters" element={<Filters />} />
            <Route path="/config" element={<Config />} />
            <Route path="/backup" element={<Backup />} />
            <Route path="/templates" element={<Templates />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
