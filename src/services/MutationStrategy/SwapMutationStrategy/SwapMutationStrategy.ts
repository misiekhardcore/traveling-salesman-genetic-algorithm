import { MutationStrategy } from '../MutationStrategy';

export class SwapMutationStrategy extends MutationStrategy {
  static readonly label = 'Swap Mutation';
  readonly label = SwapMutationStrategy.label;

  mutate(genes: number[]): number[] {
    const result = [...genes];
    if (Math.random() < this.mutationRate && genes.length > 1) {
      const i = Math.floor(Math.random() * genes.length);
      // Draw the second position from the remaining ones. Drawing it over the
      // whole array landed on the same index about one time in n, so a mutation
      // that had been asked for could swap a gene with itself and change nothing.
      const offset = Math.floor(Math.random() * (genes.length - 1));
      const j = offset < i ? offset : offset + 1;
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
