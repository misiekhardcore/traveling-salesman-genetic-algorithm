import { Individual, Point } from '@/entities';

import { FitnessStrategy } from '../FitnessStrategy';

/**
 * Manhattan (grid) distance for a pair of points.
 */
const manhattanDistance = (from: Point, to: Point): number =>
  Math.abs(from.x - to.x) + Math.abs(from.y - to.y);

/**
 * Precomputes the distance between every ordered pair of points as one flat
 * points.length squared table, so scoring a tour is a run of table reads rather
 * than a subtraction and an absolute value per step.
 */
function buildDistanceMatrix(
  points: Point[],
  distance: (from: Point, to: Point) => number
): Float64Array {
  const size = points.length;
  const matrix = new Float64Array(size * size);

  for (let from = 0; from < size; from += 1) {
    for (let to = 0; to < size; to += 1) {
      matrix[from * size + to] = distance(points[from], points[to]);
    }
  }

  return matrix;
}

export class ManhattanDistanceFitnessStrategy extends FitnessStrategy {
  static readonly label = 'Manhattan Distance Fitness';
  readonly label = ManhattanDistanceFitnessStrategy.label;

  #distances: Float64Array;

  constructor(points: Point[]) {
    super(points);
    this.#distances = buildDistanceMatrix(points, manhattanDistance);
  }

  setPoints(points: Point[]): void {
    super.setPoints(points);
    this.#distances = buildDistanceMatrix(points, manhattanDistance);
  }

  evaluate(individual: Individual): number {
    return 1 / this.#getPathLength(individual.genes);
  }

  #getPathLength(path: number[]): number {
    const size = this.points.length;
    const distances = this.#distances;
    let distance = 0;

    for (let step = 0; step < path.length; step += 1) {
      const from = path[step];

      // A genome is a permutation of point indexes; anything else would read the
      // wrong table cell and corrupt the fitness silently.
      if (!Number.isInteger(from) || from < 0 || from >= size) {
        throw new Error(`Point index ${String(from)} is not one of the ${size} points on this map`);
      }

      const to = path[(step + 1) % path.length];
      distance += distances[from * size + to];
    }

    // All points coincide, so there is no tour to score and a distance of zero
    // would divide by zero below.
    if (distance === 0) {
      return 1;
    }

    return distance;
  }
}
