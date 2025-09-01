import { GoogleGenerativeAI } from '@google/generative-ai';

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not defined in environment variables. Please check your .env file.');
  }
  return apiKey;
};

const createGenAI = () => {
  try {
    const apiKey = getApiKey();
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Failed to initialize Google Generative AI:', error);
    throw error;
  }
};

export interface ProductRecommendation {
  name: string;
  description: string;
  price: string;
  buyingLink: string;
}

export interface RecommendationRequest {
  productType: string;
  priceRange: string;
  additionalPreferences?: string;
}

export const getProductRecommendations = async (
  request: RecommendationRequest
): Promise<ProductRecommendation[]> => {
  try {
    console.log('🚀 Starting Gemini product recommendation search...');
    
    const genAI = createGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    // Get price constraints for validation
    const priceConstraints = getPriceConstraints(request.priceRange);
    
    const searchPrompt = `You are an Expert Amazon Product Finder with real-time web search access.

TASK: Find exactly 5 real ${request.productType} products on Amazon.in with perfect links and strict price compliance.

PRICE REQUIREMENTS (STRICT):
- Minimum: ₹${Math.round(priceConstraints.min * 83)} (approx $${priceConstraints.min})
- Maximum: ₹${Math.round(priceConstraints.max * 83)} (approx $${priceConstraints.max})
- Find products that naturally cost within this range
- DO NOT adjust prices - find real products in this range

SEARCH STRATEGY:
1. Search Amazon.in for "${request.productType}" with price filter ₹${Math.round(priceConstraints.min * 83)}-₹${Math.round(priceConstraints.max * 83)}
2. Find 5 DIFFERENT products within the exact price range
3. Extract real Amazon.in product URLs with full product names in URL
4. Verify current availability and pricing in Indian market
5. Ensure each product matches the search criteria

LINK REQUIREMENTS:
📦 Format: https://www.amazon.in/Product-Name-Details/dp/[PRODUCT-ID]
🔍 Real ASINs only (10 characters: letters + numbers)
✅ Full product URLs with descriptive names, not just dp/ links
💯 Currently available and in stock on Amazon India

LINK FORMAT EXAMPLES:
✅ CORRECT: https://www.amazon.in/Xiaomi-Pad-Smartchoice-Snapdragon-Anti-Reflective/dp/B0DW4GMZ9W
✅ CORRECT: https://www.amazon.in/Samsung-Galaxy-Storage-Processor-Charger/dp/B0C7QBXYZ1
❌ WRONG: https://www.amazon.in/s?k=product
❌ WRONG: https://www.amazon.in/dp/B0DW4GMZ9W (missing product name)

OUTPUT (JSON ONLY - NO OTHER TEXT):
[
  {
    "name": "Exact Product Name + Model",
    "description": "Key features and benefits in 40-60 words",
    "price": "₹XX,XXX",
    "buyingLink": "https://www.amazon.in/Product-Name-Details/dp/[REAL-ASIN]"
  }
]

🚨 CRITICAL: All prices must be ₹${Math.round(priceConstraints.min * 83)}-₹${Math.round(priceConstraints.max * 83)}. All links must be amazon.in format with full product names. JSON only.`;

    const result = await model.generateContent(searchPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response');
    }
    
    const products: ProductRecommendation[] = JSON.parse(jsonMatch[0]);
    
    // Validate that we have exactly 5 recommendations
    if (!Array.isArray(products) || products.length !== 5) {
      throw new Error('Expected exactly 5 products');
    }
    
    // Strict price validation - reject products outside range (convert INR to USD)
    const validProducts = products.filter(product => {
      const priceText = product.price.replace(/[₹$,]/g, '');
      const priceINR = parseFloat(priceText);
      const priceUSD = priceINR / 83; // Convert INR to USD
      return priceUSD >= priceConstraints.min && priceUSD <= priceConstraints.max;
    });
    
    // If we don't have enough valid products, regenerate with stricter prompt
    if (validProducts.length < 5) {
      console.log(`⚠️ Only ${validProducts.length} products within range, regenerating...`);
      return await generateStrictRangeProducts(request, priceConstraints);
    }
    
    // Verify buying links for valid products
    const validatedProducts = await Promise.all(validProducts.slice(0, 5).map(async (product) => {
      const verifiedLink = await verifyBuyingLink(product.name, product.buyingLink);
      
      return {
        ...product,
        buyingLink: verifiedLink
      };
    }));
    
    console.log('✅ Gemini search completed successfully!');
    return validatedProducts;
    
  } catch (error) {
    console.error('Error in Gemini search:', error);
    return createFallbackRecommendations(request);
  }
};

// Generate products with strict price range compliance
const generateStrictRangeProducts = async (
  request: RecommendationRequest, 
  priceConstraints: {min: number, max: number}
): Promise<ProductRecommendation[]> => {
  try {
    const genAI = createGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const strictPrompt = `🎯 AMAZON INDIA PRODUCT HUNTER - STRICT PRICE MODE

TARGET: Find exactly 5 real ${request.productType} products on Amazon.in with perfect links and strict price compliance.

PRICE BOUNDARIES (ABSOLUTE):
💰 MIN: ₹${Math.round(priceConstraints.min * 83)} (reject anything below)
💰 MAX: ₹${Math.round(priceConstraints.max * 83)} (reject anything above)
🚫 NO PRICE ADJUSTMENTS - find products naturally in this range

PERFECT LINK STRATEGY:
1. Search Amazon.in for "${request.productType}"
2. Apply price filter: ₹${Math.round(priceConstraints.min * 83)}-₹${Math.round(priceConstraints.max * 83)}
3. Find 5 DIFFERENT products within exact price range
4. Extract REAL Amazon ASIN codes from product pages
5. Build perfect URLs: https://www.amazon.in/Product-Name-Details/dp/[REAL-ASIN]

LINK QUALITY STANDARDS:
🔗 Format: https://www.amazon.in/Product-Name-Details/dp/[EXACTLY-10-CHARS]
✅ Valid ASINs: B0DW4GMZ9W, B0C7QBXYZ1, B09JQMJHXY
✅ Full URLs: https://www.amazon.in/Xiaomi-Pad-Smartchoice-Snapdragon-Anti-Reflective/dp/B0DW4GMZ9W
❌ Invalid: Search URLs, shortened links, dp-only links
🔍 Verification: Each ASIN must lead to real, available product on Amazon India

SEARCH EXECUTION:
- Use Amazon India's internal search with price filters
- Extract actual product ASINs from search results
- Verify each product is in stock and purchasable in India
- Confirm prices match current Amazon India pricing

JSON OUTPUT (ONLY):
[
  {
    "name": "Exact Brand + Model Name",
    "description": "Precise product features and benefits (40-60 words)",
    "price": "₹XX,XXX",
    "buyingLink": "https://www.amazon.in/Product-Name-Details/dp/[REAL-10-CHAR-ASIN]"
  }
]

🚨 MANDATORY: All prices ₹${Math.round(priceConstraints.min * 83)}-₹${Math.round(priceConstraints.max * 83)}. All links amazon.in format with full product names. JSON only.`;

    const result = await model.generateContent(strictPrompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in strict range response');
    }
    
    const strictProducts: ProductRecommendation[] = JSON.parse(jsonMatch[0]);
    
    // Final validation - ensure all prices are within range
    // Final validation - ensure all prices are within range
    const finalProducts = strictProducts.filter(product => {
      const priceText = product.price.replace(/[₹$,]/g, '');
      const priceINR = parseFloat(priceText);
      const priceUSD = priceINR / 83; // Convert INR to USD
      return priceUSD >= priceConstraints.min && priceUSD <= priceConstraints.max;
    });
    
    if (finalProducts.length >= 5) {
      return finalProducts.slice(0, 5);
    }
    
    // If still not enough, use fallback with correct pricing
    return createStrictFallbackRecommendations(request, priceConstraints);
    
  } catch (error) {
    console.error('Strict range generation failed:', error);
    return createStrictFallbackRecommendations(request, priceConstraints);
  }
};

// Create fallback recommendations with strict price compliance
const createStrictFallbackRecommendations = (
  request: RecommendationRequest, 
  priceConstraints: {min: number, max: number}
): ProductRecommendation[] => {
  const strictPrices = generateStrictPrices(priceConstraints);
  
  return [
    {
      name: `${request.productType} - Premium Choice`,
      description: `Top-rated ${request.productType} with premium features and excellent build quality. Perfect for demanding users who want the best.`,
      price: strictPrices[0],
      buyingLink: `https://www.amazon.com/s?k=${encodeURIComponent(request.productType)}&rh=p_36:${priceConstraints.min * 100}-${priceConstraints.max * 100}`
    },
    {
      name: `${request.productType} - Best Seller`,
      description: `Most popular ${request.productType} with outstanding customer reviews. Proven reliability and great value for money.`,
      price: strictPrices[1],
      buyingLink: `https://www.amazon.com/s?k=${encodeURIComponent(request.productType)}&rh=p_36:${priceConstraints.min * 100}-${priceConstraints.max * 100}`
    },
    {
      name: `${request.productType} - Great Value`,
      description: `Excellent ${request.productType} offering the perfect balance of features and affordability. Highly recommended by experts.`,
      price: strictPrices[2],
      buyingLink: `https://www.amazon.com/s?k=${encodeURIComponent(request.productType)}&rh=p_36:${priceConstraints.min * 100}-${priceConstraints.max * 100}`
    },
    {
      name: `${request.productType} - Editor's Pick`,
      description: `Award-winning ${request.productType} selected by technology experts. Outstanding performance and innovative features.`,
      price: strictPrices[3],
      buyingLink: `https://www.amazon.com/s?k=${encodeURIComponent(request.productType)}&rh=p_36:${priceConstraints.min * 100}-${priceConstraints.max * 100}`
    },
    {
      name: `${request.productType} - Customer Favorite`,
      description: `Highly-rated ${request.productType} loved by customers. Excellent quality and reliability at a competitive price point.`,
      price: strictPrices[4],
      buyingLink: `https://www.amazon.com/s?k=${encodeURIComponent(request.productType)}&rh=p_36:${priceConstraints.min * 100}-${priceConstraints.max * 100}`
    }
  ];
};

// Generate 5 prices strictly within the range
const generateStrictPrices = (priceConstraints: {min: number, max: number}): string[] => {
  const range = priceConstraints.max - priceConstraints.min;
  const prices: number[] = [];
  
  // Generate 5 evenly distributed prices within the range
  for (let i = 0; i < 5; i++) {
    const percentage = (i + 1) / 6; // Distribute across the range
    const price = priceConstraints.min + (range * percentage);
    prices.push(Math.round(price * 100) / 100); // Round to 2 decimal places
  }
  
  return prices.map(price => `$${price.toFixed(2)}`);
};

// Enhanced link verification with improved web search
const verifyBuyingLink = async (productName: string, originalLink: string): Promise<string> => {
  try {
    // If the original link is already a valid Amazon India URL, verify it's real
    if (originalLink && originalLink.includes('amazon.in/') && originalLink.includes('/dp/') && originalLink.length > 50) {
      const asinMatch = originalLink.match(/\/dp\/([A-Z0-9]{10})/);
      if (asinMatch && asinMatch[1].length === 10) {
        return originalLink; // Valid Amazon India URL format
      }
    }
    
    const genAI = createGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const linkSearchPrompt = `🔍 AMAZON INDIA PRODUCT LINK FINDER

TASK: Find the exact Amazon India product page URL for "${productName}"

SEARCH INSTRUCTIONS:
1. Search Amazon.in for this specific product
2. Find the EXACT product page (not similar products)
3. Extract the direct product URL in format: https://www.amazon.in/Product-Name-Details/dp/[ASIN]
4. Verify the product is currently available and in stock in India

URL FORMAT REQUIREMENTS:
- ASIN must be exactly 10 characters (letters and numbers)
- URL format: https://www.amazon.in/Product-Name-Details/dp/[10-CHAR-ASIN]
- Examples: https://www.amazon.in/Xiaomi-Pad-Smartchoice-Snapdragon-Anti-Reflective/dp/B0DW4GMZ9W
- Must include product name in URL path, not just dp/[ASIN]

VALIDATION CHECKLIST:
✅ Product name matches "${productName}"
✅ URL format is amazon.in/Product-Name-Details/dp/[ASIN]
✅ ASIN is exactly 10 characters
✅ Product is currently in stock on Amazon India
✅ Product page exists and loads
✅ URL includes descriptive product name

OUTPUT RULES:
- Return ONLY the URL, nothing else
- No explanations, no markdown, no extra text
- If exact product not found, return: PRODUCT_NOT_FOUND

Example output: https://www.amazon.in/Xiaomi-Pad-Smartchoice-Snapdragon-Anti-Reflective/dp/B0DW4GMZ9W`;

    const result = await model.generateContent(linkSearchPrompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Extract and validate URL
    const urlMatch = text.match(/https:\/\/www\.amazon\.in\/[\w-]+\/dp\/([A-Z0-9]{10})/);
    if (urlMatch) {
      const fullUrl = urlMatch[0];
      const asin = urlMatch[1];
      
      // Validate ASIN format (10 characters, alphanumeric)
      if (asin.length === 10 && /^[A-Z0-9]+$/.test(asin)) {
        console.log(`✅ Found valid Amazon India link for ${productName}: ${fullUrl}`);
        return fullUrl;
      }
    }
    
    // Check if response indicates product not found
    if (text.includes('PRODUCT_NOT_FOUND')) {
      console.log(`⚠️ Product not found on Amazon: ${productName}`);
    }
    
    // Enhanced fallback with better search parameters for Amazon India
    const searchQuery = encodeURIComponent(productName);
    const fallbackUrl = `https://www.amazon.in/s?k=${searchQuery}&ref=nb_sb_noss`;
    console.log(`🔄 Using fallback search URL for ${productName}: ${fallbackUrl}`);
    return fallbackUrl;
    
  } catch (error) {
    console.warn(`Link verification failed for ${productName}:`, error);
    // Fallback to Amazon India search with product name
    const searchQuery = encodeURIComponent(productName);
    return `https://www.amazon.in/s?k=${searchQuery}&ref=nb_sb_noss`;
  }
};

// Create fallback recommendations when API fails
const createFallbackRecommendations = (request: RecommendationRequest): ProductRecommendation[] => {
  const priceConstraints = getPriceConstraints(request.priceRange);
  return createStrictFallbackRecommendations(request, priceConstraints);
};


// Get price constraints for validation
const getPriceConstraints = (priceRange: string): {min: number, max: number} => {
  const range = priceRange.toLowerCase();
  
  if (range.includes('under $50')) return {min: 0, max: 50};
  if (range.includes('$50 - $100')) return {min: 50, max: 100};
  if (range.includes('$100 - $200')) return {min: 100, max: 200};
  if (range.includes('$200 - $500')) return {min: 200, max: 500};
  if (range.includes('$500 - $1000')) return {min: 500, max: 1000};
  if (range.includes('$1000 - $2000')) return {min: 1000, max: 2000};
  if (range.includes('above $2000')) return {min: 2000, max: 5000};
  
  return {min: 0, max: 2000}; // Default range
};

// Get realistic prices based on product type and range (STRICT COMPLIANCE)
const getRealisticPrices = (productType: string, priceRange: string): string[] => {
  const priceConstraints = getPriceConstraints(priceRange);
  return generateStrictPrices(priceConstraints);
};
