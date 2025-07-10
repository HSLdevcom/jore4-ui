import axios from 'axios';
import { MapMatchingNoSegmentError } from '../utils';

type LatLng = {
  readonly lat: number;
  readonly lng: number;
};

type RouteBody = {
  readonly routePoints: ReadonlyArray<LatLng>;
  readonly linkSearchRadius?: number;
};

const positionToLatLng = (pos: GeoJSON.Position): LatLng => {
  return { lng: pos[0], lat: pos[1] };
};

const apiClient = axios.create({
  baseURL: '/api/mapmatching/api/route/v1',
});

const getBus = (coordinates: RouteBody) => apiClient.post('/bus', coordinates);

export type BusRouteResponse = {
  readonly code: 'Ok';
  readonly routes: {
    readonly geometry: GeoJSON.LineString;
    readonly weight: number;
    readonly distance: number;
    readonly paths: {
      readonly infrastructureLinkId: number;
      readonly externalLinkRef: {
        readonly infrastructureSource: 'digiroad_r';
        readonly externalLinkId: string;
      };
      readonly geometry: GeoJSON.LineString;
      readonly weight: number;
      readonly distance: number;
      readonly infrastructureLinkName: {
        readonly fi: string;
        readonly sv: string;
      };
      readonly isTraversalForwards: boolean;
    }[];
  }[];
};

export const getBusRoute = async (
  coordinates: ReadonlyArray<GeoJSON.Position>,
) => {
  const request: RouteBody = {
    routePoints: coordinates.map(positionToLatLng),
  };
  const response = await getBus(request);

  if (response.data.code === 'NoSegment') {
    throw new MapMatchingNoSegmentError(response.data.message);
  }

  return response.data as BusRouteResponse;
};
