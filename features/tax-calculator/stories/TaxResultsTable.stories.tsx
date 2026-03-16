import type { Meta, StoryObj } from '@storybook/react';
import { TaxResultsTable } from '../components/TaxResultsTable';
import type { TaxResult } from '../lib/types';

const RESULT_50K: TaxResult = {
  bands: [
    { min: 0,      max: 50197,  rate: 0.15,  taxOwed: 7500     },
    { min: 50197,  max: 100392, rate: 0.205, taxOwed: 0        },
    { min: 100392, max: 155625, rate: 0.26,  taxOwed: 0        },
    { min: 155625, max: 221708, rate: 0.29,  taxOwed: 0        },
    { min: 221708, max: null,   rate: 0.33,  taxOwed: 0        },
  ],
  totalTax: 7500,
  effectiveRate: 0.15,
};

const RESULT_100K: TaxResult = {
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

const meta: Meta<typeof TaxResultsTable> = {
  title: 'TaxCalculator/TaxResultsTable',
  component: TaxResultsTable,
};

export default meta;
type Story = StoryObj<typeof TaxResultsTable>;

export const Salary50K: Story = {
  name: '$50,000 salary',
  args: { result: RESULT_50K },
};

export const Salary100K: Story = {
  name: '$100,000 salary',
  args: { result: RESULT_100K },
};
