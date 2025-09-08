import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, UserCheck, Settings, Eye, DollarSign, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/transactions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FinancialPermission {
  id: string;
  user_id: string;
  permission_type: string;  // Removido type constraint para aceitar string genérico
  module: string;
  granted_at: string;
  expires_at?: string;
  active: boolean;
}

const permissionLabels = {
  admin: { label: 'Administrador', icon: Shield, color: 'bg-red-100 text-red-800' },
  finance: { label: 'Financeiro', icon: DollarSign, color: 'bg-blue-100 text-blue-800' },
  read_only: { label: 'Somente Leitura', icon: Eye, color: 'bg-gray-100 text-gray-800' },
  sales: { label: 'Vendas', icon: UserCheck, color: 'bg-green-100 text-green-800' }
};

export const FinancialPermissionsManager = () => {
  const [permissions, setPermissions] = useState<FinancialPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getMyPermissions();
      setPermissions(data || []);
      
      // Verifica se é admin
      const adminPermission = data?.some(p => p.permission_type === 'admin' && p.active);
      setIsAdmin(adminPermission || false);
      
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao carregar permissões',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    try {
      const adminCheck = await transactionService.checkFinancialPermissions('admin');
      const financeCheck = await transactionService.checkFinancialPermissions('finance');
      const readCheck = await transactionService.checkFinancialPermissions('read_only');
      
      toast({
        title: 'Status das Permissões',
        description: (
          <div className="space-y-1">
            <div>Admin: {adminCheck ? '✅ Ativo' : '❌ Inativo'}</div>
            <div>Financeiro: {financeCheck ? '✅ Ativo' : '❌ Inativo'}</div>  
            <div>Leitura: {readCheck ? '✅ Ativo' : '❌ Inativo'}</div>
          </div>
        ),
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao verificar permissões',
        variant: 'destructive',
      });
    }
  };

  const getPermissionBadge = (permission: FinancialPermission) => {
    const config = permissionLabels[permission.permission_type as keyof typeof permissionLabels];
    if (!config) return <Badge variant="outline">{permission.permission_type}</Badge>;
    
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getModuleBadge = (module: string) => {
    const moduleLabels: Record<string, string> = {
      all: 'Todos os Módulos',
      transactions: 'Transações',
      reports: 'Relatórios', 
      config: 'Configurações'
    };

    return (
      <Badge variant="outline">
        {moduleLabels[module] || module}
      </Badge>
    );
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissões Financeiras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">Carregando permissões...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permissões Financeiras
        </CardTitle>
        <CardDescription>
          Gerencie suas permissões no sistema financeiro. 
          {isAdmin && ' Você tem acesso total como administrador.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status de Autonomia */}
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  Sistema de Autonomia Ativo
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Soft delete, auditoria e controle de permissões implementados
                </p>
              </div>
            </div>
            <Button
              onClick={checkPermissions}
              variant="outline"
              size="sm"
              className="border-green-300 hover:bg-green-100"
            >
              <Settings className="h-4 w-4 mr-2" />
              Verificar Status
            </Button>
          </div>

          {/* Permissões Atuais */}
          {permissions.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Nenhuma permissão encontrada</p>
              <p className="text-sm text-muted-foreground">
                Entre em contato com o administrador para obter acesso
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">Suas Permissões</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Módulo</TableHead>
                    <TableHead>Concedido em</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell>
                        {getPermissionBadge(permission)}
                      </TableCell>
                      <TableCell>
                        {getModuleBadge(permission.module)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(permission.granted_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {permission.expires_at ? (
                          format(new Date(permission.expires_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                        ) : (
                          <Badge variant="secondary">Sem expiração</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={permission.active ? "default" : "destructive"}>
                          {permission.active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Níveis de Acesso */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Níveis de Acesso Disponíveis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(permissionLabels).map(([key, config]) => {
                const Icon = config.icon;
                const hasPermission = permissions.some(p => p.permission_type === key && p.active);
                
                return (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">{config.label}</h4>
                      {hasPermission && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {key === 'admin' && 'Acesso total: criar, editar, excluir e gerenciar permissões'}
                      {key === 'finance' && 'Gerenciar transações: criar, editar e excluir'}
                      {key === 'read_only' && 'Apenas visualizar dados financeiros'}
                      {key === 'sales' && 'Criar receitas a partir de vendas aprovadas'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};