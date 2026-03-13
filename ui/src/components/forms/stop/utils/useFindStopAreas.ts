import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  ReusableComponentsVehicleModeEnum,
  useFindStopAreasByNamesQuery,
} from '../../../../generated/graphql';
import { parseVehicleMode } from '../../../../utils';
import { StopModalStopAreaFormSchema } from '../types';
import { parseStopFormStopAreaInfo } from './parseStopFormStopAreaInfo';

const GQL_STOP_FORM_STOP_AREA_INFO = gql`
  fragment StopFormStopAreaInfo on stops_database_stop_place_newest_version {
    id
    netexId: netex_id
    privateCode: private_code_value
    transportMode: transport_mode

    validityStart: validity_start
    validityEnd: validity_end

    nameValue: name_value
    nameLang: name_lang

    alternativeNames: stop_place_alternative_names {
      name: alternative_name {
        type: name_type
        value: name_value
        lang: name_lang
      }
    }
  }
`;

const GQL_FIND_STOP_AREA_BY_NAMES = gql`
  query FindStopAreasByNames($query: String!) {
    stops_database {
      areas: stops_database_stop_place_newest_version(
        where: {
          _or: [
            { name_value: { _ilike: $query } }
            {
              stop_place_alternative_names: {
                alternative_name: { name_value: { _ilike: $query } }
              }
            }
            { private_code_value: { _ilike: $query } }
          ]
        }
      ) {
        ...StopFormStopAreaInfo
      }
    }
  }
`;

const emptyList: ReadonlyArray<StopModalStopAreaFormSchema> = [];

export function useFindStopAreas(
  rawQuery: string,
  vehicleMode?: ReusableComponentsVehicleModeEnum | null,
) {
  const query = rawQuery.replaceAll('*', '%');
  const { data, ...rest } = useFindStopAreasByNamesQuery({
    variables: { query: `${query}%` },
    skip: !query,
  });

  const rawAreas = data?.stops_database?.areas;

  const filteredRawAreas = useMemo(
    () =>
      (rawAreas ?? []).filter((area) => {
        if (!vehicleMode) {
          return true;
        }

        return parseVehicleMode(area.transportMode) === vehicleMode;
      }),
    [rawAreas, vehicleMode],
  );

  const areas: ReadonlyArray<StopModalStopAreaFormSchema> = useMemo(
    () => compact(filteredRawAreas.map(parseStopFormStopAreaInfo)),
    [filteredRawAreas],
  );

  return { ...rest, areas: query ? areas : emptyList };
}
