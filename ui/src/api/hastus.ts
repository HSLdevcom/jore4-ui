import axios from 'axios';
import { DateTime } from 'luxon';
import { roleHeaderMap, userHasuraRole } from '../graphql/auth';
import { Priority } from '../types/enums';

interface CommonExportParams {
  readonly uniqueLabels: string[];
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
    headers: roleHeaderMap(userHasuraRole),
  });

export const exportRoutesToHastus = async ({
  uniqueLabels,
  priority,
  observationDate,
}: ExportParams) => {
  const request: ExportBody = {
    uniqueLabels,
    priority,
    observationDate: observationDate.toISODate(),
  };
  const response = await exportRoutes(request);

  return response;
};

export const sendFileToHastusImporter = (file: File) => {
  return apiClient.post('import', file, {
    headers: {
      ...roleHeaderMap(userHasuraRole),
      'Content-Type': 'text/csv;charset=iso-8859-1',
    },
  });
};
