import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

jest.mock('framer-motion', () => ({
  motion: {
    create: (Tag) => {
      const MotionComponent = ({ children, whileHover, whileTap, transition, ...props }) => {
        return <Tag {...props}>{children}</Tag>;
      };
      MotionComponent.displayName = `motion(${typeof Tag === 'string' ? Tag : 'Component'})`;
      return MotionComponent;
    },
  },
}));

describe('Button', () => {
  it('renders with correct text content', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant class by default', () => {
    render(<Button>Test</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('primary');
  });

  it('applies the correct variant class', () => {
    const { rerender } = render(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole('button').className).toContain('secondary');

    rerender(<Button variant="outline">Test</Button>);
    expect(screen.getByRole('button').className).toContain('outline');

    rerender(<Button variant="ghost">Test</Button>);
    expect(screen.getByRole('button').className).toContain('ghost');
  });

  it('applies md size class by default', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button').className).toContain('md');
  });

  it('applies the correct size class', () => {
    const { rerender } = render(<Button size="sm">Test</Button>);
    expect(screen.getByRole('button').className).toContain('sm');

    rerender(<Button size="lg">Test</Button>);
    expect(screen.getByRole('button').className).toContain('lg');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Test</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('is disabled when loading is true', () => {
    render(<Button loading>Test</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows spinner when loading', () => {
    render(<Button loading>Test</Button>);
    const spinner = document.querySelector('[aria-hidden="true"]');
    expect(spinner).toBeInTheDocument();
    expect(spinner.className).toContain('spinner');
  });

  it('shows icon when provided and not loading', () => {
    render(<Button icon={<svg data-testid="icon" />}>Test</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('does not show icon when loading', () => {
    render(<Button loading icon={<svg data-testid="icon" />}>Test</Button>);
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('renders as a different element with as prop', () => {
    render(<Button as="a" href="/test">Link</Button>);
    const link = screen.getByText('Link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('passes additional props through', () => {
    render(<Button data-testid="custom-btn" data-custom="value">Test</Button>);
    const btn = screen.getByTestId('custom-btn');
    expect(btn).toHaveAttribute('data-custom', 'value');
  });

  it('accepts custom className', () => {
    render(<Button className="my-class">Test</Button>);
    expect(screen.getByRole('button').className).toContain('my-class');
  });
});
