
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Instagram, 
  Linkedin, 
  Facebook, 
  Twitter, 
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share,
  BarChart,
  Eye,
  ThumbsUp,
  Clock,
  FileText,
  Image as ImageIcon,
  UploadCloud
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Social = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('posts');

  // Dados fictícios para posts e métricas
  const socialPosts = [
    {
      id: 1,
      content: "A utilização de aço inoxidável na indústria alimentícia garante mais segurança e durabilidade. Conheça nossa linha completa de produtos para o setor.",
      image: "/placeholder.svg",
      publishedAt: "2025-05-12",
      platform: "Instagram",
      status: "Publicado",
      engagement: {
        likes: 124,
        comments: 8,
        shares: 12,
        reach: 2450
      }
    },
    {
      id: 2,
      content: "Webinar: Tendências em ligas metálicas para 2025. Nossos especialistas vão apresentar as novidades do setor e como elas podem impactar seu negócio. Link na bio!",
      image: "/placeholder.svg",
      publishedAt: "2025-05-15",
      platform: "LinkedIn",
      status: "Agendado",
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0
      }
    },
    {
      id: 3,
      content: "#DicaTécnica: O bronze é uma excelente escolha para peças que precisam resistir ao atrito. Sua composição permite maior durabilidade em sistemas mecânicos. Saiba mais em nosso blog.",
      image: "/placeholder.svg",
      publishedAt: "2025-05-08",
      platform: "Facebook",
      status: "Publicado",
      engagement: {
        likes: 89,
        comments: 5,
        shares: 7,
        reach: 1870
      }
    },
    {
      id: 4,
      content: "O alumínio é até 3x mais leve que o aço, mantendo excelente resistência mecânica. Por isso é a escolha ideal para projetos que demandam estruturas leves sem perder a qualidade.",
      image: null,
      publishedAt: "2025-05-18",
      platform: "LinkedIn",
      status: "Rascunho",
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0
      }
    },
    {
      id: 5,
      content: "Case de sucesso: Veja como a implementação de nossas chapas de aço galvanizado aumentou a vida útil dos equipamentos da Indústria ABC em mais de 40%.",
      image: "/placeholder.svg",
      publishedAt: "2025-05-10",
      platform: "Instagram",
      status: "Publicado",
      engagement: {
        likes: 156,
        comments: 23,
        shares: 18,
        reach: 3240
      }
    },
  ];

  // Métricas de performance
  const performanceMetrics = [
    { 
      platform: "Instagram", 
      followers: 3580,
      engagement: "3.8%",
      growth: "+2.5%",
      icon: Instagram,
      color: "bg-pink-100 text-pink-800" 
    },
    { 
      platform: "LinkedIn", 
      followers: 2450,
      engagement: "4.2%",
      growth: "+3.1%",
      icon: Linkedin,
      color: "bg-blue-100 text-blue-800"
    },
    { 
      platform: "Facebook", 
      followers: 1890,
      engagement: "2.6%",
      growth: "+1.2%",
      icon: Facebook,
      color: "bg-indigo-100 text-indigo-800"
    }
  ];

  // Status do post
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Publicado':
        return 'bg-green-100 text-green-800';
      case 'Agendado':
        return 'bg-blue-100 text-blue-800';
      case 'Rascunho':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Icon da plataforma
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'Instagram':
        return <Instagram className="h-4 w-4" />;
      case 'LinkedIn':
        return <Linkedin className="h-4 w-4" />;
      case 'Facebook':
        return <Facebook className="h-4 w-4" />;
      case 'Twitter':
        return <Twitter className="h-4 w-4" />;
      default:
        return null;
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
                <h1 className="text-3xl font-bold">Redes Sociais</h1>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Calendário
                </Button>
                
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Post
                </Button>
              </div>
            </div>

            {/* Métricas das Plataformas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {performanceMetrics.map((platform) => (
                <Card key={platform.platform}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-sm font-medium">
                      <platform.icon className="mr-2 h-5 w-5" />
                      {platform.platform}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-2xl font-bold">{platform.followers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Seguidores</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{platform.engagement}</div>
                        <p className="text-xs text-muted-foreground">Engajamento</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 font-medium">{platform.growth}</p>
                        <p className="text-xs text-muted-foreground">Crescimento</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Estrutura de Tabs */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Gerenciamento de Posts</CardTitle>
                    <CardDescription>Crie, agende e analise suas publicações</CardDescription>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select defaultValue="todas">
                      <SelectTrigger className="w-full sm:w-[150px]">
                        <SelectValue placeholder="Plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="todos">
                      <SelectTrigger className="w-full sm:w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="publicados">Publicados</SelectItem>
                        <SelectItem value="agendados">Agendados</SelectItem>
                        <SelectItem value="rascunhos">Rascunhos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="calendar">Calendário</TabsTrigger>
                    <TabsTrigger value="analytics">Análises</TabsTrigger>
                  </TabsList>
                
                <CardContent>
                  <TabsContent value="posts" className="mt-0">
                    <div className="space-y-6">
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" className="mb-2">
                          <UploadCloud className="mr-2 h-4 w-4" />
                          Importar Conteúdo
                        </Button>
                      </div>
                    
                      {/* Criação rápida de post */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>WM</AvatarFallback>
                              <AvatarImage src="/placeholder.svg" alt="Winnet Metais" />
                            </Avatar>
                            <div className="flex-1 space-y-4">
                              <Textarea 
                                placeholder="O que deseja compartilhar hoje?" 
                                className="min-h-20"
                              />
                              <div className="flex flex-wrap justify-between items-center gap-2">
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <ImageIcon className="h-4 w-4 mr-1" /> Imagem
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4 mr-1" /> Documento
                                  </Button>
                                </div>
                                <div className="flex gap-2">
                                  <Select defaultValue="instagram">
                                    <SelectTrigger className="w-[140px]">
                                      <SelectValue placeholder="Plataforma" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="instagram">Instagram</SelectItem>
                                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                                      <SelectItem value="facebook">Facebook</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" size="sm" className="w-[150px] justify-start">
                                        <Clock className="mr-2 h-4 w-4" />
                                        Agendar
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        className="p-3"
                                      />
                                      <div className="p-3 border-t">
                                        <Select defaultValue="09:00">
                                          <SelectTrigger>
                                            <SelectValue placeholder="Horário" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="09:00">09:00</SelectItem>
                                            <SelectItem value="12:00">12:00</SelectItem>
                                            <SelectItem value="15:00">15:00</SelectItem>
                                            <SelectItem value="18:00">18:00</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                  
                                  <Button>Publicar</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Lista de posts */}
                      <div className="space-y-6">
                        {socialPosts.map((post) => (
                          <Card key={post.id}>
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback>WM</AvatarFallback>
                                    <AvatarImage src="/placeholder.svg" alt="Winnet Metais" />
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium">Winnet Metais</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                      <span>•</span>
                                      <span className="flex items-center">
                                        {getPlatformIcon(post.platform)}
                                      </span>
                                      <Badge variant="outline" className={`ml-1 ${getStatusColor(post.status)}`}>
                                        {post.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                    <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                    <DropdownMenuItem>Reagendar</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              
                              <div className="mt-4">
                                <p className="text-sm">{post.content}</p>
                                
                                {post.image && (
                                  <div className="mt-3 rounded-md overflow-hidden">
                                    <img 
                                      src={post.image} 
                                      alt="Conteúdo do post" 
                                      className="w-full h-auto object-cover" 
                                    />
                                  </div>
                                )}
                              </div>
                              
                              {post.status === 'Publicado' && (
                                <div className="mt-4 pt-4 border-t">
                                  <div className="flex justify-between">
                                    <div className="flex space-x-6">
                                      <div className="flex items-center text-sm">
                                        <Heart className="h-4 w-4 mr-1" />
                                        {post.engagement.likes}
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        {post.engagement.comments}
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <Share className="h-4 w-4 mr-1" />
                                        {post.engagement.shares}
                                      </div>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <Eye className="h-4 w-4 mr-1" />
                                      {post.engagement.reach} visualizações
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="calendar" className="mt-0">
                    <div className="p-4 bg-muted/50 rounded-md h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <CalendarIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="font-medium mb-1">Calendário de Publicações</h3>
                        <p className="text-sm text-muted-foreground">
                          Visualize e organize suas publicações em um calendário interativo
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="mt-0">
                    <div className="p-4 bg-muted/50 rounded-md h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="font-medium mb-1">Análise de Performance</h3>
                        <p className="text-sm text-muted-foreground">
                          Explore métricas detalhadas sobre o desempenho dos seus posts
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Social;
