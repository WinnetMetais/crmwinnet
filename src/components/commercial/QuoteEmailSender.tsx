
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, FileText, Calendar, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
}

interface SentEmail {
  id: string;
  recipient: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked';
  quoteNumber: string;
}

export const QuoteEmailSender = () => {
  const [templates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Orçamento Padrão',
      subject: 'Orçamento Winnet Metais - #{QUOTE_NUMBER}',
      content: 'Prezado(a) {CUSTOMER_NAME},\n\nConforme solicitado, segue em anexo nosso orçamento.\n\nAtenciosamente,\nEquipe Winnet Metais',
      category: 'orcamento'
    },
    {
      id: '2',
      name: 'Follow-up Orçamento',
      subject: 'Acompanhamento - Orçamento #{QUOTE_NUMBER}',
      content: 'Olá {CUSTOMER_NAME},\n\nEspero que esteja bem! Gostaria de saber se teve oportunidade de analisar nosso orçamento.\n\nFico à disposição para esclarecer dúvidas.',
      category: 'followup'
    }
  ]);

  const [sentEmails] = useState<SentEmail[]>([
    {
      id: '1',
      recipient: 'joao@clienteabc.com',
      subject: 'Orçamento Winnet Metais - #2024001',
      sentAt: '2024-01-15 14:30',
      status: 'opened',
      quoteNumber: '2024001'
    },
    {
      id: '2',
      recipient: 'maria@empresa.com',
      subject: 'Orçamento Winnet Metais - #2024002',
      sentAt: '2024-01-15 16:45',
      status: 'delivered',
      quoteNumber: '2024002'
    }
  ]);

  interface EmailFormData {
    to: string;
    subject: string;
    content: string;
    selectedTemplate: string;
  }

  const [emailForm, setEmailForm] = useState<EmailFormData>({
    to: '',
    subject: '',
    content: '',
    selectedTemplate: ''
  });

  const handleTemplateSelect = (template: EmailTemplate) => {
    setEmailForm({
      ...emailForm,
      subject: template.subject,
      content: template.content,
      selectedTemplate: template.id
    });
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendEmail = () => {
    if (!emailForm.to || !emailForm.subject || !emailForm.content) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidEmail(emailForm.to)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Email enviado",
      description: "O orçamento foi enviado por email com sucesso!",
    });

    setEmailForm({
      to: '',
      subject: '',
      content: '',
      selectedTemplate: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'opened': return 'bg-purple-100 text-purple-800';
      case 'clicked': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emails Enviados</p>
                <p className="text-3xl font-bold">156</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa Abertura</p>
                <p className="text-3xl font-bold">78%</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orçamentos Hoje</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes Únicos</p>
                <p className="text-3xl font-bold">89</p>
              </div>
              <User className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enviar Orçamento por Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="to">Para</Label>
              <Input
                id="to"
                type="email"
                placeholder="email@cliente.com"
                value={emailForm.to}
                onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                placeholder="Assunto do email"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="content">Mensagem</Label>
              <Textarea
                id="content"
                placeholder="Conteúdo do email..."
                value={emailForm.content}
                onChange={(e) => setEmailForm({...emailForm, content: e.target.value})}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label>Templates</Label>
              <div className="grid grid-cols-1 gap-2">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={handleSendEmail} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Enviar Email
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emails Enviados Recentemente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {sentEmails.map((email) => (
                <div key={email.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{email.subject}</h4>
                      <p className="text-sm text-muted-foreground">{email.recipient}</p>
                    </div>
                    <Badge className={getStatusColor(email.status)}>
                      {email.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Orçamento: {email.quoteNumber}</span>
                    <span>{email.sentAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
