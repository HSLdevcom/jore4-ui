export type PixelCoordinates = [number, number]; // X, Y

// Geojson coordinates [longitude, latitude]
// GeoJSON package only provides an alias for anysized number[] array.
export type Coordinates = [number, number];

export type CenterRadius = {
  readonly center: Coordinates;
  readonly radius: number;
};

export type Circles = {
  readonly stops: ReadonlyArray<CenterRadius>;
  readonly area: CenterRadius;
};

export interface PixelCoordinateConverter {
  coordinates(coordinates: Coordinates): PixelCoordinates;
  radius(radius: number): number;
}
