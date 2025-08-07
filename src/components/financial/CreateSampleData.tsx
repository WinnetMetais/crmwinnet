import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatabaseIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const CreateSampleData = () => {
  const [isCreating, setIsCreating] = React.useState(false);
  const queryClient = useQueryClient();

  const createSampleTransactions = async () => {
    setIsCreating(true);
    
    try {
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive",
        });
        return;
      }

      // Dados de exemplo para a Winnet Metais
      const sampleTransactions = [
        {
          type: 'receita',
          title: 'Venda de Chapas de Aço',
          amount: 15750.00,
          category: 'Vendas',
          subcategory: 'Chapas',
          channel: 'Site',
          date: '2024-08-01',
          status: 'pago',
          payment_method: 'Transferência',
          description: 'Venda de chapas de aço galvanizado para cliente corporativo',
          client_name: 'Metalúrgica XYZ Ltda',
          invoice_number: 'NF-001/2024',
          user_id: user.id
        },
        {
          type: 'receita',
          title: 'Venda de Perfis Metálicos',
          amount: 8420.50,
          category: 'Vendas',
          subcategory: 'Perfis',
          channel: 'Comercial',
          date: '2024-08-03',
          status: 'pago',
          payment_method: 'Boleto',
          description: 'Perfis em L e U para construção civil',
          client_name: 'Construtora ABC',
          invoice_number: 'NF-002/2024',
          user_id: user.id
        },
        {
          type: 'receita',
          title: 'Venda de Tubos de Aço',
          amount: 12300.75,
          category: 'Vendas',
          subcategory: 'Tubos',
          channel: 'Mercado Livre',
          date: '2024-08-05',
          status: 'pendente',
          payment_method: 'PIX',
          description: 'Tubos de aço carbono diversos diâmetros',
          client_name: 'Indústria Metalúrgica Sul',
          invoice_number: 'NF-003/2024',
          user_id: user.id
        },
        {
          type: 'despesa',
          title: 'Compra de Matéria-Prima',
          amount: 25000.00,
          category: 'Custos',
          subcategory: 'Matéria-Prima',
          channel: 'Fornecedor',
          date: '2024-08-02',
          status: 'pago',
          payment_method: 'Transferência',
          description: 'Aquisição de bobinas de aço para produção',
          client_name: 'Siderúrgica Nacional',
          invoice_number: 'NF-F001/2024',
          user_id: user.id
        },
        {
          type: 'despesa',
          title: 'Frete e Logística',
          amount: 1850.00,
          category: 'Operacional',
          subcategory: 'Transporte',
          channel: 'Transportadora',
          date: '2024-08-04',
          status: 'pago',
          payment_method: 'Cartão',
          description: 'Frete para entrega de produtos aos clientes',
          client_name: 'Transportadora Rápida',
          invoice_number: 'NF-F002/2024',
          user_id: user.id
        },
        {
          type: 'despesa',
          title: 'Energia Elétrica',
          amount: 3200.50,
          category: 'Fixas',
          subcategory: 'Utilidades',
          channel: 'Concessionária',
          date: '2024-08-06',
          status: 'pendente',
          payment_method: 'Débito Automático',
          description: 'Conta de energia da unidade fabril',
          client_name: 'Companhia Elétrica',
          invoice_number: 'CE-08/2024',
          user_id: user.id
        }
      ];

      // Inserir as transações
      const { error } = await supabase
        .from('transactions')
        .insert(sampleTransactions);

      if (error) {
        throw error;
      }

      // Invalidar queries para atualizar os dados
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });

      toast({
        title: "Sucesso",
        description: `${sampleTransactions.length} transações de exemplo criadas com sucesso!`,
      });

    } catch (error: any) {
      console.error('Erro ao criar dados de exemplo:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar dados de exemplo",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DatabaseIcon className="h-5 w-5" />
          Dados de Exemplo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Crie transações de exemplo para testar o sistema financeiro da Winnet Metais.
          Isso incluirá receitas e despesas típicas do negócio.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">O que será criado:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 3 receitas: vendas de chapas, perfis e tubos</li>
            <li>• 3 despesas: matéria-prima, frete e energia</li>
            <li>• Dados realistas para o setor metalúrgico</li>
            <li>• Diferentes canais, status e métodos de pagamento</li>
          </ul>
        </div>

        <Button 
          onClick={createSampleTransactions}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Criando Dados...
            </>
          ) : (
            <>
              <DatabaseIcon className="h-4 w-4 mr-2" />
              Criar Dados de Exemplo
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          Nota: Você pode excluir esses dados a qualquer momento na aba "Transações".
        </p>
      </CardContent>
    </Card>
  );
};