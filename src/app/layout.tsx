import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Traveling Salesman Genetic Algorithm',
  description:
    'Interactive visualization of the Traveling Salesman Problem solved using genetic algorithms. Watch evolution in real-time with customizable mutation and crossover strategies.',
  keywords:
    'genetic algorithm, traveling salesman problem, TSP, optimization, evolution, visualization, algorithm',
  authors: [{ name: 'misiekhardcore' }],
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
