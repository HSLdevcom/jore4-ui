import { HELSINKI_CITY_CENTER_COORDINATES } from '../../../redux';
import { Priority } from '../../../types/enums';
import {
  ResultSelection,
  StopSearchFilters,
} from '../../stop-registry/search/types';

export type DisplayedRouteParams = {
  readonly lineLabel: string | null;
  readonly routeId: UUID | null;
  readonly routeLabels: ReadonlyArray<string>;
  readonly routePriorities: ReadonlyArray<Priority>;
  readonly showSelectedDaySituation: boolean;
};

export type ViewPortParams = {
  readonly latitude: number;
  readonly longitude: number;
  readonly zoom: number;
};

export type MapUrlState = {
  readonly displayedRoute: DisplayedRouteParams;
  readonly filters: StopSearchFilters;
  readonly resultSelection: ResultSelection;
  readonly viewPort: ViewPortParams;
};

export const defaultDisplayedRouteParams: DisplayedRouteParams = {
  lineLabel: null,
  routeId: null,
  routeLabels: [],
  routePriorities: [],
  showSelectedDaySituation: false,
};

export const defaultViewPortParams: ViewPortParams = {
  latitude: HELSINKI_CITY_CENTER_COORDINATES.latitude,
  longitude: HELSINKI_CITY_CENTER_COORDINATES.longitude,
  zoom: 13,
};

export type OpenMapViewPortParams =
  | ViewPortParams
  | Pick<ViewPortParams, 'latitude' | 'longitude'>;

export type OpenMapUrlState = {
  // Either all details or none
  readonly displayedRoute?: DisplayedRouteParams;

  // Allow setting individual filters (observationDate)
  readonly filters?: Partial<StopSearchFilters>;

  // Optional result selection
  readonly resultSelection?: ResultSelection;

  // Only allow longitude together with latitude, zoom is optional.
  readonly viewPort?: OpenMapViewPortParams;
};
