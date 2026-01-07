import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building2, Shield, Database, Zap } from 'lucide-react';
import { ProfileManagement } from '@/components/admin/ProfileManagement';
import { DepartmentManagement } from '@/components/admin/DepartmentManagement';
import { PermissionManagement } from '@/components/admin/PermissionManagement';
import { AdminStats } from '@/components/admin/AdminStats';
import { CommercialTestData } from '@/components/admin/CommercialTestData';
import { CreateSampleData } from '@/components/financial/CreateSampleData';
import { SystemInitializer } from '@/components/admin/SystemInitializer';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
            <p className="text-muted-foreground">Gestão de perfis, departamentos e permissões</p>
          </div>
        </div>

        <AdminStats />

        <Tabs defaultValue="system" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="system" className="gap-2">
              <Zap className="h-4 w-4" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="profiles" className="gap-2">
              <Users className="h-4 w-4" />
              Perfis
            </TabsTrigger>
            <TabsTrigger value="departments" className="gap-2">
              <Building2 className="h-4 w-4" />
              Departamentos
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2">
              <Shield className="h-4 w-4" />
              Permissões
            </TabsTrigger>
            <TabsTrigger value="testdata" className="gap-2">
              <Database className="h-4 w-4" />
              Dados de Teste
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-4">
            <SystemInitializer />
          </TabsContent>

          <TabsContent value="profiles" className="space-y-4">
            <ProfileManagement />
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <DepartmentManagement />
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <PermissionManagement />
          </TabsContent>

          <TabsContent value="testdata" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CommercialTestData />
              <CreateSampleData />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
