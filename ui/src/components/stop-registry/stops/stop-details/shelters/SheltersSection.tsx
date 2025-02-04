import compact from 'lodash/compact';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import { StopWithDetails, useEditStopShelters } from '../../../../../hooks';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { EmptyListHeaderButtons } from '../layout/EmptyListHeaderButtons';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import { SheltersFormState, mapShelterDataToFormState } from './schema';
import { SheltersForm } from './SheltersForm';
import { SheltersViewList } from './SheltersViewList';

interface Props {
  stop: StopWithDetails;
}

function useShelters(
  stop: StopWithDetails,
): Array<ShelterEquipmentDetailsFragment> {
  return compact(stop.quay?.placeEquipments?.shelterEquipment ?? []);
}

function useShelterFormDefaultValues(
  shelters: ReadonlyArray<ShelterEquipmentDetailsFragment>,
) {
  const shelterFormDefaultValues = {
    shelters: shelters.map(mapShelterDataToFormState),
  };

  if (!shelterFormDefaultValues.shelters.length) {
    shelterFormDefaultValues.shelters.push(mapShelterDataToFormState({}));
  }

  return shelterFormDefaultValues;
}

export const SheltersSection = ({ stop }: Props): React.ReactElement => {
  const { t } = useTranslation();

  const { saveStopPlaceShelters, defaultErrorHandler } = useEditStopShelters();

  const shelters = useShelters(stop);
  const [shelterCount, setShelterCount] = useState(shelters.length);

  const formRef = useRef<ExplicitAny>(null);
  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
    expandedByDefault: shelterCount > 0,
    onSave: () => submitFormByRef(formRef),
  });
  const { isInEditMode, setIsInEditMode, setIsExpanded } =
    infoContainerControls;

  useEffect(() => {
    if (!isInEditMode) {
      setShelterCount(shelters.length);
    }
  }, [isInEditMode, shelters]);

  const onSubmit = async (state: SheltersFormState) => {
    try {
      await saveStopPlaceShelters({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      infoContainerControls.setIsInEditMode(false);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const shelterFormDefaultValues = useShelterFormDefaultValues(shelters);

  const editAndAddShelter = () => {
    setIsInEditMode(true);
    setIsExpanded(true);
    setShelterCount(shelterFormDefaultValues.shelters.length);
  };

  const showAddNewShelterHeader = !isInEditMode && !shelters.length;
  const sectionTitle = shelterCount
    ? t('stopDetails.shelters.title', { count: shelterCount })
    : t('stopDetails.shelters.titleNoShelters');

  return (
    <InfoContainer
      colors={stopInfoContainerColors}
      controls={infoContainerControls}
      headerButtons={
        showAddNewShelterHeader ? (
          <EmptyListHeaderButtons
            addNewItemText={t('stopDetails.shelters.addShelter')}
            onAddNewItem={editAndAddShelter}
            testIdPrefix="SheltersSection"
          />
        ) : undefined
      }
      title={sectionTitle}
      testIdPrefix="SheltersSection"
    >
      {isInEditMode ? (
        <SheltersForm
          defaultValues={shelterFormDefaultValues}
          ref={formRef}
          onShelterCountChanged={setShelterCount}
          onSubmit={onSubmit}
        />
      ) : (
        <SheltersViewList shelters={shelters} />
      )}
    </InfoContainer>
  );
};
