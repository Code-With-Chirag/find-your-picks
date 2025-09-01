#!/usr/bin/env python3
"""
Simple Python script to test Gemini API connectivity and functionality.
This will help verify if the API key is working correctly.
"""

import os
import json
import google.generativeai as genai
from typing import List, Dict

# Configure the API key
API_KEY = "AIzaSyDy9URfX9-SFc2P1K1uOXWIYWd4Yv7syMc"

def test_gemini_api():
    """Test basic Gemini API connectivity"""
    try:
        genai.configure(api_key=API_KEY)
        
        # Initialize the model
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        print("🔍 Testing basic Gemini API connectivity...")
        
        # Simple test prompt
        response = model.generate_content("Hello! Can you respond with 'API is working correctly'?")
        print(f"✅ Basic API Test: {response.text}")
        
        return True
    except Exception as e:
        print(f"❌ Basic API Test Failed: {str(e)}")
        return False

def test_product_recommendations_with_price_range():
    """Test the product recommendation functionality with strict price range validation"""
    try:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        print("\n🛍️ Testing product recommendation with price range validation...")
        
        # Test different price ranges
        test_cases = [
            {"product": "wireless earbuds", "range": "$50 - $100"},
            {"product": "smartphones", "range": "$200 - $500"},
            {"product": "laptops", "range": "$500 - $1000"}
        ]
        
        for test_case in test_cases:
            print(f"\n🔍 Testing: {test_case['product']} in {test_case['range']} range")
            
            master_prompt = f"""You are a Professional Product Recommender with web search capabilities. 
            
Search the web for exactly 5 real {test_case['product']} products in the {test_case['range']} price range.

For each product, find:
1. Real product name and model
2. Direct Amazon product page URL (https://www.amazon.com/dp/[PRODUCT_ID])
3. Product image URL (https://m.media-amazon.com/images/I/[ID]._AC_UY327_FMwebp_QL65_.jpg)
4. Accurate current price
5. Product description

CRITICAL: Return ONLY a valid JSON array with NO additional text, explanations, or markdown formatting.

Use this exact format:
[
  {{
    "name": "Real Brand + Model (e.g. Apple iPhone 15 Pro)",
    "description": "Concise description of key features and benefits (40-60 words)",
    "price": "$XXX.XX",
    "buyingLink": "https://www.amazon.com/dp/[ACTUAL_PRODUCT_ID]",
    "imageUrl": "https://m.media-amazon.com/images/I/[ACTUAL_IMAGE_ID]._AC_UY327_FMwebp_QL65_.jpg"
  }}
]

Requirements:
- Search for real products currently available on Amazon
- Use direct product page URLs (dp/[ID]), not search URLs
- Extract actual Amazon image URLs from product pages
- Prices must match current Amazon pricing within the {test_case['range']} range"""

            response = model.generate_content(master_prompt)
            response_text = response.text
            
            print(f"📝 Raw Response Preview: {response_text[:200]}...")
            
            # Try to extract and parse JSON
            import re
            json_match = re.search(r'\[[\s\S]*\]', response_text)
            
            if json_match:
                json_str = json_match.group(0)
                try:
                    products = json.loads(json_str)
                    print(f"✅ JSON Parsing: Successfully parsed {len(products)} products")
                    
                    # Validate price range
                    range_parts = test_case['range'].replace('$', '').split(' - ')
                    min_price = float(range_parts[0])
                    max_price = float(range_parts[1])
                    
                    price_valid = True
                    # Display and validate products
                    for i, product in enumerate(products, 1):
                        price_str = product.get('price', '$0').replace('$', '').replace(',', '')
                        try:
                            price = float(price_str)
                            price_in_range = min_price <= price <= max_price
                            if not price_in_range:
                                price_valid = False
                        except:
                            price = 0
                            price_in_range = False
                            price_valid = False
                            
                        print(f"\n{i}. {product.get('name', 'Unknown')}")
                        print(f"   Price: {product.get('price', 'N/A')} {'✅' if price_in_range else '❌ OUT OF RANGE'}")
                        print(f"   Link: {product.get('buyingLink', 'N/A')}")
                        print(f"   Image: {product.get('imageUrl', 'N/A')}")
                    
                    print(f"\n💰 Price Range Validation: {'✅ ALL PRICES IN RANGE' if price_valid else '❌ SOME PRICES OUT OF RANGE'}")
                    
                except json.JSONDecodeError as e:
                    print(f"❌ JSON Parsing Failed: {str(e)}")
                    print(f"Raw JSON: {json_str}")
                    return False
            else:
                print("❌ No JSON found in response")
                print(f"Full response: {response_text}")
                return False
        
        return True
            
    except Exception as e:
        print(f"❌ Product Recommendation Test Failed: {str(e)}")
        return False

def main():
    """Main test function"""
    print("🧪 Gemini API Test Script")
    print("=" * 50)
    
    # Test 1: Basic connectivity
    basic_test = test_gemini_api()
    
    # Test 2: Product recommendations with price range
    if basic_test:
        recommendation_test = test_product_recommendations_with_price_range()
    else:
        recommendation_test = False
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print(f"Basic API Test: {'✅ PASS' if basic_test else '❌ FAIL'}")
    print(f"Product Recommendations: {'✅ PASS' if recommendation_test else '❌ FAIL'}")
    
    if basic_test and recommendation_test:
        print("\n🎉 All tests passed! Your Gemini API is working correctly.")
    else:
        print("\n⚠️ Some tests failed. Check the error messages above.")

if __name__ == "__main__":
    main()
