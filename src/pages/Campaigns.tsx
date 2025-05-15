
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Filter, 
  Download, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  BarChart as BarChartIcon,
  Calendar,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Sample data for campaigns
const campaignPerformanceData = [
  { month: 'Jan', google: 4200, facebook: 2400, linkedin: 1800, total: 8400 },
  { month: 'Feb', google: 3800, facebook: 2800, linkedin: 1600, total: 8200 },
  { month: 'Mar', google: 5200, facebook: 3100, linkedin: 2400, total: 10700 },
  { month: 'Apr', google: 4800, facebook: 3400, linkedin: 2200, total: 10400 },
  { month: 'Mai', google: 6000, facebook: 3800, linkedin: 2600, total: 12400 },
  { month: 'Jun', google: 5400, facebook: 4200, linkedin: 3000, total: 12600 },
];

const conversionData = [
  { name: 'Impressões', value: 120000, fill: '#8884d8' },
  { name: 'Cliques', value: 15000, fill: '#83a6ed' },
  { name: 'Conversões', value: 2200, fill: '#8dd1e1' },
];

const ROAS = [
  { platform: 'Google Ads', value: 3.2, status: 'aumento', change: '+0.4' },
  { platform: 'Facebook', value: 2.8, status: 'aumento', change: '+0.3' },
  { platform: 'LinkedIn', value: 1.8, status: 'reducao', change: '-0.2' },
  { platform: 'Instagram', value: 3.5, status: 'aumento', change: '+0.5' },
];

const activeCampaigns = [
  { 
    name: 'Campanha Produtos Industriais', 
    platform: 'Google Ads', 
    status: 'Ativa', 
    budget: 'R$ 15.000,00',
    spent: 'R$ 8.420,00', 
    impressions: '85.320', 
    clicks: '4.210', 
    ctr: '4.93%', 
    conversions: '185',
    cpa: 'R$ 45,50'
  },
  { 
    name: 'Remarketing Clientes Corporativos', 
    platform: 'Facebook', 
    status: 'Ativa', 
    budget: 'R$ 8.000,00',
    spent: 'R$ 4.380,00', 
    impressions: '92.450', 
    clicks: '3.850', 
    ctr: '4.16%', 
    conversions: '120',
    cpa: 'R$ 36,50'
  },
  { 
    name: 'Leads B2B Qualificados', 
    platform: 'LinkedIn', 
    status: 'Ativa', 
    budget: 'R$ 12.000,00',
    spent: 'R$ 6.240,00', 
    impressions: '45.200', 
    clicks: '1.820', 
    ctr: '4.02%', 
    conversions: '68',
    cpa: 'R$ 91,76'
  },
  { 
    name: 'Campanha de Consciência de Marca', 
    platform: 'Instagram', 
    status: 'Ativa', 
    budget: 'R$ 5.000,00',
    spent: 'R$ 2.850,00', 
    impressions: '78.300', 
    clicks: '3.120', 
    ctr: '3.98%', 
    conversions: '92',
    cpa: 'R$ 30,98'
  },
];

const Campaigns = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [platform, setPlatform] = useState('todas');
  const [currentTab, setCurrentTab] = useState('active');

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold">Gestão de Campanhas</h1>
              </div>
              <div className="flex space-x-4 items-center">
                <Select defaultValue={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    <SelectItem value="12m">Último ano</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>

                <Button variant="default" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Campanha
                </Button>
              </div>
            </div>

            {/* Dashboard Resumido */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {ROAS.map((item, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardDescription>{item.platform}</CardDescription>
                    <CardTitle className="text-2xl flex items-center">
                      {item.value}x ROAS
                      {item.status === 'aumento' ? (
                        <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="ml-2 h-5 w-5 text-red-500" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={item.status === 'aumento' ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                      {item.change} em relação ao período anterior
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Gráficos de Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Performance por Plataforma</CardTitle>
                      <CardDescription>Comparativo de cliques por plataforma</CardDescription>
                    </div>
                    <BarChartIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={campaignPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="google" name="Google Ads" fill="#4285F4" />
                        <Bar dataKey="facebook" name="Facebook" fill="#1877F2" />
                        <Bar dataKey="linkedin" name="LinkedIn" fill="#0A66C2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Funil de Conversão</CardTitle>
                      <CardDescription>Impressões até conversões</CardDescription>
                    </div>
                    <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={conversionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {conversionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Campanhas Ativas */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Campanhas Ativas</CardTitle>
                    <CardDescription>Status e métricas das campanhas atuais</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Tabs defaultValue="active" className="w-[400px]" onValueChange={setCurrentTab}>
                      <TabsList>
                        <TabsTrigger value="active">Ativas</TabsTrigger>
                        <TabsTrigger value="paused">Pausadas</TabsTrigger>
                        <TabsTrigger value="completed">Finalizadas</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Select defaultValue={platform} onValueChange={setPlatform}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Todas as plataformas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas as plataformas</SelectItem>
                        <SelectItem value="google">Google Ads</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campanha</TableHead>
                      <TableHead>Plataforma</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Orçamento</TableHead>
                      <TableHead>Gasto</TableHead>
                      <TableHead>Impressões</TableHead>
                      <TableHead>Cliques</TableHead>
                      <TableHead>CTR</TableHead>
                      <TableHead>Conversões</TableHead>
                      <TableHead>CPA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeCampaigns.map((campaign, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{campaign.platform}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {campaign.status}
                          </span>
                        </TableCell>
                        <TableCell>{campaign.budget}</TableCell>
                        <TableCell>{campaign.spent}</TableCell>
                        <TableCell>{campaign.impressions}</TableCell>
                        <TableCell>{campaign.clicks}</TableCell>
                        <TableCell>{campaign.ctr}</TableCell>
                        <TableCell>{campaign.conversions}</TableCell>
                        <TableCell>{campaign.cpa}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
            
            {/* Calendário de Campanhas */}
            <Card className="mt-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Calendário de Campanhas</CardTitle>
                    <CardDescription>Planejamento e cronograma de campanhas</CardDescription>
                  </div>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-w-16 aspect-h-9">
                  <AspectRatio ratio={16/9}>
                    <div className="grid grid-cols-7 gap-1 h-full">
                      <div className="text-center font-semibold">DOM</div>
                      <div className="text-center font-semibold">SEG</div>
                      <div className="text-center font-semibold">TER</div>
                      <div className="text-center font-semibold">QUA</div>
                      <div className="text-center font-semibold">QUI</div>
                      <div className="text-center font-semibold">SEX</div>
                      <div className="text-center font-semibold">SÁB</div>
                      
                      {/* Semana 1 */}
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="border p-2 rounded-md text-start">
                          <div className="font-semibold">{i + 1}</div>
                          {i === 3 && (
                            <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded mt-1">
                              Lançamento Produtos Industriais
                            </div>
                          )}
                          {i === 5 && (
                            <div className="bg-green-100 text-green-800 text-xs p-1 rounded mt-1">
                              Remarketing - Início
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Semana 2 */}
                      {[...Array(7)].map((_, i) => (
                        <div key={i + 7} className="border p-2 rounded-md text-start">
                          <div className="font-semibold">{i + 8}</div>
                          {i === 2 && (
                            <div className="bg-purple-100 text-purple-800 text-xs p-1 rounded mt-1">
                              LinkedIn B2B
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Semana 3 */}
                      {[...Array(7)].map((_, i) => (
                        <div key={i + 14} className="border p-2 rounded-md text-start">
                          <div className="font-semibold">{i + 15}</div>
                          {i === 1 && (
                            <div className="bg-red-100 text-red-800 text-xs p-1 rounded mt-1">
                              Final Campanha Q2
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AspectRatio>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Campaigns;
