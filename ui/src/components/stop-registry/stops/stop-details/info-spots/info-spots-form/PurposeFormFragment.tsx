import { useCallback } from 'react';
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
import { EnumDropdown } from '../../../../../forms/common/EnumDropdown';
import { InfoSpotPurposeState } from '../types';
import { InfoSpotPurposeEnum } from '../types/InfoSpotPurpose';

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
  const purposeState = watch(purposeStatePath);
  const showCustomInput =
    purposeState?.purposeType === InfoSpotPurposeEnum.OTHER;

  const onPurposeTypeChanged = useCallback(
    (event: { target: { value: string } }) => {
      const selectedPurpose = event.target.value as InfoSpotPurposeEnum;
      const isOther = selectedPurpose === InfoSpotPurposeEnum.OTHER;

      setValue(
        purposeStatePath,
        {
          purposeType: selectedPurpose,
          customPurpose: isOther ? (purposeState?.customPurpose ?? null) : null,
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
    [setValue, purposeStatePath, purposeState?.customPurpose],
  );

  return (
    <>
      <Column>
        <InputLabel<FormState>
          fieldPath={`${purposeStatePath}.purposeType` as Path<FormState>}
          translationPrefix="stopDetails"
          customTitlePath={titlePath}
        />
        <EnumDropdown<InfoSpotPurposeEnum>
          buttonClassName="w-48"
          disabled={disabled}
          id={`stopDetails.${purposeStatePath}.purposeType`}
          testId={testIds.selector}
          enumType={InfoSpotPurposeEnum}
          placeholder={t('stopDetails.infoSpots.purposes.selectPurpose')}
          uiNameMapper={(purpose) => mapInfoSpotPurposeToUiName(t, purpose)}
          value={purposeState?.purposeType}
          onChange={onPurposeTypeChanged}
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
