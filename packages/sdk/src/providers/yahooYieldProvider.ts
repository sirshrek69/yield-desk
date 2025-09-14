export interface YieldData {
  symbol: string
  yieldPct: number
  ts: number
  source: 'yahoo'
}

export interface YahooQuoteResponse {
  quoteResponse: {
    result: Array<{
      symbol: string
      regularMarketPrice: number
      regularMarketTime: number
    }>
  }
}

export class YahooYieldProvider {
  private baseUrl = 'https://query1.finance.yahoo.com/v7/finance/quote'
  private cache = new Map<string, YieldData>()
  private lastFetch = new Map<string, number>()
  private readonly CACHE_TTL = 30000 // 30 seconds

  async getYield(symbol: string): Promise<YieldData | null> {
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

      const yieldData: YieldData = {
        symbol,
        yieldPct: result.regularMarketPrice,
        ts: result.regularMarketTime * 1000,
        source: 'yahoo'
      }

      this.cache.set(symbol, yieldData)
      this.lastFetch.set(symbol, now)

      return yieldData
    } catch (error) {
      console.error(`Failed to fetch yield for ${symbol}:`, error)
      return cached || null
    }
  }

  async getMultipleYields(symbols: string[]): Promise<Map<string, YieldData>> {
    const results = new Map<string, YieldData>()
    
    // Process in batches to avoid rate limiting
    const batchSize = 10
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize)
      const promises = batch.map(async (symbol) => {
        const data = await this.getYield(symbol)
        if (data) {
          results.set(symbol, data)
        }
      })
      
      await Promise.all(promises)
      
      // Small delay between batches
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return results
  }

  // Mock data for development/testing
  getMockYield(symbol: string): YieldData {
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

    const baseYield = baseYields[symbol] || 3.0
    const variation = (Math.random() - 0.5) * 0.1 // ±0.05% variation
    const yieldPct = Math.max(0, baseYield + variation)

    return {
      symbol,
      yieldPct: Number(yieldPct.toFixed(3)),
      ts: Date.now(),
      source: 'yahoo'
    }
  }
}
