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
    privateCode: stop.quay?.privateCode ?? undefined,
    nameFin: stop.stop_place?.name,
    nameSwe: stop.stop_place?.nameSwe,
    locationFin: stop.quay?.locationFin ?? undefined,
    locationSwe: stop.quay?.locationSwe ?? undefined,
    nameLongFin: stop.stop_place?.nameLongFin,
    nameLongSwe: stop.stop_place?.nameLongSwe,
    abbreviationFin: stop.stop_place?.abbreviationFin,
    abbreviationSwe: stop.stop_place?.abbreviationSwe,
    abbreviation5CharFin: stop.stop_place?.abbreviation5CharFin,
    abbreviation5CharSwe: stop.stop_place?.abbreviation5CharSwe,
    transportMode: stop.stop_place?.transportMode,
    elyNumber: stop.quay?.elyNumber ?? undefined,
    timingPlaceId: stop.timing_place_id,
    stopState: stop.quay?.stopState ?? undefined,
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
          defaultValues={defaultValues}
          ref={formRef}
          onSubmit={onSubmit}
          hasMainLineSign={
            stop.quay?.placeEquipments?.generalSign?.at(0)?.mainLineSign ??
            false
          }
        />
      ) : (
        <BasicDetailsViewCard stop={stop} />
      )}
    </InfoContainer>
  );
};
