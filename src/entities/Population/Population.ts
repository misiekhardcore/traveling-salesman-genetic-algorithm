import { FitnessStrategy, MutationStrategy, CrossoverStrategy } from '@/services';
import { Individual, IndividualImpl } from '../Individual';
import { shuffleArray } from '@/utils';
import { Point } from '../Point';

export class Population {
  constructor(
    private individuals: Individual[],
    private fitnessStrategy: FitnessStrategy,
    private mutationStrategy: MutationStrategy,
    private crossoverStrategy: CrossoverStrategy
  ) {}

  getPopulationSize(): number {
    return this.individuals.length;
  }

  getIndividuals(): Individual[] {
    return this.individuals;
  }

  setIndividuals(individuals: Individual[]): void {
    this.individuals = individuals;
  }

  addIndividuals(individuals: Individual[]): void {
    this.individuals.push(...individuals);
  }

  removeIndividuals(count: number): void {
    // slice(0, -0) is slice(0, 0): asking to remove nothing must not empty the
    // population, and a negative count must not truncate it either.
    if (count <= 0) {
      return;
    }

    this.individuals = this.individuals.slice(0, Math.max(0, this.individuals.length - count));
  }

  /**
   * Fitness-proportionate (roulette wheel) selection: each individual is weighted
   * by its share of the total fitness and exactly `populationSize` parents are
   * drawn from that distribution, so every member of the population can breed and
   * the draw is independent of where an individual sits in the array.
   *
   * The previous implementation built a pool of about twice the population and
   * then kept only its first half, which discarded half the population outright
   * and made selection depend on array position rather than fitness.
   */
  getMatingPool(): Individual[] {
    const size = this.individuals.length;

    if (size === 0) {
      return [];
    }

    const fitnesses: number[] = new Array(size);
    let fitnessSum = 0;

    for (let i = 0; i < size; i += 1) {
      const fitness = this.fitnessStrategy.getIndividualFitness(this.individuals[i]);
      fitnesses[i] = fitness;
      fitnessSum += fitness;
    }

    // Nothing usable to sample from (every route scored zero, or a custom
    // strategy returned NaN): draw uniformly instead of dividing by zero.
    if (!(fitnessSum > 0) || !Number.isFinite(fitnessSum)) {
      return this.drawUniformly(size);
    }

    // Cumulative fitness shares: entry i holds the upper bound of individual i.
    const cumulative = new Float64Array(size);
    let runningTotal = 0;
    for (let i = 0; i < size; i += 1) {
      runningTotal += fitnesses[i] / fitnessSum;
      cumulative[i] = runningTotal;
    }

    const matingPool: Individual[] = new Array(size);

    for (let i = 0; i < size; i += 1) {
      const draw = Math.random();
      let low = 0;
      let high = size - 1;

      // First entry whose cumulative share reaches the draw.
      while (low < high) {
        const middle = (low + high) >> 1;
        if (cumulative[middle] < draw) {
          low = middle + 1;
        } else {
          high = middle;
        }
      }

      matingPool[i] = this.toPoolEntry(this.individuals[low]);
    }

    return matingPool;
  }

  reproduce(): Individual[] {
    const size = this.individuals.length;

    if (size === 0) {
      return [];
    }

    const matingPool = this.getMatingPool();
    const offspring: Individual[] = [];

    // Parents mate in the order they were drawn. The pool already carries the
    // fitness weighting; sorting it here would pair the two fittest parents with
    // each other on every generation and collapse the search onto a couple of
    // routes.
    for (let i = 0; i < matingPool.length && offspring.length < size; i += 2) {
      const parent1 = matingPool[i];
      const parent2 = matingPool[i + 1] ?? matingPool[0]; // odd populations reuse the first parent
      const [child1, child2] = parent1.crossover(parent2);

      offspring.push(child1.mutate());
      if (offspring.length < size) {
        offspring.push(child2.mutate());
      }
    }

    // Elitism: the fittest individual of this generation is carried into the next
    // one unchanged, so the best route the visualization draws can never move
    // backwards. A population of one has no slot to spare, so it breeds normally.
    if (size > 1 && offspring.length === size) {
      offspring[size - 1] = new IndividualImpl(
        this.getBestIndividual().genes,
        this.mutationStrategy,
        this.crossoverStrategy
      );
    }

    return offspring;
  }

  getBestIndividual(): Individual {
    if (this.individuals.length === 0) {
      throw new Error('Cannot pick the best individual from an empty population');
    }

    let bestIndividual = this.individuals[0];
    let bestFitness = this.fitnessStrategy.getIndividualFitness(bestIndividual);

    for (let i = 1; i < this.individuals.length; i += 1) {
      const individual = this.individuals[i];
      const fitness = this.fitnessStrategy.getIndividualFitness(individual);

      if (fitness > bestFitness) {
        bestIndividual = individual;
        bestFitness = fitness;
      }
    }

    return bestIndividual;
  }

  getworstIndividual(): Individual {
    if (this.individuals.length === 0) {
      throw new Error('Cannot pick the worst individual from an empty population');
    }

    let worstIndividual = this.individuals[0];
    let worstFitness = this.fitnessStrategy.getIndividualFitness(worstIndividual);

    for (let i = 1; i < this.individuals.length; i += 1) {
      const individual = this.individuals[i];
      const fitness = this.fitnessStrategy.getIndividualFitness(individual);

      if (fitness < worstFitness) {
        worstIndividual = individual;
        worstFitness = fitness;
      }
    }

    return worstIndividual;
  }

  score(): number {
    return this.individuals.reduce((score, gene) => {
      return score + this.fitnessStrategy.getIndividualFitness(gene);
    }, 0);
  }

  evolve(): Population {
    const newIndividuals = this.reproduce();

    return new Population(
      newIndividuals,
      this.fitnessStrategy,
      this.mutationStrategy,
      this.crossoverStrategy
    );
  }

  static getRandomPopulation(
    individualClass: typeof IndividualImpl,
    size: number,
    points: Point[],
    fitnessStrategy: FitnessStrategy,
    mutationStrategy: MutationStrategy,
    crossoverStrategy: CrossoverStrategy
  ): Population {
    const genes = Array.from({ length: size }, () =>
      Population.getRandomIndividual(individualClass, points, mutationStrategy, crossoverStrategy)
    );

    return new Population(genes, fitnessStrategy, mutationStrategy, crossoverStrategy);
  }

  static getRandomIndividual(
    individualClass: typeof IndividualImpl,
    points: Point[],
    mutationStrategy: MutationStrategy,
    crossoverStrategy: CrossoverStrategy
  ): Individual {
    return new individualClass(
      shuffleArray(Array.from({ length: points.length }, (_, i) => i)),
      mutationStrategy,
      crossoverStrategy
    );
  }

  setMutationRate(mutationRate: number): void {
    this.mutationStrategy.setMutationRate(mutationRate);
  }

  setFitnessStrategy(fitnessStrategy: FitnessStrategy): void {
    this.fitnessStrategy = fitnessStrategy;
  }

  setMutationStrategy(mutationStrategy: MutationStrategy): void {
    this.mutationStrategy = mutationStrategy;
  }

  setCrossoverStrategy(crossoverStrategy: CrossoverStrategy): void {
    this.crossoverStrategy = crossoverStrategy;
  }

  setPopulationSize(newSize: number, points: Point[]): void {
    if (newSize <= 0) {
      throw new Error('Population size must be greater than 0');
    }

    const currentSize = this.getPopulationSize();

    if (newSize === currentSize) {
      return; // No change needed
    }

    if (newSize < currentSize) {
      // Decrease size: remove individuals from the end
      this.setIndividuals(this.getIndividuals().slice(0, newSize));
    } else {
      // Increase size: add new random individuals
      const individualsToAdd = newSize - currentSize;
      const newIndividuals = Array.from(
        { length: individualsToAdd },
        () =>
          new IndividualImpl(
            shuffleArray(Array.from({ length: points.length }, (_, i) => i)),
            this.mutationStrategy,
            this.crossoverStrategy
          )
      );
      this.setIndividuals([...this.getIndividuals(), ...newIndividuals]);
    }
  }

  /**
   * Pool entries are defensive copies, so a caller that mutates a parent cannot
   * rewrite the population behind its back. They share the genes array on purpose:
   * crossover and mutation always allocate a new one, so no pool entry can write
   * through to the individual it came from.
   */
  private toPoolEntry(individual: Individual): Individual {
    return new IndividualImpl(individual.genes, this.mutationStrategy, this.crossoverStrategy);
  }

  /**
   * Uniform draw used when there is no fitness to weight the selection with.
   */
  private drawUniformly(size: number): Individual[] {
    const matingPool: Individual[] = new Array(size);

    for (let i = 0; i < size; i += 1) {
      matingPool[i] = this.toPoolEntry(this.individuals[Math.floor(Math.random() * size)]);
    }

    return matingPool;
  }
}
