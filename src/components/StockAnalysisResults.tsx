import React from 'react';
import { StockAnalysis } from '@/types/stock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Clock, ExternalLink, DollarSign, BarChart3 } from 'lucide-react';

interface Props {
  analysis: StockAnalysis;
}

const StockAnalysisResults: React.FC<Props> = ({ analysis }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="h-4 w-4" />;
      case 'bearish': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-green-50 text-green-700 border-green-200';
      case 'bearish': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h2>
        <p className="text-gray-600">
          Comprehensive analysis for <span className="font-semibold">{analysis.companyName || analysis.ticker}</span>
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Current Price */}
        {analysis.currentPrice && (
          <Card className="border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Current Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${analysis.currentPrice.price.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">{analysis.currentPrice.currency}</p>
            </CardContent>
          </Card>
        )}

        {/* Price Change */}
        {analysis.priceChange && (
          <Card className="border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Price Change (1D)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getPriceChangeColor(analysis.priceChange.change)}`}>
                {analysis.priceChange.change >= 0 ? '+' : ''}${analysis.priceChange.change.toFixed(2)}
              </div>
              <div className={`text-sm ${getPriceChangeColor(analysis.priceChange.change)}`}>
                {analysis.priceChange.changePercent >= 0 ? '+' : ''}{analysis.priceChange.changePercent.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sentiment */}
        <Card className="border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Overall Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getSentimentColor(analysis.sentiment)}>
                {getSentimentIcon(analysis.sentiment)}
                <span className="ml-1 capitalize">{analysis.sentiment}</span>
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              Confidence: {(analysis.confidence * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
              {analysis.analysis}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* News */}
      {analysis.news.length > 0 && (
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent News ({analysis.news.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.news.map((article, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 leading-tight">
                      {article.title}
                    </h4>
                    {article.sentiment && (
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${
                          article.sentiment === 'positive' 
                            ? 'border-green-200 text-green-700' 
                            : article.sentiment === 'negative' 
                              ? 'border-red-200 text-red-700'
                              : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        {article.sentiment}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.source}</span>
                    <div className="flex items-center space-x-2">
                      <span>{new Date(article.publishedAt).toLocaleString()}</span>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <div className="text-center text-sm text-gray-500">
        <p>Analysis completed at {formatTimestamp(analysis.timestamp)}</p>
        <p className="mt-1">Query: "{analysis.query}"</p>
      </div>
    </div>
  );
};

export default StockAnalysisResults;
