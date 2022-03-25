import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useListChangingRoutesQuery,
  useListOwnLinesQuery,
} from '../../generated/graphql';
import {
  mapListChangingRoutesResult,
  mapListOwnLinesResult,
} from '../../graphql';
import { LinesList } from './LinesList'; // eslint-disable-line import/no-cycle
import { RoutesList } from './RoutesList'; // eslint-disable-line import/no-cycle

export const RoutesAndLinesLists = (): JSX.Element => {
  const { t } = useTranslation();
  const changingRoutesResult = useListChangingRoutesQuery();
  const changingRoutes = mapListChangingRoutesResult(changingRoutesResult);

  const ownLinesResult = useListOwnLinesQuery();
  const ownLines = mapListOwnLinesResult(ownLinesResult);

  return (
    <div>
      <h2 className="text-bold mb-14 mt-12 text-4xl">
        {t('routes.changingRoutes')}
      </h2>
      <RoutesList routes={changingRoutes} />
      <h2 className="text-bold mb-14 mt-12 text-4xl">{t('routes.ownLines')}</h2>
      <LinesList lines={ownLines} />
    </div>
  );
};
