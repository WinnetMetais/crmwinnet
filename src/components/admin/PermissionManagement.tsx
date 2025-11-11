import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useProfiles } from '@/hooks/useProfiles';
import { Shield, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PERMISSION_MODULES = [
  { value: 'customers', label: 'Clientes' },
  { value: 'sales', label: 'Vendas' },
  { value: 'financial', label: 'Financeiro' },
  { value: 'products', label: 'Produtos' },
  { value: 'reports', label: 'Relatórios' },
  { value: 'settings', label: 'Configurações' },
];

const PERMISSION_TYPES = [
  { value: 'view', label: 'Visualizar' },
  { value: 'create', label: 'Criar' },
  { value: 'edit', label: 'Editar' },
  { value: 'delete', label: 'Excluir' },
  { value: 'admin', label: 'Administrador' },
];

export const PermissionManagement = () => {
  const { profiles, updateUserPermissions } = useProfiles();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const activeProfiles = profiles.filter(p => p.status === 'active');

  const handleSavePermissions = async () => {
    if (!selectedUser) {
      toast({
        title: 'Erro',
        description: 'Selecione um usuário primeiro.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateUserPermissions(selectedUser, selectedPermissions);
      toast({
        title: 'Permissões atualizadas',
        description: 'As permissões do usuário foram atualizadas com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as permissões.',
        variant: 'destructive',
      });
    }
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-foreground">Gestão de Permissões</CardTitle>
            <CardDescription>Configure as permissões de acesso dos usuários</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Selecionar Usuário</Label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              {activeProfiles.map(profile => (
                <SelectItem key={profile.id} value={profile.user_id}>
                  {profile.full_name || profile.user_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedUser && (
          <>
            <div className="space-y-4">
              <Label>Módulos e Permissões</Label>
              <div className="grid gap-4 md:grid-cols-2">
                {PERMISSION_MODULES.map(module => (
                  <Card key={module.value}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-foreground">{module.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {PERMISSION_TYPES.map(type => {
                        const permissionKey = `${module.value}_${type.value}`;
                        const isSelected = selectedPermissions.includes(permissionKey);
                        
                        return (
                          <Badge
                            key={permissionKey}
                            variant={isSelected ? 'default' : 'outline'}
                            className="cursor-pointer mr-2"
                            onClick={() => togglePermission(permissionKey)}
                          >
                            {type.label}
                          </Badge>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSavePermissions} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Permissões
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
