export interface ProxyPriceData {
  symbol: string
  price: number
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

export class YahooProxyPriceProvider {
  private baseUrl = 'https://query1.finance.yahoo.com/v7/finance/quote'
  private cache = new Map<string, ProxyPriceData>()
  private lastFetch = new Map<string, number>()
  private readonly CACHE_TTL = 15000 // 15 seconds

  async getProxyPrice(symbol: string): Promise<ProxyPriceData | null> {
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

      const priceData: ProxyPriceData = {
        symbol,
        price: result.regularMarketPrice,
        ts: result.regularMarketTime * 1000,
        source: 'yahoo'
      }

      this.cache.set(symbol, priceData)
      this.lastFetch.set(symbol, now)

      return priceData
    } catch (error) {
      console.error(`Failed to fetch proxy price for ${symbol}:`, error)
      return cached || null
    }
  }

  async getMultipleProxyPrices(symbols: string[]): Promise<Map<string, ProxyPriceData>> {
    const results = new Map<string, ProxyPriceData>()
    
    // Process in batches to avoid rate limiting
    const batchSize = 5
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize)
      const promises = batch.map(async (symbol) => {
        const data = await this.getProxyPrice(symbol)
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
  getMockProxyPrice(symbol: string): ProxyPriceData {
    const basePrices: Record<string, number> = {
      'LQD': 108.50, // iShares iBoxx $ Investment Grade Corporate Bond ETF
      'HYG': 78.25,  // iShares iBoxx $ High Yield Corporate Bond ETF
    }

    const basePrice = basePrices[symbol] || 100.0
    const variation = (Math.random() - 0.5) * 0.5 // ±0.25% variation
    const price = Math.max(0, basePrice + variation)

    return {
      symbol,
      price: Number(price.toFixed(2)),
      ts: Date.now(),
      source: 'yahoo'
    }
  }
}
