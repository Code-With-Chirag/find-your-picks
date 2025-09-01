import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Loader2 } from 'lucide-react';

interface ProductRecommendationFormProps {
  onSubmit: (data: {
    productType: string;
    priceRange: string;
    additionalPreferences?: string;
  }) => void;
  loading?: boolean;
}

const ProductRecommendationForm: React.FC<ProductRecommendationFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [productType, setProductType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [additionalPreferences, setAdditionalPreferences] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productType && priceRange) {
      onSubmit({
        productType,
        priceRange,
        additionalPreferences: additionalPreferences || undefined,
      });
    }
  };

  const popularProducts = [
    'Smartphones',
    'Laptops',
    'Wireless Earbuds',
    'Smart Watches',
    'Gaming Headsets',
    'Tablets',
    'Bluetooth Speakers',
    'Fitness Trackers',
    'Cameras',
    'Gaming Keyboards',
  ];

  const priceRanges = [
    { label: 'Under ₹4,000 ($50)', value: 'Under $50' },
    { label: '₹4,000 - ₹8,300 ($50 - $100)', value: '$50 - $100' },
    { label: '₹8,300 - ₹16,600 ($100 - $200)', value: '$100 - $200' },
    { label: '₹16,600 - ₹41,500 ($200 - $500)', value: '$200 - $500' },
    { label: '₹41,500 - ₹83,000 ($500 - $1000)', value: '$500 - $1000' },
    { label: '₹83,000 - ₹1,66,000 ($1000 - $2000)', value: '$1000 - $2000' },
    { label: 'Above ₹1,66,000 ($2000+)', value: 'Above $2000' },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Find Your Perfect Product
        </CardTitle>
        <p className="text-gray-600">
          Get AI-powered recommendations tailored to your needs and budget
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productType">What are you looking for?</Label>
            <div className="relative">
              <Input
                id="productType"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                placeholder="e.g., wireless earbuds, gaming laptop, smartphone..."
                className="pr-10"
                required
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {popularProducts.map((product) => (
                <Button
                  key={product}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setProductType(product)}
                  className="text-xs"
                >
                  {product}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="priceRange" className="text-sm font-medium flex items-center gap-2">
              💰 Budget Range
            </Label>
            <Select value={priceRange} onValueChange={setPriceRange} required>
              <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                <SelectValue placeholder="💸 Select your budget range" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {priceRanges.map((range) => (
                  <SelectItem 
                    key={range.value} 
                    value={range.value}
                    className="py-3 px-4 hover:bg-blue-50 focus:bg-blue-50"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{range.label.split(' (')[0]}</span>
                      <span className="text-xs text-gray-500">({range.label.split(' (')[1]?.replace(')', '') || ''})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              💡 Prices shown in Indian Rupees (₹) with USD equivalent
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferences">Additional Preferences (Optional)</Label>
            <Textarea
              id="preferences"
              value={additionalPreferences}
              onChange={(e) => setAdditionalPreferences(e.target.value)}
              placeholder="e.g., brand preferences, specific features, color, size requirements..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={!productType || !priceRange || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Finding Your Perfect Products...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Find My Perfect Product
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductRecommendationForm;
