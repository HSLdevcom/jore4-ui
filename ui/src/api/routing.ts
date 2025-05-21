import axios from 'axios';
import { MapMatchingNoSegmentError } from '../utils';

interface LatLng {
  readonly lat: number;
  readonly lng: number;
}

interface RouteBody {
  readonly routePoints: ReadonlyArray<LatLng>;
  readonly linkSearchRadius?: number;
}

const positionToLatLng = (pos: GeoJSON.Position): LatLng => {
  return { lng: pos[0], lat: pos[1] };
};

const apiClient = axios.create({
  baseURL: '/api/mapmatching/api/route/v1',
});

const getBus = (coordinates: RouteBody) => apiClient.post('/bus', coordinates);

export interface BusRouteResponse {
  code: 'Ok';
  routes: {
    geometry: GeoJSON.LineString;
    weight: number;
    distance: number;
    paths: {
      infrastructureLinkId: number;
      externalLinkRef: {
        infrastructureSource: 'digiroad_r';
        externalLinkId: string;
      };
      geometry: GeoJSON.LineString;
      weight: number;
      distance: number;
      infrastructureLinkName: {
        fi: string;
        sv: string;
      };
      isTraversalForwards: boolean;
    }[];
  }[];
}

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
