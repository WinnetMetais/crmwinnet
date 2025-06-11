
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Search, 
  Filter,
  Users,
  Target,
  TrendingUp,
  FileText,
  Trash2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { dataValidationService, ValidationResult } from "@/services/dataValidation";

interface ValidationItem {
  id: string;
  name: string;
  type: 'customer' | 'deal' | 'opportunity' | 'transaction';
  score: number;
  isValid: boolean;
  errors: any[];
  warnings: any[];
  suggestions: string[];
  lastValidated: string;
}

export const CRMDataValidator = () => {
  const [validationItems, setValidationItems] = useState<ValidationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'valid' | 'invalid' | 'warning'>('all');
  const [activeTab, setActiveTab] = useState('customers');
  const [validationProgress, setValidationProgress] = useState(0);

  useEffect(() => {
    loadValidationData();
  }, [activeTab]);

  const loadValidationData = async () => {
    setLoading(true);
    try {
      let data = [];
      
      switch (activeTab) {
        case 'customers':
          data = await loadCustomersValidation();
          break;
        case 'deals':
          data = await loadDealsValidation();
          break;
        case 'opportunities':
          data = await loadOpportunitiesValidation();
          break;
        case 'transactions':
          data = await loadTransactionsValidation();
          break;
      }
      
      setValidationItems(data);
    } catch (error) {
      console.error('Erro ao carregar dados de validação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de validação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCustomersValidation = async (): Promise<ValidationItem[]> => {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, data_quality_score, last_validated_at, validation_errors')
      .order('data_quality_score', { ascending: true });

    if (error) throw error;

    return (data || []).map(customer => ({
      id: customer.id,
      name: customer.name,
      type: 'customer' as const,
      score: customer.data_quality_score || 0,
      isValid: (customer.data_quality_score || 0) >= 60,
      errors: Array.isArray(customer.validation_errors) ? customer.validation_errors : [],
      warnings: [],
      suggestions: [],
      lastValidated: customer.last_validated_at || ''
    }));
  };

  const loadDealsValidation = async (): Promise<ValidationItem[]> => {
    const { data, error } = await supabase
      .from('deals')
      .select('id, title, data_quality_score, last_validated_at, validation_errors')
      .order('data_quality_score', { ascending: true });

    if (error) throw error;

    return (data || []).map(deal => ({
      id: deal.id,
      name: deal.title,
      type: 'deal' as const,
      score: deal.data_quality_score || 0,
      isValid: (deal.data_quality_score || 0) >= 60,
      errors: Array.isArray(deal.validation_errors) ? deal.validation_errors : [],
      warnings: [],
      suggestions: [],
      lastValidated: deal.last_validated_at || ''
    }));
  };

  const loadOpportunitiesValidation = async (): Promise<ValidationItem[]> => {
    const { data, error } = await supabase
      .from('opportunities')
      .select('id, title, data_quality_score, last_validated_at, validation_errors')
      .order('data_quality_score', { ascending: true });

    if (error) throw error;

    return (data || []).map(opportunity => ({
      id: opportunity.id,
      name: opportunity.title,
      type: 'opportunity' as const,
      score: opportunity.data_quality_score || 0,
      isValid: (opportunity.data_quality_score || 0) >= 60,
      errors: Array.isArray(opportunity.validation_errors) ? opportunity.validation_errors : [],
      warnings: [],
      suggestions: [],
      lastValidated: opportunity.last_validated_at || ''
    }));
  };

  const loadTransactionsValidation = async (): Promise<ValidationItem[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('id, title, data_quality_score, last_validated_at, validation_errors')
      .order('data_quality_score', { ascending: true });

    if (error) throw error;

    return (data || []).map(transaction => ({
      id: transaction.id,
      name: transaction.title,
      type: 'transaction' as const,
      score: transaction.data_quality_score || 0,
      isValid: (transaction.data_quality_score || 0) >= 60,
      errors: Array.isArray(transaction.validation_errors) ? transaction.validation_errors : [],
      warnings: [],
      suggestions: [],
      lastValidated: transaction.last_validated_at || ''
    }));
  };

  const validateSelected = async () => {
    if (selectedItems.size === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos um item para validar",
      });
      return;
    }

    setLoading(true);
    setValidationProgress(0);
    
    try {
      const itemsArray = Array.from(selectedItems);
      let completed = 0;

      for (const itemId of itemsArray) {
        const item = validationItems.find(i => i.id === itemId);
        if (!item) continue;

        let validationResult: ValidationResult;
        
        switch (item.type) {
          case 'customer':
            validationResult = await dataValidationService.validateCustomer(itemId);
            break;
          case 'deal':
            validationResult = await dataValidationService.validateDeal(itemId);
            break;
          case 'transaction':
            validationResult = await dataValidationService.validateTransaction(itemId);
            break;
          default:
            continue;
        }

        // Atualizar score no banco
        const tableName = `${item.type}s` as 'customers' | 'deals' | 'opportunities' | 'transactions';
        await dataValidationService.updateDataQualityScore(
          tableName,
          itemId,
          validationResult.score,
          validationResult.errors
        );

        // Registrar log
        await dataValidationService.logValidation({
          module_name: 'crm',
          table_name: tableName,
          record_id: itemId,
          validation_type: 'manual',
          validation_status: validationResult.isValid ? 'passed' : 'failed',
          errors: validationResult.errors,
          suggestions: validationResult.suggestions
        });

        completed++;
        setValidationProgress((completed / itemsArray.length) * 100);
      }

      await loadValidationData();
      setSelectedItems(new Set());
      
      toast({
        title: "Validação concluída",
        description: `${completed} itens foram validados com sucesso`,
      });
    } catch (error) {
      console.error('Erro na validação:', error);
      toast({
        title: "Erro na validação",
        description: "Ocorreu um erro durante a validação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setValidationProgress(0);
    }
  };

  const deleteSelected = async () => {
    if (selectedItems.size === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos um item para excluir",
      });
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir ${selectedItems.size} item(s)? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setLoading(true);
    try {
      const tableName = activeTab as 'customers' | 'deals' | 'opportunities' | 'transactions';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .in('id', Array.from(selectedItems));

      if (error) throw error;

      await loadValidationData();
      setSelectedItems(new Set());
      
      toast({
        title: "Exclusão concluída",
        description: `${selectedItems.size} item(s) foram excluídos com sucesso`,
      });
    } catch (error) {
      console.error('Erro na exclusão:', error);
      toast({
        title: "Erro na exclusão",
        description: "Ocorreu um erro durante a exclusão",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const selectAllInvalid = () => {
    const invalidItems = filteredItems.filter(item => !item.isValid).map(item => item.id);
    setSelectedItems(new Set(invalidItems));
  };

  const filteredItems = validationItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'valid' && item.isValid) ||
      (filterType === 'invalid' && !item.isValid) ||
      (filterType === 'warning' && item.warnings.length > 0);

    return matchesSearch && matchesFilter;
  });

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 50) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Validador de Dados CRM</h1>
          <p className="text-muted-foreground">Valide e gerencie a qualidade dos dados do CRM</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="deals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Deals
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Oportunidades
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Transações
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Controles */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border rounded px-3 py-2"
              >
                <option value="all">Todos</option>
                <option value="valid">Válidos</option>
                <option value="invalid">Inválidos</option>
                <option value="warning">Com avisos</option>
              </select>
            </div>

            <Button onClick={selectAllInvalid} variant="outline" size="sm">
              Selecionar Inválidos
            </Button>

            <Button 
              onClick={validateSelected} 
              disabled={selectedItems.size === 0 || loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Validar Selecionados ({selectedItems.size})
            </Button>

            <Button 
              onClick={deleteSelected} 
              variant="destructive" 
              size="sm"
              disabled={selectedItems.size === 0 || loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Selecionados
            </Button>
          </div>

          {/* Progress Bar */}
          {loading && validationProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Validando itens...</span>
                <span>{Math.round(validationProgress)}%</span>
              </div>
              <Progress value={validationProgress} className="h-2" />
            </div>
          )}

          {/* Lista de Itens */}
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({filteredItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && !validationProgress ? (
                <div className="text-center py-8">Carregando dados...</div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg ${
                        !item.isValid ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedItems.has(item.id)}
                            onCheckedChange={() => toggleItemSelection(item.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{item.name}</span>
                              {item.isValid ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <Badge variant={getScoreBadge(item.score)}>
                                {item.score}%
                              </Badge>
                            </div>
                            
                            {item.errors.length > 0 && (
                              <div className="mt-2">
                                <div className="text-sm font-medium text-red-700 mb-1">Erros:</div>
                                <div className="flex flex-wrap gap-1">
                                  {item.errors.slice(0, 3).map((error, index) => (
                                    <Badge key={index} variant="destructive" className="text-xs">
                                      {typeof error === 'string' ? error : error.message || 'Erro'}
                                    </Badge>
                                  ))}
                                  {item.errors.length > 3 && (
                                    <Badge variant="destructive" className="text-xs">
                                      +{item.errors.length - 3} mais
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {item.lastValidated && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Última validação: {new Date(item.lastValidated).toLocaleString('pt-BR')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredItems.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum item encontrado com os filtros aplicados
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
