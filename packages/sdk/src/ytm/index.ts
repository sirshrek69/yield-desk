/**
 * Yield to Maturity (YTM) calculator using Newton-Raphson method
 */

export interface BondParameters {
  faceValue: number // Par value (usually 100)
  currentPrice: number // Clean price
  couponRate: number // Annual coupon rate as decimal (e.g., 0.05 for 5%)
  couponFrequency: number // Payments per year (1, 2, 4, 12)
  yearsToMaturity: number
}

/**
 * Calculate approximate YTM using Newton-Raphson method
 */
export function calculateYTM(params: BondParameters): number {
  const { faceValue, currentPrice, couponRate, couponFrequency, yearsToMaturity } = params
  
  // Initial guess: coupon rate
  let ytm = couponRate
  const tolerance = 1e-6
  const maxIterations = 100
  
  for (let i = 0; i < maxIterations; i++) {
    const price = calculateBondPrice({
      ...params,
      ytm
    })
    
    const priceDiff = price - currentPrice
    
    if (Math.abs(priceDiff) < tolerance) {
      break
    }
    
    // Calculate derivative (duration approximation)
    const ytmUp = ytm + 0.0001
    const priceUp = calculateBondPrice({
      ...params,
      ytm: ytmUp
    })
    
    const derivative = (priceUp - price) / 0.0001
    
    if (Math.abs(derivative) < 1e-10) {
      break // Avoid division by zero
    }
    
    ytm = ytm - priceDiff / derivative
  }
  
  return ytm
}

/**
 * Calculate bond price given YTM
 */
export function calculateBondPrice(params: BondParameters & { ytm: number }): number {
  const { faceValue, couponRate, couponFrequency, yearsToMaturity, ytm } = params
  
  const couponPayment = (faceValue * couponRate) / couponFrequency
  const periods = yearsToMaturity * couponFrequency
  const periodRate = ytm / couponFrequency
  
  // Present value of coupon payments
  let pvCoupons = 0
  if (periodRate > 0) {
    pvCoupons = couponPayment * (1 - Math.pow(1 + periodRate, -periods)) / periodRate
  } else {
    pvCoupons = couponPayment * periods
  }
  
  // Present value of face value
  const pvFaceValue = faceValue / Math.pow(1 + periodRate, periods)
  
  return pvCoupons + pvFaceValue
}
