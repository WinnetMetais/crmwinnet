
import { CRMCustomersService } from "./crmCustomers";
import { DataQualityService } from "./dataQuality";
import { QualityMetricsService } from "./qualityMetrics";
import { ValidationLogsService } from "./validationLogs";
import { ValidationResult, QualityMetrics, DataValidationLog, CRMFilters } from "@/types/crm";

export class CRMDataService {
  // Carregar clientes com filtros aplicados
  static async getCustomersWithFilters(filters: CRMFilters): Promise<ValidationResult[]> {
    try {
      return await CRMCustomersService.getCustomersWithFilters(filters);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      return [];
    }
  }

  // Executar validação de qualidade dos dados
  static async runDataValidation(customerIds?: string[]): Promise<void> {
    try {
      return await DataQualityService.runDataValidation(customerIds);
    } catch (error) {
      console.error('Erro na validação:', error);
      throw error;
    }
  }

  // Obter métricas de qualidade por módulo
  static async getQualityMetrics(): Promise<{ [module: string]: QualityMetrics }> {
    try {
      return await QualityMetricsService.getQualityMetrics();
    } catch (error) {
      console.error('Erro ao obter métricas:', error);
      return {};
    }
  }

  // Obter logs de validação recentes
  static async getRecentValidationLogs(limit = 20): Promise<DataValidationLog[]> {
    try {
      return await ValidationLogsService.getRecentValidationLogs(limit);
    } catch (error) {
      console.error('Erro ao obter logs:', error);
      return [];
    }
  }
}
