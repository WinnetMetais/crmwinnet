
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DateFilters } from "@/components/shared/DateFilters";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Users, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DateFilterType } from "@/hooks/useDateFilters";
import { useCRMData } from "@/hooks/useCRMData";

export const CRMDataValidator = () => {
  const {
    customers,
    stats,
    filters,
    customersLoading,
    isValidating,
    updateDateFilter,
    runValidation,
    refreshData
  } = useCRMData();

  const handleDateFilterChange = (filter: DateFilterType, range: { from: Date; to: Date }) => {
    console.log(`Filtro de data alterado: ${filter}`, range);
    updateDateFilter(filter, range);
  };

  const handleRunValidation = () => {
    if (customers.length === 0) {
      toast({
        title: "Nenhum cliente",
        description: "Não há clientes no período selecionado para validar",
        variant: "destructive",
      });
      return;
    }

    const customerIds = customers.map(c => c.id);
    runValidation(customerIds);
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

  if (customersLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
              <span>Clientes no período selecionado: {customers.length}</span>
              <div className="flex gap-2">
                <Button 
                  onClick={refreshData} 
                  variant="outline" 
                  disabled={isValidating}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                <Button 
                  onClick={handleRunValidation} 
                  disabled={isValidating || customers.length === 0}
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
            </div>

            {isValidating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Validação em progresso...</span>
                  <span>Processando registros</span>
                </div>
                <Progress value={100} className="h-2 animate-pulse" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes no Período ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {customers.map((customer) => (
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

                    {customer.validation_errors && customer.validation_errors.length > 0 && (
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
            
            {customers.length === 0 && (
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
