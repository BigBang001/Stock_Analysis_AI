import { AgentResponse, StockNews } from '@/types/stock';

class TickerNewsAgent {
  private readonly API_KEY = 'demo'; // Users should replace with their Alpha Vantage API key
  private readonly BASE_URL = 'https://www.alphavantage.co/query';
  
  async execute(ticker: string): Promise<AgentResponse<StockNews[]>> {
    const startTime = Date.now();
    
    try {
      console.log('📰 TickerNewsAgent: Fetching news for', ticker);
      
      // For demo purposes with 'demo' key, use mock data
      if (this.API_KEY === 'demo') {
        return this.getMockNews(ticker, startTime);
      }
      
      // Real API call to Alpha Vantage News & Sentiment API
      const url = `${this.BASE_URL}?function=NEWS_SENTIMENT&tickers=${ticker}&limit=10&apikey=${this.API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check for API errors
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (data['Note']) {
        throw new Error('API call frequency limit reached. Please try again later.');
      }
      
      const newsItems = data.feed || [];
      
      const processedNews: StockNews[] = newsItems.slice(0, 5).map((item: any) => {
        // Get sentiment for the specific ticker
        const tickerSentiment = item.ticker_sentiment?.find((ts: any) => 
          ts.ticker === ticker
        );
        
        let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
        if (tickerSentiment) {
          const sentimentScore = parseFloat(tickerSentiment.ticker_sentiment_score);
          if (sentimentScore > 0.15) sentiment = 'positive';
          else if (sentimentScore < -0.15) sentiment = 'negative';
        }
        
        return {
          title: item.title || 'News Article',
          summary: item.summary || 'No summary available',
          url: item.url || '#',
          source: item.source || 'Unknown Source',
          publishedAt: item.time_published || new Date().toISOString(),
          sentiment
        };
      });
      
      console.log(`✅ Retrieved ${processedNews.length} news articles for ${ticker}`);
      
      return {
        success: true,
        data: processedNews,
        agentName: 'TickerNewsAgent',
        executionTime: Date.now() - startTime
      };
      
    } catch (error) {
      console.error('❌ TickerNewsAgent failed:', error);
      
      // Fallback to mock data if API fails
      console.log('🔄 Falling back to mock news due to API error');
      return this.getMockNews(ticker, startTime);
    }
  }
  
  private async getMockNews(ticker: string, startTime: number): Promise<AgentResponse<StockNews[]>> {
    const newsTemplates = [
      {
        titleTemplate: "{ticker} Reports Strong Q4 Earnings, Beats Analyst Expectations",
        summaryTemplate: "{ticker} announced quarterly earnings that exceeded Wall Street expectations, driving positive investor sentiment and stock price momentum. The company showed robust revenue growth and improved profit margins.",
        sentiment: 'positive' as const,
        source: 'Financial Times',
        hoursAgo: 2
      },
      {
        titleTemplate: "Market Volatility Affects {ticker} Trading Volume",
        summaryTemplate: "Recent market uncertainties have led to increased trading volume for {ticker}, with analysts watching for trend reversals. The broader market conditions continue to influence stock performance.",
        sentiment: 'neutral' as const,
        source: 'Reuters',
        hoursAgo: 6
      },
      {
        titleTemplate: "Regulatory Concerns Impact {ticker} Stock Performance",
        summaryTemplate: "New regulatory developments in the sector have created headwinds for {ticker}, causing some investors to reassess positions. Industry experts suggest monitoring upcoming policy announcements.",
        sentiment: 'negative' as const,
        source: 'Bloomberg',
        hoursAgo: 12
      },
      {
        titleTemplate: "{ticker} Announces Strategic Partnership Initiative",
        summaryTemplate: "{ticker} has entered into a strategic partnership that could enhance its market position and drive future growth. The collaboration aims to leverage synergies and expand market reach.",
        sentiment: 'positive' as const,
        source: 'MarketWatch',
        hoursAgo: 18
      },
      {
        titleTemplate: "Analyst Upgrades {ticker} Price Target Following Recent Performance",
        summaryTemplate: "Several Wall Street analysts have raised their price targets for {ticker} citing strong fundamentals and positive business outlook. The upgrade reflects confidence in the company's strategic direction.",
        sentiment: 'positive' as const,
        source: 'CNBC',
        hoursAgo: 24
      },
      {
        titleTemplate: "Supply Chain Challenges May Impact {ticker} Operations",
        summaryTemplate: "Industry-wide supply chain disruptions could affect {ticker}'s production schedules and delivery timelines. Management is implementing contingency plans to minimize operational impact.",
        sentiment: 'negative' as const,
        source: 'Wall Street Journal',
        hoursAgo: 30
      }
    ];
    
    // Generate realistic news for the specific ticker
    const mockNews: StockNews[] = newsTemplates.slice(0, 4).map((template, index) => ({
      title: template.titleTemplate.replace(/{ticker}/g, ticker),
      summary: template.summaryTemplate.replace(/{ticker}/g, ticker),
      url: `https://example.com/news/${ticker.toLowerCase()}-${index + 1}`,
      source: template.source,
      publishedAt: new Date(Date.now() - template.hoursAgo * 60 * 60 * 1000).toISOString(),
      sentiment: template.sentiment
    }));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    console.log(`✅ Generated ${mockNews.length} mock news articles for ${ticker}`);
    
    return {
      success: true,
      data: mockNews,
      agentName: 'TickerNewsAgent',
      executionTime: Date.now() - startTime
    };
  }
}

export default TickerNewsAgent;
