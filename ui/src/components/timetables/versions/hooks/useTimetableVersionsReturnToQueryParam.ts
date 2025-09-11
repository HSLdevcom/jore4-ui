import { useUrlQuery } from '../../../../hooks';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { useReturnToQueryParam } from '../../../common/hooks/useReturnToQueryParam';

/**
 * Used to persist the line ID which was used to get to timetable versions.
 * NOTE: The URL structure might be reworked to have timetable by label,
 * not by id. And if this rework is done, then this logic can be simplified.
 */
export const useTimetableVersionsReturnToQueryParam = () => {
  const { queryParams } = useUrlQuery();
  const { getUrlWithReturnToQueryString, onClose } = useReturnToQueryParam();

  const getVersionsUrl = (lineLabel: string, lineId: UUID) =>
    getUrlWithReturnToQueryString(
      routeDetails[Path.lineTimetableVersions].getLink(lineLabel),
      lineId,
    );

  const onCloseUrl = queryParams.returnTo
    ? routeDetails[Path.lineTimetables].getLink(queryParams.returnTo as string)
    : routeDetails[Path.timetables].getLink();

  return { getVersionsUrl, onClose: () => onClose(onCloseUrl) };
};
