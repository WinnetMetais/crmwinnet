
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Download, 
  Upload, 
  Shield, 
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Settings,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

const Backup = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const backupHistory = [
    {
      id: 1,
      date: "2024-01-15 14:30",
      type: "Automático",
      size: "2.4 MB",
      status: "Sucesso",
      tables: ["customers", "products", "deals", "campaigns"]
    },
    {
      id: 2,
      date: "2024-01-14 14:30",
      type: "Automático",
      size: "2.3 MB",
      status: "Sucesso",
      tables: ["customers", "products", "deals", "campaigns"]
    },
    {
      id: 3,
      date: "2024-01-13 09:15",
      type: "Manual",
      size: "2.2 MB",
      status: "Sucesso",
      tables: ["customers", "products", "deals"]
    },
    {
      id: 4,
      date: "2024-01-12 14:30",
      type: "Automático",
      size: "2.1 MB",
      status: "Falha",
      tables: []
    }
  ];

  const auditLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 15:45",
      user: "Carlos Silva",
      action: "Criou cliente",
      resource: "Cliente #1234",
      ip: "192.168.1.100",
      status: "Sucesso"
    },
    {
      id: 2,
      timestamp: "2024-01-15 15:30",
      user: "Ana Oliveira",
      action: "Editou produto",
      resource: "Produto L1618",
      ip: "192.168.1.101",
      status: "Sucesso"
    },
    {
      id: 3,
      timestamp: "2024-01-15 15:15",
      user: "João Santos",
      action: "Tentativa de login",
      resource: "Sistema",
      ip: "192.168.1.102",
      status: "Falha"
    },
    {
      id: 4,
      timestamp: "2024-01-15 15:00",
      user: "Carlos Silva",
      action: "Alterou configurações",
      resource: "Margens padrão",
      ip: "192.168.1.100",
      status: "Sucesso"
    }
  ];

  const handleBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    // Simulação do processo de backup
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          toast.success("Backup realizado com sucesso!");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRestore = async (backupId: number) => {
    setIsRestoring(true);
    
    setTimeout(() => {
      setIsRestoring(false);
      toast.success("Dados restaurados com sucesso!");
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Sucesso":
        return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>;
      case "Falha":
        return <Badge className="bg-red-100 text-red-800">Falha</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes("login") || action.includes("Tentativa")) return "text-orange-600";
    if (action.includes("Criou") || action.includes("Editou")) return "text-blue-600";
    if (action.includes("Excluiu")) return "text-red-600";
    return "text-gray-600";
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
                <h1 className="text-3xl font-bold">Backup & Auditoria</h1>
                <p className="text-muted-foreground">Gerencie backups de dados e monitore atividades do sistema</p>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Último Backup</p>
                      <p className="text-2xl font-bold">Hoje</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tamanho Total</p>
                      <p className="text-2xl font-bold">12.4 MB</p>
                    </div>
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ações Hoje</p>
                      <p className="text-2xl font-bold">47</p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status Sistema</p>
                      <p className="text-2xl font-bold">Online</p>
                    </div>
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="backup" className="space-y-6">
              <TabsList>
                <TabsTrigger value="backup">Backup</TabsTrigger>
                <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
                <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="backup" className="space-y-6">
                {/* Controles de Backup */}
                <Card>
                  <CardHeader>
                    <CardTitle>Controles de Backup</CardTitle>
                    <CardDescription>
                      Realize backup manual ou configure backup automático
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <Button 
                        onClick={handleBackup}
                        disabled={isBackingUp}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {isBackingUp ? "Realizando Backup..." : "Backup Manual"}
                      </Button>
                      
                      <Button variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar Automático
                      </Button>
                      
                      <Button variant="outline" className="flex-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Backup
                      </Button>
                    </div>

                    {isBackingUp && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso do backup</span>
                          <span>{backupProgress}%</span>
                        </div>
                        <Progress value={backupProgress} className="w-full" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Histórico de Backups */}
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Backups</CardTitle>
                    <CardDescription>
                      Visualize e gerencie backups anteriores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {backupHistory.map((backup) => (
                        <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Database className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{backup.date}</h3>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>Tipo: {backup.type}</span>
                                <span>•</span>
                                <span>Tamanho: {backup.size}</span>
                                <span>•</span>
                                <span>{backup.tables.length} tabelas</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            {getStatusBadge(backup.status)}
                            {backup.status === "Sucesso" && (
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleRestore(backup.id)}
                                  disabled={isRestoring}
                                >
                                  <Upload className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="auditoria" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Log de Auditoria</CardTitle>
                    <CardDescription>
                      Monitore todas as atividades do sistema em tempo real
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <FileText className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{log.user}</h3>
                              <p className={`text-sm ${getActionColor(log.action)}`}>
                                {log.action}: {log.resource}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{log.timestamp}</span>
                                <span>•</span>
                                <span>IP: {log.ip}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {getStatusBadge(log.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="configuracoes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Backup</CardTitle>
                    <CardDescription>
                      Configure frequência e retenção de backups
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Frequência de Backup Automático</label>
                          <select className="w-full mt-1 p-2 border rounded-md">
                            <option>Diário</option>
                            <option>Semanal</option>
                            <option>Mensal</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Horário do Backup</label>
                          <input type="time" className="w-full mt-1 p-2 border rounded-md" defaultValue="14:30" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Retenção (dias)</label>
                          <input type="number" className="w-full mt-1 p-2 border rounded-md" defaultValue="30" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Compressão</label>
                          <select className="w-full mt-1 p-2 border rounded-md">
                            <option>Habilitada</option>
                            <option>Desabilitada</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Auditoria</CardTitle>
                    <CardDescription>
                      Configure quais ações devem ser registradas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Login/Logout",
                        "Criação de registros",
                        "Edição de registros",
                        "Exclusão de registros",
                        "Alterações de configuração",
                        "Acesso a relatórios",
                        "Exportação de dados",
                        "Tentativas de acesso negado"
                      ].map((action, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <label className="text-sm">{action}</label>
                        </div>
                      ))}
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

export default Backup;
