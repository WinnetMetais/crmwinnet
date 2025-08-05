import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Send, FileText } from 'lucide-react';
import { useQuotes } from '@/hooks/useQuotes';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const QuoteEmailSender = () => {
  const [selectedQuote, setSelectedQuote] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: quotes = [] } = useQuotes();
  const { toast } = useToast();

  const handleSendEmail = async () => {
    if (!selectedQuote || !recipientEmail || !subject) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          quoteId: selectedQuote,
          recipientEmail,
          subject,
          message,
        },
      });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'E-mail enviado com sucesso!',
      });

      // Reset form
      setSelectedQuote('');
      setRecipientEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao enviar e-mail',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="mr-2 h-5 w-5" />
          Envio de Orçamentos por E-mail
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quote-select">Orçamento</Label>
          <Select value={selectedQuote} onValueChange={setSelectedQuote}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um orçamento" />
            </SelectTrigger>
            <SelectContent>
              {quotes.map((quote) => (
                <SelectItem key={quote.id} value={quote.id}>
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    {quote.quote_number} - {quote.customer_name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient">E-mail do Destinatário</Label>
          <Input
            id="recipient"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="cliente@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Assunto</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Orçamento Winnet Metais"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensagem Personalizada</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite uma mensagem personalizada para acompanhar o orçamento..."
            rows={4}
          />
        </div>

        <Button 
          onClick={handleSendEmail} 
          disabled={isLoading}
          className="w-full"
        >
          <Send className="mr-2 h-4 w-4" />
          {isLoading ? 'Enviando...' : 'Enviar E-mail'}
        </Button>
      </CardContent>
    </Card>
  );
};