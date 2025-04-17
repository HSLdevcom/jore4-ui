import { FC, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InfoSpotDetailsFragment,
  ShelterEquipmentDetailsFragment,
} from '../../../../../generated/graphql';
import { useEditStopInfoSpots } from '../../../../../hooks/stop-registry/useEditStopInfoSpots';
import { mapStopRegistryShelterTypeEnumToUiName } from '../../../../../i18n/uiNameMappings';
import { StopWithDetails } from '../../../../../types';
import { AddNewButton } from '../../../../../uiComponents/AddNewButton';
import {
  NullOptionEnum,
  mapLngLatToPoint,
  showSuccessToast,
  submitFormByRef,
} from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { EmptyListHeaderButtons } from '../layout/EmptyListHeaderButtons';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import {
  InfoSpotsForm,
  InfoSpotsFormRef,
} from './info-spots-form/InfoSpotsForm';
import {
  InfoSpotsFormState,
  mapInfoSpotDataToFormState,
} from './info-spots-form/schema';
import { InfoSpotsViewList } from './InfoSpotsViewList';

const testIds = {
  addInfoSpot: 'InfoSpotsSection::addInfoSpot',
};

type Props = {
  readonly stop: StopWithDetails;
  readonly infoSpots: ReadonlyArray<InfoSpotDetailsFragment>;
  readonly shelter: ShelterEquipmentDetailsFragment;
  readonly shelterNumber: number | null;
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
  readonly shelterNumber: number | null;
}> = ({ infoSpotCount, shelter, shelterNumber }) => {
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
          index: shelterNumber,
          shelterType: mapStopRegistryShelterTypeEnumToUiName(
            t,
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
  shelterNumber,
}) => {
  const { t } = useTranslation();

  const { saveStopPlaceInfoSpots, defaultErrorHandler } =
    useEditStopInfoSpots();

  const location = mapLngLatToPoint(stop.measured_location.coordinates);

  const { infoSpotsFormDefaultValues, infoSpotLocations } =
    useInfoSpotFormDefaultValues(infoSpots, stop, shelter);

  const formRef = useRef<HTMLFormElement>(null);
  const infoSpotsFormRef = useRef<InfoSpotsFormRef>(null);

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

  const handleAddNewInfoSpot = () => {
    infoSpotsFormRef.current?.addNewInfoSpot();
  };

  return (
    <InfoContainer
      colors={stopInfoContainerColors}
      bodyClassName="p-0"
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
      addNewButton={
        isInEditMode ? (
          <AddNewButton
            onClick={handleAddNewInfoSpot}
            label={t('stopDetails.infoSpots.addInfoSpot')}
            testId={testIds.addInfoSpot}
          />
        ) : null
      }
      title={
        <InfoSpotTitle
          infoSpotCount={infoSpotCount}
          shelter={shelter}
          shelterNumber={shelterNumber}
        />
      }
      testIdPrefix="InfoSpotsSection"
    >
      {infoContainerControls.isInEditMode ? (
        <InfoSpotsForm
          defaultValues={infoSpotsFormDefaultValues}
          infoSpotsData={infoSpots}
          formRef={formRef}
          ref={infoSpotsFormRef}
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
