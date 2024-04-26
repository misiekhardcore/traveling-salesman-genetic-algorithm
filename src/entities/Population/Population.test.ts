import { FitnessStrategy, ShortestPathFitnessStrategy } from '@/services';
import { Individual } from '../Individual';
import { Population } from './Population';
import { Point } from '../Point';

describe('Population', () => {
  const individuals = [new Individual([0, 1, 2, 3, 4]), new Individual([3, 0, 4, 2, 1])];
  const fitnessStrategy: FitnessStrategy = new ShortestPathFitnessStrategy([
    new Point(0, 0),
    new Point(0, 1),
    new Point(1, 0),
    new Point(1, 1),
    new Point(1, 2),
  ]);

  it('should get the mating pool', () => {
    const population = new Population(individuals, fitnessStrategy);
    const matingPool = population.getMatingPool();

    expect(matingPool.length).toBe(individuals.length);
  });

  it('should reproduce', () => {
    const population = new Population(individuals, fitnessStrategy);
    const offspring = population.reproduce();

    expect(offspring.length).toBe(individuals.length);
  });

  it('should get the best individual', () => {
    const population = new Population(individuals, fitnessStrategy);
    const bestIndividual = population.getBestIndividual();

    expect(bestIndividual).toBe(individuals[0]);
  });

  it('should get the worst individual', () => {
    const population = new Population(individuals, fitnessStrategy);
    const worstIndividual = population.getworstIndividual();

    expect(worstIndividual).toBe(individuals[1]);
  });

  it('should score', () => {
    const population = new Population(individuals, fitnessStrategy);
    const score = population.score();

    expect(score).toBe(0.2743698969883089);
  });

  it('should evolve', () => {
    const population = new Population(individuals, fitnessStrategy);
    const newPopulation = population.evolve();

    expect(newPopulation).toBeInstanceOf(Population);
  });

  describe('getRandomPopulation', () => {
    it('should get a random population', () => {
      const points = [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(1, 1)];
      const population = Population.getRandomPopulation(5, points, fitnessStrategy, 0.5);

      expect(population.individuals.length).toBe(5);
      expect(population.individuals[0].genes.length).toBe(4);
    });
  });
});
