import { Point } from './Point';

describe('Point', () => {
  it('should generate random points', () => {
    const points = Point.getRandomPoints(10, 100, 100);
    expect(points.length).toBe(10);
  });
});
