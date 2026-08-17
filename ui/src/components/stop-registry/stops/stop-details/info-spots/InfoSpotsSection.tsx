import { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import { StopPlaceInfoSpots, StopWithDetails } from '../../../../../types';
import {
  NullOptionEnum,
  showSuccessToast,
  submitFormByRef,
} from '../../../../../utils';
import { mapStopRegistryShelterTypeEnumToUiName } from '../../../../../utils/i18n';
import { AddNewButton } from '../../../../common/Buttons';
import {
  InfoContainer,
  useInfoContainerControls,
} from '../../../../common/InfoContainer';
import { EmptyListHeaderButtons } from '../layout/EmptyListHeaderButtons';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import {
  InfoSpotsForm,
  InfoSpotsFormRef,
} from './info-spots-form/InfoSpotsForm';
import { InfoSpotsViewList } from './InfoSpotsViewList';
import { useEditStopInfoSpots } from './queries';
import { InfoSpotsFormState } from './types';
import {
  defaultInfoSpotValues,
  getInfoSpotLabel,
  mapInfoSpotDataToFormState,
} from './utils';

const testIds = {
  addInfoSpot: 'InfoSpotsSection::addInfoSpot',
};

type InfoSpotsSectionProps = {
  readonly stop: StopWithDetails;
  readonly infoSpots: ReadonlyArray<StopPlaceInfoSpots>;
  readonly shelter: ShelterEquipmentDetailsFragment;
  readonly shelterNumber: number | null;
};

export function useInfoSpotFormDefaultValues(
  infoSpots: ReadonlyArray<StopPlaceInfoSpots>,
  stop: Readonly<StopWithDetails>,
  shelter: Readonly<ShelterEquipmentDetailsFragment>,
) {
  const infoSpotLocations = useMemo(
    () => [stop.stop_place_ref ?? null, shelter.id ?? null],
    [stop.stop_place_ref, shelter.id],
  );

  const infoSpotsFormDefaultValues = useMemo(() => {
    if (infoSpots.length) {
      return { infoSpots: infoSpots.map(mapInfoSpotDataToFormState) };
    }

    return {
      infoSpots: [
        mapInfoSpotDataToFormState({
          infoSpotLocations,
          label: getInfoSpotLabel(stop.label, infoSpots.length),
          ...defaultInfoSpotValues,
        }),
      ],
    };
  }, [infoSpots, infoSpotLocations, stop.label]);

  return { infoSpotsFormDefaultValues, infoSpotLocations };
}

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
          ? t(($) => $.stopDetails.infoSpots.title)
          : t(($) => $.stopDetails.infoSpots.titleNoInfoSpots)}{' '}
        &nbsp;
      </span>
      <span className="font-normal">
        {t(($) => $.stopDetails.infoSpots.shelterTypeSubtitle, {
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

export const InfoSpotsSection: FC<InfoSpotsSectionProps> = ({
  stop,
  infoSpots,
  shelter,
  shelterNumber,
}) => {
  const { t } = useTranslation();

  const { saveStopPlaceInfoSpots, defaultErrorHandler } =
    useEditStopInfoSpots();
  const [, setFormIsDirty] = useState(false);

  const { location } = stop;

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
      await saveStopPlaceInfoSpots({ state, infoSpots });

      showSuccessToast(t(($) => $.stops.editSuccess));
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
            addNewItemText={t(($) => $.stopDetails.infoSpots.addInfoSpot)}
            onAddNewItem={editAndAddInfoSpot}
            testIdPrefix="InfoSpotsSection"
          />
        ) : undefined
      }
      title={
        <InfoSpotTitle
          infoSpotCount={infoSpotCount}
          shelter={shelter}
          shelterNumber={shelterNumber}
        />
      }
      ariaLabel={t(($) => $.stopDetails.infoSpots.title)}
      testIdPrefix="InfoSpotsSection"
    >
      {infoContainerControls.isInEditMode ? (
        <InfoSpotsForm
          stopLabel={stop.label}
          defaultValues={infoSpotsFormDefaultValues}
          infoSpotsData={infoSpots}
          formRef={formRef}
          ref={infoSpotsFormRef}
          infoSpotLocations={infoSpotLocations}
          onSubmit={onSubmit}
          setFormIsDirty={setFormIsDirty}
          onCancel={() => infoContainerControls.setIsInEditMode(false)}
          testIdPrefix="InfoSpotsSection"
          addNewButton={
            <AddNewButton
              onClick={handleAddNewInfoSpot}
              label={
                <span className="text-hsl-dark-80 hover:text-tweaked-brand">
                  {t(($) => $.stopDetails.infoSpots.addInfoSpot)}
                </span>
              }
              testId={testIds.addInfoSpot}
            />
          }
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
