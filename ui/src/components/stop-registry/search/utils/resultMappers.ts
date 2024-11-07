import {
  StopTableRowFragment,
  StopTableRowStopPlaceFragment,
} from '../../../../generated/graphql';
import { StopSearchRow } from '../types';

const mapResultRowToStopSearchRow = (
  stopPlace: StopTableRowStopPlaceFragment,
) => {
  return {
    ...(stopPlace.scheduled_stop_point_instance as StopTableRowFragment),
    stop_place: {
      netexId: stopPlace.netex_id,
      nameFin: stopPlace.name_value,
      nameSwe: stopPlace.stop_place_alternative_names.find(
        (alternativeName) =>
          alternativeName.alternative_name.name_lang === 'swe' &&
          alternativeName.alternative_name.name_type === 'TRANSLATION',
      )?.alternative_name.name_value,
    },
  };
};

export const mapQueryResultToStopSearchRows = (
  stops: ReadonlyArray<StopTableRowStopPlaceFragment>,
): StopSearchRow[] =>
  stops
    // Filter out stops which do not have a matching stop in routes and lines
    .filter((stop) => !!stop.scheduled_stop_point_instance)
    .map(mapResultRowToStopSearchRow);
