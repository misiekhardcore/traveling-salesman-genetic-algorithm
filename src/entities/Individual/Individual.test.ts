import { OrderCrossoverStrategy } from '@/services/CrossoverStrategy/OrderCrossoverStrategy/OrderCrossoverStrategy';
import { IndividualImpl } from './Individual';
import { ShuffleMutationStrategy } from '@/services/MutationStrategy/ShuffleMutationStrategy/ShuffleMutationStrategy';

describe('Individual', () => {
  const mutationStrategy = new ShuffleMutationStrategy();
  const crossoverStrategy = new OrderCrossoverStrategy();

  beforeEach(() => {
    mutationStrategy.setMutationRate(0.1);
  });

  it('should mutate the individual', () => {
    const individual = new IndividualImpl([1, 2, 3, 4, 5], mutationStrategy, crossoverStrategy);
    const currentGenes = individual.genes;
    mutationStrategy.setMutationRate(1);
    individual.mutate();
    expect(individual.genes).not.toEqual(currentGenes);
  });

  it('should crossover with another individual', () => {
    const individual1 = new IndividualImpl([3, 1, 4, 2, 5], mutationStrategy, crossoverStrategy);
    const individual2 = new IndividualImpl([5, 4, 3, 2, 1], mutationStrategy, crossoverStrategy);

    const [newIndividual1, newIndividual2] = individual1.crossover(individual2);

    expect(newIndividual1.genes).not.toEqual(individual1.genes);
    expect(newIndividual2.genes).not.toEqual(individual2.genes);
  });
});
