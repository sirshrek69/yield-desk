# Minimum Investment & Order Sizing

## Overview

The Yield Desk platform implements a comprehensive minimum investment system that distinguishes between issuer-specific minimum lot sizes and platform-wide minimums. This ensures compliance with bond market conventions while providing clear guidance to investors.

## Data Structure

### Instrument Fields

Each instrument now includes the following fields:

```typescript
interface Instrument {
  // ... existing fields ...
  faceCurrency: string           // Native currency (EUR, GBP, JPY, etc.)
  issuerMinFace: number | null  // Issuer's minimum tradable nominal/lot
  faceIncrement: number | null  // Lot multiple/increment
  countryCode: string          // ISO-2 country code for flag rendering
}
```

### Minimum Investment Display

The system calculates and displays minimum investment information:

```typescript
interface MinInvestmentDisplay {
  type: 'issuer' | 'platform'
  
  // For issuer minimums
  issuerMinUSD?: number        // Converted to USD
  incrementUSD?: number        // Converted to USD
  issuerMinFace?: number       // Native currency amount
  faceIncrement?: number       // Native currency increment
  faceCurrency?: string        // Native currency code
  
  // For platform minimums
  platformMinUSD?: number      // Platform minimum in USD
}
```

## Semantics & Rules

### Issuer Minimum vs Platform Minimum

**Issuer Minimum**: The minimum tradable lot size set by the bond issuer (e.g., UK Gilts: £100 minimum, German Bunds: €1,000 minimum)

**Platform Minimum**: Yield Desk's minimum investment requirement when issuer minimums are unknown (default: $1,000 USD)

### Display Logic

1. **If issuer minimum is known**:
   - Show: "Issuer minimum: $X (N faceCurrency)"
   - Show: "Increment: $Y (M faceCurrency)"
   - Example: "Issuer minimum: $127 (100 GBP)"

2. **If issuer minimum is unknown**:
   - Show: "Platform minimum: $Z"
   - Example: "Platform minimum: $1,000"

### Currency Conversion

All minimums are displayed in USD for consistency, using simplified exchange rates:

```typescript
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
```

## Implementation

### Minimum Denomination Rules

The system uses a mapping file (`min-denomination-rules.ts`) to define issuer minimums:

```typescript
const MIN_DENOMINATION_RULES = {
  // Government Bonds
  'GB_GILT_10Y_OTR': { issuerMinFace: 100, faceIncrement: 100, faceCurrency: 'GBP', countryCode: 'GB' },
  'DE_BUND_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'DE' },
  'JP_JGB_10Y_OTR': { issuerMinFace: 10000, faceIncrement: 10000, faceCurrency: 'JPY', countryCode: 'JP' },
  
  // Corporate Bonds (unknown issuer minimums)
  'T_ATT_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  // ...
}
```

### Order Validation

The system enforces minimum investment rules:

1. **Client-side validation**: Check order size against minimum requirements
2. **Server-side validation**: Validate in native currency terms
3. **Error messages**: Clear feedback for invalid order sizes

Example validation:
```typescript
function validateOrderSize(orderAmount: number, instrument: Instrument): ValidationResult {
  if (instrument.issuerMinFace && instrument.faceIncrement) {
    // Validate against issuer minimum
    if (orderAmount < instrument.issuerMinFace) {
      return {
        valid: false,
        error: `Order must be at least ${instrument.issuerMinFace} ${instrument.faceCurrency}`
      }
    }
    
    // Validate increment
    if (orderAmount % instrument.faceIncrement !== 0) {
      return {
        valid: false,
        error: `Order must be in multiples of ${instrument.faceIncrement} ${instrument.faceCurrency}`
      }
    }
  } else {
    // Validate against platform minimum
    const platformMinUSD = PLATFORM_MIN_USD
    if (orderAmount < platformMinUSD) {
      return {
        valid: false,
        error: `Order must be at least $${platformMinUSD} USD`
      }
    }
  }
  
  return { valid: true }
}
```

## UI Implementation

### Product Cards

Government bonds show country flags and issuer minimums:

```tsx
<div className="flex items-center gap-2">
  <p className="text-sm text-muted-foreground truncate">{product.issuer}</p>
  {product.category === 'Government Bonds' && (
    <ReactCountryFlag
      countryCode={product.countryCode}
      svg
      style={{ width: '16px', height: '12px', borderRadius: '2px' }}
    />
  )}
</div>

<div className="flex items-center justify-between">
  <span className="text-sm text-muted-foreground">
    {product.minInvestmentDisplay.type === 'issuer' ? 'Issuer minimum' : 'Platform minimum'}
  </span>
  <div className="text-right">
    <div className="font-medium">${product.minInvestment.toFixed(0)}</div>
    {product.minInvestmentDisplay.type === 'issuer' && (
      <div className="text-xs text-muted-foreground">
        ({product.minInvestmentDisplay.issuerMinFace} {product.minInvestmentDisplay.faceCurrency})
      </div>
    )}
  </div>
</div>
```

### Order Modal

The order modal validates minimum investment requirements and shows appropriate error messages.

## Configuration

### Platform Minimum

Set the platform minimum in USD:

```javascript
const PLATFORM_MIN_USD = 1000  // $1,000 USD
```

### Currency Rates

Update exchange rates for accurate USD conversion:

```javascript
const CURRENCY_RATES = {
  'EUR': 1.08,  // 1 EUR = 1.08 USD
  'GBP': 1.27,  // 1 GBP = 1.27 USD
  // ...
}
```

## Examples

### Government Bonds

**UK Gilt 10Y**:
- Issuer minimum: £100
- Increment: £100
- Display: "Issuer minimum: $127 (100 GBP)"

**German Bund 10Y**:
- Issuer minimum: €1,000
- Increment: €1,000
- Display: "Issuer minimum: $1,080 (1000 EUR)"

**Japanese JGB 10Y**:
- Issuer minimum: ¥10,000
- Increment: ¥10,000
- Display: "Issuer minimum: $67 (10000 JPY)"

### Corporate Bonds

**AT&T Corporate Bond**:
- Issuer minimum: Unknown
- Platform minimum: $1,000
- Display: "Platform minimum: $1,000"

## Benefits

1. **Market Compliance**: Respects issuer-specific minimum lot sizes
2. **Clear Communication**: Distinguishes between issuer and platform requirements
3. **Currency Consistency**: All minimums displayed in USD for easy comparison
4. **Flexible Fallback**: Platform minimum when issuer requirements unknown
5. **Visual Clarity**: Country flags for government bonds, clear labeling

## Future Enhancements

1. **Live FX Rates**: Replace static rates with real-time exchange rates
2. **Dynamic Minimums**: Adjust platform minimums based on market conditions
3. **Institutional Tiers**: Different minimums for retail vs institutional investors
4. **Currency Selection**: Allow users to view minimums in their preferred currency
5. **Lot Size Optimization**: Suggest optimal order sizes based on market liquidity

The minimum investment system ensures Yield Desk operates within bond market conventions while providing clear, consistent guidance to investors across all instrument types.
