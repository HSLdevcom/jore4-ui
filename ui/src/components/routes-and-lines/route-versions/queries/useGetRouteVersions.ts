import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import {
  RouteVersionInfoFragment,
  TimetablesRouteDirectionEnum,
  useGetRouteVersionsQuery,
} from '../../../../generated/graphql';
import { GetUserNameById, useGetUserNames } from '../../../../hooks';
import { parseDate } from '../../../../time';
import { Priority } from '../../../../types/enums';
import { requireValue } from '../../../../utils';
import {
  VersionStatus,
  mapPriorityToVersionStatus,
  parsePriority,
} from '../../../common';
import { RouteVersion } from '../types';

const GQL_GET_ROUTE_VERSIONS = gql`
  query GetRouteVersions(
    $label: String!
    $direction: timetables_route_direction_enum!
  ) {
    route_route(
      where: { label: { _eq: $label }, direction: { _eq: $direction } }
      order_by: [{ validity_start: asc }, { priority: asc }]
    ) {
      ...RouteVersionInfo
    }
  }

  fragment RouteVersionInfo on route_route {
    route_id
    label
    direction
    variant
    validity_start
    validity_end
    priority
    version_comment
    name_i18n
    origin_name_i18n
    destination_name_i18n
    unique_label
    on_line_id
    route_shape
    route_line {
      line_id
      label
      primary_vehicle_mode
      change_history(order_by: { changed: desc }) {
        route_id
        changed
        changed_by
      }
    }
  }
`;

function mapRouteToVersionInfoItem(
  rawRoute: RouteVersionInfoFragment,
  activeVersionId: string | null,
  getUserNameById: GetUserNameById,
): RouteVersion {
  const priority = parsePriority(rawRoute.priority);
  const status =
    rawRoute.route_id === activeVersionId
      ? VersionStatus.ACTIVE
      : mapPriorityToVersionStatus(priority);

  // Find the most recent change history entry for this specific route
  const routeChangeHistory = rawRoute.route_line.change_history.find(
    (historyItem) => historyItem.route_id === rawRoute.route_id,
  );

  const lineLabel = rawRoute.route_line.label;
  const routeOrigin =
    (rawRoute.origin_name_i18n as Record<string, string>)?.fi_FI ?? '';
  const routeDestination =
    (rawRoute.destination_name_i18n as Record<string, string>)?.fi_FI ?? '';
  const lineName = `${lineLabel}: ${routeOrigin} - ${routeDestination}`;

  const changedValue = routeChangeHistory?.changed;
  let changedString = '';
  if (typeof changedValue === 'string') {
    changedString = changedValue;
  } else if (changedValue instanceof DateTime) {
    changedString = changedValue.toISO() ?? '';
  }

  return {
    route_id: rawRoute.route_id,
    id: rawRoute.route_id, // alias for compatibility
    label: requireValue(rawRoute.label),
    direction: requireValue(rawRoute.direction),
    variant: rawRoute.variant ?? null,
    validity_start: requireValue(parseDate(rawRoute.validity_start)),
    validity_end: parseDate(rawRoute.validity_end) ?? null,
    priority,
    status,
    version_comment: rawRoute.version_comment ?? '',
    lineName,
    lineLabel,
    changed: changedString,
    changedByUserName: getUserNameById(routeChangeHistory?.changed_by) ?? null,
    route_shape: rawRoute.route_shape,
  };
}

function resolveActiveVersionId(
  rawRoutes: ReadonlyArray<RouteVersionInfoFragment>,
): string | null {
  const today = DateTime.now().toISODate();

  const route = rawRoutes.findLast((rawRoute) => {
    const validityStart =
      typeof rawRoute.validity_start === 'string'
        ? rawRoute.validity_start
        : rawRoute.validity_start?.toISODate();
    const validityEnd =
      typeof rawRoute.validity_end === 'string'
        ? rawRoute.validity_end
        : rawRoute.validity_end?.toISODate();

    return (
      rawRoute.priority < Priority.Draft &&
      validityStart &&
      validityStart <= today &&
      (!validityEnd || validityEnd >= today)
    );
  });

  return route?.route_id ?? null;
}

export type UseGetRouteVersionsResult = {
  readonly loading: boolean;
  readonly routeVersions: ReadonlyArray<RouteVersion>;
  readonly lineName?: string;
};

export function useGetRouteVersions(
  label: string,
  direction: TimetablesRouteDirectionEnum,
): UseGetRouteVersionsResult {
  const { getUserNameById } = useGetUserNames();

  const result = useGetRouteVersionsQuery({
    variables: { label, direction },
  });

  const routeVersions = useMemo(() => {
    const rawRoutes = result.data?.route_route ?? [];
    if (rawRoutes.length === 0) {
      return [];
    }

    const activeVersionId = resolveActiveVersionId(rawRoutes);

    return rawRoutes.map((rawRoute) =>
      mapRouteToVersionInfoItem(rawRoute, activeVersionId, getUserNameById),
    );
  }, [result.data, getUserNameById]);

  const lineName = routeVersions[0]?.lineName;

  return {
    loading: result.loading,
    routeVersions,
    lineName,
  };
}
