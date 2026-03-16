import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEFAULT_TAX_YEAR, TAX_YEARS, type TaxYear } from '../lib/types';

interface TaxCalculatorFormProps {
  onSubmit: (salary: number, year: TaxYear) => void;
  isLoading: boolean;
}

export function TaxCalculatorForm({ onSubmit, isLoading }: TaxCalculatorFormProps) {
  const [salary, setSalary] = useState('');
  const [year, setYear] = useState<TaxYear>(DEFAULT_TAX_YEAR);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(salary);
    if (isNaN(parsed) || parsed < 0) return;
    onSubmit(parsed, year);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="salary">Annual Salary</Label>
        <Input
          id="salary"
          type="number"
          min={0}
          step="any"
          placeholder="e.g. 100000"
          value={salary}
          onChange={e => setSalary(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="tax-year">Tax Year</Label>
        <Select
          value={year}
          onValueChange={val => setYear(val as TaxYear)}
          disabled={isLoading}
        >
          <SelectTrigger id="tax-year">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TAX_YEARS.map(y => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Calculating…' : 'Calculate Tax'}
      </Button>
    </form>
  );
}
