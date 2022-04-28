import { useTranslation } from 'react-i18next';
import { FormState } from '../components/forms/line/LineForm';
import {
  InsertLineOneMutationVariables,
  LocalizationLanguageEnum,
  ReusableComponentsVehicleModeEnum,
  RouteLine,
  RouteLineInsertInput,
  RouteLineSetInput,
  RouteTypeOfLineEnum,
  useInsertLineOneMutation,
} from '../generated/graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  showDangerToastWithError,
} from '../utils';
import {
  LocalizedText,
  LocalizedTextMutationInputs,
  useUpsertLocalizedText,
} from './localization';
import { useCheckValidityAndPriorityConflicts } from './useCheckValidityAndPriorityConflicts';

interface CreateParams {
  form: FormState;
}
interface CreateChanges {
  input: RouteLineInsertInput;
  localizedTextsUpsertInput: LocalizedTextMutationInputs;
  conflicts?: RouteLine[];
}

export const mapFormToInput = (
  state: FormState,
): RouteLineSetInput | RouteLineInsertInput => {
  const input = {
    label: state.label,
    name_i18n: state.finnishName,
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

export const mapFormToLocalizedTexts = (state: FormState) => {
  const localizedTexts: LocalizedText[] = [
    {
      entityId: state.lineId,
      languageCode: LocalizationLanguageEnum.FiFi,
      attributeName: 'line_name',
      localizedText: state.finnishName,
    },
    {
      entityId: state.lineId,
      languageCode: LocalizationLanguageEnum.FiFi,
      attributeName: 'line_short_name',
      localizedText: state.finnishShortName,
    },
    {
      entityId: state.lineId,
      languageCode: LocalizationLanguageEnum.SvFi,
      attributeName: 'line_name',
      localizedText: state.swedishName,
    },
    {
      entityId: state.lineId,
      languageCode: LocalizationLanguageEnum.SvFi,
      attributeName: 'line_short_name',
      localizedText: state.swedishShortName,
    },
  ];
  return localizedTexts;
};

export const useCreateLine = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useInsertLineOneMutation();
  const { getConflictingLines } = useCheckValidityAndPriorityConflicts();
  const { buildUpsertLocalizedTestsInput } = useUpsertLocalizedText();

  const prepareCreate = async ({ form }: CreateParams) => {
    const input = mapFormToInput(form);
    const localizedTexts = mapFormToLocalizedTexts(form);
    const localizedTextsUpsertInput = await buildUpsertLocalizedTestsInput(
      localizedTexts,
    );
    const conflicts = await getConflictingLines({
      label: form.label,
      priority: form.priority,
      // this form value always exists
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validityStart: input.validity_start!,
      validityEnd: input.validity_end || undefined,
    });

    const changes: CreateChanges = {
      input,
      localizedTextsUpsertInput,
      conflicts,
    };

    return changes;
  };

  const mapCreateChangesToVariables = (changes: CreateChanges) => {
    const { toUpsert: data, onConflict } = changes.localizedTextsUpsertInput;
    const variables: InsertLineOneMutationVariables = {
      line: {
        ...changes.input,
        localized_texts: {
          data,
          on_conflict: onConflict,
        },
      },
    };
    return variables;
  };

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
