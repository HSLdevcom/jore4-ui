import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopWithDetails,
  useEditStopBasicDetails,
  useToggle,
} from '../../../../hooks';
import { showSuccessToast, submitFormByRef } from '../../../../utils';
import { StopBasicDetailsFormState } from './basic-details-form/schema';
import { StopBasicDetailsForm } from './basic-details-form/StopBasicDetailsForm';
import { BasicDetailsViewCard } from './BasicDetailsViewCard';
import { ExpandableInfoContainer } from './ExpandableInfoContainer';

const mapStopBasicDetailsDataToFormState = (stop: StopWithDetails) => {
  const formState: Partial<StopBasicDetailsFormState> = {
    label: stop.label || '',
    publicCode: stop.stop_place?.publicCode,
    nameFin: stop.stop_place?.nameFin,
    nameSwe: stop.stop_place?.nameSwe,
    locationFin: stop.stop_place?.locationFin,
    locationSwe: stop.stop_place?.locationSwe,
    nameLongFin: stop.stop_place?.nameLongFin,
    nameLongSwe: stop.stop_place?.nameLongSwe,
    abbreviationFin: stop.stop_place?.abbreviationFin,
    abbreviationSwe: stop.stop_place?.abbreviationSwe,
    abbreviation5CharFin: stop.stop_place?.abbreviation5CharFin,
    abbreviation5CharSwe: stop.stop_place?.abbreviation5CharSwe,
    transportMode: stop.stop_place?.transportMode,
    elyNumber: stop.stop_place?.elyNumber,
    timingPlaceId: stop.timing_place_id,
    stopState: stop.stop_place?.stopState,
    stopTypes: stop.stop_place?.stopType,
  };

  return formState;
};
interface Props {
  stop: StopWithDetails;
}

export const BasicDetailsSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { saveStopPlaceDetails, defaultErrorHandler } =
    useEditStopBasicDetails();
  const [isExpanded, toggleIsExpanded] = useToggle(true);

  const [isEditMode, toggleEditMode] = useToggle(false);

  const onCancel = () => {
    toggleEditMode();
  };
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);

  const onSubmit = async (state: StopBasicDetailsFormState) => {
    try {
      await saveStopPlaceDetails({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      toggleEditMode();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const defaultValues = mapStopBasicDetailsDataToFormState(stop);

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={t('stopDetails.basicDetails')}
      testIdPrefix="BasicDetailsSection"
      isEditMode={isEditMode}
      onCancel={onCancel}
      onSave={onSave}
      toggleEditMode={toggleEditMode}
    >
      {isEditMode && !!defaultValues ? (
        <StopBasicDetailsForm
          defaultValues={defaultValues}
          ref={formRef}
          onSubmit={onSubmit}
        />
      ) : (
        <BasicDetailsViewCard stop={stop} />
      )}
    </ExpandableInfoContainer>
  );
};
