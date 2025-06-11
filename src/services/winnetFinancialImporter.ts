
import { supabase } from "@/integrations/supabase/client";
import { transactionService } from "./transactions";
import { logIntegrationAction } from "./integrationLogs";

export interface WinnetFinancialData {
  data: string;
  descricao: string;
  categoria: string;
  subcategoria?: string;
  canal: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  status: 'pago' | 'pendente' | 'vencido';
  metodo: string;
  cliente?: string;
  observacoes?: string;
}

export class WinnetFinancialImporter {
  /**
   * Importa dados financeiros da Winnet Metais baseados na planilha
   */
  async importWinnetData(): Promise<{ success: number; errors: number; total: number }> {
    try {
      await logIntegrationAction('winnet_financial', 'import_start', 'pending');
      
      // Dados baseados na planilha da Winnet Metais
      const winnetData: WinnetFinancialData[] = [
        // Receitas - Site
        { data: '2024-01-02', descricao: 'Venda de Perfis de Alumínio', categoria: 'Receita', subcategoria: 'Vendas Online', canal: 'site', tipo: 'receita', valor: 15420.00, status: 'pago', metodo: 'PIX', cliente: 'Construtora ABC' },
        { data: '2024-01-05', descricao: 'Venda de Esquadrias', categoria: 'Receita', subcategoria: 'Vendas Online', canal: 'site', tipo: 'receita', valor: 8750.50, status: 'pago', metodo: 'Cartão', cliente: 'Empresa XYZ' },
        { data: '2024-01-08', descricao: 'Venda de Tubos de Aço', categoria: 'Receita', subcategoria: 'Vendas Online', canal: 'site', tipo: 'receita', valor: 12300.00, status: 'pago', metodo: 'Transferência', cliente: 'Metalúrgica Ltda' },
        { data: '2024-01-12', descricao: 'Venda de Chapas Galvanizadas', categoria: 'Receita', subcategoria: 'Vendas Online', canal: 'site', tipo: 'receita', valor: 22150.75, status: 'pago', metodo: 'Boleto', cliente: 'Indústria Silva' },
        { data: '2024-01-15', descricao: 'Venda de Perfis Estruturais', categoria: 'Receita', subcategoria: 'Vendas Online', canal: 'site', tipo: 'receita', valor: 18900.25, status: 'pago', metodo: 'PIX', cliente: 'Construtora Beta' },
        { data: '2024-01-18', descricao: 'Venda de Acessórios Metálicos', categoria: 'Receita', subcategoria: 'Vendas Online', canal: 'site', tipo: 'receita', valor: 9082.00, status: 'pago', metodo: 'Cartão', cliente: 'Ferragens Central' },

        // Receitas - Mercado Livre
        { data: '2024-01-03', descricao: 'Venda ML - Perfis Alumínio Residencial', categoria: 'Receita', subcategoria: 'Marketplace', canal: 'mercadoLivre', tipo: 'receita', valor: 4250.00, status: 'pago', metodo: 'Mercado Pago', cliente: 'João Santos' },
        { data: '2024-01-07', descricao: 'Venda ML - Kit Esquadrias', categoria: 'Receita', subcategoria: 'Marketplace', canal: 'mercadoLivre', tipo: 'receita', valor: 6789.50, status: 'pago', metodo: 'Mercado Pago', cliente: 'Maria Silva' },
        { data: '2024-01-10', descricao: 'Venda ML - Tubos Inox', categoria: 'Receita', subcategoria: 'Marketplace', canal: 'mercadoLivre', tipo: 'receita', valor: 8920.00, status: 'pago', metodo: 'Mercado Pago', cliente: 'Pedro Costa' },
        { data: '2024-01-14', descricao: 'Venda ML - Chapas Decorativas', categoria: 'Receita', subcategoria: 'Marketplace', canal: 'mercadoLivre', tipo: 'receita', valor: 12450.25, status: 'pago', metodo: 'Mercado Pago', cliente: 'Ana Oliveira' },
        { data: '2024-01-17', descricao: 'Venda ML - Perfis para Móveis', categoria: 'Receita', subcategoria: 'Marketplace', canal: 'mercadoLivre', tipo: 'receita', valor: 15320.00, status: 'pago', metodo: 'Mercado Pago', cliente: 'Carlos Mendes' },
        { data: '2024-01-20', descricao: 'Venda ML - Acessórios Diversos', categoria: 'Receita', subcategoria: 'Marketplace', canal: 'mercadoLivre', tipo: 'receita', valor: 7009.25, status: 'pago', metodo: 'Mercado Pago', cliente: 'Lúcia Fernandes' },
        { data: '2024-01-22', descricao: 'Venda ML - Perfis Estruturais', categoria: 'Receita', subcategoria: 'Marketplace', canal: 'mercadoLivre', tipo: 'receita', valor: 9990.00, status: 'pago', metodo: 'Mercado Pago', cliente: 'Roberto Lima' },

        // Receitas - Madeira Madeira
        { data: '2024-01-09', descricao: 'Venda MM - Perfis Decorativos', categoria: 'Receita', subcategoria: 'Marketplace B2B', canal: 'madeiraMadeira', tipo: 'receita', valor: 3250.67, status: 'pago', metodo: 'Transferência', cliente: 'Madeira Madeira' },
        { data: '2024-01-16', descricao: 'Venda MM - Kit Acabamentos', categoria: 'Receita', subcategoria: 'Marketplace B2B', canal: 'madeiraMadeira', tipo: 'receita', valor: 4721.00, status: 'pago', metodo: 'Transferência', cliente: 'Madeira Madeira' },

        // Receitas - Via
        { data: '2024-01-11', descricao: 'Venda Via - Acessórios Metálicos', categoria: 'Receita', subcategoria: 'Marketplace', canal: 'via', tipo: 'receita', valor: 1245.42, status: 'pago', metodo: 'Via Pagamentos', cliente: 'Via Varejo' },
        { data: '2024-01-19', descricao: 'Venda Via - Perfis Residenciais', categoria: 'Receita', subcategoria: 'Marketplace', canal: 'via', tipo: 'receita', valor: 1250.00, status: 'pago', metodo: 'Via Pagamentos', cliente: 'Via Varejo' },

        // Receitas - Comercial (B2B)
        { data: '2024-01-04', descricao: 'Projeto Construtora Gamma', categoria: 'Receita', subcategoria: 'Vendas B2B', canal: 'comercial', tipo: 'receita', valor: 8500.00, status: 'pago', metodo: 'Transferência', cliente: 'Construtora Gamma' },
        { data: '2024-01-13', descricao: 'Fornecimento Indústria Delta', categoria: 'Receita', subcategoria: 'Vendas B2B', canal: 'comercial', tipo: 'receita', valor: 13593.86, status: 'pago', metodo: 'Boleto', cliente: 'Indústria Delta' },

        // Despesas Operacionais
        { data: '2024-01-02', descricao: 'Compra de Matéria Prima - Alumínio', categoria: 'Despesa Operacional', subcategoria: 'Fornecedores', canal: 'comercial', tipo: 'despesa', valor: 18500.00, status: 'pago', metodo: 'Transferência', cliente: 'Fornecedor Alumínio Brasil' },
        { data: '2024-01-05', descricao: 'Frete e Logística - Janeiro', categoria: 'Despesa Operacional', subcategoria: 'Logística', canal: 'comercial', tipo: 'despesa', valor: 3250.00, status: 'pago', metodo: 'PIX', cliente: 'Transportadora Express' },
        { data: '2024-01-08', descricao: 'Comissões de Vendas - ML', categoria: 'Despesa Operacional', subcategoria: 'Comissões', canal: 'mercadoLivre', tipo: 'despesa', valor: 4500.30, status: 'pago', metodo: 'Débito Automático', cliente: 'Mercado Livre' },
        { data: '2024-01-10', descricao: 'Taxa de Processamento - Site', categoria: 'Despesa Operacional', subcategoria: 'Taxas', canal: 'site', tipo: 'despesa', valor: 850.75, status: 'pago', metodo: 'Cartão', cliente: 'Gateway Pagamentos' },
        { data: '2024-01-12', descricao: 'Compra Aço Inox', categoria: 'Despesa Operacional', subcategoria: 'Fornecedores', canal: 'comercial', tipo: 'despesa', valor: 12750.00, status: 'pago', metodo: 'Boleto', cliente: 'Aços Especiais Ltda' },
        { data: '2024-01-15', descricao: 'Manutenção Equipamentos', categoria: 'Despesa Operacional', subcategoria: 'Manutenção', canal: 'comercial', tipo: 'despesa', valor: 2800.00, status: 'pago', metodo: 'PIX', cliente: 'TecMetal Manutenção' },

        // Despesas Fixas
        { data: '2024-01-05', descricao: 'Aluguel Galpão Industrial', categoria: 'Despesa Fixa', subcategoria: 'Infraestrutura', canal: 'comercial', tipo: 'despesa', valor: 8500.00, status: 'pago', metodo: 'Transferência', cliente: 'Imobiliária Central' },
        { data: '2024-01-10', descricao: 'Energia Elétrica - Janeiro', categoria: 'Despesa Fixa', subcategoria: 'Utilidades', canal: 'comercial', tipo: 'despesa', valor: 4200.80, status: 'pago', metodo: 'Débito Automático', cliente: 'Companhia Elétrica' },
        { data: '2024-01-15', descricao: 'Internet e Telefonia', categoria: 'Despesa Fixa', subcategoria: 'Telecomunicações', canal: 'comercial', tipo: 'despesa', valor: 450.00, status: 'pago', metodo: 'Débito Automático', cliente: 'Operadora Telecom' },
        { data: '2024-01-20', descricao: 'Seguro Empresarial', categoria: 'Despesa Fixa', subcategoria: 'Seguros', canal: 'comercial', tipo: 'despesa', valor: 1200.00, status: 'pago', metodo: 'Boleto', cliente: 'Seguradora Alpha' },

        // Despesas Administrativas
        { data: '2024-01-05', descricao: 'Salários - Janeiro', categoria: 'Despesa Administrativa', subcategoria: 'Folha de Pagamento', canal: 'comercial', tipo: 'despesa', valor: 25000.00, status: 'pago', metodo: 'Transferência' },
        { data: '2024-01-10', descricao: 'Contador e Consultoria', categoria: 'Despesa Administrativa', subcategoria: 'Serviços Terceirizados', canal: 'comercial', tipo: 'despesa', valor: 2500.00, status: 'pago', metodo: 'PIX', cliente: 'Escritório Contábil Beta' },
        { data: '2024-01-15', descricao: 'Material de Escritório', categoria: 'Despesa Administrativa', subcategoria: 'Material de Consumo', canal: 'comercial', tipo: 'despesa', valor: 380.50, status: 'pago', metodo: 'Cartão', cliente: 'Papelaria Gamma' },

        // Investimentos
        { data: '2024-01-08', descricao: 'Equipamento de Corte CNC', categoria: 'Investimento', subcategoria: 'Maquinário', canal: 'comercial', tipo: 'despesa', valor: 45000.00, status: 'pago', metodo: 'Financiamento', cliente: 'Máquinas Industriais S.A.' },
        { data: '2024-01-18', descricao: 'Software de Gestão', categoria: 'Investimento', subcategoria: 'Tecnologia', canal: 'comercial', tipo: 'despesa', valor: 1200.00, status: 'pago', metodo: 'Cartão', cliente: 'Software House Tech' }
      ];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const results = await this.syncWinnetTransactions(winnetData, user.id);
      
      await logIntegrationAction('winnet_financial', 'import_complete', 'success', {
        imported: results.success,
        errors: results.errors,
        total: results.total
      });

      return results;
    } catch (error) {
      await logIntegrationAction('winnet_financial', 'import_error', 'error', null, String(error));
      throw error;
    }
  }

  /**
   * Sincroniza transações da Winnet com o banco de dados
   */
  private async syncWinnetTransactions(data: WinnetFinancialData[], userId: string) {
    let successCount = 0;
    let errorCount = 0;
    const total = data.length;

    for (const item of data) {
      try {
        const transactionData = {
          type: item.tipo,
          title: item.descricao,
          amount: item.valor,
          category: item.categoria,
          subcategory: item.subcategoria || '',
          channel: item.canal,
          date: item.data,
          status: item.status,
          payment_method: item.metodo,
          description: `${item.descricao}${item.observacoes ? ` - ${item.observacoes}` : ''}`,
          client_name: item.cliente || '',
          user_id: userId
        };

        // Verificar se já existe uma transação similar
        const isDuplicate = await this.checkDuplicate(transactionData);
        
        if (!isDuplicate) {
          await transactionService.createTransaction(transactionData);
          successCount++;
        } else {
          console.log('Transação duplicada ignorada:', item.descricao);
        }
      } catch (error) {
        console.error('Erro ao sincronizar transação:', error);
        errorCount++;
      }
    }

    return { success: successCount, errors: errorCount, total };
  }

  /**
   * Verifica se já existe uma transação similar
   */
  private async checkDuplicate(transactionData: any): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('transactions')
        .select('id')
        .eq('title', transactionData.title)
        .eq('amount', transactionData.amount)
        .eq('date', transactionData.date)
        .limit(1);

      return data && data.length > 0;
    } catch (error) {
      console.error('Erro ao verificar duplicata:', error);
      return false;
    }
  }

  /**
   * Gera relatório de resumo dos dados importados
   */
  async generateImportSummary() {
    try {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const summary = {
        total_transactions: transactions?.length || 0,
        total_receitas: transactions?.filter(t => t.type === 'receita').reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        total_despesas: transactions?.filter(t => t.type === 'despesa').reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        channels: {
          site: transactions?.filter(t => t.channel === 'site').length || 0,
          mercadoLivre: transactions?.filter(t => t.channel === 'mercadoLivre').length || 0,
          madeiraMadeira: transactions?.filter(t => t.channel === 'madeiraMadeira').length || 0,
          via: transactions?.filter(t => t.channel === 'via').length || 0,
          comercial: transactions?.filter(t => t.channel === 'comercial').length || 0
        }
      };

      return summary;
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      return null;
    }
  }
}

export const winnetFinancialImporter = new WinnetFinancialImporter();
