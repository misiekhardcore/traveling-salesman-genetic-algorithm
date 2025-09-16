import { Individual, Point } from '@/entities';

export interface FitnessStrategy {
  name: string;
  points: Point[];

  setPoints(points: Point[]): void;

  getIndividualFitness(individual: Individual): number;
  getFitnessSum(individuals: Individual[]): number;
}
