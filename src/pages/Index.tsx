import React, { useState } from 'react';
import { Search, TrendingUp, BarChart3, DollarSign, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AgentOrchestrator from '@/components/AgentOrchestrator';
import StockAnalysisResults from '@/components/StockAnalysisResults';
import { StockAnalysis } from '@/types/stock';

const Index = () => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const orchestrator = new AgentOrchestrator();
      const result = await orchestrator.analyzeStock(query);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exampleQueries = [
    "Why did Tesla stock drop today?",
    "What's happening with Palantir stock recently?",
    "How has Nvidia stock changed in the last 7 days?",
    "Apple stock price analysis"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Stock Analysis AI
                </h1>
                <p className="text-sm text-gray-600">Multi-Agent Intelligence System</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Google ADK
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Main Search Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Intelligent Stock Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ask questions about any stock using natural language. Our AI agents will analyze
              price movements, news, and provide comprehensive insights.
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="e.g., Why did Tesla stock drop today?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                    className="h-12 text-lg border-blue-200 focus:border-blue-400"
                    disabled={isAnalyzing}
                  />
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !query.trim()}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4" />
                      <span>Analyze</span>
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Example Queries */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                  disabled={isAnalyzing}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Architecture Info */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Multi-Agent Architecture
          </h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { icon: MessageSquare, name: "Ticker Identifier", desc: "Extracts stock symbols from queries" },
              { icon: BarChart3, name: "News Agent", desc: "Fetches latest stock news" },
              { icon: DollarSign, name: "Price Agent", desc: "Gets current stock prices" },
              { icon: TrendingUp, name: "Change Agent", desc: "Calculates price movements" },
              { icon: Sparkles, name: "Analysis Agent", desc: "Provides comprehensive insights" }
            ].map((agent, index) => (
              <Card key={index} className="text-center border-blue-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="p-3 bg-blue-50 rounded-full w-fit mx-auto mb-3">
                    <agent.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-sm mb-2">{agent.name}</h4>
                  <p className="text-xs text-gray-600">{agent.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Results */}
        {analysis && (
          <StockAnalysisResults analysis={analysis} />
        )}
      </div>
    </div>
  );
};

export default Index;
