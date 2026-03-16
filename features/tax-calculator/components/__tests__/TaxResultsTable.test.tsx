import { render, screen } from '@testing-library/react';
import { TaxResultsTable } from '../TaxResultsTable';
import type { TaxResult } from '../../lib/types'; // test is in components/__tests__/, types are in lib/

const MOCK_RESULT: TaxResult = {
  bands: [
    { min: 0,      max: 50197,  rate: 0.15,  taxOwed: 7529.55  },
    { min: 50197,  max: 100392, rate: 0.205, taxOwed: 10209.62 },
    { min: 100392, max: 155625, rate: 0.26,  taxOwed: 0        },
    { min: 155625, max: 221708, rate: 0.29,  taxOwed: 0        },
    { min: 221708, max: null,   rate: 0.33,  taxOwed: 0        },
  ],
  totalTax: 17739.17,
  effectiveRate: 0.177392,
};

describe('TaxResultsTable', () => {
  it('renders one row per tax band', () => {
    render(<TaxResultsTable result={MOCK_RESULT} />);
    // 5 data rows + 1 header row + 1 totals row = 7 rows
    expect(screen.getAllByRole('row')).toHaveLength(7);
  });

  it('displays the total tax', () => {
    render(<TaxResultsTable result={MOCK_RESULT} />);
    // Use regex to avoid locale-specific currency symbol differences ($ vs CA$)
    expect(screen.getByText(/17,739\.17/)).toBeInTheDocument();
  });

  it('displays the effective rate as a percentage', () => {
    render(<TaxResultsTable result={MOCK_RESULT} />);
    expect(screen.getByText('17.74%')).toBeInTheDocument();
  });

  it('displays "No limit" for the top bracket max', () => {
    render(<TaxResultsTable result={MOCK_RESULT} />);
    expect(screen.getByText(/no limit/i)).toBeInTheDocument();
  });
});
