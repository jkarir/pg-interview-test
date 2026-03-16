import { calculateTax } from '../calculateTax';
import type { TaxBracket } from '../types';

const BRACKETS_2022: TaxBracket[] = [
  { min: 0,      max: 50197,  rate: 0.15  },
  { min: 50197,  max: 100392, rate: 0.205 },
  { min: 100392, max: 155625, rate: 0.26  },
  { min: 155625, max: 221708, rate: 0.29  },
  { min: 221708,              rate: 0.33  },
];

describe('calculateTax', () => {
  describe('README verification scenarios', () => {
    it('returns $0 total tax for $0 salary', () => {
      const result = calculateTax(0, BRACKETS_2022);
      expect(result.totalTax).toBe(0);
      expect(result.effectiveRate).toBe(0);
    });

    it('returns $7,500.00 total tax for $50,000 salary', () => {
      const result = calculateTax(50000, BRACKETS_2022);
      expect(result.totalTax).toBe(7500);
    });

    it('returns $17,739.17 total tax for $100,000 salary', () => {
      const result = calculateTax(100000, BRACKETS_2022);
      expect(result.totalTax).toBe(17739.17);
    });

    it('returns $385,587.65 total tax for $1,234,567 salary', () => {
      const result = calculateTax(1234567, BRACKETS_2022);
      expect(result.totalTax).toBe(385587.65);
    });
  });

  describe('band breakdown', () => {
    it('returns one band per bracket', () => {
      const result = calculateTax(100000, BRACKETS_2022);
      expect(result.bands).toHaveLength(5);
    });

    it('sets max to null for the top (unbounded) bracket', () => {
      const result = calculateTax(100000, BRACKETS_2022);
      const topBand = result.bands[result.bands.length - 1];
      expect(topBand.max).toBeNull();
    });

    it('calculates zero taxOwed for bands above salary', () => {
      const result = calculateTax(50000, BRACKETS_2022);
      // Only first bracket applies; all others should be 0
      result.bands.slice(1).forEach(band => {
        expect(band.taxOwed).toBe(0);
      });
    });
  });

  describe('effectiveRate', () => {
    it('returns the effective rate as a decimal', () => {
      const result = calculateTax(100000, BRACKETS_2022);
      // $17,739.17 / $100,000 = 0.1773917
      expect(result.effectiveRate).toBeCloseTo(0.177392, 4);
    });
  });
});
