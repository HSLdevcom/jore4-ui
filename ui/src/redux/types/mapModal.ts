export type Viewport = {
  readonly latitude: number;
  readonly longitude: number;
  readonly bounds: ReadonlyArray<readonly [number, number]>;
};
