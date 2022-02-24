import { Position } from '@nebula.gl/edit-modes';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/mapmatching/api/route/v1',
});

const getBus = (coordinates: string) => apiClient.get(`/bus/${coordinates}`);

export interface Geometry {
  type: 'LineString';
  coordinates: Position[];
}

export interface BusRouteResponse {
  code: 'Ok';
  routes: {
    geometry: Geometry;
    weight: number;
    distance: number;
    paths: {
      infrastructureLinkId: number;
      externalLinkRef: {
        infrastructureSource: 'digiroad_r';
        externalLinkId: string;
      };
      geometry: Geometry;
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

export const getBusRoute = async (coordinates: Position[]) => {
  const response = await getBus(coordinates.join('~'));
  return response.data as BusRouteResponse;
};
