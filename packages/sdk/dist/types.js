"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = exports.RaiseSchema = exports.CouponFrequencySchema = exports.CouponTypeSchema = exports.CurrencySchema = exports.ProductCategorySchema = exports.RaiseStatusSchema = exports.RatingSchema = void 0;
const zod_1 = require("zod");
exports.RatingSchema = zod_1.z.object({
    sp: zod_1.z.string().optional(),
    moodys: zod_1.z.string().optional(),
    fitch: zod_1.z.string().optional(),
});
exports.RaiseStatusSchema = zod_1.z.enum([
    'Upcoming',
    'Open',
    'ClosingSoon',
    'Funded',
    'Live',
    'Cancelled',
    'Expired'
]);
exports.ProductCategorySchema = zod_1.z.enum([
    'Government Bonds',
    'Corporate Bonds',
    'Inflation-Protected',
    'Short-Term',
    'High-Yield',
    'Sovereign Ex-US'
]);
exports.CurrencySchema = zod_1.z.enum(['USD', 'GBP', 'EUR']);
exports.CouponTypeSchema = zod_1.z.enum(['Fixed', 'Floating', 'Discount']);
exports.CouponFrequencySchema = zod_1.z.enum([
    'Monthly',
    'Quarterly',
    'SemiAnnual',
    'Annual',
    'None'
]);
exports.RaiseSchema = zod_1.z.object({
    status: exports.RaiseStatusSchema,
    softCap: zod_1.z.number(),
    hardCap: zod_1.z.number(),
    amountCommitted: zod_1.z.number(),
    start: zod_1.z.string(),
    end: zod_1.z.string(),
});
exports.ProductSchema = zod_1.z.object({
    id: zod_1.z.string(),
    category: exports.ProductCategorySchema,
    name: zod_1.z.string(),
    issuer: zod_1.z.string(),
    currency: exports.CurrencySchema,
    rating: exports.RatingSchema.optional(),
    couponType: exports.CouponTypeSchema,
    couponRatePct: zod_1.z.number(),
    couponFrequency: exports.CouponFrequencySchema,
    maturityDate: zod_1.z.string(),
    priceClean: zod_1.z.number(),
    ytmPct: zod_1.z.number(),
    minInvestment: zod_1.z.number(),
    increment: zod_1.z.number(),
    raise: exports.RaiseSchema,
    chainId: zod_1.z.number(),
    tokenAddress: zod_1.z.string().nullable(),
    decimals: zod_1.z.number(),
    docs: zod_1.z.array(zod_1.z.object({
        label: zod_1.z.string(),
        url: zod_1.z.string(),
    })).optional(),
});
