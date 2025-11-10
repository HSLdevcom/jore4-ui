import { useCallback, useMemo } from 'react';
import {
  FieldPathByValue,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../../../../i18n';
import { mapInfoSpotPurposeToUiName } from '../../../../../../i18n/uiNameMappings';
import { Column } from '../../../../../../layoutComponents';
import { InputField, InputLabel } from '../../../../../forms/common';
import { useGetInfoSpotPurposes } from '../queries/useGetInfoSpotPurposes';
import { InfoSpotPurposeState } from '../types';
import { InfoSpotPurposeEnum } from '../types/InfoSpotPurpose';
import { PurposeOption, PurposeSelector } from './PurposeSelector';

const testIds = {
  selector: 'InfoSpotFormFields::purpose',
  customInput: 'InfoSpotFormFields::purpose::customInput',
};

type PurposeFormFragmentProps<FormState extends FieldValues> = {
  readonly purposeStatePath: FieldPathByValue<FormState, InfoSpotPurposeState>;
  readonly titlePath: TranslationKey;
  readonly disabled?: boolean;
};

export const PurposeFormFragment = <FormState extends FieldValues>({
  purposeStatePath,
  titlePath,
  disabled,
}: PurposeFormFragmentProps<FormState>) => {
  const { setValue, watch } = useFormContext<FormState>();
  const { t } = useTranslation();
  const { customPurposes, loading } = useGetInfoSpotPurposes();
  const purposeState = watch(purposeStatePath);

  const options = useMemo<ReadonlyArray<PurposeOption>>(() => {
    const enumOptions: PurposeOption[] = Object.values(InfoSpotPurposeEnum)
      .filter((enumValue) => enumValue !== InfoSpotPurposeEnum.OTHER)
      .map((enumValue) => ({
        purposeType: enumValue,
        customPurpose: null,
        displayName: mapInfoSpotPurposeToUiName(t, enumValue),
      }));

    const customOptions: PurposeOption[] = customPurposes.map((custom) => ({
      purposeType: InfoSpotPurposeEnum.OTHER,
      customPurpose: custom,
      displayName: custom,
    }));

    const enterNewOption: PurposeOption = {
      purposeType: InfoSpotPurposeEnum.OTHER,
      customPurpose: '',
      displayName: t('stopDetails.infoSpots.purposes.other'),
    };

    return [...enumOptions, ...customOptions, enterNewOption];
  }, [customPurposes, t]);

  const selectedOption = useMemo<PurposeOption>(() => {
    if (!purposeState) {
      return options[0];
    }

    return (
      options.find(
        (opt) =>
          opt.purposeType === purposeState.purposeType &&
          opt.customPurpose === purposeState.customPurpose,
      ) ?? options[0]
    );
  }, [purposeState, options]);

  const showCustomInput =
    selectedOption.purposeType === InfoSpotPurposeEnum.OTHER &&
    selectedOption.customPurpose === '';

  const onPurposeChanged = useCallback(
    (selectedPurpose: PurposeOption) => {
      setValue(
        purposeStatePath,
        {
          purposeType: selectedPurpose.purposeType,
          customPurpose: selectedPurpose.customPurpose,
        } as PathValue<
          FormState,
          FieldPathByValue<FormState, InfoSpotPurposeState>
        >,
        {
          shouldTouch: true,
          shouldDirty: true,
        },
      );
    },
    [setValue, purposeStatePath],
  );

  return (
    <>
      <Column>
        <InputLabel<FormState>
          fieldPath={`${purposeStatePath}.purposeType` as Path<FormState>}
          translationPrefix="stopDetails"
          customTitlePath={titlePath}
        />
        <PurposeSelector
          className="w-48"
          disabled={!loading && disabled}
          id={`stopDetails.${purposeStatePath}.purposeType`}
          testId={testIds.selector}
          options={options}
          selectedItem={selectedOption}
          onChange={onPurposeChanged}
        />
      </Column>
      {showCustomInput && (
        <InputField<FormState>
          inputClassName="w-48"
          disabled={disabled}
          fieldPath={`${purposeStatePath}.customPurpose` as Path<FormState>}
          translationPrefix="stopDetails"
          customTitlePath="stopDetails.infoSpots.purposes.other"
          testId={testIds.customInput}
          type="text"
        />
      )}
    </>
  );
};
