export interface TaxBracket {
  min: number;
  max?: number;
  rate: number;
}

export interface TaxBand {
  min: number;
  max: number | null; // null for the top (unbounded) bracket
  rate: number;
  taxOwed: number;
}

export interface TaxResult {
  bands: TaxBand[];
  totalTax: number;
  effectiveRate: number; // stored as decimal, e.g. 0.1739 → display as "17.39%"
}

export type TaxYear = '2019' | '2020' | '2021' | '2022';
export const DEFAULT_TAX_YEAR: TaxYear = '2022';
export const TAX_YEARS: TaxYear[] = [DEFAULT_TAX_YEAR, '2021', '2020', '2019'];

import { z } from 'zod';

export const TaxBracketsResponseSchema = z.object({
  tax_brackets: z.array(
    z.object({
      min: z.number(),
      max: z.number().optional(),
      rate: z.number(),
    })
  ),
});

export type TaxBracketsResponse = z.infer<typeof TaxBracketsResponseSchema>;

export type CalculatorState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; result: TaxResult }
  | { status: 'error'; message: string };
