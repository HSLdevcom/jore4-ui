export interface Point {
  latitude: number;
  longitude: number;
}

export enum Direction {
  Forward = 'forward',
  Backward = 'backward',
  BiDirectional = 'bidirectional',
}
