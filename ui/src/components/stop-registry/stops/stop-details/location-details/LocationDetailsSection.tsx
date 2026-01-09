import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../types';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import { LocationDetailsForm } from './LocationDetailsForm';
import { LocationDetailsViewCard } from './LocationDetailsViewCard';
import { LocationTerminalDetails } from './LocationTerminalDetails';
import { LocationDetailsFormState } from './schema';
import { useEditStopLocationDetails } from './useEditStopLocationDetails';

type LocationDetailsSectionProps = {
  readonly stop: StopWithDetails;
};

const mapLocationDetailsToFormState = (
  stop: StopWithDetails,
): Partial<LocationDetailsFormState> => {
  return {
    streetAddress: stop.quay?.streetAddress,
    postalCode: stop.quay?.postalCode,
    // Note: the location exists in stop_place as well, but stops db (measured_location) is the master data for it.
    latitude: stop.location.latitude,
    longitude: stop.location.longitude,
    altitude: stop.location.elevation,
    functionalArea: stop.quay?.functionalArea ?? undefined,
    platformNumber:
      stop.quay?.placeEquipments?.generalSign?.[0]?.content?.value ?? undefined,
    signContentType:
      stop.quay?.placeEquipments?.generalSign?.[0]?.signContentType ??
      undefined,
  };
};

export const LocationDetailsSection: FC<LocationDetailsSectionProps> = ({
  stop,
}) => {
  const { t } = useTranslation();

  const { saveStopPlaceLocationDetails, defaultErrorHandler } =
    useEditStopLocationDetails();

  const formRef = useRef<ExplicitAny>(null);
  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
    onSave: () => submitFormByRef(formRef),
  });

  const onSubmit = async (state: LocationDetailsFormState) => {
    try {
      await saveStopPlaceLocationDetails({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      infoContainerControls.setIsInEditMode(false);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const defaultValues = mapLocationDetailsToFormState(stop);

  return (
    <InfoContainer
      colors={stopInfoContainerColors}
      controls={infoContainerControls}
      title={t('stopDetails.location.title')}
      testIdPrefix="LocationDetailsSection"
    >
      {infoContainerControls.isInEditMode && !!defaultValues ? (
        <LocationDetailsForm
          defaultValues={defaultValues}
          stop={stop}
          ref={formRef}
          onSubmit={onSubmit}
          onCancel={() => infoContainerControls.setIsInEditMode(false)}
          testIdPrefix="LocationDetailsSection"
        />
      ) : (
        <>
          <LocationTerminalDetails stop={stop} />
          <LocationDetailsViewCard stop={stop} />
        </>
      )}
    </InfoContainer>
  );
};
