import { gql } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import {
  StopAreaVersionInfoFragment,
  useGetStopPlaceVersionsLazyQuery,
  useGetStopPlaceVersionsQuery,
} from '../../../../../generated/graphql';
import { parseDate } from '../../../../../time';
import { getGeometryPoint, requireValue } from '../../../../../utils';
import { StopAreaVersion } from '../types';

const GQL_GET_STOP_PLACE_VERSIONS = gql`
  query GetStopPlaceVersions($privateCode: String!) {
    stops_database {
      stopAreas: stops_database_stop_place_newest_version(
        where: { private_code_value: { _eq: $privateCode } }
        order_by: [{ validity_start: asc }, { priority: asc }]
      ) {
        ...StopAreaVersionInfo
      }
    }
  }

  fragment StopAreaVersionInfo on stops_database_stop_place_newest_version {
    id
    netex_id
    private_code_type
    private_code_value
    name_value

    validity_start
    validity_end

    centroid

    created
    changed
    changed_by
    version_comment
  }
`;

function mapRawStopAreaToStopAreaVersion(
  rawStopArea: StopAreaVersionInfoFragment,
): StopAreaVersion {
  return {
    id: rawStopArea.id,
    netex_id: requireValue(rawStopArea.netex_id),
    private_code: requireValue(rawStopArea.private_code_value),
    name: rawStopArea.name_value ?? '',

    validity_start: requireValue(parseDate(rawStopArea.validity_start)),
    validity_end: parseDate(rawStopArea.validity_end) ?? null,

    location: requireValue(getGeometryPoint(rawStopArea.centroid)),

    created: requireValue(parseDate(rawStopArea.created)),
    changed: requireValue(parseDate(rawStopArea.changed)),
    changed_by: rawStopArea.changed_by ?? '',
    version_comment: rawStopArea.version_comment ?? '',
  };
}

type GetStopAreaVersionsLoading = {
  readonly loading: true;
  readonly stopAreaVersions: null;
};

type GetStopAreaVersionsLoaded = {
  readonly loading: false;
  readonly stopAreaVersions: ReadonlyArray<StopAreaVersion>;
};

export function useGetStopAreaVersions(
  privateCode: string,
): GetStopAreaVersionsLoading | GetStopAreaVersionsLoaded {
  const { data, loading } = useGetStopPlaceVersionsQuery({
    variables: { privateCode },
    skip: !privateCode,
  });

  const rawStopAreas = data?.stops_database?.stopAreas;

  const stopAreaVersions: ReadonlyArray<StopAreaVersion> = useMemo(() => {
    if (!rawStopAreas) {
      return [];
    }

    return rawStopAreas.map(mapRawStopAreaToStopAreaVersion);
  }, [rawStopAreas]);

  if (loading) {
    return { loading: true, stopAreaVersions: null };
  }

  return { loading: false, stopAreaVersions };
}

export function useGetStopAreaVersionsLazy() {
  const [getStopAreaVersions] = useGetStopPlaceVersionsLazyQuery();

  return useCallback(
    async (privateCode: string): Promise<GetStopAreaVersionsLoaded> => {
      const { data } = await getStopAreaVersions({
        variables: { privateCode },
      });

      const rawStopAreas = data?.stops_database?.stopAreas;

      const stopAreaVersions: ReadonlyArray<StopAreaVersion> = rawStopAreas
        ? rawStopAreas.map(mapRawStopAreaToStopAreaVersion)
        : [];

      return { loading: false, stopAreaVersions };
    },
    [getStopAreaVersions],
  );
}
