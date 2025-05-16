
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  Calendar,
  Edit,
  Eye, 
  MoreHorizontal,
  Instagram,
  Facebook,
  Linkedin,
  FileText,
  Image as ImageIcon,
  Video,
  PenTool,
  ThumbsUp,
  MessageSquare
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Content = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample content data
  const contentItems = [
    {
      id: 1,
      title: 'Tipos de Aço Inox: Qual o Melhor para Sua Indústria?',
      type: 'blog',
      status: 'Publicado',
      date: '15 Mai 2025',
      author: 'Ana Silva',
      platform: 'Blog',
      engagement: {
        views: 1240,
        likes: 58,
        comments: 12
      },
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Novos produtos de alumínio para o setor automotivo',
      type: 'social',
      status: 'Publicado',
      date: '12 Mai 2025',
      author: 'Carlos Santos',
      platform: 'Instagram',
      engagement: {
        views: 3580,
        likes: 245,
        comments: 37
      },
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Processo de Fabricação: Do Lingote às Chapas Metálicas',
      type: 'video',
      status: 'Publicado',
      date: '08 Mai 2025',
      author: 'Ricardo Gomes',
      platform: 'YouTube',
      engagement: {
        views: 2150,
        likes: 186,
        comments: 24
      },
      image: '/placeholder.svg'
    },
    {
      id: 4,
      title: 'Sustentabilidade na Indústria Metalúrgica',
      type: 'blog',
      status: 'Rascunho',
      date: '20 Mai 2025',
      author: 'Marina Costa',
      platform: 'Blog',
      engagement: {
        views: 0,
        likes: 0,
        comments: 0
      },
      image: '/placeholder.svg'
    },
    {
      id: 5,
      title: 'Novidades em ligas de bronze para uso marítimo',
      type: 'social',
      status: 'Agendado',
      date: '22 Mai 2025',
      author: 'Pedro Alves',
      platform: 'LinkedIn',
      engagement: {
        views: 0,
        likes: 0,
        comments: 0
      },
      image: '/placeholder.svg'
    },
    {
      id: 6,
      title: 'Guia Completo: Como Escolher o Metal Certo para Seu Projeto',
      type: 'ebook',
      status: 'Publicado',
      date: '30 Abr 2025',
      author: 'Juliana Mendes',
      platform: 'Website',
      engagement: {
        views: 578,
        likes: 0,
        comments: 0,
        downloads: 145
      },
      image: '/placeholder.svg'
    },
    {
      id: 7,
      title: 'Comparativo: Aço Carbono vs Aço Galvanizado',
      type: 'infographic',
      status: 'Publicado',
      date: '05 Mai 2025',
      author: 'Felipe Martins',
      platform: 'Facebook',
      engagement: {
        views: 4250,
        likes: 320,
        comments: 45,
        shares: 87
      },
      image: '/placeholder.svg'
    },
    {
      id: 8,
      title: 'Aplicações do Cobre na Indústria Moderna',
      type: 'blog',
      status: 'Rascunho',
      date: '25 Mai 2025',
      author: 'Ana Silva',
      platform: 'Blog',
      engagement: {
        views: 0,
        likes: 0,
        comments: 0
      },
      image: '/placeholder.svg'
    },
  ];

  // Filter content based on active tab and search term
  const filteredContent = contentItems.filter(item => {
    // Filter by type
    if (activeTab !== 'all' && item.type !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Content metrics
  const contentMetrics = [
    { 
      title: 'Total de Publicações',
      value: '36',
      change: '+8',
      changeLabel: 'vs. mês anterior',
      icon: FileText
    },
    { 
      title: 'Engajamento',
      value: '24.5K',
      change: '+15%',
      changeLabel: 'vs. mês anterior',
      icon: ThumbsUp
    },
    { 
      title: 'Taxa de Conversão',
      value: '3.8%',
      change: '+0.5%',
      changeLabel: 'vs. mês anterior',
      icon: MessageSquare
    }
  ];

  // Function to render platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="h-4 w-4" />;
      case 'Facebook':
        return <Facebook className="h-4 w-4" />;
      case 'LinkedIn':
        return <Linkedin className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Function to render content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'social':
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case 'video':
        return <Video className="h-4 w-4 mr-2" />;
      case 'infographic':
        return <ImageIcon className="h-4 w-4 mr-2" />;
      case 'ebook':
        return <FileText className="h-4 w-4 mr-2" />;
      default:
        return <FileText className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold">Gestão de Conteúdo</h1>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendário
                </Button>
                
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Conteúdo
                </Button>
              </div>
            </div>

            {/* Content Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {contentMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-sm font-medium">
                      <metric.icon className="mr-2 h-4 w-4" />
                      {metric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-green-600 mt-1">{metric.change} {metric.changeLabel}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Content Calendar Preview */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Calendário de Conteúdo
                </CardTitle>
                <CardDescription>
                  Publicações planejadas para os próximos 7 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => (
                    <div key={day} className="text-center font-medium text-sm">
                      {day}
                    </div>
                  ))}
                  
                  {Array.from({ length: 7 }).map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() + index);
                    const dayNumber = date.getDate();
                    
                    // Randomly assign content to some days for demo
                    const hasContent = [0, 2, 4].includes(index);
                    
                    return (
                      <div 
                        key={index} 
                        className={`border rounded-md p-2 min-h-[80px] ${
                          index === 0 ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <div className="text-right text-sm font-medium mb-1">{dayNumber}</div>
                        {hasContent && (
                          <div className={`text-xs p-1 rounded mb-1 ${
                            index === 0 ? "bg-blue-100 text-blue-700" :
                            index === 2 ? "bg-green-100 text-green-700" :
                            "bg-purple-100 text-purple-700"
                          }`}>
                            {index === 0 ? "Blog post" :
                             index === 2 ? "Instagram" :
                             "LinkedIn"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">Ver Calendário Completo</Button>
              </CardFooter>
            </Card>

            {/* Content List */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Biblioteca de Conteúdo</CardTitle>
                    <CardDescription>
                      Gerencie suas publicações e materiais
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar conteúdo..."
                        className="pl-8 w-full md:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Tabs 
                      defaultValue="all" 
                      className="w-full md:w-auto" 
                      onValueChange={setActiveTab}
                      value={activeTab}
                    >
                      <TabsList className="grid grid-cols-5 w-full md:w-auto">
                        <TabsTrigger value="all">Todos</TabsTrigger>
                        <TabsTrigger value="blog">Blog</TabsTrigger>
                        <TabsTrigger value="social">Social</TabsTrigger>
                        <TabsTrigger value="video">Vídeos</TabsTrigger>
                        <TabsTrigger value="infographic">Infográficos</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead>Plataforma</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Engajamento</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">Nenhum conteúdo encontrado</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContent.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded bg-gray-100 mr-3 overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-medium">{item.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getContentTypeIcon(item.type)}
                              <span className="capitalize">{item.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>
                                  {item.author.split(' ').map(name => name[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {item.author}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getPlatformIcon(item.platform)}
                              <span className="ml-1">{item.platform}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === 'Publicado' ? 'default' : 
                                item.status === 'Rascunho' ? 'outline' : 
                                'secondary'
                              }
                              className={
                                item.status === 'Publicado' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                                item.status === 'Rascunho' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' :
                                'bg-blue-100 text-blue-800 hover:bg-blue-100'
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.status === 'Publicado' ? (
                              <div className="flex items-center text-sm">
                                <div className="flex items-center mr-2">
                                  <Eye className="h-3 w-3 mr-1 text-muted-foreground" />
                                  {item.engagement.views.toLocaleString()}
                                </div>
                                <div className="flex items-center">
                                  <ThumbsUp className="h-3 w-3 mr-1 text-muted-foreground" />
                                  {item.engagement.likes.toLocaleString()}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Content;
