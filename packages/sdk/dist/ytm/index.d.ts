/**
 * Yield to Maturity (YTM) calculator using Newton-Raphson method
 */
export interface BondParameters {
    faceValue: number;
    currentPrice: number;
    couponRate: number;
    couponFrequency: number;
    yearsToMaturity: number;
}
/**
 * Calculate approximate YTM using Newton-Raphson method
 */
export declare function calculateYTM(params: BondParameters): number;
/**
 * Calculate bond price given YTM
 */
export declare function calculateBondPrice(params: BondParameters & {
    ytm: number;
}): number;
