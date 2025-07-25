import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import {
  StopVersionInfoFragment,
  useGetQuayVersionsQuery,
} from '../../../../../generated/graphql';
import { parseDate } from '../../../../../time';
import { Priority } from '../../../../../types/enums';
import {
  getGeometryPoint,
  numberEnumValues,
  requireValue,
} from '../../../../../utils';
import { StopVersion, StopVersionStatus } from '../types';

const GQL_GET_QUAY_VERSIONS = gql`
  query GetQuayVersions($publicCode: String!) {
    stops_database {
      quays: stops_database_quay_newest_version(
        where: { public_code: { _eq: $publicCode } }
        order_by: [{ validity_start: asc }, { priority: asc }]
      ) {
        ...StopVersionInfo
      }
    }
  }

  fragment StopVersionInfo on stops_database_quay_newest_version {
    id
    netex_id

    stop_place {
      id
      netex_id
      name_value
    }

    validity_start
    validity_end
    priority

    public_code

    centroid

    created
    changed
    changed_by
    version_comment
  }
`;

const knownPriorityNumbers: ReadonlyArray<number> = numberEnumValues(Priority);

function parsePriority(prioStr: string | null | undefined): Priority {
  const prioNumber = Number(prioStr);
  return knownPriorityNumbers.includes(prioNumber)
    ? (prioNumber as Priority)
    : Priority.Standard;
}

function mapPriorityToStopVersionStatus(priority: Priority): StopVersionStatus {
  switch (priority) {
    case Priority.Draft:
      return StopVersionStatus.DRAFT;
    case Priority.Temporary:
      return StopVersionStatus.TEMPORARY;
    default:
      return StopVersionStatus.STANDARD;
  }
}

function mapQuayToStopVersionInfoItem(
  rawQuay: StopVersionInfoFragment,
  activeVersionId: number | null,
): StopVersion {
  const priority = parsePriority(rawQuay.priority);
  const status =
    rawQuay.id === activeVersionId
      ? StopVersionStatus.ACTIVE
      : mapPriorityToStopVersionStatus(priority);

  return {
    id: rawQuay.id,
    netex_id: requireValue(rawQuay.netex_id),
    public_code: requireValue(rawQuay.public_code),
    stop_place_netex_id: requireValue(rawQuay.stop_place?.netex_id),
    stop_place_name: requireValue(rawQuay.stop_place?.name_value),
    validity_start: requireValue(parseDate(rawQuay.validity_start)),
    validity_end: parseDate(rawQuay.validity_end) ?? null,
    priority,
    status,
    location: requireValue(getGeometryPoint(rawQuay.centroid)),
    changed: requireValue(parseDate(rawQuay.changed ?? rawQuay.created)),
    changed_by: rawQuay.changed_by ?? '',
    version_comment: rawQuay.version_comment ?? '',
  };
}

function resolveActiveVersionId(
  rawQuays: ReadonlyArray<StopVersionInfoFragment>,
): number | null {
  const today = DateTime.now().toISODate();

  // prettier-ignore
  const quay = rawQuays.findLast((rawQuay) =>
    // Is Standard or Temporary
    (Number(rawQuay.priority) < Priority.Draft) &&
    // Started before or at today
    (rawQuay.validity_start && rawQuay.validity_start <= today) &&
    // Has not ended yet
    (!rawQuay.validity_end || rawQuay.validity_end >= today)
  );

  return quay?.id ?? null;
}

type GetStopVersionsLoading = {
  readonly loading: true;
  readonly stopVersions: null;
};

type GetStopVersionsLoaded = {
  readonly loading: false;
  readonly stopVersions: ReadonlyArray<StopVersion>;
};

export function useGetStopVersions(
  publicCode: string,
): GetStopVersionsLoading | GetStopVersionsLoaded {
  const { data, loading } = useGetQuayVersionsQuery({
    variables: { publicCode },
  });

  const rawQuays = data?.stops_database?.quays;
  const stopVersions = useMemo(() => {
    if (!rawQuays) {
      return [];
    }

    const activeVersionId = resolveActiveVersionId(rawQuays);
    return rawQuays.map((rawQuay) =>
      mapQuayToStopVersionInfoItem(rawQuay, activeVersionId),
    );
  }, [rawQuays]);

  if (loading) {
    return { loading: true, stopVersions: null };
  }

  return { loading: false, stopVersions };
}
