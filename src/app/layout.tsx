import { TooltipProvider } from '@konopskidev/ui';
import type { Metadata } from 'next';
import { Lato, Playfair_Display } from 'next/font/google';

import { ThemeProvider } from '@/components/ThemeProvider';
import { cn } from '@/utils';

import './globals.css';

// The design system reads its type from these variables, falling back to the
// system stack when they are absent.
const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Traveling Salesman Genetic Algorithm',
  description:
    'Interactive visualization of the Traveling Salesman Problem solved using genetic algorithms. Watch evolution in real-time with customizable mutation and crossover strategies.',
  keywords:
    'genetic algorithm, traveling salesman problem, TSP, optimization, evolution, visualization, algorithm',
  authors: [{ name: 'misiekhardcore', url: 'https://github.com/misiekhardcore' }],
  creator: 'misiekhardcore',
  openGraph: {
    title: 'Traveling Salesman Genetic Algorithm',
    description:
      'Interactive visualization of the Traveling Salesman Problem solved using genetic algorithms',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('font-sans', lato.variable, playfairDisplay.variable)}
    >
      <body className="min-h-svh bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
