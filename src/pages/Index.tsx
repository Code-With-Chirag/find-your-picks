import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { ProductGrid } from "@/components/ProductGrid";
import { getProductRecommendations } from "@/data/mockProducts";

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query: string, maxPrice: number) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    // Simulate API call delay
    setTimeout(() => {
      const recommendations = getProductRecommendations(query, maxPrice);
      setProducts(recommendations);
      setIsLoading(false);
      
      // Scroll to results
      document.getElementById('results')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onSearch={handleSearch} />
      <HowItWorks />
      <div id="results">
        <ProductGrid 
          products={products} 
          isLoading={isLoading} 
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default Index;
