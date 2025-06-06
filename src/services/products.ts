
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Product = Tables<'products'>;
export type ProductInsert = TablesInsert<'products'>;
export type ProductUpdate = TablesUpdate<'products'>;

export const productService = {
  // Buscar todos os produtos
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Buscar produto por ID
  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Criar novo produto
  async createProduct(product: ProductInsert) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Atualizar produto
  async updateProduct(id: string, updates: ProductUpdate) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deletar produto
  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Buscar produtos ativos
  async getActiveProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Buscar produtos com estoque baixo
  async getLowStockProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .filter('inventory_count', 'lte', 'min_stock')
      .eq('active', true)
      .order('name');
    
    if (error) throw error;
    return data;
  }
};

// Manter compatibilidade com código existente
export const getProducts = productService.getProducts;
export const getProductById = productService.getProductById;
export const createProduct = productService.createProduct;
export const updateProduct = productService.updateProduct;
export const deleteProduct = productService.deleteProduct;
