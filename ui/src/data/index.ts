import { geojson1004 } from './1004x_w_r.geojson';
import { geojson1088 } from './1088b.geojson';
import { geojson4433 } from './4433k.geojson';

export * from './1004x_w_r.geojson';
export * from './1088b.geojson';
export * from './4433k.geojson';

export type ExampleRoute = {
  readonly id: string;
  readonly name: string;
  readonly data: ExplicitAny;
};

export const routes = {
  '1004x': { id: '1004x', name: '1004x', data: geojson1004 } as ExampleRoute,
  '1088b': { id: '1088b', name: '1088b', data: geojson1088 } as ExampleRoute,
  '4433k': { id: '4433k', name: '4433k', data: geojson4433 } as ExampleRoute,
};
