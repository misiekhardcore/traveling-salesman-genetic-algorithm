import { Point } from './Point';

describe('Point', () => {
  it('should calculate the distance to another point', () => {
    const point1 = new Point(0, 0);
    const point2 = new Point(0, 1);
    const distance = point1.getDistanceTo(point2);
    expect(distance).toBe(1);
  });

  it('should generate random points', () => {
    const points = Point.getRandomPoints(10, 100, 100);
    expect(points.length).toBe(10);
  });
});
