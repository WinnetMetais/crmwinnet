
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
      case 'proposta': return 'bg-blue-100 text-blue-800';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800';
      case 'boas-vindas': return 'bg-green-100 text-green-800';
      case 'confirmacao': return 'bg-purple-100 text-purple-800';
      case 'promocao': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Templates</h1>
                <p className="text-muted-foreground">Gerencie templates de email, propostas e mensagens</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Templates</p>
                      <p className="text-3xl font-bold">{templates.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Mais Usado</p>
                      <p className="text-2xl font-bold">Confirmação</p>
                    </div>
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Usos Totais</p>
                      <p className="text-3xl font-bold">391</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Categorias</p>
                      <p className="text-3xl font-bold">5</p>
                    </div>
                    <Filter className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="library" className="space-y-6">
              <TabsList>
                <TabsTrigger value="library">Biblioteca</TabsTrigger>
                <TabsTrigger value="create">Criar Template</TabsTrigger>
                <TabsTrigger value="categories">Categorias</TabsTrigger>
              </TabsList>

              <TabsContent value="library" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Filtros e Pesquisa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Pesquisar templates..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full md:w-[200px]">
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
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(template.type)}
                            <div>
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {template.description}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                          <Badge variant="outline">
                            {template.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {template.subject && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-muted-foreground">Assunto:</p>
                            <p className="text-sm">{template.subject}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                          <span>Usado {template.usageCount}x</span>
                          <span>Último uso: {new Date(template.lastUsed).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Copy className="mr-2 h-3 w-3" />
                            Usar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="mr-2 h-3 w-3" />
                            Editar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="mr-2 h-3 w-3" />
                            Excluir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="create" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Novo Template</CardTitle>
                    <CardDescription>Configure um novo template para usar em suas comunicações</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="templateName">Nome do Template</Label>
                        <Input id="templateName" placeholder="Ex: Proposta Lixeiras Premium" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="templateType">Tipo</Label>
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
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
                      <Label htmlFor="description">Descrição</Label>
                      <Input id="description" placeholder="Breve descrição do template..." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Conteúdo do Template</Label>
                      <Textarea 
                        id="content" 
                        placeholder="Digite o conteúdo do seu template aqui..."
                        className="min-h-40"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use variáveis como {{nome_cliente}}, {{empresa}}, {{valor}} para personalização automática.
                      </p>
                    </div>

                    <div className="flex space-x-4">
                      <Button>
                        Salvar Template
                      </Button>
                      <Button variant="outline">
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
                        <div key={category.value} className="flex items-center justify-between p-4 border rounded-lg">
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
                      <div className="flex space-x-4">
                        <Input placeholder="Nome da categoria..." />
                        <Button>Adicionar</Button>
                      </div>
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
