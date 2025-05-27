import { t } from 'i18next';
import { FC, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  StopRegistryShelterCondition,
  StopRegistryShelterElectricity,
  StopRegistryShelterType,
} from '../../../../../generated/graphql';
import {
  mapStopRegistryShelterConditionEnumToUiName,
  mapStopRegistryShelterElectricityEnumToUiName,
  mapStopRegistryShelterTypeEnumToUiName,
} from '../../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../../layoutComponents';
import {
  EnumDropdown,
  InputField,
  NullableBooleanDropdown,
} from '../../../../forms/common';
import { SlimSimpleButton } from '../layout';
import { SheltersFormState } from './schema';

const testIds = {
  shelterNumber: 'ShelterFormFields::shelterNumber',
  shelterType: 'ShelterFormFields::shelterType',
  shelterElectricity: 'ShelterFormFields::shelterElectricity',
  shelterLighting: 'ShelterFormFields::shelterLighting',
  shelterCondition: 'ShelterFormFields::shelterCondition',
  timetableCabinets: 'ShelterFormFields::timetableCabinets',
  trashCan: 'ShelterFormFields::trashCan',
  shelterHasDisplay: 'ShelterFormFields::shelterHasDisplay',
  bicycleParking: 'ShelterFormFields::bicycleParking',
  leaningRail: 'ShelterFormFields::leaningRail',
  outsideBench: 'ShelterFormFields::outsideBench',
  shelterFasciaBoardTaping: 'ShelterFormFields::shelterFasciaBoardTaping',
  shelterExternalId: 'ShelterFormFields::shelterExternalId',
  deleteShelter: 'ShelterFormFields::deleteShelter',
  copyShelter: 'SheltersFormFields::copyShelter',
};

type ShelterFormFieldsProps = {
  readonly index: number;
  readonly onRemove: (index: number) => void;
  readonly onCopy: (shelter: number) => void;
};

export const ShelterFormFields: FC<ShelterFormFieldsProps> = ({
  index,
  onRemove,
  onCopy,
}) => {
  const { register, watch, setValue } = useFormContext<SheltersFormState>();
  const toBeDeleted = watch(`shelters.${index}.toBeDeleted`);
  const allShelters = watch('shelters');
  const currentShelterNumber = watch(`shelters.${index}.shelterNumber`);

  // Suggest a shelter number based on previous numbers
  useEffect(() => {
    if (currentShelterNumber === null) {
      const nextNumber =
        Math.max(
          0,
          ...allShelters.map((shelter) => Number(shelter.shelterNumber)),
        ) + 1;

      setValue(`shelters.${index}.shelterNumber`, nextNumber);
    }
  }, [allShelters, index, currentShelterNumber, setValue]);

  return (
    <Column className="space-y-4">
      <Row className="flex-wrap items-end gap-4 lg:flex-nowrap">
        <InputField<SheltersFormState>
          type="number"
          translationPrefix="stopDetails"
          min={0}
          fieldPath={`shelters.${index}.shelterNumber`}
          inputClassName="w-20"
          testId={testIds.shelterNumber}
          disabled={toBeDeleted}
        />
        <InputField<SheltersFormState>
          type="string"
          translationPrefix="stopDetails"
          fieldPath={`shelters.${index}.shelterExternalId`}
          inputClassName="w-20"
          testId={testIds.shelterExternalId}
          disabled={toBeDeleted}
        />
        <InputField<SheltersFormState>
          translationPrefix="stopDetails"
          fieldPath={`shelters.${index}.shelterType`}
          testId={testIds.shelterType}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <EnumDropdown<StopRegistryShelterType>
              enumType={StopRegistryShelterType}
              placeholder={t('unknown')}
              uiNameMapper={(value) =>
                mapStopRegistryShelterTypeEnumToUiName(t, value)
              }
              buttonClassName="min-w-36"
              includeNullOption
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <InputField<SheltersFormState>
          translationPrefix="stopDetails"
          fieldPath={`shelters.${index}.shelterElectricity`}
          testId={testIds.shelterElectricity}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <EnumDropdown<StopRegistryShelterElectricity>
              enumType={StopRegistryShelterElectricity}
              placeholder={t('unknown')}
              uiNameMapper={(value) =>
                mapStopRegistryShelterElectricityEnumToUiName(t, value)
              }
              buttonClassName="min-w-44"
              includeNullOption
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <InputField<SheltersFormState>
          translationPrefix="stopDetails"
          fieldPath={`shelters.${index}.shelterLighting`}
          testId={testIds.shelterLighting}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <NullableBooleanDropdown
              placeholder={t('unknown')}
              buttonClassName="min-w-32"
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <InputField<SheltersFormState>
          translationPrefix="stopDetails"
          fieldPath={`shelters.${index}.shelterCondition`}
          testId={testIds.shelterCondition}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <EnumDropdown<StopRegistryShelterCondition>
              enumType={StopRegistryShelterCondition}
              placeholder={t('unknown')}
              uiNameMapper={(value) =>
                mapStopRegistryShelterConditionEnumToUiName(t, value)
              }
              includeNullOption
              disabled={toBeDeleted}
              buttonClassName="min-w-32"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <InputField<SheltersFormState>
          type="number"
          translationPrefix="stopDetails"
          min={0}
          fieldPath={`shelters.${index}.timetableCabinets`}
          inputClassName="w-20"
          testId={testIds.timetableCabinets}
          disabled={toBeDeleted}
        />
      </Row>
      <Row className="flex-wrap items-end gap-4 lg:flex-nowrap">
        <InputField<SheltersFormState>
          translationPrefix="stopDetails"
          fieldPath={`shelters.${index}.trashCan`}
          testId={testIds.trashCan}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <NullableBooleanDropdown
              placeholder={t('unknown')}
              buttonClassName="min-w-32"
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <InputField<SheltersFormState>
          translationPrefix="stopDetails"
          fieldPath={`shelters.${index}.shelterHasDisplay`}
          testId={testIds.shelterHasDisplay}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <NullableBooleanDropdown
              placeholder={t('unknown')}
              buttonClassName="min-w-32"
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <InputField<SheltersFormState>
          translationPrefix="stopDetails"
          fieldPath={`shelters.${index}.bicycleParking`}
          testId={testIds.bicycleParking}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <NullableBooleanDropdown
              placeholder={t('unknown')}
              buttonClassName="min-w-32"
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <InputField<SheltersFormState>
          translationPrefix="stopDetails"
          fieldPath={`shelters.${index}.leaningRail`}
          testId={testIds.leaningRail}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <NullableBooleanDropdown
              placeholder={t('unknown')}
              buttonClassName="min-w-32"
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <InputField<SheltersFormState>
          translationPrefix="stopDetails"
          fieldPath={`shelters.${index}.outsideBench`}
          testId={testIds.outsideBench}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <NullableBooleanDropdown
              placeholder={t('unknown')}
              buttonClassName="min-w-32"
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <InputField<SheltersFormState>
          translationPrefix="stopDetails"
          fieldPath={`shelters.${index}.shelterFasciaBoardTaping`}
          className="max-w-40"
          testId={testIds.shelterFasciaBoardTaping}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <NullableBooleanDropdown
              placeholder={t('unknown')}
              buttonClassName="min-w-32"
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
      </Row>
      <input
        type="checkbox"
        hidden
        {...register(`shelters.${index}.toBeDeleted`)}
      />
      <div className="grid auto-cols-max grid-flow-col items-center gap-4">
        <SlimSimpleButton
          testId={testIds.deleteShelter}
          onClick={() => onRemove(index)}
          inverted
        >
          {t(
            toBeDeleted
              ? 'stopDetails.shelters.cancelDeleteShelter'
              : 'stopDetails.shelters.deleteShelter',
          )}
        </SlimSimpleButton>
        <SlimSimpleButton
          testId={testIds.copyShelter}
          onClick={() => onCopy(index)}
          inverted
        >
          {t('stopDetails.shelters.copyShelter')}
        </SlimSimpleButton>
      </div>
    </Column>
  );
};
