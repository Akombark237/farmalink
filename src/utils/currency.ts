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
  const converted = { ...obj } as any;

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

// Additional functions for testing compatibility
export type Currency = 'CFA' | 'USD'

/**
 * Format currency amount with proper locale formatting
 * @param amount - The amount to format
 * @param currency - The currency type (defaults to CFA)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: Currency = 'CFA'): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Amount must be a valid number')
  }

  if (currency === 'CFA') {
    // CFA doesn't use decimals, round to nearest whole number
    const roundedAmount = Math.round(amount)
    return `${roundedAmount.toLocaleString('fr-FR')} CFA`
  } else if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  } else {
    throw new Error(`Unsupported currency: ${currency}`)
  }
}

/**
 * Convert between currencies
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param exchangeRate - Exchange rate (1 USD = exchangeRate CFA)
 * @returns Converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate: number
): number {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Amount must be a valid number')
  }

  if (typeof exchangeRate !== 'number' || exchangeRate <= 0) {
    throw new Error('Exchange rate must be a positive number')
  }

  if (!['CFA', 'USD'].includes(fromCurrency)) {
    throw new Error(`Invalid source currency: ${fromCurrency}`)
  }

  if (!['CFA', 'USD'].includes(toCurrency)) {
    throw new Error(`Invalid target currency: ${toCurrency}`)
  }

  // Same currency, no conversion needed
  if (fromCurrency === toCurrency) {
    return amount
  }

  if (fromCurrency === 'USD' && toCurrency === 'CFA') {
    return amount * exchangeRate
  } else if (fromCurrency === 'CFA' && toCurrency === 'USD') {
    return amount / exchangeRate
  }

  throw new Error(`Unsupported currency conversion: ${fromCurrency} to ${toCurrency}`)
}

/**
 * Validate if an amount is valid for transactions
 * @param amount - Amount to validate
 * @returns True if valid, false otherwise
 */
export function validateAmount(amount: number): boolean {
  if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
    return false
  }

  // Must be positive and greater than 0
  if (amount <= 0) {
    return false
  }

  // Maximum amount limit (10 million CFA)
  const maxAmount = 10000000
  if (amount > maxAmount) {
    return false
  }

  // Minimum amount limit (1 CFA)
  const minAmount = 1
  if (amount < minAmount) {
    return false
  }

  return true
}
