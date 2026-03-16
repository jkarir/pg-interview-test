import type { TaxBracket, TaxBand, TaxResult } from './types';

export function calculateTax(salary: number, brackets: TaxBracket[]): TaxResult {
  if (salary <= 0) {
    return {
      bands: brackets.map(b => ({
        min: b.min,
        max: b.max ?? null,
        rate: b.rate,
        taxOwed: 0,
      })),
      totalTax: 0,
      effectiveRate: 0,
    };
  }

  const bands: TaxBand[] = brackets.map(bracket => {
    const bracketMax = bracket.max ?? Infinity;
    const taxableInBand = Math.max(0, Math.min(salary, bracketMax) - bracket.min);
    // Round each band to 2 decimal places. A small epsilon corrects for binary
    // floating-point representation errors (e.g. 0.205 cannot be represented exactly),
    // which would otherwise cause values like 10289.975 to round down incorrectly.
    const taxOwed = Math.round(taxableInBand * bracket.rate * 100 + 1e-6) / 100;

    return {
      min: bracket.min,
      max: bracket.max ?? null,
      rate: bracket.rate,
      taxOwed,
    };
  });

  const rawTotal = bands.reduce((sum, band) => sum + band.taxOwed, 0);
  const totalTax = Math.round(rawTotal * 100) / 100;
  const effectiveRate = Math.round((totalTax / salary) * 1_000_000) / 1_000_000;

  return { bands, totalTax, effectiveRate };
}
