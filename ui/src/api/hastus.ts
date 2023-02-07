import axios from 'axios';
import { DateTime } from 'luxon';
import { Priority } from '../types/enums';

interface CommonExportParams {
  readonly labels: string[];
  readonly priority: Priority;
}

interface ExportBody extends CommonExportParams {
  readonly observationDate: string;
}

interface ExportParams extends CommonExportParams {
  readonly observationDate: DateTime;
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

export const exportRoutesToHastus = async ({
  labels,
  priority,
  observationDate,
}: ExportParams) => {
  const request: ExportBody = {
    labels,
    priority,
    observationDate: observationDate.toISODate(),
  };
  const response = await exportRoutes(request);

  return response;
};
