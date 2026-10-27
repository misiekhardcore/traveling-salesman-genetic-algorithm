import { Individual, Point } from '@/entities';

export class FitnessStrategy {
  static readonly label: string = 'Fitness Strategy';
  readonly label: string = FitnessStrategy.label;

  /**
   * Memoized fitness keyed on the chromosome array rather than on the individual:
   * crossover and mutation always hand back a fresh array, so a cached entry can
   * never outlive the genes it describes.
   *
   * The formula also depends on the map, so setPoints() drops the cache.
   */
  #fitnessCache = new WeakMap<number[], number>();

  constructor(protected points: Point[]) {}

  setPoints(points: Point[]): void {
    this.points = points;
    this.#fitnessCache = new WeakMap();
  }

  /**
   * Fitness of a single individual. Repeat reads are free while the genes do not
   * change, so scoring a population costs one formula run per chromosome instead
   * of one per comparison.
   *
   * Custom strategies may still override this to bypass the memo.
   */
  getIndividualFitness(individual: Individual): number {
    const genes = individual.genes;
    const cached = this.#fitnessCache.get(genes);

    if (cached !== undefined) {
      return cached;
    }

    const fitness = this.evaluate(individual);
    this.#fitnessCache.set(genes, fitness);

    return fitness;
  }

  getFitnessSum(individuals: Individual[]): number {
    return individuals.reduce((sum, individual) => sum + this.getIndividualFitness(individual), 0);
  }

  /**
   * The fitness formula itself. Concrete strategies implement this one method and
   * inherit the memoized getIndividualFitness wrapper.
   */
  evaluate(_individual: Individual): number {
    throw new Error('Not implemented');
  }
}
