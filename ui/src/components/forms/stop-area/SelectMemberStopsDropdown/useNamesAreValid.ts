import { gql } from '@apollo/client';
import noop from 'lodash/noop';
import uniqBy from 'lodash/uniqBy';
import {
  StopAreaNameInfoFragment as StopAreaNameInfo,
  StopPlaceNameInfoFragment as StopPlaceNameInfo,
  useResolveMemberStopNamesQuery,
  useResolveStopAreaAndMemberStopNamesQuery,
  useResolveStopAreaNamesQuery,
} from '../../../../generated/graphql';
import { log } from '../../../../utils';

const GQL_RESOLVE_MEMBER_STOP_NAMES = gql`
  query ResolveMemberStopNames($stopAreaId: String!) {
    stops_database {
      stops: stops_database_stop_place_newest_version(
        where: {
          group_of_stop_places_members: {
            group_of_stop_place: { netex_id: { _eq: $stopAreaId } }
          }
        }
      ) {
        ...StopPlaceNameInfo
      }
    }
  }
`;

const GQL_RESOLVE_STOP_AREA_NAMES = gql`
  query ResolveStopAreaNames($stopAreaId: String!) {
    stops_database {
      stopArea: stops_database_group_of_stop_places_newest_version(
        where: { netex_id: { _eq: $stopAreaId } }
      ) {
        ...StopAreaNameInfo
      }
    }
  }
`;

const GQL_RESOLVE_STOP_AREA_AND_MEMBER_STOP_NAMES = gql`
  query ResolveStopAreaAndMemberStopNames(
    $stopAreaId: String!
    $memberStopIds: [String!]!
  ) {
    stops_database {
      stopArea: stops_database_group_of_stop_places_newest_version(
        where: { netex_id: { _eq: $stopAreaId } }
      ) {
        ...StopAreaNameInfo
      }

      stops: stops_database_stop_place_newest_version(
        where: { netex_id: { _in: $memberStopIds } }
      ) {
        ...StopPlaceNameInfo
      }
    }
  }
`;

const GQL_FRAGMENTS = gql`
  fragment StopAreaNameInfo on stops_database_group_of_stop_places_newest_version {
    id

    # Name
    nameLang: description_lang
    nameValue: description_value

    # Translations
    alternativeNamesJoinTable: group_of_stop_places_alternative_names {
      alternative_names_id

      alternative_name {
        ...AlternativeNameInfo
      }
    }
  }

  fragment StopPlaceNameInfo on stops_database_stop_place_newest_version {
    id

    # Name
    nameLang: name_lang
    nameValue: name_value

    # Translations
    alternativeNamesJoinTable: stop_place_alternative_names {
      alternative_names_id

      alternative_name {
        ...AlternativeNameInfo
      }
    }
  }

  fragment AlternativeNameInfo on stops_database_alternative_name {
    id

    type: name_type
    lang: name_lang
    value: name_value
  }
`;

export type TypedName = {
  readonly lang?: string | null;
  readonly type?: string | null;
  readonly value?: string | null;
};

const typesToConsider: ReadonlyArray<string> = ['TRANSLATION', 'ALIAS'];

/**
 * Aggregates (concatenates) all names of an entity in specific order.
 *
 * Allows for easy comparison between different entities, without having
 * to loop through all the names individually, and accounting for missing
 * or extra names.
 *
 * @param names list of names to aggregate
 */
function aggregateNames(names: ReadonlyArray<TypedName>): string {
  return names
    .filter((name) => typesToConsider.includes(name.type as string))
    .map(({ lang, type, value }) => `${lang}|${type}|${value}`)
    .toSorted() // Sorts by lang & type
    .join('\n');
}

/**
 * Aggregates DB entity's names with {@link aggregateNames}
 *
 * @param entity a raw named DB entity
 * @param nameOverrides overrides for DB names
 */
function aggregateDbEntityNames(
  entity: StopPlaceNameInfo | StopAreaNameInfo,
  nameOverrides: ReadonlyArray<TypedName> = [],
): string {
  const rawNameList: ReadonlyArray<TypedName> = [
    // Start with overrides so that they get picked up by uniqBy
    ...nameOverrides,

    {
      lang: entity.nameLang,
      type: 'TRANSLATION',
      value: entity.nameValue,
    },
    ...entity.alternativeNamesJoinTable.map((it) => it.alternative_name),
  ];

  // Deduplicate overrides
  const deduped = uniqBy(rawNameList, ({ lang, type }) => `${lang}${type}`);

  return aggregateNames(deduped);
}

/**
 * Are all items in the array equal according to {@link Object.is}.
 *
 * Empty and single item lists are considered to have same items.
 *
 * @param items list of items
 */
function allSame<T>(items: ReadonlyArray<T>): boolean {
  if (items.length < 2) {
    return true;
  }

  const expected = items[0];
  return items.every((item) => Object.is(item, expected));
}

/**
 * Do all of listed Stops have the same names.
 *
 * @param memberStops list of Member Stops
 * @returns null if the names do not match or the shared aggregated name
 */
function validateMemberStopsAreConsistent(
  memberStops: ReadonlyArray<StopPlaceNameInfo>,
): string | null {
  if (memberStops.length === 0) {
    return null;
  }

  const memberStopNames = memberStops.map((stop) =>
    aggregateDbEntityNames(stop),
  );
  return allSame(memberStopNames) ? memberStopNames[0] : null;
}

export type AreNamesConsistentResult = {
  readonly loading: boolean;
  readonly consistent: boolean;
  readonly error: unknown;
  readonly refetch: () => void;
};

/**
 * Do the names of the Stop Area and Member Stops match "as stored in DB".
 *
 * New Stop Area creation is a special case:
 * It is assumed that all the stops being added into the new Stop Area,
 * have a full set of names set on them (long, fin, swe).
 * But the new Stop Area modal, only has a single input field for the Finnish
 * long name. Thus, the names cannot match, and we do not need to make a DB
 * query, instead we just return true if no stops have been selected and false
 * if at least one stop is selected.
 *
 * But when later editing a Stop Area the DB is checked for the names of the
 * selected stops and the names of the Stop Area. If all Stops have the same
 * names and that shared name matches that of the Stop Area → Return true.
 *
 * Used when editing Member Stop list, possibly together with Stop Area's names.
 *
 * @param stopAreaId null when creating a new Stop Area, Netex ID if editing an existing one
 * @param memberStopIds list of selected Member Stop Netext IDs
 * @param stopAreaNameOverrides
 * @returns true if all the names match
 */
export function useAreNamesConsistent(
  stopAreaId: string | null,
  memberStopIds: ReadonlyArray<string>,
  stopAreaNameOverrides: ReadonlyArray<TypedName>,
): AreNamesConsistentResult {
  const { data, error, loading, refetch } =
    useResolveStopAreaAndMemberStopNamesQuery({
      variables: {
        stopAreaId: stopAreaId as string,
        memberStopIds: memberStopIds as string[],
      },
      // Fetch on mount
      fetchPolicy: 'network-only',
      // Don't refetch when toggling stops back and forth.
      nextFetchPolicy: 'cache-first',
      skip: stopAreaId === null,
    });

  if (stopAreaId === null) {
    const consistent = memberStopIds.length === 0;
    return { consistent, loading: false, error: null, refetch: noop };
  }

  const stopArea = data?.stops_database?.stopArea.at(0);
  const stopAreaNames = stopArea
    ? aggregateDbEntityNames(stopArea, stopAreaNameOverrides)
    : '';

  const memberStops = data?.stops_database?.stops ?? [];
  const memberStopNames = validateMemberStopsAreConsistent(memberStops);

  const consistent = stopAreaNames === memberStopNames;
  return {
    consistent,
    loading,
    error,
    refetch: () => {
      refetch().catch(log.warn);
    },
  };
}

/**
 * Do the existing Member Stops have a same name as the Stop Area being edited.
 *
 * Used when editing Stop Area's names, without being able to change the list
 * of Member Stops.
 *
 * @param stopAreaId Netex ID of the Stop Area being edited
 * @param stopAreaNames list of Stop Area's names as they are in the form
 */
export function useAreStopNamesConsistentWithStopArea(
  stopAreaId: string,
  stopAreaNames: ReadonlyArray<TypedName>,
): AreNamesConsistentResult {
  const { data, error, loading, refetch } = useResolveMemberStopNamesQuery({
    variables: { stopAreaId },
    fetchPolicy: 'network-only', // Fetch on mount
    nextFetchPolicy: 'cache-first', // Query params are stable
  });

  const expectedNames = aggregateNames(stopAreaNames);
  const memberStops = data?.stops_database?.stops ?? [];
  const memberStopNames = validateMemberStopsAreConsistent(memberStops);

  const consistent = expectedNames === memberStopNames;
  return {
    consistent,
    loading,
    error,
    refetch: () => {
      refetch().catch(log.warn);
    },
  };
}

/**
 * Does the Stop Area this Stop, being edited, belongs to have the same names.
 *
 * Used when editing Stop's names.
 *
 * If the Stop does not belong to a Stop Area (stopAreaId = null) then
 * the names are considered to be consistent.
 *
 * @param stopAreaId Netex ID of the Stop Area this Stop belongs to
 * @param stopNames list of Stop's names as they are in the form
 */
export function useAreStopAreaNamesConsistentWithStops(
  stopAreaId: string | null,
  stopNames: ReadonlyArray<TypedName>,
): AreNamesConsistentResult {
  const { data, error, loading, refetch } = useResolveStopAreaNamesQuery({
    variables: { stopAreaId: stopAreaId as string },
    fetchPolicy: 'network-only', // Fetch on mount
    nextFetchPolicy: 'cache-first', // Query params are stable
    skip: stopAreaId === null,
  });

  if (stopAreaId === null) {
    return { consistent: true, loading: false, error: null, refetch: noop };
  }

  const expectedNames = aggregateNames(stopNames);
  const stopArea = data?.stops_database?.stopArea.at(0);
  const stopAreaNames = stopArea ? aggregateDbEntityNames(stopArea) : null;

  const consistent = expectedNames === stopAreaNames;
  return {
    consistent,
    loading,
    error,
    refetch: () => {
      refetch().catch(log.warn);
    },
  };
}
