import { z } from 'zod';
export declare const RatingSchema: z.ZodObject<{
    sp: z.ZodOptional<z.ZodString>;
    moodys: z.ZodOptional<z.ZodString>;
    fitch: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sp?: string | undefined;
    moodys?: string | undefined;
    fitch?: string | undefined;
}, {
    sp?: string | undefined;
    moodys?: string | undefined;
    fitch?: string | undefined;
}>;
export declare const RaiseStatusSchema: z.ZodEnum<["Upcoming", "Open", "ClosingSoon", "Funded", "Live", "Cancelled", "Expired"]>;
export declare const ProductCategorySchema: z.ZodEnum<["Government Bonds", "Corporate Bonds", "Inflation-Protected", "Short-Term", "High-Yield", "Sovereign Ex-US"]>;
export declare const CurrencySchema: z.ZodEnum<["USD", "GBP", "EUR"]>;
export declare const CouponTypeSchema: z.ZodEnum<["Fixed", "Floating", "Discount"]>;
export declare const CouponFrequencySchema: z.ZodEnum<["Monthly", "Quarterly", "SemiAnnual", "Annual", "None"]>;
export declare const RaiseSchema: z.ZodObject<{
    status: z.ZodEnum<["Upcoming", "Open", "ClosingSoon", "Funded", "Live", "Cancelled", "Expired"]>;
    softCap: z.ZodNumber;
    hardCap: z.ZodNumber;
    amountCommitted: z.ZodNumber;
    start: z.ZodString;
    end: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "Upcoming" | "Open" | "ClosingSoon" | "Funded" | "Live" | "Cancelled" | "Expired";
    softCap: number;
    hardCap: number;
    amountCommitted: number;
    start: string;
    end: string;
}, {
    status: "Upcoming" | "Open" | "ClosingSoon" | "Funded" | "Live" | "Cancelled" | "Expired";
    softCap: number;
    hardCap: number;
    amountCommitted: number;
    start: string;
    end: string;
}>;
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodString;
    category: z.ZodEnum<["Government Bonds", "Corporate Bonds", "Inflation-Protected", "Short-Term", "High-Yield", "Sovereign Ex-US"]>;
    name: z.ZodString;
    issuer: z.ZodString;
    currency: z.ZodEnum<["USD", "GBP", "EUR"]>;
    rating: z.ZodOptional<z.ZodObject<{
        sp: z.ZodOptional<z.ZodString>;
        moodys: z.ZodOptional<z.ZodString>;
        fitch: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        sp?: string | undefined;
        moodys?: string | undefined;
        fitch?: string | undefined;
    }, {
        sp?: string | undefined;
        moodys?: string | undefined;
        fitch?: string | undefined;
    }>>;
    couponType: z.ZodEnum<["Fixed", "Floating", "Discount"]>;
    couponRatePct: z.ZodNumber;
    couponFrequency: z.ZodEnum<["Monthly", "Quarterly", "SemiAnnual", "Annual", "None"]>;
    maturityDate: z.ZodString;
    priceClean: z.ZodNumber;
    ytmPct: z.ZodNumber;
    minInvestment: z.ZodNumber;
    increment: z.ZodNumber;
    raise: z.ZodObject<{
        status: z.ZodEnum<["Upcoming", "Open", "ClosingSoon", "Funded", "Live", "Cancelled", "Expired"]>;
        softCap: z.ZodNumber;
        hardCap: z.ZodNumber;
        amountCommitted: z.ZodNumber;
        start: z.ZodString;
        end: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "Upcoming" | "Open" | "ClosingSoon" | "Funded" | "Live" | "Cancelled" | "Expired";
        softCap: number;
        hardCap: number;
        amountCommitted: number;
        start: string;
        end: string;
    }, {
        status: "Upcoming" | "Open" | "ClosingSoon" | "Funded" | "Live" | "Cancelled" | "Expired";
        softCap: number;
        hardCap: number;
        amountCommitted: number;
        start: string;
        end: string;
    }>;
    chainId: z.ZodNumber;
    tokenAddress: z.ZodNullable<z.ZodString>;
    decimals: z.ZodNumber;
    docs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        label: string;
        url: string;
    }, {
        label: string;
        url: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    category: "Government Bonds" | "Corporate Bonds" | "Inflation-Protected" | "Short-Term" | "High-Yield" | "Sovereign Ex-US";
    name: string;
    issuer: string;
    currency: "USD" | "GBP" | "EUR";
    couponType: "Fixed" | "Floating" | "Discount";
    couponRatePct: number;
    couponFrequency: "Monthly" | "Quarterly" | "SemiAnnual" | "Annual" | "None";
    maturityDate: string;
    priceClean: number;
    ytmPct: number;
    minInvestment: number;
    increment: number;
    raise: {
        status: "Upcoming" | "Open" | "ClosingSoon" | "Funded" | "Live" | "Cancelled" | "Expired";
        softCap: number;
        hardCap: number;
        amountCommitted: number;
        start: string;
        end: string;
    };
    chainId: number;
    tokenAddress: string | null;
    decimals: number;
    rating?: {
        sp?: string | undefined;
        moodys?: string | undefined;
        fitch?: string | undefined;
    } | undefined;
    docs?: {
        label: string;
        url: string;
    }[] | undefined;
}, {
    id: string;
    category: "Government Bonds" | "Corporate Bonds" | "Inflation-Protected" | "Short-Term" | "High-Yield" | "Sovereign Ex-US";
    name: string;
    issuer: string;
    currency: "USD" | "GBP" | "EUR";
    couponType: "Fixed" | "Floating" | "Discount";
    couponRatePct: number;
    couponFrequency: "Monthly" | "Quarterly" | "SemiAnnual" | "Annual" | "None";
    maturityDate: string;
    priceClean: number;
    ytmPct: number;
    minInvestment: number;
    increment: number;
    raise: {
        status: "Upcoming" | "Open" | "ClosingSoon" | "Funded" | "Live" | "Cancelled" | "Expired";
        softCap: number;
        hardCap: number;
        amountCommitted: number;
        start: string;
        end: string;
    };
    chainId: number;
    tokenAddress: string | null;
    decimals: number;
    rating?: {
        sp?: string | undefined;
        moodys?: string | undefined;
        fitch?: string | undefined;
    } | undefined;
    docs?: {
        label: string;
        url: string;
    }[] | undefined;
}>;
export type Rating = z.infer<typeof RatingSchema>;
export type RaiseStatus = z.infer<typeof RaiseStatusSchema>;
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export type Currency = z.infer<typeof CurrencySchema>;
export type CouponType = z.infer<typeof CouponTypeSchema>;
export type CouponFrequency = z.infer<typeof CouponFrequencySchema>;
export type Raise = z.infer<typeof RaiseSchema>;
export type Product = z.infer<typeof ProductSchema>;
