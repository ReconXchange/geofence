import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-primary-600');
  });

  it('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-slate-600');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('disables button when loading', () => {
    render(<Button loading>Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies full width class', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByText('Full Width');
    expect(button).toHaveClass('w-full');
  });
});
