import type { Meta, StoryObj } from '@storybook/react';
import { TaxCalculatorForm } from '../components/TaxCalculatorForm';

const meta: Meta<typeof TaxCalculatorForm> = {
  title: 'TaxCalculator/TaxCalculatorForm',
  component: TaxCalculatorForm,
  args: {
    onSubmit: (salary, year) => console.log('submit', { salary, year }),
  },
};

export default meta;
type Story = StoryObj<typeof TaxCalculatorForm>;

export const Default: Story = {
  args: { isLoading: false },
};

export const Loading: Story = {
  args: { isLoading: true },
};
