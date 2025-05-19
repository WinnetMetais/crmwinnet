
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  sku?: string;
  inventory_count?: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar produtos",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao buscar produto",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function createProduct(product: Omit<Product, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Produto criado",
      description: "O produto foi criado com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao criar produto",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function updateProduct(id: string, product: Partial<Product>) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Produto atualizado",
      description: "O produto foi atualizado com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao atualizar produto",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso.",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Erro ao remover produto",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
}
