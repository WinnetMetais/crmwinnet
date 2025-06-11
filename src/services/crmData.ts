
import { CRMCustomersService } from "./crmCustomers";
import { DataQualityService } from "./dataQuality";
import { QualityMetricsService } from "./qualityMetrics";
import { ValidationLogsService } from "./validationLogs";
import { ValidationResult, QualityMetrics, DataValidationLog, CRMFilters } from "@/types/crm";

export class CRMDataService {
  // Carregar clientes com filtros aplicados
  static async getCustomersWithFilters(filters: CRMFilters): Promise<ValidationResult[]> {
    return CRMCustomersService.getCustomersWithFilters(filters);
  }

  // Executar validação de qualidade dos dados
  static async runDataValidation(customerIds?: string[]): Promise<void> {
    return DataQualityService.runDataValidation(customerIds);
  }

  // Obter métricas de qualidade por módulo
  static async getQualityMetrics(): Promise<{ [module: string]: QualityMetrics }> {
    return QualityMetricsService.getQualityMetrics();
  }

  // Obter logs de validação recentes
  static async getRecentValidationLogs(limit = 20): Promise<DataValidationLog[]> {
    return ValidationLogsService.getRecentValidationLogs(limit);
  }
}
