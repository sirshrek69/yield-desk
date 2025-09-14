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

export class ETFProxyAdapter extends QuoteAdapter {
  private baseUrl = 'https://query1.finance.yahoo.com/v7/finance/quote'
  private cache = new Map<string, QuoteData>()
  private lastFetch = new Map<string, number>()
  private readonly CACHE_TTL = 15000 // 15 seconds

  async getQuote(instrument: Instrument): Promise<QuoteData | null> {
    const symbol = instrument.pricingHints.proxy?.symbol
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
        throw new Error('No price data available')
      }

      const etfPrice = result.regularMarketPrice
      
      // Map ETF price to indicative bond price
      const indicativePrice = this.mapETFToBondPrice(etfPrice, instrument)
      const indicativeYield = BondMath.calculateYTMFromPrice(
        indicativePrice,
        instrument.couponPct,
        instrument.maturityDate
      )

      const bondCalc = BondMath.calculatePriceFromYield(
        instrument.couponPct,
        indicativeYield,
        instrument.maturityDate
      )

      const quoteData: QuoteData = {
        pricePer100: bondCalc.clean,
        ytmPct: bondCalc.ytmPct,
        clean: bondCalc.clean,
        dirty: bondCalc.dirty,
        source: 'Proxy',
        asOf: result.regularMarketTime * 1000,
        isLive: true
      }

      this.cache.set(symbol, quoteData)
      this.lastFetch.set(symbol, now)

      return quoteData
    } catch (error) {
      console.error(`Failed to fetch proxy price for ${symbol}:`, error)
      return cached || null
    }
  }

  getAdapterName(): string {
    return 'ETF Proxy'
  }

  // Map ETF price to indicative bond price
  private mapETFToBondPrice(etfPrice: number, instrument: Instrument): number {
    // ETF price mapping logic
    const basePrice = 100.0
    
    // LQD typically trades around 108-110, HYG around 78-82
    const etfBaseline = instrument.pricingHints.proxy?.symbol === 'LQD' ? 109.0 : 80.0
    const etfSpread = etfPrice - etfBaseline
    
    // Scale ETF movement to bond price (reduced sensitivity)
    const bondSpread = etfSpread * 0.3
    const indicativePrice = basePrice + bondSpread
    
    return Number(indicativePrice.toFixed(2))
  }

  // Mock data for development/testing
  getMockQuote(instrument: Instrument): QuoteData {
    const basePrices: Record<string, number> = {
      'LQD': 108.50, // iShares iBoxx $ Investment Grade Corporate Bond ETF
      'HYG': 78.25,  // iShares iBoxx $ High Yield Corporate Bond ETF
    }

    const symbol = instrument.pricingHints.proxy?.symbol || 'LQD'
    const basePrice = basePrices[symbol] || 100.0
    const variation = (Math.random() - 0.5) * 0.5 // ±0.25% variation
    const etfPrice = Math.max(0, basePrice + variation)

    const indicativePrice = this.mapETFToBondPrice(etfPrice, instrument)
    const indicativeYield = BondMath.calculateYTMFromPrice(
      indicativePrice,
      instrument.couponPct,
      instrument.maturityDate
    )

    const bondCalc = BondMath.calculatePriceFromYield(
      instrument.couponPct,
      indicativeYield,
      instrument.maturityDate
    )

    return {
      pricePer100: bondCalc.clean,
      ytmPct: bondCalc.ytmPct,
      clean: bondCalc.clean,
      dirty: bondCalc.dirty,
      source: 'Proxy',
      asOf: Date.now(),
      isLive: true
    }
  }
}
