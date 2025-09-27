export class Point {
  constructor(
    public x: number,
    public y: number
  ) {}

  static getRandomPoints(numberOfPoints: number, maxX: number, maxY: number): Point[] {
    return Array.from(
      { length: numberOfPoints },
      () => new Point(Math.floor(Math.random() * maxX), Math.floor(Math.random() * maxY))
    );
  }
}
