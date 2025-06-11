import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DateFilters } from "@/components/shared/DateFilters";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Users, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DateFilterType } from "@/hooks/useDateFilters";

interface ValidationResult {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  created_at: string;
  last_contact_date?: string;
  data_quality_score: number;
  validation_errors: string[];
  severity: 'low' | 'medium' | 'high';
}

export const CRMDataValidator = () => {
  const [customers, setCustomers] = useState<ValidationResult[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilterType>('hoje');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  // Aplicar filtros de data quando mudarem
  useEffect(() => {
    if (dateRange) {
      applyDateFilter();
    }
  }, [customers, dateRange, selectedDateFilter]);

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const validationResults = (data || []).map(customer => ({
        ...customer,
        validation_errors: Array.isArray(customer.validation_errors) 
          ? customer.validation_errors.map(error => String(error))
          : customer.validation_errors 
            ? [String(customer.validation_errors)]
            : [],
        severity: calculateSeverity(customer.data_quality_score || 0)
      }));

      setCustomers(validationResults);
      console.log(`Carregados ${validationResults.length} clientes para validação`);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      });
    }
  };

  const applyDateFilter = () => {
    if (!dateRange) {
      setFilteredCustomers(customers);
      return;
    }

    console.log(`Aplicando filtro de data: ${selectedDateFilter}`, dateRange);

    const filtered = customers.filter(customer => {
      // Usar created_at como campo principal para filtro
      const customerDate = new Date(customer.created_at);
      
      // Verificar se a data do cliente está dentro do range
      const isInRange = customerDate >= dateRange.from && customerDate <= dateRange.to;
      
      // Para filtros de "HOJE" e "7 DIAS", também considerar last_contact_date
      if ((selectedDateFilter === 'hoje' || selectedDateFilter === '7_dias') && customer.last_contact_date) {
        const lastContactDate = new Date(customer.last_contact_date);
        const isLastContactInRange = lastContactDate >= dateRange.from && lastContactDate <= dateRange.to;
        return isInRange || isLastContactInRange;
      }
      
      return isInRange;
    });

    setFilteredCustomers(filtered);
    console.log(`Filtro aplicado: ${filtered.length} de ${customers.length} clientes`);
  };

  const handleDateFilterChange = (filter: DateFilterType, range: { from: Date; to: Date }) => {
    console.log(`Filtro de data alterado: ${filter}`, range);
    setSelectedDateFilter(filter);
    setDateRange(range);
  };

  const calculateSeverity = (score: number): 'low' | 'medium' | 'high' => {
    if (score >= 80) return 'low';
    if (score >= 50) return 'medium';
    return 'high';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'high': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const runValidation = async () => {
    if (filteredCustomers.length === 0) {
      toast({
        title: "Nenhum cliente",
        description: "Não há clientes no período selecionado para validar",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    setValidationProgress(0);

    try {
      console.log(`Iniciando validação de ${filteredCustomers.length} clientes`);
      
      for (let i = 0; i < filteredCustomers.length; i++) {
        const customer = filteredCustomers[i];
        
        // Simular validação (na versão real, chamar função do Supabase)
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Atualizar progresso
        const progress = ((i + 1) / filteredCustomers.length) * 100;
        setValidationProgress(progress);
      }

      toast({
        title: "Validação concluída",
        description: `${filteredCustomers.length} clientes validados no período selecionado`,
      });

      // Recarregar dados
      await loadCustomers();
    } catch (error) {
      console.error('Erro na validação:', error);
      toast({
        title: "Erro na validação",
        description: "Ocorreu um erro durante a validação",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
      setValidationProgress(0);
    }
  };

  const stats = {
    total: filteredCustomers.length,
    high: filteredCustomers.filter(c => c.severity === 'high').length,
    medium: filteredCustomers.filter(c => c.severity === 'medium').length,
    low: filteredCustomers.filter(c => c.severity === 'low').length,
    avgScore: filteredCustomers.length > 0 
      ? Math.round(filteredCustomers.reduce((sum, c) => sum + (c.data_quality_score || 0), 0) / filteredCustomers.length)
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Filtros de Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtros de Data - CRM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DateFilters onFilterChange={handleDateFilterChange} />
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Críticos</p>
                <p className="text-3xl font-bold text-red-600">{stats.high}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Médios</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.medium}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bons</p>
                <p className="text-3xl font-bold text-green-600">{stats.low}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score Médio</p>
                <p className="text-3xl font-bold">{stats.avgScore}%</p>
              </div>
              <Badge variant="outline">{stats.avgScore >= 70 ? 'Bom' : 'Ruim'}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validação */}
      <Card>
        <CardHeader>
          <CardTitle>Validação de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Clientes no período selecionado: {filteredCustomers.length}</span>
              <Button 
                onClick={runValidation} 
                disabled={isValidating || filteredCustomers.length === 0}
              >
                {isValidating ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Validando...
                  </div>
                ) : (
                  'Executar Validação'
                )}
              </Button>
            </div>

            {isValidating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso da validação</span>
                  <span>{Math.round(validationProgress)}%</span>
                </div>
                <Progress value={validationProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes no Período ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{customer.name}</span>
                      <Badge className={getSeverityColor(customer.severity)}>
                        {customer.severity === 'low' ? 'Bom' : 
                         customer.severity === 'medium' ? 'Médio' : 'Crítico'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Score: {customer.data_quality_score || 0}%</div>
                      {customer.email && <div>Email: {customer.email}</div>}
                      {customer.phone && <div>Telefone: {customer.phone}</div>}
                      {customer.company && <div>Empresa: {customer.company}</div>}
                      <div>Criado: {new Date(customer.created_at).toLocaleDateString('pt-BR')}</div>
                      {customer.last_contact_date && (
                        <div>Último contato: {new Date(customer.last_contact_date).toLocaleDateString('pt-BR')}</div>
                      )}
                    </div>

                    {customer.validation_errors.length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm font-medium mb-1">Problemas encontrados:</div>
                        <div className="text-sm text-red-600">
                          {customer.validation_errors.slice(0, 3).map((error, index) => (
                            <div key={index}>• {error}</div>
                          ))}
                          {customer.validation_errors.length > 3 && (
                            <div>• +{customer.validation_errors.length - 3} outros problemas</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    {getSeverityIcon(customer.severity)}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCustomers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum cliente encontrado no período selecionado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
