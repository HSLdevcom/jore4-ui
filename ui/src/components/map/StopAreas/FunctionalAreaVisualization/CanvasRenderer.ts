import { CenterRadius, Circles, PixelCoordinateConverter } from './types';

const twoPI = Math.PI * 2;
const areaStrokeWidth = 10;

export class CanvasRenderer {
  #canvas: HTMLCanvasElement;

  #ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.#canvas = canvas;

    const ctx = this.#canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      throw new Error('Failed to get Canvas context!');
    }
    this.#ctx = ctx;
  }

  render(converter: PixelCoordinateConverter | null, circles: Circles | null) {
    this.#ctx.reset();

    if (converter && circles) {
      this.#renderActualContent(converter, circles);
    }
  }

  #renderActualContent(converter: PixelCoordinateConverter, circles: Circles) {
    this.#renderAreaCircle(converter, circles);
    this.#renderStopCircles(converter, circles);
    this.#renderAreaCircleOutline(converter, circles);
  }

  #setupAreaDrawParams(
    converter: PixelCoordinateConverter,
    circle: CenterRadius,
  ) {
    const [x, y] = converter.coordinates(circle.center);
    const r = converter.radius(circle.radius);
    const gradient = this.#ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0.635, 'rgb(0 54 89 / 0.0)');
    gradient.addColorStop(0.995, 'rgb(0 116 191 / 0.24)');

    this.#ctx.fillStyle = gradient;
  }

  #renderAreaCircle(converter: PixelCoordinateConverter, { area }: Circles) {
    this.#setupAreaDrawParams(converter, area);

    const path = new Path2D();

    const [x, y] = converter.coordinates(area.center);
    const r = converter.radius(area.radius);
    path.arc(x, y, r, 0, twoPI);
    path.closePath();

    this.#ctx.fill(path, 'evenodd');
  }

  #renderStopCircles(converter: PixelCoordinateConverter, { stops }: Circles) {
    this.#ctx.fillStyle = 'rgb(11 89 255 / 0.622765)';

    const path = new Path2D();
    stops.forEach((circle) => {
      const [x, y] = converter.coordinates(circle.center);
      const r = converter.radius(circle.radius);
      path.arc(x, y, r, 0, twoPI);
      path.closePath();
    });

    this.#ctx.fill(path);
  }

  #setupAreaCircleOutlineDrawParams() {
    this.#ctx.lineWidth = areaStrokeWidth;
    this.#ctx.strokeStyle = '#FFF';
  }

  #renderAreaCircleOutline(
    converter: PixelCoordinateConverter,
    { area }: Circles,
  ) {
    this.#setupAreaCircleOutlineDrawParams();

    const [x, y] = converter.coordinates(area.center);
    const r = converter.radius(area.radius);

    const areaCircleOutlinePath = new Path2D();
    areaCircleOutlinePath.arc(x, y, r - areaStrokeWidth / 2, 0, twoPI);
    areaCircleOutlinePath.closePath();

    this.#ctx.stroke(areaCircleOutlinePath);
  }
}
