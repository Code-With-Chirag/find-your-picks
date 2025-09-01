import { useState } from "react";
import { Search, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-bg.jpg";

interface HeroSectionProps {
  onSearch: (query: string, maxPrice: number) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const price = maxPrice ? parseInt(maxPrice) : 10000;
      onSearch(searchQuery.trim(), price);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section 
      className="relative min-h-[80vh] flex items-center justify-center gradient-hero"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(56, 134, 225, 0.1), rgba(220, 220, 240, 0.1)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-background/80" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Discover Your Next 
          <span className="text-primary"> Favorite Product</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Enter what you need, set your budget, and we'll show you the top 5 
          handpicked recommendations tailored just for you.
        </p>

        <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-card border border-border/50 max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="What are you looking for? (e.g., gaming laptop, wireless headphones)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-4 py-6 text-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              />
            </div>

            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Maximum budget (optional)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-4 py-6 text-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              />
            </div>

            <Button 
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              size="lg"
              className="w-full py-6 text-lg font-semibold gradient-primary hover:opacity-90 transition-smooth disabled:opacity-50"
            >
              <Search className="w-5 h-5 mr-2" />
              Find My Perfect Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}