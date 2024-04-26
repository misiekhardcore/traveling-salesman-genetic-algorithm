import { Individual, Point } from '@/entities';

import { FitnessStrategy } from '../FitnessStrategy';

export class ShortestPathFitnessStrategy implements FitnessStrategy {
  constructor(private points: Point[]) {}

  getIndividualFitness(individual: Individual): number {
    return 1 / this.getPathLength(individual.genes);
  }

  private getPathLength(path: number[]): number {
    const distance = path.reduce((distance, pointIndex, i) => {
      const nextPointIndex = path[(i + 1) % path.length];

      return distance + this.points[pointIndex].getDistanceTo(this.points[nextPointIndex]);
    }, 0);

    return distance;
  }

  getFitnessSum(individuals: Individual[]): number {
    return individuals.reduce((sum, individual) => sum + this.getIndividualFitness(individual), 0);
  }

  setPoints(points: Point[]) {
    this.points = points;
  }
}
