
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Send, 
  Shield, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Key,
  Server
} from "lucide-react";
import { toast } from "sonner";

export const EmailConfiguration = () => {
  const [smtpConfig, setSmtpConfig] = useState({
    host: "smtp.gmail.com",
    port: "587",
    username: "",
    password: "",
    encryption: "tls",
    fromName: "Winnet Metais",
    fromEmail: "",
    replyTo: ""
  });

  const [emailSettings, setEmailSettings] = useState({
    autoSendQuotes: true,
    autoSendWelcome: true,
    autoSendReminders: false,
    emailSignature: true,
    trackOpens: true,
    trackClicks: false
  });

  const [connectionStatus, setConnectionStatus] = useState<"success" | "error" | "pending" | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const emailTemplates = [
    { id: 1, name: "Orçamento Enviado", status: "Ativo", lastSent: "2024-01-15" },
    { id: 2, name: "Boas-vindas", status: "Ativo", lastSent: "2024-01-14" },
    { id: 3, name: "Follow-up", status: "Ativo", lastSent: "2024-01-13" },
    { id: 4, name: "Lembrete Pagamento", status: "Inativo", lastSent: "2024-01-10" },
  ];

  const emailStats = [
    { label: "Emails Enviados Hoje", value: "47", icon: Send },
    { label: "Taxa de Abertura", value: "68%", icon: Mail },
    { label: "Taxa de Clique", value: "12%", icon: CheckCircle },
    { label: "Emails na Fila", value: "3", icon: AlertTriangle },
  ];

  const handleSaveConfig = () => {
    toast.success("Configurações de email salvas com sucesso!");
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus("pending");
    
    // Simular teste de conexão
    setTimeout(() => {
      setConnectionStatus(Math.random() > 0.3 ? "success" : "error");
      setIsTestingConnection(false);
      
      if (connectionStatus !== "error") {
        toast.success("Conexão SMTP testada com sucesso!");
      } else {
        toast.error("Falha na conexão SMTP. Verifique as configurações.");
      }
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    return status === "Ativo" 
      ? <Badge variant="success">Ativo</Badge>
      : <Badge variant="destructive">Inativo</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {emailStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="smtp" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="smtp">Configuração SMTP</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automacao">Automação</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="smtp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Configuração do Servidor SMTP
              </CardTitle>
              <CardDescription>
                Configure o servidor de email para envio automático
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">Servidor SMTP</Label>
                  <Input
                    id="smtp-host"
                    value={smtpConfig.host}
                    onChange={(e) => setSmtpConfig({...smtpConfig, host: e.target.value})}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Porta</Label>
                  <Input
                    id="smtp-port"
                    value={smtpConfig.port}
                    onChange={(e) => setSmtpConfig({...smtpConfig, port: e.target.value})}
                    placeholder="587"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">Usuário</Label>
                  <Input
                    id="smtp-username"
                    value={smtpConfig.username}
                    onChange={(e) => setSmtpConfig({...smtpConfig, username: e.target.value})}
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Senha</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={smtpConfig.password}
                    onChange={(e) => setSmtpConfig({...smtpConfig, password: e.target.value})}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="encryption">Criptografia</Label>
                  <select 
                    id="encryption"
                    className="w-full p-2 border rounded-md"
                    value={smtpConfig.encryption}
                    onChange={(e) => setSmtpConfig({...smtpConfig, encryption: e.target.value})}
                  >
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">Nenhuma</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="from-name">Nome do Remetente</Label>
                  <Input
                    id="from-name"
                    value={smtpConfig.fromName}
                    onChange={(e) => setSmtpConfig({...smtpConfig, fromName: e.target.value})}
                    placeholder="Winnet Metais"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">Email do Remetente</Label>
                  <Input
                    id="from-email"
                    value={smtpConfig.fromEmail}
                    onChange={(e) => setSmtpConfig({...smtpConfig, fromEmail: e.target.value})}
                    placeholder="vendas@winnetmetais.com"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleSaveConfig}>
                  <Settings className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {isTestingConnection ? "Testando..." : "Testar Conexão"}
                </Button>
              </div>

              {connectionStatus && (
                <div className={`mt-4 p-3 rounded-md ${
                  connectionStatus === "success" 
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {connectionStatus === "success" ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Conexão SMTP estabelecida com sucesso!
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Falha na conexão. Verifique as configurações.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Email</CardTitle>
              <CardDescription>
                Gerencie os templates de email utilizados pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Último envio: {template.lastSent}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(template.status)}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          Testar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Automação</CardTitle>
              <CardDescription>
                Configure quando e como os emails são enviados automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-quotes">Envio Automático de Orçamentos</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar orçamentos automaticamente após criação
                    </p>
                  </div>
                  <Switch
                    id="auto-quotes"
                    checked={emailSettings.autoSendQuotes}
                    onCheckedChange={(checked) => 
                      setEmailSettings({...emailSettings, autoSendQuotes: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-welcome">Email de Boas-vindas</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar email de boas-vindas para novos clientes
                    </p>
                  </div>
                  <Switch
                    id="auto-welcome"
                    checked={emailSettings.autoSendWelcome}
                    onCheckedChange={(checked) => 
                      setEmailSettings({...emailSettings, autoSendWelcome: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-reminders">Lembretes Automáticos</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar lembretes de follow-up automaticamente
                    </p>
                  </div>
                  <Switch
                    id="auto-reminders"
                    checked={emailSettings.autoSendReminders}
                    onCheckedChange={(checked) => 
                      setEmailSettings({...emailSettings, autoSendReminders: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="track-opens">Rastreamento de Aberturas</Label>
                    <p className="text-sm text-muted-foreground">
                      Rastrear quando emails são abertos
                    </p>
                  </div>
                  <Switch
                    id="track-opens"
                    checked={emailSettings.trackOpens}
                    onCheckedChange={(checked) => 
                      setEmailSettings({...emailSettings, trackOpens: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="track-clicks">Rastreamento de Cliques</Label>
                    <p className="text-sm text-muted-foreground">
                      Rastrear cliques em links dos emails
                    </p>
                  </div>
                  <Switch
                    id="track-clicks"
                    checked={emailSettings.trackClicks}
                    onCheckedChange={(checked) => 
                      setEmailSettings({...emailSettings, trackClicks: checked})
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Email</CardTitle>
              <CardDescription>
                Visualize estatísticas detalhadas de envio de emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Estatísticas dos Últimos 30 Dias</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Emails enviados:</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de entrega:</span>
                      <span className="font-medium text-green-600">98.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de abertura:</span>
                      <span className="font-medium text-blue-600">72.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de clique:</span>
                      <span className="font-medium text-purple-600">15.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bounces:</span>
                      <span className="font-medium text-red-600">1.5%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Emails por Template</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Orçamentos:</span>
                      <span className="font-medium">456</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Follow-ups:</span>
                      <span className="font-medium">312</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Boas-vindas:</span>
                      <span className="font-medium">78</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lembretes:</span>
                      <span className="font-medium">156</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
