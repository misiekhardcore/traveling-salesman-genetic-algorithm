import { CrossoverStrategy } from '../CrossoverStrategy';

export class SinglePointCrossoverStrategy extends CrossoverStrategy {
  static readonly label = 'Single Point Crossover';
  readonly label = SinglePointCrossoverStrategy.label;

  crossover(parent1: number[], parent2: number[]): [number[], number[]] {
    const point = Math.floor(Math.random() * parent1.length);

    const child1 = this.createChild(parent1, parent2, point);
    const child2 = this.createChild(parent2, parent1, point);

    return [child1, child2];
  }

  private createChild(parent1: number[], parent2: number[], crossoverPoint: number): number[] {
    // Take the first part from parent1
    const firstPart = parent1.slice(0, crossoverPoint);

    // Fill the remaining positions with unique elements from parent2
    const remaining = parent2.filter((gene) => !firstPart.includes(gene));

    return [...firstPart, ...remaining];
  }
}
