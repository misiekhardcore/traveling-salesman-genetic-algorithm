# API Reference

This document provides a comprehensive reference for the core classes and interfaces in the Traveling Salesman Genetic Algorithm project.

## Core Entities

### Point

Represents a city or location in the traveling salesman problem.

```typescript
class Point {
  constructor(x: number, y: number);

  static getRandomPoints(count: number, maxX: number, maxY: number): Point[];
  static getDistance(point1: Point, point2: Point): number;
}
```

**Properties:**

- `x: number` - X coordinate
- `y: number` - Y coordinate

**Methods:**

- `getRandomPoints()` - Generates random points for testing
- `getDistance()` - Calculates Euclidean distance between two points

### Individual

Represents a single solution (chromosome) in the genetic algorithm.

```typescript
interface Individual {
  genes: number[];
  fitness: number;

  crossover(other: Individual): [Individual, Individual];
  mutate(): Individual;
  getFitness(): number;
}
```

**Properties:**

- `genes: number[]` - Array representing the order of cities to visit
- `fitness: number` - Fitness score (cached for performance)

**Methods:**

- `crossover()` - Creates offspring with another individual
- `mutate()` - Creates a mutated copy
- `getFitness()` - Calculates and returns fitness score

### Population

Manages a collection of individuals and handles evolution.

```typescript
class Population {
  static getRandomPopulation(
    individualClass: typeof Individual,
    size: number,
    points: Point[],
    fitnessStrategy: FitnessStrategy,
    mutationStrategy?: MutationStrategy,
    crossoverStrategy?: CrossoverStrategy
  ): Population;

  evolve(): Population;
  getBestIndividual(): Individual;
  getWorstIndividual(): Individual;
  setMutationRate(rate: number): void;
}
```

## Strategy Interfaces

### FitnessStrategy

Defines how fitness is calculated for individuals.

```typescript
interface FitnessStrategy {
  getIndividualFitness(individual: Individual): number;
  getFitnessSum(individuals: Individual[]): number;
}
```

### MutationStrategy

Defines how genes are mutated during evolution.

```typescript
interface MutationStrategy {
  mutate(genes: number[], mutationRate: number): number[];
  label: string;
}
```

### CrossoverStrategy

Defines how genes are combined during reproduction.

```typescript
interface CrossoverStrategy {
  crossover(parent1: number[], parent2: number[]): [number[], number[]];
  label: string;
}
```

## Available Implementations

### Fitness Strategies

#### ShortestPathFitnessStrategy

Calculates fitness based on the inverse of total path distance.

```typescript
new ShortestPathFitnessStrategy(points: Point[])
```

### Mutation Strategies

#### ShuffleMutationStrategy

Randomly shuffles a subset of genes.

```typescript
new ShuffleMutationStrategy();
```

#### SwapMutationStrategy

Swaps two random genes.

```typescript
new SwapMutationStrategy();
```

### Crossover Strategies

#### OrderCrossoverStrategy

Preserves the relative order of genes from parents.

```typescript
new OrderCrossoverStrategy();
```

#### SinglePointCrossoverStrategy

Combines genes at a single crossover point.

```typescript
new SinglePointCrossoverStrategy();
```

## Usage Examples

### Basic Usage

```typescript
import { Population, Point, IndividualImpl } from '@/entities';
import { ShortestPathFitnessStrategy } from '@/services';

// Create cities
const points = Point.getRandomPoints(10, 800, 600);

// Create fitness strategy
const fitnessStrategy = new ShortestPathFitnessStrategy(points);

// Create population
const population = Population.getRandomPopulation(IndividualImpl, 100, points, fitnessStrategy);

// Evolve
const nextGeneration = population.evolve();
```

### With Custom Strategies

```typescript
import { ShuffleMutationStrategy, OrderCrossoverStrategy } from '@/services';

const mutationStrategy = new ShuffleMutationStrategy();
const crossoverStrategy = new OrderCrossoverStrategy();

const population = Population.getRandomPopulation(
  IndividualImpl,
  100,
  points,
  fitnessStrategy,
  mutationStrategy,
  crossoverStrategy
);
```

## Performance Considerations

- **Population Size**: Larger populations explore more solutions but require more computation
- **Mutation Rate**: Higher rates increase exploration but may disrupt good solutions
- **Fitness Caching**: Individual fitness is cached to avoid recalculation
- **Strategy Selection**: Different strategies have varying computational complexity

## Error Handling

All methods validate their inputs and throw descriptive errors:

- `Invalid population size` - Population size must be positive
- `Invalid mutation rate` - Rate must be between 0 and 1
- `Insufficient points` - Need at least 2 points for TSP
- `Strategy not provided` - Required strategies must be specified
