import { Individual, Point } from '@/entities';

import { FitnessStrategy } from '../FitnessStrategy';

export class ManhattanDistanceFitnessStrategy extends FitnessStrategy {
  static readonly label = 'Manhattan Distance Fitness';
  readonly label = ManhattanDistanceFitnessStrategy.label;

  getIndividualFitness(individual: Individual): number {
    return 1 / this.#getPathLength(individual.genes);
  }

  #getPathLength(path: number[]): number {
    const distance = path.reduce((distance, pointIndex, i) => {
      const nextPointIndex = path[(i + 1) % path.length];

      return (
        distance + this.#getManhattanDistance(this.points[pointIndex], this.points[nextPointIndex])
      );
    }, 0);

    if (distance === 0) {
      return 1;
    }

    return distance;
  }

  #getManhattanDistance(point1: Point, point2: Point): number {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
  }

  getFitnessSum(individuals: Individual[]): number {
    return individuals.reduce((sum, individual) => sum + this.getIndividualFitness(individual), 0);
  }
}
