import { Individual } from './Individual';

describe('Individual', () => {
  it('should mutate the individual', () => {
    const individual = new Individual([1, 2, 3, 4, 5]);
    const currentGenes = individual.genes;
    individual.mutate(1);
    expect(individual.genes).not.toEqual(currentGenes);
  });

  it('should crossover with another individual', () => {
    const individual1 = new Individual([3, 1, 4, 2, 5]);
    const individual2 = new Individual([5, 4, 3, 2, 1]);

    const [newIndividual1, newIndividual2] = individual1.crossover(individual2);

    expect(newIndividual1.genes).not.toEqual(individual1.genes);
    expect(newIndividual2.genes).not.toEqual(individual2.genes);
  });
});
