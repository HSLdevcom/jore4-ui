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
  InputElement,
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
      <Row className="flex-wrap items-end gap-4">
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
      <Row className="flex-wrap items-end gap-4">
        <label htmlFor="trashCan" className="inline-flex font-normal">
          <InputElement<SheltersFormState>
            type="checkbox"
            id="trashCan"
            fieldPath={`shelters.${index}.trashCan`}
            className="mr-2 h-6 w-6"
            testId={testIds.trashCan}
            disabled={toBeDeleted}
          />
          {t('stopDetails.shelters.trashCan')}
        </label>

        <label htmlFor="shelterHasDisplay" className="inline-flex font-normal">
          <InputElement<SheltersFormState>
            type="checkbox"
            id="shelterHasDisplay"
            fieldPath={`shelters.${index}.shelterHasDisplay`}
            className="mr-2 h-6 w-6"
            testId={testIds.shelterHasDisplay}
            disabled={toBeDeleted}
          />
          {t('stopDetails.shelters.shelterHasDisplay')}
        </label>

        <label htmlFor="bicycleParking" className="inline-flex font-normal">
          <InputElement<SheltersFormState>
            type="checkbox"
            id="bicycleParking"
            fieldPath={`shelters.${index}.bicycleParking`}
            className="mr-2 h-6 w-6"
            testId={testIds.bicycleParking}
            disabled={toBeDeleted}
          />
          {t('stopDetails.shelters.bicycleParking')}
        </label>

        <label htmlFor="leaningRail" className="inline-flex font-normal">
          <InputElement<SheltersFormState>
            type="checkbox"
            id="leaningRail"
            fieldPath={`shelters.${index}.leaningRail`}
            className="mr-2 h-6 w-6"
            testId={testIds.leaningRail}
            disabled={toBeDeleted}
          />
          {t('stopDetails.shelters.leaningRail')}
        </label>

        <label htmlFor="outsideBench" className="inline-flex font-normal">
          <InputElement<SheltersFormState>
            type="checkbox"
            id="outsideBench"
            fieldPath={`shelters.${index}.outsideBench`}
            className="mr-2 h-6 w-6"
            testId={testIds.outsideBench}
            disabled={toBeDeleted}
          />
          {t('stopDetails.shelters.outsideBench')}
        </label>

        <label
          htmlFor="shelterFasciaBoardTaping"
          className="inline-flex font-normal"
        >
          <InputElement<SheltersFormState>
            type="checkbox"
            id="shelterFasciaBoardTaping"
            fieldPath={`shelters.${index}.shelterFasciaBoardTaping`}
            className="mr-2 h-6 w-6"
            testId={testIds.shelterFasciaBoardTaping}
            disabled={toBeDeleted}
          />
          {t('stopDetails.shelters.shelterFasciaBoardTaping')}
        </label>
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
