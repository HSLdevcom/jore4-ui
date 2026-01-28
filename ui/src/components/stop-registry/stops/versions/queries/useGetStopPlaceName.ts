import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  StopRegistryEmbeddableMultilingualString,
  useGetStopPlaceNameQuery,
} from '../../../../../generated/graphql';
import { StopPlaceName } from '../types';

const GQL_GET_STOP_PLACE_NAME = gql`
  query GetStopPlaceName($stopPlaceNetexId: String!) {
    stop_registry {
      stopPlace(id: $stopPlaceNetexId, onlyMonomodalStopPlaces: true) {
        id
        version

        name {
          lang
          value
        }

        alternativeNames {
          nameType
          name {
            lang
            value
          }
        }
      }
    }
  }
`;

function findName(
  names: ReadonlyArray<StopRegistryEmbeddableMultilingualString>,
  lang: string,
): string | null | undefined {
  return names.find((name) => name.lang === lang)?.value;
}

type GetStopPlaceNameLoading = {
  readonly loading: true;
  readonly stopPlaceName: null;
};

type GetStopPlaceNameLoaded = {
  readonly loading: false;
  readonly stopPlaceName: StopPlaceName;
};

export function useGetStopPlaceName(
  stopPlaceNetexId: string | null,
): GetStopPlaceNameLoading | GetStopPlaceNameLoaded {
  const { data, loading } = useGetStopPlaceNameQuery(
    stopPlaceNetexId ? { variables: { stopPlaceNetexId } } : { skip: true },
  );

  const stopPlace = data?.stop_registry?.stopPlace?.at(0);
  const stopPlaceName: StopPlaceName = useMemo(() => {
    if (!stopPlace) {
      return {
        name: '',
        nameSwe: '',
      };
    }

    const names = compact([
      stopPlace.name,
      ...compact(stopPlace.alternativeNames).map((it) => it.name),
    ]);

    return {
      name: findName(names, 'fin') ?? '',
      nameSwe: findName(names, 'swe') ?? '',
    };
  }, [stopPlace]);

  if (loading || !stopPlaceNetexId) {
    return { loading: true, stopPlaceName: null };
  }

  return { loading: false, stopPlaceName };
}
