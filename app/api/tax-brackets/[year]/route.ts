import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { TaxBracketsResponseSchema, type TaxBracketsResponse } from '@/features/tax-calculator/lib/types';

const DOCKER_API_BASE = process.env.TAX_API_BASE_URL ?? 'http://localhost:5001';
const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 100;

async function fetchBracketsWithRetry(
  year: string
): Promise<{ data: TaxBracketsResponse; attempts: number }> {
  const url = `${DOCKER_API_BASE}/tax-calculator/tax-year/${year}`;
  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`Upstream responded with HTTP ${response.status}`);
      }

      const data = TaxBracketsResponseSchema.parse(await response.json());
      return { data, attempts: attempt };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < MAX_ATTEMPTS) {
        logger.warn(
          { year, attempt, error: lastError.message },
          'Tax brackets fetch failed, retrying'
        );
        await new Promise(resolve => setTimeout(resolve, BASE_DELAY_MS * Math.pow(2, attempt - 1)));
      }
    }
  }

  logger.error(
    { year, attempts: MAX_ATTEMPTS, error: lastError.message },
    'All retry attempts exhausted for tax brackets'
  );

  throw lastError;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  const { year } = await params;
  const startMs = Date.now();

  logger.info({ year }, 'Tax brackets request received');

  try {
    const { data, attempts } = await fetchBracketsWithRetry(year);

    logger.info(
      { year, attempts, durationMs: Date.now() - startMs },
      'Tax brackets fetched successfully'
    );

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tax brackets';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
