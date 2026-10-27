'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { IndividualImpl, Point, Population } from '@/entities';
import {
  OrderCrossoverStrategy,
  SwapMutationStrategy,
  ShortestPathFitnessStrategy,
  ShuffleMutationStrategy,
  SinglePointCrossoverStrategy,
  MutationStrategy,
  CrossoverStrategy,
  ManhattanDistanceFitnessStrategy,
  FitnessStrategy,
} from '@/services';

import './page.scss';

const POINTS_COUNT = 10;
const POPULATION_SIZE = 200;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 700;
const MUTATION_RATE = 0.01;
const POINT_RADIUS = 8;
const MIN_MUTATION_RATE = 0;
const MAX_MUTATION_RATE = 1;
const MIN_POINTS_COUNT = 2;
const MAX_POINTS_COUNT = 100;
const MIN_POPULATION_SIZE = 1;
const MAX_POPULATION_SIZE = 1000;
const BEST_ROUTE_WIDTH = 2.5;
const WORST_ROUTE_WIDTH = 1.25;
const EVOLUTION_INTERVAL_MS = 100;
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

const fitnessStrategiesMap: Record<string, typeof FitnessStrategy> = {
  [ShortestPathFitnessStrategy.label]: ShortestPathFitnessStrategy,
  [ManhattanDistanceFitnessStrategy.label]: ManhattanDistanceFitnessStrategy,
};

const mutationStrategiesMap: Record<string, typeof MutationStrategy> = {
  [ShuffleMutationStrategy.label]: ShuffleMutationStrategy,
  [SwapMutationStrategy.label]: SwapMutationStrategy,
};

const crossoverStrategiesMap: Record<string, typeof CrossoverStrategy> = {
  [OrderCrossoverStrategy.label]: OrderCrossoverStrategy,
  [SinglePointCrossoverStrategy.label]: SinglePointCrossoverStrategy,
};

/**
 * Colors used to draw the visualization. They are read from the CSS custom
 * properties declared in globals.css, so the canvas always follows the exact
 * same light/dark scheme as the page around it instead of guessing the ink
 * color in JavaScript.
 */
type CanvasPalette = {
  surface: string;
  ink: string;
  worst: string;
};

function readCanvasPalette(): CanvasPalette {
  const styles = getComputedStyle(document.documentElement);
  const read = (property: string, fallback: string) => {
    const value = styles.getPropertyValue(property).trim();
    return value === '' ? fallback : value;
  };

  return {
    surface: read('--canvas-surface', '#ffffff'),
    ink: read('--canvas-ink', '#0f172a'),
    worst: read('--canvas-worst', '#d92d20'),
  };
}

function subscribeToDarkScheme(onStoreChange: () => void) {
  const colorScheme = window.matchMedia(DARK_SCHEME_QUERY);
  colorScheme.addEventListener('change', onStoreChange);

  return () => colorScheme.removeEventListener('change', onStoreChange);
}

/**
 * The number inputs carry min/max attributes, but typing is not constrained by
 * them, so out-of-range and half-typed values do reach the handlers. Clamping
 * here keeps a zero-sized population (which has no best route to draw) and a NaN
 * mutation rate (which would silently disable mutation) out of the algorithm.
 */
function clampNumber(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, value));
}

/**
 * Resolves the active color scheme and re-renders when the user switches it, so
 * the canvas repaints together with the CSS around it.
 */
function useDarkScheme(): boolean {
  return useSyncExternalStore(
    subscribeToDarkScheme,
    () => window.matchMedia(DARK_SCHEME_QUERY).matches,
    () => false
  );
}

export default function Home() {
  const [points, setPoints] = useState<Point[]>(() =>
    Point.getRandomPoints(POINTS_COUNT, CANVAS_WIDTH, CANVAS_HEIGHT)
  );
  const [fitnessStrategy, setFitnessStrategy] = useState<FitnessStrategy>(
    () => new ShortestPathFitnessStrategy(points)
  );
  const [mutationStrategy, setMutationStrategy] = useState<MutationStrategy>(
    () => new ShuffleMutationStrategy()
  );
  const [crossoverStrategy, setCrossoverStrategy] = useState<CrossoverStrategy>(
    () => new OrderCrossoverStrategy()
  );
  const [mutationRate, setMutationRate] = useState(MUTATION_RATE);
  const [populationSize, setPopulationSize] = useState(POPULATION_SIZE);
  const [population, setPopulation] = useState<Population>(() => {
    return Population.getRandomPopulation(
      IndividualImpl,
      populationSize,
      points,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
  });
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDarkScheme = useDarkScheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const palette = readCanvasPalette();

    if (population.getPopulationSize() === 0) {
      return;
    }

    const bestPath = population.getBestIndividual().genes;
    const worstPath = population.getworstIndividual().genes;

    // Paint the canvas surface first, so the ink always contrasts with it no
    // matter what the page background happens to be.
    context.fillStyle = palette.surface;
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawPath({
      context,
      points,
      pointIndexes: worstPath,
      color: palette.worst,
      width: WORST_ROUTE_WIDTH,
    });
    drawPath({
      context,
      points,
      pointIndexes: bestPath,
      color: palette.ink,
      width: BEST_ROUTE_WIDTH,
    });
    points.forEach((point) => drawPoint({ context, point, palette }));
  }, [points, population, isDarkScheme]);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  function stopAuto() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }

  function evolveOnce() {
    setPopulation((prevPopulation) => prevPopulation.evolve());
    setGeneration((prevGeneration) => prevGeneration + 1);
  }

  function toggleAuto() {
    if (intervalRef.current !== null) {
      stopAuto();
      return;
    }

    intervalRef.current = setInterval(() => {
      setPopulation((prevPopulation) => prevPopulation.evolve());
      setGeneration((prevGeneration) => prevGeneration + 1);
    }, EVOLUTION_INTERVAL_MS);
    setIsRunning(true);
  }

  function reset() {
    stopAuto();
    const newPoints = Point.getRandomPoints(POINTS_COUNT, CANVAS_WIDTH, CANVAS_HEIGHT);
    fitnessStrategy.setPoints(newPoints);
    setPoints(newPoints);
    setPopulationSize(POPULATION_SIZE);
    setGeneration(0);
    setPopulation(
      Population.getRandomPopulation(
        IndividualImpl,
        POPULATION_SIZE,
        newPoints,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      )
    );
  }

  function changeMutationRate(newMutationRate: number) {
    const rate = clampNumber(newMutationRate, MIN_MUTATION_RATE, MAX_MUTATION_RATE, mutationRate);

    setMutationRate(rate);
    population.setMutationRate(rate);
  }

  function changePopulationSize(newPopulationSize: number) {
    const size = clampNumber(
      newPopulationSize,
      MIN_POPULATION_SIZE,
      MAX_POPULATION_SIZE,
      populationSize
    );

    if (size === populationSize) {
      return;
    }

    if (size < populationSize) {
      population.removeIndividuals(populationSize - size);
    } else {
      population.addIndividuals(createNewRandomIndividuals(size - populationSize, points));
    }

    setPopulationSize(size);
    // Wrap the resized individuals in a new instance so the canvas repaints.
    setPopulation(
      new Population(
        population.getIndividuals(),
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      )
    );
  }

  function setNewRandomIndividuals() {
    setGeneration(0);
    setPopulation(
      new Population(
        createNewRandomIndividuals(populationSize, points),
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      )
    );
  }

  function createNewRandomIndividuals(size: number, points: Point[]): IndividualImpl[] {
    return Array.from({ length: size }, () =>
      Population.getRandomIndividual(IndividualImpl, points, mutationStrategy, crossoverStrategy)
    );
  }

  function changePointsCount(newPointsCount: number) {
    const pointsCount = clampNumber(
      newPointsCount,
      MIN_POINTS_COUNT,
      MAX_POINTS_COUNT,
      points.length
    );

    if (pointsCount === points.length) {
      return;
    }

    stopAuto();
    const newPoints = Point.getRandomPoints(pointsCount, CANVAS_WIDTH, CANVAS_HEIGHT);
    fitnessStrategy.setPoints(newPoints);
    setPoints(newPoints);
    setGeneration(0);
    setPopulation(
      Population.getRandomPopulation(
        IndividualImpl,
        population.getPopulationSize(),
        newPoints,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      )
    );
  }

  function changeFitnessStrategy(newFitnessStrategy: string) {
    const strategy = new fitnessStrategiesMap[newFitnessStrategy](points);
    setFitnessStrategy(strategy);
    // A new strategy re-scores every individual, so rebuild the population for
    // the canvas to follow.
    setPopulation(
      new Population(population.getIndividuals(), strategy, mutationStrategy, crossoverStrategy)
    );
  }

  function changeMutationStrategy(newMutationStrategy: string) {
    const strategy = new mutationStrategiesMap[newMutationStrategy]();
    strategy.setMutationRate(mutationRate);
    setMutationStrategy(strategy);
    population.setMutationStrategy(strategy);
  }

  function changeCrossoverStrategy(newCrossoverStrategy: string) {
    const strategy = new crossoverStrategiesMap[newCrossoverStrategy]();
    setCrossoverStrategy(strategy);
    population.setCrossoverStrategy(strategy);
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Traveling Salesman</h1>
        <p className="app__tagline">
          A genetic algorithm evolving the shortest route through {points.length} points. Tune the
          strategies, then let the population evolve.
        </p>
      </header>

      <div className="app__layout">
        <aside className="panel panel--controls" aria-label="Algorithm controls">
          <div className="control-group">
            <h2 className="control-group__title">Strategies</h2>
            <label className="field">
              <span className="field__label">Fitness</span>
              <select
                className="field__control"
                value={fitnessStrategy.label}
                onChange={(e) => changeFitnessStrategy(e.target.value)}
              >
                <option value={ShortestPathFitnessStrategy.label}>
                  {ShortestPathFitnessStrategy.label}
                </option>
                <option value={ManhattanDistanceFitnessStrategy.label}>
                  {ManhattanDistanceFitnessStrategy.label}
                </option>
              </select>
            </label>
            <label className="field">
              <span className="field__label">Crossover</span>
              <select
                className="field__control"
                value={crossoverStrategy.label}
                onChange={(e) => changeCrossoverStrategy(e.target.value)}
              >
                <option value={OrderCrossoverStrategy.label}>{OrderCrossoverStrategy.label}</option>
                <option value={SinglePointCrossoverStrategy.label}>
                  {SinglePointCrossoverStrategy.label}
                </option>
              </select>
            </label>
            <label className="field">
              <span className="field__label">Mutation</span>
              <select
                className="field__control"
                value={mutationStrategy.label}
                onChange={(e) => changeMutationStrategy(e.target.value)}
              >
                <option value={ShuffleMutationStrategy.label}>
                  {ShuffleMutationStrategy.label}
                </option>
                <option value={SwapMutationStrategy.label}>{SwapMutationStrategy.label}</option>
              </select>
            </label>
          </div>

          <div className="control-group">
            <h2 className="control-group__title">Parameters</h2>
            <label className="field">
              <span className="field__label">Mutation rate</span>
              <input
                className="field__control"
                type="number"
                value={mutationRate}
                onChange={(e) => changeMutationRate(Number(e.target.value))}
                step={0.01}
                min={0}
                max={1}
              />
            </label>
            <label className="field">
              <span className="field__label">Points count</span>
              <input
                className="field__control"
                type="number"
                value={points.length}
                onChange={(e) => changePointsCount(Number(e.target.value))}
                min={2}
                max={100}
              />
            </label>
            <label className="field">
              <span className="field__label">Population size</span>
              <input
                className="field__control"
                type="number"
                value={populationSize}
                onChange={(e) => changePopulationSize(Number(e.target.value))}
                min={1}
                max={1000}
              />
            </label>
          </div>

          <div className="control-group">
            <h2 className="control-group__title">Run</h2>
            <div className="button-row">
              <button type="button" className="button button--primary" onClick={toggleAuto}>
                {isRunning ? 'Pause' : 'Run'}
              </button>
              <button type="button" className="button" onClick={evolveOnce}>
                Next generation
              </button>
              <button type="button" className="button" onClick={setNewRandomIndividuals}>
                New individuals
              </button>
              <button type="button" className="button" onClick={reset}>
                Reset
              </button>
            </div>
          </div>
        </aside>

        <section className="panel panel--stage" aria-label="Visualization">
          <div className="stage">
            <canvas
              ref={canvasRef}
              className="stage__canvas"
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              role="img"
              aria-label="The best and worst routes of the current population"
            />
          </div>

          <div className="stage__meta">
            <ul className="legend">
              <li className="legend__item">
                <span className="legend__swatch legend__swatch--best" aria-hidden="true" />
                Best route
              </li>
              <li className="legend__item">
                <span className="legend__swatch legend__swatch--worst" aria-hidden="true" />
                Worst route
              </li>
              <li className="legend__item">
                <span className="legend__swatch legend__swatch--point" aria-hidden="true" />
                Points
              </li>
            </ul>

            <dl className="stats">
              <div className="stats__item">
                <dt className="stats__label">Generation</dt>
                <dd className="stats__value">{generation}</dd>
              </div>
              <div className="stats__item">
                <dt className="stats__label">Population</dt>
                <dd className="stats__value">{populationSize}</dd>
              </div>
              <div className="stats__item">
                <dt className="stats__label">Points</dt>
                <dd className="stats__value">{points.length}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}

function drawPoint({
  context,
  point,
  palette,
}: {
  context: CanvasRenderingContext2D;
  point: Point;
  palette: CanvasPalette;
}) {
  context.beginPath();
  context.arc(point.x, point.y, POINT_RADIUS, 0, Math.PI * 2);
  context.fillStyle = palette.ink;
  context.fill();
  // Ring the node with the surface color so overlapping routes cannot swallow it.
  context.strokeStyle = palette.surface;
  context.lineWidth = 2;
  context.stroke();
  context.closePath();
}

function drawPath({
  context,
  pointIndexes,
  points,
  color,
  width,
}: {
  context: CanvasRenderingContext2D;
  points: Point[];
  pointIndexes: number[];
  color: string;
  width: number;
}) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.lineJoin = 'round';
  context.lineCap = 'round';

  pointIndexes.forEach((pointIndex) => {
    const point = points[pointIndex];
    context.lineTo(point.x, point.y);
  });

  context.lineTo(points[pointIndexes[0]].x, points[pointIndexes[0]].y);
  context.stroke();
  context.closePath();
}
