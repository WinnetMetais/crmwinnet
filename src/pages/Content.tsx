
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Calendar, 
  Image, 
  Video,
  Megaphone,
  BookOpen,
  Plus,
  Edit,
  Eye,
  Share,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const Content = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  // Dados mock para conteúdo
  const contentCalendar = [
    {
      id: 1,
      title: "Lançamento Lixeira L4090 Premium",
      type: "post",
      platform: "Instagram",
      date: "2024-01-15",
      status: "agendado",
      content: "Nova linha premium de lixeiras industriais...",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Vídeo: Como escolher a lixeira ideal",
      type: "video",
      platform: "YouTube",
      date: "2024-01-18",
      status: "producao",
      content: "Tutorial completo sobre escolha de lixeiras..."
    },
    {
      id: 3,
      title: "Case: Projeto Metalúrgica ABC",
      type: "case",
      platform: "LinkedIn",
      date: "2024-01-20",
      status: "rascunho",
      content: "Estudo de caso do projeto de 500 lixeiras..."
    }
  ];

  const campaigns = [
    {
      id: 1,
      name: "Campanha Verão 2024",
      status: "ativa",
      posts: 12,
      alcance: "45.2K",
      engajamento: "8.4%",
      periodo: "01/01 - 31/03"
    },
    {
      id: 2,
      name: "Lixeiras Premium",
      status: "planejada",
      posts: 8,
      alcance: "-",
      engajamento: "-",
      periodo: "15/02 - 15/04"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'producao': return 'bg-yellow-100 text-yellow-800';
      case 'rascunho': return 'bg-gray-100 text-gray-800';
      case 'publicado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agendado': return <Clock className="h-4 w-4" />;
      case 'producao': return <AlertCircle className="h-4 w-4" />;
      case 'publicado': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-white hover:bg-white/10" />
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8" />
                  <div>
                    <h1 className="text-3xl font-bold">Gestão de Conteúdo - Winnet Metais</h1>
                    <p className="text-purple-100">Planejamento, Criação e Publicação de Conteúdo</p>
                  </div>
                </div>
              </div>
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                <Plus className="h-4 w-4 mr-2" />
                Novo Conteúdo
              </Button>
            </div>

            {/* Métricas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Posts Agendados</p>
                      <p className="text-3xl font-bold">24</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Campanhas Ativas</p>
                      <p className="text-3xl font-bold">3</p>
                    </div>
                    <Megaphone className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Alcance Total</p>
                      <p className="text-3xl font-bold">125K</p>
                    </div>
                    <Eye className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taxa Engajamento</p>
                      <p className="text-3xl font-bold">8.4%</p>
                    </div>
                    <Share className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="calendario" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="calendario">Calendário Editorial</TabsTrigger>
                <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
                <TabsTrigger value="catalogo">Catálogo Digital</TabsTrigger>
                <TabsTrigger value="criar">Criar Conteúdo</TabsTrigger>
              </TabsList>

              <TabsContent value="calendario" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {contentCalendar.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {item.type === 'video' ? <Video className="h-5 w-5" /> : 
                             item.type === 'case' ? <BookOpen className="h-5 w-5" /> : 
                             <Image className="h-5 w-5" />}
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1">{item.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Plataforma:</span>
                            <span className="font-medium">{item.platform}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Data:</span>
                            <span className="font-medium">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.content}
                          </p>
                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Visualizar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="campanhas" className="space-y-6">
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-semibold">{campaign.name}</h3>
                              <Badge variant={campaign.status === 'ativa' ? 'default' : 'secondary'}>
                                {campaign.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">Período: {campaign.periodo}</p>
                          </div>
                          <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                              <p className="text-2xl font-bold">{campaign.posts}</p>
                              <p className="text-sm text-muted-foreground">Posts</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{campaign.alcance}</p>
                              <p className="text-sm text-muted-foreground">Alcance</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{campaign.engajamento}</p>
                              <p className="text-sm text-muted-foreground">Engajamento</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="catalogo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-6 w-6" />
                      Catálogo Digital de Produtos Winnet Metais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="border-2 border-dashed border-gray-300">
                        <CardContent className="p-6 text-center">
                          <Plus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="font-medium mb-2">Lixeiras Sem Tampa</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Catálogo completo da linha sem tampa
                          </p>
                          <Button>Criar Catálogo</Button>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-dashed border-gray-300">
                        <CardContent className="p-6 text-center">
                          <Plus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="font-medium mb-2">Lixeiras Com Aro</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Catálogo completo da linha com aro
                          </p>
                          <Button>Criar Catálogo</Button>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-dashed border-gray-300">
                        <CardContent className="p-6 text-center">
                          <Plus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="font-medium mb-2">Catálogo Geral</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Todos os produtos Winnet Metais
                          </p>
                          <Button>Criar Catálogo</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="criar" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Novo Conteúdo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contentTitle">Título do Conteúdo</Label>
                        <Input id="contentTitle" placeholder="Ex: Lançamento Nova Linha Premium" />
                      </div>
                      <div>
                        <Label htmlFor="contentType">Tipo de Conteúdo</Label>
                        <select id="contentType" className="w-full p-2 border rounded-md">
                          <option value="post">Post Social</option>
                          <option value="video">Vídeo</option>
                          <option value="case">Case de Sucesso</option>
                          <option value="catalogo">Catálogo</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="platform">Plataforma</Label>
                        <select id="platform" className="w-full p-2 border rounded-md">
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="youtube">YouTube</option>
                          <option value="site">Site Winnet</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="publishDate">Data de Publicação</Label>
                        <Input id="publishDate" type="datetime-local" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contentBody">Conteúdo</Label>
                      <Textarea 
                        id="contentBody" 
                        placeholder="Escreva seu conteúdo aqui..."
                        rows={6}
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button variant="outline">Salvar Rascunho</Button>
                      <Button>Agendar Publicação</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Content;
