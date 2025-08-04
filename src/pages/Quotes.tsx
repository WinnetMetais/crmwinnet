import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Send, Edit, Trash2, Eye } from "lucide-react";
import { useQuotes, useDeleteQuote } from "@/hooks/useQuotes";
import { QuoteForm } from "@/components/sales/QuoteForm";
import { useToast } from "@/hooks/use-toast";

const Quotes = () => {
  const [showNewQuoteForm, setShowNewQuoteForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState<any>(null);
  
  const { data: quotes = [], isLoading } = useQuotes();
  const deleteQuote = useDeleteQuote();
  const { toast } = useToast();

  const handleDeleteQuote = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este orçamento?')) {
      try {
        await deleteQuote.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao deletar orçamento:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enviado': return 'bg-blue-100 text-blue-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      case 'expirado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold">Orçamentos</h1>
                  <p className="text-muted-foreground">Gestão completa de orçamentos da Winnet Metais</p>
                </div>
              </div>

              <Dialog open={showNewQuoteForm} onOpenChange={setShowNewQuoteForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Orçamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Novo Orçamento</DialogTitle>
                  </DialogHeader>
                  <QuoteForm onClose={() => setShowNewQuoteForm(false)} />
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Lista de Orçamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Carregando orçamentos...</div>
                ) : quotes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Nenhum orçamento encontrado</p>
                    <p className="text-sm">Clique em "Novo Orçamento" para começar</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Validade</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotes.map((quote) => (
                        <TableRow key={quote.id}>
                          <TableCell className="font-medium">{quote.quote_number}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{quote.customer_name}</div>
                              <div className="text-sm text-gray-500">{quote.customer_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(quote.date).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{new Date(quote.valid_until).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(quote.total)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(quote.status)}>
                              {quote.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setEditingQuote(quote)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteQuote(quote.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Dialog para edição */}
            <Dialog open={!!editingQuote} onOpenChange={() => setEditingQuote(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Editar Orçamento</DialogTitle>
                </DialogHeader>
                {editingQuote && (
                  <QuoteForm 
                    onClose={() => setEditingQuote(null)}
                    initialData={editingQuote}
                    mode="edit"
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Quotes;