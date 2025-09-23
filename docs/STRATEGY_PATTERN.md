# Strategy Pattern Implementation

This document explains how to use the newly implemented strategy pattern for fitness, mutation, and crossover operations in the Traveling Salesman Genetic Algorithm.

## Overview

The genetic algorithm now supports the strategy pattern for three key operations:

1. **FitnessStrategy** - How to evaluate individual fitness (already existed)
2. **MutationStrategy** - How to mutate individual genes
3. **CrossoverStrategy** - How to perform crossover between two parents

## Usage Examples

### Using Available Strategies

```typescript
import {
  ShortestPathFitnessStrategy,
  ShuffleMutationStrategy,
  SwapMutationStrategy,
  OrderCrossoverStrategy,
  SinglePointCrossoverStrategy,
} from '@/services';
import { Population, Point, IndividualImpl } from '@/entities';

const points = [new Point(0, 0), new Point(1, 1), new Point(2, 0), new Point(1, -1)];

const fitnessStrategy = new ShortestPathFitnessStrategy(points);
const mutationStrategy = new ShuffleMutationStrategy();
const crossoverStrategy = new OrderCrossoverStrategy();

// Create population with all strategies
const population = Population.getRandomPopulation(
  IndividualImpl,
  10, // population size
  points,
  fitnessStrategy,
  mutationStrategy,
  crossoverStrategy
);
```

### Switching Between Available Strategies

```typescript
// Switch to swap mutation
population.setMutationStrategy(new SwapMutationStrategy());

// Switch to single point crossover
population.setCrossoverStrategy(new SinglePointCrossoverStrategy());

// Set mutation rate (applies to all mutation strategies)
population.setMutationRate(0.05);
```

### Creating Custom Strategies

#### Custom Mutation Strategy

```typescript
import { MutationStrategy } from '@/services';

class CustomMutationStrategy extends MutationStrategy {
  static readonly label = 'Custom Mutation';
  readonly label = CustomMutationStrategy.label;

  mutate(genes: number[]): number[] {
    const result = [...genes];
    if (Math.random() < this.mutationRate && genes.length > 1) {
      // Custom mutation logic here
      const i = Math.floor(Math.random() * genes.length);
      const j = Math.floor(Math.random() * genes.length);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
```

#### Custom Crossover Strategy

```typescript
import { CrossoverStrategy } from '@/services';

class CustomCrossoverStrategy extends CrossoverStrategy {
  static readonly label = 'Custom Crossover';
  readonly label = CustomCrossoverStrategy.label;

  crossover(parent1: number[], parent2: number[]): [number[], number[]] {
    // Custom crossover logic here
    const point = Math.floor(Math.random() * parent1.length);
    const child1 = this.createChild(parent1, parent2, point);
    const child2 = this.createChild(parent2, parent1, point);
    return [child1, child2];
  }

  private createChild(parent1: number[], parent2: number[], crossoverPoint: number): number[] {
    const firstPart = parent1.slice(0, crossoverPoint);
    const remaining = parent2.filter((gene) => !firstPart.includes(gene));
    return [...firstPart, ...remaining];
  }
}
```

#### Custom Fitness Strategy

```typescript
import { FitnessStrategy } from '@/services';
import { Individual, Point } from '@/entities';

class CustomFitnessStrategy implements FitnessStrategy {
  name = 'Custom Fitness';
  points: Point[] = [];

  constructor(points: Point[]) {
    this.points = points;
  }

  setPoints(points: Point[]): void {
    this.points = points;
  }

  getIndividualFitness(individual: Individual): number {
    // Custom fitness calculation
    return individual.genes.reduce((sum, gene) => sum + gene, 0);
  }

  getFitnessSum(individuals: Individual[]): number {
    return individuals.reduce((sum, individual) => sum + this.getIndividualFitness(individual), 0);
  }
}
```
