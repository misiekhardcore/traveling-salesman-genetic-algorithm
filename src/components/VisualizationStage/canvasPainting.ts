import type { Point } from '@/entities';

const POINT_RADIUS = 8;
const BEST_ROUTE_WIDTH = 2.5;
const WORST_ROUTE_WIDTH = 1.25;

/**
 * Colors used to draw the visualization. They are read from the design system's
 * tokens, so the canvas always follows the exact same light/dark scheme as the
 * page around it instead of guessing the ink color in JavaScript.
 */
export interface CanvasPalette {
  surface: string;
  ink: string;
  worst: string;
}

export function readCanvasPalette(): CanvasPalette {
  const styles = getComputedStyle(document.documentElement);
  const read = (property: string, fallback: string) => {
    const value = styles.getPropertyValue(property).trim();
    return value === '' ? fallback : value;
  };

  return {
    surface: read('--card', '#ffffff'),
    ink: read('--foreground', '#1d2329'),
    worst: read('--destructive', '#b4362f'),
  };
}

interface PaintPopulationParams {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  points: Point[];
  bestPath: number[];
  worstPath: number[];
  palette: CanvasPalette;
}

/**
 * Repaints the whole visualization: the surface, then the worst route, the best
 * route and the points on top.
 */
export function paintPopulation({
  context,
  width,
  height,
  points,
  bestPath,
  worstPath,
  palette,
}: PaintPopulationParams): void {
  // Paint the surface first, so the ink always contrasts with it no matter what
  // the page background happens to be.
  context.fillStyle = palette.surface;
  context.fillRect(0, 0, width, height);

  drawPath({
    context,
    points,
    pointIndexes: worstPath,
    color: palette.worst,
    width: WORST_ROUTE_WIDTH,
  });
  drawPath({
    context,
    points,
    pointIndexes: bestPath,
    color: palette.ink,
    width: BEST_ROUTE_WIDTH,
  });
  points.forEach((point) => drawPoint({ context, point, palette }));
}

function drawPoint({
  context,
  point,
  palette,
}: {
  context: CanvasRenderingContext2D;
  point: Point;
  palette: CanvasPalette;
}) {
  context.beginPath();
  context.arc(point.x, point.y, POINT_RADIUS, 0, Math.PI * 2);
  context.fillStyle = palette.ink;
  context.fill();
  // Ring the node with the surface color so overlapping routes cannot swallow it.
  context.strokeStyle = palette.surface;
  context.lineWidth = 2;
  context.stroke();
  context.closePath();
}

function drawPath({
  context,
  pointIndexes,
  points,
  color,
  width,
}: {
  context: CanvasRenderingContext2D;
  points: Point[];
  pointIndexes: number[];
  color: string;
  width: number;
}) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.lineJoin = 'round';
  context.lineCap = 'round';

  pointIndexes.forEach((pointIndex) => {
    const point = points[pointIndex];
    context.lineTo(point.x, point.y);
  });

  context.lineTo(points[pointIndexes[0]].x, points[pointIndexes[0]].y);
  context.stroke();
  context.closePath();
}
