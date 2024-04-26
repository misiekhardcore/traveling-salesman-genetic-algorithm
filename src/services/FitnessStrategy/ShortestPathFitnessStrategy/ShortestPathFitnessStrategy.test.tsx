import { Individual, Point } from '@/entities';

import { ShortestPathFitnessStrategy } from './ShortestPathFitnessStrategy';

describe('ShortestPathFitnessStrategy', () => {
  it('should return the correct fitness for an individual', () => {
    const points = [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(1, 1)];
    const fitnessStrategy = new ShortestPathFitnessStrategy(points);

    const individual = new Individual([0, 1, 2, 3]);
    const fitness = fitnessStrategy.getIndividualFitness(individual);
    expect(fitness).toBe(0.20710678118654754);
  });

  it('should return the correct fitness sum for a list of individuals', () => {
    const points = [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(1, 1)];
    const fitnessStrategy = new ShortestPathFitnessStrategy(points);

    const individuals = [new Individual([0, 1, 2, 3]), new Individual([3, 2, 1, 0])];
    const fitnessSum = fitnessStrategy.getFitnessSum(individuals);
    expect(fitnessSum).toBe(0.4142135623730951);
  });
});
