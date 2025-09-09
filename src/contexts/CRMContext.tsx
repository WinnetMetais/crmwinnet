import React, { createContext, useContext, useState, useEffect } from 'react';
import { unifiedCRMService, UnifiedCustomer, SalesAnalytics } from '@/services/unifiedCRM';
import { useToast } from '@/hooks/use-toast';

// Enhanced types for the CRM bundle
export interface Cliente extends UnifiedCustomer {
  fase: 'lead' | 'contato' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
  canal: 'Google' | 'Facebook/Instagram' | 'Indicação' | 'Orgânico' | 'Frio';
  vendedorId?: string;
  observacoes?: string;
}

export interface ItemOrcamento {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  total: number;
}

export interface Orcamento {
  id: string;
  clienteId: string;
  titulo: string;
  descricao: string;
  subtotal: number;
  desconto: number;
  valor: number;
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado';
  criadoEm: Date;
  validadeAte: Date;
  solicitadoPor: string;
  formaPagamento: string;
  prazoEntrega: string;
  garantia: string;
  observacoes: string;
  itens: ItemOrcamento[];
}

export interface Venda {
  id: string;
  orcamentoId: string;
  clienteId: string;
  valor: number;
  status: 'pendente' | 'pago' | 'cancelado';
  dataVenda: Date;
  formaPagamento?: string;
}

export interface CRMContextType {
  // Data
  clientes: Cliente[];
  orcamentos: Orcamento[];
  vendas: Venda[];
  analytics: SalesAnalytics | null;
  searchTerm: string;
  
  // Loading states
  loading: boolean;
  analyticsLoading: boolean;
  
  // Actions
  adicionarCliente: (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  adicionarOrcamento: (orcamento: Omit<Orcamento, 'id' | 'criadoEm'>) => Promise<void>;
  aprovarOrcamento: (orcamentoId: string) => Promise<void>;
  criarVenda: (orcamentoId: string, formaPagamento: string) => Promise<void>;
  atualizarStatusVenda: (vendaId: string, status: Venda['status']) => Promise<void>;
  atualizarFaseCliente: (clienteId: string, novaFase: Cliente['fase']) => Promise<void>;
  buscarClientes: (termo: string) => Cliente[];
  buscarOrcamentos: (termo: string) => Orcamento[];
  setSearchTerm: (termo: string) => void;
  refreshData: () => Promise<void>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    setAnalyticsLoading(true);
    try {
      const [customersData, analyticsData] = await Promise.all([
        unifiedCRMService.getCustomersWithCounts(),
        unifiedCRMService.getSalesAnalytics()
      ]);

      // Transform customers to clientes format
      const clientesData = customersData.map(customer => {
        // Extract the relationship data properly
        const { opportunities, deals, quotes, ...customerData } = customer;
        
        return {
          ...customerData,
          fase: mapStatusToFase(customer.status),
          canal: mapSourceToCanal(customer.lead_source),
          observacoes: customer.notes,
          // Initialize empty arrays for relationships - these will be loaded separately if needed
          opportunities: [],
          deals: [],
          quotes: [],
          transactions: []
        } as Cliente;
      });

      setClientes(clientesData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading CRM data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do CRM",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setAnalyticsLoading(false);
    }
  };

  const adicionarCliente = async (clienteData: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await unifiedCRMService.createCustomer({
        ...clienteData,
        status: mapFaseToStatus(clienteData.fase),
        lead_source: mapCanalToSource(clienteData.canal),
        notes: clienteData.observacoes
      });
      
      toast({
        title: "Cliente adicionado",
        description: `${clienteData.name} foi adicionado com sucesso`,
      });
      
      await refreshData();
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        title: "Erro ao adicionar cliente",
        description: "Não foi possível adicionar o cliente",
        variant: "destructive",
      });
    }
  };

  const adicionarOrcamento = async (orcamentoData: Omit<Orcamento, 'id' | 'criadoEm'>) => {
    // This would integrate with the quotes system
    console.log('Adding orcamento:', orcamentoData);
    toast({
      title: "Orçamento criado",
      description: `Orçamento ${orcamentoData.titulo} foi criado`,
    });
  };

  const aprovarOrcamento = async (orcamentoId: string) => {
    // This would update quote status
    console.log('Approving orcamento:', orcamentoId);
    toast({
      title: "Orçamento aprovado",
      description: "Orçamento foi aprovado com sucesso",
    });
  };

  const criarVenda = async (orcamentoId: string, formaPagamento: string) => {
    // This would create a deal from quote
    console.log('Creating venda:', { orcamentoId, formaPagamento });
    toast({
      title: "Venda criada",
      description: "Venda foi registrada com sucesso",
    });
  };

  const atualizarStatusVenda = async (vendaId: string, status: Venda['status']) => {
    // This would update deal status
    console.log('Updating venda status:', { vendaId, status });
    toast({
      title: "Status atualizado",
      description: `Status da venda atualizado para ${status}`,
    });
  };

  const atualizarFaseCliente = async (clienteId: string, novaFase: Cliente['fase']) => {
    try {
      const cliente = clientes.find(c => c.id === clienteId);
      if (!cliente) return;

      // Update local state immediately
      setClientes(prev => prev.map(c => 
        c.id === clienteId ? { ...c, fase: novaFase } : c
      ));

      // This would call the backend to update customer status
      console.log('Updating cliente fase:', { clienteId, novaFase });
      
      toast({
        title: "Fase atualizada",
        description: `Cliente movido para ${novaFase}`,
      });
    } catch (error) {
      console.error('Error updating cliente fase:', error);
    }
  };

  const buscarClientes = (termo: string) => {
    if (!termo) return clientes;
    return clientes.filter(cliente => 
      cliente.name.toLowerCase().includes(termo.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(termo.toLowerCase()) ||
      cliente.company?.toLowerCase().includes(termo.toLowerCase())
    );
  };

  const buscarOrcamentos = (termo: string) => {
    if (!termo) return orcamentos;
    return orcamentos.filter(orcamento => 
      orcamento.titulo.toLowerCase().includes(termo.toLowerCase()) ||
      orcamento.descricao.toLowerCase().includes(termo.toLowerCase())
    );
  };

  return (
    <CRMContext.Provider value={{
      clientes,
      orcamentos,
      vendas,
      analytics,
      searchTerm,
      loading,
      analyticsLoading,
      adicionarCliente,
      adicionarOrcamento,
      aprovarOrcamento,
      criarVenda,
      atualizarStatusVenda,
      atualizarFaseCliente,
      buscarClientes,
      buscarOrcamentos,
      setSearchTerm,
      refreshData,
    }}>
      {children}
    </CRMContext.Provider>
  );
};

// Helper functions to map between different naming conventions
function mapStatusToFase(status: string): Cliente['fase'] {
  switch (status) {
    case 'prospecto': return 'lead';
    case 'qualificado': return 'contato';
    case 'negociacao': return 'negociacao';
    case 'cliente': return 'fechado';
    default: return 'lead';
  }
}

function mapFaseToStatus(fase: Cliente['fase']): string {
  switch (fase) {
    case 'lead': return 'prospecto';
    case 'contato': return 'qualificado';
    case 'negociacao': return 'negociacao';
    case 'fechado': return 'cliente';
    case 'perdido': return 'inativo';
    default: return 'prospecto';
  }
}

function mapSourceToCanal(source?: string): Cliente['canal'] {
  switch (source) {
    case 'google': return 'Google';
    case 'facebook': return 'Facebook/Instagram';
    case 'referral': return 'Indicação';
    case 'organic': return 'Orgânico';
    default: return 'Frio';
  }
}

function mapCanalToSource(canal: Cliente['canal']): string {
  switch (canal) {
    case 'Google': return 'google';
    case 'Facebook/Instagram': return 'facebook';
    case 'Indicação': return 'referral';
    case 'Orgânico': return 'organic';
    default: return 'cold';
  }
}