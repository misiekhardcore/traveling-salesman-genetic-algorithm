import {
  CrossoverStrategy,
  FitnessStrategy,
  MutationStrategy,
  OrderCrossoverStrategy,
  ShortestPathFitnessStrategy,
  ShuffleMutationStrategy,
} from '@/services';
import { IndividualImpl } from '../Individual';
import { Population } from './Population';
import { Point } from '../Point';

describe('Population', () => {
  let mutationStrategy: MutationStrategy;
  let crossoverStrategy: CrossoverStrategy;
  let fitnessStrategy: FitnessStrategy;

  beforeAll(() => {
    mutationStrategy = new ShuffleMutationStrategy();
    crossoverStrategy = new OrderCrossoverStrategy();
    fitnessStrategy = new ShortestPathFitnessStrategy([
      new Point(0, 0),
      new Point(0, 1),
      new Point(1, 0),
      new Point(1, 1),
      new Point(1, 2),
    ]);
  });

  let individuals: IndividualImpl[];
  beforeEach(() => {
    individuals = [
      new IndividualImpl([0, 1, 2, 3, 4], mutationStrategy, crossoverStrategy),
      new IndividualImpl([3, 0, 4, 2, 1], mutationStrategy, crossoverStrategy),
    ];
  });

  it('should get the mating pool', () => {
    const population = new Population(
      individuals,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
    const matingPool = population.getMatingPool();

    expect(matingPool.length).toBe(individuals.length);
  });

  it('should reproduce', () => {
    const population = new Population(
      individuals,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
    const offspring = population.reproduce();

    expect(offspring.length).toBe(individuals.length);
  });

  it('should get the best individual', () => {
    const population = new Population(
      individuals,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
    const bestIndividual = population.getBestIndividual();

    expect(bestIndividual).toBe(individuals[0]);
  });

  it('should get the worst individual', () => {
    const population = new Population(
      individuals,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
    const worstIndividual = population.getworstIndividual();

    expect(worstIndividual).toBe(individuals[1]);
  });

  it('should score', () => {
    const population = new Population(
      individuals,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
    const score = population.score();

    expect(score).toBe(0.2743698969883089);
  });

  it('should evolve', () => {
    const population = new Population(
      individuals,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
    const newPopulation = population.evolve();

    expect(newPopulation).toBeInstanceOf(Population);
  });

  describe('getRandomPopulation', () => {
    it('should get a random population', () => {
      const points = [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(1, 1)];
      const population = Population.getRandomPopulation(
        IndividualImpl,
        5,
        points,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );

      expect(population.getPopulationSize()).toBe(5);
      expect(population.getIndividuals()[0].genes.length).toBe(4);
    });
  });

  describe('addIndividuals', () => {
    it('should add individuals', () => {
      const population = new Population(
        individuals,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );
      const newIndividuals = [
        new IndividualImpl([5, 6, 7, 8, 9], mutationStrategy, crossoverStrategy),
      ];
      population.addIndividuals(newIndividuals);
      expect(population.getIndividuals().length).toBe(3);
    });
  });

  describe('removeIndividuals', () => {
    it('should remove individuals', () => {
      const population = new Population(
        individuals,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );
      population.removeIndividuals(1);
      expect(population.getIndividuals().length).toBe(1);
    });
  });

  describe('setIndividuals', () => {
    it('should set individuals', () => {
      const population = new Population(
        individuals,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );
      const newIndividuals = [
        new IndividualImpl([5, 6, 7, 8, 9], mutationStrategy, crossoverStrategy),
      ];
      population.setIndividuals(newIndividuals);
      expect(population.getIndividuals().length).toBe(1);
    });
  });
});
