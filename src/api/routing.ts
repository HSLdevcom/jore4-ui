import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/route/v1',
});

const getDriving = (coordinates: string) =>
  apiClient.get(`/driving/${coordinates}`);

type LngLat = [string, string];
export const getRoute = async (coordinates: LngLat[]) => {
  const response = await getDriving(coordinates.join(';'));
  return response.data;
};
