
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Package } from "lucide-react";
import { Product, searchProducts, getMarginOptions } from "@/services/products";
import { QuoteItem } from "@/types/quote";

interface ProductSelectorProps {
  onSelectProduct: (product: Product, margin: number) => void;
  onClose: () => void;
}

export const ProductSelector = ({ onSelectProduct, onClose }: ProductSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMargin, setSelectedMargin] = useState(60);

  const marginOptions = getMarginOptions();

  useEffect(() => {
    if (searchTerm.length >= 2) {
      handleSearch();
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchProducts(searchTerm);
      setProducts(results);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    onSelectProduct(product, selectedMargin);
  };

  const getMarginPrice = (product: Product, margin: number) => {
    if (!product.cost_price) return 0;
    return product.cost_price / (1 - margin / 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6" />
              <h2 className="text-xl font-bold">Selecionar Produto</h2>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
              ✕
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Busca e Margem */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Buscar Produto</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Digite o nome, SKU ou categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-40">
                <Label htmlFor="margin">Margem de Lucro</Label>
                <Select value={selectedMargin.toString()} onValueChange={(value) => setSelectedMargin(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {marginOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Resultados */}
            {loading && (
              <div className="text-center py-8">
                <p>Buscando produtos...</p>
              </div>
            )}

            {searchTerm.length < 2 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-4" />
                <p>Digite pelo menos 2 caracteres para buscar produtos</p>
              </div>
            )}

            {searchTerm.length >= 2 && products.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-4" />
                <p>Nenhum produto encontrado</p>
              </div>
            )}

            {products.length > 0 && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Custo</TableHead>
                      <TableHead>Preço com {selectedMargin}%</TableHead>
                      <TableHead>Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            {product.description && (
                              <p className="text-sm text-muted-foreground">{product.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <Badge variant={product.inventory_count && product.inventory_count > (product.min_stock || 0) ? "default" : "destructive"}>
                            {product.inventory_count} {product.unit}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {product.cost_price ? `R$ ${product.cost_price.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell className="font-bold">
                          {product.cost_price ? `R$ ${getMarginPrice(product, selectedMargin).toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            onClick={() => handleProductSelect(product)}
                            disabled={!product.cost_price}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
