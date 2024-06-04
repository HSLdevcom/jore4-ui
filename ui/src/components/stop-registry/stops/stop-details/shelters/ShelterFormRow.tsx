import { t } from 'i18next';
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
import { SheltersFormState } from './schema';

const testIds = {
  shelterType: 'ShelterFormRow::shelterType',
  shelterElectricity: 'ShelterFormRow::shelterElectricity',
  shelterLighting: 'ShelterFormRow::shelterLighting',
  shelterCondition: 'ShelterFormRow::shelterCondition',
  timetableCabinets: 'ShelterFormRow::timetableCabinets',
  trashCan: 'ShelterFormRow::trashCan',
  shelterHasDisplay: 'ShelterFormRow::shelterHasDisplay',
  bicycleParking: 'ShelterFormRow::bicycleParking',
  leaningRail: 'ShelterFormRow::leaningRail',
  outsideBench: 'ShelterFormRow::outsideBench',
  shelterFasciaBoardTaping: 'ShelterFormRow::shelterFasciaBoardTaping',
};

interface Props {
  index: number;
}

export const ShelterFormRow = ({ index }: Props): JSX.Element => {
  return (
    <Column className="space-y-4">
      <Row className="flex-wrap items-end gap-4 lg:flex-nowrap">
        <InputField<SheltersFormState>
          translationPrefix="stopDetails"
          fieldPath={`shelters.${index}.shelterType`}
          testId={testIds.shelterType}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <EnumDropdown<StopRegistryShelterType>
              enumType={StopRegistryShelterType}
              placeholder={t('unknown')}
              uiNameMapper={mapStopRegistryShelterTypeEnumToUiName}
              includeNullOption
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
              uiNameMapper={mapStopRegistryShelterElectricityEnumToUiName}
              includeNullOption
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
              uiNameMapper={mapStopRegistryShelterConditionEnumToUiName}
              includeNullOption
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
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
      </Row>
    </Column>
  );
};
