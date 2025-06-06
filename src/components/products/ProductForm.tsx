
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useVisibleFieldsByModule } from '@/hooks/useCustomFields';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const ProductForm = ({ open, onClose, onSubmit, initialData }: ProductFormProps) => {
  const { data: customFields = [] } = useVisibleFieldsByModule('products');
  
  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      sku: initialData?.sku || '',
      category: initialData?.category || '',
      cost_price: initialData?.cost_price || 0,
      price: initialData?.price || 0,
      unit: initialData?.unit || 'kg',
      inventory_count: initialData?.inventory_count || 0,
      min_stock: initialData?.min_stock || 10,
      weight: initialData?.weight || 0,
      dimensions: initialData?.dimensions || '',
      supplier: initialData?.supplier || '',
      active: initialData?.active ?? true,
      custom_data: initialData?.custom_data || {},
    },
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
    onClose();
  };

  const renderCustomField = (field: any) => {
    const fieldName = `custom_data.${field.field_name}`;
    
    switch (field.field_type) {
      case 'text':
        return (
          <div key={field.id}>
            <Label htmlFor={fieldName}>{field.field_label}</Label>
            <Input
              id={fieldName}
              {...form.register(fieldName as any)}
              placeholder={field.field_label}
            />
          </div>
        );
      
      case 'number':
        return (
          <div key={field.id}>
            <Label htmlFor={fieldName}>{field.field_label}</Label>
            <Input
              id={fieldName}
              type="number"
              {...form.register(fieldName as any, { valueAsNumber: true })}
              placeholder={field.field_label}
            />
          </div>
        );
      
      case 'date':
        return (
          <div key={field.id}>
            <Label htmlFor={fieldName}>{field.field_label}</Label>
            <Input
              id={fieldName}
              type="date"
              {...form.register(fieldName as any)}
            />
          </div>
        );
      
      case 'select':
        return (
          <div key={field.id}>
            <Label htmlFor={fieldName}>{field.field_label}</Label>
            <Select onValueChange={(value) => form.setValue(fieldName as any, value)}>
              <SelectTrigger>
                <SelectValue placeholder={`Selecione ${field.field_label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'boolean':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Switch
              id={fieldName}
              checked={form.watch(fieldName as any)}
              onCheckedChange={(checked) => form.setValue(fieldName as any, checked)}
            />
            <Label htmlFor={fieldName}>{field.field_label}</Label>
          </div>
        );
      
      case 'textarea':
        return (
          <div key={field.id}>
            <Label htmlFor={fieldName}>{field.field_label}</Label>
            <Textarea
              id={fieldName}
              {...form.register(fieldName as any)}
              placeholder={field.field_label}
              rows={3}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                {...form.register('name', { required: true })}
                placeholder="Nome do produto"
              />
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                {...form.register('sku')}
                placeholder="Código do produto"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Descrição do produto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                {...form.register('category')}
                placeholder="Categoria"
              />
            </div>

            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Select onValueChange={(value) => form.setValue('unit', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="mt">metro</SelectItem>
                  <SelectItem value="pc">peça</SelectItem>
                  <SelectItem value="lt">litro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input
                id="supplier"
                {...form.register('supplier')}
                placeholder="Fornecedor"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="cost_price">Preço de Custo</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                {...form.register('cost_price', { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="price">Preço de Venda</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register('price', { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="inventory_count">Estoque Atual</Label>
              <Input
                id="inventory_count"
                type="number"
                {...form.register('inventory_count', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="min_stock">Estoque Mínimo</Label>
              <Input
                id="min_stock"
                type="number"
                {...form.register('min_stock', { valueAsNumber: true })}
                placeholder="10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                {...form.register('weight', { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="dimensions">Dimensões</Label>
              <Input
                id="dimensions"
                {...form.register('dimensions')}
                placeholder="ex: 100x50x30 cm"
              />
            </div>
          </div>

          {customFields.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Campos Personalizados</h3>
              <div className="grid grid-cols-2 gap-4">
                {customFields.map(renderCustomField)}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={form.watch('active')}
              onCheckedChange={(checked) => form.setValue('active', checked)}
            />
            <Label htmlFor="active">Produto Ativo</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
