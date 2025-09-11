import { gql } from '@apollo/client';
import {
  CreateSubstituteOperatingPeriodMutationVariables,
  useCreateSubstituteOperatingPeriodMutation,
} from '../../../../generated/graphql';
import { MutationHook, extendHook } from '../../../../hooks';
import { mapPeriodsToDayByLineTypes, mapToData } from '../../../../utils';
import { FormState } from '../OccasionalSubstitutePeriod/OccasionalSubstitutePeriodForm.types';

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

type CreateParams = {
  readonly form: FormState;
};

type CreateChanges = {
  readonly input: CreateSubstituteOperatingPeriodMutationVariables;
};

const useCreateSubstituteOperatingPeriodHook: MutationHook<
  CreateParams,
  CreateChanges,
  CreateSubstituteOperatingPeriodMutationVariables
> = () => {
  const [mutateFunction] = useCreateSubstituteOperatingPeriodMutation();

  const executeMutation = (
    variables: CreateSubstituteOperatingPeriodMutationVariables,
  ) =>
    mutateFunction({
      variables,
    });

  const mapSubstituteOperatingPeriodsToMutationVariables = (
    params: CreateParams,
  ): CreateSubstituteOperatingPeriodMutationVariables => {
    const filtered = params.form.periods.filter((p) => !p.periodId);

    const data = filtered.map((p) => {
      return {
        period_name: p.periodName,
        is_preset: p.isPreset,
        substitute_operating_day_by_line_types: {
          data: mapPeriodsToDayByLineTypes(p),
        },
      };
    });
    return mapToData(data);
  };

  const prepare = (params: CreateParams): CreateChanges => {
    const input = mapSubstituteOperatingPeriodsToMutationVariables(params);
    const changes: CreateChanges = {
      input,
    };
    return changes;
  };

  const mapChangesToVariables = (
    changes: CreateChanges,
  ): CreateSubstituteOperatingPeriodMutationVariables => {
    const variables: CreateSubstituteOperatingPeriodMutationVariables = {
      ...changes.input,
    };
    return variables;
  };

  return {
    prepare,
    mapChangesToVariables,
    executeMutation,
  };
};

export const useCreateSubstituteOperatingPeriod = extendHook(
  useCreateSubstituteOperatingPeriodHook,
);
