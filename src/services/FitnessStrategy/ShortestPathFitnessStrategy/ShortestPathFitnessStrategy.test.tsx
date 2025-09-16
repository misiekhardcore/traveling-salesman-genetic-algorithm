import { IndividualImpl, Point } from '@/entities';

import { ShortestPathFitnessStrategy } from './ShortestPathFitnessStrategy';
import { OrderCrossoverStrategy } from '@/services/CrossoverStrategy/OrderCrossoverStrategy/OrderCrossoverStrategy';
import { ShuffleMutationStrategy } from '@/services/MutationStrategy/ShuffleMutationStrategy/ShuffleMutationStrategy';

describe('ShortestPathFitnessStrategy', () => {
  const mutationStrategy = new ShuffleMutationStrategy();
  const crossoverStrategy = new OrderCrossoverStrategy();

  it('should return the correct fitness for an individual', () => {
    const points = [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(1, 1)];
    const fitnessStrategy = new ShortestPathFitnessStrategy(points);

    const individual = new IndividualImpl([0, 1, 2, 3], mutationStrategy, crossoverStrategy);
    const fitness = fitnessStrategy.getIndividualFitness(individual);
    expect(fitness).toBe(0.20710678118654754);
  });

  it('should return the correct fitness sum for a list of individuals', () => {
    const points = [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(1, 1)];
    const fitnessStrategy = new ShortestPathFitnessStrategy(points);

    const individuals = [
      new IndividualImpl([0, 1, 2, 3], mutationStrategy, crossoverStrategy),
      new IndividualImpl([3, 2, 1, 0], mutationStrategy, crossoverStrategy),
    ];
    const fitnessSum = fitnessStrategy.getFitnessSum(individuals);
    expect(fitnessSum).toBe(0.4142135623730951);
  });
});
