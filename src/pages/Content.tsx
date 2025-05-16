
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, MessageSquare, Megaphone, Calendar, Image, FileText, BarChart4, PlusCircle, ChevronRight } from "lucide-react";

const Content = () => {
  // Content modules
  const contentModules = [
    {
      title: "Planejamento de Conteúdo",
      description: "Defina a estratégia e calendário de conteúdo",
      icon: <Target className="h-6 w-6" />,
      link: "/content/plan",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Redes Sociais",
      description: "Gerencie posts e métricas das redes sociais",
      icon: <MessageSquare className="h-6 w-6" />,
      link: "/social",
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Anúncios",
      description: "Configure e analise campanhas de anúncios",
      icon: <Megaphone className="h-6 w-6" />,
      link: "/ads",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  // Recent content
  const recentContent = [
    {
      title: "Post LinkedIn - Lançamento de Produto",
      type: "Rede Social",
      date: "15/05/2025",
      status: "Publicado"
    },
    {
      title: "Campanha Google Ads - Aço Inox",
      type: "Anúncio",
      date: "12/05/2025",
      status: "Ativa"
    },
    {
      title: "Post Instagram - Processo Produtivo",
      type: "Rede Social",
      date: "10/05/2025",
      status: "Programado"
    },
    {
      title: "Artigo Blog - Tendências do Setor",
      type: "Blog",
      date: "05/05/2025",
      status: "Rascunho"
    }
  ];

  // Performance metrics
  const performanceMetrics = [
    { name: "Impressões totais", value: "128.450", change: "+12%", status: "positive" },
    { name: "Interações", value: "8.940", change: "+15%", status: "positive" },
    { name: "Taxa de Engajamento", value: "6.9%", change: "+3.2%", status: "positive" },
    { name: "Leads gerados", value: "42", change: "-5%", status: "negative" }
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold">Gestão de Conteúdo</h1>
                  <p className="text-muted-foreground">Planeje, crie e analise o conteúdo da Winnet Metais</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button asChild>
                  <Link to="/content/plan">
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendário de Conteúdo
                  </Link>
                </Button>
              </div>
            </div>

            {/* Content Modules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {contentModules.map((module, index) => (
                <Card key={index} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${module.color}`}>
                      {module.icon}
                    </div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={module.link}>
                        Acessar
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Performance Overview */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart4 className="mr-2 h-5 w-5" />
                  Performance de Conteúdo
                </CardTitle>
                <CardDescription>Métricas dos últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">{metric.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          metric.status === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/reports">
                    Ver Relatório Completo
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Content */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Conteúdo Recente</CardTitle>
                    <CardDescription>Últimos conteúdos criados ou programados</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Criar Novo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContent.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        {item.type === "Rede Social" && (
                          <div className="bg-green-100 text-green-800 p-2 rounded-md mr-3">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                        )}
                        {item.type === "Anúncio" && (
                          <div className="bg-purple-100 text-purple-800 p-2 rounded-md mr-3">
                            <Megaphone className="h-5 w-5" />
                          </div>
                        )}
                        {item.type === "Blog" && (
                          <div className="bg-blue-100 text-blue-800 p-2 rounded-md mr-3">
                            <FileText className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.type} • {item.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'Publicado' ? 'bg-green-100 text-green-800' : 
                          item.status === 'Ativa' ? 'bg-blue-100 text-blue-800' : 
                          item.status === 'Programado' ? 'bg-purple-100 text-purple-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link to="/content/plan">
                    Ver Calendário
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/content/social">
                    Gerenciar Redes Sociais
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/ads">
                    Campanhas de Anúncios
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Content Ideas */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="mr-2 h-5 w-5" />
                  Banco de Ideias de Conteúdo
                </CardTitle>
                <CardDescription>Ideias salvas para criação de conteúdo futuro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    "Vídeo sobre o processo de fabricação",
                    "Comparativo entre tipos de aço",
                    "Estudo de caso com cliente importante",
                    "Infográfico sobre aplicações dos metais",
                    "Artigo sobre sustentabilidade no setor metalúrgico",
                    "Tendências do mercado para 2026"
                  ].map((idea, index) => (
                    <div key={index} className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                      <p className="font-medium">{idea}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Nova Ideia
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Content;
