/**
 * Micro-benchmark for the genetic algorithm.
 *
 * Run with:  pnpm bench
 *
 * It reports two numbers for a few configurations:
 *   - evolve: the cost of one generation (what the Run interval pays 10x/second)
 *   - draw:   the cost of reading the best and worst route, which page.tsx does
 *             on every repaint
 *
 * Alongside the timings it counts how often the fitness formula actually runs,
 * which is the number the redundant recomputations show up in.
 *
 * Node cannot load the project's TypeScript directly (the sources use parameter
 * properties, and the internal imports are path aliases without extensions), so
 * this script installs a small require hook that transpiles with the `typescript`
 * dependency the project already has. No extra packages, no build step.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire, Module } from 'node:module';

const require = createRequire(import.meta.url);
const typescript = require('typescript');

// Transpile .ts/.tsx on require().
const transpile = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const { outputText } = typescript.transpileModule(source, {
    compilerOptions: {
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2022,
      jsx: filename.endsWith('.tsx') ? typescript.JsxEmit.ReactJSX : undefined,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};
Module._extensions['.ts'] = transpile;
Module._extensions['.tsx'] = transpile;

// Resolve the `@/` alias and extension-less relative imports.
const srcRoot = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'src');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function resolveWithAliases(request, ...rest) {
  const target = request.startsWith('@/') ? path.join(srcRoot, request.slice(2)) : request;
  try {
    return originalResolve.call(this, target, ...rest);
  } catch {
    try {
      return originalResolve.call(this, `${target}.ts`, ...rest);
    } catch {
      return originalResolve.call(this, path.join(target, 'index.ts'), ...rest);
    }
  }
};

const { Population } = require('../src/entities/Population/Population.ts');
const { IndividualImpl } = require('../src/entities/Individual/Individual.ts');
const { Point } = require('../src/entities/Point/Point.ts');
const {
  ShortestPathFitnessStrategy,
} = require('../src/services/FitnessStrategy/ShortestPathFitnessStrategy/ShortestPathFitnessStrategy.ts');
const {
  ShuffleMutationStrategy,
} = require('../src/services/MutationStrategy/ShuffleMutationStrategy/ShuffleMutationStrategy.ts');
const {
  OrderCrossoverStrategy,
} = require('../src/services/CrossoverStrategy/OrderCrossoverStrategy/OrderCrossoverStrategy.ts');

const CONFIGURATIONS = [
  { label: 'defaults (N=200, P=10)', population: 200, points: 10, generations: 100 },
  { label: 'medium   (N=500, P=50)', population: 500, points: 50, generations: 30 },
  { label: 'maximum  (N=1000, P=100)', population: 1000, points: 100, generations: 10 },
];

const FRAMES = 10;

/**
 * Counts fitness formula runs. Memoized builds expose `evaluate`, the original
 * code only exposes `getIndividualFitness`, so wrap whichever one performs the
 * work to keep the count comparable across both.
 */
function instrument(strategy) {
  const counter = { evaluations: 0 };
  const methodName = typeof strategy.evaluate === 'function' ? 'evaluate' : 'getIndividualFitness';
  const original = strategy[methodName];
  strategy[methodName] = function instrumented(...args) {
    counter.evaluations += 1;
    return original.apply(this, args);
  };
  return counter;
}

function createFixture({ population, points }) {
  const coordinates = Point.getRandomPoints(points, 1000, 700);
  const fitnessStrategy = new ShortestPathFitnessStrategy(coordinates);
  const mutationStrategy = new ShuffleMutationStrategy(0.01);
  const crossoverStrategy = new OrderCrossoverStrategy();
  const counter = instrument(fitnessStrategy);
  const seed = Population.getRandomPopulation(
    IndividualImpl,
    population,
    coordinates,
    fitnessStrategy,
    mutationStrategy,
    crossoverStrategy
  );

  const wrap = (individuals) =>
    new Population(individuals, fitnessStrategy, mutationStrategy, crossoverStrategy);

  return {
    counter,
    // page.tsx keeps one population instance and hands a *new* wrapper to React
    // on every repaint, so both wrappers below mirror that.
    fresh: () => wrap(seed.getIndividuals()),
    repaint: (instance) => wrap(instance.getIndividuals()),
  };
}

function measure({ label, population, points, generations }) {
  const fixture = createFixture({ population, points });

  // Warm up the JIT on a throwaway population so the first timed run is honest.
  let warm = fixture.fresh();
  for (let i = 0; i < 5; i += 1) warm = warm.evolve();

  fixture.counter.evaluations = 0;
  let evolved = fixture.fresh();
  const startedEvolve = performance.now();
  for (let generation = 0; generation < generations; generation += 1) {
    evolved = evolved.evolve();
  }
  const evolveMs = (performance.now() - startedEvolve) / generations;
  const evaluationsPerGeneration = fixture.counter.evaluations / generations;

  // The memo is always cold here: each repaint wraps the same individuals in a
  // new Population, exactly like the render loop does.
  fixture.counter.evaluations = 0;
  const startedDraw = performance.now();
  for (let frame = 0; frame < FRAMES; frame += 1) {
    const repaint = fixture.repaint(evolved);
    repaint.getBestIndividual();
    repaint.getworstIndividual();
  }
  const drawMs = (performance.now() - startedDraw) / FRAMES;
  const evaluationsPerFrame = fixture.counter.evaluations / FRAMES;

  return { label, evolveMs, drawMs, evaluationsPerGeneration, evaluationsPerFrame };
}

const results = CONFIGURATIONS.map(measure);

const header = `${'configuration'.padEnd(26)}${'evolve'.padStart(14)}${'draw'.padStart(15)}${'fitness evals/gen'.padStart(20)}`;
console.log('');
console.log('Genetic algorithm benchmark');
console.log('='.repeat(header.length));
console.log(header);
console.log('-'.repeat(header.length));
for (const result of results) {
  console.log(
    `${result.label.padEnd(26)}` +
      `${`${result.evolveMs.toFixed(2)} ms/gen`.padStart(14)}` +
      `${`${result.drawMs.toFixed(2)} ms/frame`.padStart(15)}` +
      `${Math.round(result.evaluationsPerGeneration).toString().padStart(20)}`
  );
}
console.log('-'.repeat(header.length));
console.log(
  `fitness evaluations per repaint: ${results
    .map((result) => Math.round(result.evaluationsPerFrame))
    .join(' / ')}`
);
console.log('');
console.log('A generation must stay well under 100 ms: the UI asks for one every 100 ms.');
console.log('');
