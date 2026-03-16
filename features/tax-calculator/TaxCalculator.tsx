'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useTaxCalculator } from './hooks/useTaxCalculator';
import { TaxCalculatorForm } from './components/TaxCalculatorForm';
import { TaxResultsTable } from './components/TaxResultsTable';
import { TaxCalculatorError } from './components/TaxCalculatorError';

export function TaxCalculator() {
  const { state, calculate, retry } = useTaxCalculator();

  return (
    <div className="space-y-8">
      <TaxCalculatorForm
        onSubmit={calculate}
        isLoading={state.status === 'loading'}
      />

      {state.status === 'loading' && (
        <div className="space-y-3" aria-label="Loading results">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}

      {state.status === 'error' && (
        <TaxCalculatorError message={state.message} onRetry={retry} />
      )}

      {state.status === 'success' && (
        <TaxResultsTable result={state.result} />
      )}
    </div>
  );
}
