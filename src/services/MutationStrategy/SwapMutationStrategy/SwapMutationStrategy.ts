import { MutationStrategy } from '../MutationStrategy';

export class SwapMutationStrategy extends MutationStrategy {
  static readonly label = 'Swap Mutation';
  readonly label = SwapMutationStrategy.label;

  mutate(genes: number[]): number[] {
    const result = [...genes];
    if (Math.random() < this.mutationRate && genes.length > 1) {
      const i = Math.floor(Math.random() * genes.length);
      const j = Math.floor(Math.random() * genes.length);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
