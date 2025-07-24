
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
  zip_code: string;
  
  // Informações comerciais
  lead_source: string;
  website: string;
  social_reason: string;
  
  // Status e acompanhamento
  status: 'active' | 'inactive' | 'prospect' | 'qualified' | 'customer';
  notes: string;
  
  // Dados de contato adicional
  contact_person: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  last_contact_date?: string;
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
