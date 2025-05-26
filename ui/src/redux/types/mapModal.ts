export type Viewport = {
  readonly latitude: number;
  readonly longitude: number;
  readonly radius: number;
  readonly bounds: ReadonlyArray<readonly [number, number]>;
};
