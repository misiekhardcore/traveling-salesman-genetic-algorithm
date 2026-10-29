'use client';

import { Badge } from '@konopskidev/ui';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/app/constants';
import { Section } from '@/components/Section';
import type { Point, Population } from '@/entities';

import { paintPopulation, readCanvasPalette } from './canvasPainting';

interface VisualizationStageProps {
  points: Point[];
  population: Population;
  generation: number;
  populationSize: number;
}

export function VisualizationStage({
  points,
  population,
  generation,
  populationSize,
}: VisualizationStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The palette is read from the CSS tokens at paint time; resolvedTheme only
  // tells the effect that those tokens have changed.
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context || population.getPopulationSize() === 0) {
      return;
    }

    paintPopulation({
      context,
      width: canvas.width,
      height: canvas.height,
      points,
      bestPath: population.getBestIndividual().genes,
      worstPath: population.getworstIndividual().genes,
      palette: readCanvasPalette(),
    });
  }, [points, population, resolvedTheme]);

  return (
    <Section
      title="Visualization"
      description="The shortest and the longest route of the current population."
      action={<Badge variant="secondary">Generation {generation}</Badge>}
      className="min-w-0"
    >
      <div className="overflow-hidden rounded-sm border border-border bg-card">
        <canvas
          ref={canvasRef}
          className="block h-auto w-full"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          role="img"
          aria-label="The best and worst routes of the current population"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-0.5 w-5 rounded-full bg-foreground" />
            Best route
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-0.5 w-5 rounded-full bg-destructive" />
            Worst route
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="size-2.5 rounded-full bg-foreground" />
            Points
          </li>
        </ul>

        <dl className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <div className="flex items-baseline gap-1.5">
            <dt className="text-muted-foreground">Population</dt>
            <dd className="font-semibold tabular-nums">{populationSize}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-muted-foreground">Points</dt>
            <dd className="font-semibold tabular-nums">{points.length}</dd>
          </div>
        </dl>
      </div>
    </Section>
  );
}
