import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Shield,
  FileX,
  TrendingUp,
  Users,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ValidationResult {
  table: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  issues: string[];
}

interface ValidationErrorDisplayProps {
  errors?: any[];
  onFixError?: (errorId: string) => Promise<void>;
  moduleType?: string;
}

export const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({ 
  errors = [], 
  onFixError, 
  moduleType 
}) => {
  const { user } = useAuth();
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [lastValidation, setLastValidation] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('last_validation');
    if (saved) {
      setLastValidation(saved);
    }
  }, []);

  const validateCustomers = async (): Promise<ValidationResult> => {
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .limit(1000);

    if (error) throw error;

    const issues: string[] = [];
    let validCount = 0;

    customers?.forEach(customer => {
      const validation = validateCustomerRecord(customer);
      if (validation.isValid) {
        validCount++;
      } else {
        issues.push(...validation.issues.map(issue => `Cliente ${customer.name}: ${issue}`));
      }
    });

    return {
      table: 'Clientes',
      totalRecords: customers?.length || 0,
      validRecords: validCount,
      invalidRecords: (customers?.length || 0) - validCount,
      issues: issues.slice(0, 10) // Limitar a 10 problemas mais críticos
    };
  };

  const validateOpportunities = async (): Promise<ValidationResult> => {
    const { data: opportunities, error } = await supabase
      .from('opportunities')
      .select('*')
      .limit(1000);

    if (error) throw error;

    const issues: string[] = [];
    let validCount = 0;

    opportunities?.forEach(opportunity => {
      const validation = validateOpportunityRecord(opportunity);
      if (validation.isValid) {
        validCount++;
      } else {
        issues.push(...validation.issues.map(issue => `Oportunidade ${opportunity.title}: ${issue}`));
      }
    });

    return {
      table: 'Oportunidades',
      totalRecords: opportunities?.length || 0,
      validRecords: validCount,
      invalidRecords: (opportunities?.length || 0) - validCount,
      issues: issues.slice(0, 10)
    };
  };

  const validateTransactions = async (): Promise<ValidationResult> => {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .limit(1000);

    if (error) throw error;

    const issues: string[] = [];
    let validCount = 0;

    transactions?.forEach(transaction => {
      const validation = validateTransactionRecord(transaction);
      if (validation.isValid) {
        validCount++;
      } else {
        issues.push(...validation.issues.map(issue => `Transação ${transaction.title}: ${issue}`));
      }
    });

    return {
      table: 'Transações',
      totalRecords: transactions?.length || 0,
      validRecords: validCount,
      invalidRecords: (transactions?.length || 0) - validCount,
      issues: issues.slice(0, 10)
    };
  };

  const validateCustomerRecord = (customer: any) => {
    const issues: string[] = [];

    if (!customer.name || customer.name.length < 2) {
      issues.push('Nome muito curto ou ausente');
    }

    if (customer.email && !isValidEmail(customer.email)) {
      issues.push('Email inválido');
    }

    if (customer.cnpj && !isValidCNPJ(customer.cnpj)) {
      issues.push('CNPJ com formato inválido');
    }

    if (customer.phone && customer.phone.length < 10) {
      issues.push('Telefone muito curto');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  };

  const validateOpportunityRecord = (opportunity: any) => {
    const issues: string[] = [];

    if (!opportunity.title || opportunity.title.length < 3) {
      issues.push('Título muito curto');
    }

    if (!opportunity.customer_id) {
      issues.push('Cliente não associado');
    }

    if (opportunity.value && opportunity.value <= 0) {
      issues.push('Valor inválido');
    }

    if (opportunity.probability < 0 || opportunity.probability > 100) {
      issues.push('Probabilidade inválida');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  };

  const validateTransactionRecord = (transaction: any) => {
    const issues: string[] = [];

    if (!transaction.title || transaction.title.length < 3) {
      issues.push('Descrição muito curta');
    }

    if (!transaction.amount || transaction.amount <= 0) {
      issues.push('Valor inválido');
    }

    if (!transaction.category) {
      issues.push('Categoria não definida');
    }

    if (!transaction.type || !['receita', 'despesa'].includes(transaction.type)) {
      issues.push('Tipo inválido');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidCNPJ = (cnpj: string) => {
    return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj);
  };

  const runValidation = async () => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsValidating(true);
    const toastId = toast.loading('Validando qualidade dos dados...');

    try {
      const [customerValidation, opportunityValidation, transactionValidation] = await Promise.all([
        validateCustomers(),
        validateOpportunities(),
        validateTransactions()
      ]);

      const results = [customerValidation, opportunityValidation, transactionValidation];
      setValidationResults(results);

      const now = new Date().toLocaleString('pt-BR');
      setLastValidation(now);
      localStorage.setItem('last_validation', now);

      // Log resultados no banco
      await supabase.from('data_validation_logs').insert({
        module_name: 'general',
        table_name: 'all',
        validation_type: 'quality_check',
        validation_status: 'completed',
        errors: results.flatMap(r => r.issues).slice(0, 20) as any,
        suggestions: ['Revisar registros com dados incompletos', 'Atualizar informações de contato'] as any,
        validated_by: user.email || 'sistema'
      });

      toast.success('Validação concluída com sucesso!', { id: toastId });
    } catch (error: any) {
      toast.error(`Erro na validação: ${error.message}`, { id: toastId });
    } finally {
      setIsValidating(false);
    }
  };

  const getOverallQuality = () => {
    if (validationResults.length === 0) return 0;
    
    const totalRecords = validationResults.reduce((acc, result) => acc + result.totalRecords, 0);
    const totalValid = validationResults.reduce((acc, result) => acc + result.validRecords, 0);
    
    return totalRecords > 0 ? Math.round((totalValid / totalRecords) * 100) : 0;
  };

  const overallQuality = getOverallQuality();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Validação de Qualidade dos Dados
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monitore e valide a qualidade dos seus dados
              </p>
            </div>
            <Button 
              onClick={runValidation} 
              disabled={isValidating}
              variant="outline"
            >
              {isValidating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              {isValidating ? 'Validando...' : 'Executar Validação'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lastValidation && (
            <p className="text-xs text-muted-foreground mb-4">
              Última validação: {lastValidation}
            </p>
          )}

          {validationResults.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Qualidade Geral dos Dados</span>
                    <span className="text-sm font-bold">{overallQuality}%</span>
                  </div>
                  <Progress 
                    value={overallQuality} 
                    className={`h-2 ${overallQuality >= 80 ? 'text-green-600' : overallQuality >= 60 ? 'text-yellow-600' : 'text-red-600'}`} 
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold">
                      {validationResults.reduce((acc, r) => acc + r.totalRecords, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Válidos</p>
                    <p className="text-lg font-bold text-green-600">
                      {validationResults.reduce((acc, r) => acc + r.validRecords, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Problemas</p>
                    <p className="text-lg font-bold text-red-600">
                      {validationResults.reduce((acc, r) => acc + r.invalidRecords, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {validationResults.map((result, index) => {
        const qualityPercentage = result.totalRecords > 0 
          ? Math.round((result.validRecords / result.totalRecords) * 100) 
          : 0;

        const getIcon = () => {
          switch (result.table) {
            case 'Clientes': return Users;
            case 'Oportunidades': return TrendingUp;
            case 'Transações': return DollarSign;
            default: return FileX;
          }
        };

        const Icon = getIcon();

        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <CardTitle className="text-base">{result.table}</CardTitle>
                </div>
                <Badge 
                  variant={qualityPercentage >= 80 ? "default" : qualityPercentage >= 60 ? "secondary" : "destructive"}
                  className={
                    qualityPercentage >= 80 
                      ? "bg-green-100 text-green-800" 
                      : qualityPercentage >= 60 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-red-100 text-red-800"
                  }
                >
                  {qualityPercentage >= 80 ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 mr-1" />
                  )}
                  {qualityPercentage}% qualidade
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <p className="font-medium">{result.totalRecords}</p>
                    <p className="text-muted-foreground">Total</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-600">{result.validRecords}</p>
                    <p className="text-muted-foreground">Válidos</p>
                  </div>
                  <div>
                    <p className="font-medium text-red-600">{result.invalidRecords}</p>
                    <p className="text-muted-foreground">Problemas</p>
                  </div>
                </div>

                {result.issues.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">Principais problemas encontrados:</p>
                        <ul className="text-xs space-y-1 mt-2">
                          {result.issues.slice(0, 5).map((issue, i) => (
                            <li key={i}>• {issue}</li>
                          ))}
                          {result.issues.length > 5 && (
                            <li className="text-muted-foreground">
                              ...e mais {result.issues.length - 5} problemas
                            </li>
                          )}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};