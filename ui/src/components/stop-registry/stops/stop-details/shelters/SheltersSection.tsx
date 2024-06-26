import compact from 'lodash/compact';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import {
  StopWithDetails,
  useEditStopShelters,
  useToggle,
} from '../../../../../hooks';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { ExpandableInfoContainer } from '../layout';
import { SheltersFormState, mapShelterDataToFormState } from './schema';
import { SheltersForm } from './SheltersForm';
import { SheltersViewList } from './SheltersViewList';

interface Props {
  stop: StopWithDetails;
}

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
  const [shelterCount, setShelterCount] = useState(shelters.length);

  const shelterFormDefaultValues = {
    shelters: shelters.map(mapShelterDataToFormState),
  };

  const sectionTitle = shelterCount
    ? t('stopDetails.shelters.title', { count: shelterCount })
    : t('stopDetails.shelters.titleNoShelters');

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={sectionTitle}
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
          onShelterCountChanged={setShelterCount}
          onSubmit={onSubmit}
        />
      ) : (
        <SheltersViewList shelters={shelters} />
      )}
    </ExpandableInfoContainer>
  );
};
