
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, DollarSign, Trash2 } from "lucide-react";

interface OpportunityItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface ProductsTabProps {
  items: OpportunityItem[];
  estimatedValue: number;
  onAddProduct: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export const ProductsTab = ({ 
  items, 
  estimatedValue, 
  onAddProduct, 
  onUpdateQuantity, 
  onRemoveItem 
}: ProductsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Produtos/Serviços</h3>
        <Button type="button" onClick={onAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum produto adicionado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Clique em "Adicionar Produto" para incluir itens no orçamento
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium">
                      {item.productName}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      SKU: {item.sku}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs">Qtd</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Unidade</Label>
                    <p className="text-sm mt-1">{item.unit}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Preço Unit.</Label>
                    <p className="text-sm mt-1">R$ {item.unitPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs">Total</Label>
                      <p className="text-sm font-medium mt-1">
                        R$ {item.total.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-900">
                  Valor Total: R$ {estimatedValue.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
