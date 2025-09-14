import { QuoteAdapter, QuoteData, Instrument } from './quoteAdapter'
import { YahooYieldAdapter } from './yahooYieldAdapter'
import { FREDTipsAdapter } from './fredTipsAdapter'
import { ETFProxyAdapter } from './etfProxyAdapter'
import { MockAdapter } from './mockAdapter'

export class QuoteEngine {
  private adapters: QuoteAdapter[]
  private instruments: Map<string, Instrument> = new Map()
  private quoteCache: Map<string, QuoteData> = new Map()
  private subscribers: Set<(data: QuoteData) => void> = new Set()
  private priceMode: 'live' | 'mock' = 'live'

  constructor(priceMode: 'live' | 'mock' = 'live') {
    this.priceMode = priceMode
    
    // Initialize adapters in priority order
    this.adapters = [
      new YahooYieldAdapter(),
      new FREDTipsAdapter(),
      new ETFProxyAdapter(),
      new MockAdapter()
    ]
  }

  // Load instruments from seed data
  loadInstruments(instruments: Instrument[]) {
    this.instruments.clear()
    instruments.forEach(instrument => {
      this.instruments.set(instrument.instrumentKey, instrument)
    })
  }

  // Subscribe to quote updates
  subscribe(callback: (data: QuoteData) => void) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  // Emit quote to all subscribers
  private emitQuote(data: QuoteData) {
    this.quoteCache.set(data.pricePer100.toString(), data)
    this.subscribers.forEach(callback => callback(data))
  }

  // Get quote for a single instrument
  async getQuote(instrumentKey: string): Promise<QuoteData | null> {
    const instrument = this.instruments.get(instrumentKey)
    if (!instrument) {
      console.error(`Instrument not found: ${instrumentKey}`)
      return null
    }

    // If in mock mode, use mock adapter only
    if (this.priceMode === 'mock') {
      const mockAdapter = this.adapters.find(a => a.getAdapterName() === 'Mock')
      return mockAdapter ? await mockAdapter.getQuote(instrument) : null
    }

    // Try adapters in priority order
    for (const adapter of this.adapters) {
      try {
        const quote = await adapter.getQuote(instrument)
        if (quote) {
          this.emitQuote(quote)
          return quote
        }
      } catch (error) {
        console.error(`Adapter ${adapter.getAdapterName()} failed for ${instrumentKey}:`, error)
        continue
      }
    }

    console.error(`All adapters failed for ${instrumentKey}`)
    return null
  }

  // Get quotes for all instruments
  async getAllQuotes(): Promise<Map<string, QuoteData>> {
    const results = new Map<string, QuoteData>()
    
    for (const instrumentKey of this.instruments.keys()) {
      const quote = await this.getQuote(instrumentKey)
      if (quote) {
        results.set(instrumentKey, quote)
      }
      
      // Small delay to avoid overwhelming external APIs
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    return results
  }

  // Get cached quote for an instrument
  getCachedQuote(instrumentKey: string): QuoteData | null {
    return this.quoteCache.get(instrumentKey) || null
  }

  // Get all cached quotes
  getAllCachedQuotes(): Map<string, QuoteData> {
    return new Map(this.quoteCache)
  }

  // Start continuous quote updates
  startQuoteUpdates(intervalMs: number = 30000) {
    setInterval(async () => {
      await this.getAllQuotes()
    }, intervalMs)
  }

  // Set price mode
  setPriceMode(mode: 'live' | 'mock') {
    this.priceMode = mode
    console.log(`Price mode set to: ${mode}`)
  }

  // Get current price mode
  getPriceMode(): 'live' | 'mock' {
    return this.priceMode
  }

  // Validate that quotes are not all identical (placeholder detection)
  validateQuoteDiversity(): { isValid: boolean; warnings: string[] } {
    const quotes = Array.from(this.quoteCache.values())
    const warnings: string[] = []

    if (quotes.length === 0) {
      warnings.push('No quotes available')
      return { isValid: false, warnings }
    }

    // Check for identical YTM values
    const ytmValues = quotes.map(q => q.ytmPct)
    const uniqueYtmValues = new Set(ytmValues)
    if (uniqueYtmValues.size < quotes.length * 0.1) { // Less than 10% unique values
      warnings.push(`Too many identical YTM values: ${uniqueYtmValues.size} unique out of ${quotes.length}`)
    }

    // Check for identical prices
    const priceValues = quotes.map(q => q.pricePer100)
    const uniquePriceValues = new Set(priceValues)
    if (uniquePriceValues.size < quotes.length * 0.1) { // Less than 10% unique values
      warnings.push(`Too many identical prices: ${uniquePriceValues.size} unique out of ${quotes.length}`)
    }

    // Check for placeholder values
    const placeholderYtmCount = ytmValues.filter(y => y === 3.0).length
    const placeholderPriceCount = priceValues.filter(p => p === 100.0).length
    
    if (placeholderYtmCount > quotes.length * 0.5) {
      warnings.push(`Too many placeholder YTM values (3.00%): ${placeholderYtmCount}`)
    }
    
    if (placeholderPriceCount > quotes.length * 0.5) {
      warnings.push(`Too many placeholder prices (100.00): ${placeholderPriceCount}`)
    }

    return {
      isValid: warnings.length === 0,
      warnings
    }
  }

  // Get adapter statistics
  getAdapterStats(): Record<string, { count: number; lastUpdate: number }> {
    const stats: Record<string, { count: number; lastUpdate: number }> = {}
    
    for (const quote of this.quoteCache.values()) {
      const source = quote.source
      if (!stats[source]) {
        stats[source] = { count: 0, lastUpdate: 0 }
      }
      stats[source].count++
      stats[source].lastUpdate = Math.max(stats[source].lastUpdate, quote.asOf)
    }
    
    return stats
  }
}
