import { TaxCalculator } from '@/features/tax-calculator/TaxCalculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Tax Calculator</h1>
          <p className="mt-2 text-muted-foreground">
            Calculate your Canadian federal income tax for a given salary and tax year.
          </p>
        </div>
        <TaxCalculator />
      </div>
    </main>
  );
}
