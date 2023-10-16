export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export class Utils {
  static isInsidePolygon(x: number, y: number, points: Point[]): boolean {
    let is = false;

    for (let index = 1; index < points.length; index++) {
      if (
        points[index].y > y !== points[index - 1].y > y &&
        x <
          points[index].x +
            ((points[index - 1].x - points[index].x) * (y - points[index].y)) / (points[index - 1].y - points[index].y)
      ) {
        is = !is;
      }
    }

    return is;
  }
}
