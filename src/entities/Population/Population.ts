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
    this.individuals = this.individuals.slice(0, -count);
  }

  getMatingPool(): Individual[] {
    const matingPool: Individual[] = [];
    const fitnessSum = this.fitnessStrategy.getFitnessSum(this.individuals);

    this.individuals.forEach((individual) => {
      const fitness = this.fitnessStrategy.getIndividualFitness(individual);
      const fitnessRatio = fitness / fitnessSum;
      const numberOfCopies = Math.round(fitnessRatio * this.individuals.length + 1);

      for (let i = 0; i < numberOfCopies; i++) {
        matingPool.push(
          new IndividualImpl(individual.genes, this.mutationStrategy, this.crossoverStrategy)
        );
      }
    });

    return matingPool.splice(0, this.individuals.length);
  }

  reproduce(): Individual[] {
    const matingPool = this.getMatingPool().sort(
      (a, b) =>
        this.fitnessStrategy.getIndividualFitness(b) - this.fitnessStrategy.getIndividualFitness(a)
    );

    const offspring: Individual[] = [];
    for (let i = 0; i < matingPool.length; i += 2) {
      const parent1 = matingPool[i];
      const parent2 = matingPool[i + 1] || matingPool[0]; // Use first parent if no second parent available
      const [child1, child2] = parent1.crossover(parent2);

      offspring.push(child1.mutate());
      if (offspring.length < this.individuals.length) {
        offspring.push(child2.mutate());
      }
    }

    return offspring.slice(0, this.individuals.length); // Ensure we return exactly the same number of individuals
  }

  getBestIndividual(): Individual {
    return this.individuals.reduce((bestIndividual, individual) => {
      return this.fitnessStrategy.getIndividualFitness(individual) >
        this.fitnessStrategy.getIndividualFitness(bestIndividual)
        ? individual
        : bestIndividual;
    });
  }

  getworstIndividual(): Individual {
    return this.individuals.reduce((worstIndividual, individual) => {
      return this.fitnessStrategy.getIndividualFitness(individual) <
        this.fitnessStrategy.getIndividualFitness(worstIndividual)
        ? individual
        : worstIndividual;
    });
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
}
