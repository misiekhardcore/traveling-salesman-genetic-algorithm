import { CrossoverStrategy } from '../CrossoverStrategy';

export class OrderCrossoverStrategy extends CrossoverStrategy {
  static readonly label = 'Order Crossover';
  readonly label = OrderCrossoverStrategy.label;

  crossover(parent1: number[], parent2: number[]): [number[], number[]] {
    const sectionPoint = OrderCrossoverStrategy.pickSectionPoint(parent1.length);
    const half = Math.random() < 0.5 ? 'start' : 'end';

    const newGenes1 = this.combineGenes(parent1, parent2, sectionPoint, half);
    const newGenes2 = this.combineGenes(parent2, parent1, sectionPoint, half);

    return [
      this.recombineUnlessParent(newGenes1, parent1, parent2, sectionPoint, half),
      this.recombineUnlessParent(newGenes2, parent2, parent1, sectionPoint, half),
    ];
  }

  /**
   * Where to cut the parents.
   *
   * This used to be a fixed three-quarter point, so a given pair of parents had
   * only two possible outcomes - one per half - and the same children came back
   * generation after generation, which is what made the search converge onto a
   * handful of routes.
   *
   * At least one gene has to stay on each side of the cut, otherwise the child
   * just copies one parent through.
   */
  private static pickSectionPoint(length: number): number {
    if (length < 3) {
      // Too short to cut into three parts; a single gene still recombines.
      return Math.max(1, length - 1);
    }

    return 1 + Math.floor(Math.random() * (length - 2));
  }

  /**
   * A child identical to its parent means this cut recombined nothing, so redo it
   * the other way round - taking the preserved section from the end instead of the
   * start, or vice versa. The one case the second attempt cannot rescue is a pair
   * of identical parents, which genuinely has nothing to recombine.
   */
  private recombineUnlessParent(
    child: number[],
    genes1: number[],
    genes2: number[],
    sectionPoint: number,
    half: 'start' | 'end'
  ): number[] {
    const unchanged =
      child.length === genes1.length && child.every((gene, index) => gene === genes1[index]);

    if (!unchanged) {
      return child;
    }

    return this.combineGenes(genes1, genes2, sectionPoint, half === 'start' ? 'end' : 'start');
  }

  private combineGenes(
    genes1: number[],
    genes2: number[],
    sectionPoint: number,
    half: 'start' | 'end' = 'start'
  ): number[] {
    switch (half) {
      case 'start':
        return this.combineFromStart(genes1, genes2, sectionPoint);
      case 'end':
        return this.combineFromEnd(genes1, genes2, sectionPoint);
      default:
        throw new Error('Invalid half');
    }
  }

  private combineFromStart(genes1: number[], genes2: number[], sectionPoint: number): number[] {
    const startSection = genes1.slice(0, sectionPoint);
    // One set covers both "already in the copied section" and "already taken from
    // the other parent". Testing arrays inside a reduce made this O(P^2), which
    // measured as roughly four fifths of a whole generation at 100 cities.
    const seen = new Set(startSection);
    const tail: number[] = [];

    for (const gene of genes2) {
      if (!seen.has(gene)) {
        seen.add(gene);
        tail.push(gene);
      }
    }

    return startSection.concat(tail);
  }

  private combineFromEnd(genes1: number[], genes2: number[], sectionPoint: number): number[] {
    const endSection = genes1.slice(sectionPoint, genes1.length);
    const seen = new Set(endSection);
    const head: number[] = [];

    for (const gene of genes2) {
      if (!seen.has(gene)) {
        seen.add(gene);
        head.push(gene);
      }
    }

    return head.concat(endSection);
  }
}
