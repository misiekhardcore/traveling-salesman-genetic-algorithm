import { SwapMutationStrategy } from './SwapMutationStrategy';

describe('SwapMutationStrategy', () => {
  const strategy = new SwapMutationStrategy();

  it('should mutate genes when mutation rate is 1', () => {
    strategy.setMutationRate(1);
    const originalGenes = [1, 2, 3, 4, 5];
    const mutatedGenes = strategy.mutate(originalGenes);

    expect(mutatedGenes).not.toEqual(originalGenes);
    expect(mutatedGenes).toHaveLength(originalGenes.length);
  });

  it('should not mutate genes when mutation rate is 0', () => {
    strategy.setMutationRate(0);
    const originalGenes = [1, 2, 3, 4, 5];
    strategy.setMutationRate(0);
    const mutatedGenes = strategy.mutate(originalGenes);

    expect(mutatedGenes).toEqual(originalGenes);
    expect(mutatedGenes).not.toBe(originalGenes);
  });

  it('should return a copy of genes even when not mutating', () => {
    strategy.setMutationRate(0);
    const originalGenes = [1, 2, 3, 4, 5];
    const mutatedGenes = strategy.mutate(originalGenes);

    expect(mutatedGenes).toEqual(originalGenes);
    expect(mutatedGenes).not.toBe(originalGenes);
  });
});
