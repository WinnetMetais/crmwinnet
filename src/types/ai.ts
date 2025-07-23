// Types for AI dashboard and services
export interface AIMetrics {
  totalRequests: number;
  tokensUsed: number;
  tokensRemaining: number;
  activeModels: number;
  costSavings: number;
  errorRate: number;
  avgResponseTime: number;
  topUsedProvider: string;
  lastUpdate: Date;
}

export interface RealTimeAIInsight {
  id: string;
  type: 'sales' | 'marketing' | 'financial' | 'crm';
  title: string;
  description: string;
  status: 'active' | 'completed' | 'warning' | 'error';
  confidence: number;
  createdAt: Date;
  actionItems: string[];
  icon?: React.ComponentType<{ className?: string }>;
}

export interface AIProvider {
  name: string;
  apiKey?: string;
  freeTokens: number;
  usedTokens: number;
  models: string[];
  status: 'connected' | 'disconnected' | 'error';
  endpoint: string;
}

export interface AIUsageStats {
  provider: string;
  model: string;
  requests: number;
  tokens: number;
  cost: number;
  date: string;
}

export interface AIError {
  id: string;
  provider: string;
  error: string;
  timestamp: Date;
  resolved: boolean;
}