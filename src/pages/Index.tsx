import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, Users, ShoppingBag, BarChart3, Calendar, ArrowUp, ArrowDown, Settings, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Mock data
const recentActivities = [
  { id: 1, type: "lead", title: "Novo lead: Metalúrgica São Paulo", time: "Há 5 minutos" },
  { id: 2, type: "sale", title: "Venda finalizada: R$ 15.400,00", time: "Há 2 horas" },
  { id: 3, type: "campaign", title: "Campanha 'Aço Premium' ativada", time: "Há 4 horas" },
  { id: 4, type: "content", title: "Post programado para LinkedIn", time: "Há 1 dia" },
];

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="text-gradient text-4xl font-bold">Winnet Metais</div>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4 max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Bem-vindo à Winnet Metais</h1>
                <p className="text-muted-foreground">Painel de gestão centralizado - 16 de Maio, 2025</p>
              </div>
              
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Button asChild>
                  <Link to="/calendar">
                    <Calendar className="mr-2 h-4 w-4" />
                    Ver Agenda
                  </Link>
                </Button>
              </div>
            </div>

            {/* Production Setup Banner */}
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Settings className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-800">Configuração para Produção</h3>
                      <p className="text-sm text-blue-600">
                        Configure integrações e importe seus dados reais para usar o CRM em produção
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Dados de teste removidos</span>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link to="/production-setup">
                        Configurar Sistema
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="animate-fade-in" style={{animationDelay: '0.1s'}}>
                <CardHeader className="pb-2">
                  <CardDescription>Vendas este mês</CardDescription>
                  <CardTitle className="text-2xl flex justify-between items-center">
                    R$ 0,00
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <span>Nenhum dado disponível</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                <CardHeader className="pb-2">
                  <CardDescription>Novos leads</CardDescription>
                  <CardTitle className="text-2xl flex justify-between items-center">
                    0
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <span>Nenhum dado disponível</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in" style={{animationDelay: '0.3s'}}>
                <CardHeader className="pb-2">
                  <CardDescription>Pedidos em aberto</CardDescription>
                  <CardTitle className="text-2xl flex justify-between items-center">
                    0
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <Progress value={0} className="h-1.5" />
                    <span className="ml-2">Nenhum pedido</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in" style={{animationDelay: '0.4s'}}>
                <CardHeader className="pb-2">
                  <CardDescription>Conversão anúncios</CardDescription>
                  <CardTitle className="text-2xl flex justify-between items-center">
                    0%
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <span>Nenhum dado disponível</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="lg:col-span-2 animate-fade-in" style={{animationDelay: '0.5s'}}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Performance de Vendas</CardTitle>
                      <CardDescription>Análise de vendas dos últimos 6 meses</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AspectRatio ratio={16/9} className="bg-secondary/30 rounded-md flex items-center justify-center">
                    <div className="text-center p-8">
                      <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">Gráfico de análise de vendas</p>
                      <Button variant="secondary" size="sm" asChild className="mt-3">
                        <Link to="/sales">Ver Dashboard de Vendas</Link>
                      </Button>
                    </div>
                  </AspectRatio>
                </CardContent>
              </Card>

              <Card className="animate-fade-in" style={{animationDelay: '0.6s'}}>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Últimas ações no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start">
                        <div className={`w-2 h-2 mt-1.5 rounded-full mr-3 ${
                          activity.type === 'lead' ? 'bg-blue-500' :
                          activity.type === 'sale' ? 'bg-green-500' :
                          activity.type === 'campaign' ? 'bg-purple-500' : 'bg-orange-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" asChild>
                      <Link to="/reports" className="flex items-center justify-center">
                        Ver todas as atividades
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{animationDelay: '0.7s'}}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Conteúdo</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                      <Link to="/content">Ver Todos</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                      <div className="text-sm">Posts programados</div>
                      <div className="font-medium">0</div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                      <div className="text-sm">Campanhas ativas</div>
                      <div className="font-medium">0</div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                      <div className="text-sm">Anúncios ativos</div>
                      <div className="font-medium">0</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Clientes</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                      <Link to="/customers">Ver Todos</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                      <div className="text-sm">Total de clientes</div>
                      <div className="font-medium">0</div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                      <div className="text-sm">Novos este mês</div>
                      <div className="font-medium">0</div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                      <div className="text-sm">Taxa de retenção</div>
                      <div className="font-medium">-</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Produtos</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                      <Link to="/products">Ver Todos</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                      <div className="text-sm">Total produtos</div>
                      <div className="font-medium">0</div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                      <div className="text-sm">Baixo estoque</div>
                      <div className="font-medium">0</div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                      <div className="text-sm">Mais vendidos</div>
                      <div className="font-medium">-</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
