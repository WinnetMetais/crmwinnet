
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Lightbulb, ExternalLink } from "lucide-react";

interface ValidationError {
  id: string;
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
  autoFix?: () => Promise<void>;
}

interface ValidationErrorDisplayProps {
  errors: ValidationError[];
  onFixError?: (errorId: string) => Promise<void>;
  moduleType: 'financial' | 'commercial';
}

export const ValidationErrorDisplay = ({ 
  errors, 
  onFixError, 
  moduleType 
}: ValidationErrorDisplayProps) => {
  const errorsByItem = errors.reduce((acc, error) => {
    if (!acc[error.id]) {
      acc[error.id] = [];
    }
    acc[error.id].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);

  const getErrorIcon = (severity: ValidationError['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getErrorColor = (severity: ValidationError['severity']) => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'secondary';
    }
  };

  const getSuggestionForError = (error: ValidationError): string => {
    if (error.suggestion) {
      return error.suggestion;
    }

    // Sugestões baseadas no tipo de erro e módulo
    const suggestions: Record<string, Record<string, string>> = {
      financial: {
        'valor_invalido': 'Verifique se o valor é um número positivo maior que zero.',
        'data_invalida': 'Use o formato DD/MM/AAAA ou AAAA-MM-DD para datas.',
        'categoria_vazia': 'Defina uma categoria válida como "Receita" ou "Despesa Operacional".',
        'descricao_curta': 'Adicione uma descrição mais detalhada (mínimo 3 caracteres).',
        'tipo_invalido': 'Defina o tipo como "receita" ou "despesa".',
        'dados_teste': 'Remova dados de teste que contenham palavras como "teste", "exemplo", etc.',
        'valor_muito_alto': 'Verifique se valores acima de R$ 500.000 estão corretos.'
      },
      commercial: {
        'nome_vazio': 'Adicione o nome completo do cliente.',
        'email_invalido': 'Verifique se o email está no formato correto (exemplo@dominio.com).',
        'telefone_invalido': 'Use o formato (XX) XXXXX-XXXX para telefones.',
        'cnpj_invalido': 'Verifique se o CNPJ está no formato XX.XXX.XXX/XXXX-XX.',
        'valor_estimado_zero': 'Defina um valor estimado para a oportunidade.',
        'probabilidade_invalida': 'A probabilidade deve estar entre 0 e 100%.',
        'estagio_invalido': 'Use estágios válidos como "lead", "qualificacao", "proposta", etc.',
        'dados_incompletos': 'Preencha pelo menos nome/empresa, contato e telefone/email.'
      }
    };

    const moduleSpecific = suggestions[moduleType];
    return moduleSpecific?.[error.field] || 'Revise este campo e corrija conforme necessário.';
  };

  const getQuickFixes = (error: ValidationError) => {
    const quickFixes: Record<string, string[]> = {
      'valor_invalido': ['Substituir por 0.00', 'Converter texto em número'],
      'data_invalida': ['Usar data atual', 'Converter para formato padrão'],
      'categoria_vazia': ['Definir como "Sem Categoria"', 'Usar categoria mais comum'],
      'email_invalido': ['Remover caracteres especiais', 'Validar formato'],
      'telefone_invalido': ['Aplicar máscara padrão', 'Remover caracteres especiais'],
      'dados_teste': ['Marcar para exclusão', 'Substituir por dados reais']
    };

    return quickFixes[error.field] || ['Corrigir manualmente'];
  };

  if (errors.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-green-600">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">Todos os dados estão válidos!</p>
            <p className="text-sm text-muted-foreground">
              Nenhum erro foi encontrado na validação {moduleType === 'financial' ? 'financeira' : 'comercial'}.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Relatório de Validação - {moduleType === 'financial' ? 'Financeiro' : 'Comercial'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Encontrados {errors.length} problema(s) em {Object.keys(errorsByItem).length} registro(s). 
              Revise e corrija os itens abaixo para melhorar a qualidade dos dados.
            </AlertDescription>
          </Alert>

          <div className="mt-6 space-y-4">
            {Object.entries(errorsByItem).map(([itemId, itemErrors]) => (
              <Card key={itemId} className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Registro ID: {itemId}</h4>
                    <Badge variant="destructive">
                      {itemErrors.length} problema(s)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {itemErrors.map((error, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start gap-2">
                        {getErrorIcon(error.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{error.field}:</span>
                            <Badge variant={getErrorColor(error.severity)}>
                              {error.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {error.message}
                          </p>
                        </div>
                      </div>

                      {/* Sugestão de correção */}
                      <div className="ml-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-800">Sugestão:</p>
                            <p className="text-sm text-blue-700">
                              {getSuggestionForError(error)}
                            </p>
                          </div>
                        </div>

                        {/* Correções rápidas */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {getQuickFixes(error).map((fix, fixIndex) => (
                            <Button
                              key={fixIndex}
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => onFixError?.(error.id)}
                            >
                              {fix}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Ação de correção automática */}
                  {onFixError && (
                    <div className="flex justify-end pt-2">
                      <Button
                        size="sm"
                        onClick={() => onFixError(itemId)}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Corrigir Item
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumo de ações recomendadas */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Ações Recomendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>1. Correção em Massa:</strong> Use a funcionalidade de atualização em massa para corrigir vários registros simultaneamente.
                </p>
                <p className="text-sm">
                  <strong>2. Validação de Dados:</strong> Implemente validações automáticas durante a importação de planilhas.
                </p>
                <p className="text-sm">
                  <strong>3. Limpeza Regular:</strong> Execute validações periódicas para manter a qualidade dos dados.
                </p>
                <p className="text-sm">
                  <strong>4. Treinamento:</strong> Oriente a equipe sobre os formatos corretos de dados.
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
