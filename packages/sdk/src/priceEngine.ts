import { YahooYieldProvider, YieldData } from './providers/yahooYieldProvider'
import { FREDTipsProvider, TIPSData } from './providers/fredTipsProvider'
import { YahooProxyPriceProvider, ProxyPriceData } from './providers/yahooProxyPriceProvider'
import { MockProvider, MockPriceData } from './providers/mockProvider'

export interface Instrument {
  group: 'gov' | 'corp' | 'infl'
  instrumentKey: string
  displayName: string
  countryOrIssuer: string
  currency: string
  couponPct: number
  maturityDate: string
  pricingHints: {
    yieldSource?: {
      type: 'yahoo' | 'fred'
      symbol?: string
      series?: string
    }
    proxy?: {
      type: 'yahoo'
      symbol: string
    }
    altSource?: any
  }
}

export interface PriceTick {
  instrumentId: string
  pricePer100: number
  clean: number
  dirty: number
  ytmPct: number
  ts: number
  source: 'yahoo' | 'fred' | 'proxy' | 'mock'
  isLive: boolean
}

export interface BondCalculationParams {
  couponPct: number
  yieldPct: number
  maturityDate: string
  settlementDate?: Date
  frequency?: number // Coupon frequency per year
}

export class PriceEngine {
  private yahooYieldProvider: YahooYieldProvider
  private fredTipsProvider: FREDTipsProvider
  private yahooProxyProvider: YahooProxyPriceProvider
  private mockProvider: MockProvider
  private instruments: Map<string, Instrument> = new Map()
  private priceCache: Map<string, PriceTick> = new Map()
  private subscribers: Set<(tick: PriceTick) => void> = new Set()

  constructor() {
    this.yahooYieldProvider = new YahooYieldProvider()
    this.fredTipsProvider = new FREDTipsProvider()
    this.yahooProxyProvider = new YahooProxyPriceProvider()
    this.mockProvider = new MockProvider()
  }

  // Load instruments from seed data
  loadInstruments(instruments: Instrument[]) {
    this.instruments.clear()
    instruments.forEach(instrument => {
      this.instruments.set(instrument.instrumentKey, instrument)
    })
  }

  // Subscribe to price updates
  subscribe(callback: (tick: PriceTick) => void) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  // Emit price tick to all subscribers
  private emitTick(tick: PriceTick) {
    this.priceCache.set(tick.instrumentId, tick)
    this.subscribers.forEach(callback => callback(tick))
  }

  // Calculate bond price from yield using standard bond math
  calculateBondPrice(params: BondCalculationParams): { clean: number; dirty: number; ytmPct: number } {
    const {
      couponPct,
      yieldPct,
      maturityDate,
      settlementDate = new Date(),
      frequency = 2
    } = params

    const maturity = new Date(maturityDate)
    const couponRate = couponPct / 100
    const yieldRate = yieldPct / 100

    // Calculate time to maturity in years
    const yearsToMaturity = (maturity.getTime() - settlementDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    const periods = Math.ceil(yearsToMaturity * frequency)

    // Calculate clean price (price per 100 notional)
    let cleanPrice = 0
    
    // Present value of coupon payments
    for (let i = 1; i <= periods; i++) {
      const couponPayment = (couponRate / frequency) * 100
      const discountFactor = Math.pow(1 + yieldRate / frequency, i)
      cleanPrice += couponPayment / discountFactor
    }
    
    // Present value of principal
    const principalPayment = 100
    const principalDiscountFactor = Math.pow(1 + yieldRate / frequency, periods)
    cleanPrice += principalPayment / principalDiscountFactor

    // Calculate accrued interest
    const lastCouponDate = this.getLastCouponDate(maturity, settlementDate, frequency)
    const nextCouponDate = this.getNextCouponDate(maturity, settlementDate, frequency)
    const daysSinceLastCoupon = (settlementDate.getTime() - lastCouponDate.getTime()) / (24 * 60 * 60 * 1000)
    const daysInPeriod = (nextCouponDate.getTime() - lastCouponDate.getTime()) / (24 * 60 * 60 * 1000)
    
    const accruedInterest = (couponRate / frequency) * 100 * (daysSinceLastCoupon / daysInPeriod)
    
    // Dirty price = clean price + accrued interest
    const dirtyPrice = cleanPrice + accruedInterest

    return {
      clean: Number(cleanPrice.toFixed(2)),
      dirty: Number(dirtyPrice.toFixed(2)),
      ytmPct: Number(yieldPct.toFixed(3))
    }
  }

  // Get last coupon date
  private getLastCouponDate(maturity: Date, settlement: Date, frequency: number): Date {
    const monthsPerPeriod = 12 / frequency
    let lastCoupon = new Date(maturity)
    
    while (lastCoupon > settlement) {
      lastCoupon.setMonth(lastCoupon.getMonth() - monthsPerPeriod)
    }
    
    return lastCoupon
  }

  // Get next coupon date
  private getNextCouponDate(maturity: Date, settlement: Date, frequency: number): Date {
    const monthsPerPeriod = 12 / frequency
    let nextCoupon = new Date(maturity)
    
    while (nextCoupon <= settlement) {
      nextCoupon.setMonth(nextCoupon.getMonth() + monthsPerPeriod)
    }
    
    return nextCoupon
  }

  // Process a single instrument
  async processInstrument(instrumentKey: string): Promise<PriceTick | null> {
    const instrument = this.instruments.get(instrumentKey)
    if (!instrument) {
      console.error(`Instrument not found: ${instrumentKey}`)
      return null
    }

    try {
      let priceData: PriceTick | null = null

      // Try yield-based pricing first
      if (instrument.pricingHints.yieldSource) {
        const { type, symbol, series } = instrument.pricingHints.yieldSource
        
        if (type === 'yahoo' && symbol) {
          const yieldData = await this.yahooYieldProvider.getYield(symbol)
          if (yieldData) {
            const bondCalc = this.calculateBondPrice({
              couponPct: instrument.couponPct,
              yieldPct: yieldData.yieldPct,
              maturityDate: instrument.maturityDate
            })
            
            priceData = {
              instrumentId: instrumentKey,
              pricePer100: bondCalc.clean,
              clean: bondCalc.clean,
              dirty: bondCalc.dirty,
              ytmPct: bondCalc.ytmPct,
              ts: yieldData.ts,
              source: 'yahoo',
              isLive: true
            }
          }
        } else if (type === 'fred' && series) {
          const tipsData = await this.fredTipsProvider.getTIPSYield(series)
          if (tipsData) {
            const bondCalc = this.calculateBondPrice({
              couponPct: instrument.couponPct,
              yieldPct: tipsData.yieldPct,
              maturityDate: instrument.maturityDate
            })
            
            priceData = {
              instrumentId: instrumentKey,
              pricePer100: bondCalc.clean,
              clean: bondCalc.clean,
              dirty: bondCalc.dirty,
              ytmPct: bondCalc.ytmPct,
              ts: tipsData.ts,
              source: 'fred',
              isLive: true
            }
          }
        }
      }

      // Try proxy-based pricing if yield pricing failed
      if (!priceData && instrument.pricingHints.proxy) {
        const { symbol } = instrument.pricingHints.proxy
        const proxyData = await this.yahooProxyProvider.getProxyPrice(symbol)
        
        if (proxyData) {
          // Map proxy ETF price to indicative bond price
          const indicativePrice = this.mapProxyToBondPrice(proxyData.price, instrument)
          const indicativeYield = this.calculateYTMFromPrice(indicativePrice, instrument)
          
          priceData = {
            instrumentId: instrumentKey,
            pricePer100: indicativePrice,
            clean: indicativePrice,
            dirty: indicativePrice,
            ytmPct: indicativeYield,
            ts: proxyData.ts,
            source: 'proxy',
            isLive: true
          }
        }
      }

      // Fall back to mock data if all else fails
      if (!priceData) {
        const mockData = this.mockProvider.getMockData(instrumentKey, instrument.group)
        const bondCalc = this.calculateBondPrice({
          couponPct: instrument.couponPct,
          yieldPct: mockData.yieldPct,
          maturityDate: instrument.maturityDate
        })
        
        priceData = {
          instrumentId: instrumentKey,
          pricePer100: bondCalc.clean,
          clean: bondCalc.clean,
          dirty: bondCalc.dirty,
          ytmPct: bondCalc.ytmPct,
          ts: mockData.ts,
          source: 'mock',
          isLive: false
        }
      }

      if (priceData) {
        this.emitTick(priceData)
      }

      return priceData
    } catch (error) {
      console.error(`Error processing instrument ${instrumentKey}:`, error)
      return null
    }
  }

  // Map proxy ETF price to indicative bond price
  private mapProxyToBondPrice(proxyPrice: number, instrument: Instrument): number {
    // Simple mapping: assume ETF tracks bond index with some spread
    const basePrice = 100.0
    const spread = (proxyPrice - basePrice) * 0.5 // Scale the ETF movement
    return Number((basePrice + spread).toFixed(2))
  }

  // Calculate YTM from price (reverse calculation)
  private calculateYTMFromPrice(price: number, instrument: Instrument): number {
    // Simplified YTM calculation - in practice would use iterative methods
    const couponPct = instrument.couponPct
    const maturity = new Date(instrument.maturityDate)
    const settlement = new Date()
    const yearsToMaturity = (maturity.getTime() - settlement.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    
    // Approximate YTM using simplified formula
    const annualCoupon = couponPct
    const faceValue = 100
    const approximateYTM = (annualCoupon + (faceValue - price) / yearsToMaturity) / ((faceValue + price) / 2)
    
    return Number((approximateYTM * 100).toFixed(3))
  }

  // Process all instruments
  async processAllInstruments(): Promise<PriceTick[]> {
    const results: PriceTick[] = []
    
    for (const instrumentKey of this.instruments.keys()) {
      const tick = await this.processInstrument(instrumentKey)
      if (tick) {
        results.push(tick)
      }
      
      // Small delay to avoid overwhelming external APIs
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    return results
  }

  // Get cached price for an instrument
  getCachedPrice(instrumentKey: string): PriceTick | null {
    return this.priceCache.get(instrumentKey) || null
  }

  // Get all cached prices
  getAllCachedPrices(): PriceTick[] {
    return Array.from(this.priceCache.values())
  }

  // Start continuous price updates
  startPriceUpdates(intervalMs: number = 30000) {
    setInterval(async () => {
      await this.processAllInstruments()
    }, intervalMs)
  }
}
