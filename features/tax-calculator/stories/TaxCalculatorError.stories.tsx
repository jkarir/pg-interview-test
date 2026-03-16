import type { Meta, StoryObj } from '@storybook/react';
import { TaxCalculatorError } from '../components/TaxCalculatorError';

const meta: Meta<typeof TaxCalculatorError> = {
  title: 'TaxCalculator/TaxCalculatorError',
  component: TaxCalculatorError,
  args: {
    onRetry: () => console.log('retry clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof TaxCalculatorError>;

export const Default: Story = {
  args: {
    message: 'Service temporarily unavailable.',
  },
};
