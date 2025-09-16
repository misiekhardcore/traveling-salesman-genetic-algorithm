export class CrossoverStrategy {
  static readonly label: string = 'Crossover Strategy';
  readonly label: string = CrossoverStrategy.label;

  crossover(_parent1: number[], _parent2: number[]): [number[], number[]] {
    throw new Error('Not implemented');
  }
}
