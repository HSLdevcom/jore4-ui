import compact from 'lodash/compact';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import {
  StopWithDetails,
  useEditStopShelters,
  useToggle,
} from '../../../../../hooks';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { ExpandableInfoContainer } from '../layout';
import { ShelterFormRowState, SheltersFormState } from './schema';
import { SheltersForm } from './SheltersForm';
import { SheltersViewList } from './SheltersViewList';

interface Props {
  stop: StopWithDetails;
}

const mapShelterDataToFormState = (
  shelter: ShelterEquipmentDetailsFragment,
): ShelterFormRowState => {
  return {
    id: shelter.id || null,
    shelterType: shelter.shelterType ?? null,
    shelterElectricity: shelter.shelterElectricity ?? null,
    shelterLighting: shelter.shelterLighting ?? null,
    shelterCondition: shelter.shelterCondition ?? null,
    timetableCabinets: shelter.timetableCabinets ?? null,
    trashCan: shelter.trashCan ?? null,
    shelterHasDisplay: shelter.shelterHasDisplay ?? null,
    bicycleParking: shelter.bicycleParking ?? null,
    leaningRail: shelter.leaningRail ?? null,
    outsideBench: shelter.outsideBench ?? null,
    shelterFasciaBoardTaping: shelter.shelterFasciaBoardTaping ?? null,
  };
};

export const SheltersSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { saveStopPlaceShelters, defaultErrorHandler } = useEditStopShelters();
  const [isExpanded, toggleIsExpanded] = useToggle(true);
  const [isEditMode, toggleEditMode] = useToggle(false);
  const onCancel = () => {
    toggleEditMode();
  };
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);

  const onSubmit = async (state: SheltersFormState) => {
    try {
      await saveStopPlaceShelters({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      toggleEditMode();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const shelters: Array<ShelterEquipmentDetailsFragment> = compact(
    stop.stop_place?.quays?.[0]?.placeEquipments?.shelterEquipment || [],
  );

  const shelterFormDefaultValues = {
    shelters: shelters.map(mapShelterDataToFormState),
  };

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={t('stopDetails.shelters.title', { count: shelters.length })}
      testIdPrefix="SheltersSection"
      isEditMode={isEditMode}
      onCancel={onCancel}
      onSave={onSave}
      toggleEditMode={toggleEditMode}
    >
      {isEditMode ? (
        <SheltersForm
          defaultValues={shelterFormDefaultValues}
          ref={formRef}
          onSubmit={onSubmit}
        />
      ) : (
        <SheltersViewList shelters={shelters} />
      )}
    </ExpandableInfoContainer>
  );
};
