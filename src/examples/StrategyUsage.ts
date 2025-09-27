import {
  FitnessStrategy,
  ShortestPathFitnessStrategy,
  MutationStrategy,
  ShuffleMutationStrategy,
  CrossoverStrategy,
  OrderCrossoverStrategy,
} from '@/services';
import { Population, Point, IndividualImpl, Individual } from '@/entities';

/**
 * Example demonstrating how to use the strategy pattern
 * to customize genetic algorithm behavior
 */
export function demonstrateStrategies() {
  // Create some points for the traveling salesman problem
  const points = [new Point(0, 0), new Point(1, 1), new Point(2, 0), new Point(1, -1)];

  // Create strategy instances
  const fitnessStrategy: FitnessStrategy = new ShortestPathFitnessStrategy(points);
  const mutationStrategy: MutationStrategy = new ShuffleMutationStrategy();
  const crossoverStrategy: CrossoverStrategy = new OrderCrossoverStrategy();

  // Method 1: Create population with strategies
  const populationWithStrategies = Population.getRandomPopulation(
    IndividualImpl,
    10, // population size
    points,
    fitnessStrategy,
    mutationStrategy,
    crossoverStrategy
  );

  console.log('Population with strategies created');
  console.log('Best individual:', populationWithStrategies.getBestIndividual().genes);

  // Method 2: Create population without strategies (backward compatible)
  const traditionalPopulation = Population.getRandomPopulation(
    IndividualImpl,
    10,
    points,
    fitnessStrategy,
    mutationStrategy,
    crossoverStrategy
  );

  console.log('Traditional population created');
  console.log('Best individual:', traditionalPopulation.getBestIndividual().genes);

  // Method 3: Add strategies to existing population
  traditionalPopulation.setMutationStrategy(mutationStrategy);
  traditionalPopulation.setCrossoverStrategy(crossoverStrategy);

  console.log('Strategies added to traditional population');

  // Evolve populations
  const newGeneration1 = populationWithStrategies.evolve();
  const newGeneration2 = traditionalPopulation.evolve();

  console.log('Evolution completed');
  console.log('New generation 1 best:', newGeneration1.getBestIndividual().genes);
  console.log('New generation 2 best:', newGeneration2.getBestIndividual().genes);

  return {
    populationWithStrategies: newGeneration1,
    traditionalPopulation: newGeneration2,
  };
}

// Custom fitness strategy example
export class ManhattanDistanceFitnessStrategy extends FitnessStrategy {
  static readonly label = 'Manhattan Distance Fitness';
  readonly label = ManhattanDistanceFitnessStrategy.label;

  setPoints(points: Point[]): void {
    this.points = points;
  }

  getIndividualFitness(individual: Individual): number {
    return 1 / this.getPathLength(individual.genes);
  }

  getFitnessSum(individuals: Individual[]): number {
    return individuals.reduce((sum, individual) => sum + this.getIndividualFitness(individual), 0);
  }

  private getPathLength(path: number[]): number {
    return path.reduce((distance, pointIndex, i) => {
      const nextPointIndex = path[(i + 1) % path.length];

      return distance + this.#getDistanceTo(this.points[pointIndex], this.points[nextPointIndex]);
    }, 0);
  }

  #getDistanceTo(point1: Point, point2: Point): number {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
  }
}

// Custom mutation strategy example
export class SwapMutationStrategy extends MutationStrategy {
  name = 'Swap Mutation';

  mutate(genes: number[]): number[] {
    const result = [...genes];
    if (Math.random() < this.mutationRate && genes.length > 1) {
      const i = Math.floor(Math.random() * genes.length);
      const j = Math.floor(Math.random() * genes.length);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

// Custom crossover strategy example
export class SinglePointCrossoverStrategy extends CrossoverStrategy {
  name = 'Single Point Crossover';

  crossover(parent1: number[], parent2: number[]): [number[], number[]] {
    const point = Math.floor(Math.random() * parent1.length);
    const child1 = [...parent1.slice(0, point), ...parent2.slice(point)];
    const child2 = [...parent2.slice(0, point), ...parent1.slice(point)];
    return [child1, child2];
  }
}

/**
 * Example showing how to use custom strategies
 */
export function demonstrateCustomStrategies() {
  const points = [new Point(0, 0), new Point(1, 1), new Point(2, 0)];

  // Use custom strategies
  const customMutation = new SwapMutationStrategy();
  const customCrossover = new SinglePointCrossoverStrategy();
  const customFitness = new ManhattanDistanceFitnessStrategy(points);

  const population = Population.getRandomPopulation(
    IndividualImpl,
    5,
    points,
    customFitness,
    customMutation,
    customCrossover
  );

  console.log('Population with custom strategies created');
  console.log('Best individual:', population.getBestIndividual().genes);

  return population.evolve();
}
