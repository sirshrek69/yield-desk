import { QuoteAdapter, QuoteData, Instrument, BondMath } from './quoteAdapter'

export interface YahooQuoteResponse {
  quoteResponse: {
    result: Array<{
      symbol: string
      regularMarketPrice: number
      regularMarketTime: number
    }>
  }
}

export class YahooYieldAdapter extends QuoteAdapter {
  private baseUrl = 'https://query1.finance.yahoo.com/v7/finance/quote'
  private cache = new Map<string, QuoteData>()
  private lastFetch = new Map<string, number>()
  private readonly CACHE_TTL = 30000 // 30 seconds

  async getQuote(instrument: Instrument): Promise<QuoteData | null> {
    const symbol = instrument.pricingHints.yieldSource?.symbol
    if (!symbol) return null

    const now = Date.now()
    const cached = this.cache.get(symbol)
    const lastFetchTime = this.lastFetch.get(symbol) || 0

    // Return cached data if still fresh
    if (cached && (now - lastFetchTime) < this.CACHE_TTL) {
      return cached
    }

    try {
      const url = `${this.baseUrl}?symbols=${symbol}`
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; YieldDesk/1.0)',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data: YahooQuoteResponse = await response.json()
      const result = data.quoteResponse.result[0]

      if (!result || !result.regularMarketPrice) {
        throw new Error('No yield data available')
      }

      const yieldPct = result.regularMarketPrice
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
        source: 'Yahoo',
        asOf: result.regularMarketTime * 1000,
        isLive: true
      }

      this.cache.set(symbol, quoteData)
      this.lastFetch.set(symbol, now)

      return quoteData
    } catch (error) {
      console.error(`Failed to fetch yield for ${symbol}:`, error)
      return cached || null
    }
  }

  getAdapterName(): string {
    return 'Yahoo Finance'
  }

  // Mock data for development/testing
  getMockQuote(instrument: Instrument): QuoteData {
    const baseYields: Record<string, number> = {
      'GB10Y-GB': 4.25,
      'DE10Y-DE': 2.45,
      'FR10Y-FR': 2.85,
      'IT10Y-IT': 3.95,
      'ES10Y-ES': 3.25,
      'NL10Y-NL': 2.75,
      'BE10Y-BE': 2.95,
      'AT10Y-AT': 2.90,
      'IE10Y-IE': 2.75,
      'PT10Y-PT': 3.20,
      'SE10Y-SE': 2.20,
      'DK10Y-DK': 2.20,
      'NO10Y-NO': 2.95,
      'CH10Y-CH': 1.20,
      'JP10Y-JP': 0.85,
      'CA10Y-CA': 3.45,
      'AU10Y-AU': 3.70,
      'NZ10Y-NZ': 3.70,
      'PL10Y-PL': 5.20,
      'MX10Y-MX': 7.95,
    }

    const symbol = instrument.pricingHints.yieldSource?.symbol || ''
    const baseYield = baseYields[symbol] || 3.0
    const variation = (Math.random() - 0.5) * 0.1 // ±0.05% variation
    const yieldPct = Math.max(0, baseYield + variation)

    const bondCalc = BondMath.calculatePriceFromYield(
      instrument.couponPct,
      yieldPct,
      instrument.maturityDate
    )

    return {
      pricePer100: bondCalc.clean,
      ytmPct: bondCalc.ytmPct,
      clean: bondCalc.clean,
      dirty: bondCalc.dirty,
      source: 'Yahoo',
      asOf: Date.now(),
      isLive: true
    }
  }
}
