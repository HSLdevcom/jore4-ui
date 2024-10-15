import { FC, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InfoSpotDetailsFragment,
  ShelterEquipmentDetailsFragment,
} from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../hooks';
import { useEditStopInfoSpots } from '../../../../../hooks/stop-registry/useEditStopInfoSpots';
import { mapStopRegistryShelterTypeEnumToUiName } from '../../../../../i18n/uiNameMappings';
import {
  NullOptionEnum,
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
  readonly infoSpots: ReadonlyArray<InfoSpotDetailsFragment>;
  readonly shelter: ShelterEquipmentDetailsFragment;
  readonly shelterIndex: number;
};

export const useInfoSpotFormDefaultValues = (
  infoSpots: ReadonlyArray<InfoSpotDetailsFragment>,
) => {
  const infoSpotFormDefaultValues = {
    infoSpots: infoSpots.map(mapInfoSpotDataToFormState),
  };

  if (!infoSpotFormDefaultValues.infoSpots.length) {
    infoSpotFormDefaultValues.infoSpots = [mapInfoSpotDataToFormState({})];
  }

  return useMemo(() => {
    if (infoSpots.length) {
      return { infoSpots: infoSpots.map(mapInfoSpotDataToFormState) };
    }

    return { infoSpots: [mapInfoSpotDataToFormState({})] };
  }, [infoSpots]);
};

const InfoSpotTitle: FC<{
  infoSpotCount: number;
  shelter: ShelterEquipmentDetailsFragment;
  shelterIndex: number;
}> = ({ infoSpotCount, shelter, shelterIndex }) => {
  const { t } = useTranslation();
  return (
    <h4>
      <span>
        {infoSpotCount
          ? t('stopDetails.infoSpots.title')
          : t('stopDetails.infoSpots.titleNoInfoSpots')}{' '}
        &nbsp;
      </span>
      <span className="font-normal">
        {t('stopDetails.infoSpots.shelterTypeSubtitle', {
          index: shelterIndex + 1,
          shelterType: mapStopRegistryShelterTypeEnumToUiName(
            shelter.shelterType ?? NullOptionEnum.Null,
          ),
        })}
      </span>
    </h4>
  );
};

export const InfoSpotsSection: FC<Props> = ({
  stop,
  infoSpots,
  shelter,
  shelterIndex,
}) => {
  const { t } = useTranslation();

  const { saveStopPlaceInfoSpots, defaultErrorHandler } =
    useEditStopInfoSpots();

  const location = mapLngLatToPoint(stop.measured_location.coordinates);

  const stopName = stop.label;

  const formRef = useRef<HTMLFormElement | null>(null);
  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
    onSave: () => submitFormByRef(formRef),
  });
  const { isInEditMode, setIsInEditMode, setIsExpanded } =
    infoContainerControls;

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
  };

  const infoSpotCount = infoSpots.length + (isInEditMode ? 1 : 0);

  const showAddNewInfoSpotHeader = !isInEditMode && !infoSpots.length;

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
      title={
        <InfoSpotTitle
          infoSpotCount={infoSpotCount}
          shelter={shelter}
          shelterIndex={shelterIndex}
        />
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
