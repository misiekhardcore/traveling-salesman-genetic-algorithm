# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The UI is built from the [`@konopskidev/ui`](https://github.com/misiekhardcore/konopskidevui)
  design system on Tailwind CSS v4, replacing the hand-written SCSS components
- Added a light / system / dark theme switch; the canvas paints from the theme tokens and
  repaints when the theme changes
- `page.tsx` is now a composition of presentational components under `src/components/`, with
  all algorithm state in a `useGeneticAlgorithm` hook

## [1.0.0] - 2026-10-22

### Added

- Interactive TSP visualization using genetic algorithm
- Strategy pattern implementation for fitness, mutation, and crossover strategies
- Real-time evolution with canvas rendering
- Multiple strategy options (Shuffle/Swap mutation, Order/Single Point crossover, Shortest Path/Manhattan fitness)
- Interactive controls for all algorithm parameters
- Comprehensive test suite with unit and integration tests
- CI pipeline with linting, testing, and build checks
- Contribution guidelines and strategy pattern documentation
- Issue and pull request templates
- Security policy and code of conduct

[Unreleased]: https://github.com/misiekhardcore/traveling-salesman-genetic-algorithm/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/misiekhardcore/traveling-salesman-genetic-algorithm/releases/tag/v1.0.0
