import { MutationStrategy, CrossoverStrategy } from '@/services';

type Gene = number;

export abstract class Individual {
  constructor(
    public genes: Gene[],
    protected mutationStrategy: MutationStrategy,
    protected crossoverStrategy: CrossoverStrategy
  ) {}

  setMutationStrategy(mutationStrategy: MutationStrategy): void {
    this.mutationStrategy = mutationStrategy;
  }

  setCrossoverStrategy(crossoverStrategy: CrossoverStrategy): void {
    this.crossoverStrategy = crossoverStrategy;
  }

  abstract mutate(): this;
  abstract crossover(partner: Individual): [Individual, Individual];
}

export class IndividualImpl extends Individual {
  mutate(): this {
    this.genes = this.mutationStrategy.mutate(this.genes);
    return this;
  }

  crossover(partner: Individual): [Individual, Individual] {
    const [newGenes1, newGenes2] = this.crossoverStrategy.crossover(this.genes, partner.genes);
    return [
      new IndividualImpl(newGenes1, this.mutationStrategy, this.crossoverStrategy),
      new IndividualImpl(newGenes2, this.mutationStrategy, this.crossoverStrategy),
    ];
  }
}
