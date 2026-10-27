import { CrossoverStrategy } from '../CrossoverStrategy';

export class SinglePointCrossoverStrategy extends CrossoverStrategy {
  static readonly label = 'Single Point Crossover';
  readonly label = SinglePointCrossoverStrategy.label;

  crossover(parent1: number[], parent2: number[]): [number[], number[]] {
    const point = SinglePointCrossoverStrategy.pickPoint(parent1.length);

    const child1 = this.createChild(parent1, parent2, point);
    const child2 = this.createChild(parent2, parent1, point);

    return [child1, child2];
  }

  /**
   * Where to cut the parents.
   *
   * The point used to be drawn from the whole length, which included one
   * degenerate value: cutting at the very last position copies every gene from
   * the first parent and leaves exactly one for the other, so both children came
   * back identical to their parents - a crossover that recombined nothing, with a
   * one in length chance of happening on every call.
   *
   * Cutting inside also keeps a child from being a plain copy of the other
   * parent, which is what a cut at the first position produces.
   */
  private static pickPoint(length: number): number {
    if (length <= 2) {
      // Two genes or fewer have no interior cut; swapping them is the whole
      // recombination on offer.
      return 0;
    }

    return 1 + Math.floor(Math.random() * (length - 2));
  }

  private createChild(parent1: number[], parent2: number[], crossoverPoint: number): number[] {
    // Take the first part from parent1
    const firstPart = parent1.slice(0, crossoverPoint);

    // Fill the remaining positions with unique elements from parent2. A set does
    // the membership test in constant time; testing the array was O(P^2).
    const taken = new Set(firstPart);
    const remaining = parent2.filter((gene) => !taken.has(gene));

    return [...firstPart, ...remaining];
  }
}
