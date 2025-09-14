export interface QuoteData {
  pricePer100: number
  ytmPct: number
  clean: number
  dirty: number
  source: string
  asOf: number
  isLive: boolean
}

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

export abstract class QuoteAdapter {
  abstract getQuote(instrument: Instrument): Promise<QuoteData | null>
  abstract getAdapterName(): string
}

// Bond math utilities
export class BondMath {
  static calculatePriceFromYield(
    couponPct: number,
    yieldPct: number,
    maturityDate: string,
    settlementDate: Date = new Date(),
    frequency: number = 2
  ): { clean: number; dirty: number; ytmPct: number } {
    const couponRate = couponPct / 100
    const yieldRate = yieldPct / 100
    const maturity = new Date(maturityDate)
    const yearsToMaturity = (maturity.getTime() - settlementDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    
    // Calculate clean price
    let cleanPrice = 0
    const periods = Math.ceil(yearsToMaturity * frequency)
    
    for (let i = 1; i <= periods; i++) {
      const couponPayment = (couponRate / frequency) * 100
      const discountFactor = Math.pow(1 + yieldRate / frequency, i)
      cleanPrice += couponPayment / discountFactor
    }
    
    cleanPrice += 100 / Math.pow(1 + yieldRate / frequency, periods)
    
    // Calculate accrued interest
    const lastCouponDate = this.getLastCouponDate(maturity, settlementDate, frequency)
    const nextCouponDate = this.getNextCouponDate(maturity, settlementDate, frequency)
    const daysSinceLastCoupon = (settlementDate.getTime() - lastCouponDate.getTime()) / (24 * 60 * 60 * 1000)
    const daysInPeriod = (nextCouponDate.getTime() - lastCouponDate.getTime()) / (24 * 60 * 60 * 1000)
    
    const accruedInterest = (couponRate / frequency) * 100 * (daysSinceLastCoupon / daysInPeriod)
    const dirtyPrice = cleanPrice + accruedInterest

    return {
      clean: Number(cleanPrice.toFixed(2)),
      dirty: Number(dirtyPrice.toFixed(2)),
      ytmPct: Number(yieldPct.toFixed(3))
    }
  }

  static calculateYTMFromPrice(
    price: number,
    couponPct: number,
    maturityDate: string,
    settlementDate: Date = new Date(),
    frequency: number = 2
  ): number {
    // Simplified YTM calculation - in practice would use iterative methods
    const couponRate = couponPct / 100
    const maturity = new Date(maturityDate)
    const yearsToMaturity = (maturity.getTime() - settlementDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    
    // Approximate YTM using simplified formula
    const annualCoupon = couponRate * 100
    const faceValue = 100
    const approximateYTM = (annualCoupon + (faceValue - price) / yearsToMaturity) / ((faceValue + price) / 2)
    
    return Number((approximateYTM * 100).toFixed(3))
  }

  private static getLastCouponDate(maturity: Date, settlement: Date, frequency: number): Date {
    const monthsPerPeriod = 12 / frequency
    let lastCoupon = new Date(maturity)
    
    while (lastCoupon > settlement) {
      lastCoupon.setMonth(lastCoupon.getMonth() - monthsPerPeriod)
    }
    
    return lastCoupon
  }

  private static getNextCouponDate(maturity: Date, settlement: Date, frequency: number): Date {
    const monthsPerPeriod = 12 / frequency
    let nextCoupon = new Date(maturity)
    
    while (nextCoupon <= settlement) {
      nextCoupon.setMonth(nextCoupon.getMonth() + monthsPerPeriod)
    }
    
    return nextCoupon
  }
}
