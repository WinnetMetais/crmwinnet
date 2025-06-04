
export interface QuoteItem {
  id: string;
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface QuoteFormData {
  // Cabeçalho
  quoteNumber: string;
  date: string;
  validUntil: string;
  
  // Cliente
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCnpj: string;
  
  // Informações comerciais
  contactPerson: string;
  requestedBy: string;
  
  // Itens
  items: QuoteItem[];
  
  // Valores
  subtotal: number;
  discount: number;
  total: number;
  
  // Condições
  paymentTerms: string;
  deliveryTerms: string;
  warranty: string;
  
  // Observações
  notes: string;
  internalNotes: string;
  
  // Status
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'expirado';
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  sentAt?: string;
  approvedAt?: string;
}
