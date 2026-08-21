import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  InsertLineOneMutationVariables,
  LineAllFieldsFragment,
  ReusableComponentsVehicleModeEnum,
  RouteLineInsertInput,
  RouteTypeOfLineEnum,
  useInsertLineOneMutation,
} from '../../../../generated/graphql';
import { parseDate } from '../../../../time';
import {
  mapDateInputToValidityEnd,
  showDangerToastWithError,
} from '../../../../utils';
import { FormState } from '../../../forms/line/LineForm';
import { useGetConflictingLines } from '../../Common';

const GQL_INSERT_LINE = gql`
  mutation InsertLineOne($object: route_line_insert_input!) {
    insert_route_line_one(object: $object) {
      ...LineAllFields
    }
  }
`;

type CreateParams = {
  readonly form: FormState;
};
type CreateChanges = {
  readonly input: RouteLineInsertInput;
  readonly conflicts?: ReadonlyArray<LineAllFieldsFragment>;
};

export function mapFormToInput(state: FormState): RouteLineInsertInput {
  return {
    label: state.label,
    description: state.description,
    name_i18n: state.name,
    short_name_i18n: state.shortName,
    primary_vehicle_mode:
      state.primaryVehicleMode as ReusableComponentsVehicleModeEnum,
    priority: state.priority,
    transport_target: state.transportTarget,
    type_of_line: state.typeOfLine as RouteTypeOfLineEnum,
    validity_start: parseDate(state.validityStart),
    validity_end: mapDateInputToValidityEnd(
      state.validityEnd,
      state.indefinite,
    ),
    version_comment: state.versionComment?.trim() ?? null,
  };
}

export function useCreateLine() {
  const { t } = useTranslation();
  const [mutateFunction] = useInsertLineOneMutation();
  const getConflictingLines = useGetConflictingLines();

  const prepareCreate = async ({ form }: CreateParams) => {
    const input = mapFormToInput(form);
    const conflicts = await getConflictingLines({
      label: form.label,
      priority: form.priority,
      // this form value always exists
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validityStart: input.validity_start!,
      validityEnd: input.validity_end ?? undefined,
    });

    const changes: CreateChanges = {
      input,
      conflicts,
    };

    return changes;
  };

  const mapCreateChangesToVariables = (
    changes: CreateChanges,
  ): InsertLineOneMutationVariables => ({
    object: changes.input,
  });

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(
      t(($) => $.errors.saveFailed),
      err,
    );
  };

  return {
    prepareCreate,
    mapCreateChangesToVariables,
    insertLineMutation: mutateFunction,
    defaultErrorHandler,
  };
}
