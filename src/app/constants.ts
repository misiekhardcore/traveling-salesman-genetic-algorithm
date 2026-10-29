/** Algorithm defaults and the bounds the number inputs are clamped to. */
export const POINTS_COUNT = 10;
export const POPULATION_SIZE = 200;
export const MUTATION_RATE = 0.01;

export const MIN_MUTATION_RATE = 0;
export const MAX_MUTATION_RATE = 1;
export const MUTATION_RATE_STEP = 0.01;

export const MIN_POINTS_COUNT = 2;
export const MAX_POINTS_COUNT = 100;

export const MIN_POPULATION_SIZE = 1;
export const MAX_POPULATION_SIZE = 1000;

/** How often the running evolution advances, in milliseconds. */
export const EVOLUTION_INTERVAL_MS = 100;

/** The canvas keeps a fixed drawing buffer and is scaled to its container. */
export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 700;
