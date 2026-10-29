import { RouteIcon } from 'lucide-react';

import { ThemeToggle } from '@/components/ThemeToggle';

interface AppHeaderProps {
  pointsCount: number;
}

export function AppHeader({ pointsCount }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <RouteIcon className="size-4.5" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h1 className="truncate font-sans text-sm font-semibold">Traveling Salesman</h1>
            <p className="truncate text-xs text-muted-foreground">
              A genetic algorithm evolving the shortest route through {pointsCount} points
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
