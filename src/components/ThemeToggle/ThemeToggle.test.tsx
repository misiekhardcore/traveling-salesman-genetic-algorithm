import { TooltipProvider } from '@konopskidev/ui';
import { render, screen } from '@testing-library/react';

import { ThemeProvider } from '@/components/ThemeProvider';

import { ThemeToggle } from './ThemeToggle';

function renderThemeToggle() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <ThemeToggle />
      </TooltipProvider>
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  it('should render a control for every theme option', () => {
    renderThemeToggle();

    expect(screen.getByLabelText('Light')).toBeInTheDocument();
    expect(screen.getByLabelText('System')).toBeInTheDocument();
    expect(screen.getByLabelText('Dark')).toBeInTheDocument();
  });
});
