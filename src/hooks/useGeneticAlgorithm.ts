'use client';

import { useEffect, useRef, useState } from 'react';

import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  EVOLUTION_INTERVAL_MS,
  MAX_MUTATION_RATE,
  MAX_POINTS_COUNT,
  MAX_POPULATION_SIZE,
  MIN_MUTATION_RATE,
  MIN_POINTS_COUNT,
  MIN_POPULATION_SIZE,
  MUTATION_RATE,
  POINTS_COUNT,
  POPULATION_SIZE,
} from '@/app/constants';
import { crossoverStrategies, fitnessStrategies, mutationStrategies } from '@/app/strategies';
import { IndividualImpl, Point, Population } from '@/entities';
import {
  CrossoverStrategy,
  FitnessStrategy,
  MutationStrategy,
  OrderCrossoverStrategy,
  ShortestPathFitnessStrategy,
  ShuffleMutationStrategy,
} from '@/services';
import { clampNumber } from '@/utils';

export interface GeneticAlgorithmActions {
  /** Starts or stops the automatic evolution loop. */
  toggleAuto: () => void;
  evolveOnce: () => void;
  reset: () => void;
  /** Replaces the population with the same number of freshly randomized routes. */
  newIndividuals: () => void;
  changeMutationRate: (mutationRate: number) => void;
  changePopulationSize: (populationSize: number) => void;
  changePointsCount: (pointsCount: number) => void;
  changeFitnessStrategy: (label: string) => void;
  changeMutationStrategy: (label: string) => void;
  changeCrossoverStrategy: (label: string) => void;
}

export interface GeneticAlgorithm {
  points: Point[];
  population: Population;
  generation: number;
  isRunning: boolean;
  mutationRate: number;
  populationSize: number;
  fitnessStrategy: FitnessStrategy;
  mutationStrategy: MutationStrategy;
  crossoverStrategy: CrossoverStrategy;
  actions: GeneticAlgorithmActions;
}

/**
 * Owns the whole genetic algorithm: the current map, population, the injected
 * strategies and the evolution loop. Components stay presentational and read the
 * state they need from this hook.
 */
export function useGeneticAlgorithm(): GeneticAlgorithm {
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

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  function evolveOnce() {
    setPopulation((prevPopulation) => prevPopulation.evolve());
    setGeneration((prevGeneration) => prevGeneration + 1);
  }

  function stopAuto() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
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

  function newIndividuals() {
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

  function changeFitnessStrategy(label: string) {
    const strategy = new fitnessStrategies[label](points);
    setFitnessStrategy(strategy);
    // A new strategy re-scores every individual, so rebuild the population for
    // the canvas to follow.
    setPopulation(
      new Population(population.getIndividuals(), strategy, mutationStrategy, crossoverStrategy)
    );
  }

  function changeMutationStrategy(label: string) {
    const strategy = new mutationStrategies[label]();
    strategy.setMutationRate(mutationRate);
    setMutationStrategy(strategy);
    population.setMutationStrategy(strategy);
  }

  function changeCrossoverStrategy(label: string) {
    const strategy = new crossoverStrategies[label]();
    setCrossoverStrategy(strategy);
    population.setCrossoverStrategy(strategy);
  }

  function createNewRandomIndividuals(size: number, mapPoints: Point[]): IndividualImpl[] {
    return Array.from({ length: size }, () =>
      Population.getRandomIndividual(IndividualImpl, mapPoints, mutationStrategy, crossoverStrategy)
    );
  }

  return {
    points,
    population,
    generation,
    isRunning,
    mutationRate,
    populationSize,
    fitnessStrategy,
    mutationStrategy,
    crossoverStrategy,
    actions: {
      toggleAuto,
      evolveOnce,
      reset,
      newIndividuals,
      changeMutationRate,
      changePopulationSize,
      changePointsCount,
      changeFitnessStrategy,
      changeMutationStrategy,
      changeCrossoverStrategy,
    },
  };
}
