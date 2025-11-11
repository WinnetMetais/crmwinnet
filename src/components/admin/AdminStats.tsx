import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Shield, Activity } from 'lucide-react';
import { useProfiles } from '@/hooks/useProfiles';
import { useDepartments } from '@/hooks/useDepartments';

export const AdminStats = () => {
  const { profiles } = useProfiles();
  const { departments } = useDepartments();

  const activeProfiles = profiles.filter(p => p.status === 'active').length;
  const activeDepartments = departments.filter(d => d.active).length;

  const stats = [
    {
      title: 'Total de Usuários',
      value: profiles.length,
      icon: Users,
      description: `${activeProfiles} ativos`,
      color: 'text-primary'
    },
    {
      title: 'Departamentos',
      value: departments.length,
      icon: Building2,
      description: `${activeDepartments} ativos`,
      color: 'text-accent-foreground'
    },
    {
      title: 'Permissões Ativas',
      value: profiles.reduce((acc, p) => acc + (p.permissions?.length || 0), 0),
      icon: Shield,
      description: 'Configuradas no sistema',
      color: 'text-secondary-foreground'
    },
    {
      title: 'Sistema',
      value: 'Online',
      icon: Activity,
      description: 'Todos os serviços operacionais',
      color: 'text-primary'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
