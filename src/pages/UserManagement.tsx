
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Filter, Users, Shield, Settings, UserCheck, UserX, Edit, Trash2, Loader } from "lucide-react";
import { useProfiles } from '@/hooks/useProfiles';
import { useDepartments } from '@/hooks/useDepartments';
import { NewUserModal } from '@/components/users/NewUserModal';
import { toast } from '@/hooks/use-toast';

const UserManagement = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  const { profiles, loading, toggleUserStatus, updateProfile } = useProfiles();
  const { departments } = useDepartments();

  const roles = ['Administrador', 'Gerente', 'Vendedor', 'Analista', 'Operador'];

  const filteredUsers = profiles.filter(profile => {
    const matchesSearch = (profile.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (profile.department?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || profile.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = async (profileId: string, currentStatus: string) => {
    await toggleUserStatus(profileId, currentStatus);
  };

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
                      <p className="text-3xl font-bold">{loading ? '...' : profiles.length}</p>
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
                        {loading ? '...' : profiles.filter(u => u.status === 'active').length}
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
                        {loading ? '...' : profiles.filter(u => u.role === 'Administrador' || u.permissions?.includes('admin')).length}
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
                  <Button onClick={() => setOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Usuário
                  </Button>
                  
                  <NewUserModal open={open} onOpenChange={setOpen} />
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
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Carregando usuários...</span>
                  </div>
                ) : (
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
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Nenhum usuário encontrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((profile) => (
                          <TableRow key={profile.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{profile.full_name || profile.display_name || 'Sem nome'}</div>
                                <div className="text-sm text-muted-foreground">{profile.user_id}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getRoleColor(profile.role)}>
                                {profile.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{profile.department?.name || 'Não definido'}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(profile.status === 'active' ? 'Ativo' : 'Inativo')}>
                                {profile.status === 'active' ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {profile.last_login ? new Date(profile.last_login).toLocaleString() : 'Nunca'}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {(profile.permissions || []).slice(0, 2).map((permission) => (
                                  <Badge key={permission} variant="secondary" className="text-xs">
                                    {permission}
                                  </Badge>
                                ))}
                                {(profile.permissions || []).length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{(profile.permissions || []).length - 2}
                                  </Badge>
                                )}
                                {(profile.permissions || []).length === 0 && (
                                  <span className="text-xs text-muted-foreground">Sem permissões</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="icon" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  onClick={() => handleToggleStatus(profile.id, profile.status)}
                                >
                                  {profile.status === 'active' ? 
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
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
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
