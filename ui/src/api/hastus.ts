import axios from 'axios';
import { DateTime } from 'luxon';
import { Priority } from '../types/Priority';

interface ExportBody {
  readonly labels: string[];
  readonly priority: Priority;
  readonly observationDate: string;
}

const apiClient = axios.create({
  baseURL: '/api/hastus',
});

const exportRoutes = (payload: ExportBody) =>
  apiClient.post('/export/routes', payload, {
    responseType: 'blob',
    headers: {
      // TODO: Authenticate properly
      'x-hasura-admin-secret': 'hasura',
      'x-hasura-role': 'admin',
    },
  });

export const exportToHastus = async (
  labels: string[],
  priority: Priority,
  observationDate: DateTime,
) => {
  const request: ExportBody = {
    labels,
    priority,
    observationDate: observationDate.toISODate(),
  };
  const response = await exportRoutes(request);

  return response;
};
