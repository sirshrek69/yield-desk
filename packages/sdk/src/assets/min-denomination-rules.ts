// Minimum denomination rules for different countries and bond types
export interface DenominationRule {
  issuerMinFace: number
  faceIncrement: number
  faceCurrency: string
  countryCode: string
}

export const MIN_DENOMINATION_RULES: Record<string, DenominationRule> = {
  // Government Bonds - European
  'GB_GILT_10Y_OTR': { issuerMinFace: 100, faceIncrement: 100, faceCurrency: 'GBP', countryCode: 'GB' },
  'DE_BUND_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'DE' },
  'FR_OAT_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'FR' },
  'IT_BTP_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'IT' },
  'ES_SPGB_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'ES' },
  'NL_DSL_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'NL' },
  'BE_OLO_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'BE' },
  'AT_RAGB_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'AT' },
  'IE_IGB_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'IE' },
  'PT_OT_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'PT' },
  'SE_SGB_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'SEK', countryCode: 'SE' },
  'DK_DGB_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'DKK', countryCode: 'DK' },
  'NO_NST_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'NOK', countryCode: 'NO' },
  'CH_CONF_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'CHF', countryCode: 'CH' },

  // Government Bonds - Non-European
  'JP_JGB_10Y_OTR': { issuerMinFace: 10000, faceIncrement: 10000, faceCurrency: 'JPY', countryCode: 'JP' },
  'CA_GOC_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'CAD', countryCode: 'CA' },
  'AU_ACGB_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'AUD', countryCode: 'AU' },
  'NZ_NZGB_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'NZD', countryCode: 'NZ' },
  'PL_PSZ_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'PLN', countryCode: 'PL' },
  'MX_MBONO_10Y_OTR': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'MXN', countryCode: 'MX' },

  // Inflation-Protected Securities - US TIPS
  'US_TIPS_5Y': { issuerMinFace: 100, faceIncrement: 100, faceCurrency: 'USD', countryCode: 'US' },
  'US_TIPS_10Y': { issuerMinFace: 100, faceIncrement: 100, faceCurrency: 'USD', countryCode: 'US' },
  'US_TIPS_30Y': { issuerMinFace: 100, faceIncrement: 100, faceCurrency: 'USD', countryCode: 'US' },

  // Inflation-Protected Securities - European
  'UK_ILG_10Y': { issuerMinFace: 100, faceIncrement: 100, faceCurrency: 'GBP', countryCode: 'GB' },
  'UK_ILG_30Y': { issuerMinFace: 100, faceIncrement: 100, faceCurrency: 'GBP', countryCode: 'GB' },
  'FR_OATEI_10Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'FR' },
  'IT_BTPEI_10Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'IT' },
  'IT_BTP_ITALIA': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'IT' },
  'DE_BUNDEI_10Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'DE' },

  // Inflation-Protected Securities - Other
  'JP_JGBI_10Y': { issuerMinFace: 10000, faceIncrement: 10000, faceCurrency: 'JPY', countryCode: 'JP' },
  'CA_RRB_30Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'CAD', countryCode: 'CA' },
  'AU_TIB_10Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'AUD', countryCode: 'AU' },
  'SE_SGBIL_10Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'SEK', countryCode: 'SE' },
  'DK_DGBIL_10Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'DKK', countryCode: 'DK' },
  'MX_UDIBONO_10Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'MXN', countryCode: 'MX' },
  'BR_NTNB_10Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'BRL', countryCode: 'BR' },
  'CL_BCU_10Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'CLP', countryCode: 'CL' },
  'IL_CPI_10Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'ILS', countryCode: 'IL' },
  'ES_SPGBEI_10Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'EUR', countryCode: 'ES' },
  'NZ_IIB_10Y': { issuerMinFace: 1000, faceIncrement: 1000, faceCurrency: 'NZD', countryCode: 'NZ' },

  // Corporate Bonds - Unknown issuer minimums (will use platform minimum)
  'T_ATT_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_VZ_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_JPM_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_BAC_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_C_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_WFC_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_GS_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_MS_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_AAPL_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_MSFT_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_AMZN_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_CMCSA_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_F_5Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_GM_5Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_TMCC_5Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_BRK_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_XOM_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_CVX_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_PFE_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
  'T_JNJ_10Y': { issuerMinFace: null, faceIncrement: null, faceCurrency: 'USD', countryCode: 'US' },
}

// Platform minimum in USD (fallback when issuer minimum is unknown)
export const PLATFORM_MIN_USD = 1000

// Currency conversion rates (simplified - in production would use live FX)
export const CURRENCY_RATES: Record<string, number> = {
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
