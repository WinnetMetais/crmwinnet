
// Tipos centralizados para todo o sistema CRM
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  website?: string;
  contact_person?: string;
  contact_role?: string;
  whatsapp?: string;
  notes?: string;
  status: 'prospecto' | 'qualificado' | 'negociacao' | 'cliente' | 'inativo';
  lead_source?: string;
  priority?: 'alta' | 'media' | 'baixa';
  segment_id?: string;
  created_at: string;
  updated_at: string;
  last_contact_date?: string;
  created_by?: string;
  // Campos de qualidade de dados
  data_quality_score?: number;
  last_validated_at?: string;
  validation_errors?: string[];
  data_completeness_percentage?: number;
}

export interface ValidationResult extends Customer {
  severity: 'low' | 'medium' | 'high';
}

export interface CRMFilters {
  dateFilter: DateFilterType;
  dateRange: { from: Date; to: Date } | null;
  searchTerm: string;
  status?: string[];
  priority?: string[];
  segment?: string[];
}

export interface QualityMetrics {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  averageScore: number;
  completenessPercentage: number;
}

export interface DataValidationLog {
  id: string;
  module_name: string;
  table_name: string;
  record_id?: string;
  validation_type: string;
  validation_status: 'passed' | 'failed' | 'warning';
  errors: string[];
  suggestions: string[];
  validated_by?: string;
  validated_at: string;
  created_at: string;
}

export type DateFilterType = 'hoje' | '7_dias' | '30_dias' | '90_dias' | 'esta_semana' | 'este_mes' | 'este_ano' | 'customizado';
