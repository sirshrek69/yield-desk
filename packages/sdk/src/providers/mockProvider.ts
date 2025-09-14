export interface MockPriceData {
  symbol: string
  price: number
  yieldPct: number
  ts: number
  source: 'mock'
}

export class MockProvider {
  private cache = new Map<string, MockPriceData>()
  private lastFetch = new Map<string, number>()
  private readonly CACHE_TTL = 5000 // 5 seconds for mock data

  getMockData(symbol: string, instrumentType: 'gov' | 'corp' | 'infl'): MockPriceData {
    const now = Date.now()
    const cached = this.cache.get(symbol)
    const lastFetchTime = this.lastFetch.get(symbol) || 0

    // Return cached data if still fresh
    if (cached && (now - lastFetchTime) < this.CACHE_TTL) {
      return cached
    }

    // Generate realistic mock data based on instrument type
    let basePrice: number
    let baseYield: number

    switch (instrumentType) {
      case 'gov':
        basePrice = 98.0 + Math.random() * 4.0 // 98-102 range
        baseYield = 2.0 + Math.random() * 3.0 // 2-5% range
        break
      case 'corp':
        basePrice = 95.0 + Math.random() * 10.0 // 95-105 range
        baseYield = 3.0 + Math.random() * 4.0 // 3-7% range
        break
      case 'infl':
        basePrice = 100.0 + Math.random() * 2.0 // 100-102 range
        baseYield = 1.0 + Math.random() * 2.0 // 1-3% range
        break
      default:
        basePrice = 100.0
        baseYield = 3.0
    }

    // Add random walk
    const priceVariation = (Math.random() - 0.5) * 0.1
    const yieldVariation = (Math.random() - 0.5) * 0.05

    const mockData: MockPriceData = {
      symbol,
      price: Number((basePrice + priceVariation).toFixed(2)),
      yieldPct: Number((baseYield + yieldVariation).toFixed(3)),
      ts: now,
      source: 'mock'
    }

    this.cache.set(symbol, mockData)
    this.lastFetch.set(symbol, now)

    return mockData
  }

  // Generate mock data for multiple instruments
  getMultipleMockData(symbols: string[], instrumentType: 'gov' | 'corp' | 'infl'): Map<string, MockPriceData> {
    const results = new Map<string, MockPriceData>()
    
    for (const symbol of symbols) {
      results.set(symbol, this.getMockData(symbol, instrumentType))
    }

    return results
  }

  // Simulate price movement with random walk
  simulatePriceMovement(symbol: string, currentPrice: number, volatility: number = 0.01): number {
    const change = (Math.random() - 0.5) * volatility * currentPrice
    return Math.max(0, currentPrice + change)
  }

  // Generate realistic bond prices based on yield
  generateBondPriceFromYield(yieldPct: number, couponPct: number, yearsToMaturity: number): number {
    // Simple bond pricing formula
    const coupon = couponPct / 100
    const ytm = yieldPct / 100
    const periods = yearsToMaturity * 2 // Semi-annual
    
    let price = 0
    for (let i = 1; i <= periods; i++) {
      price += (coupon / 2) / Math.pow(1 + ytm / 2, i)
    }
    price += 100 / Math.pow(1 + ytm / 2, periods)
    
    return Number(price.toFixed(2))
  }
}
