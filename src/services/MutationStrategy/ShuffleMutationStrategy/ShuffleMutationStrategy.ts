import { shuffleArray } from '@/utils';
import { MutationStrategy } from '../MutationStrategy';

export class ShuffleMutationStrategy extends MutationStrategy {
  static readonly label = 'Shuffle Mutation';
  readonly label = ShuffleMutationStrategy.label;

  mutate(genes: number[]): number[] {
    if (Math.random() < this.mutationRate && genes.length > 1) {
      let shuffled = shuffleArray([...genes]);

      // A shuffle can land back on the order it started from (one chance in n!),
      // which would make a mutation that was asked for change nothing. Reshuffle
      // until the route actually moves; for any real genome that is one retry.
      while (shuffled.every((gene, index) => gene === genes[index])) {
        shuffled = shuffleArray([...genes]);
      }

      return shuffled;
    }

    return [...genes];
  }
}
