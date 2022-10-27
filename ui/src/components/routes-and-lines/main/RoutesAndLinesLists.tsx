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

// TODO: This list is currently only for visual purpose and will be so until
// we get user data to our system. Until then, we just list all routes
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

// TODO: This list is currently only for visual purpose and will be so until
// we get user data to our system. Until then, we just list all lines
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

  // Casting to RouteTableRowFragment is safe because route_route contains all
  // route fields and RouteTableRowFragment is a subset of these fields
  const changingRoutes = (changingRoutesResult.data?.route_route ||
    []) as RouteTableRowFragment[];

  // own lines
  const ownLinesResult = useListOwnLinesQuery();

  // Casting to LineTableRowFragment is safe because route_line contains all
  // the line fields and LineTableRowFragment is a subset of these fields
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
