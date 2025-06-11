
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Mail, MessageSquare, Plus, Search, Filter, Copy, Edit, Trash2 } from "lucide-react";

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates = [
    {
      id: 1,
      name: 'Proposta Comercial - Lixeiras Industriais',
      category: 'proposta',
      type: 'Email',
      description: 'Template padrão para envio de propostas de lixeiras industriais',
      subject: 'Proposta Comercial - Lixeiras Winnet Metais',
      lastUsed: '2024-01-12',
      usageCount: 45
    },
    {
      id: 2,
      name: 'Follow-up Orçamento',
      category: 'follow-up',
      type: 'Email',
      description: 'Template para acompanhar orçamentos pendentes',
      subject: 'Acompanhamento - Sua cotação Winnet Metais',
      lastUsed: '2024-01-15',
      usageCount: 78
    },
    {
      id: 3,
      name: 'Boas-vindas Cliente',
      category: 'boas-vindas',
      type: 'Email',
      description: 'Mensagem de boas-vindas para novos clientes',
      subject: 'Bem-vindo à Winnet Metais!',
      lastUsed: '2024-01-14',
      usageCount: 23
    },
    {
      id: 4,
      name: 'Confirmação de Pedido',
      category: 'confirmacao',
      type: 'WhatsApp',
      description: 'Template para confirmar pedidos via WhatsApp',
      subject: '',
      lastUsed: '2024-01-15',
      usageCount: 156
    },
    {
      id: 5,
      name: 'Promoção Mensal',
      category: 'promocao',
      type: 'Email',
      description: 'Template para campanhas promocionais mensais',
      subject: 'Oferta Especial - Produtos em Destaque',
      lastUsed: '2024-01-10',
      usageCount: 89
    }
  ];

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'proposta', label: 'Propostas' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'boas-vindas', label: 'Boas-vindas' },
    { value: 'confirmacao', label: 'Confirmações' },
    { value: 'promocao', label: 'Promoções' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'proposta': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'boas-vindas': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'confirmacao': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'promocao': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'WhatsApp': return <MessageSquare className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto py-6 px-4 space-y-6">
            {/* Header melhorado */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
                  <p className="text-muted-foreground">Gerencie templates de email, propostas e mensagens</p>
                </div>
              </div>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Novo Template
              </Button>
            </div>

            {/* Stats Cards melhorados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Templates</p>
                      <p className="text-3xl font-bold">{templates.length}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Mais Usado</p>
                      <p className="text-2xl font-bold">Confirmação</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                      <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Usos Totais</p>
                      <p className="text-3xl font-bold">391</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                      <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Categorias</p>
                      <p className="text-3xl font-bold">5</p>
                    </div>
                    <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
                      <Filter className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="library" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="library">Biblioteca</TabsTrigger>
                <TabsTrigger value="create">Criar Template</TabsTrigger>
                <TabsTrigger value="categories">Categorias</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="library" className="space-y-6">
                {/* Filtros melhorados */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pesquisar Templates</CardTitle>
                    <CardDescription>Encontre rapidamente o template que precisa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Pesquisar por nome ou descrição..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Templates Grid melhorado */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-secondary rounded-lg">
                              {getTypeIcon(template.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg truncate">{template.name}</CardTitle>
                              <CardDescription className="text-sm line-clamp-2">
                                {template.description}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <Badge variant="outline" className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                          <Badge variant="secondary">
                            {template.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {template.subject && (
                          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Assunto:</p>
                            <p className="text-sm">{template.subject}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">{template.usageCount}</span> usos
                          </span>
                          <span>Atualizado: {new Date(template.lastUsed).toLocaleDateString('pt-BR')}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" className="flex-1">
                            <Copy className="mr-2 h-3 w-3" />
                            Usar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredTemplates.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhum template encontrado</h3>
                      <p className="text-muted-foreground mb-4">
                        Tente ajustar os filtros ou criar um novo template.
                      </p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeiro Template
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="create" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Novo Template</CardTitle>
                    <CardDescription>Configure um novo template para usar em suas comunicações</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="templateName">Nome do Template *</Label>
                        <Input id="templateName" placeholder="Ex: Proposta Lixeiras Premium" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="templateType">Tipo *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="proposal">Proposta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="proposta">Propostas</SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                            <SelectItem value="boas-vindas">Boas-vindas</SelectItem>
                            <SelectItem value="confirmacao">Confirmações</SelectItem>
                            <SelectItem value="promocao">Promoções</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto (Email)</Label>
                        <Input id="subject" placeholder="Assunto do email..." />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição *</Label>
                      <Input id="description" placeholder="Breve descrição do template..." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Conteúdo do Template *</Label>
                      <Textarea 
                        id="content" 
                        placeholder="Digite o conteúdo do seu template aqui..."
                        className="min-h-40"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use variáveis como: nome_cliente, empresa, valor para personalização automática.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="flex-1">
                        Salvar Template
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Pré-visualizar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gerenciar Categorias</CardTitle>
                    <CardDescription>Organize seus templates em categorias personalizadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categories.slice(1).map((category) => (
                        <div key={category.value} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div>
                            <div className="font-medium">{category.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {templates.filter(t => t.category === category.value).length} templates
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-medium mb-4">Adicionar Nova Categoria</h4>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Input placeholder="Nome da categoria..." className="flex-1" />
                        <Button className="w-full sm:w-auto">Adicionar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics dos Templates</CardTitle>
                    <CardDescription>Estatísticas de uso e performance dos seus templates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Analytics em Desenvolvimento</h3>
                      <p className="text-muted-foreground">
                        Em breve você terá acesso a métricas detalhadas sobre o uso dos seus templates.
                      </p>
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

export default Templates;
