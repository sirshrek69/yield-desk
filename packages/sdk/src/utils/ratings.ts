// Rating normalization and composite calculation utilities

export interface RatingData {
  moody?: string
  snp?: string
  fitch?: string
  asOf: string
  composite: string
}

export interface RatingInfo {
  ratingScope: 'sovereign' | 'issuer' | 'issue'
  ratingMoody?: string
  ratingSnp?: string
  ratingFitch?: string
  ratingAsOf: string
  ratingComposite: string
}

// Rating scale normalization (lower number = higher rating)
const RATING_SCALE: Record<string, number> = {
  // Moody's
  'Aaa': 1, 'Aa1': 2, 'Aa2': 3, 'Aa3': 4,
  'A1': 5, 'A2': 6, 'A3': 7,
  'Baa1': 8, 'Baa2': 9, 'Baa3': 10,
  'Ba1': 11, 'Ba2': 12, 'Ba3': 13,
  'B1': 14, 'B2': 15, 'B3': 16,
  'Caa1': 17, 'Caa2': 18, 'Caa3': 19,
  'Ca': 20, 'C': 21,
  
  // S&P
  'AAA': 1, 'AA+': 2, 'AA': 3, 'AA-': 4,
  'A+': 5, 'A': 6, 'A-': 7,
  'BBB+': 8, 'BBB': 9, 'BBB-': 10,
  'BB+': 11, 'BB': 12, 'BB-': 13,
  'B+': 14, 'B': 15, 'B-': 16,
  'CCC+': 17, 'CCC': 18, 'CCC-': 19,
  'CC': 20, 'C': 21, 'D': 22,
  
  // Fitch
  'AAA': 1, 'AA+': 2, 'AA': 3, 'AA-': 4,
  'A+': 5, 'A': 6, 'A-': 7,
  'BBB+': 8, 'BBB': 9, 'BBB-': 10,
  'BB+': 11, 'BB': 12, 'BB-': 13,
  'B+': 14, 'B': 15, 'B-': 16,
  'CCC+': 17, 'CCC': 18, 'CCC-': 19,
  'CC': 20, 'C': 21, 'D': 22
}

// Reverse mapping for composite rating
const SCALE_TO_RATING: Record<number, string> = {
  1: 'AAA', 2: 'AA+', 3: 'AA', 4: 'AA-',
  5: 'A+', 6: 'A', 7: 'A-',
  8: 'BBB+', 9: 'BBB', 10: 'BBB-',
  11: 'BB+', 12: 'BB', 13: 'BB-',
  14: 'B+', 15: 'B', 16: 'B-',
  17: 'CCC+', 18: 'CCC', 19: 'CCC-',
  20: 'CC', 21: 'C', 22: 'D'
}

export function normalizeRating(rating: string): number {
  return RATING_SCALE[rating] || 999 // Unknown ratings get lowest priority
}

export function calculateCompositeRating(ratings: {
  moody?: string
  snp?: string
  fitch?: string
}): string {
  const validRatings = Object.values(ratings).filter(r => r && r !== 'N/A')
  
  if (validRatings.length === 0) {
    return 'N/A'
  }
  
  // Find the lowest (worst) rating
  const normalizedRatings = validRatings.map(normalizeRating)
  const worstRating = Math.max(...normalizedRatings)
  
  return SCALE_TO_RATING[worstRating] || 'N/A'
}

export function getRatingColor(rating: string): string {
  if (!rating || rating === 'N/A') return 'bg-gray-100 text-gray-600'
  
  if (rating.startsWith('AAA')) return 'bg-green-100 text-green-800'
  if (rating.startsWith('AA')) return 'bg-blue-100 text-blue-800'
  if (rating.startsWith('A')) return 'bg-purple-100 text-purple-800'
  if (rating.startsWith('BBB')) return 'bg-yellow-100 text-yellow-800'
  if (rating.startsWith('BB')) return 'bg-orange-100 text-orange-800'
  if (rating.startsWith('B')) return 'bg-red-100 text-red-800'
  if (rating.startsWith('CCC')) return 'bg-red-200 text-red-900'
  
  return 'bg-gray-100 text-gray-600'
}

export function formatRatingTooltip(rating: RatingInfo): string {
  const lines = []
  
  if (rating.ratingMoody) {
    lines.push(`Moody's: ${rating.ratingMoody} (as of ${rating.ratingAsOf})`)
  }
  if (rating.ratingSnp) {
    lines.push(`S&P: ${rating.ratingSnp} (as of ${rating.ratingAsOf})`)
  }
  if (rating.ratingFitch) {
    lines.push(`Fitch: ${rating.ratingFitch} (as of ${rating.ratingAsOf})`)
  }
  
  return lines.join('\n')
}

export function getRatingForInstrument(
  instrument: any,
  ratingsData: any
): RatingInfo | null {
  const { group, countryCode, issuerTicker } = instrument
  
  let ratingScope: 'sovereign' | 'issuer' | 'issue'
  let ratingKey: string
  
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
