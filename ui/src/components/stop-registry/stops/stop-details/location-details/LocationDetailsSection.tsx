import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopWithDetails,
  useEditStopLocationDetails,
  useToggle,
} from '../../../../../hooks';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { ExpandableInfoContainer } from '../layout';
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

export const LocationDetailsSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(true);
  const { saveStopPlaceLocationDetails, defaultErrorHandler } =
    useEditStopLocationDetails();
  const [isEditMode, toggleEditMode] = useToggle(false);

  const onCancel = () => {
    toggleEditMode();
  };
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);

  const onSubmit = async (state: LocationDetailsFormState) => {
    try {
      await saveStopPlaceLocationDetails({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      toggleEditMode();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const defaultValues = mapLocationDetailsToFormState(stop);

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={t('stopDetails.location.title')}
      testIdPrefix="LocationDetailsSection"
      isEditMode={isEditMode}
      onCancel={onCancel}
      onSave={onSave}
      toggleEditMode={toggleEditMode}
    >
      {isEditMode && !!defaultValues ? (
        <LocationDetailsForm
          defaultValues={defaultValues}
          municipality={stop.stop_place?.topographicPlace?.name?.value}
          ref={formRef}
          onSubmit={onSubmit}
        />
      ) : (
        <LocationDetailsViewCard stop={stop} />
      )}
    </ExpandableInfoContainer>
  );
};
