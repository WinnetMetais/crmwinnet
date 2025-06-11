
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Calendar, Share2, Target, TrendingUp, Users } from "lucide-react";

const Content = () => {
  const contentModules = [
    {
      title: "Planejamento de Conteúdo",
      description: "Crie e gerencie seu calendário editorial",
      icon: Calendar,
      link: "/content/plan",
      color: "bg-blue-500"
    },
    {
      title: "Redes Sociais",
      description: "Gerencie posts e campanhas sociais",
      icon: Share2,
      link: "/content/social",
      color: "bg-purple-500"
    },
    {
      title: "Anúncios",
      description: "Crie e monitore campanhas de anúncios",
      icon: Target,
      link: "/content/ads",
      color: "bg-green-500"
    }
  ];

  const stats = [
    {
      title: "Conteúdos Publicados",
      value: "28",
      icon: FileText,
      change: "+12%"
    },
    {
      title: "Engajamento Médio",
      value: "8.4%",
      icon: TrendingUp,
      change: "+2.1%"
    },
    {
      title: "Alcance Total",
      value: "15.2K",
      icon: Users,
      change: "+18%"
    }
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Gestão de Conteúdo</h1>
                <p className="text-muted-foreground">Centralize a criação e distribuição do seu conteúdo</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-xs text-green-600">{stat.change} vs mês anterior</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Modules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contentModules.map((module, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-4`}>
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to={module.link}>Acessar Módulo</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Content;
