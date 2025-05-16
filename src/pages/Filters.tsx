
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  Plus, 
  Save,
  TrashIcon,
  Copy,
  Download,
  Share2,
  PlusCircle,
  MinusCircle,
  ChevronUp,
  ChevronDown,
  Calendar,
  Users,
  DollarSign
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const Filters = () => {
  const [filterName, setFilterName] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>(['cliente', 'produto']);
  const [conditions, setConditions] = useState([
    { field: 'cliente', operator: 'contem', value: '' },
    { field: 'produto', operator: 'igual', value: '' },
  ]);
  
  // Sample saved filters
  const savedFilters = [
    { 
      id: 1, 
      name: 'Clientes Premium', 
      description: 'Filtro para clientes com compras acima de R$ 50.000', 
      fields: ['cliente', 'valor_compra'], 
      usage: 28,
      shared: true
    },
    { 
      id: 2, 
      name: 'Produtos Críticos', 
      description: 'Produtos com estoque abaixo do mínimo', 
      fields: ['produto', 'estoque', 'nivel_minimo'], 
      usage: 15,
      shared: false
    },
    { 
      id: 3, 
      name: 'Vendas por Região', 
      description: 'Análise de vendas por região geográfica', 
      fields: ['cliente', 'regiao', 'valor_compra', 'data'], 
      usage: 42,
      shared: true
    },
  ];

  // Sample field options
  const fieldOptions = [
    { value: 'cliente', label: 'Cliente' },
    { value: 'produto', label: 'Produto' },
    { value: 'categoria', label: 'Categoria' },
    { value: 'valor_compra', label: 'Valor de Compra' },
    { value: 'data', label: 'Data' },
    { value: 'estoque', label: 'Estoque' },
    { value: 'regiao', label: 'Região' },
    { value: 'vendedor', label: 'Vendedor' },
    { value: 'nivel_minimo', label: 'Nível Mínimo' }
  ];
  
  // Available operators based on field type
  const getOperatorsForField = (field: string) => {
    switch (field) {
      case 'valor_compra':
      case 'estoque':
      case 'nivel_minimo':
        return [
          { value: 'igual', label: 'Igual a' },
          { value: 'maior', label: 'Maior que' },
          { value: 'menor', label: 'Menor que' },
          { value: 'entre', label: 'Entre' }
        ];
      case 'data':
        return [
          { value: 'igual', label: 'Igual a' },
          { value: 'antes', label: 'Antes de' },
          { value: 'depois', label: 'Depois de' },
          { value: 'entre', label: 'Entre' }
        ];
      default:
        return [
          { value: 'igual', label: 'Igual a' },
          { value: 'contem', label: 'Contém' },
          { value: 'comeca', label: 'Começa com' },
          { value: 'termina', label: 'Termina com' }
        ];
    }
  };

  // Add a new condition
  const addCondition = () => {
    const availableFields = fieldOptions.filter(
      option => !selectedFields.includes(option.value)
    );
    
    if (availableFields.length > 0) {
      const newField = availableFields[0].value;
      setSelectedFields([...selectedFields, newField]);
      setConditions([
        ...conditions, 
        { field: newField, operator: 'igual', value: '' }
      ]);
    }
  };

  // Remove a condition
  const removeCondition = (index: number) => {
    const newConditions = [...conditions];
    const fieldToRemove = conditions[index].field;
    
    newConditions.splice(index, 1);
    setConditions(newConditions);
    
    const newSelectedFields = selectedFields.filter(field => field !== fieldToRemove);
    setSelectedFields(newSelectedFields);
  };

  // Update a condition
  const updateCondition = (index: number, key: string, value: string) => {
    const newConditions = [...conditions];
    
    if (key === 'field') {
      // Update selected fields if the field changes
      const oldField = newConditions[index].field;
      const newSelectedFields = selectedFields.filter(field => field !== oldField);
      setSelectedFields([...newSelectedFields, value]);
    }
    
    // @ts-ignore - Dynamic property assignment
    newConditions[index][key] = value;
    setConditions(newConditions);
  };

  // Field type based UI component for condition value
  const renderValueInput = (condition: any, index: number) => {
    switch (condition.field) {
      case 'valor_compra':
      case 'estoque':
      case 'nivel_minimo':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Valor"
              value={condition.value}
              onChange={(e) => updateCondition(index, 'value', e.target.value)}
            />
            {condition.operator === 'entre' && (
              <Input
                type="number"
                placeholder="Até"
                className="w-24"
              />
            )}
          </div>
        );
      case 'data':
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="date"
                placeholder="Data"
                value={condition.value}
                onChange={(e) => updateCondition(index, 'value', e.target.value)}
              />
            </div>
            {condition.operator === 'entre' && (
              <div className="relative">
                <Input
                  type="date"
                  placeholder="Até"
                />
              </div>
            )}
          </div>
        );
      case 'cliente':
      case 'vendedor':
        return (
          <Select
            value={condition.value}
            onValueChange={(val) => updateCondition(index, 'value', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {condition.field === 'cliente' ? (
                <>
                  <SelectItem value="abc">Indústrias ABC</SelectItem>
                  <SelectItem value="xyz">Metalúrgica XYZ</SelectItem>
                  <SelectItem value="jkl">Construções JKL</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="ana">Ana Silva</SelectItem>
                  <SelectItem value="carlos">Carlos Santos</SelectItem>
                  <SelectItem value="pedro">Pedro Alves</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        );
      case 'regiao':
        return (
          <Select
            value={condition.value}
            onValueChange={(val) => updateCondition(index, 'value', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sudeste">Sudeste</SelectItem>
              <SelectItem value="sul">Sul</SelectItem>
              <SelectItem value="nordeste">Nordeste</SelectItem>
              <SelectItem value="norte">Norte</SelectItem>
              <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'produto':
      case 'categoria':
      default:
        return (
          <Input
            placeholder="Valor"
            value={condition.value}
            onChange={(e) => updateCondition(index, 'value', e.target.value)}
          />
        );
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold">Filtros Avançados</h1>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Filter Builder Column */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Filter className="mr-2 h-5 w-5" />
                      Construir Filtro
                    </CardTitle>
                    <CardDescription>
                      Crie filtros personalizados para seus relatórios e análises
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium">Nome do Filtro</label>
                      <Input 
                        placeholder="Ex: Clientes Premium" 
                        className="mt-1"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)} 
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Condições</label>
                        <Button variant="outline" size="sm" onClick={addCondition}>
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Adicionar Condição
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {conditions.map((condition, index) => (
                          <div key={index} className="border rounded-md p-4 relative">
                            <div className="absolute right-2 top-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCondition(index)}
                                className="h-6 w-6"
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs font-medium mb-1 block">Campo</label>
                                <Select
                                  value={condition.field}
                                  onValueChange={(val) => updateCondition(index, 'field', val)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o campo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fieldOptions.map((option) => (
                                      <SelectItem 
                                        key={option.value} 
                                        value={option.value}
                                        disabled={selectedFields.includes(option.value) && condition.field !== option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="text-xs font-medium mb-1 block">Operador</label>
                                <Select
                                  value={condition.operator}
                                  onValueChange={(val) => updateCondition(index, 'operator', val)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o operador" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getOperatorsForField(condition.field).map((op) => (
                                      <SelectItem key={op.value} value={op.value}>
                                        {op.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="text-xs font-medium mb-1 block">Valor</label>
                                {renderValueInput(condition, index)}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {conditions.length > 0 && (
                          <div className="flex items-center pt-2">
                            <div className="font-medium text-sm mr-2">
                              Combinar condições:
                            </div>
                            <Select defaultValue="and">
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Combinar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="and">Todas (E)</SelectItem>
                                <SelectItem value="or">Qualquer (OU)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="additional">
                          <AccordionTrigger className="text-sm font-medium">
                            Opções Adicionais
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              <div>
                                <label className="text-sm font-medium">Descrição</label>
                                <Input placeholder="Descrição do filtro" className="mt-1" />
                              </div>
                              
                              <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium">Limites de Resultado</label>
                                <Slider defaultValue={[100]} max={500} step={10} />
                                <div className="text-xs text-muted-foreground">
                                  Limitado a 100 resultados
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <label className="text-sm font-medium">Compartilhar com a equipe</label>
                                  <span className="text-xs text-muted-foreground">
                                    Permitir que outros usuários vejam e usem este filtro
                                  </span>
                                </div>
                                <Switch />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Pré-visualizar
                    </Button>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Filtro
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Resultados da Pré-visualização</CardTitle>
                    <CardDescription>
                      Veja os resultados do seu filtro antes de salvar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-md p-6 flex flex-col items-center justify-center text-center">
                      <Filter className="h-8 w-8 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">
                        Clique em "Pré-visualizar" para ver os resultados do seu filtro
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Saved Filters Column */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Filtros Salvos</span>
                      <Button variant="ghost" size="icon">
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Seus filtros personalizados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {savedFilters.map((filter) => (
                        <div key={filter.id} className="border rounded-md p-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{filter.name}</h3>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {filter.fields.length} campos
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {filter.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {filter.fields.map((field, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {fieldOptions.find(f => f.value === field)?.label || field}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              Usado {filter.usage} vezes
                            </span>
                            <div className="flex gap-1">
                              {filter.shared && (
                                <Badge variant="outline" className="h-5 px-1 flex items-center gap-0.5">
                                  <Users className="h-3 w-3" />
                                </Badge>
                              )}
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <TrashIcon className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Campos Disponíveis</CardTitle>
                    <CardDescription>
                      Campos que você pode usar nos filtros
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y">
                      <div className="py-3 first:pt-0 last:pb-0">
                        <h4 className="text-sm font-medium flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Cliente
                        </h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>Nome</li>
                          <li>CNPJ/CPF</li>
                          <li>Região</li>
                          <li>Segmento</li>
                        </ul>
                      </div>
                      
                      <div className="py-3 first:pt-0 last:pb-0">
                        <h4 className="text-sm font-medium flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          Produto
                        </h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>Nome</li>
                          <li>Categoria</li>
                          <li>Estoque</li>
                          <li>Nível Mínimo</li>
                        </ul>
                      </div>
                      
                      <div className="py-3 first:pt-0 last:pb-0">
                        <h4 className="text-sm font-medium flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Vendas
                        </h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>Valor</li>
                          <li>Data</li>
                          <li>Vendedor</li>
                          <li>Status</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Filters;
