import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaxCalculator } from '../TaxCalculator';

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

describe('TaxCalculator', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockReset();
  });

  it('renders the form on initial load', () => {
    render(<TaxCalculator />);
    expect(screen.getByLabelText(/annual salary/i)).toBeInTheDocument();
  });

  it('shows results after a successful submission', async () => {
    const user = userEvent.setup();
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ tax_brackets: MOCK_BRACKETS }),
    } as Response);

    render(<TaxCalculator />);

    await user.type(screen.getByLabelText(/annual salary/i), '100000');
    await user.click(screen.getByRole('button', { name: /calculate/i }));

    await waitFor(() => {
      expect(screen.getByText(/17,739\.17/)).toBeInTheDocument();
    });
  });

  it('shows error state on fetch failure', async () => {
    const user = userEvent.setup();
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: () => Promise.resolve({ error: 'Service unavailable' }),
    } as Response);

    render(<TaxCalculator />);

    await user.type(screen.getByLabelText(/annual salary/i), '50000');
    await user.click(screen.getByRole('button', { name: /calculate/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});
