import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  originalPrice?: number;
}

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  searchQuery: string;
}

export function ProductGrid({ products, isLoading, searchQuery }: ProductGridProps) {
  if (isLoading) {
    return (
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Finding Your Perfect Products...
            </h2>
            <p className="text-xl text-muted-foreground">
              Searching for "{searchQuery}"
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Top 5 Recommendations for "{searchQuery}"
          </h2>
          <p className="text-xl text-muted-foreground">
            Curated products that match your needs perfectly
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured product - larger card */}
          {products[0] && (
            <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
              <div className="h-full">
                <ProductCard {...products[0]} />
              </div>
            </div>
          )}
          
          {/* Remaining products */}
          {products.slice(1).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Didn't find what you're looking for?
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-primary hover:text-primary-hover font-medium transition-smooth"
          >
            Try a different search →
          </button>
        </div>
      </div>
    </section>
  );
}