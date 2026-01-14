import { gql } from '@apollo/client';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useListChangingRoutesQuery,
  useListOwnLinesQuery,
} from '../../../generated/graphql';
import { RouteLineTableRowVariant } from '../../common';
import { LinesList } from '../../common/search/LinesList';
import { RoutesList } from '../../common/search/RoutesList';
import { ListHeader } from './ListHeader';

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

export const RoutesAndLinesLists: FC = () => {
  const { t } = useTranslation();

  // changing routes
  const [showOwnChangingRoutes, setShowOwnChangingRoutes] = useState(true);
  const [changingRoutesLimit, setChangingRoutesLimit] = useState<
    number | undefined
  >(5);
  const changingRoutesResult = useListChangingRoutesQuery({
    variables: { limit: changingRoutesLimit },
  });

  const changingRoutes = changingRoutesResult.data?.route_route ?? [];

  // own lines
  const ownLinesResult = useListOwnLinesQuery();
  const ownLines = ownLinesResult.data?.route_line ?? [];

  return (
    <div>
      <h2 className="mt-12 mb-14">{t('lines.routes')}</h2>
      <ListHeader
        showOwnLines={showOwnChangingRoutes}
        limit={changingRoutesLimit}
        onShowOwnChange={setShowOwnChangingRoutes}
        onLimitChange={setChangingRoutesLimit}
        className="mb-5"
      />
      <RoutesList
        rowVariant={RouteLineTableRowVariant.RoutesAndLines}
        routes={changingRoutes}
      />
      <h2 className="mt-12 mb-14">{t('lines.lines')}</h2>
      <LinesList
        rowVariant={RouteLineTableRowVariant.RoutesAndLines}
        lines={ownLines}
      />
    </div>
  );
};
