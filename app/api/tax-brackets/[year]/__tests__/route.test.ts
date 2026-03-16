/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

// Mock the logger module — must happen before any import of the route
jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFetch = jest.fn<(...args: any[]) => any>();
global.fetch = mockFetch as unknown as typeof fetch;

const MOCK_BRACKETS = {
  tax_brackets: [
    { min: 0, max: 50197, rate: 0.15 },
    { min: 50197, rate: 0.205 },
  ],
};

function makeRequest(year: string) {
  return {
    request: new Request(`http://localhost/api/tax-brackets/${year}`),
    context: { params: Promise.resolve({ year }) },
  };
}

// Import the route handler after mocks are registered
let GET: (req: Request, ctx: { params: Promise<{ year: string }> }) => Promise<Response>;

beforeAll(async () => {
  const route = await import('@/app/api/tax-brackets/[year]/route');
  GET = route.GET;
});

describe('GET /api/tax-brackets/[year]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns brackets on first successful fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_BRACKETS,
    });

    const { request, context } = makeRequest('2022');
    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.tax_brackets).toHaveLength(2);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds on second attempt', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => MOCK_BRACKETS,
      });

    const { request, context } = makeRequest('2022');
    const response = await GET(request, context);

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('returns 502 after all 3 attempts fail', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { request, context } = makeRequest('2022');
    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data.error).toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('returns 502 when upstream responds with non-ok status', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { request, context } = makeRequest('2022');
    const response = await GET(request, context);

    expect(response.status).toBe(502);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});
