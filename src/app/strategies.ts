import {
  CrossoverStrategy,
  FitnessStrategy,
  ManhattanDistanceFitnessStrategy,
  MutationStrategy,
  OrderCrossoverStrategy,
  ShortestPathFitnessStrategy,
  ShuffleMutationStrategy,
  SinglePointCrossoverStrategy,
  SwapMutationStrategy,
} from '@/services';

/**
 * The selectable strategies, keyed by their static label. The label is both the
 * option value in the UI and the lookup key here, so a strategy is registered in
 * exactly one place.
 */
const fitnessStrategies: Record<string, typeof FitnessStrategy> = {
  [ShortestPathFitnessStrategy.label]: ShortestPathFitnessStrategy,
  [ManhattanDistanceFitnessStrategy.label]: ManhattanDistanceFitnessStrategy,
};

const mutationStrategies: Record<string, typeof MutationStrategy> = {
  [ShuffleMutationStrategy.label]: ShuffleMutationStrategy,
  [SwapMutationStrategy.label]: SwapMutationStrategy,
};

const crossoverStrategies: Record<string, typeof CrossoverStrategy> = {
  [OrderCrossoverStrategy.label]: OrderCrossoverStrategy,
  [SinglePointCrossoverStrategy.label]: SinglePointCrossoverStrategy,
};

export const fitnessStrategyNames = Object.keys(fitnessStrategies);
export const mutationStrategyNames = Object.keys(mutationStrategies);
export const crossoverStrategyNames = Object.keys(crossoverStrategies);

export { fitnessStrategies, mutationStrategies, crossoverStrategies };
