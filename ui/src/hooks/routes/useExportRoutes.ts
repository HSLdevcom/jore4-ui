import { exportToHastus } from '../../api/hastus';
import { downloadFile } from '../../utils';
import { useSearchQueryParser } from '../search';
import { useObservationDateQueryParam } from '../urlQuery';

export const useExportRoutes = () => {
  const { observationDate } = useObservationDateQueryParam();
  const { search } = useSearchQueryParser();

  const { priorities } = search;

  // Routes can be exported to Hastus only when there is only 1 priority selected
  const canExport = priorities?.length === 1;

  const exportRoutesToHastus = async (routeLabels: string[]) => {
    const response = await exportToHastus(
      routeLabels,
      priorities[0],
      observationDate,
    );

    downloadFile(
      response.data,
      `jore4-export-${observationDate.toISODate()}.csv`,
    );
  };

  return { canExport, exportRoutesToHastus };
};
