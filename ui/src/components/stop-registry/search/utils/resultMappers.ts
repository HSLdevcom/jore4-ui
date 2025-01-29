import {
  StopTableRowFragment,
  StopTableRowQuayFragment,
} from '../../../../generated/graphql';
import { StopSearchRow } from '../types';

const mapResultRowToStopSearchRow = (stopPlace: StopTableRowQuayFragment) => {
  return {
    ...(stopPlace.scheduled_stop_point_instance as StopTableRowFragment),
    quay: {
      netexId: stopPlace.netex_id,
      nameFin: stopPlace.stop_place?.name_value,
      nameSwe: stopPlace.stop_place?.stop_place_alternative_names.find(
        (alternativeName) =>
          alternativeName.alternative_name.name_lang === 'swe' &&
          alternativeName.alternative_name.name_type === 'TRANSLATION',
      )?.alternative_name.name_value,
    },
  };
};

export const mapQueryResultToStopSearchRows = (
  stops: ReadonlyArray<StopTableRowQuayFragment>,
): StopSearchRow[] =>
  stops
    // Filter out stops which do not have a matching stop in routes and lines
    .filter((stop) => !!stop.scheduled_stop_point_instance)
    .map(mapResultRowToStopSearchRow);
