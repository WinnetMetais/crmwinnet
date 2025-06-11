
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Edit, Check, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BulkOperationProps {
  data: any[];
  selectedItems: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onBulkUpdate: (updates: Record<string, any>) => Promise<void>;
  onBulkValidate: () => Promise<{ valid: any[]; invalid: any[] }>;
  onBulkDelete: (ids: string[]) => Promise<void>;
  updateFields: {
    key: string;
    label: string;
    type: 'text' | 'select' | 'number' | 'date';
    options?: { value: string; label: string }[];
  }[];
  moduleType: 'financial' | 'commercial';
}

export const BulkOperations = ({
  data,
  selectedItems,
  onSelectionChange,
  onBulkUpdate,
  onBulkValidate,
  onBulkDelete,
  updateFields,
  moduleType
}: BulkOperationProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updateValues, setUpdateValues] = useState<Record<string, any>>({});
  const [validationResults, setValidationResults] = useState<{
    valid: any[];
    invalid: any[];
  } | null>(null);

  const handleSelectAll = () => {
    if (selectedItems.size === data.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map(item => item.id)));
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedItems.size === 0) {
      toast({
        title: "Seleção necessária",
        description: "Selecione pelo menos um item para atualizar.",
        variant: "destructive",
      });
      return;
    }

    if (Object.keys(updateValues).length === 0) {
      toast({
        title: "Valores necessários",
        description: "Defina pelo menos um campo para atualizar.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    setProgress(0);

    try {
      const total = selectedItems.size;
      let processed = 0;

      for (const id of selectedItems) {
        await onBulkUpdate({ id, ...updateValues });
        processed++;
        setProgress((processed / total) * 100);
      }

      toast({
        title: "Atualização concluída",
        description: `${selectedItems.size} itens atualizados com sucesso.`,
      });

      setUpdateValues({});
      onSelectionChange(new Set());
    } catch (error) {
      console.error('Erro na atualização em massa:', error);
      toast({
        title: "Erro na atualização",
        description: "Ocorreu um erro durante a atualização em massa.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      setProgress(0);
    }
  };

  const handleBulkValidate = async () => {
    setIsValidating(true);
    try {
      const results = await onBulkValidate();
      setValidationResults(results);
      
      toast({
        title: "Validação concluída",
        description: `${results.valid.length} válidos, ${results.invalid.length} com problemas.`,
      });
    } catch (error) {
      console.error('Erro na validação em massa:', error);
      toast({
        title: "Erro na validação",
        description: "Ocorreu um erro durante a validação.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast({
        title: "Seleção necessária",
        description: "Selecione pelo menos um item para excluir.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir ${selectedItems.size} item(ns)? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await onBulkDelete(Array.from(selectedItems));
      toast({
        title: "Exclusão concluída",
        description: `${selectedItems.size} itens excluídos com sucesso.`,
      });
      onSelectionChange(new Set());
    } catch (error) {
      console.error('Erro na exclusão em massa:', error);
      toast({
        title: "Erro na exclusão",
        description: "Ocorreu um erro durante a exclusão em massa.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Operações em Massa - {moduleType === 'financial' ? 'Financeiro' : 'Comercial'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Use estas ferramentas para realizar operações em massa nos dados {moduleType === 'financial' ? 'financeiros' : 'comerciais'}. 
              Selecione os itens desejados e escolha a operação.
            </AlertDescription>
          </Alert>

          {/* Seleção */}
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedItems.size === data.length && data.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                Selecionar todos ({data.length} itens)
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedItems.size} de {data.length} selecionados
            </div>
          </div>

          {/* Atualização em Massa */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium">Atualização em Massa</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {updateFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {field.type === 'select' ? (
                    <Select
                      value={updateValues[field.key] || ''}
                      onValueChange={(value) => 
                        setUpdateValues(prev => ({ ...prev, [field.key]: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecionar ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.key}
                      type={field.type}
                      value={updateValues[field.key] || ''}
                      onChange={(e) => 
                        setUpdateValues(prev => ({ 
                          ...prev, 
                          [field.key]: field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value 
                        }))
                      }
                      placeholder={`Atualizar ${field.label}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleBulkUpdate}
                disabled={selectedItems.size === 0 || isUpdating}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                {isUpdating ? 'Atualizando...' : `Atualizar ${selectedItems.size} item(ns)`}
              </Button>
            </div>

            {isUpdating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso da atualização</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>

          {/* Validação em Massa */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium">Validação em Massa</h4>
            <p className="text-sm text-muted-foreground">
              Valide todos os dados para identificar inconsistências e problemas.
            </p>
            
            <Button
              onClick={handleBulkValidate}
              disabled={isValidating}
              variant="outline"
              className="w-full"
            >
              <Check className="h-4 w-4 mr-2" />
              {isValidating ? 'Validando...' : 'Validar Todos os Dados'}
            </Button>

            {validationResults && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm font-medium text-green-800">
                    Dados Válidos
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {validationResults.valid.length}
                  </div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm font-medium text-red-800">
                    Com Problemas
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {validationResults.invalid.length}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Exclusão em Massa */}
          <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50">
            <h4 className="font-medium text-red-800">Zona de Perigo</h4>
            <p className="text-sm text-red-700">
              Exclua os itens selecionados permanentemente. Esta ação não pode ser desfeita.
            </p>
            
            <Button
              onClick={handleBulkDelete}
              disabled={selectedItems.size === 0}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir {selectedItems.size} item(ns) selecionado(s)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
