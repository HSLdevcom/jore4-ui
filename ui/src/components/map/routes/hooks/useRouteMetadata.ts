import { useMemo } from 'react';
import { selectEditedRouteData, useAppSelector } from '../../../../redux';
import { parseDate } from '../../../../time';

export function useRouteMetadata() {
  const editedRouteData = useAppSelector(selectEditedRouteData);

  return useMemo(() => {
    if (!editedRouteData.metaData) {
      return undefined;
    }

    const { validityStart, validityEnd, indefinite, priority } =
      editedRouteData.metaData;
    if (!validityStart || !(validityEnd || indefinite) || !priority) {
      return undefined;
    }

    return {
      validity_start: parseDate(validityStart),
      validity_end: parseDate(validityEnd),
      priority,
    };
  }, [editedRouteData.metaData]);
}
