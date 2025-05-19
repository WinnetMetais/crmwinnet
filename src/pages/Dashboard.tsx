
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { CampaignCharts } from "@/components/dashboard/CampaignCharts";
import { RecentCampaignsTable } from "@/components/dashboard/RecentCampaignsTable";
import { AudienceSegmentation } from "@/components/dashboard/AudienceSegmentation";
import { ContentPlanning } from "@/components/dashboard/ContentPlanning";

// Sample data - in a real app, this would come from an API
const campaignData = [
  { name: 'Jan', interna: 4000, agencia4k: 2400, conversoes: 240 },
  { name: 'Feb', interna: 3000, agencia4k: 1398, conversoes: 210 },
  { name: 'Mar', interna: 2000, agencia4k: 9800, conversoes: 290 },
  { name: 'Apr', interna: 2780, agencia4k: 3908, conversoes: 200 },
  { name: 'May', interna: 1890, agencia4k: 4800, conversoes: 218 },
  { name: 'Jun', interna: 2390, agencia4k: 3800, conversoes: 250 },
  { name: 'Jul', interna: 3490, agencia4k: 4300, conversoes: 210 },
];

const funnelData = [
  { name: 'Awareness', value: 4000, color: '#8884d8' },
  { name: 'Consideração', value: 3000, color: '#83a6ed' },
  { name: 'Conversão', value: 2000, color: '#8dd1e1' },
];

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const kpiData = [
  { metric: 'ROI', valor: '245%', status: 'aumento', comparacao: '+15%' },
  { metric: 'CPA', valor: 'R$ 48,50', status: 'reducao', comparacao: '-8%' },
  { metric: 'Taxa de Conversão', valor: '3.2%', status: 'aumento', comparacao: '+0.5%' },
  { metric: 'Valor Médio', valor: 'R$ 320,00', status: 'aumento', comparacao: '+12%' },
];

const campanhasRecentes = [
  { nome: 'Promoção Verão', plataforma: 'Google Ads', impressoes: '45.3K', cliques: '5.2K', ctr: '11.5%', conversoes: '320' },
  { nome: 'Remarketing Clientes', plataforma: 'Facebook', impressoes: '30.1K', cliques: '4.8K', ctr: '15.9%', conversoes: '180' },
  { nome: 'Campanha Produtos Novos', plataforma: 'Instagram', impressoes: '28.7K', cliques: '3.1K', ctr: '10.8%', conversoes: '145' },
  { nome: 'LinkedIn B2B', plataforma: 'LinkedIn', impressoes: '12.5K', cliques: '980', ctr: '7.8%', conversoes: '35' },
];

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} />
            
            {/* Métricas principais */}
            <KpiCards kpiData={kpiData} />
            
            <CampaignCharts campaignData={campaignData} funnelData={funnelData} />
            
            {/* Desempenho das Campanhas */}
            <RecentCampaignsTable campaigns={campanhasRecentes} />
            
            {/* Segmentação de Público */}
            <AudienceSegmentation colors={COLORS} />
            
            {/* Planejamento de Conteúdo */}
            <ContentPlanning />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
