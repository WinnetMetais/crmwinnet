import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, Database, Users, Package, FileText, DollarSign, AlertCircle } from "lucide-react";
import { testDataService } from "@/services/testData";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const CommercialTestData = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCreateData = async () => {
    setIsCreating(true);
    setError(null);
    setResult(null);

    try {
      const data = await testDataService.createCompleteTestData();
      setResult(data);
      
      // Invalidar todas as queries relevantes
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast({
        title: "Dados de Teste Criados!",
        description: "Cliente, oportunidade, orçamento e deal foram criados com sucesso.",
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao criar dados de teste');
      toast({
        title: "Erro",
        description: err.message || 'Erro ao criar dados de teste',
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Dados de Teste - Fluxo Comercial
        </CardTitle>
        <CardDescription>
          Cria um fluxo completo de vendas para validar o sistema: cliente → oportunidade → orçamento → deal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result && !error && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Cliente</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <Package className="h-4 w-4 text-green-500" />
              <span>Produto</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              <span>Oportunidade</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <FileText className="h-4 w-4 text-purple-500" />
              <span>Orçamento</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <DollarSign className="h-4 w-4 text-orange-500" />
              <span>Deal</span>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="font-medium">Dados criados com sucesso!</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-medium text-blue-700">Cliente</div>
                <div className="text-blue-600">{result.customer?.name}</div>
                <Badge variant="outline" className="mt-1">{result.customer?.company}</Badge>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="font-medium text-green-700">Produto</div>
                <div className="text-green-600">{result.product?.name}</div>
                <Badge variant="outline" className="mt-1">R$ {result.product?.sale_price?.toFixed(2)}</Badge>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="font-medium text-yellow-700">Oportunidade</div>
                <div className="text-yellow-600 truncate">{result.opportunity?.title}</div>
                <Badge variant="outline" className="mt-1">R$ {result.opportunity?.value?.toFixed(2)}</Badge>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="font-medium text-purple-700">Orçamento</div>
                <div className="text-purple-600">{result.quote?.quote_number}</div>
                <Badge variant="outline" className="mt-1">R$ {result.quote?.total?.toFixed(2)}</Badge>
              </div>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="font-medium text-orange-700">Deal (Negociação)</div>
              <div className="text-orange-600">{result.deal?.title}</div>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">R$ {result.deal?.value?.toFixed(2)}</Badge>
                <Badge variant="secondary">{result.deal?.stage}</Badge>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <Button 
          onClick={handleCreateData} 
          disabled={isCreating}
          className="w-full"
          variant={result ? "outline" : "default"}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando dados...
            </>
          ) : result ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Criar Novos Dados de Teste
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Criar Dados de Teste Comercial
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Os dados serão vinculados ao usuário logado. Acesse o Kanban de Vendas para visualizar o deal criado.
        </p>
      </CardContent>
    </Card>
  );
};
