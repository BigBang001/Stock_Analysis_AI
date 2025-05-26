import { StockAnalysis, AgentResponse } from '@/types/stock';
import TickerIdentifierAgent from '@/agents/TickerIdentifierAgent';
import TickerNewsAgent from '@/agents/TickerNewsAgent';
import TickerPriceAgent from '@/agents/TickerPriceAgent';
import TickerPriceChangeAgent from '@/agents/TickerPriceChangeAgent';
import TickerAnalysisAgent from '@/agents/TickerAnalysisAgent';

class AgentOrchestrator {
  private tickerAgent: TickerIdentifierAgent;
  private newsAgent: TickerNewsAgent;
  private priceAgent: TickerPriceAgent;
  private priceChangeAgent: TickerPriceChangeAgent;
  private analysisAgent: TickerAnalysisAgent;

  constructor() {
    this.tickerAgent = new TickerIdentifierAgent();
    this.newsAgent = new TickerNewsAgent();
    this.priceAgent = new TickerPriceAgent();
    this.priceChangeAgent = new TickerPriceChangeAgent();
    this.analysisAgent = new TickerAnalysisAgent();
  }

  async analyzeStock(query: string): Promise<StockAnalysis> {
    console.log('🎯 Starting stock analysis for query:', query);
    
    try {
      // Step 1: Identify ticker symbol
      console.log('🔍 Agent 1: Identifying ticker...');
      const tickerResponse = await this.tickerAgent.execute(query);
      
      if (!tickerResponse.success || !tickerResponse.data) {
        throw new Error('Failed to identify stock ticker');
      }
      
      const { ticker, companyName } = tickerResponse.data;
      console.log(`✅ Identified ticker: ${ticker} (${companyName})`);

      // Step 2: Run agents in parallel for efficiency
      console.log('🚀 Executing parallel agents...');
      const [newsResponse, priceResponse, priceChangeResponse] = await Promise.allSettled([
        this.newsAgent.execute(ticker),
        this.priceAgent.execute(ticker),
        this.priceChangeAgent.execute(ticker)
      ]);

      // Extract results
      const news = newsResponse.status === 'fulfilled' && newsResponse.value.success 
        ? newsResponse.value.data : [];
      
      const currentPrice = priceResponse.status === 'fulfilled' && priceResponse.value.success 
        ? priceResponse.value.data : undefined;
      
      const priceChange = priceChangeResponse.status === 'fulfilled' && priceChangeResponse.value.success 
        ? priceChangeResponse.value.data : undefined;

      console.log(`📰 Found ${news.length} news articles`);
      console.log('💰 Current price:', currentPrice);
      console.log('📈 Price change:', priceChange);

      // Step 3: Generate comprehensive analysis
      console.log('🧠 Agent 5: Generating analysis...');
      const analysisResponse = await this.analysisAgent.execute({
        query,
        ticker,
        companyName,
        news,
        currentPrice,
        priceChange
      });

      const analysis: StockAnalysis = {
        query,
        ticker,
        companyName,
        currentPrice,
        priceChange,
        news,
        analysis: analysisResponse.success ? analysisResponse.data.analysis : 'Analysis unavailable',
        sentiment: analysisResponse.success ? analysisResponse.data.sentiment : 'neutral',
        confidence: analysisResponse.success ? analysisResponse.data.confidence : 0.5,
        timestamp: new Date().toISOString()
      };

      console.log('✅ Analysis complete!');
      return analysis;

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      throw error;
    }
  }
}

export default AgentOrchestrator;
