import { AgentResponse, StockNews, StockPrice, PriceChange } from '@/types/stock';

interface AnalysisInput {
  query: string;
  ticker: string;
  companyName?: string;
  news: StockNews[];
  currentPrice?: StockPrice;
  priceChange?: PriceChange;
}

interface AnalysisOutput {
  analysis: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
}

class TickerAnalysisAgent {
  async execute(input: AnalysisInput): Promise<AgentResponse<AnalysisOutput>> {
    const startTime = Date.now();
    
    try {
      console.log('🧠 TickerAnalysisAgent: Generating analysis for', input.ticker);
      
      const { ticker, companyName, news, currentPrice, priceChange } = input;
      
      // Analyze sentiment from news
      const newsSentiment = this.analyzeNewsSentiment(news);
      
      // Analyze price movement
      const priceSentiment = this.analyzePriceMovement(priceChange);
      
      // Generate comprehensive analysis
      const analysis = this.generateAnalysis(ticker, companyName, news, currentPrice, priceChange, newsSentiment, priceSentiment);
      
      // Determine overall sentiment
      const overallSentiment = this.determineOverallSentiment(newsSentiment, priceSentiment);
      
      // Calculate confidence based on data availability and consistency
      const confidence = this.calculateConfidence(news, currentPrice, priceChange, newsSentiment, priceSentiment);
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      console.log(`✅ Analysis complete for ${ticker} - Sentiment: ${overallSentiment}`);
      
      return {
        success: true,
        data: {
          analysis,
          sentiment: overallSentiment,
          confidence
        },
        agentName: 'TickerAnalysisAgent',
        executionTime: Date.now() - startTime
      };
      
    } catch (error) {
      console.error('❌ TickerAnalysisAgent failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
        agentName: 'TickerAnalysisAgent',
        executionTime: Date.now() - startTime
      };
    }
  }
  
  private analyzeNewsSentiment(news: StockNews[]): number {
    if (news.length === 0) return 0;
    
    const sentimentScores = news.map(article => {
      switch (article.sentiment) {
        case 'positive': return 1;
        case 'negative': return -1;
        default: return 0;
      }
    });
    
    return sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
  }
  
  private analyzePriceMovement(priceChange?: PriceChange): number {
    if (!priceChange) return 0;
    
    // Normalize price change percentage to -1 to 1 scale
    return Math.max(-1, Math.min(1, priceChange.changePercent / 10));
  }
  
  private generateAnalysis(
    ticker: string,
    companyName?: string,
    news: StockNews[] = [],
    currentPrice?: StockPrice,
    priceChange?: PriceChange,
    newsSentiment: number = 0,
    priceSentiment: number = 0
  ): string {
    const company = companyName || ticker;
    let analysis = `Analysis for ${company} (${ticker}):\n\n`;
    
    // Price analysis
    if (currentPrice && priceChange) {
      const direction = priceChange.change >= 0 ? 'increased' : 'decreased';
      const magnitude = Math.abs(priceChange.changePercent) > 5 ? 'significantly' : 'moderately';
      
      analysis += `📊 Current Price: $${currentPrice.price}\n`;
      analysis += `📈 The stock has ${magnitude} ${direction} by ${Math.abs(priceChange.changePercent).toFixed(2)}% `;
      analysis += `(${priceChange.change >= 0 ? '+' : ''}$${priceChange.change.toFixed(2)}) in the last trading period.\n\n`;
    }
    
    // News analysis
    if (news.length > 0) {
      analysis += `📰 Recent News Impact:\n`;
      
      const positiveNews = news.filter(n => n.sentiment === 'positive').length;
      const negativeNews = news.filter(n => n.sentiment === 'negative').length;
      const neutralNews = news.filter(n => n.sentiment === 'neutral').length;
      
      if (positiveNews > 0) {
        analysis += `• ${positiveNews} positive news item(s) supporting bullish sentiment\n`;
      }
      if (negativeNews > 0) {
        analysis += `• ${negativeNews} negative news item(s) creating bearish pressure\n`;
      }
      if (neutralNews > 0) {
        analysis += `• ${neutralNews} neutral news item(s) providing market context\n`;
      }
      
      analysis += '\n';
    }
    
    // Sentiment analysis
    if (newsSentiment > 0.3) {
      analysis += `🟢 News sentiment is predominantly positive, suggesting investor optimism.\n`;
    } else if (newsSentiment < -0.3) {
      analysis += `🔴 News sentiment is predominantly negative, indicating investor concerns.\n`;
    } else {
      analysis += `🟡 News sentiment is balanced, showing mixed market opinions.\n`;
    }
    
    // Price momentum analysis
    if (priceSentiment > 0.1) {
      analysis += `🚀 Price momentum is positive, indicating upward market pressure.\n`;
    } else if (priceSentiment < -0.1) {
      analysis += `📉 Price momentum is negative, showing downward market pressure.\n`;
    } else {
      analysis += `⚖️ Price momentum is neutral, suggesting market equilibrium.\n`;
    }
    
    // Key insights
    analysis += `\n🔍 Key Insights:\n`;
    
    if (Math.abs(priceSentiment) > 0.2 && Math.sign(priceSentiment) === Math.sign(newsSentiment)) {
      analysis += `• Price movement aligns with news sentiment, reinforcing the current trend.\n`;
    } else if (Math.abs(priceSentiment) > 0.2 && Math.sign(priceSentiment) !== Math.sign(newsSentiment)) {
      analysis += `• Price movement diverges from news sentiment, suggesting potential market inefficiency.\n`;
    }
    
    if (news.length > 0) {
      const latestNews = news[0];
      analysis += `• Most recent development: "${latestNews.title}"\n`;
    }
    
    return analysis;
  }
  
  private determineOverallSentiment(newsSentiment: number, priceSentiment: number): 'bullish' | 'bearish' | 'neutral' {
    const combinedSentiment = (newsSentiment + priceSentiment) / 2;
    
    if (combinedSentiment > 0.2) return 'bullish';
    if (combinedSentiment < -0.2) return 'bearish';
    return 'neutral';
  }
  
  private calculateConfidence(
    news: StockNews[],
    currentPrice?: StockPrice,
    priceChange?: PriceChange,
    newsSentiment: number = 0,
    priceSentiment: number = 0
  ): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on data availability
    if (currentPrice) confidence += 0.1;
    if (priceChange) confidence += 0.1;
    if (news.length > 0) confidence += 0.1;
    if (news.length >= 3) confidence += 0.1;
    
    // Increase confidence when news and price sentiment align
    if (Math.sign(newsSentiment) === Math.sign(priceSentiment) && Math.abs(newsSentiment) > 0.1) {
      confidence += 0.1;
    }
    
    // Increase confidence with stronger signals
    confidence += Math.abs(newsSentiment) * 0.1;
    confidence += Math.abs(priceSentiment) * 0.1;
    
    return Math.min(0.95, Math.max(0.1, confidence));
  }
}

export default TickerAnalysisAgent;
