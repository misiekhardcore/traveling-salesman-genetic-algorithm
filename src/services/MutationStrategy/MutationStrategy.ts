export class MutationStrategy {
  static readonly label: string = 'Mutation Strategy';
  readonly label: string = MutationStrategy.label;

  constructor(protected mutationRate: number = 0.1) {}

  setMutationRate(mutationRate: number): void {
    this.mutationRate = mutationRate;
  }

  mutate(_genes: number[]): number[] {
    throw new Error('Not implemented');
  }
}
