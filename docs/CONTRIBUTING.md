# Contributing Guide

Thank you for your interest in contributing to the Traveling Salesman Genetic Algorithm project! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 18 or higher
- Yarn package manager
- Git

### Getting Started

1. **Fork the repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/travelling-salesman-genetic-algorithm.git
   cd travelling-salesman-genetic-algorithm
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start development server**

   ```bash
   yarn dev
   ```

4. **Run tests**
   ```bash
   yarn test
   ```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   └── layout.tsx         # App layout and metadata
├── entities/              # Core domain objects
│   ├── Individual/        # Genetic algorithm individual
│   ├── Point/            # City/point representation
│   └── Population/       # Population management
├── services/             # Algorithm strategies
│   ├── CrossoverStrategy/ # Crossover implementations
│   ├── FitnessStrategy/  # Fitness calculation
│   └── MutationStrategy/ # Mutation implementations
├── utils/               # Utility functions
├── integration/         # Integration tests
└── examples/           # Usage examples
```

## Code Style

This project uses ESLint and Prettier for code formatting:

```bash
# Check code style
yarn lint

# Fix code style issues
yarn lint:fix
```

### Style Guidelines

- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Use meaningful variable and function names
- Keep functions small and focused

## Adding New Features

### Creating a New Strategy

1. **Mutation Strategy Example**

   ```typescript
   // src/services/MutationStrategy/NewMutationStrategy/NewMutationStrategy.ts
   import { MutationStrategy } from '../MutationStrategy';

   export class NewMutationStrategy extends MutationStrategy {
     static readonly label = 'New Mutation';

     mutate(genes: number[], mutationRate: number): number[] {
       // Implementation here
       return genes;
     }
   }
   ```

2. **Add tests**

   ```typescript
   // src/services/MutationStrategy/NewMutationStrategy/NewMutationStrategy.test.ts
   import { NewMutationStrategy } from './NewMutationStrategy';

   describe('NewMutationStrategy', () => {
     it('should mutate genes correctly', () => {
       // Test implementation
     });
   });
   ```

3. **Export from index**
   ```typescript
   // src/services/MutationStrategy/index.ts
   export { NewMutationStrategy } from './NewMutationStrategy';
   ```

### Testing Guidelines

- Write unit tests for all new strategies
- Include integration tests for complex features
- Test edge cases and error conditions
- Maintain test coverage above 80%

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch
```

## Submitting Changes

### Commit Messages

Use conventional commit format:

```
feat: add new mutation strategy
fix: resolve crossover bug
docs: update API documentation
test: add integration tests
refactor: improve code organization
```

### Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following the style guidelines
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**

   ```bash
   yarn test
   yarn lint
   yarn build
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub.

### PR Requirements

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] New functionality is documented
- [ ] PR description explains the changes
- [ ] Screenshots for UI changes (if applicable)

## Common Development Tasks

### Adding a New Algorithm

1. Create the strategy class
2. Add comprehensive tests
3. Update the main app to include the strategy
4. Document the algorithm in the appropriate docs
5. Add usage examples

### Improving Performance

1. Profile the current implementation
2. Identify bottlenecks
3. Implement optimizations
4. Verify performance improvements
5. Update benchmarks if applicable

### Fixing Bugs

1. Write a failing test that reproduces the bug
2. Fix the bug
3. Verify the test now passes
4. Check for similar issues in the codebase

## Code Review Process

All submissions require code review:

1. **Automated Checks**: GitHub Actions will run tests and linting
2. **Manual Review**: Maintainers will review code quality and design
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, the PR can be merged

## Getting Help

- **Issues**: Check existing GitHub issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Refer to the docs/ directory
- **Examples**: Check src/examples/ for usage patterns

## Areas for Contribution

We welcome contributions in these areas:

### Algorithms

- New mutation strategies
- New crossover strategies
- Alternative fitness functions
- Population management improvements

### Visualization

- Better graphics and animations
- Performance monitoring charts
- Algorithm comparison tools
- Interactive tutorials

### Performance

- Optimization of existing algorithms
- Parallel processing
- Memory usage improvements
- Benchmarking tools

### Documentation

- API documentation
- Tutorial content
- Algorithm explanations
- Video demonstrations

### Testing

- Additional test cases
- Performance benchmarks
- Visual regression tests
- Fuzzing tests

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
