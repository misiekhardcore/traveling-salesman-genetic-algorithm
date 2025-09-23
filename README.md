# Traveling Salesman Genetic Algorithm

An interactive web application that visualizes the Traveling Salesman Problem (TSP) solved using genetic algorithms. Watch in real-time as the algorithm evolves to find the shortest path connecting all cities.

![Application Screenshot](https://github.com/user-attachments/assets/dd046923-5e94-4433-a972-64b27f0d921b)

## Features

- 🧬 **Genetic Algorithm Visualization**: Watch the evolution process in real-time
- 🔄 **Multiple Strategies**: Switch between different mutation and crossover strategies
- ⚙️ **Interactive Controls**: Adjust mutation rates, point counts, and algorithm parameters
- 🎯 **Visual Feedback**: See both the best (white) and worst (red) solutions simultaneously
- 📊 **Strategy Pattern Implementation**: Modular and extensible algorithm components

## Available Strategies

### Mutation Strategies

- **Shuffle Mutation**: Randomly rearranges a subset of genes
- **Swap Mutation**: Swaps two random genes in the chromosome

### Crossover Strategies

- **Order Crossover**: Preserves the relative order of genes from parents
- **Single Point Crossover**: Combines genes from two parents at a single crossover point

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/misiekhardcore/travelling-salesman-genetic-algorithm.git
cd travelling-salesman-genetic-algorithm
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Adjust Parameters**: Use the controls to modify:
   - Mutation strategy (Shuffle or Swap)
   - Crossover strategy (Order or Single Point)
   - Mutation rate (0.0 - 1.0)
   - Number of cities (2 - 100)

2. **Control Evolution**:
   - **Run**: Start automatic evolution
   - **Next Generation**: Manually step through one generation
   - **Reset**: Generate new random cities and restart

3. **Observe Results**: The visualization shows:
   - White dots: Cities to visit
   - White line: Current best path (shortest distance)
   - Red line: Current worst path in the population

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── entities/               # Core domain objects
│   ├── Individual/         # Genetic algorithm individual
│   ├── Point/             # City/point representation
│   └── Population/        # Population management
├── services/              # Algorithm strategies
│   ├── CrossoverStrategy/ # Crossover implementations
│   ├── FitnessStrategy/   # Fitness calculation
│   └── MutationStrategy/  # Mutation implementations
├── utils/                 # Utility functions
└── examples/              # Usage examples
```

## Documentation

- [Strategy Pattern Guide](docs/STRATEGY_PATTERN.md) - Detailed guide on implementing custom strategies
- [API Documentation](docs/) - Complete API reference (coming soon)

## Development

### Running Tests

```bash
yarn test          # Run all tests
yarn test:watch    # Run tests in watch mode
```

### Linting and Formatting

```bash
yarn lint          # Check code style
yarn lint:fix      # Fix code style issues
```

### Building for Production

```bash
yarn build         # Build the application
yarn start         # Start production server
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`yarn test && yarn lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **HTML5 Canvas** - High-performance visualization
- **Jest** - Testing framework
- **ESLint + Prettier** - Code quality and formatting

## Algorithm Details

The genetic algorithm uses:

- **Selection**: Fitness-proportionate selection
- **Population Size**: 100 individuals
- **Mutation Rate**: Configurable (default: 0.01)
- **Fitness Function**: Inverse of total path distance

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**misiekhardcore**

- Email: konopskiwebdev@gmail.com
- GitHub: [@misiekhardcore](https://github.com/misiekhardcore)
