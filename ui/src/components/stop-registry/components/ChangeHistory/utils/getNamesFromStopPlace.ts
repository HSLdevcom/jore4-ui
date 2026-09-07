import { gql } from '@apollo/client';
import { StopPlaceAlternativeNamesFragment } from '../../../../../generated/graphql';
import { TodaysName } from '../types';

const GQL_FARGMENT_STOP_PLACE_ALTERNATIVE_NAMES = gql`
  fragment StopPlaceAlternativeNames on stops_database_stop_place_alternative_names {
    stop_place_id
    alternative_names_id
    alternativeName: alternative_name {
      id
      name_value
      name_lang
      name_type
    }
  }
`;

type StopPlaceWithNames = {
  readonly name?: string | null;
  readonly alternativeNames: ReadonlyArray<StopPlaceAlternativeNamesFragment>;
};

export function getNamesFromStopPlace(
  stopPlace: StopPlaceWithNames | null | undefined,
): TodaysName {
  const name = stopPlace?.name ?? null;
  const nameSwe =
    stopPlace?.alternativeNames
      .map((it) => it.alternativeName)
      .find((it) => it.name_lang === 'swe' && it.name_type === 'TRANSLATION')
      ?.name_value ?? null;

  return { name, nameSwe };
}
