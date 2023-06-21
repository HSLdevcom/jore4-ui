import { gql } from '@apollo/client';
import { PeriodType } from '../../components/timetables/day-settings/RandomReferenceDay/RandomReferenceDayForm.types';
import {
  CreateSubstituteOperatingPeriodMutationVariables,
  useCreateSubstituteOperatingPeriodMutation,
} from '../../generated/graphql';
import { mapPeriodsToDayByLineTypes } from '../../utils/substituteOperatingPeriod';

export const useCreateSubstituteOperatingPeriod = () => {
  const [mutateFunction] = useCreateSubstituteOperatingPeriodMutation();

  const createSubstituteOperatingPeriodMutation = async (
    variables: CreateSubstituteOperatingPeriodMutationVariables,
  ) => {
    return mutateFunction({
      variables,
    });
  };

  const mapFormStateToCreateVariables = (
    periods: PeriodType[],
  ): CreateSubstituteOperatingPeriodMutationVariables => {
    const data = periods.map((p) => {
      return {
        period_name: p.periodName,
        is_preset: false,
        substitute_operating_day_by_line_types: {
          data: mapPeriodsToDayByLineTypes(p),
        },
      };
    });
    return { data };
  };

  return {
    createSubstituteOperatingPeriodMutation,
    mapFormStateToCreateVariables,
  };
};

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
