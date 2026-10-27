# Contributing Guide

Thank you for your interest in contributing to the Traveling Salesman Genetic Algorithm project! We welcome contributions! This guide provides practical instructions for contributors. See our [Code of Conduct](../CODE_OF_CONDUCT.md) and [Security Policy](../SECURITY.md) for community guidelines.

## Development Setup

### Prerequisites

- Node.js 18 or higher
- PNPM v12 package manager
- Git

### Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/traveling-salesman-genetic-algorithm.git
cd traveling-salesman-genetic-algorithm

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Verify Setup

```bash
# Run all tests
pnpm test

# Check code style
pnpm lint

# Build the project
pnpm build
```

## Development Workflow

### Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production (includes linting)
pnpm start        # Start production server
pnpm test         # Run all tests
pnpm test:watch   # Run tests in watch mode
pnpm lint         # Check code style (ESLint + Prettier)
pnpm lint:fix     # Fix code style issues automatically
```

### Code Style Requirements

- **TypeScript**: Use interfaces for React component props, prefer functions over const
- **React**: Use functional components only
- **Linting**: ESLint + Prettier configuration enforced

## Adding New Strategies

### 1. Mutation Strategy

Create a new mutation strategy by extending the base class:

```typescript
// src/services/MutationStrategy/YourMutationStrategy/YourMutationStrategy.ts
import { MutationStrategy } from '../MutationStrategy';

export class YourMutationStrategy extends MutationStrategy {
  static readonly label = 'Your Mutation';

  mutate(genes: number[]): number[] {
    // Your mutation logic here
    // Must return a new array, never modify the input
    return [...genes]; // Example: return a copy
  }
}
```

### 2. Crossover Strategy

```typescript
// src/services/CrossoverStrategy/YourCrossoverStrategy/YourCrossoverStrategy.ts
import { CrossoverStrategy } from '../CrossoverStrategy';

export class YourCrossoverStrategy extends CrossoverStrategy {
  static readonly label = 'Your Crossover';

  crossover(parent1: number[], parent2: number[]): [number[], number[]] {
    // Your crossover logic here
    // Must return two new arrays with all unique elements
    return [parent1, parent2]; // Example
  }
}
```

### 3. Fitness Strategy

```typescript
// src/services/FitnessStrategy/YourFitnessStrategy/YourFitnessStrategy.ts
import { FitnessStrategy } from '../FitnessStrategy';
import { Individual, Point } from '@/entities';

export class YourFitnessStrategy extends FitnessStrategy {
  static readonly label = 'Your Fitness';
  readonly label = YourFitnessStrategy.label;

  evaluate(individual: Individual): number {
    // Your fitness calculation logic
    return 0; // Example
  }
}
```

The base class supplies `points`, `setPoints`, a memoized `getIndividualFitness`
and `getFitnessSum`, so a custom strategy only implements the formula. Override
`getIndividualFitness` instead when a strategy must opt out of the memo.

## Testing Requirements

All strategies have to include comprehensive tests. See the test files for examples of how to test custom strategies.

### Test Coverage

- **Unit Tests**: Every strategy must have comprehensive unit tests
- **Integration Tests**: Test strategy interactions in `src/integration/`
- **Edge Cases**: Test boundary conditions and error scenarios
- **Coverage**: Maintain test coverage above 80%

## Implementation Notes

- All strategies extend base classes (`MutationStrategy`, `CrossoverStrategy`, `FitnessStrategy`)
- Strategies operate on gene arrays (number[]) rather than Individual objects for better separation of concerns
- All mutation and crossover strategies should return new arrays rather than modifying input arrays
- The Population class manages strategy injection to Individual instances during reproduction
- Mutation strategies have a configurable mutation rate that can be set via `setMutationRate()`
- Each strategy has a static `label` property for identification in the UI

### Running Tests

```bash
pnpm test              # Run all tests once
pnpm test:watch        # Run tests in watch mode
pnpm test --coverage   # Run with coverage report
```

## Pull Request Process

### Before Submitting

1. **Create feature branch**: `git checkout -b feature/your-feature-name`
2. **Make changes**: Follow code style guidelines
3. **Add tests**: Include comprehensive test coverage
4. **Run checks**: `pnpm test && pnpm lint && pnpm build`
5. **Commit**: Use conventional commit format

### Commit Message Format

Use [conventional commit](https://www.conventionalcommits.org/) format.

### PR Requirements Checklist

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Build succeeds
- [ ] New functionality is tested
- [ ] PR description explains changes
- [ ] No breaking changes (or clearly documented)

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature (strategy)
- [ ] Documentation update
- [ ] Performance improvement

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated if needed
```

## Common Issues & Solutions

### Strategy Implementation

- **Always return new arrays**: Never modify input parameters
- **Handle edge cases**: Empty arrays, single elements, etc.
- **Maintain uniqueness**: Crossover strategies must preserve all unique elements
- **Test thoroughly**: Include mutation rate 0, 1, and edge cases

## Getting Help

- **Issues**: Check existing GitHub issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Refer to the [docs/](.) directory and root-level documentation (README.md, CHANGELOG.md, CODE_OF_CONDUCT.md, SECURITY.md)
- **Examples**: Check src/examples/ for usage patterns

## Areas for Contribution

### High Priority

- **New Strategies**: Mutation, crossover, and fitness strategies
- **Performance**: Algorithm optimizations and parallel processing
- **Testing**: Additional test cases and edge case coverage

### Medium Priority

- **Documentation**: API docs, tutorials, algorithm explanations
- **Visualization**: Better graphics and performance monitoring
- **Examples**: More usage examples and demonstrations

### Low Priority

- **Tooling**: Development tools and benchmarking utilities
- **CI/CD**: GitHub Actions improvements
- **Accessibility**: UI/UX improvements

## License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](../LICENSE).
