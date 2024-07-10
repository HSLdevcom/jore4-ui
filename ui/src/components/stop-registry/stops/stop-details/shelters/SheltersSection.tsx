import compact from 'lodash/compact';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import { StopWithDetails, useEditStopShelters } from '../../../../../hooks';
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const onCancel = () => {
    setIsEditMode(false);
  };
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);

  const onSubmit = async (state: SheltersFormState) => {
    try {
      await saveStopPlaceShelters({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      setIsEditMode(false);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const shelters: Array<ShelterEquipmentDetailsFragment> = compact(
    stop.stop_place?.quays?.[0]?.placeEquipments?.shelterEquipment ?? [],
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
    }
  }, [isEditMode, shelters]);

  const editAndAddShelter = () => {
    setIsEditMode(true);
    setIsExpanded(true);
    setShelterCount(shelterFormDefaultValues.shelters.length);
  };

  return (
    <ExpandableInfoContainer
      onToggle={() => setIsExpanded(!isExpanded)}
      isExpanded={showAddNewShelterHeader ? false : isExpanded}
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
      toggleEditMode={() => setIsEditMode(!isEditMode)}
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
