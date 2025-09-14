import { QuoteAdapter, QuoteData, Instrument, BondMath } from './quoteAdapter'

export interface FREDResponse {
  realtime_start: string
  realtime_end: string
  observation_start: string
  observation_end: string
  units: string
  output_type: number
  file_type: string
  order_by: string
  sort_order: string
  count: number
  offset: number
  limit: number
  observations: Array<{
    realtime_start: string
    realtime_end: string
    date: string
    value: string
  }>
}

export class FREDTipsAdapter extends QuoteAdapter {
  private baseUrl = 'https://api.stlouisfed.org/fred/series/observations'
  private apiKey: string
  private cache = new Map<string, QuoteData>()
  private lastFetch = new Map<string, number>()
  private readonly CACHE_TTL = 60000 // 60 seconds

  constructor(apiKey?: string) {
    super()
    this.apiKey = apiKey || 'demo' // Use demo key for development
  }

  async getQuote(instrument: Instrument): Promise<QuoteData | null> {
    const series = instrument.pricingHints.yieldSource?.series
    if (!series) return null

    const now = Date.now()
    const cached = this.cache.get(series)
    const lastFetchTime = this.lastFetch.get(series) || 0

    // Return cached data if still fresh
    if (cached && (now - lastFetchTime) < this.CACHE_TTL) {
      return cached
    }

    try {
      const url = `${this.baseUrl}?series_id=${series}&api_key=${this.apiKey}&file_type=json&limit=1&sort_order=desc`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data: FREDResponse = await response.json()
      const observation = data.observations[0]

      if (!observation || observation.value === '.') {
        throw new Error('No yield data available')
      }

      const yieldPct = parseFloat(observation.value)
      if (isNaN(yieldPct)) {
        throw new Error('Invalid yield data')
      }

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
        source: 'FRED',
        asOf: new Date(observation.date).getTime(),
        isLive: true
      }

      this.cache.set(series, quoteData)
      this.lastFetch.set(series, now)

      return quoteData
    } catch (error) {
      console.error(`Failed to fetch TIPS yield for ${series}:`, error)
      return cached || null
    }
  }

  getAdapterName(): string {
    return 'FRED'
  }

  // Mock data for development/testing
  getMockQuote(instrument: Instrument): QuoteData {
    const baseYields: Record<string, number> = {
      'DFII5': 1.85,
      'DFII10': 1.95,
      'DFII30': 2.05,
    }

    const series = instrument.pricingHints.yieldSource?.series || ''
    const baseYield = baseYields[series] || 1.90
    const variation = (Math.random() - 0.5) * 0.05 // ±0.025% variation
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
      source: 'FRED',
      asOf: Date.now(),
      isLive: true
    }
  }
}
