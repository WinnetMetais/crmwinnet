
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Shield, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  UserPlus
} from "lucide-react";

const UserManagement = () => {
  const [users] = useState([
    {
      id: 1,
      name: "Carlos Silva",
      email: "carlos@winnetmetais.com",
      role: "Administrador",
      status: "ativo",
      lastLogin: "2024-01-15 09:30",
      permissions: ["vendas", "clientes", "produtos", "configuracoes", "usuarios"]
    },
    {
      id: 2,
      name: "Ana Oliveira",
      email: "ana@winnetmetais.com",
      role: "Vendedor",
      status: "ativo",
      lastLogin: "2024-01-15 08:45",
      permissions: ["vendas", "clientes", "produtos"]
    },
    {
      id: 3,
      name: "João Santos",
      email: "joao@winnetmetais.com",
      role: "Operacional",
      status: "ativo",
      lastLogin: "2024-01-14 16:20",
      permissions: ["produtos", "estoque"]
    },
    {
      id: 4,
      name: "Maria Costa",
      email: "maria@winnetmetais.com",
      role: "Vendedor",
      status: "inativo",
      lastLogin: "2024-01-10 14:15",
      permissions: ["vendas", "clientes"]
    }
  ]);

  const [roles] = useState([
    {
      name: "Administrador",
      description: "Acesso total ao sistema",
      users: 1,
      permissions: [
        "Gerenciar usuários",
        "Configurações do sistema",
        "Vendas e orçamentos",
        "Gestão de clientes",
        "Gestão de produtos",
        "Relatórios financeiros",
        "Backup e auditoria"
      ]
    },
    {
      name: "Vendedor",
      description: "Foco em vendas e relacionamento com clientes",
      users: 2,
      permissions: [
        "Vendas e orçamentos",
        "Gestão de clientes",
        "Visualizar produtos",
        "Follow-up de leads",
        "Relatórios de vendas"
      ]
    },
    {
      name: "Operacional",
      description: "Gestão de produtos e estoque",
      users: 1,
      permissions: [
        "Gestão de produtos",
        "Controle de estoque",
        "Atualizar preços",
        "Relatórios de produtos"
      ]
    },
    {
      name: "Financeiro",
      description: "Controle financeiro e relatórios",
      users: 0,
      permissions: [
        "Relatórios financeiros",
        "Gestão de pagamentos",
        "Controle de comissões",
        "Análise de margem"
      ]
    }
  ]);

  const [permissions] = useState([
    { module: "Vendas", permissions: ["Criar orçamentos", "Editar orçamentos", "Excluir orçamentos", "Aprovar vendas"] },
    { module: "Clientes", permissions: ["Visualizar clientes", "Criar clientes", "Editar clientes", "Excluir clientes"] },
    { module: "Produtos", permissions: ["Visualizar produtos", "Criar produtos", "Editar produtos", "Excluir produtos", "Gerenciar estoque"] },
    { module: "Financeiro", permissions: ["Ver relatórios", "Gerenciar pagamentos", "Configurar margens", "Exportar dados"] },
    { module: "Sistema", permissions: ["Configurações gerais", "Gerenciar usuários", "Backup", "Auditoria", "Integrações"] }
  ]);

  const getStatusColor = (status: string) => {
    return status === "ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrador": return "bg-purple-100 text-purple-800";
      case "Vendedor": return "bg-blue-100 text-blue-800";
      case "Operacional": return "bg-green-100 text-green-800";
      case "Financeiro": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const activeUsers = users.filter(u => u.status === "ativo").length;
  const totalRoles = roles.length;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
                <p className="text-muted-foreground">Gerencie usuários, permissões e níveis de acesso</p>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
                      <p className="text-3xl font-bold">{users.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Usuários Ativos</p>
                      <p className="text-3xl font-bold">{activeUsers}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Perfis de Acesso</p>
                      <p className="text-3xl font-bold">{totalRoles}</p>
                    </div>
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Sessões Ativas</p>
                      <p className="text-3xl font-bold">3</p>
                    </div>
                    <Eye className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="usuarios" className="space-y-6">
              <TabsList>
                <TabsTrigger value="usuarios">Usuários</TabsTrigger>
                <TabsTrigger value="perfis">Perfis de Acesso</TabsTrigger>
                <TabsTrigger value="permissoes">Permissões</TabsTrigger>
                <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
              </TabsList>

              <TabsContent value="usuarios" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Lista de Usuários</h2>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Novo Usuário
                  </Button>
                </div>

                <div className="grid gap-4">
                  {users.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{user.name}</h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground">
                                Último login: {user.lastLogin}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <Badge className={getRoleColor(user.role)}>
                                {user.role}
                              </Badge>
                            </div>
                            <div className="text-center">
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">{user.permissions.length}</p>
                              <p className="text-xs text-muted-foreground">Permissões</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="perfis" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Perfis de Acesso</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Perfil
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roles.map((role, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{role.name}</span>
                          <Badge>{role.users} usuários</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {role.description}
                        </p>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Permissões:</h4>
                          <div className="space-y-1">
                            {role.permissions.slice(0, 3).map((permission, i) => (
                              <div key={i} className="flex items-center space-x-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span className="text-xs">{permission}</span>
                              </div>
                            ))}
                            {role.permissions.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{role.permissions.length - 3} mais...
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="permissoes" className="space-y-6">
                <h2 className="text-xl font-semibold">Matriz de Permissões</h2>
                
                <div className="space-y-6">
                  {permissions.map((module, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{module.module}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {module.permissions.map((permission, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <Label className="text-sm">{permission}</Label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="auditoria" className="space-y-6">
                <h2 className="text-xl font-semibold">Log de Auditoria</h2>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">Carlos Silva fez login</p>
                          <p className="text-sm text-muted-foreground">15/01/2024 às 09:30</p>
                        </div>
                        <Badge variant="outline">Login</Badge>
                      </div>
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">Ana Oliveira criou novo cliente</p>
                          <p className="text-sm text-muted-foreground">15/01/2024 às 08:45</p>
                        </div>
                        <Badge variant="outline">Criação</Badge>
                      </div>
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">João Santos atualizou produto L1618</p>
                          <p className="text-sm text-muted-foreground">14/01/2024 às 16:20</p>
                        </div>
                        <Badge variant="outline">Edição</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Carlos Silva alterou permissões de Ana Oliveira</p>
                          <p className="text-sm text-muted-foreground">14/01/2024 às 14:15</p>
                        </div>
                        <Badge variant="outline">Permissão</Badge>
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

export default UserManagement;
