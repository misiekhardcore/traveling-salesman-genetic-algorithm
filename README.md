# Traveling Salesman Genetic Algorithm

[![CI](https://github.com/misiekhardcore/traveling-salesman-genetic-algorithm/workflows/CI/badge.svg)](https://github.com/misiekhardcore/traveling-salesman-genetic-algorithm/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![pnpm Version](https://img.shields.io/badge/pnpm-%3E%3D4-blue.svg)](https://pnpmpkg.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)]
[![Code of Conduct](https://img.shields.io/badge/Code%20of%20Conduct-Contributor%20Covenant-blue.svg)](CODE_OF_CONDUCT.md)
[![Security](https://img.shields.io/badge/Security-Policy-blue.svg)](SECURITY.md)

An interactive web application that visualizes the Traveling Salesman Problem (TSP) solved using genetic algorithms. Watch in real-time as the algorithm evolves to find the shortest path connecting all cities.

![Application Screenshot](https://github.com/user-attachments/assets/dd046923-5e94-4433-a972-64b27f0d921b)

## Features

- **Genetic Algorithm Visualization**: Watch the evolution process in real-time
- **Multiple Strategies**: Switch between different mutation, crossover, and fitness strategies
- **Interactive Controls**: Adjust mutation rates, point counts, population size, and algorithm parameters
- **Visual Feedback**: See both the best (white) and worst (red) solutions simultaneously
- **Strategy Pattern Implementation**: Modular and extensible algorithm components
- **Real-time Canvas Rendering**: Smooth visualization using HTML5 Canvas

## Demo

Visit the live demo at: [https://traveling-salesman-genetic-algorithm.vercel.app](https://traveling-salesman-genetic-algorithm.vercel.app)

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Algorithm Details](#algorithm-details)
- [Available Strategies](#available-strategies)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Community Guidelines

We are committed to creating an inclusive and respectful community. All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md) and respect the [Security Policy](SECURITY.md).

## Installation

### Prerequisites

- Node.js 18 or higher
- pnpm 4+ package manager
- Git

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/misiekhardcore/traveling-salesman-genetic-algorithm.git
   cd traveling-salesman-genetic-algorithm
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Usage

### Controls Overview

| Control                | Description                      | Range/Options                           |
| ---------------------- | -------------------------------- | --------------------------------------- |
| **Fitness Strategy**   | How to evaluate path quality     | Shortest Path, Manhattan Distance       |
| **Crossover Strategy** | How to combine parent paths      | Order Crossover, Single Point Crossover |
| **Mutation Strategy**  | How to mutate paths              | Shuffle Mutation, Swap Mutation         |
| **Mutation Rate**      | Probability of mutation per gene | 0.0 - 1.0 (default: 0.01)               |
| **Points Count**       | Number of cities to visit        | 2 - 100 (default: 10)                   |
| **Population Size**    | Number of candidate solutions    | 1 - 1000 (default: 200)                 |

### Evolution Controls

- **Run / Pause**: Start or stop automatic evolution (10 generations/second)
- **Next generation**: Manually step through one generation
- **New individuals**: Replace population with new random paths
- **Reset**: Generate new random cities and restart with default settings

### Theming

The header carries a light / system / dark switch (`next-themes`), stored per browser and
defaulting to the operating system setting. The canvas reads its colors from the design system
tokens, so it repaints with the rest of the page.

### Visualization

- **Dots**: Cities to visit
- **Foreground line**: Current best path (shortest distance)
- **Destructive line**: Current worst path in the population

## Algorithm Details

The genetic algorithm implements a classic generational approach:

### Core Parameters

| Parameter       | Default               | Description                                                                           |
| --------------- | --------------------- | ------------------------------------------------------------------------------------- |
| Population Size | 200                   | Number of individuals per generation                                                  |
| Mutation Rate   | 0.01                  | Probability of mutation per gene                                                      |
| Selection       | Fitness-proportionate | Roulette wheel: exactly `populationSize` parents drawn from cumulative fitness shares |
| Elitism         | Explicit              | The fittest individual is carried over unchanged                                      |

### Genetic Operators

1. **Selection**: Fitness-proportionate (roulette wheel) selection draws exactly `populationSize` parents from the cumulative fitness shares, so every individual can be selected
2. **Crossover**: Combines two parent paths to produce offspring
3. **Mutation**: Randomly alters genes to maintain diversity
4. **Replacement**: The next generation is built from the offspring, with the fittest individual of the current one carried over unchanged

### Fitness Functions

- **Shortest Path** (default): Inverse of total Euclidean distance
- **Manhattan Distance**: Inverse of total Manhattan distance

## Available Strategies

### Mutation Strategies

| Strategy             | Description                         | Best For                                 |
| -------------------- | ----------------------------------- | ---------------------------------------- |
| **Shuffle Mutation** | Randomly shuffles a subset of genes | Large exploration, escaping local optima |
| **Swap Mutation**    | Swaps two random positions          | Fine-tuning, local search                |

### Crossover Strategies

| Strategy                   | Description                       | Best For                       |
| -------------------------- | --------------------------------- | ------------------------------ |
| **Order Crossover (OX1)**  | Preserves relative order of genes | Maintaining valid permutations |
| **Single Point Crossover** | Single crossover point            | Simple recombination           |

### Fitness Strategies

| Strategy               | Description         | Use Case                  |
| ---------------------- | ------------------- | ------------------------- |
| **Shortest Path**      | Euclidean distance  | Standard TSP              |
| **Manhattan Distance** | Grid-based distance | Grid-constrained problems |

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Page composition (header, controls, stage)
│   ├── layout.tsx         # Root layout, fonts, theme & tooltip providers
│   ├── globals.css        # Stylesheet entry (Tailwind + @konopskidev/ui)
│   ├── constants.ts       # Algorithm defaults and input bounds
│   └── strategies.ts      # Selectable strategy registry
├── components/            # Presentational UI components
│   ├── AppHeader/         # Title, tagline and the theme switch
│   ├── ControlsPanel/     # Strategies, parameters and run controls
│   ├── VisualizationStage/# Canvas, legend and stats
│   ├── Section/           # Titled card used by the panels
│   ├── StrategySelect/    # Labelled select over the strategy registry
│   ├── NumberField/       # Labelled, clamped number input
│   ├── ThemeProvider/     # next-themes provider
│   └── ThemeToggle/       # Light / system / dark switch
├── hooks/                 # useGeneticAlgorithm (all algorithm state)
├── entities/              # Core domain entities
│   ├── Individual/        # Individual (chromosome) implementation
│   ├── Point/             # 2D point/city representation
│   └── Population/        # Population management & evolution
├── services/              # Strategy implementations
│   ├── FitnessStrategy/   # Fitness evaluation strategies
│   ├── MutationStrategy/  # Mutation strategies
│   └── CrossoverStrategy/ # Crossover strategies
├── utils/                 # Utility functions
├── examples/              # Usage examples
└── integration/           # Integration tests
```

### Design Patterns

- **Strategy Pattern**: All genetic operators (fitness, mutation, crossover) are implemented as interchangeable strategies
- **Factory Pattern**: `Population.getRandomPopulation()` creates initialized populations
- **Observer Pattern**: React state manages UI updates during evolution

### Key Classes

- `Population`: Manages population lifecycle, evolution, and strategy injection
- `IndividualImpl`: Concrete individual with genes and strategy references
- `Point`: 2D coordinate with static factory for random generation
- `FitnessStrategy` (abstract): Interface for fitness evaluation
- `MutationStrategy` (abstract): Base class for mutation operators
- `CrossoverStrategy` (abstract): Base class for crossover operators

## API Reference

### Population

```typescript
// Create a random population
const population = Population.getRandomPopulation(
  IndividualImpl,
  populationSize: number,
  points: Point[],
  fitnessStrategy: FitnessStrategy,
  mutationStrategy: MutationStrategy,
  crossoverStrategy: CrossoverStrategy
): Population

// Evolution
population.evolve(): Population

// Getters
population.getBestIndividual(): Individual
population.getworstIndividual(): Individual
population.getIndividuals(): Individual[]
population.getPopulationSize(): number
population.score(): number

// Configuration
population.setMutationRate(rate: number): void
population.setFitnessStrategy(strategy: FitnessStrategy): void
population.setMutationStrategy(strategy: MutationStrategy): void
population.setCrossoverStrategy(strategy: CrossoverStrategy): void
population.setPopulationSize(size: number, points: Point[]): void
```

### Strategies

All strategies can be instantiated and configured:

```typescript
// Mutation strategies
const shuffleMutation = new ShuffleMutationStrategy();
const swapMutation = new SwapMutationStrategy();
shuffleMutation.setMutationRate(0.05);

// Crossover strategies
const orderCrossover = new OrderCrossoverStrategy();
const singlePointCrossover = new SinglePointCrossoverStrategy();

// Fitness strategies
const shortestPath = new ShortestPathFitnessStrategy(points);
const manhattanDistance = new ManhattanDistanceFitnessStrategy(points);
```

### Custom Strategies

See [Strategy Pattern Guide](docs/STRATEGY_PATTERN.md) for implementing custom strategies.

## Development

### Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production (includes linting)
pnpm start        # Start production server
pnpm test         # Run all tests
pnpm test:watch   # Run tests in watch mode
pnpm bench        # Benchmark one generation and one repaint at several sizes
pnpm lint         # Check code style (ESLint + Prettier)
pnpm lint:fix     # Fix code style issues automatically
```

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components only
- **Linting**: ESLint + Prettier + TypeScript type checking (enforced via husky pre-commit hooks)
- **Testing**: Jest with React Testing Library

### Project Structure Conventions

- Entities in `src/entities/`
- Strategies in `src/services/`
- Presentational components in `src/components/`, one folder per component with an `index.tsx`
  barrel
- Shared state lives in hooks under `src/hooks/`; components receive props
- Tests co-located with source files (`.test.ts`/`.test.tsx`)
- Integration tests in `src/integration/`
- Examples in `src/examples/`

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test --coverage
```

### Test Coverage Requirements

- Unit tests for all strategies
- Integration tests for strategy interactions
- Edge case coverage (empty arrays, single elements, boundary values)
- Aim for at least 80% coverage: CI runs the suite with `--coverage` and uploads the report

## Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details on:

- Development setup
- Code style guidelines
- Adding new strategies
- Testing requirements
- Pull request process

### Quick Contribution Checklist

- [ ] Fork the repository
- [ ] Create a feature branch
- [ ] Make changes with tests
- [ ] Run `pnpm test && pnpm lint && pnpm build`
- [ ] Submit a pull request

### Issue Templates

- [Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml)
- [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml)
- [Strategy Implementation](.github/ISSUE_TEMPLATE/strategy_implementation.yml)
- [Performance Improvement](.github/ISSUE_TEMPLATE/performance_improvement.yml)
- [Documentation](.github/ISSUE_TEMPLATE/documentation.yml)
- [Task](.github/ISSUE_TEMPLATE/task.yml)

## Roadmap

- [ ] Web Workers for background evolution
- [ ] More crossover strategies (PMX, CX, ERX)
- [ ] More mutation strategies (Inversion, Scramble, Displacement)
- [x] Benchmarking and performance profiling
- [ ] Export/import population state
- [ ] Multi-objective optimization support
- [ ] 3D visualization option

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Michał Konopski**

- GitHub: [@misiekhardcore](https://github.com/misiekhardcore)
- Email: konopskiwebdev@gmail.com

## Acknowledgments

- Inspired by classic genetic algorithm implementations for TSP
- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/)
- UI components from [`@konopskidev/ui`](https://github.com/misiekhardcore/konopskidevui) on Tailwind CSS v4
- Canvas rendering for real-time visualization
