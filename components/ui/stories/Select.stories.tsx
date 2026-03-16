import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { TAX_YEARS } from '@/features/tax-calculator/lib/types';

const meta: Meta = {
  title: 'UI/Select',
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Select defaultValue={TAX_YEARS[0]}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TAX_YEARS.map(y => (
          <SelectItem key={y} value={y}>{y}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <Select defaultValue={TAX_YEARS[0]} disabled>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TAX_YEARS.map(y => (
          <SelectItem key={y} value={y}>{y}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};
