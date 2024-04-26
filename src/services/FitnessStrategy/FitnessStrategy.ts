import { Individual } from '@/entities';

export interface FitnessStrategy {
  getIndividualFitness(individual: Individual): number;
  getFitnessSum(individuals: Individual[]): number;
}
