
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, Database, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { winnetFinancialImporter } from "@/services/winnetFinancialImporter";

export const WinnetDataImporter = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: number;
    total: number;
  } | null>(null);
  const [summary, setSummary] = useState<Record<string, any> | null>(null);

  const handleImportWinnetData = async () => {
    setIsImporting(true);
    setImportResults(null);
    setSummary(null);

    try {
      const results = await winnetFinancialImporter.importWinnetData();
      setImportResults(results);

      // Gerar resumo após importação
      const importSummary = await winnetFinancialImporter.generateImportSummary();
      setSummary(importSummary);

      toast({
        title: "Importação concluída",
        description: `${results.success} transações importadas com sucesso da planilha Winnet Metais.`,
      });
    } catch (error) {
      console.error('Erro na importação:', error);
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar os dados da Winnet Metais. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Importação Dados Winnet Metais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Esta funcionalidade importa os dados financeiros completos da planilha da Winnet Metais
              diretamente para o CRM. Os dados incluem receitas de todos os canais (Site, Mercado Livre, 
              Madeira Madeira, Via, Comercial) e todas as despesas operacionais e administrativas.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Button 
              onClick={handleImportWinnetData} 
              disabled={isImporting}
              className="w-full"
              size="lg"
            >
              {isImporting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Importando dados da Winnet...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Importar Dados Completos da Winnet Metais
                </div>
              )}
            </Button>

            {isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processando transações financeiras...</span>
                  <span>Aguarde</span>
                </div>
                <Progress value={undefined} className="h-2" />
              </div>
            )}
          </div>

          {importResults && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Resultado da Importação
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total de registros processados:</span>
                    <span className="font-medium">{importResults.total}</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Importados com sucesso:</span>
                    <span className="font-medium">{importResults.success}</span>
                  </div>
                  <div className="flex justify-between text-red-700">
                    <span>Erros/Duplicatas ignoradas:</span>
                    <span className="font-medium">{importResults.errors}</span>
                  </div>
                </div>
              </div>

              {summary && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Resumo Financeiro Importado
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-2">Valores:</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Total Receitas:</span>
                          <span className="font-medium text-green-600">
                            R$ {summary.total_receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Despesas:</span>
                          <span className="font-medium text-red-600">
                            R$ {summary.total_despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span className="font-medium">Saldo:</span>
                          <span className={`font-medium ${summary.total_receitas - summary.total_despesas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            R$ {(summary.total_receitas - summary.total_despesas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Canais:</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Site:</span>
                          <span className="font-medium">{summary.channels.site} transações</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mercado Livre:</span>
                          <span className="font-medium">{summary.channels.mercadoLivre} transações</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Madeira Madeira:</span>
                          <span className="font-medium">{summary.channels.madeiraMadeira} transações</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Via:</span>
                          <span className="font-medium">{summary.channels.via} transações</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Comercial:</span>
                          <span className="font-medium">{summary.channels.comercial} transações</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
