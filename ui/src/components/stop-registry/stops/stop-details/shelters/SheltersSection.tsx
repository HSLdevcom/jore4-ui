import compact from 'lodash/compact';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import {
  StopWithDetails,
  useEditStopShelters,
  useToggle,
} from '../../../../../hooks';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { ExpandableInfoContainer } from '../layout';
import { EmptyListHeaderButtons } from '../layout/EmptyListHeaderButtons';
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
  if (!shelterFormDefaultValues.shelters.length) {
    shelterFormDefaultValues.shelters.push(mapShelterDataToFormState({}));
  }

  const sectionTitle = shelterCount
    ? t('stopDetails.shelters.title', { count: shelterCount })
    : t('stopDetails.shelters.titleNoShelters');

  const showAddNewShelterHeader = !isEditMode && !shelters.length;
  useEffect(() => {
    if (!isEditMode) {
      setShelterCount(shelters.length);
      // Special case when in view mode with no shelters.
      if (showAddNewShelterHeader && isExpanded) {
        toggleIsExpanded();
      }
    }
  }, [
    isEditMode,
    isExpanded,
    shelters,
    showAddNewShelterHeader,
    toggleIsExpanded,
  ]);

  const editAndAddShelter = () => {
    toggleEditMode();
    setShelterCount(shelterFormDefaultValues.shelters.length);
    toggleIsExpanded();
  };

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      headerButtons={
        showAddNewShelterHeader ? (
          <EmptyListHeaderButtons
            addNewItemText={t('stopDetails.shelters.addShelter')}
            onAddNewItem={editAndAddShelter}
            testIdPrefix="SheltersSection"
          />
        ) : null
      }
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
