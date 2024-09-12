import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopWithDetails,
  useEditStopLocationDetails,
} from '../../../../../hooks';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import { LocationDetailsForm } from './LocationDetailsForm';
import { LocationDetailsViewCard } from './LocationDetailsViewCard';
import { LocationDetailsFormState } from './schema';

interface Props {
  stop: StopWithDetails;
}

const mapLocationDetailsToFormState = (
  stop: StopWithDetails,
): Partial<LocationDetailsFormState> => {
  return {
    streetAddress: stop.stop_place?.streetAddress,
    postalCode: stop.stop_place?.postalCode,
    // Note: the location exists in stop_place as well, but stops db (measured_location) is the master data for it.
    latitude: stop.measured_location.coordinates[1],
    longitude: stop.measured_location.coordinates[0],
    altitude: stop.measured_location.coordinates[2],
    functionalArea: stop.stop_place?.functionalArea,
  };
};

export const LocationDetailsSection = ({ stop }: Props): React.ReactElement => {
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
          municipality={stop.stop_place?.municipality}
          fareZone={stop.stop_place?.fareZone}
          ref={formRef}
          onSubmit={onSubmit}
        />
      ) : (
        <LocationDetailsViewCard stop={stop} />
      )}
    </InfoContainer>
  );
};
