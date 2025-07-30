import { gql } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useResolveStopNameLazyQuery } from '../../../generated/graphql';
import { Priority } from '../../../types/enums';
import { log } from '../../../utils';
import { MapStop, MapStopArea } from '../types';

const GQL_RESOLVE_STOP_NAME = gql`
  query ResolveStopName($stopPlaceNetexId: String!) {
    stops_database {
      stops_database_stop_place_newest_version(
        where: { netex_id: { _eq: $stopPlaceNetexId } }
      ) {
        id
        name_value
      }
    }
  }
`;

type ResolveStopNameFn = (stopPlaceNetexId: string) => Promise<string | null>;

function useResolveStopName(
  areas: ReadonlyArray<MapStopArea>,
): ResolveStopNameFn {
  const [resolveStopNameFromDB] = useResolveStopNameLazyQuery();

  return useCallback(
    async (stopPlaceNetexId: string) => {
      const knownName = areas.find(
        (area) => area.netex_id === stopPlaceNetexId,
      )?.name_value;

      if (knownName) {
        return knownName;
      }

      const dbName = await resolveStopNameFromDB({
        variables: { stopPlaceNetexId },
        fetchPolicy: 'cache-first',
      }).then(
        (result) =>
          result.data?.stops_database?.stops_database_stop_place_newest_version.at(
            0,
          )?.name_value,
      );

      return dbName ?? null;
    },
    [areas, resolveStopNameFromDB],
  );
}

/**
 * Wrap pre-translated priority values in a ref, so that ResolveStopHoverTitleFn
 * can stay stable.
 */
function usePriorityMap(): Partial<Readonly<Record<Priority, string>>> {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      [Priority.Draft]: t('priority.draft'),
      [Priority.Temporary]: t('priority.temporary'),
    }),
    [t],
  );
}

type ResolveStopHoverTitleFn = (stop: MapStop) => Promise<string | null>;

export function useResolveStopHoverTitle(
  areas: ReadonlyArray<MapStopArea>,
): ResolveStopHoverTitleFn {
  const resolveStopName = useResolveStopName(areas);
  const priorityMap = usePriorityMap();

  return useCallback(
    async (stop: MapStop): Promise<string | null> => {
      try {
        const code = stop.label;
        const name = await resolveStopName(stop.stop_place_netex_id);
        const priority = priorityMap[stop.priority];

        if (name && priority) {
          return `${code}: ${name} (${priority})`;
        }

        if (name) {
          return `${code}: ${name}`;
        }

        if (priority) {
          return `${code}: (${priority})`;
        }

        return code;
      } catch (error) {
        log.error('Failed to resolve stop name:', error);
        return null;
      }
    },
    [resolveStopName, priorityMap],
  );
}
