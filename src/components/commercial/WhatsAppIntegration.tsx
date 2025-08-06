import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Users, FileText, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface WhatsAppMessage {
  id: string;
  contact: string;
  contact_name?: string;
  message: string;
  timestamp: string;
  message_type: string;
  direction: string;
  status: string;
  customer_id?: string;
  phone_number?: string;
  whatsapp_message_id?: string;
  is_read?: boolean;
  received_at?: string;
  created_at: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  type: string;
}

export const WhatsAppIntegration = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Templates padrão
  const defaultTemplates: MessageTemplate[] = [
    {
      id: 'quote_follow_up',
      name: 'Follow-up de Cotação',
      content: 'Olá {name}! Espero que esteja bem. Gostaria de saber se teve a oportunidade de analisar nossa cotação enviada. Estou à disposição para esclarecer qualquer dúvida. Att, Winnet Metais',
      type: 'follow_up'
    },
    {
      id: 'new_quote',
      name: 'Nova Cotação',
      content: 'Olá {name}! Conforme solicitado, segue em anexo nossa cotação para os produtos de sua necessidade. Estamos à disposição para negociar as melhores condições. Att, Winnet Metais',
      type: 'quote'
    },
    {
      id: 'thank_you',
      name: 'Agradecimento',
      content: 'Olá {name}! Muito obrigado pela confiança em nossos serviços. Sua satisfação é nossa prioridade. Conte sempre conosco! Att, Winnet Metais',
      type: 'custom'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadMessages(),
      loadCustomers()
    ]);
    setTemplates(defaultTemplates);
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      const formattedMessages = data?.map((msg: any) => ({
        id: msg.id,
        contact: msg.contact_name || 'Contato não identificado',
        message: msg.message,
        timestamp: new Date(msg.received_at || msg.created_at).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        message_type: msg.message_type || 'text',
        direction: msg.direction || 'received',
        status: msg.status,
        customer_id: msg.customer_id,
        phone_number: msg.phone_number,
        whatsapp_message_id: msg.whatsapp_message_id,
        is_read: msg.is_read,
        received_at: msg.received_at,
        created_at: msg.created_at
      })) || [];
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, phone, email')
        .not('phone', 'is', null)
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedCustomer || (!selectedTemplate && !customMessage.trim())) {
      toast({
        title: "Erro",
        description: "Selecione um cliente e uma mensagem para enviar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const customer = customers.find(c => c.id === selectedCustomer);
      if (!customer) throw new Error('Cliente não encontrado');

      let messageContent = customMessage;
      if (selectedTemplate && !customMessage.trim()) {
        const template = templates.find(t => t.id === selectedTemplate);
        messageContent = template?.content.replace('{name}', customer.name) || '';
      }

      // Salvar mensagem no banco
      const { data: { user } } = await supabase.auth.getUser();
      const { error: dbError } = await supabase
        .from('whatsapp_messages')
        .insert({
          user_id: user?.id || '',
          customer_id: selectedCustomer,
          contact_name: customer.name,
          message: messageContent,
          message_type: 'text',
          direction: 'sent',
          status: 'pending'
        });

      if (dbError) throw dbError;

      // Aqui você integraria com a API do WhatsApp Business
      // Por enquanto, vamos simular o envio
      await simulateWhatsAppSend(customer.phone, messageContent);

      toast({
        title: "Mensagem Enviada",
        description: `Mensagem enviada para ${customer.name} com sucesso!`,
      });

      // Limpar formulário
      setSelectedCustomer('');
      setSelectedTemplate('');
      setCustomMessage('');
      
      // Recarregar mensagens
      await loadMessages();

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateWhatsAppSend = async (phone: string, message: string) => {
    // Simulação de envio - em produção você usaria a API do WhatsApp Business
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      sent: "secondary", 
      delivered: "default",
      read: "default",
      failed: "destructive"
    };

    const labels: Record<string, string> = {
      pending: "Pendente",
      sent: "Enviada",
      delivered: "Entregue", 
      read: "Lida",
      failed: "Falhou"
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-green-600" />
        <div>
          <h2 className="text-2xl font-bold">Integração WhatsApp</h2>
          <p className="text-muted-foreground">Envie cotações e mensagens para seus clientes via WhatsApp</p>
        </div>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">Enviar Mensagem</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Nova Mensagem
              </CardTitle>
              <CardDescription>
                Envie mensagens personalizadas ou use templates pré-definidos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Cliente</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex flex-col">
                            <span>{customer.name}</span>
                            <span className="text-sm text-muted-foreground">{customer.phone}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template (Opcional)</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem Personalizada</Label>
                <Textarea
                  id="message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Digite sua mensagem personalizada ou use um template acima"
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  Use {"{name}"} para inserir automaticamente o nome do cliente
                </p>
              </div>

              <Button 
                onClick={sendMessage} 
                disabled={loading}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Histórico de Mensagens
              </CardTitle>
              <CardDescription>
                Últimas {messages.length} mensagens enviadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma mensagem enviada ainda
                  </p>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{message.contact_name}</span>
                          {getStatusBadge(message.status)}
                          <Badge variant="outline">{message.message_type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {message.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Templates de Mensagem
              </CardTitle>
              <CardDescription>
                Templates pré-definidos para agilizar o envio de mensagens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {template.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};