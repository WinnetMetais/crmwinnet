
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, RefreshCw, Database, Calendar, CheckCircle } from "lucide-react";

const Backup = () => {
  const backupHistory = [
    {
      id: 1,
      date: "2024-01-15 14:30",
      type: "Automático",
      size: "45.2 MB",
      status: "Concluído",
      modules: ["Clientes", "Vendas", "Financeiro"]
    },
    {
      id: 2,
      date: "2024-01-14 14:30",
      type: "Automático",
      size: "44.8 MB",
      status: "Concluído",
      modules: ["Clientes", "Vendas", "Financeiro"]
    },
    {
      id: 3,
      date: "2024-01-13 09:15",
      type: "Manual",
      size: "44.1 MB",
      status: "Concluído",
      modules: ["Clientes", "Vendas"]
    }
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Backup e Restauração</h1>
                <p className="text-muted-foreground">Gerencie backups do sistema</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Backup Manual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Criar backup completo dos dados atuais
                  </p>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Criar Backup
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Restaurar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Restaurar dados de um backup
                  </p>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar Arquivo
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Automático
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Backup diário às 14:30
                  </p>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Ativo
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Backups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backupHistory.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Database className="h-8 w-8 text-blue-500" />
                        <div>
                          <div className="font-medium">{backup.date}</div>
                          <div className="text-sm text-muted-foreground">
                            {backup.type} • {backup.size}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Módulos: {backup.modules.join(", ")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {backup.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Backup;
