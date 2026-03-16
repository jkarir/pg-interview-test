import { renderHook, act, waitFor } from '@testing-library/react';
import { useTaxCalculator } from '../useTaxCalculator';

// Ensure fetch exists on global for jsdom environment
if (!global.fetch) {
  global.fetch = jest.fn() as unknown as typeof fetch;
}

const MOCK_BRACKETS = [
  { min: 0, max: 50197, rate: 0.15 },
  { min: 50197, max: 100392, rate: 0.205 },
  { min: 100392, max: 155625, rate: 0.26 },
  { min: 155625, max: 221708, rate: 0.29 },
  { min: 221708, rate: 0.33 },
];

const mockSuccessResponse = () =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ tax_brackets: MOCK_BRACKETS }),
  } as Response);

const mockErrorResponse = () =>
  Promise.resolve({
    ok: false,
    status: 502,
    json: () => Promise.resolve({ error: 'Service unavailable' }),
  } as Response);

describe('useTaxCalculator', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockReset();
  });

  it('starts in idle state', () => {
    const { result } = renderHook(() => useTaxCalculator());
    expect(result.current.state.status).toBe('idle');
  });

  it('transitions to loading then success', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(mockSuccessResponse);

    const { result } = renderHook(() => useTaxCalculator());

    act(() => {
      result.current.calculate(50000, '2022');
    });

    expect(result.current.state.status).toBe('loading');

    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });

    if (result.current.state.status === 'success') {
      expect(result.current.state.result.totalTax).toBe(7500);
    }
  });

  it('transitions to error state on failed fetch', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(mockErrorResponse);

    const { result } = renderHook(() => useTaxCalculator());

    await act(async () => {
      result.current.calculate(50000, '2022');
    });

    await waitFor(() => {
      expect(result.current.state.status).toBe('error');
    });

    if (result.current.state.status === 'error') {
      expect(result.current.state.message).toBeTruthy();
    }
  });

  it('retries last calculation when retry() is called', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce(mockErrorResponse)
      .mockImplementationOnce(mockSuccessResponse);

    const { result } = renderHook(() => useTaxCalculator());

    // First attempt fails
    await act(async () => {
      result.current.calculate(50000, '2022');
    });
    await waitFor(() => expect(result.current.state.status).toBe('error'));

    // Retry succeeds
    await act(async () => {
      result.current.retry();
    });
    await waitFor(() => expect(result.current.state.status).toBe('success'));

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
