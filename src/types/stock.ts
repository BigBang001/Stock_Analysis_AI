export interface StockPrice {
  symbol: string;
  price: number;
  currency: string;
  timestamp: string;
}

export interface StockNews {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface PriceChange {
  symbol: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  timeframe: string;
}

export interface StockAnalysis {
  query: string;
  ticker: string;
  companyName?: string;
  currentPrice?: StockPrice;
  priceChange?: PriceChange;
  news: StockNews[];
  analysis: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timestamp: string;
}

export interface AgentResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  agentName: string;
  executionTime: number;
}
