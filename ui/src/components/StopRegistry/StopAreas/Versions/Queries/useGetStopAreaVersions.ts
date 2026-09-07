import { gql, useApolloClient } from '@apollo/client';
import compact from 'lodash/compact';
import { useCallback, useMemo } from 'react';
import {
  GetStopPlaceVersionsDocument,
  GetStopPlaceVersionsQuery,
  GetStopPlaceVersionsQueryVariables,
  StopAreaVersionInfoFragment,
  useGetStopPlaceVersionsQuery,
} from '../../../../../generated/graphql';
import { parseDate } from '../../../../../time';
import { getGeometryPoint, requireValue } from '../../../../../utils';
import { StopAreaVersion } from '../Types';

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

type GetStopAreaVersionsResultLazy = {
  readonly stopAreaVersions: ReadonlyArray<StopAreaVersion>;
};

export function useGetStopAreaVersionsLazy() {
  const apollo = useApolloClient();

  return useCallback(
    async (privateCode: string): Promise<GetStopAreaVersionsResultLazy> => {
      const { data } = await apollo.query<
        GetStopPlaceVersionsQuery,
        GetStopPlaceVersionsQueryVariables
      >({
        query: GetStopPlaceVersionsDocument,
        variables: { privateCode },
      });

      const rawStopAreas = data.stops_database?.stopAreas;

      return {
        stopAreaVersions: compact(rawStopAreas).map(
          mapRawStopAreaToStopAreaVersion,
        ),
      };
    },
    [apollo],
  );
}
