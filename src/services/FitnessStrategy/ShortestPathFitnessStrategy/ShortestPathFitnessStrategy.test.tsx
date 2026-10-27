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

  it('should memoize a chromosome and rescore it once the points move', () => {
    const points = [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(1, 1)];
    const movedPoints = [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(9, 9)];
    const fitnessStrategy = new ShortestPathFitnessStrategy(points);
    const individual = new IndividualImpl([0, 1, 2, 3], mutationStrategy, crossoverStrategy);

    const first = fitnessStrategy.getIndividualFitness(individual);
    // Second read hits the memo rather than recomputing.
    expect(fitnessStrategy.getIndividualFitness(individual)).toBe(first);

    fitnessStrategy.setPoints(movedPoints);

    // The memo has to follow the map, or every route keeps its old score.
    const coldStrategy = new ShortestPathFitnessStrategy(movedPoints);
    expect(fitnessStrategy.getIndividualFitness(individual)).not.toBe(first);
    expect(fitnessStrategy.getIndividualFitness(individual)).toBe(
      coldStrategy.getIndividualFitness(individual)
    );
  });
});
