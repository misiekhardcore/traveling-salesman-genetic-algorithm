import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Traveling Salesman Genetic Algorithm',
  description:
    'Interactive visualization of the Traveling Salesman Problem solved using genetic algorithms. Watch evolution in real-time with customizable mutation and crossover strategies.',
  keywords:
    'genetic algorithm, traveling salesman problem, TSP, optimization, evolution, visualization, algorithm',
  authors: [{ name: 'misiekhardcore', email: 'konopskiwebdev@gmail.com' }],
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
