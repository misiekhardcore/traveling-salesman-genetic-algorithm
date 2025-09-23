# Traveling Salesman Genetic Algorithm

An interactive web application that visualizes the Traveling Salesman Problem (TSP) solved using genetic algorithms. Watch in real-time as the algorithm evolves to find the shortest path connecting all cities.

![Application Screenshot](https://github.com/user-attachments/assets/dd046923-5e94-4433-a972-64b27f0d921b)

## Features

- 🧬 **Genetic Algorithm Visualization**: Watch the evolution process in real-time
- 🔄 **Multiple Strategies**: Switch between different mutation and crossover strategies
- ⚙️ **Interactive Controls**: Adjust mutation rates, point counts, and algorithm parameters
- 🎯 **Visual Feedback**: See both the best (white) and worst (red) solutions simultaneously
- 📊 **Strategy Pattern Implementation**: Modular and extensible algorithm components

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/misiekhardcore/traveling-salesman-genetic-algorithm.git
cd traveling-salesman-genetic-algorithm
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

## Algorithm Details

The genetic algorithm uses:

- **Selection**: Fitness-proportionate selection
- **Population Size**: 100 individuals
- **Mutation Rate**: Configurable (default: 0.01)
- **Fitness Function**: Inverse of total path distance

## Documentation

- [Strategy Pattern Guide](docs/STRATEGY_PATTERN.md) - Detailed guide on implementing custom strategies
- [Contributing Guidelines](docs/CONTRIBUTING.md) - How to contribute to the project

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**misiekhardcore**

- Email: konopskiwebdev@gmail.com
- GitHub: [@misiekhardcore](https://github.com/misiekhardcore)
