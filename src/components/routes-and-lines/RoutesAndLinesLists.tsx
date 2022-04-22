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
import { LinesList } from './LinesList';
import { RoutesList } from './RoutesList';

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
