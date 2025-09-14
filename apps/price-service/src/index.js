import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createServer } from 'http'
import { Server } from 'socket.io'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const PORT = 4001

app.use(cors())
app.use(express.json())

// Load instruments data
const instrumentsPath = join(__dirname, '../../../packages/sdk/src/assets/instrument-seed.json')
const instruments = JSON.parse(readFileSync(instrumentsPath, 'utf8'))

// Load ratings data
const ratingsPath = join(__dirname, '../../../packages/sdk/src/assets/ratings-data.json')
const ratingsData = JSON.parse(readFileSync(ratingsPath, 'utf8'))

// Load primary deals data
const primaryDealsPath = join(__dirname, '../../../packages/sdk/src/assets/primary-deals.json')
const primaryDeals = JSON.parse(readFileSync(primaryDealsPath, 'utf8'))

// In-memory storage for primary deal interests (in production, use a database)
const primaryDealInterests = []

// Platform minimum in USD (fallback when issuer minimum is unknown)
const PLATFORM_MIN_USD = 1000

// Currency conversion rates (simplified - in production would use live FX)
const CURRENCY_RATES = {
  'USD': 1.0,
  'EUR': 1.08,
  'GBP': 1.27,
  'JPY': 0.0067,
  'CAD': 0.74,
  'AUD': 0.66,
  'NZD': 0.61,
  'CHF': 1.12,
  'SEK': 0.093,
  'DKK': 0.145,
  'NOK': 0.093,
  'PLN': 0.25,
  'MXN': 0.059,
  'BRL': 0.20,
  'CLP': 0.0011,
  'ILS': 0.27,
}

// Helper function to convert currency to USD
function convertToUSD(amount, fromCurrency) {
  const rate = CURRENCY_RATES[fromCurrency] || 1.0
  return amount * rate
}

// Helper function to calculate minimum investment display
function calculateMinInvestmentDisplay(instrument) {
  if (instrument.issuerMinFace && instrument.faceIncrement) {
    // Has issuer minimum
    const issuerMinUSD = convertToUSD(instrument.issuerMinFace, instrument.faceCurrency)
    const incrementUSD = convertToUSD(instrument.faceIncrement, instrument.faceCurrency)
    
    return {
      type: 'issuer',
      issuerMinUSD: Number(issuerMinUSD.toFixed(2)),
      incrementUSD: Number(incrementUSD.toFixed(2)),
      issuerMinFace: instrument.issuerMinFace,
      faceIncrement: instrument.faceIncrement,
      faceCurrency: instrument.faceCurrency
    }
  } else {
    // Use platform minimum
    return {
      type: 'platform',
      platformMinUSD: PLATFORM_MIN_USD
    }
  }
}

// Helper function to get rating for instrument
function getRatingForInstrument(instrument) {
  const { group, countryCode, issuerTicker } = instrument
  
  let ratingScope, ratingKey
  
  if (group === 'gov' || group === 'infl') {
    // Government bonds and inflation-protected use sovereign ratings
    ratingScope = 'sovereign'
    ratingKey = countryCode
  } else if (group === 'corp') {
    // Corporate bonds use issuer ratings
    ratingScope = 'issuer'
    ratingKey = issuerTicker
  } else {
    return null
  }
  
  const ratingData = ratingsData[ratingScope]?.[ratingKey]
  
  if (!ratingData) {
    return null // Hide rating if unknown
  }
  
  return {
    ratingScope,
    ratingMoody: ratingData.moody,
    ratingSnp: ratingData.snp,
    ratingFitch: ratingData.fitch,
    ratingAsOf: ratingData.asOf,
    ratingComposite: ratingData.composite
  }
}

// Live Quote Engine with adapter chain
class LiveQuoteEngine {
  constructor() {
    this.instruments = new Map()
    this.quoteCache = new Map()
    this.subscribers = new Set()
    this.priceMode = process.env.PRICE_MODE || 'live'
    
    // Load instruments
    instruments.forEach(instrument => {
      this.instruments.set(instrument.instrumentKey, instrument)
    })
    
    console.log(`Quote Engine initialized in ${this.priceMode} mode`)
  }

  subscribe(callback) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  emitQuote(quoteData) {
    this.quoteCache.set(quoteData.instrumentId, quoteData)
    this.subscribers.forEach(callback => callback(quoteData))
  }

  // Bond math calculations
  calculateBondPrice(params) {
    const { couponPct, yieldPct, maturityDate } = params
    const couponRate = couponPct / 100
    const yieldRate = yieldPct / 100
    const maturity = new Date(maturityDate)
    const settlement = new Date()
    const yearsToMaturity = (maturity.getTime() - settlement.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    
    // Calculate clean price
    let cleanPrice = 0
    const periods = Math.ceil(yearsToMaturity * 2) // Semi-annual
    
    for (let i = 1; i <= periods; i++) {
      const couponPayment = (couponRate / 2) * 100
      const discountFactor = Math.pow(1 + yieldRate / 2, i)
      cleanPrice += couponPayment / discountFactor
    }
    
    cleanPrice += 100 / Math.pow(1 + yieldRate / 2, periods)
    
    // Calculate accrued interest
    const lastCouponDate = this.getLastCouponDate(maturity, settlement, 2)
    const nextCouponDate = this.getNextCouponDate(maturity, settlement, 2)
    const daysSinceLastCoupon = (settlement.getTime() - lastCouponDate.getTime()) / (24 * 60 * 60 * 1000)
    const daysInPeriod = (nextCouponDate.getTime() - lastCouponDate.getTime()) / (24 * 60 * 60 * 1000)
    
    const accruedInterest = (couponRate / 2) * 100 * (daysSinceLastCoupon / daysInPeriod)
    const dirtyPrice = cleanPrice + accruedInterest
    
    return {
      clean: Number(cleanPrice.toFixed(2)),
      dirty: Number(dirtyPrice.toFixed(2)),
      ytmPct: Number(yieldPct.toFixed(3))
    }
  }

  getLastCouponDate(maturity, settlement, frequency) {
    const monthsPerPeriod = 12 / frequency
    let lastCoupon = new Date(maturity)
    
    while (lastCoupon > settlement) {
      lastCoupon.setMonth(lastCoupon.getMonth() - monthsPerPeriod)
    }
    
    return lastCoupon
  }

  getNextCouponDate(maturity, settlement, frequency) {
    const monthsPerPeriod = 12 / frequency
    let nextCoupon = new Date(maturity)
    
    while (nextCoupon <= settlement) {
      nextCoupon.setMonth(nextCoupon.getMonth() + monthsPerPeriod)
    }
    
    return nextCoupon
  }

  // Adapter chain for getting quotes
  async getQuote(instrumentKey) {
    const instrument = this.instruments.get(instrumentKey)
    if (!instrument) return null

    // Try Yahoo Finance yield adapter first
    if (instrument.pricingHints.yieldSource?.type === 'yahoo') {
      try {
        const symbol = instrument.pricingHints.yieldSource.symbol
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`
        const response = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YieldDesk/1.0)' }
        })
        
        if (response.ok) {
          const data = await response.json()
          const result = data.quoteResponse.result[0]
          
          if (result && result.regularMarketPrice) {
            const yieldPct = result.regularMarketPrice
            const bondCalc = this.calculateBondPrice({
              couponPct: instrument.couponPct,
              yieldPct: yieldPct,
              maturityDate: instrument.maturityDate
            })
            
            return {
              instrumentId: instrumentKey,
              pricePer100: bondCalc.clean,
              clean: bondCalc.clean,
              dirty: bondCalc.dirty,
              ytmPct: bondCalc.ytmPct,
              ts: result.regularMarketTime * 1000,
              source: 'Yahoo',
              isLive: true
            }
          }
        }
      } catch (error) {
        console.error(`Yahoo adapter failed for ${instrumentKey}:`, error)
      }
    }

    // Try FRED TIPS adapter
    if (instrument.pricingHints.yieldSource?.type === 'fred') {
      try {
        const series = instrument.pricingHints.yieldSource.series
        const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=demo&file_type=json&limit=1&sort_order=desc`
        const response = await fetch(url)
        
        if (response.ok) {
          const data = await response.json()
          const observation = data.observations[0]
          
          if (observation && observation.value !== '.') {
            const yieldPct = parseFloat(observation.value)
            const bondCalc = this.calculateBondPrice({
              couponPct: instrument.couponPct,
              yieldPct: yieldPct,
              maturityDate: instrument.maturityDate
            })
            
            return {
              instrumentId: instrumentKey,
              pricePer100: bondCalc.clean,
              clean: bondCalc.clean,
              dirty: bondCalc.dirty,
              ytmPct: bondCalc.ytmPct,
              ts: new Date(observation.date).getTime(),
              source: 'FRED',
              isLive: true
            }
          }
        }
      } catch (error) {
        console.error(`FRED adapter failed for ${instrumentKey}:`, error)
      }
    }

    // Try ETF proxy adapter
    if (instrument.pricingHints.proxy?.type === 'yahoo') {
      try {
        const symbol = instrument.pricingHints.proxy.symbol
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`
        const response = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YieldDesk/1.0)' }
        })
        
        if (response.ok) {
          const data = await response.json()
          const result = data.quoteResponse.result[0]
          
          if (result && result.regularMarketPrice) {
            const etfPrice = result.regularMarketPrice
            const indicativePrice = this.mapETFToBondPrice(etfPrice, instrument)
            const indicativeYield = this.calculateYTMFromPrice(indicativePrice, instrument)
            
            const bondCalc = this.calculateBondPrice({
              couponPct: instrument.couponPct,
              yieldPct: indicativeYield,
              maturityDate: instrument.maturityDate
            })
            
            return {
              instrumentId: instrumentKey,
              pricePer100: bondCalc.clean,
              clean: bondCalc.clean,
              dirty: bondCalc.dirty,
              ytmPct: bondCalc.ytmPct,
              ts: result.regularMarketTime * 1000,
              source: 'Proxy',
              isLive: true
            }
          }
        }
      } catch (error) {
        console.error(`Proxy adapter failed for ${instrumentKey}:`, error)
      }
    }

    // Fallback to mock data
    const baseYields = {
      'gov': 2.5 + Math.random() * 2.0,
      'corp': 4.0 + Math.random() * 3.0,
      'infl': 1.5 + Math.random() * 1.0
    }
    
    const yieldPct = baseYields[instrument.group] || 3.0
    const bondCalc = this.calculateBondPrice({
      couponPct: instrument.couponPct,
      yieldPct: yieldPct,
      maturityDate: instrument.maturityDate
    })

    return {
      instrumentId: instrumentKey,
      pricePer100: bondCalc.clean,
      clean: bondCalc.clean,
      dirty: bondCalc.dirty,
      ytmPct: bondCalc.ytmPct,
      ts: Date.now(),
      source: 'Indicative',
      isLive: false
    }
  }

  mapETFToBondPrice(etfPrice, instrument) {
    const basePrice = 100.0
    const etfBaseline = instrument.pricingHints.proxy?.symbol === 'LQD' ? 109.0 : 80.0
    const etfSpread = etfPrice - etfBaseline
    const bondSpread = etfSpread * 0.3
    return Number((basePrice + bondSpread).toFixed(2))
  }

  calculateYTMFromPrice(price, instrument) {
    const couponRate = instrument.couponPct / 100
    const maturity = new Date(instrument.maturityDate)
    const settlement = new Date()
    const yearsToMaturity = (maturity.getTime() - settlement.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    
    const annualCoupon = couponRate * 100
    const faceValue = 100
    const approximateYTM = (annualCoupon + (faceValue - price) / yearsToMaturity) / ((faceValue + price) / 2)
    
    return Number((approximateYTM * 100).toFixed(3))
  }

  async processAllInstruments() {
    const results = []
    for (const instrumentKey of this.instruments.keys()) {
      const quote = await this.getQuote(instrumentKey)
      if (quote) {
        results.push(quote)
        this.emitQuote(quote)
      }
      
      // Small delay to avoid overwhelming external APIs
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return results
  }

  getCachedPrice(instrumentKey) {
    return this.quoteCache.get(instrumentKey) || null
  }

  getAllCachedPrices() {
    return Array.from(this.quoteCache.values())
  }

  // Validation for placeholder detection
  validateQuoteDiversity() {
    const quotes = Array.from(this.quoteCache.values())
    const warnings = []

    if (quotes.length === 0) {
      warnings.push('No quotes available')
      return { isValid: false, warnings }
    }

    // Check for identical YTM values
    const ytmValues = quotes.map(q => q.ytmPct)
    const uniqueYtmValues = new Set(ytmValues)
    if (uniqueYtmValues.size < quotes.length * 0.1) {
      warnings.push(`Too many identical YTM values: ${uniqueYtmValues.size} unique out of ${quotes.length}`)
    }

    // Check for identical prices
    const priceValues = quotes.map(q => q.pricePer100)
    const uniquePriceValues = new Set(priceValues)
    if (uniquePriceValues.size < quotes.length * 0.1) {
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
}

const quoteEngine = new LiveQuoteEngine()

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  // Send initial prices
  const initialPrices = quoteEngine.getAllCachedPrices()
  socket.emit('price-update', initialPrices)
  
  // Subscribe to price updates
  const unsubscribe = quoteEngine.subscribe((quote) => {
    socket.emit('price-tick', quote)
  })
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
    unsubscribe()
  })
})

// Routes
app.get('/instruments', (req, res) => {
  res.json({ instruments })
})

app.get('/instruments/:group', (req, res) => {
  const group = req.params.group
  const groupInstruments = instruments.filter(i => i.group === group)
  res.json({ instruments: groupInstruments })
})

app.get('/prices', (req, res) => {
  const prices = quoteEngine.getAllCachedPrices()
  res.json({ prices })
})

app.get('/price/:instrumentKey', (req, res) => {
  const price = quoteEngine.getCachedPrice(req.params.instrumentKey)
  if (!price) {
    return res.status(404).json({ error: 'Price not found' })
  }
  res.json(price)
})

// Updated products endpoint with live pricing
app.get('/products', async (req, res) => {
  try {
    const prices = quoteEngine.getAllCachedPrices()
    const priceMap = new Map(prices.map(p => [p.instrumentId, p]))
    
    // Convert instruments to old product format with live pricing
    const products = instruments.map(instrument => {
      const price = priceMap.get(instrument.instrumentKey)
      const minInvestment = calculateMinInvestmentDisplay(instrument)
      const rating = getRatingForInstrument(instrument)
      
      return {
        id: instrument.instrumentKey,
        category: instrument.group === 'gov' ? 'Government Bonds' : 
                  instrument.group === 'corp' ? 'Corporate Bonds' : 'Inflation-Protected',
        name: instrument.displayName,
        issuer: instrument.countryOrIssuer,
        currency: instrument.currency,
        rating: rating ? {
          sp: rating.ratingSnp,
          moodys: rating.ratingMoody,
          fitch: rating.ratingFitch,
          composite: rating.ratingComposite,
          asOf: rating.ratingAsOf,
          scope: rating.ratingScope
        } : null, // Hide rating if unknown
        couponType: 'Fixed',
        couponRatePct: instrument.couponPct,
        couponFrequency: 'SemiAnnual',
        maturityDate: instrument.maturityDate,
        priceClean: price ? price.pricePer100 : 100.0,
        ytmPct: price ? price.ytmPct : 3.0,
        // New minimum investment fields
        faceCurrency: instrument.faceCurrency,
        issuerMinFace: instrument.issuerMinFace,
        faceIncrement: instrument.faceIncrement,
        countryCode: instrument.countryCode,
        minInvestment: minInvestment.type === 'issuer' ? minInvestment.issuerMinUSD : minInvestment.platformMinUSD,
        increment: minInvestment.type === 'issuer' ? minInvestment.incrementUSD : 1000,
        minInvestmentDisplay: minInvestment,
        // New expansion fields
        tenor: instrument.tenor,
        isOnTheRun: instrument.isOnTheRun,
        issuerTicker: instrument.issuerTicker,
        raise: {
          status: 'Open',
          softCap: 1000000,
          hardCap: 5000000,
          amountCommitted: 2500000,
          start: new Date().toISOString(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        chainId: 84532,
        tokenAddress: null,
        decimals: 8,
        docs: [],
        // Add live pricing metadata
        livePricing: price ? {
          source: price.source,
          lastUpdate: price.ts,
          isLive: price.isLive,
          dirty: price.dirty
        } : null
      }
    })
    
    res.json({ products })
  } catch (error) {
    console.error('Error in /products endpoint:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/product/:id', async (req, res) => {
  try {
    const instrument = instruments.find(i => i.instrumentKey === req.params.id)
    if (!instrument) {
      return res.status(404).json({ error: 'Product not found' })
    }
    
    const price = quoteEngine.getCachedPrice(req.params.id)
    const minInvestment = calculateMinInvestmentDisplay(instrument)
    const rating = getRatingForInstrument(instrument)
    
    // Convert to old format with live pricing
    const legacyProduct = {
      id: instrument.instrumentKey,
      category: instrument.group === 'gov' ? 'Government Bonds' : 
                instrument.group === 'corp' ? 'Corporate Bonds' : 'Inflation-Protected',
      name: instrument.displayName,
      issuer: instrument.countryOrIssuer,
      currency: instrument.currency,
      rating: rating ? {
        sp: rating.ratingSnp,
        moodys: rating.ratingMoody,
        fitch: rating.ratingFitch,
        composite: rating.ratingComposite,
        asOf: rating.ratingAsOf,
        scope: rating.ratingScope
      } : null, // Hide rating if unknown
      couponType: 'Fixed',
      couponRatePct: instrument.couponPct,
      couponFrequency: 'SemiAnnual',
      maturityDate: instrument.maturityDate,
      priceClean: price ? price.pricePer100 : 100.0,
      ytmPct: price ? price.ytmPct : 3.0,
      // New minimum investment fields
      faceCurrency: instrument.faceCurrency,
      issuerMinFace: instrument.issuerMinFace,
      faceIncrement: instrument.faceIncrement,
      countryCode: instrument.countryCode,
      minInvestment: minInvestment.type === 'issuer' ? minInvestment.issuerMinUSD : minInvestment.platformMinUSD,
      increment: minInvestment.type === 'issuer' ? minInvestment.incrementUSD : 1000,
      minInvestmentDisplay: minInvestment,
      // New expansion fields
      tenor: instrument.tenor,
      isOnTheRun: instrument.isOnTheRun,
      issuerTicker: instrument.issuerTicker,
      raise: {
        status: 'Open',
        softCap: 1000000,
        hardCap: 5000000,
        amountCommitted: 2500000,
        start: new Date().toISOString(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      chainId: 84532,
      tokenAddress: null,
      decimals: 8,
      docs: [],
      // Add live pricing metadata
      livePricing: price ? {
        source: price.source,
        lastUpdate: price.ts,
        isLive: price.isLive,
        dirty: price.dirty
      } : null
    }
    
    res.json({ product: legacyProduct })
  } catch (error) {
    console.error('Error in /product/:id endpoint:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Health check with validation
app.get('/health', (req, res) => {
  const validation = quoteEngine.validateQuoteDiversity()
  const prices = quoteEngine.getAllCachedPrices()
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    instruments: instruments.length,
    prices: prices.length,
    priceMode: quoteEngine.priceMode,
    validation: validation,
    sources: [...new Set(prices.map(p => p.source))]
  })
})

// Start price updates
setInterval(async () => {
  await quoteEngine.processAllInstruments()
}, 30000) // Update every 30 seconds

// Initial price load
quoteEngine.processAllInstruments()

// Primary Corporate Issuance endpoints
app.get('/primary-deals', (req, res) => {
  try {
    res.json({ deals: primaryDeals })
  } catch (error) {
    console.error('Error in /primary-deals endpoint:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/primary-deals/:id', (req, res) => {
  try {
    const deal = primaryDeals.find(d => d.id === req.params.id)
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' })
    }
    res.json({ deal })
  } catch (error) {
    console.error('Error in /primary-deals/:id endpoint:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/primary-deals/:id/interest', (req, res) => {
  try {
    const { userId, amountUSD } = req.body
    const dealId = req.params.id
    
    // Validate deal exists
    const deal = primaryDeals.find(d => d.id === dealId)
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' })
    }
    
    // Store interest (non-binding)
    const interest = {
      id: `interest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId || 'anonymous',
      dealId,
      amountUSD: amountUSD || 0,
      createdAt: new Date().toISOString()
    }
    
    primaryDealInterests.push(interest)
    
    res.json({ 
      success: true, 
      interest,
      message: 'Interest registered successfully (non-binding)'
    })
  } catch (error) {
    console.error('Error in /primary-deals/:id/interest endpoint:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

server.listen(PORT, () => {
  console.log(`Price service running on http://localhost:${PORT}`)
  console.log(`WebSocket server ready for connections`)
  console.log(`Loaded ${instruments.length} instruments`)
  console.log(`Price mode: ${quoteEngine.priceMode}`)
  console.log(`Primary deals: http://localhost:${PORT}/primary-deals`)
})