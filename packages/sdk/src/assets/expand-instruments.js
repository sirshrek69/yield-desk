const { readFileSync, writeFileSync } = require('fs')

// Read current instruments
const instrumentsPath = './instrument-seed.json'
const instruments = JSON.parse(readFileSync(instrumentsPath, 'utf8'))

// Government bond tenor expansion
const GOV_TENOR_EXPANSION = {
  // UK Gilts
  'GB_GILT_1Y_OTR': { tenor: '1Y', isOnTheRun: true, maturityDate: '2026-01-15', couponPct: 4.25 },
  'GB_GILT_2Y_OTR': { tenor: '2Y', isOnTheRun: true, maturityDate: '2027-01-15', couponPct: 3.75 },
  'GB_GILT_3Y_OTR': { tenor: '3Y', isOnTheRun: true, maturityDate: '2028-01-15', couponPct: 3.60 },
  'GB_GILT_5Y_OTR': { tenor: '5Y', isOnTheRun: true, maturityDate: '2030-01-15', couponPct: 3.45 },
  'GB_GILT_7Y_OTR': { tenor: '7Y', isOnTheRun: true, maturityDate: '2032-01-15', couponPct: 3.40 },
  'GB_GILT_20Y_OTR': { tenor: '20Y', isOnTheRun: true, maturityDate: '2045-01-15', couponPct: 3.25 },
  'GB_GILT_30Y_OTR': { tenor: '30Y', isOnTheRun: true, maturityDate: '2055-01-15', couponPct: 3.20 },
  'GB_GILT_40Y_OTR': { tenor: '40Y', isOnTheRun: true, maturityDate: '2065-01-15', couponPct: 3.15 },

  // German Bunds
  'DE_BUND_1Y_OTR': { tenor: '1Y', isOnTheRun: true, maturityDate: '2026-01-15', couponPct: 3.20 },
  'DE_BUND_2Y_OTR': { tenor: '2Y', isOnTheRun: true, maturityDate: '2027-01-15', couponPct: 2.90 },
  'DE_BUND_3Y_OTR': { tenor: '3Y', isOnTheRun: true, maturityDate: '2028-01-15', couponPct: 2.75 },
  'DE_BUND_5Y_OTR': { tenor: '5Y', isOnTheRun: true, maturityDate: '2030-01-15', couponPct: 2.65 },
  'DE_BUND_7Y_OTR': { tenor: '7Y', isOnTheRun: true, maturityDate: '2032-01-15', couponPct: 2.60 },
  'DE_BUND_20Y_OTR': { tenor: '20Y', isOnTheRun: true, maturityDate: '2045-01-15', couponPct: 2.45 },
  'DE_BUND_30Y_OTR': { tenor: '30Y', isOnTheRun: true, maturityDate: '2055-01-15', couponPct: 2.40 },

  // French OATs
  'FR_OAT_1Y_OTR': { tenor: '1Y', isOnTheRun: true, maturityDate: '2026-01-15', couponPct: 3.45 },
  'FR_OAT_2Y_OTR': { tenor: '2Y', isOnTheRun: true, maturityDate: '2027-01-15', couponPct: 3.15 },
  'FR_OAT_3Y_OTR': { tenor: '3Y', isOnTheRun: true, maturityDate: '2028-01-15', couponPct: 3.00 },
  'FR_OAT_5Y_OTR': { tenor: '5Y', isOnTheRun: true, maturityDate: '2030-01-15', couponPct: 2.90 },
  'FR_OAT_7Y_OTR': { tenor: '7Y', isOnTheRun: true, maturityDate: '2032-01-15', couponPct: 2.85 },
  'FR_OAT_20Y_OTR': { tenor: '20Y', isOnTheRun: true, maturityDate: '2045-01-15', couponPct: 2.70 },
  'FR_OAT_30Y_OTR': { tenor: '30Y', isOnTheRun: true, maturityDate: '2055-01-15', couponPct: 2.65 },

  // Italian BTPs
  'IT_BTP_1Y_OTR': { tenor: '1Y', isOnTheRun: true, maturityDate: '2026-01-15', couponPct: 4.50 },
  'IT_BTP_2Y_OTR': { tenor: '2Y', isOnTheRun: true, maturityDate: '2027-01-15', couponPct: 4.25 },
  'IT_BTP_3Y_OTR': { tenor: '3Y', isOnTheRun: true, maturityDate: '2028-01-15', couponPct: 4.10 },
  'IT_BTP_5Y_OTR': { tenor: '5Y', isOnTheRun: true, maturityDate: '2030-01-15', couponPct: 4.05 },
  'IT_BTP_7Y_OTR': { tenor: '7Y', isOnTheRun: true, maturityDate: '2032-01-15', couponPct: 4.00 },
  'IT_BTP_20Y_OTR': { tenor: '20Y', isOnTheRun: true, maturityDate: '2045-01-15', couponPct: 3.85 },
  'IT_BTP_30Y_OTR': { tenor: '30Y', isOnTheRun: true, maturityDate: '2055-01-15', couponPct: 3.80 },

  // Japanese JGBs
  'JP_JGB_1Y_OTR': { tenor: '1Y', isOnTheRun: true, maturityDate: '2026-01-15', couponPct: 0.25 },
  'JP_JGB_2Y_OTR': { tenor: '2Y', isOnTheRun: true, maturityDate: '2027-01-15', couponPct: 0.30 },
  'JP_JGB_3Y_OTR': { tenor: '3Y', isOnTheRun: true, maturityDate: '2028-01-15', couponPct: 0.35 },
  'JP_JGB_5Y_OTR': { tenor: '5Y', isOnTheRun: true, maturityDate: '2030-01-15', couponPct: 0.40 },
  'JP_JGB_7Y_OTR': { tenor: '7Y', isOnTheRun: true, maturityDate: '2032-01-15', couponPct: 0.45 },
  'JP_JGB_20Y_OTR': { tenor: '20Y', isOnTheRun: true, maturityDate: '2045-01-15', couponPct: 0.60 },
  'JP_JGB_30Y_OTR': { tenor: '30Y', isOnTheRun: true, maturityDate: '2055-01-15', couponPct: 0.65 },
  'JP_JGB_40Y_OTR': { tenor: '40Y', isOnTheRun: true, maturityDate: '2065-01-15', couponPct: 0.70 },

  // US Treasury (add to existing)
  'US_TREASURY_1Y_OTR': { tenor: '1Y', isOnTheRun: true, maturityDate: '2026-01-15', couponPct: 4.75 },
  'US_TREASURY_2Y_OTR': { tenor: '2Y', isOnTheRun: true, maturityDate: '2027-01-15', couponPct: 4.50 },
  'US_TREASURY_3Y_OTR': { tenor: '3Y', isOnTheRun: true, maturityDate: '2028-01-15', couponPct: 4.35 },
  'US_TREASURY_5Y_OTR': { tenor: '5Y', isOnTheRun: true, maturityDate: '2030-01-15', couponPct: 4.25 },
  'US_TREASURY_7Y_OTR': { tenor: '7Y', isOnTheRun: true, maturityDate: '2032-01-15', couponPct: 4.20 },
  'US_TREASURY_20Y_OTR': { tenor: '20Y', isOnTheRun: true, maturityDate: '2045-01-15', couponPct: 4.10 },
  'US_TREASURY_30Y_OTR': { tenor: '30Y', isOnTheRun: true, maturityDate: '2055-01-15', couponPct: 4.05 },
}

// Corporate bond expansion
const CORP_EXPANSION = {
  // AT&T multiple maturities
  'T_ATT_5Y': { tenor: '5Y', maturityDate: '2030-06-15', couponPct: 4.50, issuerTicker: 'T' },
  'T_ATT_7Y': { tenor: '7Y', maturityDate: '2032-06-15', couponPct: 4.60, issuerTicker: 'T' },
  'T_ATT_30Y': { tenor: '30Y', maturityDate: '2055-06-15', couponPct: 4.80, issuerTicker: 'T' },

  // Verizon multiple maturities
  'T_VZ_5Y': { tenor: '5Y', maturityDate: '2030-08-15', couponPct: 4.40, issuerTicker: 'VZ' },
  'T_VZ_7Y': { tenor: '7Y', maturityDate: '2032-08-15', couponPct: 4.50, issuerTicker: 'VZ' },
  'T_VZ_30Y': { tenor: '30Y', maturityDate: '2055-08-15', couponPct: 4.70, issuerTicker: 'VZ' },

  // JPMorgan Chase multiple maturities
  'T_JPM_5Y': { tenor: '5Y', maturityDate: '2030-03-15', couponPct: 4.20, issuerTicker: 'JPM' },
  'T_JPM_7Y': { tenor: '7Y', maturityDate: '2032-03-15', couponPct: 4.30, issuerTicker: 'JPM' },
  'T_JPM_30Y': { tenor: '30Y', maturityDate: '2055-03-15', couponPct: 4.50, issuerTicker: 'JPM' },

  // Bank of America multiple maturities
  'T_BAC_5Y': { tenor: '5Y', maturityDate: '2030-04-15', couponPct: 4.25, issuerTicker: 'BAC' },
  'T_BAC_7Y': { tenor: '7Y', maturityDate: '2032-04-15', couponPct: 4.35, issuerTicker: 'BAC' },
  'T_BAC_30Y': { tenor: '30Y', maturityDate: '2055-04-15', couponPct: 4.55, issuerTicker: 'BAC' },

  // Citigroup multiple maturities
  'T_C_5Y': { tenor: '5Y', maturityDate: '2030-05-15', couponPct: 4.30, issuerTicker: 'C' },
  'T_C_7Y': { tenor: '7Y', maturityDate: '2032-05-15', couponPct: 4.40, issuerTicker: 'C' },
  'T_C_30Y': { tenor: '30Y', maturityDate: '2055-05-15', couponPct: 4.60, issuerTicker: 'C' },

  // Wells Fargo multiple maturities
  'T_WFC_5Y': { tenor: '5Y', maturityDate: '2030-07-15', couponPct: 4.35, issuerTicker: 'WFC' },
  'T_WFC_7Y': { tenor: '7Y', maturityDate: '2032-07-15', couponPct: 4.45, issuerTicker: 'WFC' },
  'T_WFC_30Y': { tenor: '30Y', maturityDate: '2055-07-15', couponPct: 4.65, issuerTicker: 'WFC' },

  // Goldman Sachs multiple maturities
  'T_GS_5Y': { tenor: '5Y', maturityDate: '2030-09-15', couponPct: 4.15, issuerTicker: 'GS' },
  'T_GS_7Y': { tenor: '7Y', maturityDate: '2032-09-15', couponPct: 4.25, issuerTicker: 'GS' },
  'T_GS_30Y': { tenor: '30Y', maturityDate: '2055-09-15', couponPct: 4.45, issuerTicker: 'GS' },

  // Morgan Stanley multiple maturities
  'T_MS_5Y': { tenor: '5Y', maturityDate: '2030-10-15', couponPct: 4.20, issuerTicker: 'MS' },
  'T_MS_7Y': { tenor: '7Y', maturityDate: '2032-10-15', couponPct: 4.30, issuerTicker: 'MS' },
  'T_MS_30Y': { tenor: '30Y', maturityDate: '2055-10-15', couponPct: 4.50, issuerTicker: 'MS' },

  // Apple multiple maturities
  'T_AAPL_5Y': { tenor: '5Y', maturityDate: '2030-11-15', couponPct: 3.80, issuerTicker: 'AAPL' },
  'T_AAPL_7Y': { tenor: '7Y', maturityDate: '2032-11-15', couponPct: 3.90, issuerTicker: 'AAPL' },
  'T_AAPL_30Y': { tenor: '30Y', maturityDate: '2055-11-15', couponPct: 4.10, issuerTicker: 'AAPL' },

  // Microsoft multiple maturities
  'T_MSFT_5Y': { tenor: '5Y', maturityDate: '2030-12-15', couponPct: 3.75, issuerTicker: 'MSFT' },
  'T_MSFT_7Y': { tenor: '7Y', maturityDate: '2032-12-15', couponPct: 3.85, issuerTicker: 'MSFT' },
  'T_MSFT_30Y': { tenor: '30Y', maturityDate: '2055-12-15', couponPct: 4.05, issuerTicker: 'MSFT' },

  // Amazon multiple maturities
  'T_AMZN_5Y': { tenor: '5Y', maturityDate: '2030-01-15', couponPct: 4.00, issuerTicker: 'AMZN' },
  'T_AMZN_7Y': { tenor: '7Y', maturityDate: '2032-01-15', couponPct: 4.10, issuerTicker: 'AMZN' },
  'T_AMZN_30Y': { tenor: '30Y', maturityDate: '2055-01-15', couponPct: 4.30, issuerTicker: 'AMZN' },

  // Comcast multiple maturities
  'T_CMCSA_5Y': { tenor: '5Y', maturityDate: '2030-02-15', couponPct: 4.10, issuerTicker: 'CMCSA' },
  'T_CMCSA_7Y': { tenor: '7Y', maturityDate: '2032-02-15', couponPct: 4.20, issuerTicker: 'CMCSA' },
  'T_CMCSA_30Y': { tenor: '30Y', maturityDate: '2055-02-15', couponPct: 4.40, issuerTicker: 'CMCSA' },

  // Ford multiple maturities
  'T_F_7Y': { tenor: '7Y', maturityDate: '2032-03-15', couponPct: 5.20, issuerTicker: 'F' },
  'T_F_10Y': { tenor: '10Y', maturityDate: '2035-03-15', couponPct: 5.30, issuerTicker: 'F' },
  'T_F_30Y': { tenor: '30Y', maturityDate: '2055-03-15', couponPct: 5.50, issuerTicker: 'F' },

  // General Motors multiple maturities
  'T_GM_7Y': { tenor: '7Y', maturityDate: '2032-04-15', couponPct: 5.15, issuerTicker: 'GM' },
  'T_GM_10Y': { tenor: '10Y', maturityDate: '2035-04-15', couponPct: 5.25, issuerTicker: 'GM' },
  'T_GM_30Y': { tenor: '30Y', maturityDate: '2055-04-15', couponPct: 5.45, issuerTicker: 'GM' },

  // Toyota Motor Credit multiple maturities
  'T_TMCC_7Y': { tenor: '7Y', maturityDate: '2032-05-15', couponPct: 4.80, issuerTicker: 'TM' },
  'T_TMCC_10Y': { tenor: '10Y', maturityDate: '2035-05-15', couponPct: 4.90, issuerTicker: 'TM' },
  'T_TMCC_30Y': { tenor: '30Y', maturityDate: '2055-05-15', couponPct: 5.10, issuerTicker: 'TM' },

  // Berkshire Hathaway multiple maturities
  'T_BRK_5Y': { tenor: '5Y', maturityDate: '2030-06-15', couponPct: 3.60, issuerTicker: 'BRK.B' },
  'T_BRK_7Y': { tenor: '7Y', maturityDate: '2032-06-15', couponPct: 3.70, issuerTicker: 'BRK.B' },
  'T_BRK_30Y': { tenor: '30Y', maturityDate: '2055-06-15', couponPct: 3.90, issuerTicker: 'BRK.B' },

  // Exxon Mobil multiple maturities
  'T_XOM_5Y': { tenor: '5Y', maturityDate: '2030-07-15', couponPct: 4.40, issuerTicker: 'XOM' },
  'T_XOM_7Y': { tenor: '7Y', maturityDate: '2032-07-15', couponPct: 4.50, issuerTicker: 'XOM' },
  'T_XOM_30Y': { tenor: '30Y', maturityDate: '2055-07-15', couponPct: 4.70, issuerTicker: 'XOM' },

  // Chevron multiple maturities
  'T_CVX_5Y': { tenor: '5Y', maturityDate: '2030-08-15', couponPct: 4.35, issuerTicker: 'CVX' },
  'T_CVX_7Y': { tenor: '7Y', maturityDate: '2032-08-15', couponPct: 4.45, issuerTicker: 'CVX' },
  'T_CVX_30Y': { tenor: '30Y', maturityDate: '2055-08-15', couponPct: 4.65, issuerTicker: 'CVX' },

  // Pfizer multiple maturities
  'T_PFE_5Y': { tenor: '5Y', maturityDate: '2030-09-15', couponPct: 4.20, issuerTicker: 'PFE' },
  'T_PFE_7Y': { tenor: '7Y', maturityDate: '2032-09-15', couponPct: 4.30, issuerTicker: 'PFE' },
  'T_PFE_30Y': { tenor: '30Y', maturityDate: '2055-09-15', couponPct: 4.50, issuerTicker: 'PFE' },

  // Johnson & Johnson multiple maturities
  'T_JNJ_5Y': { tenor: '5Y', maturityDate: '2030-10-15', couponPct: 3.90, issuerTicker: 'JNJ' },
  'T_JNJ_7Y': { tenor: '7Y', maturityDate: '2032-10-15', couponPct: 4.00, issuerTicker: 'JNJ' },
  'T_JNJ_30Y': { tenor: '30Y', maturityDate: '2055-10-15', couponPct: 4.20, issuerTicker: 'JNJ' },
}

// Helper function to create new instrument
function createNewInstrument(baseKey, expansionData, baseInstrument) {
  const newKey = expansionData.instrumentKey || baseKey
  const tenor = expansionData.tenor || '10Y'
  const isOnTheRun = expansionData.isOnTheRun !== undefined ? expansionData.isOnTheRun : true
  
  return {
    group: baseInstrument.group,
    instrumentKey: newKey,
    displayName: baseInstrument.displayName.replace('10Y', tenor),
    countryOrIssuer: baseInstrument.countryOrIssuer,
    currency: baseInstrument.currency,
    couponPct: expansionData.couponPct || baseInstrument.couponPct,
    maturityDate: expansionData.maturityDate || baseInstrument.maturityDate,
    tenor: tenor,
    isOnTheRun: isOnTheRun,
    issuerTicker: expansionData.issuerTicker || null,
    pricingHints: baseInstrument.pricingHints,
    faceCurrency: baseInstrument.faceCurrency,
    issuerMinFace: baseInstrument.issuerMinFace,
    faceIncrement: baseInstrument.faceIncrement,
    countryCode: baseInstrument.countryCode
  }
}

// Create new instruments
const newInstruments = []

// Add government bond expansions
Object.entries(GOV_TENOR_EXPANSION).forEach(([key, data]) => {
  // Find base instrument by country
  const countryCode = key.split('_')[0]
  const baseInstrument = instruments.find(i => i.instrumentKey.includes(countryCode) && i.group === 'gov')
  
  if (baseInstrument) {
    const newInstrument = createNewInstrument(key, data, baseInstrument)
    newInstruments.push(newInstrument)
  }
})

// Add corporate bond expansions
Object.entries(CORP_EXPANSION).forEach(([key, data]) => {
  // Find base instrument by issuer
  const issuerTicker = data.issuerTicker
  const baseInstrument = instruments.find(i => i.instrumentKey.includes(issuerTicker) && i.group === 'corp')
  
  if (baseInstrument) {
    const newInstrument = createNewInstrument(key, data, baseInstrument)
    newInstruments.push(newInstrument)
  }
})

// Combine original and new instruments
const allInstruments = [...instruments, ...newInstruments]

// Write updated instruments
writeFileSync(instrumentsPath, JSON.stringify(allInstruments, null, 2))
console.log(`Expanded instruments: ${instruments.length} → ${allInstruments.length}`)
console.log(`Added ${newInstruments.length} new instruments`)
console.log(`Government bonds: ${allInstruments.filter(i => i.group === 'gov').length}`)
console.log(`Corporate bonds: ${allInstruments.filter(i => i.group === 'corp').length}`)
console.log(`Inflation-protected: ${allInstruments.filter(i => i.group === 'infl').length}`)
