import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProductRecommendationForm from "@/components/ProductRecommendationForm";
import ProductDisplay from "@/components/ProductDisplay";
import GeminiTest from "@/components/GeminiTest";
import { getProductRecommendations, ProductRecommendation, RecommendationRequest } from "@/services/geminiService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [products, setProducts] = useState<ProductRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecommendationRequest = async (request: RecommendationRequest) => {
    setIsLoading(true);
    setError(null);
    setProducts([]);

    try {
      const recommendations = await getProductRecommendations(request);
      setProducts(recommendations);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Find Your Picks
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the perfect products tailored to your needs with AI-powered recommendations
          </p>
        </div>

        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="recommendations">Product Recommendations</TabsTrigger>
            <TabsTrigger value="test">API Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="space-y-8">
            {/* Recommendation Form */}
            <ProductRecommendationForm 
              onSubmit={handleRecommendationRequest}
              loading={isLoading}
            />

            {/* Error Display */}
            {error && (
              <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Results Section */}
            <div id="results" className="mt-12">
              <ProductDisplay 
                products={products}
                loading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="test">
            <GeminiTest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
