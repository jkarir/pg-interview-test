import { Button } from '@/components/ui/button';

interface TaxCalculatorErrorProps {
  message: string;
  onRetry: () => void;
}

export function TaxCalculatorError({ message, onRetry }: TaxCalculatorErrorProps) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
      <p className="mb-1 font-semibold text-destructive">
        Something went wrong. Please try again.
      </p>
      <p className="mb-4 text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
