
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Filter, Users, Shield, Settings, UserCheck, UserX, Edit, Trash2 } from "lucide-react";

const UserManagement = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const users = [
    {
      id: 1,
      name: 'Carlos Silva',
      email: 'carlos@winnetmetais.com',
      role: 'Administrador',
      status: 'Ativo',
      lastLogin: '2024-01-15 14:30',
      department: 'Comercial',
      permissions: ['vendas', 'clientes', 'relatórios']
    },
    {
      id: 2,
      name: 'Ana Oliveira',
      email: 'ana@winnetmetais.com',
      role: 'Vendedor',
      status: 'Ativo',
      lastLogin: '2024-01-15 09:15',
      department: 'Comercial',
      permissions: ['vendas', 'clientes']
    },
    {
      id: 3,
      name: 'João Santos',
      email: 'joao@winnetmetais.com',
      role: 'Gerente',
      status: 'Ativo',
      lastLogin: '2024-01-14 16:45',
      department: 'Operações',
      permissions: ['vendas', 'clientes', 'relatórios', 'estoque']
    },
    {
      id: 4,
      name: 'Maria Costa',
      email: 'maria@winnetmetais.com',
      role: 'Vendedor',
      status: 'Inativo',
      lastLogin: '2024-01-10 11:20',
      department: 'Comercial',
      permissions: ['vendas', 'clientes']
    },
    {
      id: 5,
      name: 'Pedro Almeida',
      email: 'pedro@winnetmetais.com',
      role: 'Analista',
      status: 'Ativo',
      lastLogin: '2024-01-15 13:00',
      department: 'Financeiro',
      permissions: ['relatórios', 'financeiro']
    }
  ];

  const roles = ['Administrador', 'Gerente', 'Vendedor', 'Analista'];
  const departments = ['Comercial', 'Operações', 'Financeiro', 'Marketing'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrador': return 'bg-red-100 text-red-800';
      case 'Gerente': return 'bg-blue-100 text-blue-800';
      case 'Vendedor': return 'bg-green-100 text-green-800';
      case 'Analista': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Ativo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
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
                <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
                <p className="text-muted-foreground">Gerencie usuários, permissões e acessos do sistema</p>
              </div>
            </div>

            {/* Stats Cards */}
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
                      <p className="text-3xl font-bold text-green-600">
                        {users.filter(u => u.status === 'Ativo').length}
                      </p>
                    </div>
                    <UserCheck className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Administradores</p>
                      <p className="text-3xl font-bold text-red-600">
                        {users.filter(u => u.role === 'Administrador').length}
                      </p>
                    </div>
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Departamentos</p>
                      <p className="text-3xl font-bold text-purple-600">{departments.length}</p>
                    </div>
                    <Settings className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filtros e Pesquisa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar por nome, email ou departamento..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Filtrar por cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os cargos</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Novo Usuário
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                        <DialogDescription>
                          Preencha as informações do usuário e defina permissões.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo *</Label>
                            <Input id="name" placeholder="Nome do usuário" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input id="email" type="email" placeholder="email@winnetmetais.com" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="role">Cargo</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o cargo" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">Departamento</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o departamento" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Permissões</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {['vendas', 'clientes', 'relatórios', 'estoque', 'financeiro', 'configurações'].map((permission) => (
                              <div key={permission} className="flex items-center space-x-2">
                                <input type="checkbox" id={permission} />
                                <label htmlFor={permission} className="text-sm capitalize">{permission}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                          Cancelar
                        </Button>
                        <Button>Criar Usuário</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuários</CardTitle>
                <CardDescription>
                  Gerencie todos os usuários do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Permissões</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(user.lastLogin).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.slice(0, 2).map((permission) => (
                              <Badge key={permission} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                            {user.permissions.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{user.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              {user.status === 'Ativo' ? 
                                <UserX className="h-4 w-4" /> : 
                                <UserCheck className="h-4 w-4" />
                              }
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Permissions Management */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Permissões</CardTitle>
                  <CardDescription>
                    Configure permissões por cargo e departamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Permissões por Cargo</h4>
                      <div className="space-y-3">
                        {roles.map((role) => (
                          <div key={role} className="flex items-center justify-between p-3 border rounded">
                            <span className="font-medium">{role}</span>
                            <Button size="sm" variant="outline">
                              <Settings className="mr-2 h-3 w-3" />
                              Configurar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Atividade Recente</h4>
                      <div className="space-y-3">
                        <div className="text-sm p-3 bg-muted rounded">
                          <div className="font-medium">Carlos Silva</div>
                          <div className="text-muted-foreground">Fez login às 14:30</div>
                        </div>
                        <div className="text-sm p-3 bg-muted rounded">
                          <div className="font-medium">Ana Oliveira</div>
                          <div className="text-muted-foreground">Criou novo cliente</div>
                        </div>
                        <div className="text-sm p-3 bg-muted rounded">
                          <div className="font-medium">João Santos</div>
                          <div className="text-muted-foreground">Gerou relatório de vendas</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserManagement;
