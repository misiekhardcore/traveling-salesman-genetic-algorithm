import { shuffleArray } from '@/utils';
import { MutationStrategy } from '../MutationStrategy';

export class ShuffleMutationStrategy extends MutationStrategy {
  static readonly label = 'Shuffle Mutation';
  readonly label = ShuffleMutationStrategy.label;

  mutate(genes: number[]): number[] {
    if (Math.random() < this.mutationRate && genes.length > 1) {
      return shuffleArray([...genes]);
    }
    return [...genes];
  }
}
