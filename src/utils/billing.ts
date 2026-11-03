export type CurrencyType = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface ProPricingPlan {
  currency: CurrencyType;
  symbol: string;
  amount: number;
  formattedMonthly: string;
  perMonthSuffix: string;
  targetRegion: string;
  countryCode: string;
  flag: string;
  sku: string;
  basePlanId: string;
}

export const PRO_PLANS: Record<CurrencyType, ProPricingPlan> = {
  INR: {
    currency: 'INR',
    symbol: '₹',
    amount: 149,
    formattedMonthly: '₹149',
    perMonthSuffix: '/month',
    targetRegion: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    sku: 'quickqr_pro_monthly',
    basePlanId: 'monthly-inr'
  },
  USD: {
    currency: 'USD',
    symbol: '$',
    amount: 5,
    formattedMonthly: '$5.00',
    perMonthSuffix: '/month',
    targetRegion: 'United States & Global',
    countryCode: 'US',
    flag: '🌐',
    sku: 'quickqr_pro_monthly',
    basePlanId: 'monthly-usd'
  },
  EUR: {
    currency: 'EUR',
    symbol: '€',
    amount: 4.99,
    formattedMonthly: '€4.99',
    perMonthSuffix: '/month',
    targetRegion: 'European Union',
    countryCode: 'EU',
    flag: '🇪🇺',
    sku: 'quickqr_pro_monthly',
    basePlanId: 'monthly-eur'
  },
  GBP: {
    currency: 'GBP',
    symbol: '£',
    amount: 4.49,
    formattedMonthly: '£4.49',
    perMonthSuffix: '/month',
    targetRegion: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    sku: 'quickqr_pro_monthly',
    basePlanId: 'monthly-gbp'
  }
};

export interface DetectedLocationResult {
  currency: CurrencyType;
  plan: ProPricingPlan;
  detectedCountry: string;
  method: 'timezone' | 'locale' | 'gps' | 'fallback';
}

/**
 * Automatically detects the user's location, currency, and local payment symbol
 * based on device timezone and browser locale with zero external API dependencies.
 */
export function detectUserRegionAndCurrency(): DetectedLocationResult {
  let detectedCurrency: CurrencyType = 'USD';
  let detectedCountry = 'International';
  let method: 'timezone' | 'locale' | 'gps' | 'fallback' = 'fallback';

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const tzLower = tz.toLowerCase();

    // 1. Detect India
    if (
      tzLower.includes('kolkata') || 
      tzLower.includes('calcutta') || 
      tzLower.includes('india') ||
      tzLower.startsWith('asia/cal') ||
      tzLower.startsWith('asia/kol')
    ) {
      detectedCurrency = 'INR';
      detectedCountry = 'India';
      method = 'timezone';
    } 
    // 2. Detect UK
    else if (tzLower.includes('london') || tzLower.includes('belfast')) {
      detectedCurrency = 'GBP';
      detectedCountry = 'United Kingdom';
      method = 'timezone';
    }
    // 3. Detect European Union
    else if (
      tzLower.startsWith('europe/') && 
      !tzLower.includes('london') && 
      !tzLower.includes('moscow')
    ) {
      detectedCurrency = 'EUR';
      detectedCountry = 'Europe';
      method = 'timezone';
    } 
    // 4. Fallback check locale
    else if (typeof navigator !== 'undefined') {
      const langs = navigator.languages ? Array.from(navigator.languages) : [navigator.language || ''];
      const hasIndianLocale = langs.some(l => 
        l.toLowerCase().endsWith('-in') || 
        l.toLowerCase().startsWith('te-') || 
        l.toLowerCase().startsWith('hi-') ||
        l.toLowerCase().startsWith('ta-')
      );
      if (hasIndianLocale) {
        detectedCurrency = 'INR';
        detectedCountry = 'India';
        method = 'locale';
      }
    }
  } catch {
    detectedCurrency = 'USD';
    detectedCountry = 'United States & Global';
    method = 'fallback';
  }

  return {
    currency: detectedCurrency,
    plan: PRO_PLANS[detectedCurrency],
    detectedCountry,
    method
  };
}

/**
 * Returns formatted pricing for Pro monthly subscription
 */
export function getProPrice(currency: CurrencyType = 'INR'): ProPricingPlan {
  return PRO_PLANS[currency] || PRO_PLANS.INR;
}

/**
 * Returns whether ads should be displayed
 */
export function shouldShowAds(isPro: boolean): boolean {
  return !isPro;
}
