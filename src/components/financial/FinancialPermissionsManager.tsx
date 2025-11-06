import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Info } from 'lucide-react';

export const FinancialPermissionsManager = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Gerenciamento de Permissões
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="h-4 w-4" />
          <p>Sistema de permissões em desenvolvimento. Use a tabela user_roles para gerenciar acesso.</p>
        </div>
      </CardContent>
    </Card>
  );
};
