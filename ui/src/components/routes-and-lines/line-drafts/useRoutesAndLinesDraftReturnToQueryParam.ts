import { useUrlQuery } from '../../../hooks';
import { Path, routeDetails } from '../../../router/routeDetails';
import { useReturnToQueryParam } from '../../common/hooks/useReturnToQueryParam';

/**
 * Used to persist the line ID which was used to get to lineDrafts.
 * NOTE: The URL structure might be reworked to have lineDetails by label,
 * not by id. And if this rework is done, then this logic can be simplified.
 */
export const useRoutesAndLinesDraftReturnToQueryParam = () => {
  const { queryParams } = useUrlQuery();
  const { getUrlWithReturnToQueryString, onClose } = useReturnToQueryParam();

  const getDraftsUrl = (lineLabel: string, lineId: UUID) =>
    getUrlWithReturnToQueryString(
      routeDetails[Path.lineDrafts].getLink(lineLabel),
      lineId,
    );

  const onCloseUrl = queryParams.returnTo
    ? routeDetails[Path.lineDetails].getLink(queryParams.returnTo as string)
    : routeDetails[Path.routes].getLink();

  return { getDraftsUrl, onClose: () => onClose(onCloseUrl) };
};
