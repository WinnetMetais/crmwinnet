
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type CustomField = Tables<'custom_fields'>;
export type CustomFieldInsert = TablesInsert<'custom_fields'>;
export type CustomFieldUpdate = TablesUpdate<'custom_fields'>;

export const customFieldService = {
  // Buscar campos customizados por módulo
  async getCustomFieldsByModule(module: string) {
    const { data, error } = await supabase
      .from('custom_fields')
      .select('*')
      .eq('module', module)
      .order('field_order', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Buscar campos visíveis por módulo
  async getVisibleFieldsByModule(module: string) {
    const { data, error } = await supabase
      .from('custom_fields')
      .select('*')
      .eq('module', module)
      .eq('visible', true)
      .order('field_order', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Criar novo campo customizado
  async createCustomField(field: CustomFieldInsert) {
    const { data, error } = await supabase
      .from('custom_fields')
      .insert(field)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Atualizar campo customizado
  async updateCustomField(id: string, updates: CustomFieldUpdate) {
    const { data, error } = await supabase
      .from('custom_fields')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deletar campo customizado
  async deleteCustomField(id: string) {
    const { error } = await supabase
      .from('custom_fields')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Atualizar ordem dos campos
  async updateFieldOrder(fieldUpdates: { id: string; field_order: number }[]) {
    const promises = fieldUpdates.map(({ id, field_order }) =>
      supabase
        .from('custom_fields')
        .update({ field_order })
        .eq('id', id)
    );

    const results = await Promise.all(promises);
    const errors = results.filter(result => result.error);
    
    if (errors.length > 0) {
      throw new Error('Erro ao atualizar ordem dos campos');
    }
  }
};
