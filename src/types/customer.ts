
export interface CustomerFormData {
  // Dados principais
  name: string;
  email: string;
  phone: string;
  cnpj: string;
  company: string;
  
  // Endereço
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Classificação comercial
  customerType: 'pessoa_fisica' | 'pessoa_juridica';
  segment: 'metalurgia' | 'construcao' | 'industria' | 'varejo' | 'outros';
  priority: 'alta' | 'media' | 'baixa';
  
  // Informações comerciais
  leadSource: string;
  website: string;
  socialReason: string;
  
  // Status e acompanhamento
  status: 'prospecto' | 'qualificado' | 'negociacao' | 'cliente' | 'inativo';
  notes: string;
  
  // Dados de contato adicional
  contactPerson: string;
  contactRole: string;
  whatsapp: string;
  
  // Dados comerciais
  creditLimit: number;
  paymentTerms: string;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  lastContactDate?: string;
}

export interface CustomerInteraction {
  id: string;
  customerId: string;
  type: 'call' | 'email' | 'meeting' | 'whatsapp' | 'visit';
  description: string;
  date: string;
  nextAction: string;
  nextActionDate: string;
  responsible: string;
}
