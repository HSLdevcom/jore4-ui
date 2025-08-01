import { useTranslation } from 'react-i18next';
import { FormState } from '../../components/forms/line/LineForm';
import {
  InsertLineOneMutationVariables,
  LineDefaultFieldsFragment,
  ReusableComponentsVehicleModeEnum,
  RouteLineInsertInput,
  RouteTypeOfLineEnum,
  useInsertLineOneMutation,
} from '../../generated/graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  showDangerToastWithError,
} from '../../utils';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';

type CreateParams = {
  readonly form: FormState;
};
type CreateChanges = {
  readonly input: RouteLineInsertInput;
  readonly conflicts?: ReadonlyArray<LineDefaultFieldsFragment>;
};

export const mapFormToInput = (state: FormState) => {
  const input = {
    label: state.label,
    name_i18n: state.name,
    short_name_i18n: state.shortName,
    primary_vehicle_mode:
      state.primaryVehicleMode as ReusableComponentsVehicleModeEnum,
    priority: state.priority,
    transport_target: state.transportTarget,
    type_of_line: state.typeOfLine as RouteTypeOfLineEnum,
    validity_start: mapDateInputToValidityStart(state.validityStart),
    validity_end: mapDateInputToValidityEnd(
      state.validityEnd,
      state.indefinite,
    ),
  };
  return input;
};

export const useCreateLine = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useInsertLineOneMutation();
  const { getConflictingLines } = useCheckValidityAndPriorityConflicts();

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
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    prepareCreate,
    mapCreateChangesToVariables,
    insertLineMutation: mutateFunction,
    defaultErrorHandler,
  };
};
