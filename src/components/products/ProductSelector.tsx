
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, Package } from 'lucide-react';
import { getProducts } from '@/services/products';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductSelectorProps {
  onSelect: (product: Product, margin: number) => void;
  onClose: () => void;
}

export const ProductSelector = ({ onSelect, onClose }: ProductSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMargin, setSelectedMargin] = useState(60);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProductSelect = (product: Product) => {
    onSelect(product, selectedMargin);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6" />
              <h2 className="text-xl font-bold">Selecionar Produto - Winnet Metais</h2>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Margem de Lucro:</span>
              <div className="flex gap-2">
                {[50, 55, 60, 65, 70, 75].map((margin) => (
                  <Button
                    key={margin}
                    variant={selectedMargin === margin ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMargin(margin)}
                  >
                    {margin}%
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {isLoading ? (
              <div className="text-center py-8">Carregando produtos...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum produto encontrado
              </div>
            ) : (
              filteredProducts.map((product: Product) => {
                const marginPrice = product.cost_price ? product.cost_price / (1 - selectedMargin / 100) : 0;
                
                return (
                  <Card key={product.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleProductSelect(product)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            <Badge variant="outline">{product.sku}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Categoria: {product.category}</p>
                            <p>Estoque: {product.inventory_count} {product.unit}</p>
                            <p>Custo: R$ {product.cost_price?.toFixed(2) || '0,00'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            R$ {marginPrice.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Margem {selectedMargin}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
