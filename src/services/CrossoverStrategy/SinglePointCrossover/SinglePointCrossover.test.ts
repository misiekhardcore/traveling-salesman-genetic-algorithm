import { SinglePointCrossoverStrategy } from './SinglePointCrossover';

describe('SinglePointCrossoverStrategy', () => {
  const strategy = new SinglePointCrossoverStrategy();

  it('should perform crossover between two parents', () => {
    const parent1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const parent2 = [5, 4, 3, 2, 1, 0, 9, 8, 7, 6];

    const [child1, child2] = strategy.crossover(parent1, parent2);

    expect(child1).toHaveLength(parent1.length);
    expect(child2).toHaveLength(parent2.length);

    expect(child1).not.toEqual(parent1);
    expect(child2).not.toEqual(parent2);

    expect(child1.sort()).toEqual(parent1.sort());
    expect(child2.sort()).toEqual(parent2.sort());
  });

  it('should not modify original parent arrays', () => {
    const parent1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const parent2 = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    const originalParent1 = [...parent1];
    const originalParent2 = [...parent2];

    strategy.crossover(parent1, parent2);

    expect(parent1).toEqual(originalParent1);
    expect(parent2).toEqual(originalParent2);
  });

  it('should produce valid children with all unique elements', () => {
    const parent1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const parent2 = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    const [child1, child2] = strategy.crossover(parent1, parent2);

    expect(child1).toHaveLength(parent1.length);
    expect(child2).toHaveLength(parent2.length);
    expect(new Set(child1).size).toBe(child1.length);
    expect(new Set(child2).size).toBe(child2.length);

    expect(child1).not.toEqual(parent1);
    expect(child2).not.toEqual(parent2);

    expect(child1.sort()).toEqual(parent1.sort());
    expect(child2.sort()).toEqual(parent2.sort());
  });
});
