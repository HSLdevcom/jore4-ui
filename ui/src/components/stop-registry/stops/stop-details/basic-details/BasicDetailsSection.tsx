import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../types';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import { StopBasicDetailsFormState } from './basic-details-form/schema';
import { StopBasicDetailsForm } from './basic-details-form/StopBasicDetailsForm';
import { BasicDetailsViewCard } from './BasicDetailsViewCard';
import { useEditStopBasicDetails } from './useEditStopBasicDetails';

const mapStopBasicDetailsDataToFormState = (stop: StopWithDetails) => {
  const formState: Partial<StopBasicDetailsFormState> = {
    label: stop.label ?? '',
    privateCode: stop.quay?.privateCode ?? undefined,
    nameFin: stop.stop_place?.name,
    nameSwe: stop.stop_place?.nameSwe,
    locationFin: stop.quay?.locationFin ?? undefined,
    locationSwe: stop.quay?.locationSwe ?? undefined,
    nameLongFin: stop.stop_place?.nameLongFin,
    nameLongSwe: stop.stop_place?.nameLongSwe,
    abbreviationFin: stop.stop_place?.abbreviationFin,
    abbreviationSwe: stop.stop_place?.abbreviationSwe,
    transportMode: stop.stop_place?.transportMode,
    elyNumber: stop.quay?.elyNumber ?? undefined,
    timingPlaceId: stop.timing_place_id,
    stopState: stop.quay?.stopState ?? undefined,
    stopTypes: stop.quay?.stopType,
  };

  return formState;
};
type BasicDetailsSectionProps = {
  readonly stop: StopWithDetails;
};

export const BasicDetailsSection: FC<BasicDetailsSectionProps> = ({ stop }) => {
  const { t } = useTranslation();

  const { saveStopPlaceDetails, defaultErrorHandler } =
    useEditStopBasicDetails();

  const formRef = useRef<ExplicitAny>(null);
  const infoContainerControls = useInfoContainerControls({
    isEditable: true,
    isExpandable: true,
    onSave: () => submitFormByRef(formRef),
  });

  const onSubmit = async (state: StopBasicDetailsFormState) => {
    try {
      await saveStopPlaceDetails({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      infoContainerControls.setIsInEditMode(false);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const defaultValues = mapStopBasicDetailsDataToFormState(stop);

  return (
    <InfoContainer
      colors={stopInfoContainerColors}
      controls={infoContainerControls}
      title={t('stopDetails.basicDetails.title')}
      testIdPrefix="BasicDetailsSection"
    >
      {infoContainerControls.isInEditMode && !!defaultValues ? (
        <StopBasicDetailsForm
          defaultValues={defaultValues}
          ref={formRef}
          onSubmit={onSubmit}
          stop={stop}
        />
      ) : (
        <BasicDetailsViewCard stop={stop} />
      )}
    </InfoContainer>
  );
};
