import { QuoteAdapter, QuoteData, Instrument, BondMath } from './quoteAdapter'

export class MockAdapter extends QuoteAdapter {
  private cache = new Map<string, QuoteData>()
  private lastFetch = new Map<string, number>()
  private readonly CACHE_TTL = 5000 // 5 seconds for mock data

  async getQuote(instrument: Instrument): Promise<QuoteData | null> {
    const now = Date.now()
    const cached = this.cache.get(instrument.instrumentKey)
    const lastFetchTime = this.lastFetch.get(instrument.instrumentKey) || 0

    // Return cached data if still fresh
    if (cached && (now - lastFetchTime) < this.CACHE_TTL) {
      return cached
    }

    // Generate realistic mock data based on instrument type
    let baseYield: number

    switch (instrument.group) {
      case 'gov':
        baseYield = 2.5 + Math.random() * 2.0 // 2-4.5% range
        break
      case 'corp':
        baseYield = 4.0 + Math.random() * 3.0 // 4-7% range
        break
      case 'infl':
        baseYield = 1.5 + Math.random() * 1.0 // 1.5-2.5% range
        break
      default:
        baseYield = 3.0
    }

    // Add random walk
    const yieldVariation = (Math.random() - 0.5) * 0.1
    const yieldPct = Math.max(0, baseYield + yieldVariation)

    const bondCalc = BondMath.calculatePriceFromYield(
      instrument.couponPct,
      yieldPct,
      instrument.maturityDate
    )

    const quoteData: QuoteData = {
      pricePer100: bondCalc.clean,
      ytmPct: bondCalc.ytmPct,
      clean: bondCalc.clean,
      dirty: bondCalc.dirty,
      source: 'Indicative',
      asOf: now,
      isLive: false
    }

    this.cache.set(instrument.instrumentKey, quoteData)
    this.lastFetch.set(instrument.instrumentKey, now)

    return quoteData
  }

  getAdapterName(): string {
    return 'Mock'
  }

  // Generate mock data for multiple instruments
  getMultipleMockQuotes(instruments: Instrument[]): Map<string, QuoteData> {
    const results = new Map<string, QuoteData>()
    
    for (const instrument of instruments) {
      const quote = this.getQuote(instrument)
      if (quote) {
        results.set(instrument.instrumentKey, quote)
      }
    }

    return results
  }

  // Simulate price movement with random walk
  simulatePriceMovement(instrument: Instrument, currentPrice: number, volatility: number = 0.01): number {
    const change = (Math.random() - 0.5) * volatility * currentPrice
    return Math.max(0, currentPrice + change)
  }
}
