import { useTranslation } from 'react-i18next';
import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import {
  mapStopRegistryShelterConditionEnumToUiName,
  mapStopRegistryShelterElectricityEnumToUiName,
  mapStopRegistryShelterTypeEnumToUiName,
} from '../../../../../i18n/uiNameMappings';
import { DetailRow, LabeledDetail } from '../layout';
import { optionalBooleanToUiText } from '../utils';

const testIds = {
  container: 'ShelterViewCard::container',
  shelterNumber: 'ShelterViewCard::shelterNumber',
  shelterType: 'ShelterViewCard::shelterType',
  shelterElectricity: 'ShelterViewCard::shelterElectricity',
  shelterLighting: 'ShelterViewCard::shelterLighting',
  shelterCondition: 'ShelterViewCard::shelterCondition',
  timetableCabinets: 'ShelterViewCard::timetableCabinets',
  trashCan: 'ShelterViewCard::trashCan',
  shelterHasDisplay: 'ShelterViewCard::shelterHasDisplay',
  bicycleParking: 'ShelterViewCard::bicycleParking',
  leaningRail: 'ShelterViewCard::leaningRail',
  outsideBench: 'ShelterViewCard::outsideBench',
  shelterFasciaBoardTaping: 'ShelterViewCard::shelterFasciaBoardTaping',
};
interface Props {
  shelter: ShelterEquipmentDetailsFragment;
}

export const ShelterViewCard = ({ shelter }: Props) => {
  const { t } = useTranslation();

  const shelterType =
    shelter.shelterType &&
    mapStopRegistryShelterTypeEnumToUiName(shelter.shelterType);
  const shelterCondition =
    shelter.shelterCondition &&
    mapStopRegistryShelterConditionEnumToUiName(shelter.shelterCondition);
  const shelterElectricity =
    shelter.shelterElectricity &&
    mapStopRegistryShelterElectricityEnumToUiName(shelter.shelterElectricity);

  return (
    <div data-testid={testIds.container}>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.shelters.shelterNumber')}
          detail={shelter.shelterNumber}
          testId={testIds.shelterNumber}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.shelterType')}
          detail={shelterType}
          testId={testIds.shelterType}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.shelterElectricity')}
          detail={shelterElectricity}
          testId={testIds.shelterElectricity}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.shelterLighting')}
          detail={optionalBooleanToUiText(shelter.shelterLighting)}
          testId={testIds.shelterLighting}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.shelterCondition')}
          detail={shelterCondition}
          testId={testIds.shelterCondition}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.timetableCabinets')}
          detail={shelter.timetableCabinets}
          testId={testIds.timetableCabinets}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.shelters.trashCan')}
          detail={optionalBooleanToUiText(shelter.trashCan)}
          testId={testIds.trashCan}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.shelterHasDisplay')}
          detail={optionalBooleanToUiText(shelter.shelterHasDisplay)}
          testId={testIds.shelterHasDisplay}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.bicycleParking')}
          detail={optionalBooleanToUiText(shelter.bicycleParking)}
          testId={testIds.bicycleParking}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.leaningRail')}
          detail={optionalBooleanToUiText(shelter.leaningRail)}
          testId={testIds.leaningRail}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.outsideBench')}
          detail={optionalBooleanToUiText(shelter.outsideBench)}
          testId={testIds.outsideBench}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.shelterFasciaBoardTaping')}
          detail={optionalBooleanToUiText(shelter.shelterFasciaBoardTaping)}
          testId={testIds.shelterFasciaBoardTaping}
        />
      </DetailRow>
    </div>
  );
};
