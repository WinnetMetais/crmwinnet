
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FilterCriteria {
  field: string;
  operator: string;
  value: string;
  label: string;
}

interface SavedFilter {
  id: string;
  name: string;
  criteria: FilterCriteria[];
  createdAt: string;
  lastUsed: string;
}

export const AdvancedFilters = () => {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [newCriteria, setNewCriteria] = useState({
    field: '',
    operator: '',
    value: '',
    label: ''
  });

  const [savedFilters] = useState<SavedFilter[]>([
    {
      id: '1',
      name: 'Vendas Último Mês',
      criteria: [
        { field: 'sale_date', operator: 'last_30_days', value: '', label: 'Data da venda nos últimos 30 dias' }
      ],
      createdAt: '2024-01-10',
      lastUsed: '2024-01-15'
    },
    {
      id: '2',
      name: 'Clientes Ativos',
      criteria: [
        { field: 'status', operator: 'equals', value: 'active', label: 'Status igual a ativo' },
        { field: 'last_purchase', operator: 'last_90_days', value: '', label: 'Última compra nos últimos 90 dias' }
      ],
      createdAt: '2024-01-08',
      lastUsed: '2024-01-14'
    }
  ]);

  const availableFields = [
    { value: 'customer_name', label: 'Nome do Cliente' },
    { value: 'sale_date', label: 'Data da Venda' },
    { value: 'sale_value', label: 'Valor da Venda' },
    { value: 'product_category', label: 'Categoria do Produto' },
    { value: 'salesperson', label: 'Vendedor' },
    { value: 'lead_source', label: 'Origem do Lead' },
    { value: 'deal_stage', label: 'Estágio do Negócio' },
    { value: 'customer_status', label: 'Status do Cliente' }
  ];

  const operators = [
    { value: 'equals', label: 'Igual a' },
    { value: 'not_equals', label: 'Diferente de' },
    { value: 'contains', label: 'Contém' },
    { value: 'greater_than', label: 'Maior que' },
    { value: 'less_than', label: 'Menor que' },
    { value: 'between', label: 'Entre' },
    { value: 'last_7_days', label: 'Últimos 7 dias' },
    { value: 'last_30_days', label: 'Últimos 30 dias' },
    { value: 'last_90_days', label: 'Últimos 90 dias' },
    { value: 'this_month', label: 'Este mês' },
    { value: 'this_year', label: 'Este ano' }
  ];

  const handleAddCriteria = () => {
    if (!newCriteria.field || !newCriteria.operator) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione campo e operador.",
        variant: "destructive"
      });
      return;
    }

    const fieldLabel = availableFields.find(f => f.value === newCriteria.field)?.label || '';
    const operatorLabel = operators.find(o => o.value === newCriteria.operator)?.label || '';
    
    const criteria: FilterCriteria = {
      field: newCriteria.field,
      operator: newCriteria.operator,
      value: newCriteria.value,
      label: `${fieldLabel} ${operatorLabel} ${newCriteria.value}`
    };

    setFilterCriteria([...filterCriteria, criteria]);
    setNewCriteria({ field: '', operator: '', value: '', label: '' });
  };

  const removeCriteria = (index: number) => {
    setFilterCriteria(filterCriteria.filter((_, i) => i !== index));
  };

  const handleApplyFilter = () => {
    if (filterCriteria.length === 0) {
      toast({
        title: "Nenhum filtro",
        description: "Adicione pelo menos um critério de filtro.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Filtro aplicado",
      description: `Filtro com ${filterCriteria.length} critério(s) foi aplicado!`,
    });
  };

  const clearFilters = () => {
    setFilterCriteria([]);
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Construir Filtro Avançado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="field">Campo</Label>
                <select 
                  id="field"
                  className="w-full border rounded-md px-3 py-2"
                  value={newCriteria.field}
                  onChange={(e) => setNewCriteria({...newCriteria, field: e.target.value})}
                >
                  <option value="">Selecione um campo...</option>
                  {availableFields.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="operator">Operador</Label>
                <select 
                  id="operator"
                  className="w-full border rounded-md px-3 py-2"
                  value={newCriteria.operator}
                  onChange={(e) => setNewCriteria({...newCriteria, operator: e.target.value})}
                >
                  <option value="">Selecione um operador...</option>
                  {operators.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>

              {newCriteria.operator && !['last_7_days', 'last_30_days', 'last_90_days', 'this_month', 'this_year'].includes(newCriteria.operator) && (
                <div>
                  <Label htmlFor="value">Valor</Label>
                  <Input
                    id="value"
                    placeholder="Digite o valor..."
                    value={newCriteria.value}
                    onChange={(e) => setNewCriteria({...newCriteria, value: e.target.value})}
                  />
                </div>
              )}

              <Button onClick={handleAddCriteria} className="w-full">
                Adicionar Critério
              </Button>
            </div>

            {filterCriteria.length > 0 && (
              <div className="space-y-2">
                <Label>Critérios Ativos</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filterCriteria.map((criteria, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="text-sm">{criteria.label}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeCriteria(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleApplyFilter} className="flex-1">
                <Filter className="h-4 w-4 mr-2" />
                Aplicar Filtro
              </Button>
              <Button onClick={clearFilters} variant="outline" className="flex-1">
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filtros Salvos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedFilters.map((filter) => (
                <div key={filter.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{filter.name}</h4>
                    <Badge variant="outline">{filter.criteria.length} critérios</Badge>
                  </div>

                  <div className="space-y-1 mb-3">
                    {filter.criteria.map((criteria, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        • {criteria.label}
                      </p>
                    ))}
                  </div>

                  <div className="text-xs text-muted-foreground mb-3">
                    <p>Criado: {new Date(filter.createdAt).toLocaleDateString('pt-BR')}</p>
                    <p>Usado: {new Date(filter.lastUsed).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Aplicar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Save className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros por Data/Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Hoje</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Esta Semana</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Este Mês</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Este Ano</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Últimos 7 dias</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Últimos 30 dias</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Últimos 90 dias</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Período Customizado</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
