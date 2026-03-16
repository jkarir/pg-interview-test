import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaxCalculatorError } from '../TaxCalculatorError';

describe('TaxCalculatorError', () => {
  it('renders the generic error message', () => {
    render(<TaxCalculatorError message="Service unavailable" onRetry={() => {}} />);
    expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
  });

  it('renders the specific error detail', () => {
    render(<TaxCalculatorError message="Service unavailable" onRetry={() => {}} />);
    expect(screen.getByText('Service unavailable')).toBeInTheDocument();
  });

  it('calls onRetry when the button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    render(<TaxCalculatorError message="Error" onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
