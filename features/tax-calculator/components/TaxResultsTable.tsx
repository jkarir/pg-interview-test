import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { TaxResult } from '../lib/types';

interface TaxResultsTableProps {
  result: TaxResult;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}

function formatRange(min: number, max: number | null): string {
  const minStr = formatCurrency(min);
  const maxStr = max !== null ? formatCurrency(max) : 'No limit';
  return `${minStr} – ${maxStr}`;
}

export function TaxResultsTable({ result }: TaxResultsTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Income Range</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Tax Owed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.bands.map((band, i) => (
            <TableRow key={i}>
              <TableCell>{formatRange(band.min, band.max)}</TableCell>
              <TableCell className="text-right">{formatPercent(band.rate)}</TableCell>
              <TableCell className="text-right">{formatCurrency(band.taxOwed)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} className="font-semibold">
              Total Tax
            </TableCell>
            <TableCell className="text-right font-semibold">
              {formatCurrency(result.totalTax)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <p className="text-sm text-muted-foreground">
        Effective rate:{' '}
        <span className="font-semibold text-foreground">
          {formatPercent(result.effectiveRate)}
        </span>
      </p>
    </div>
  );
}
