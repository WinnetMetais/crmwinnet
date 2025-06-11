
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Plus, Share2, Heart, MessageCircle, Repeat, Eye, Clock } from "lucide-react";

const Social = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const socialPosts = [
    {
      id: 1,
      content: 'Novos modelos de lixeiras em aço inox chegaram! Resistência e durabilidade para sua empresa. 🏭✨',
      platform: 'Instagram',
      status: 'Publicado',
      publishDate: '2024-01-15 10:00',
      engagement: { likes: 245, comments: 12, shares: 8 },
      reach: '3.2K'
    },
    {
      id: 2,
      content: 'Alumínio naval de alta qualidade para construção marítima. Conheça nossa linha premium.',
      platform: 'LinkedIn',
      status: 'Agendado',
      publishDate: '2024-01-16 14:30',
      engagement: { likes: 0, comments: 0, shares: 0 },
      reach: '-'
    },
    {
      id: 3,
      content: 'Dica do dia: Como escolher o metal ideal para seu projeto industrial? Confira nosso blog!',
      platform: 'Facebook',
      status: 'Rascunho',
      publishDate: '',
      engagement: { likes: 0, comments: 0, shares: 0 },
      reach: '-'
    }
  ];

  const platformStats = [
    { name: 'Instagram', followers: '2.1K', engagement: '4.2%', posts: 45 },
    { name: 'LinkedIn', followers: '890', engagement: '6.1%', posts: 23 },
    { name: 'Facebook', followers: '1.5K', engagement: '3.8%', posts: 38 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publicado': return 'bg-green-100 text-green-800';
      case 'Agendado': return 'bg-blue-100 text-blue-800';
      case 'Rascunho': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram': return 'bg-pink-100 text-pink-800';
      case 'LinkedIn': return 'bg-blue-100 text-blue-800';
      case 'Facebook': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold">Redes Sociais</h1>
                  <p className="text-muted-foreground">Gerencie suas publicações e engajamento</p>
                </div>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Publicação
              </Button>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {platformStats.map((platform, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{platform.name}</h3>
                      <Badge variant="outline" className={getPlatformColor(platform.name)}>
                        {platform.posts} posts
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Seguidores</span>
                        <span className="font-bold">{platform.followers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Engajamento</span>
                        <span className="font-bold text-green-600">{platform.engagement}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="posts" className="space-y-6">
              <TabsList>
                <TabsTrigger value="posts">Publicações</TabsTrigger>
                <TabsTrigger value="schedule">Agenda</TabsTrigger>
                <TabsTrigger value="create">Criar Post</TabsTrigger>
                <TabsTrigger value="analytics">Analítica</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Feed de Publicações</CardTitle>
                    <CardDescription>Gerencie todas suas publicações em um só lugar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {socialPosts.map((post) => (
                        <div key={post.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline" className={getPlatformColor(post.platform)}>
                                  {post.platform}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(post.status)}>
                                  {post.status}
                                </Badge>
                                {post.publishDate && (
                                  <span className="text-sm text-muted-foreground flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {new Date(post.publishDate).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm mb-3">{post.content}</p>
                              
                              {post.status === 'Publicado' && (
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Heart className="mr-1 h-3 w-3" />
                                    {post.engagement.likes}
                                  </div>
                                  <div className="flex items-center">
                                    <MessageCircle className="mr-1 h-3 w-3" />
                                    {post.engagement.comments}
                                  </div>
                                  <div className="flex items-center">
                                    <Repeat className="mr-1 h-3 w-3" />
                                    {post.engagement.shares}
                                  </div>
                                  <div className="flex items-center">
                                    <Eye className="mr-1 h-3 w-3" />
                                    {post.reach}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">Editar</Button>
                              <Button size="sm" variant="outline">
                                <Share2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle>Calendário</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>
                  
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Posts Agendados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {socialPosts.filter(p => p.status === 'Agendado').map((post) => (
                          <div key={post.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline" className={getPlatformColor(post.platform)}>
                                  {post.platform}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(post.publishDate).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm">{post.content}</p>
                            </div>
                            <Button size="sm" variant="outline">Editar</Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="create" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Nova Publicação</CardTitle>
                    <CardDescription>Componha sua mensagem e escolha onde publicar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="platform">Plataforma</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a plataforma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="all">Todas as plataformas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Tipo de Publicação</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de conteúdo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Apenas Texto</SelectItem>
                            <SelectItem value="image">Imagem + Texto</SelectItem>
                            <SelectItem value="video">Vídeo + Texto</SelectItem>
                            <SelectItem value="link">Link + Texto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Conteúdo da Publicação</Label>
                      <Textarea 
                        id="content" 
                        placeholder="Digite sua mensagem aqui..."
                        className="min-h-32"
                      />
                      <p className="text-xs text-muted-foreground">
                        Caracteres restantes: 280 (Twitter) | 2200 (Instagram) | 3000 (LinkedIn)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="schedule">Agendamento</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Quando publicar?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="now">Publicar agora</SelectItem>
                            <SelectItem value="schedule">Agendar publicação</SelectItem>
                            <SelectItem value="draft">Salvar como rascunho</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="datetime">Data e Hora</Label>
                        <Input type="datetime-local" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Hashtags Sugeridas</Label>
                      <div className="flex flex-wrap gap-2">
                        {['#WinnetMetais', '#AçoInox', '#AlumínioNaval', '#MetaisEspeciais', '#Indústria'].map((tag, index) => (
                          <Badge key={index} variant="outline" className="cursor-pointer hover:bg-blue-100">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button>Publicar</Button>
                      <Button variant="outline">Agendar</Button>
                      <Button variant="outline">Salvar Rascunho</Button>
                      <Button variant="outline">Pré-visualizar</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Engajamento por Plataforma</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {platformStats.map((platform, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border rounded">
                            <div>
                              <div className="font-medium">{platform.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {platform.followers} seguidores
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">{platform.engagement}</div>
                              <div className="text-xs text-muted-foreground">Taxa de engajamento</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Melhores Horários</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Instagram</span>
                          <span className="font-medium">18:00 - 20:00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>LinkedIn</span>
                          <span className="font-medium">08:00 - 10:00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Facebook</span>
                          <span className="font-medium">19:00 - 21:00</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Posts com Melhor Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {socialPosts.filter(p => p.status === 'Publicado').map((post) => (
                        <div key={post.id} className="flex justify-between items-center p-3 border rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{post.content.substring(0, 60)}...</p>
                            <div className="text-xs text-muted-foreground">
                              {post.platform} • {new Date(post.publishDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{post.engagement.likes} likes</div>
                            <div className="text-sm text-muted-foreground">{post.reach} alcance</div>
                          </div>
                        </div>
                      ))}
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

export default Social;
