export class Point {
  constructor(
    public x: number,
    public y: number
  ) {}

  getDistanceTo(point: Point): number {
    return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
  }

  static getRandomPoints(numberOfPoints: number, maxX: number, maxY: number): Point[] {
    return Array.from(
      { length: numberOfPoints },
      () => new Point(Math.floor(Math.random() * maxX), Math.floor(Math.random() * maxY))
    );
  }
}
