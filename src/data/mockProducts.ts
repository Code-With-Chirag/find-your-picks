// Mock product data for demonstration
export const mockProducts = {
  "gaming laptop": [
    {
      id: "1",
      name: "ASUS ROG Strix G15 Gaming Laptop",
      price: 1299,
      originalPrice: 1499,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
      description: "AMD Ryzen 7, RTX 3070, 16GB RAM, 512GB SSD. Perfect for high-end gaming."
    },
    {
      id: "2", 
      name: "MSI Katana GF66 Gaming Laptop",
      price: 899,
      originalPrice: 1099,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
      description: "Intel i7, RTX 3060, 16GB RAM, 512GB SSD. Great performance for the price."
    },
    {
      id: "3",
      name: "Alienware m15 R7 Gaming Laptop", 
      price: 1799,
      originalPrice: 2099,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop",
      description: "Intel i9, RTX 3080, 32GB RAM, 1TB SSD. Ultimate gaming experience."
    },
    {
      id: "4",
      name: "Acer Predator Helios 300",
      price: 1149,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop", 
      description: "Intel i7, RTX 3060, 16GB RAM, 512GB SSD. Excellent cooling system."
    },
    {
      id: "5",
      name: "HP Omen 16 Gaming Laptop",
      price: 1049,
      rating: 4.1,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
      description: "AMD Ryzen 7, RTX 3060, 16GB RAM, 512GB SSD. Sleek design with powerful specs."
    }
  ],
  "wireless headphones": [
    {
      id: "6",
      name: "Sony WH-1000XM4 Wireless Headphones",
      price: 279,
      originalPrice: 349,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      description: "Industry-leading noise cancellation with 30-hour battery life."
    },
    {
      id: "7", 
      name: "Bose QuietComfort 45",
      price: 249,
      originalPrice: 329,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop",
      description: "Premium comfort with world-class noise cancellation."
    },
    {
      id: "8",
      name: "Apple AirPods Max",
      price: 479,
      originalPrice: 549,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1588867702719-969c6ac0b2e6?w=400&h=300&fit=crop",
      description: "High-fidelity audio with adaptive EQ and spatial audio."
    },
    {
      id: "9",
      name: "Sennheiser Momentum 3 Wireless",
      price: 319,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=300&fit=crop",
      description: "Audiophile-grade sound with smart pause technology."
    },
    {
      id: "10",
      name: "Beats Studio3 Wireless",
      price: 199,
      originalPrice: 349,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&h=300&fit=crop",
      description: "Pure adaptive noise canceling with up to 40 hours playback."
    }
  ],
  "smartphone": [
    {
      id: "11",
      name: "iPhone 15 Pro",
      price: 999,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
      description: "A17 Pro chip, Pro camera system, and titanium design."
    },
    {
      id: "12",
      name: "Samsung Galaxy S24 Ultra", 
      price: 1199,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      description: "200MP camera, S Pen included, and AI-powered features."
    },
    {
      id: "13",
      name: "Google Pixel 8 Pro",
      price: 899,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop",
      description: "Best-in-class computational photography with pure Android."
    },
    {
      id: "14", 
      name: "OnePlus 12",
      price: 799,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=300&fit=crop",
      description: "Snapdragon 8 Gen 3, 100W fast charging, flagship killer."
    },
    {
      id: "15",
      name: "Xiaomi 14 Ultra",
      price: 899,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=300&fit=crop",
      description: "Leica camera system, wireless charging, premium build quality."
    }
  ]
};

export function getProductRecommendations(query: string, maxPrice: number) {
  const lowerQuery = query.toLowerCase();
  
  // Find matching products based on query
  let matchedProducts: any[] = [];
  
  if (lowerQuery.includes('gaming') || lowerQuery.includes('laptop')) {
    matchedProducts = mockProducts["gaming laptop"];
  } else if (lowerQuery.includes('headphone') || lowerQuery.includes('audio')) {
    matchedProducts = mockProducts["wireless headphones"];  
  } else if (lowerQuery.includes('phone') || lowerQuery.includes('mobile')) {
    matchedProducts = mockProducts["smartphone"];
  } else {
    // Default to gaming laptops for demo
    matchedProducts = mockProducts["gaming laptop"];
  }
  
  // Filter by price and return top 5
  return matchedProducts
    .filter(product => product.price <= maxPrice)
    .slice(0, 5);
}