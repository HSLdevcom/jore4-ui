import { DateTime } from 'luxon';
import { useState } from 'react';
import { useGetCurrentOrFutureLinesByLabelQuery } from '../../generated/graphql';
import { mapCurrentOrFutureLinesResult } from '../../graphql';
import { mapToSqlLikeValue, mapToVariables } from '../../utils';

export const useChooseLineDropdown = (
  query: string,
  observationDate?: DateTime,
) => {
  const [today] = useState(DateTime.now());
  const linesResult = useGetCurrentOrFutureLinesByLabelQuery(
    mapToVariables({
      label: `${mapToSqlLikeValue(query)}%`,
      date: observationDate || today.toISO(),
    }),
  );
  const lines = mapCurrentOrFutureLinesResult(linesResult);

  return lines;
};
