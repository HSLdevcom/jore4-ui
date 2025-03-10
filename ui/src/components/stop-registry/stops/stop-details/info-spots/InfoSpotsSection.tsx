import { FC, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InfoSpotDetailsFragment,
  ShelterEquipmentDetailsFragment,
} from '../../../../../generated/graphql';
import { useEditStopInfoSpots } from '../../../../../hooks/stop-registry/useEditStopInfoSpots';
import { mapStopRegistryShelterTypeEnumToUiName } from '../../../../../i18n/uiNameMappings';
import { StopWithDetails } from '../../../../../types';
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
  stop: Readonly<StopWithDetails>,
  shelter: Readonly<ShelterEquipmentDetailsFragment>,
) => {
  const infoSpotLocations = useMemo(
    () => [stop.stop_place_ref ?? null, shelter.id ?? null],
    [stop.stop_place_ref, shelter.id],
  );

  const infoSpotsFormDefaultValues = useMemo(() => {
    if (infoSpots.length) {
      return { infoSpots: infoSpots.map(mapInfoSpotDataToFormState) };
    }

    return { infoSpots: [mapInfoSpotDataToFormState({ infoSpotLocations })] };
  }, [infoSpots, infoSpotLocations]);

  return { infoSpotsFormDefaultValues, infoSpotLocations };
};

const InfoSpotTitle: FC<{
  readonly infoSpotCount: number;
  readonly shelter: ShelterEquipmentDetailsFragment;
  readonly shelterIndex: number;
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

  const { infoSpotsFormDefaultValues, infoSpotLocations } =
    useInfoSpotFormDefaultValues(infoSpots, stop, shelter);

  const formRef = useRef<HTMLFormElement | null>(null);
  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
    onSave: () => submitFormByRef(formRef),
  });
  const { isInEditMode, setIsInEditMode, setIsExpanded } =
    infoContainerControls;

  const infoSpotCount = infoSpots.length + (isInEditMode ? 1 : 0);

  const onSubmit = async (state: InfoSpotsFormState) => {
    try {
      await saveStopPlaceInfoSpots({ state });

      showSuccessToast(t('stops.editSuccess'));
      infoContainerControls.setIsInEditMode(false);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const editAndAddInfoSpot = () => {
    setIsInEditMode(true);
    setIsExpanded(true);
  };

  return (
    <InfoContainer
      colors={stopInfoContainerColors}
      controls={infoContainerControls}
      headerButtons={
        !isInEditMode && !infoSpots.length ? (
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
          infoSpotLocations={infoSpotLocations}
          onSubmit={onSubmit}
        />
      ) : (
        <InfoSpotsViewList
          infoSpots={infoSpots}
          location={location}
          stopName={stop.label}
        />
      )}
    </InfoContainer>
  );
};
