
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/products';
import { useToast } from '@/hooks/use-toast';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Sucesso',
        description: 'Produto criado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar produto',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      productService.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Sucesso',
        description: 'Produto atualizado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar produto',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Sucesso',
        description: 'Produto removido com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao remover produto',
        variant: 'destructive',
      });
    },
  });
};

export const useActiveProducts = () => {
  return useQuery({
    queryKey: ['products', 'active'],
    queryFn: productService.getActiveProducts,
  });
};

export const useLowStockProducts = () => {
  return useQuery({
    queryKey: ['products', 'low-stock'],
    queryFn: productService.getLowStockProducts,
  });
};
