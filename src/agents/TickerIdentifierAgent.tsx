import { AgentResponse } from '@/types/stock';

class TickerIdentifierAgent {
  private tickerMap: { [key: string]: { ticker: string; name: string } } = {
    // Tech
    'tesla': { ticker: 'TSLA', name: 'Tesla Inc' },
    'apple': { ticker: 'AAPL', name: 'Apple Inc' },
    'microsoft': { ticker: 'MSFT', name: 'Microsoft Corporation' },
    'google': { ticker: 'GOOGL', name: 'Alphabet Inc' },
    'alphabet': { ticker: 'GOOGL', name: 'Alphabet Inc' },
    'amazon': { ticker: 'AMZN', name: 'Amazon.com Inc' },
    'meta': { ticker: 'META', name: 'Meta Platforms Inc' },
    'facebook': { ticker: 'META', name: 'Meta Platforms Inc' },
    'nvidia': { ticker: 'NVDA', name: 'NVIDIA Corporation' },
    'palantir': { ticker: 'PLTR', name: 'Palantir Technologies Inc' },
    'netflix': { ticker: 'NFLX', name: 'Netflix Inc' },
    'amd': { ticker: 'AMD', name: 'Advanced Micro Devices Inc' },
    'intel': { ticker: 'INTC', name: 'Intel Corporation' },
    'salesforce': { ticker: 'CRM', name: 'Salesforce Inc' },
    'adobe': { ticker: 'ADBE', name: 'Adobe Inc' },
    'oracle': { ticker: 'ORCL', name: 'Oracle Corporation' },
    'uber': { ticker: 'UBER', name: 'Uber Technologies Inc' },
    'lyft': { ticker: 'LYFT', name: 'Lyft Inc' },
    'airbnb': { ticker: 'ABNB', name: 'Airbnb Inc' },
    'zoom': { ticker: 'ZM', name: 'Zoom Video Communications Inc' },
    'slack': { ticker: 'WORK', name: 'Slack Technologies Inc' },
    'spotify': { ticker: 'SPOT', name: 'Spotify Technology SA' },
    'twitter': { ticker: 'TWTR', name: 'Twitter Inc' },
    'snap': { ticker: 'SNAP', name: 'Snap Inc' },
    'snapchat': { ticker: 'SNAP', name: 'Snap Inc' },
    'pinterest': { ticker: 'PINS', name: 'Pinterest Inc' },
    'square': { ticker: 'SQ', name: 'Square Inc' },
    'paypal': { ticker: 'PYPL', name: 'PayPal Holdings Inc' },
    'mastercard': { ticker: 'MA', name: 'Mastercard Inc' },
    'visa': { ticker: 'V', name: 'Visa Inc' },
    
    // Finance
    'jpmorgan': { ticker: 'JPM', name: 'JPMorgan Chase & Co' },
    'goldman': { ticker: 'GS', name: 'Goldman Sachs Group Inc' },
    'berkshire': { ticker: 'BRK.A', name: 'Berkshire Hathaway Inc' },
    'bankofamerica': { ticker: 'BAC', name: 'Bank of America Corp' },
    'wellsfargo': { ticker: 'WFC', name: 'Wells Fargo & Co' },
    'citigroup': { ticker: 'C', name: 'Citigroup Inc' },
    'americanexpress': { ticker: 'AXP', name: 'American Express Co' },
    
    // Healthcare & Pharma
    'johnson': { ticker: 'JNJ', name: 'Johnson & Johnson' },
    'pfizer': { ticker: 'PFE', name: 'Pfizer Inc' },
    'moderna': { ticker: 'MRNA', name: 'Moderna Inc' },
    'abbvie': { ticker: 'ABBV', name: 'AbbVie Inc' },
    'merck': { ticker: 'MRK', name: 'Merck & Co Inc' },
    
    // Retail & Consumer
    'walmart': { ticker: 'WMT', name: 'Walmart Inc' },
    'target': { ticker: 'TGT', name: 'Target Corp' },
    'homedepot': { ticker: 'HD', name: 'Home Depot Inc' },
    'costco': { ticker: 'COST', name: 'Costco Wholesale Corp' },
    'starbucks': { ticker: 'SBUX', name: 'Starbucks Corp' },
    'mcdonalds': { ticker: 'MCD', name: 'McDonalds Corp' },
    'nike': { ticker: 'NKE', name: 'Nike Inc' },
    'coca': { ticker: 'KO', name: 'Coca-Cola Co' },
    'cocacola': { ticker: 'KO', name: 'Coca-Cola Co' },
    'pepsi': { ticker: 'PEP', name: 'PepsiCo Inc' },
    
    // Energy & Utilities
    'exxon': { ticker: 'XOM', name: 'Exxon Mobil Corp' },
    'chevron': { ticker: 'CVX', name: 'Chevron Corp' },
    'shell': { ticker: 'SHEL', name: 'Shell PLC' },
    
    // Direct tickers
    'tsla': { ticker: 'TSLA', name: 'Tesla Inc' },
    'aapl': { ticker: 'AAPL', name: 'Apple Inc' },
    'msft': { ticker: 'MSFT', name: 'Microsoft Corporation' },
    'googl': { ticker: 'GOOGL', name: 'Alphabet Inc' },
    'goog': { ticker: 'GOOGL', name: 'Alphabet Inc' },
    'amzn': { ticker: 'AMZN', name: 'Amazon.com Inc' },
    'nvda': { ticker: 'NVDA', name: 'NVIDIA Corporation' },
    'pltr': { ticker: 'PLTR', name: 'Palantir Technologies Inc' },
    'nflx': { ticker: 'NFLX', name: 'Netflix Inc' },
    'intc': { ticker: 'INTC', name: 'Intel Corporation' },
    'crm': { ticker: 'CRM', name: 'Salesforce Inc' },
    'adbe': { ticker: 'ADBE', name: 'Adobe Inc' },
    'orcl': { ticker: 'ORCL', name: 'Oracle Corporation' },
    'jpm': { ticker: 'JPM', name: 'JPMorgan Chase & Co' },
    'gs': { ticker: 'GS', name: 'Goldman Sachs Group Inc' },
    'jnj': { ticker: 'JNJ', name: 'Johnson & Johnson' },
    'pfe': { ticker: 'PFE', name: 'Pfizer Inc' },
    'wmt': { ticker: 'WMT', name: 'Walmart Inc' },
    'ko': { ticker: 'KO', name: 'Coca-Cola Co' },
    'dis': { ticker: 'DIS', name: 'Walt Disney Co' },
    'ba': { ticker: 'BA', name: 'Boeing Co' },
    'cat': { ticker: 'CAT', name: 'Caterpillar Inc' },
    'ge': { ticker: 'GE', name: 'General Electric Co' },
    'ibm': { ticker: 'IBM', name: 'International Business Machines Corp' }
  };

  private commonStockTerms = ['stock', 'share', 'shares', 'equity', 'ticker', 'symbol'];
  private priceActionWords = ['drop', 'dropped', 'fall', 'fell', 'rise', 'rose', 'up', 'down', 'increase', 'decrease', 'gain', 'loss', 'surge', 'plunge', 'rally', 'crash'];

  async execute(query: string): Promise<AgentResponse<{ ticker: string; companyName: string }>> {
    const startTime = Date.now();
    
    try {
      console.log('🔍 TickerIdentifierAgent: Processing query:', query);
      
      const normalizedQuery = query.toLowerCase().trim();
      
      // Remove common words and punctuation for better matching
      const cleanQuery = normalizedQuery
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Look for exact company name matches first (prioritize longer matches)
      const sortedKeys = Object.keys(this.tickerMap).sort((a, b) => b.length - a.length);
      
      for (const key of sortedKeys) {
        const value = this.tickerMap[key];
        // Check if the key appears as a whole word in the query
        const keyRegex = new RegExp(`\\b${key}\\b`, 'i');
        if (keyRegex.test(cleanQuery)) {
          console.log(`✅ Found company name match: ${key} -> ${value.ticker}`);
          return {
            success: true,
            data: {
              ticker: value.ticker,
              companyName: value.name
            },
            agentName: 'TickerIdentifierAgent',
            executionTime: Date.now() - startTime
          };
        }
      }
      
      // Try to extract ticker pattern (1-5 uppercase letters, possibly with dots)
      const tickerPatterns = [
        /\b([A-Z]{1,5}(?:\.[A-Z])?)\b/g, // Standard tickers like AAPL, BRK.A
        /\$([A-Z]{1,5}(?:\.[A-Z])?)\b/g, // Dollar sign prefixed like $AAPL
        /([A-Z]{2,5})\s*(?:stock|share|ticker)/gi // Tickers followed by stock-related words
      ];
      
      for (const pattern of tickerPatterns) {
        const matches = normalizedQuery.toUpperCase().match(pattern);
        if (matches && matches.length > 0) {
          let ticker = matches[0].replace(/[$\s]/g, '').replace(/(?:STOCK|SHARE|TICKER)/gi, '');
          
          // Validate ticker length and format
          if (ticker.length >= 1 && ticker.length <= 5 && /^[A-Z]+(?:\.[A-Z])?$/.test(ticker)) {
            console.log(`📝 Extracted ticker pattern: ${ticker}`);
            
            // Try to find the company name if we have it in our map
            const lowerTicker = ticker.toLowerCase();
            const companyInfo = this.tickerMap[lowerTicker];
            
            return {
              success: true,
              data: {
                ticker: ticker,
                companyName: companyInfo ? companyInfo.name : `${ticker} Corporation`
              },
              agentName: 'TickerIdentifierAgent',
              executionTime: Date.now() - startTime
            };
          }
        }
      }
      
      // Advanced NLP: Look for context clues
      const hasStockContext = this.commonStockTerms.some(term => 
        normalizedQuery.includes(term)
      );
      
      const hasPriceAction = this.priceActionWords.some(word => 
        normalizedQuery.includes(word)
      );
      
      if (hasStockContext || hasPriceAction) {
        // Extract potential company names using word boundaries
        const words = cleanQuery.split(/\s+/);
        for (const word of words) {
          if (word.length > 2 && this.tickerMap[word]) {
            const value = this.tickerMap[word];
            console.log(`✅ Found contextual match: ${word} -> ${value.ticker}`);
            return {
              success: true,
              data: {
                ticker: value.ticker,
                companyName: value.name
              },
              agentName: 'TickerIdentifierAgent',
              executionTime: Date.now() - startTime
            };
          }
        }
      }
      
      throw new Error(`Could not identify stock ticker from query: "${query}". Please try including the company name or stock symbol.`);
      
    } catch (error) {
      console.error('❌ TickerIdentifierAgent failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        agentName: 'TickerIdentifierAgent',
        executionTime: Date.now() - startTime
      };
    }
  }
}

export default TickerIdentifierAgent;
