import {
  CrossoverStrategy,
  FitnessStrategy,
  MutationStrategy,
  OrderCrossoverStrategy,
  ShortestPathFitnessStrategy,
  ShuffleMutationStrategy,
} from '@/services';
import { IndividualImpl } from '../Individual';
import { Population } from './Population';
import { Point } from '../Point';

const points = [
  new Point(0, 0),
  new Point(0, 1),
  new Point(1, 0),
  new Point(1, 1),
  new Point(1, 2),
];

describe('Population', () => {
  let mutationStrategy: MutationStrategy;
  let crossoverStrategy: CrossoverStrategy;
  let fitnessStrategy: FitnessStrategy;

  beforeAll(() => {
    mutationStrategy = new ShuffleMutationStrategy();
    crossoverStrategy = new OrderCrossoverStrategy();
    fitnessStrategy = new ShortestPathFitnessStrategy(points);
  });

  let individuals: IndividualImpl[];
  beforeEach(() => {
    individuals = [
      new IndividualImpl([0, 1, 2, 3, 4], mutationStrategy, crossoverStrategy),
      new IndividualImpl([3, 0, 4, 2, 1], mutationStrategy, crossoverStrategy),
    ];
  });

  it('should get the mating pool', () => {
    const population = new Population(
      individuals,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
    const matingPool = population.getMatingPool();

    expect(matingPool.length).toBe(individuals.length);
  });

  it('should reproduce', () => {
    const population = new Population(
      individuals,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
    const offspring = population.reproduce();

    expect(offspring.length).toBe(individuals.length);
  });

  it('should get the best individual', () => {
    const population = new Population(
      individuals,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
    const bestIndividual = population.getBestIndividual();

    expect(bestIndividual).toBe(individuals[0]);
  });

  it('should get the worst individual', () => {
    const population = new Population(
      individuals,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
    const worstIndividual = population.getworstIndividual();

    expect(worstIndividual).toBe(individuals[1]);
  });

  it('should score', () => {
    const population = new Population(
      individuals,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
    const score = population.score();

    expect(score).toBe(0.2743698969883089);
  });

  it('should evolve', () => {
    const population = new Population(
      individuals,
      fitnessStrategy,
      mutationStrategy,
      crossoverStrategy
    );
    const newPopulation = population.evolve();

    expect(newPopulation).toBeInstanceOf(Population);
  });

  describe('getRandomPopulation', () => {
    it('should get a random population', () => {
      const points = [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(1, 1)];
      const population = Population.getRandomPopulation(
        IndividualImpl,
        5,
        points,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );

      expect(population.getPopulationSize()).toBe(5);
      expect(population.getIndividuals()[0].genes.length).toBe(4);
    });
  });

  describe('addIndividuals', () => {
    it('should add individuals', () => {
      const population = new Population(
        individuals,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );
      const newIndividuals = [
        new IndividualImpl([5, 6, 7, 8, 9], mutationStrategy, crossoverStrategy),
      ];
      population.addIndividuals(newIndividuals);
      expect(population.getIndividuals().length).toBe(3);
    });
  });

  describe('removeIndividuals', () => {
    it('should remove individuals', () => {
      const population = new Population(
        individuals,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );
      population.removeIndividuals(1);
      expect(population.getIndividuals().length).toBe(1);
    });
  });

  describe('setIndividuals', () => {
    it('should set individuals', () => {
      const population = new Population(
        individuals,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );
      const newIndividuals = [
        new IndividualImpl([5, 6, 7, 8, 9], mutationStrategy, crossoverStrategy),
      ];
      population.setIndividuals(newIndividuals);
      expect(population.getIndividuals().length).toBe(1);
    });
  });

  describe('selection', () => {
    it('should sample from the whole population instead of only the leading half', () => {
      const size = 20;
      // Identical routes score identically, so a fitness-proportionate draw is
      // uniform and every index is equally likely to be picked.
      const equalIndividuals = Array.from(
        { length: size },
        () => new IndividualImpl([0, 1, 2, 3, 4], mutationStrategy, crossoverStrategy)
      );
      const population = new Population(
        equalIndividuals,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );

      // Pin the draw near the top of the distribution: uniform selection always
      // lands on the last individual, whereas selection by array position cannot.
      const random = jest.spyOn(Math, 'random').mockReturnValue(0.999);
      const matingPool = population.getMatingPool();
      random.mockRestore();

      expect(matingPool).toHaveLength(size);
      expect(matingPool.every((entry) => entry.genes === equalIndividuals[size - 1].genes)).toBe(
        true
      );
    });

    it('should weight each individual by its share of the total fitness', () => {
      const population = new Population(
        individuals,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );
      const firstShare =
        fitnessStrategy.getIndividualFitness(individuals[0]) /
        fitnessStrategy.getFitnessSum(individuals);

      // The boundary of the first individual's share is exactly its fitness share:
      // a draw inside it selects the first individual, a draw just past it the
      // second. Selection by array position instead of by share breaks this.
      const random = jest.spyOn(Math, 'random');
      random.mockReturnValueOnce(firstShare / 2).mockReturnValueOnce((firstShare + 1) / 2);
      const matingPool = population.getMatingPool();
      random.mockRestore();

      expect(matingPool[0].genes).toBe(individuals[0].genes);
      expect(matingPool[1].genes).toBe(individuals[1].genes);
    });

    it('should carry the best individual forward so the best route never worsens', () => {
      const population = Population.getRandomPopulation(
        IndividualImpl,
        30,
        points,
        fitnessStrategy,
        new ShuffleMutationStrategy(1),
        crossoverStrategy
      );

      let bestFitness = fitnessStrategy.getIndividualFitness(population.getBestIndividual());
      let current = population;

      for (let generation = 0; generation < 25; generation += 1) {
        const next = current.evolve();
        const nextBestFitness = fitnessStrategy.getIndividualFitness(next.getBestIndividual());

        expect(nextBestFitness).toBeGreaterThanOrEqual(bestFitness);
        expect(next.getPopulationSize()).toBe(current.getPopulationSize());

        current = next;
        bestFitness = nextBestFitness;
      }
    });

    it('should throw a descriptive error when there is no individual to pick', () => {
      const population = new Population([], fitnessStrategy, mutationStrategy, crossoverStrategy);

      expect(() => population.getBestIndividual()).toThrow(
        'Cannot pick the best individual from an empty population'
      );
      expect(() => population.getworstIndividual()).toThrow(
        'Cannot pick the worst individual from an empty population'
      );
    });
  });

  describe('removeIndividuals edge cases', () => {
    it('should keep every individual when asked to remove none', () => {
      const population = new Population(
        individuals,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );

      population.removeIndividuals(0);
      expect(population.getIndividuals()).toHaveLength(2);
    });

    it('should keep every individual when asked to remove a negative number', () => {
      const population = new Population(
        individuals,
        fitnessStrategy,
        mutationStrategy,
        crossoverStrategy
      );

      population.removeIndividuals(-2);
      expect(population.getIndividuals()).toHaveLength(2);
    });
  });
});
