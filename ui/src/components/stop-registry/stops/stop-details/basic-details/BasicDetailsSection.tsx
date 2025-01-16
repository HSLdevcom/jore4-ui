import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails, useEditStopBasicDetails } from '../../../../../hooks';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import { StopBasicDetailsFormState } from './basic-details-form/schema';
import { StopBasicDetailsForm } from './basic-details-form/StopBasicDetailsForm';
import { BasicDetailsViewCard } from './BasicDetailsViewCard';

const mapStopBasicDetailsDataToFormState = (stop: StopWithDetails) => {
  const formState: Partial<StopBasicDetailsFormState> = {
    label: stop.label ?? '',
    publicCode: stop.stop_place?.publicCode,
    nameFin: stop.stop_place?.nameFin,
    nameSwe: stop.stop_place?.nameSwe,
    locationFin: stop.quay?.locationFin,
    locationSwe: stop.quay?.locationSwe,
    nameLongFin: stop.stop_place?.nameLongFin,
    nameLongSwe: stop.stop_place?.nameLongSwe,
    abbreviationFin: stop.stop_place?.abbreviationFin,
    abbreviationSwe: stop.stop_place?.abbreviationSwe,
    abbreviation5CharFin: stop.stop_place?.abbreviation5CharFin,
    abbreviation5CharSwe: stop.stop_place?.abbreviation5CharSwe,
    transportMode: stop.stop_place?.transportMode,
    elyNumber: stop.quay?.elyNumber,
    timingPlaceId: stop.timing_place_id,
    stopState: stop.quay?.stopState,
    // stopTypes: stop.quay?.stopType,
  };

  return formState;
};
interface Props {
  stop: StopWithDetails;
}

export const BasicDetailsSection = ({ stop }: Props): React.ReactElement => {
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
          stopAreaId={stop.stop_place?.groups?.at(0)?.id}
          defaultValues={defaultValues}
          ref={formRef}
          onSubmit={onSubmit}
          hasMainLineSign={
            !!stop.stop_place?.quays?.[0]?.placeEquipments?.generalSign?.[0]
              ?.mainLineSign
          }
        />
      ) : (
        <BasicDetailsViewCard stop={stop} />
      )}
    </InfoContainer>
  );
};
