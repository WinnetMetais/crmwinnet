
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Mail, 
  MessageSquare, 
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Download
} from "lucide-react";
import { toast } from "sonner";

const Templates = () => {
  const [emailTemplates] = useState([
    {
      id: 1,
      name: "Orçamento - Inicial",
      subject: "Orçamento Winnet Metais - {{cliente_nome}}",
      type: "Orçamento",
      status: "Ativo",
      lastUsed: "2024-01-15",
      content: "Prezado(a) {{cliente_nome}},\n\nSegue em anexo o orçamento solicitado...",
      variables: ["cliente_nome", "data_orcamento", "valor_total"]
    },
    {
      id: 2,
      name: "Follow-up - Proposta",
      subject: "Acompanhamento da proposta - {{numero_proposta}}",
      type: "Follow-up",
      status: "Ativo",
      lastUsed: "2024-01-14",
      content: "Olá {{cliente_nome}},\n\nEspero que esteja bem. Gostaria de acompanhar...",
      variables: ["cliente_nome", "numero_proposta", "data_proposta"]
    },
    {
      id: 3,
      name: "Boas-vindas - Novo Cliente",
      subject: "Bem-vindo à Winnet Metais!",
      type: "Boas-vindas",
      status: "Ativo",
      lastUsed: "2024-01-12",
      content: "Caro {{cliente_nome}},\n\nÉ com grande satisfação que damos as boas-vindas...",
      variables: ["cliente_nome", "vendedor_nome", "telefone_contato"]
    }
  ]);

  const [whatsappTemplates] = useState([
    {
      id: 1,
      name: "Confirmação de Pedido",
      type: "Confirmação",
      status: "Ativo",
      content: "Olá {{nome}}! Seu pedido #{{numero}} foi confirmado. Previsão de entrega: {{data_entrega}}",
      variables: ["nome", "numero", "data_entrega"]
    },
    {
      id: 2,
      name: "Lembrete de Pagamento",
      type: "Cobrança",
      status: "Ativo",
      content: "Oi {{nome}}! Lembrando que o pagamento do pedido #{{numero}} vence em {{dias}} dias.",
      variables: ["nome", "numero", "dias"]
    }
  ]);

  const [documentTemplates] = useState([
    {
      id: 1,
      name: "Contrato de Fornecimento",
      type: "Contrato",
      status: "Ativo",
      format: "PDF",
      size: "2 páginas",
      lastUpdated: "2024-01-10"
    },
    {
      id: 2,
      name: "Proposta Comercial",
      type: "Proposta",
      status: "Ativo",
      format: "DOCX",
      size: "3 páginas",
      lastUpdated: "2024-01-08"
    },
    {
      id: 3,
      name: "Relatório de Qualidade",
      type: "Relatório",
      status: "Ativo",
      format: "PDF",
      size: "1 página",
      lastUpdated: "2024-01-05"
    }
  ]);

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Orçamento": return "bg-blue-100 text-blue-800";
      case "Follow-up": return "bg-purple-100 text-purple-800";
      case "Boas-vindas": return "bg-green-100 text-green-800";
      case "Confirmação": return "bg-blue-100 text-blue-800";
      case "Cobrança": return "bg-orange-100 text-orange-800";
      case "Contrato": return "bg-red-100 text-red-800";
      case "Proposta": return "bg-blue-100 text-blue-800";
      case "Relatório": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
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
                <p className="text-muted-foreground">Gerencie templates de email, WhatsApp e documentos</p>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Templates Email</p>
                      <p className="text-3xl font-bold">{emailTemplates.length}</p>
                    </div>
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Templates WhatsApp</p>
                      <p className="text-3xl font-bold">{whatsappTemplates.length}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Templates Documentos</p>
                      <p className="text-3xl font-bold">{documentTemplates.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Usos no Mês</p>
                      <p className="text-3xl font-bold">87</p>
                    </div>
                    <Eye className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="email" className="space-y-6">
              <TabsList>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
                <TabsTrigger value="variaveis">Variáveis</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Templates de Email</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Template
                  </Button>
                </div>

                <div className="grid gap-4">
                  {emailTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{template.name}</h3>
                              <Badge className={getTypeColor(template.type)}>
                                {template.type}
                              </Badge>
                              <Badge className={getStatusColor(template.status)}>
                                {template.status}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              <strong>Assunto:</strong> {template.subject}
                            </p>
                            
                            <div className="bg-gray-50 p-3 rounded-md mb-3">
                              <p className="text-sm font-mono whitespace-pre-line">
                                {template.content.substring(0, 150)}...
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {template.variables.map((variable, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {`{{${variable}}}`}
                                </Badge>
                              ))}
                            </div>
                            
                            <p className="text-xs text-muted-foreground">
                              Último uso: {template.lastUsed}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="whatsapp" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Templates de WhatsApp</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Template
                  </Button>
                </div>

                <div className="grid gap-4">
                  {whatsappTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{template.name}</h3>
                              <Badge className={getTypeColor(template.type)}>
                                {template.type}
                              </Badge>
                              <Badge className={getStatusColor(template.status)}>
                                {template.status}
                              </Badge>
                            </div>
                            
                            <div className="bg-green-50 p-3 rounded-md mb-3 border-l-4 border-green-500">
                              <p className="text-sm">
                                {template.content}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {template.variables.map((variable, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {`{{${variable}}}`}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documentos" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Templates de Documentos</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Template
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documentTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <Badge className={getStatusColor(template.status)}>
                            {template.status}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold mb-2">{template.name}</h3>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tipo:</span>
                            <Badge className={getTypeColor(template.type)} variant="outline">
                              {template.type}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Formato:</span>
                            <span>{template.format}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tamanho:</span>
                            <span>{template.size}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Atualizado:</span>
                            <span>{template.lastUpdated}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" className="flex-1">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="variaveis" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Variáveis Disponíveis</CardTitle>
                    <CardDescription>
                      Liste de todas as variáveis que podem ser usadas nos templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Cliente</h4>
                        <div className="space-y-2">
                          {["{{cliente_nome}}", "{{cliente_email}}", "{{cliente_telefone}}", "{{cliente_empresa}}", "{{cliente_endereco}}"].map((variable, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <code className="text-sm">{variable}</code>
                              <Button variant="ghost" size="sm">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Orçamento</h4>
                        <div className="space-y-2">
                          {["{{numero_orcamento}}", "{{data_orcamento}}", "{{valor_total}}", "{{prazo_entrega}}", "{{vendedor_nome}}"].map((variable, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <code className="text-sm">{variable}</code>
                              <Button variant="ghost" size="sm">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Sistema</h4>
                        <div className="space-y-2">
                          {["{{data_atual}}", "{{hora_atual}}", "{{empresa_nome}}", "{{empresa_telefone}}", "{{empresa_email}}"].map((variable, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <code className="text-sm">{variable}</code>
                              <Button variant="ghost" size="sm">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
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
