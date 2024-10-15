import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InfoSpotDetailsFragment,
  ShelterEquipmentDetailsFragment,
} from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../hooks';
import { useEditStopInfoSpots } from '../../../../../hooks/stop-registry/useEditStopInfoSpots';
import { mapStopRegistryShelterTypeEnumToUiName } from '../../../../../i18n/uiNameMappings';
import {
  mapLngLatToPoint,
  showSuccessToast,
  submitFormByRef,
} from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { EmptyListHeaderButtons } from '../layout/EmptyListHeaderButtons';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import { InfoSpotsForm } from './info-spots-form/InfoSpotsForm';
import {
  InfoSpotsFormState,
  mapInfoSpotDataToFormState,
} from './info-spots-form/schema';
import { InfoSpotsViewList } from './InfoSpotsViewList';

type Props = {
  readonly stop: StopWithDetails;
  readonly infoSpots: Array<InfoSpotDetailsFragment>;
  readonly shelter: ShelterEquipmentDetailsFragment;
  readonly shelterIndex: number;
};

function useInfoSpotFormDefaultValues(
  infoSpots: ReadonlyArray<InfoSpotDetailsFragment>,
) {
  const infoSpotFormDefaultValues = {
    infoSpots: infoSpots.map(mapInfoSpotDataToFormState),
  };

  if (!infoSpotFormDefaultValues.infoSpots.length) {
    infoSpotFormDefaultValues.infoSpots.push(mapInfoSpotDataToFormState({}));
  }

  return infoSpotFormDefaultValues;
}

export const InfoSpotsSection: FC<Props> = ({
  stop,
  infoSpots,
  shelter,
  shelterIndex,
}) => {
  const { t } = useTranslation();

  const { saveStopPlaceInfoSpots, defaultErrorHandler } =
    useEditStopInfoSpots();

  const [infoSpotCount, setInfoSpotCount] = useState(infoSpots.length);

  const location = mapLngLatToPoint(stop.measured_location.coordinates);

  const stopName = stop.label;

  const formRef = useRef<ExplicitAny>(null);
  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
    expandedByDefault: infoSpotCount > 0,
    onSave: () => submitFormByRef(formRef),
  });
  const { isInEditMode, setIsInEditMode, setIsExpanded } =
    infoContainerControls;

  useEffect(() => {
    if (!isInEditMode) {
      setInfoSpotCount(infoSpots.length);
    }
  }, [isInEditMode, infoSpots]);

  const onSubmit = async (state: InfoSpotsFormState) => {
    try {
      await saveStopPlaceInfoSpots({ state });

      showSuccessToast(t('stops.editSuccess'));
      infoContainerControls.setIsInEditMode(false);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const infoSpotsFormDefaultValues = useInfoSpotFormDefaultValues(infoSpots);

  const editAndAddInfoSpot = () => {
    setIsInEditMode(true);
    setIsExpanded(true);
    setInfoSpotCount(infoSpotsFormDefaultValues.infoSpots.length);
  };

  const showAddNewInfoSpotHeader = !isInEditMode && !infoSpots.length;
  const sectionTitle = infoSpotCount
    ? t('stopDetails.infoSpots.title')
    : t('stopDetails.infoSpots.titleNoInfoSpots');

  const subTitle = t('stopDetails.measurements.shelterType');

  return (
    <InfoContainer
      colors={stopInfoContainerColors}
      controls={infoContainerControls}
      headerButtons={
        showAddNewInfoSpotHeader ? (
          <EmptyListHeaderButtons
            addNewItemText={t('stopDetails.infoSpots.addInfoSpot')}
            onAddNewItem={editAndAddInfoSpot}
            testIdPrefix="InfoSpotsSection"
          />
        ) : undefined
      }
      title={sectionTitle}
      subTitle={`${subTitle} ${shelterIndex + 1} | `}
      subTitleShelterType={
        shelter.shelterType &&
        mapStopRegistryShelterTypeEnumToUiName(shelter.shelterType)
      }
      testIdPrefix="InfoSpotsSection"
    >
      {infoContainerControls.isInEditMode ? (
        <InfoSpotsForm
          defaultValues={infoSpotsFormDefaultValues}
          ref={formRef}
          onSubmit={onSubmit}
        />
      ) : (
        <InfoSpotsViewList
          infoSpots={infoSpots}
          location={location}
          stopName={stopName}
        />
      )}
    </InfoContainer>
  );
};
