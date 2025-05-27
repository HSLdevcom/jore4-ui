import { FC } from 'react';
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
  shelterExternalId: 'ShelterViewCard::shelterExternalId',
};
type ShelterViewCardProps = {
  readonly shelter: ShelterEquipmentDetailsFragment;
};

export const ShelterViewCard: FC<ShelterViewCardProps> = ({ shelter }) => {
  const { t } = useTranslation();

  const shelterType =
    shelter.shelterType &&
    mapStopRegistryShelterTypeEnumToUiName(t, shelter.shelterType);
  const shelterCondition =
    shelter.shelterCondition &&
    mapStopRegistryShelterConditionEnumToUiName(t, shelter.shelterCondition);
  const shelterElectricity =
    shelter.shelterElectricity &&
    mapStopRegistryShelterElectricityEnumToUiName(
      t,
      shelter.shelterElectricity,
    );

  return (
    <div data-testid={testIds.container}>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.shelters.shelterNumber')}
          detail={shelter.shelterNumber}
          testId={testIds.shelterNumber}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.shelterExternalId')}
          detail={shelter.shelterExternalId}
          testId={testIds.shelterExternalId}
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
          detail={optionalBooleanToUiText(t, shelter.shelterLighting)}
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
          detail={optionalBooleanToUiText(t, shelter.trashCan)}
          testId={testIds.trashCan}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.shelterHasDisplay')}
          detail={optionalBooleanToUiText(t, shelter.shelterHasDisplay)}
          testId={testIds.shelterHasDisplay}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.bicycleParking')}
          detail={optionalBooleanToUiText(t, shelter.bicycleParking)}
          testId={testIds.bicycleParking}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.leaningRail')}
          detail={optionalBooleanToUiText(t, shelter.leaningRail)}
          testId={testIds.leaningRail}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.outsideBench')}
          detail={optionalBooleanToUiText(t, shelter.outsideBench)}
          testId={testIds.outsideBench}
        />
        <LabeledDetail
          title={t('stopDetails.shelters.shelterFasciaBoardTaping')}
          detail={optionalBooleanToUiText(t, shelter.shelterFasciaBoardTaping)}
          testId={testIds.shelterFasciaBoardTaping}
        />
      </DetailRow>
    </div>
  );
};
