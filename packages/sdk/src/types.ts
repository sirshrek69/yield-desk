import { z } from 'zod'

export const RatingSchema = z.object({
  sp: z.string().optional(),
  moodys: z.string().optional(),
  fitch: z.string().optional(),
})

export const RaiseStatusSchema = z.enum([
  'Upcoming',
  'Open', 
  'ClosingSoon',
  'Funded',
  'Live',
  'Cancelled',
  'Expired'
])

export const ProductCategorySchema = z.enum([
  'Government Bonds',
  'Corporate Bonds', 
  'Inflation-Protected',
  'Short-Term',
  'High-Yield',
  'Sovereign Ex-US'
])

export const CurrencySchema = z.enum(['USD', 'GBP', 'EUR'])

export const CouponTypeSchema = z.enum(['Fixed', 'Floating', 'Discount'])

export const CouponFrequencySchema = z.enum([
  'Monthly',
  'Quarterly', 
  'SemiAnnual',
  'Annual',
  'None'
])

export const RaiseSchema = z.object({
  status: RaiseStatusSchema,
  softCap: z.number(),
  hardCap: z.number(),
  amountCommitted: z.number(),
  start: z.string(),
  end: z.string(),
})

export const ProductSchema = z.object({
  id: z.string(),
  category: ProductCategorySchema,
  name: z.string(),
  issuer: z.string(),
  currency: CurrencySchema,
  rating: RatingSchema.optional(),
  couponType: CouponTypeSchema,
  couponRatePct: z.number(),
  couponFrequency: CouponFrequencySchema,
  maturityDate: z.string(),
  priceClean: z.number(),
  ytmPct: z.number(),
  minInvestment: z.number(),
  increment: z.number(),
  raise: RaiseSchema,
  chainId: z.number(),
  tokenAddress: z.string().nullable(),
  decimals: z.number(),
  docs: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })).optional(),
})

export type Rating = z.infer<typeof RatingSchema>
export type RaiseStatus = z.infer<typeof RaiseStatusSchema>
export type ProductCategory = z.infer<typeof ProductCategorySchema>
export type Currency = z.infer<typeof CurrencySchema>
export type CouponType = z.infer<typeof CouponTypeSchema>
export type CouponFrequency = z.infer<typeof CouponFrequencySchema>
export type Raise = z.infer<typeof RaiseSchema>
export type Product = z.infer<typeof ProductSchema>
