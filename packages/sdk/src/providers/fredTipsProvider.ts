export interface TIPSData {
  series: string
  yieldPct: number
  ts: number
  source: 'fred'
}

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

export class FREDTipsProvider {
  private baseUrl = 'https://api.stlouisfed.org/fred/series/observations'
  private apiKey: string
  private cache = new Map<string, TIPSData>()
  private lastFetch = new Map<string, number>()
  private readonly CACHE_TTL = 60000 // 60 seconds

  constructor(apiKey?: string) {
    this.apiKey = apiKey || 'demo' // Use demo key for development
  }

  async getTIPSYield(series: string): Promise<TIPSData | null> {
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

      const tipsData: TIPSData = {
        series,
        yieldPct,
        ts: new Date(observation.date).getTime(),
        source: 'fred'
      }

      this.cache.set(series, tipsData)
      this.lastFetch.set(series, now)

      return tipsData
    } catch (error) {
      console.error(`Failed to fetch TIPS yield for ${series}:`, error)
      return cached || null
    }
  }

  async getMultipleTIPSYields(series: string[]): Promise<Map<string, TIPSData>> {
    const results = new Map<string, TIPSData>()
    
    for (const seriesId of series) {
      const data = await this.getTIPSYield(seriesId)
      if (data) {
        results.set(seriesId, data)
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return results
  }

  // Mock data for development/testing
  getMockTIPSYield(series: string): TIPSData {
    const baseYields: Record<string, number> = {
      'DFII5': 1.85,
      'DFII10': 1.95,
      'DFII30': 2.05,
    }

    const baseYield = baseYields[series] || 1.90
    const variation = (Math.random() - 0.5) * 0.05 // ±0.025% variation
    const yieldPct = Math.max(0, baseYield + variation)

    return {
      series,
      yieldPct: Number(yieldPct.toFixed(3)),
      ts: Date.now(),
      source: 'fred'
    }
  }
}
