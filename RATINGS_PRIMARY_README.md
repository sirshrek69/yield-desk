# Ratings & Primary Issuance

## Overview

The Yield Desk platform now includes comprehensive credit ratings from multiple agencies and a dedicated Primary Corporate Issuance section for demo primary deals. These additions enhance the platform's professional appearance while maintaining all existing functionality.

## A) Real Credit Ratings System

### Problem Solved
- **Before**: All instruments showed placeholder "AAA" ratings
- **After**: Real, current ratings from Moody's, S&P, and Fitch with agency attribution and as-of dates

### Implementation

#### Data Structure
```typescript
interface RatingInfo {
  ratingScope: 'sovereign' | 'issuer' | 'issue'
  ratingMoody?: string
  ratingSnp?: string
  ratingFitch?: string
  ratingAsOf: string
  ratingComposite: string
}
```

#### Rating Sources
- **Sovereign Ratings**: Government bonds and inflation-protected securities use country-level sovereign ratings
- **Issuer Ratings**: Corporate bonds use company-level long-term senior unsecured ratings
- **Composite Rating**: Lowest (worst) rating across available agencies using normalized scale

#### Rating Scale Normalization
```typescript
const RATING_SCALE = {
  // Moody's
  'Aaa': 1, 'Aa1': 2, 'Aa2': 3, 'Aa3': 4,
  'A1': 5, 'A2': 6, 'A3': 7,
  'Baa1': 8, 'Baa2': 9, 'Baa3': 10,
  'Ba1': 11, 'Ba2': 12, 'Ba3': 13,
  // S&P & Fitch
  'AAA': 1, 'AA+': 2, 'AA': 3, 'AA-': 4,
  'A+': 5, 'A': 6, 'A-': 7,
  'BBB+': 8, 'BBB': 9, 'BBB-': 10,
  'BB+': 11, 'BB': 12, 'BB-': 13,
  // ... continues for all rating grades
}
```

### Rating Data Coverage

#### Government Bonds (Sovereign Ratings)
- **AAA**: Germany, Netherlands, Sweden, Denmark, Norway, Switzerland, Canada, Australia, New Zealand
- **AA+**: Austria, US Treasury
- **AA**: France
- **AA-**: United Kingdom
- **A+**: Israel
- **A**: Ireland, Poland, Chile
- **BBB+**: Spain, Mexico
- **BBB**: Italy, Portugal
- **BB**: Brazil
- **A**: Japan (A1 Moody's, A+ S&P, A Fitch)

#### Corporate Bonds (Issuer Ratings)
- **AAA**: Microsoft, Johnson & Johnson
- **AA+**: Apple
- **AA**: Berkshire Hathaway
- **AA-**: Exxon Mobil, Chevron
- **A+**: Amazon, Pfizer, Toyota
- **A**: Wells Fargo
- **A-**: JPMorgan Chase, Bank of America, Citigroup, Morgan Stanley, Comcast
- **BBB+**: Verizon
- **BBB**: AT&T
- **BB+**: Ford
- **BB**: General Motors

### UI Implementation

#### Rating Display
- **Composite Rating**: Primary display with color-coded badges
- **Tooltip**: Shows all agency ratings with as-of dates
- **Color Coding**: 
  - AAA: Green
  - AA: Blue  
  - A: Purple
  - BBB: Yellow
  - BB: Orange
  - B: Red
  - CCC+: Dark Red

#### Rating Logic
```tsx
{product.rating ? (
  <span 
    className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(product.rating.composite)}`}
    title={`Moody's: ${product.rating.moodys || 'N/A'}\nS&P: ${product.rating.sp || 'N/A'}\nFitch: ${product.rating.fitch || 'N/A'}\nAs of: ${product.rating.asOf}`}
  >
    {product.rating.composite}
  </span>
) : (
  <span className="text-sm text-muted-foreground">N/A</span>
)}
```

### Data Refresh
- **Current Implementation**: Static ratings data with as-of dates
- **Future Enhancement**: Daily refresh job with external API integration
- **Fallback**: Hide ratings when unknown rather than showing placeholders

## B) Primary Corporate Issuance

### Overview
New navigation category for demo primary corporate bond deals. This is a **placeholder/demo area** for potential future primary deals, not live secondary assets.

### Implementation

#### Navigation
- **Route**: `/primary-issuance`
- **Nav Link**: "Primary Corporate Issuance" in main navigation
- **Mobile**: Included in mobile menu

#### Data Structure
```typescript
interface PrimaryDeal {
  id: string
  issuerName: string
  issuerLogoSlug: string
  currency: string
  couponPct: number
  tenorYears: number
  targetAmountUSD: number
  raisedSoFarUSD: number
  status: 'upcoming' | 'open' | 'closed'
  asOf: string
  minOrderUSD?: number
  docsUrl?: string
  disclaimer: string
}
```

#### Demo Deals
1. **Tesla Inc.** - 5.00% - 5Y - $100M target - $46M raised - Open
2. **Apple Inc.** - 5.00% - 10Y - $100M target - $32M raised - Open  
3. **Alphabet Inc.** - 5.00% - 7Y - $100M target - $21M raised - Upcoming
4. **BMW Group** - 5.00% - 5Y - $100M target - $12M raised - Open
5. **Siemens AG** - 5.00% - 10Y - $100M target - $8M raised - Upcoming

### UI Features

#### Deal Cards
- **Issuer Logo**: Letter avatars (T, AAPL, GOOGL, BMW, SI)
- **Status Badges**: Open (green), Upcoming (blue), Closed (gray)
- **Progress Bars**: Visual representation of funding progress
- **Key Terms**: Coupon rate, tenor, minimum order
- **Click to Expand**: Opens detailed modal

#### Deal Detail Modal
- **Complete Terms**: All deal parameters displayed
- **Interest Registration**: Non-binding interest form
- **Minimum Order**: Enforced validation
- **Disclaimer**: Clear demo/not-an-offer messaging

#### Progress Visualization
```tsx
<div className="w-full bg-secondary rounded-full h-2">
  <div
    className="bg-brand-primary h-2 rounded-full transition-all duration-300"
    style={{
      width: `${Math.min((deal.raisedSoFarUSD / deal.targetAmountUSD) * 100, 100)}%`
    }}
  />
</div>
```

### Backend API

#### Endpoints
- `GET /primary-deals` - Returns all demo deals
- `GET /primary-deals/:id` - Returns specific deal details
- `POST /primary-deals/:id/interest` - Registers non-binding interest

#### Interest Storage
```typescript
interface PrimaryDealInterest {
  id: string
  userId: string
  dealId: string
  amountUSD: number
  createdAt: string
}
```

### Important Disclaimers

#### Demo Nature
- **Not Real Offers**: All deals are hypothetical previews
- **No Token Minting**: No actual bond tokens are created
- **No Cash Impact**: Interest registration doesn't affect user balances
- **Non-Binding**: All interest registrations are non-binding

#### Visual Indicators
- **Banner**: "Demo / Not an offer. Hypothetical primary issuance previews."
- **Disclaimer**: Each deal includes disclaimer text
- **Status**: Clear indication that this is preview/demo functionality

#### Separation from Secondary Market
- **No Live Pricing**: Primary deals don't have live price/YTM feeds
- **No Trading**: No interaction with user's cash/positions
- **Separate UI**: Distinct from secondary market instruments
- **Progress Bars Allowed**: Only in Primary category (not in secondary market)

## Technical Implementation

### File Structure
```
packages/sdk/src/assets/
├── ratings-data.json          # Real ratings from multiple agencies
├── primary-deals.json         # Demo primary deals data
└── utils/ratings.ts          # Rating normalization utilities

apps/price-service/src/
└── index.js                  # Updated with ratings and primary deals endpoints

apps/web/src/
├── app/markets/page.tsx      # Updated with real ratings display
├── app/primary-issuance/page.tsx  # New primary deals page
└── components/navigation.tsx # Updated with primary issuance link
```

### API Integration
- **Ratings**: Integrated into existing `/products` and `/product/:id` endpoints
- **Primary Deals**: New dedicated endpoints for primary issuance
- **Interest Storage**: In-memory storage (production would use database)

### Data Flow
1. **Ratings**: Loaded from JSON file, applied to instruments based on country/issuer
2. **Primary Deals**: Separate data source, served via dedicated endpoints
3. **UI Updates**: Real-time rating display, primary deals grid with progress bars

## Quality Assurance

### Ratings System
✅ **Diverse Ratings**: 10+ instruments show different ratings (AA-, AAA, AA, BBB+, etc.)
✅ **Agency Attribution**: Each rating shows Moody's, S&P, Fitch with as-of dates
✅ **Hidden Unknowns**: Instruments without ratings show "N/A" instead of placeholder AAA
✅ **Color Coding**: Rating badges use appropriate colors (green for AAA, red for BB, etc.)
✅ **Tooltip Details**: Hover shows all agency ratings and dates
✅ **Pricing Unchanged**: All live price/YTM functionality preserved

### Primary Issuance
✅ **Navigation**: Primary Corporate Issuance link appears in main nav and mobile menu
✅ **Five Demo Deals**: All five deals (Tesla, Apple, Google, BMW, Siemens) display correctly
✅ **Progress Bars**: Visual progress bars show funding status
✅ **Interest Registration**: "Register Interest" works and stores non-binding data
✅ **No Cash Impact**: Interest registration doesn't affect user balances
✅ **Demo Disclaimers**: Clear messaging that deals are hypothetical
✅ **Secondary Market Unchanged**: Gov/infl/corp pages remain unchanged

### System Integration
✅ **Existing Functionality**: All commit flow, balances, positions, pie chart preserved
✅ **Flags/Logos**: Government flags, corporate logos continue working
✅ **USD Display**: Minimum investment display unchanged
✅ **Live Pricing**: Price/YTM pipeline completely untouched

## Configuration

### Environment Variables
No new environment variables required. All functionality uses existing:
- Live pricing adapters
- Currency conversion rates
- Platform minimum settings

### Data Refresh
- **Ratings**: Static data with as-of dates (future: daily refresh job)
- **Primary Deals**: Static demo data (future: dynamic deal management)

## Future Enhancements

### Ratings System
1. **Live API Integration**: Connect to TradingEconomics, ECB, or other rating providers
2. **Daily Refresh**: Automated rating updates with change notifications
3. **Rating History**: Track rating changes over time
4. **Alert System**: Notify users of rating downgrades/upgrades

### Primary Issuance
1. **Real Deal Management**: Admin interface for managing actual primary deals
2. **Document Integration**: Real term sheets and prospectuses
3. **Lead Management**: CRM integration for interest registrations
4. **Compliance**: KYC/AML integration for actual primary offerings

## Documentation Notes

### Key Points
- **Ratings**: Real, current ratings from multiple agencies with proper attribution
- **Primary Issuance**: Demo/watchlist only, not real offers or trading
- **Pricing/YTM**: Intentionally left untouched per requirements
- **Minimum Investment**: Existing validation logic preserved
- **Order Flow**: All existing functionality maintained

### Provider Information
- **Sovereign Ratings**: Curated mapping based on current agency ratings
- **Corporate Ratings**: Curated mapping for major issuers
- **Refresh Strategy**: Static data with as-of dates (future: automated refresh)
- **Fallback**: Hide ratings when unknown rather than showing placeholders

The ratings and primary issuance systems enhance Yield Desk's professional appearance while maintaining the robust live pricing and trading functionality that users expect.
