
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ProductConfiguration {
  id: string;
  product_id: string;
  configuration_type: string;
  configuration_data: any;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  // Relacionamentos
  products?: any;
}

export async function getProductConfigurations(productId?: string) {
  try {
    let query = supabase
      .from('product_configurations')
      .select(`
        *,
        products(
          id,
          name,
          sku
        )
      `)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar configurações",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

export async function createProductConfiguration(configData: Omit<ProductConfiguration, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('product_configurations')
      .insert({
        ...configData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Configuração criada",
      description: "A configuração foi criada com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao criar configuração",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function updateProductConfiguration(configId: string, configData: Partial<ProductConfiguration>) {
  try {
    const { data, error } = await supabase
      .from('product_configurations')
      .update({
        ...configData,
        updated_at: new Date().toISOString()
      })
      .eq('id', configId)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Configuração atualizada",
      description: "A configuração foi atualizada com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao atualizar configuração",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Função para aplicar margens automáticas
export async function applyProductMargins(productId: string, costPrice: number) {
  try {
    const defaultMargins = [50, 55, 60, 65, 70, 75];
    const marginConfigs = defaultMargins.map(margin => ({
      product_id: productId,
      configuration_type: 'margin',
      configuration_data: {
        margin_percentage: margin,
        calculated_price: costPrice / (1 - margin / 100)
      },
      active: true
    }));

    const { data, error } = await supabase
      .from('product_configurations')
      .insert(marginConfigs)
      .select();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao aplicar margens",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}
