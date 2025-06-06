
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, Send, Users, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WhatsAppMessage {
  id: string;
  contact: string;
  message: string;
  timestamp: string;
  type: 'sent' | 'received';
  status: 'delivered' | 'read' | 'pending';
}

export const WhatsAppIntegration = () => {
  const [messages] = useState<WhatsAppMessage[]>([
    {
      id: '1',
      contact: 'João Silva - Cliente ABC',
      message: 'Boa tarde! Gostaria de saber sobre as lixeiras industriais.',
      timestamp: '14:30',
      type: 'received',
      status: 'read'
    },
    {
      id: '2',
      contact: 'João Silva - Cliente ABC',
      message: 'Olá João! Temos várias opções disponíveis. Envio o catálogo agora.',
      timestamp: '14:35',
      type: 'sent',
      status: 'delivered'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um contato e digite uma mensagem.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada via WhatsApp!",
    });
    setNewMessage('');
  };

  const templates = [
    {
      name: "Saudação inicial",
      content: "Olá! Obrigado por entrar em contato com a Winnet Metais. Como posso ajudá-lo?"
    },
    {
      name: "Envio de orçamento",
      content: "Conforme conversamos, segue em anexo o orçamento solicitado. Qualquer dúvida estou à disposição!"
    },
    {
      name: "Follow-up",
      content: "Olá! Verificou nossa proposta? Fico no aguardo do seu retorno."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mensagens Hoje</p>
                <p className="text-3xl font-bold">47</p>
              </div>
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contatos Ativos</p>
                <p className="text-3xl font-bold">23</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tempo Resposta</p>
                <p className="text-3xl font-bold">2.5min</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'sent' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm font-medium mb-1">{message.contact}</p>
                    <p className="text-sm">{message.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">{message.timestamp}</span>
                      <Badge variant={message.status === 'read' ? 'default' : 'secondary'}>
                        {message.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enviar Mensagem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact">Contato</Label>
              <Input
                id="contact"
                placeholder="Selecione ou digite o contato"
                value={selectedContact}
                onChange={(e) => setSelectedContact(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleSendMessage} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Enviar via WhatsApp
            </Button>

            <div className="space-y-2">
              <Label>Templates Rápidos</Label>
              {templates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start"
                  onClick={() => setNewMessage(template.content)}
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
