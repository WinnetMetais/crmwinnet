
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

const fieldSchema = z.object({
  field_name: z.string().min(1, 'Nome do campo é obrigatório'),
  field_label: z.string().min(1, 'Rótulo é obrigatório'),
  field_type: z.enum(['text', 'number', 'date', 'select', 'boolean', 'textarea']),
  module: z.enum(['customers', 'products', 'opportunities']),
  required: z.boolean(),
  visible: z.boolean(),
  field_order: z.number(),
});

type FieldFormData = z.infer<typeof fieldSchema>;

interface CustomFieldFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FieldFormData & { options: string[] }) => void;
  initialData?: Record<string, any>;
  module: string;
}

export const CustomFieldForm = ({ open, onClose, onSubmit, initialData, module }: CustomFieldFormProps) => {
  const [options, setOptions] = useState<string[]>(initialData?.options || []);
  const [newOption, setNewOption] = useState('');

  const form = useForm<FieldFormData>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      field_name: initialData?.field_name || '',
      field_label: initialData?.field_label || '',
      field_type: initialData?.field_type || 'text',
      module: module as 'customers' | 'products' | 'opportunities',
      required: initialData?.required || false,
      visible: initialData?.visible || true,
      field_order: initialData?.field_order || 0,
    },
  });

  const fieldType = form.watch('field_type');

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (optionToRemove: string) => {
    setOptions(options.filter(option => option !== optionToRemove));
  };

  const handleSubmit = (data: FieldFormData) => {
    onSubmit({ ...data, options });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Campo Customizado' : 'Novo Campo Customizado'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="field_name">Nome do Campo</Label>
              <Input
                id="field_name"
                {...form.register('field_name')}
                placeholder="ex: segmento_cliente"
              />
              {form.formState.errors.field_name && (
                <p className="text-sm text-red-500">{form.formState.errors.field_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="field_label">Rótulo</Label>
              <Input
                id="field_label"
                {...form.register('field_label')}
                placeholder="ex: Segmento do Cliente"
              />
              {form.formState.errors.field_label && (
                <p className="text-sm text-red-500">{form.formState.errors.field_label.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="field_type">Tipo do Campo</Label>
            <Select onValueChange={(value) => form.setValue('field_type', value as 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea')}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texto</SelectItem>
                <SelectItem value="number">Número</SelectItem>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="select">Lista de Opções</SelectItem>
                <SelectItem value="boolean">Sim/Não</SelectItem>
                <SelectItem value="textarea">Texto Longo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {fieldType === 'select' && (
            <div>
              <Label>Opções</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Digite uma opção"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                />
                <Button type="button" onClick={addOption} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {options.map((option, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    {option}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeOption(option)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={form.watch('required')}
                onCheckedChange={(checked) => form.setValue('required', checked)}
              />
              <Label htmlFor="required">Campo Obrigatório</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="visible"
                checked={form.watch('visible')}
                onCheckedChange={(checked) => form.setValue('visible', checked)}
              />
              <Label htmlFor="visible">Campo Visível</Label>
            </div>
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
