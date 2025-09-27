import { Individual, Point } from '@/entities';

export class FitnessStrategy {
  static readonly label: string = 'Fitness Strategy';
  readonly label: string = FitnessStrategy.label;

  constructor(protected points: Point[]) {}

  setPoints(points: Point[]): void {
    this.points = points;
  }

  getIndividualFitness(_individual: Individual): number {
    throw new Error('Not implemented');
  }

  getFitnessSum(_individuals: Individual[]): number {
    throw new Error('Not implemented');
  }
}
