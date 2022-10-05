import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useListChangingRoutesQuery,
  useListOwnLinesQuery,
} from '../../../generated/graphql';
import {
  mapListOwnLinesResult,
  mapRouteResultToRoutes,
} from '../../../graphql';
import { LinesList } from './LinesList';
import { ListFooter } from './ListFooter';
import { ListHeader } from './ListHeader';
import { RoutesList } from './RoutesList';

export const RoutesAndLinesLists = (): JSX.Element => {
  const { t } = useTranslation();

  // changing routes
  const [showOwnChangingRoutes, setShowOwnChangingRoutes] =
    React.useState(true);
  const [changingRoutesLimit, setChangingRoutesLimit] = React.useState<
    number | undefined
  >(5);
  const changingRoutesResult = useListChangingRoutesQuery({
    variables: { limit: changingRoutesLimit },
  });
  const changingRoutes = mapRouteResultToRoutes(changingRoutesResult);

  // own lines
  const ownLinesResult = useListOwnLinesQuery();
  const ownLines = mapListOwnLinesResult(ownLinesResult);

  return (
    <div>
      <h2 className="mb-14 mt-12">{t('lines.routes')}</h2>
      <ListHeader
        showOwnLines={showOwnChangingRoutes}
        limit={changingRoutesLimit}
        onShowOwnChange={setShowOwnChangingRoutes}
        onLimitChange={setChangingRoutesLimit}
        className="mb-5"
      />
      <RoutesList routes={changingRoutes} />
      <ListFooter onLimitChange={setChangingRoutesLimit} className="mt-8" />
      <h2 className="mb-14 mt-12">{t('lines.lines')}</h2>
      <LinesList lines={ownLines} />
    </div>
  );
};
