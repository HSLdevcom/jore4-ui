import axios from 'axios';
import { ReusableComponentsVehicleModeEnum } from '../generated/graphql';
import { MapMatchingNoSegmentError } from '../utils';

type LatLng = {
  readonly lat: number;
  readonly lng: number;
};

type RouteBody = {
  readonly routePoints: ReadonlyArray<LatLng>;
  readonly linkSearchRadius?: number;
};

function positionToLatLng(pos: GeoJSON.Position): LatLng {
  return { lng: pos[0], lat: pos[1] };
}

const apiClient = axios.create({
  baseURL: '/api/mapmatching/api/route/v1',
});

function getBus(coordinates: RouteBody) {
  return apiClient.post('/bus', coordinates);
}

function getTram(coordinates: RouteBody) {
  return apiClient.post('/tram', coordinates);
}

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

async function getRouteByVehicleMode(
  coordinates: ReadonlyArray<GeoJSON.Position>,
  vehicleMode: ReusableComponentsVehicleModeEnum,
) {
  const request: RouteBody = {
    routePoints: coordinates.map(positionToLatLng),
  };
  const response =
    vehicleMode === ReusableComponentsVehicleModeEnum.Tram
      ? await getTram(request)
      : await getBus(request);

  if (response.data.code === 'NoSegment') {
    throw new MapMatchingNoSegmentError(response.data.message);
  }

  return response.data as BusRouteResponse;
}

export async function getBusRoute(
  coordinates: ReadonlyArray<GeoJSON.Position>,
) {
  return getRouteByVehicleMode(
    coordinates,
    ReusableComponentsVehicleModeEnum.Bus,
  );
}

export async function getTramRoute(
  coordinates: ReadonlyArray<GeoJSON.Position>,
) {
  return getRouteByVehicleMode(
    coordinates,
    ReusableComponentsVehicleModeEnum.Tram,
  );
}
