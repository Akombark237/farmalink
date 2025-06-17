import { 
  formatCfa, 
  convertUsdToCfa, 
  parsePrice, 
  USD_TO_CFA_RATE,
  formatCurrency,
  convertCurrency,
  validateAmount
} from '../currency'

describe('Currency Functions', () => {
  describe('formatCfa', () => {
    it('should format CFA amounts and include CFA suffix', () => {
      expect(formatCfa(1000)).toContain('CFA')
      expect(formatCfa(0)).toBe('0 CFA')
    })

    it('should handle null and undefined values', () => {
      expect(formatCfa(null)).toBe('0 CFA')
      expect(formatCfa(undefined)).toBe('0 CFA')
      expect(formatCfa(NaN)).toBe('0 CFA')
    })
  })

  describe('convertUsdToCfa', () => {
    it('should convert USD to CFA using correct rate', () => {
      expect(convertUsdToCfa(1)).toBe(USD_TO_CFA_RATE)
      expect(convertUsdToCfa(0)).toBe(0)
      expect(convertUsdToCfa(10)).toBe(USD_TO_CFA_RATE * 10)
    })

    it('should return integer values', () => {
      const result = convertUsdToCfa(1.5)
      expect(Number.isInteger(result)).toBe(true)
    })
  })

  describe('parsePrice', () => {
    it('should parse USD prices', () => {
      expect(parsePrice('$12.99')).toBe(12.99)
      expect(parsePrice('$0.99')).toBe(0.99)
    })

    it('should parse CFA prices', () => {
      expect(parsePrice('500 CFA')).toBe(500)
      expect(parsePrice('1000 cfa')).toBe(1000)
    })

    it('should handle invalid input', () => {
      expect(parsePrice('invalid')).toBe(0)
      expect(parsePrice('')).toBe(0)
    })
  })

  describe('formatCurrency (new function)', () => {
    it('should format USD correctly', () => {
      expect(formatCurrency(1000, 'USD')).toBe('$1,000.00')
      expect(formatCurrency(12.99, 'USD')).toBe('$12.99')
    })

    it('should format CFA and include CFA suffix', () => {
      expect(formatCurrency(1000, 'CFA')).toContain('CFA')
      expect(formatCurrency(0, 'CFA')).toBe('0 CFA')
    })

    it('should default to CFA', () => {
      expect(formatCurrency(1000)).toContain('CFA')
    })

    it('should throw error for invalid input', () => {
      expect(() => formatCurrency(NaN)).toThrow('Amount must be a valid number')
    })
  })

  describe('convertCurrency', () => {
    it('should convert between currencies', () => {
      const rate = 600
      expect(convertCurrency(1, 'USD', 'CFA', rate)).toBe(600)
      expect(convertCurrency(600, 'CFA', 'USD', rate)).toBe(1)
    })

    it('should return same amount for same currency', () => {
      expect(convertCurrency(1000, 'CFA', 'CFA', 600)).toBe(1000)
      expect(convertCurrency(100, 'USD', 'USD', 600)).toBe(100)
    })

    it('should throw error for invalid input', () => {
      expect(() => convertCurrency(NaN, 'USD', 'CFA', 600)).toThrow()
      expect(() => convertCurrency(100, 'INVALID' as any, 'CFA', 600)).toThrow()
      expect(() => convertCurrency(100, 'USD', 'CFA', 0)).toThrow()
    })
  })

  describe('validateAmount', () => {
    it('should validate positive amounts', () => {
      expect(validateAmount(100)).toBe(true)
      expect(validateAmount(1)).toBe(true)
      expect(validateAmount(1000000)).toBe(true)
    })

    it('should reject invalid amounts', () => {
      expect(validateAmount(0)).toBe(false)
      expect(validateAmount(-100)).toBe(false)
      expect(validateAmount(NaN)).toBe(false)
      expect(validateAmount(Infinity)).toBe(false)
    })

    it('should respect amount limits', () => {
      expect(validateAmount(10000001)).toBe(false) // Over max
      expect(validateAmount(0.5)).toBe(false) // Under min
    })
  })

  describe('Integration tests', () => {
    it('should work together for USD to CFA conversion', () => {
      const usdAmount = 25
      const cfaAmount = convertUsdToCfa(usdAmount)
      const formatted = formatCfa(cfaAmount)
      
      expect(cfaAmount).toBe(25 * USD_TO_CFA_RATE)
      expect(formatted).toContain('CFA')
      expect(validateAmount(cfaAmount)).toBe(true)
    })

    it('should handle price parsing and conversion', () => {
      const priceString = '$19.99'
      const parsedUsd = parsePrice(priceString)
      const cfaAmount = convertUsdToCfa(parsedUsd)
      
      expect(parsedUsd).toBe(19.99)
      expect(cfaAmount).toBe(Math.round(19.99 * USD_TO_CFA_RATE))
      expect(validateAmount(cfaAmount)).toBe(true)
    })
  })

  describe('Constants', () => {
    it('should have valid exchange rate', () => {
      expect(typeof USD_TO_CFA_RATE).toBe('number')
      expect(USD_TO_CFA_RATE).toBeGreaterThan(0)
      expect(USD_TO_CFA_RATE).toBe(600)
    })
  })
})
