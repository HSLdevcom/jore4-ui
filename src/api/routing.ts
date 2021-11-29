import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/route/v1',
});

const getBus = (coordinates: string) => apiClient.get(`/bus/${coordinates}`);

type LngLat = [string, string];
export const getBusRoute = async (coordinates: LngLat[]) => {
  const response = await getBus(coordinates.join('~'));
  return response.data;
};
