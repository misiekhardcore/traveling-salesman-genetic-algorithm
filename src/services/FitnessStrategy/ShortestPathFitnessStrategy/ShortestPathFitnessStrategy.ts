import { Individual, Point } from '@/entities';

import { FitnessStrategy } from '../FitnessStrategy';

/**
 * Euclidean distance for a pair of points. Kept bit-for-bit identical to the
 * original inline formula so existing fitness expectations do not move.
 */
const euclideanDistance = (from: Point, to: Point): number =>
  Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));

/**
 * Precomputes the distance between every ordered pair of points as one flat
 * points.length squared table. Building it costs O(P^2) once per map and turns a
 * path length into a run of table reads instead of P square roots, and a path
 * length is evaluated once per individual per generation.
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

export class ShortestPathFitnessStrategy extends FitnessStrategy {
  static readonly label = 'Shortest Path Fitness';
  readonly label = ShortestPathFitnessStrategy.label;

  #distances: Float64Array;

  constructor(points: Point[]) {
    super(points);
    this.#distances = buildDistanceMatrix(points, euclideanDistance);
  }

  setPoints(points: Point[]): void {
    super.setPoints(points);
    this.#distances = buildDistanceMatrix(points, euclideanDistance);
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

      // A genome is a permutation of point indexes. Anything else would read the
      // wrong table cell and hand selection a silently corrupt fitness, so fail
      // loudly instead of returning a plausible-looking number.
      if (!Number.isInteger(from) || from < 0 || from >= size) {
        throw new Error(`Point index ${String(from)} is not one of the ${size} points on this map`);
      }

      const to = path[(step + 1) % path.length];
      distance += distances[from * size + to];
    }

    // All points coincide: there is no tour to score, and a distance of zero
    // would divide by zero below.
    if (distance === 0) {
      return 1;
    }

    return distance;
  }
}
