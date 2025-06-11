
import { supabase } from "@/integrations/supabase/client";
import { ValidationResult, CRMFilters } from "@/types/crm";

export class CRMCustomersService {
  // Carregar clientes com filtros aplicados
  static async getCustomersWithFilters(filters: CRMFilters): Promise<ValidationResult[]> {
    try {
      // Query base simples
      let query = supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtro de data de forma simples
      if (filters.dateRange) {
        const { from, to } = filters.dateRange;
        query = query
          .gte('created_at', from.toISOString())
          .lte('created_at', to.toISOString());
      }

      // Aplicar filtros de status
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      // Aplicar filtro de busca
      if (filters.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,company.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transformar dados de forma segura
      const customers = data || [];
      
      const results: ValidationResult[] = customers.map((customer: any) => ({
        id: customer.id || '',
        name: customer.name || '',
        email: customer.email || undefined,
        phone: customer.phone || undefined,
        company: customer.company || undefined,
        cnpj: customer.cnpj || undefined,
        address: customer.address || undefined,
        city: customer.city || undefined,
        state: customer.state || undefined,
        zip_code: customer.zip_code || undefined,
        website: customer.website || undefined,
        contact_person: customer.contact_person || undefined,
        contact_role: customer.contact_role || undefined,
        whatsapp: customer.whatsapp || undefined,
        notes: customer.notes || undefined,
        status: this.validateStatus(customer.status),
        lead_source: customer.lead_source || undefined,
        priority: customer.priority || undefined,
        segment_id: customer.segment_id || undefined,
        created_at: customer.created_at || new Date().toISOString(),
        updated_at: customer.updated_at || new Date().toISOString(),
        last_contact_date: customer.last_contact_date || undefined,
        created_by: customer.created_by || undefined,
        data_quality_score: Number(customer.data_quality_score) || 0,
        last_validated_at: customer.last_validated_at || undefined,
        validation_errors: this.processErrors(customer.validation_errors),
        data_completeness_percentage: Number(customer.data_completeness_percentage) || 0,
        severity: this.calculateSeverity(Number(customer.data_quality_score) || 0)
      }));

      return results;

    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      throw error;
    }
  }

  // Métodos auxiliares simplificados
  private static processErrors(errors: any): string[] {
    if (!errors) return [];
    if (Array.isArray(errors)) {
      return errors.map(error => String(error));
    }
    return [String(errors)];
  }

  private static calculateSeverity(score: number): 'low' | 'medium' | 'high' {
    if (score >= 80) return 'low';
    if (score >= 50) return 'medium';
    return 'high';
  }

  private static validateStatus(status: any): 'prospecto' | 'qualificado' | 'negociacao' | 'cliente' | 'inativo' {
    const validStatuses = ['prospecto', 'qualificado', 'negociacao', 'cliente', 'inativo'];
    if (typeof status === 'string' && validStatuses.includes(status)) {
      return status as 'prospecto' | 'qualificado' | 'negociacao' | 'cliente' | 'inativo';
    }
    return 'prospecto';
  }
}
