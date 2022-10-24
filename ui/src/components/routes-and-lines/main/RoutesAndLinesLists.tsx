import { gql } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineTableRowFragment,
  RouteTableRowFragment,
  useListChangingRoutesQuery,
  useListOwnLinesQuery,
} from '../../../generated/graphql';
import { LinesList } from './LinesList';
import { ListFooter } from './ListFooter';
import { ListHeader } from './ListHeader';
import { RoutesList } from './RoutesList';

// TODO this will list all routes for now
const GQL_LIST_CHANGING_ROUTES = gql`
  query ListChangingRoutes($limit: Int) {
    route_route(
      limit: $limit
      order_by: [{ label: asc }, { validity_start: asc }]
    ) {
      ...route_table_row
    }
  }
`;

// TODO this is just listing all lines for now
const GQL_LIST_OWN_LINES = gql`
  query ListOwnLines($limit: Int = 10) {
    route_line(
      limit: $limit
      order_by: [{ label: asc }, { validity_start: asc }]
    ) {
      ...line_table_row
    }
  }
`;

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
  const changingRoutes = (changingRoutesResult.data?.route_route ||
    []) as RouteTableRowFragment[];

  // own lines
  const ownLinesResult = useListOwnLinesQuery();
  const ownLines = (ownLinesResult.data?.route_line ||
    []) as LineTableRowFragment[];

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
