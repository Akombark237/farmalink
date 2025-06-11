// Currency utilities for CFA conversion and formatting

/**
 * Convert USD to CFA Franc (Central African CFA franc)
 * Current exchange rate: 1 USD ≈ 600 CFA (approximate)
 */
export const USD_TO_CFA_RATE = 600;

/**
 * Convert USD amount to CFA
 * @param usdAmount - Amount in USD
 * @returns Amount in CFA
 */
export function convertUsdToCfa(usdAmount: number): number {
  return Math.round(usdAmount * USD_TO_CFA_RATE);
}

/**
 * Format CFA amount with proper formatting
 * @param cfaAmount - Amount in CFA
 * @returns Formatted string with CFA suffix
 */
export function formatCfa(cfaAmount: number | undefined | null): string {
  if (cfaAmount === undefined || cfaAmount === null || isNaN(cfaAmount)) {
    return '0 CFA';
  }
  return `${cfaAmount.toLocaleString('fr-FR')} CFA`;
}

/**
 * Format price with CFA currency
 * @param price - Price amount (can be in USD or CFA)
 * @param isAlreadyCfa - Whether the price is already in CFA
 * @returns Formatted price string
 */
export function formatPrice(price: number | undefined | null, isAlreadyCfa: boolean = true): string {
  if (price === undefined || price === null || isNaN(price)) {
    return '0 CFA';
  }
  if (isAlreadyCfa) {
    return formatCfa(price);
  }
  return formatCfa(convertUsdToCfa(price));
}

/**
 * Parse price from string (removes currency symbols and formatting)
 * @param priceString - Price string like "$12.99" or "7,800 CFA"
 * @returns Numeric price value
 */
export function parsePrice(priceString: string): number {
  // Remove currency symbols, spaces, and commas
  const cleanPrice = priceString.replace(/[$,\s]/g, '').replace(/CFA/gi, '');
  return parseFloat(cleanPrice) || 0;
}

/**
 * Convert all prices in an object from USD to CFA
 * @param obj - Object containing price fields
 * @param priceFields - Array of field names that contain prices
 * @returns Object with converted prices
 */
export function convertObjectPricesToCfa<T extends Record<string, any>>(
  obj: T, 
  priceFields: string[] = ['price', 'cost', 'amount']
): T {
  const converted = { ...obj };
  
  priceFields.forEach(field => {
    if (typeof converted[field] === 'number') {
      converted[field] = convertUsdToCfa(converted[field]);
    }
  });
  
  return converted;
}

/**
 * Price range utilities
 */
export const PRICE_RANGES = {
  LOW: { min: 0, max: 5000, label: 'Under 5,000 CFA' },
  MEDIUM: { min: 5000, max: 20000, label: '5,000 - 20,000 CFA' },
  HIGH: { min: 20000, max: 50000, label: '20,000 - 50,000 CFA' },
  PREMIUM: { min: 50000, max: Infinity, label: 'Over 50,000 CFA' }
};

/**
 * Get price range category
 * @param price - Price in CFA
 * @returns Price range category
 */
export function getPriceRange(price: number): keyof typeof PRICE_RANGES {
  if (price < PRICE_RANGES.LOW.max) return 'LOW';
  if (price < PRICE_RANGES.MEDIUM.max) return 'MEDIUM';
  if (price < PRICE_RANGES.HIGH.max) return 'HIGH';
  return 'PREMIUM';
}

/**
 * Calculate discount amount and percentage
 * @param originalPrice - Original price in CFA
 * @param discountedPrice - Discounted price in CFA
 * @returns Discount information
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number) {
  const discountAmount = originalPrice - discountedPrice;
  const discountPercentage = Math.round((discountAmount / originalPrice) * 100);
  
  return {
    amount: discountAmount,
    percentage: discountPercentage,
    formattedAmount: formatCfa(discountAmount),
    formattedPercentage: `${discountPercentage}%`
  };
}
