'use client';

import { useEffect, useMemo, useState } from 'react';

import { IndividualImpl, Point, Population } from '@/entities';
import {
  OrderCrossoverStrategy,
  SwapMutationStrategy,
  ShortestPathFitnessStrategy,
  ShuffleMutationStrategy,
  SinglePointCrossoverStrategy,
  MutationStrategy,
  CrossoverStrategy,
} from '@/services';

import './page.scss';

const POINTS_COUNT = 10;
const POPULATION_SIZE = 200;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 700;
const MUTATION_RATE = 0.01;

const FITNESS_STRATEGY = new ShortestPathFitnessStrategy([]);

const mutationStrategiesMap: Record<string, typeof MutationStrategy> = {
  [ShuffleMutationStrategy.label]: ShuffleMutationStrategy,
  [SwapMutationStrategy.label]: SwapMutationStrategy,
};

const crossoverStrategiesMap: Record<string, typeof CrossoverStrategy> = {
  [OrderCrossoverStrategy.label]: OrderCrossoverStrategy,
  [SinglePointCrossoverStrategy.label]: SinglePointCrossoverStrategy,
};

export default function Home() {
  const [points, setPoints] = useState<Point[]>(
    Point.getRandomPoints(POINTS_COUNT, CANVAS_WIDTH, CANVAS_HEIGHT)
  );
  const fitnessStrategy = useMemo(() => {
    FITNESS_STRATEGY.setPoints(points);
    return FITNESS_STRATEGY;
  }, [points]);
  const [mutationStrategy, setMutationStrategy] = useState<MutationStrategy>(
    new ShuffleMutationStrategy()
  );
  const [crossoverStrategy, setCrossoverStrategy] = useState<CrossoverStrategy>(
    new OrderCrossoverStrategy()
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
  const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout>();

  useEffect(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach((point) => drawPoint(context, point));

    const bestIndividual = population.getBestIndividual();
    const worstIndividual = population.getworstIndividual();
    const bestPath = bestIndividual.genes;
    const worstPath = worstIndividual.genes;

    drawPath({ context, points, pointIndexes: bestPath, width: 2 });
    drawPath({ context, points, pointIndexes: worstPath, color: 'red' });
  }, [points, population]);

  function toggleAuto() {
    if (intervalRef) {
      clearInterval(intervalRef);
      setIntervalRef(undefined);
    } else {
      setIntervalRef(
        setInterval(() => {
          setPopulation((prevPopulation) => prevPopulation.evolve());
        }, 100)
      );
    }
  }

  function reset() {
    if (intervalRef) {
      clearInterval(intervalRef);
      setIntervalRef(undefined);
    }
    const newPoints = Point.getRandomPoints(POINTS_COUNT, CANVAS_WIDTH, CANVAS_HEIGHT);
    setPoints(newPoints);
    setPopulationSize(POPULATION_SIZE);
    setPopulation(() => {
      fitnessStrategy.setPoints(newPoints);
      return Population.getRandomPopulation(
        IndividualImpl,
        POPULATION_SIZE,
        newPoints,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );
    });
  }

  function changeMutationRate(newMutationRate: number) {
    setMutationRate(newMutationRate);
    population.setMutationRate(newMutationRate);
  }

  function changePopulationSize(newPopulationSize: number) {
    if (newPopulationSize === populationSize) {
      return;
    }

    if (newPopulationSize < populationSize) {
      population.removeIndividuals(populationSize - newPopulationSize);
    } else {
      const newIndividuals = createNewRandomIndividuals(newPopulationSize - populationSize, points);
      population.addIndividuals(newIndividuals);
    }
    setPopulationSize(newPopulationSize);
  }

  function setNewRandomIndividuals() {
    const newIndividuals = createNewRandomIndividuals(populationSize, points);
    population.setIndividuals(newIndividuals);
  }

  function createNewRandomIndividuals(size: number, points: Point[]): IndividualImpl[] {
    return Array.from({ length: size }, () =>
      Population.getRandomIndividual(IndividualImpl, points, mutationStrategy, crossoverStrategy)
    );
  }

  function changePointsCount(newPointsCount: number) {
    if (intervalRef) {
      clearInterval(intervalRef);
      setIntervalRef(undefined);
    }
    const newPoints = Point.getRandomPoints(newPointsCount, CANVAS_WIDTH, CANVAS_HEIGHT);
    setPoints(newPoints);
    setPopulation(() => {
      fitnessStrategy.setPoints(newPoints);
      return Population.getRandomPopulation(
        IndividualImpl,
        population.getPopulationSize(),
        newPoints,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );
    });
  }

  function changeMutationStrategy(newMutationStrategy: string) {
    const mutationStrategy = new mutationStrategiesMap[newMutationStrategy]();
    mutationStrategy.setMutationRate(mutationRate);
    setMutationStrategy(mutationStrategy);
    population.setMutationStrategy(mutationStrategy);
  }

  function changeCrossoverStrategy(newCrossoverStrategy: string) {
    const crossoverStrategy = new crossoverStrategiesMap[newCrossoverStrategy]();
    setCrossoverStrategy(crossoverStrategy);
    population.setCrossoverStrategy(crossoverStrategy);
  }

  return (
    <main>
      <label>
        Mutation strategy:
        <select
          value={mutationStrategy.label}
          onChange={(e) => changeMutationStrategy(e.target.value)}
        >
          <option value={ShuffleMutationStrategy.label}>{ShuffleMutationStrategy.label}</option>
          <option value={SwapMutationStrategy.label}>{SwapMutationStrategy.label}</option>
        </select>
      </label>
      <label>
        Crossover strategy:
        <select
          value={crossoverStrategy.label}
          onChange={(e) => changeCrossoverStrategy(e.target.value)}
        >
          <option value={OrderCrossoverStrategy.label}>{OrderCrossoverStrategy.label}</option>
          <option value={SinglePointCrossoverStrategy.label}>
            {SinglePointCrossoverStrategy.label}
          </option>
        </select>
      </label>
      <label>
        Mutation rate:
        <input
          type="number"
          value={mutationRate}
          onChange={(e) => changeMutationRate(Number(e.target.value))}
          step={0.01}
          min={0}
          max={1}
        />
      </label>
      <label>
        Points count:
        <input
          type="number"
          value={points.length}
          onChange={(e) => changePointsCount(Number(e.target.value))}
          min={2}
          max={100}
        />
      </label>
      <label>
        Population size:
        <input
          type="number"
          value={populationSize}
          onChange={(e) => changePopulationSize(Number(e.target.value))}
          min={1}
          max={1000}
        />
      </label>
      <button onClick={setNewRandomIndividuals}>New random individuals</button>
      <button onClick={toggleAuto}>{intervalRef ? 'pause' : 'run'}</button>
      <button onClick={() => setPopulation(population.evolve())}>next generation</button>
      <button onClick={reset}>reset</button>
      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </main>
  );
}

function drawPoint(context: CanvasRenderingContext2D, point: Point) {
  context.fillStyle = 'white';
  context.beginPath();
  context.arc(point.x, point.y, 3, 0, Math.PI * 2);
  context.fill();
  context.closePath();
}

function drawPath({
  context,
  pointIndexes,
  points,
  color = 'white',
  width = 1,
}: {
  context: CanvasRenderingContext2D;
  points: Point[];
  pointIndexes: number[];
  color?: string;
  width?: number;
}) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = width;

  pointIndexes.forEach((pointIndex) => {
    const point = points[pointIndex];
    context.lineTo(point.x, point.y);
  });

  context.lineTo(points[pointIndexes[0]].x, points[pointIndexes[0]].y);
  context.stroke();
  context.closePath();
}
