import React from 'react';
import { ProductRecommendation } from '../services/geminiService';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ExternalLink, ShoppingCart } from 'lucide-react';

// Validate and fix buying links
const validateBuyingLink = (buyingLink: string, productName: string): string => {
  if (!buyingLink || !buyingLink.startsWith('http') || buyingLink.includes('placeholder')) {
    const searchQuery = encodeURIComponent(productName);
    return `https://www.amazon.com/s?k=${searchQuery}&ref=nb_sb_noss`;
  }
  
  if (buyingLink.includes('amazon.com') && !buyingLink.includes('/dp/') && !buyingLink.includes('/s?k=')) {
    const searchQuery = encodeURIComponent(productName);
    return `https://www.amazon.com/s?k=${searchQuery}&ref=nb_sb_noss`;
  }
  
  return buyingLink;
};

interface ProductDisplayProps {
  products: ProductRecommendation[];
  loading?: boolean;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ products, loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No products found</div>
        <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Top 5 Recommended Products
        </h2>
        <p className="text-gray-600">
          AI-powered recommendations tailored to your preferences
        </p>
      </div>
      
      <div className="space-y-4">
        {products.map((product, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-blue-600 text-white">
                      #{index + 1}
                    </Badge>
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-green-600">
                      {product.price}
                    </span>
                    
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <a
                        href={validateBuyingLink(product.buyingLink, product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy Now
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Recommendations powered by Google Gemini AI</p>
        <p className="mt-1">Prices and availability may vary. Please verify on the retailer's website.</p>
      </div>
    </div>
  );
};

export default ProductDisplay;
