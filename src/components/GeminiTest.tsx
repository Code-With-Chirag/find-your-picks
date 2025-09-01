import React, { useState } from 'react';
import { getProductRecommendations, ProductRecommendation } from '../services/geminiService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2 } from 'lucide-react';

const GeminiTest: React.FC = () => {
  const [productType, setProductType] = useState('wireless earbuds');
  const [priceRange, setPriceRange] = useState('under $100');
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const testGeminiAPI = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setRecommendations([]);

    try {
      const result = await getProductRecommendations({
        productType,
        priceRange,
      });
      
      setRecommendations(result);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Gemini API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Type</label>
              <Input
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                placeholder="e.g., wireless earbuds, laptops, smartphones"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <Input
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="e.g., under $100, $200-$500"
              />
            </div>
          </div>
          
          <Button 
            onClick={testGeminiAPI} 
            disabled={loading || !productType || !priceRange}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Gemini API...
              </>
            ) : (
              'Test Gemini API'
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>
                <strong>Success!</strong> Gemini API is working correctly. Received {recommendations.length} recommendations.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">API Response Preview:</h3>
          <div className="space-y-3">
            {recommendations.map((product, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          #{index + 1}
                        </span>
                        <h4 className="font-semibold text-lg">{product.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-2xl text-green-600">{product.price}</span>
                        <a 
                          href={product.buyingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          Buy Now →
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">API Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>API Key:</span>
              <span className={import.meta.env.VITE_GEMINI_API_KEY ? 'text-green-600' : 'text-red-600'}>
                {import.meta.env.VITE_GEMINI_API_KEY ? '✓ Configured' : '✗ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="text-blue-600">{import.meta.env.MODE}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeminiTest;
