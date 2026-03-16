import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaxCalculatorForm } from '../TaxCalculatorForm';

describe('TaxCalculatorForm', () => {
  it('renders salary input', () => {
    render(<TaxCalculatorForm onSubmit={() => {}} isLoading={false} />);
    expect(screen.getByLabelText(/annual salary/i)).toBeInTheDocument();
  });

  it('renders tax year select', () => {
    render(<TaxCalculatorForm onSubmit={() => {}} isLoading={false} />);
    expect(screen.getByLabelText(/tax year/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<TaxCalculatorForm onSubmit={() => {}} isLoading={false} />);
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
  });

  it('calls onSubmit with salary and year on valid submission', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<TaxCalculatorForm onSubmit={onSubmit} isLoading={false} />);

    await user.clear(screen.getByLabelText(/annual salary/i));
    await user.type(screen.getByLabelText(/annual salary/i), '100000');
    await user.click(screen.getByRole('button', { name: /calculate/i }));

    expect(onSubmit).toHaveBeenCalledWith(100000, '2022');
  });

  it('disables the submit button while loading', () => {
    render(<TaxCalculatorForm onSubmit={() => {}} isLoading={true} />);
    expect(screen.getByRole('button', { name: /calculating/i })).toBeDisabled();
  });

  it('does not submit when salary is empty', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<TaxCalculatorForm onSubmit={onSubmit} isLoading={false} />);

    await user.click(screen.getByRole('button', { name: /calculate/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
