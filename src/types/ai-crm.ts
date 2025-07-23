import type { Customer } from '@/types/crm';

export interface ProductRecommendation {
  id: string;
  name: string;
  relevanceScore: number;
  reasoning: string;
}

export interface ChurnAnalysis {
  predictions: ChurnPrediction[];
  summary: {
    highRiskCount: number;
    mediumRiskCount: number;
    topFactors: string[];
    totalAnalyzed: number;
  };
}

export interface ChurnPrediction {
  customerId: string;
  customerName: string;
  churnProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  preventionActions: string[];
  timeframe: string;
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  score: number; // 0-100
  emotions: string[];
  summary: string;
  recommendations: string[];
  trend?: 'improving' | 'declining' | 'stable';
}