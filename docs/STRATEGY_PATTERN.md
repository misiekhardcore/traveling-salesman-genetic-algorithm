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
      // Custom mutation logic here. Draw the second position from the remaining
      // ones: drawing it over the whole array lands on the same gene about one
      // time in n, and the swap then changes nothing.
      const i = Math.floor(Math.random() * genes.length);
      const offset = Math.floor(Math.random() * (genes.length - 1));
      const j = offset < i ? offset : offset + 1;
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
    // Custom crossover logic here. Cut inside the parents: a cut at the last
    // position leaves exactly one gene for the other parent, so both children
    // come back identical to their parents and nothing is recombined.
    const point = 1 + Math.floor(Math.random() * Math.max(1, parent1.length - 2));
    const child1 = this.createChild(parent1, parent2, point);
    const child2 = this.createChild(parent2, parent1, point);
    return [child1, child2];
  }

  private createChild(parent1: number[], parent2: number[], crossoverPoint: number): number[] {
    const firstPart = parent1.slice(0, crossoverPoint);
    // A set answers membership in constant time; testing the array is O(P^2) and
    // dominates a generation once the routes get long.
    const taken = new Set(firstPart);
    const remaining = parent2.filter((gene) => !taken.has(gene));
    return [...firstPart, ...remaining];
  }
}
```

#### Custom Fitness Strategy

Extend `FitnessStrategy` and implement `evaluate`, the method that holds the
fitness formula. The base class wraps it in a memoized `getIndividualFitness`, so
the same chromosome is only scored once until the points move (and `setPoints`
clears that memo for you).

```typescript
import { FitnessStrategy } from '@/services';
import { Individual } from '@/entities';

class CustomFitnessStrategy extends FitnessStrategy {
  static readonly label = 'Custom Fitness';
  readonly label = CustomFitnessStrategy.label;

  evaluate(individual: Individual): number {
    // Custom fitness calculation
    const score = individual.genes.reduce((sum, gene) => sum + gene, 0);
    return 1 / (score + 1);
  }
}
```

Overriding `getIndividualFitness` instead of `evaluate` still works and is the
right choice when a strategy has to ignore the memo, but then every caller pays
for a full recalculation on each read.
