export interface Point {
  longitude: number;
  latitude: number;
  elevation?: number;
}

export enum Direction {
  Forward = 'forward',
  Backward = 'backward',
  BiDirectional = 'bidirectional',
}

// Make given keys of a type required
export type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> &
  Partial<Omit<T, K>>;
