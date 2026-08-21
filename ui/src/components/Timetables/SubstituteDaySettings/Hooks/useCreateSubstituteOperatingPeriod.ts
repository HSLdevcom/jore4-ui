import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useCreateSubstituteOperatingPeriodMutation } from '../../../../generated/graphql';
import {
  CommonSubstitutePeriodType,
  PeriodType,
} from '../OccasionalSubstitutePeriod/OccasionalSubstitutePeriodForm.types';
import { mapPeriodsToDayByLineTypes } from '../utils';

const GQL_CREATE_SUBSTITUTE_OPERATING_PERIOD = gql`
  mutation CreateSubstituteOperatingPeriod(
    $data: [timetables_service_calendar_substitute_operating_period_insert_input!]!
  ) {
    timetables {
      timetables_insert_service_calendar_substitute_operating_period(
        objects: $data
      ) {
        returning {
          substitute_operating_period_id
          period_name
          is_preset
          substitute_operating_day_by_line_types {
            begin_time
            end_time
            substitute_day_of_week
            substitute_operating_day_by_line_type_id
            superseded_date
            type_of_line
          }
        }
      }
    }
  }
`;

export function useCreateSubstituteOperatingPeriod() {
  const [mutateFunction] = useCreateSubstituteOperatingPeriodMutation();

  return useCallback(
    (periods: ReadonlyArray<PeriodType | CommonSubstitutePeriodType>) => {
      const data = periods
        .filter((p) => !p.periodId)
        .map((p) => {
          return {
            period_name: p.periodName,
            is_preset: p.isPreset,
            substitute_operating_day_by_line_types: {
              data: mapPeriodsToDayByLineTypes(p),
            },
          };
        });

      return mutateFunction({ variables: { data } });
    },
    [mutateFunction],
  );
}
