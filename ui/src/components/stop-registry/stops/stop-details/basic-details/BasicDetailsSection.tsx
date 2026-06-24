import { DateTime } from 'luxon';
import { FC, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useObservationDateQueryParam } from '../../../../../hooks';
import { mapTransportModeToStopTypeName } from '../../../../../i18n/uiNameMappings';
import { StopWithDetails } from '../../../../../types';
import { StopPlaceState } from '../../../../../types/stop-registry';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { getEffectiveStopState } from '../getEffectiveStopState';
import {
  getContainerColorsByTransportMode,
  inactiveInfoContainerColors,
} from '../stopInfoContainerColors';
import { useStopStateChangeConfirmation } from '../useStopStateChangeConfirmation';
import { StopBasicDetailsFormState } from './basic-details-form/schema';
import { StopBasicDetailsForm } from './basic-details-form/StopBasicDetailsForm';
import { BasicDetailsViewCard } from './BasicDetailsViewCard';
import { StopStateChangeConfirmationDialog } from './StopStateChangeConfirmationDialog';
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
    timingPlaceId: stop.quay?.timingPlaceId ?? stop.timing_place_id ?? null,
    stopState: stop.quay?.stopState ?? undefined,
    stopStateValidityStart: stop.quay?.stopStateValidityStart
      ? DateTime.fromISO(stop.quay.stopStateValidityStart)
      : DateTime.now(),
    stopStateValidityEnd: stop.quay?.stopStateValidityEnd
      ? DateTime.fromISO(stop.quay.stopStateValidityEnd)
      : DateTime.now().plus({ days: 1 }),
    stopTypes: stop.quay?.stopType,
    reasonForChange: '',
  };

  return formState;
};
type BasicDetailsSectionProps = {
  readonly stop: StopWithDetails;
  readonly isHybrid: boolean;
};

export const BasicDetailsSection: FC<BasicDetailsSectionProps> = ({
  stop,
  isHybrid,
}) => {
  const { t } = useTranslation();
  const { observationDate } = useObservationDateQueryParam();

  const effectiveStopState = getEffectiveStopState(
    stop.quay?.stopState,
    stop.quay?.stopStateValidityStart,
    stop.quay?.stopStateValidityEnd,
    observationDate,
  );

  const { saveStopPlaceDetails, defaultErrorHandler } =
    useEditStopBasicDetails();

  const formRef = useRef<ExplicitAny>(null);
  const infoContainerControls = useInfoContainerControls({
    isEditable: true,
    isExpandable: true,
    onSave: () => submitFormByRef(formRef),
  });

  const { onSubmit, confirmationDialogProps } =
    useStopStateChangeConfirmation<StopBasicDetailsFormState>({
      currentStopState: stop.quay?.stopState,
      stopPlaceRef: stop.stop_place_ref ?? '',
      scheduledStopPointId: stop.scheduled_stop_point_id,
      doSave: (state) => saveStopPlaceDetails({ state, stop }),
      onSuccess: () => {
        showSuccessToast(t(($) => $.stops.editSuccess));
        infoContainerControls.setIsInEditMode(false);
      },
      defaultErrorHandler,
    });

  const defaultValues = mapStopBasicDetailsDataToFormState(stop);

  const transportMode = stop.stop_place?.transportMode;
  const title = useMemo(() => {
    const base = t(($) => $.stopDetails.basicDetails.title);
    if (!isHybrid || !transportMode) {
      return base;
    }
    const modeName = mapTransportModeToStopTypeName(t, transportMode);
    return `${base} | ${modeName}`;
  }, [t, isHybrid, transportMode]);

  return (
    <InfoContainer
      colors={
        effectiveStopState === StopPlaceState.InOperation
          ? getContainerColorsByTransportMode(
              stop.stop_place?.transportMode,
              stop.quay?.stopType.trunkLineStop,
              stop.quay?.stopType.speedTramStop,
            )
          : inactiveInfoContainerColors
      }
      controls={infoContainerControls}
      title={title}
      inverted
      testIdPrefix="BasicDetailsSection"
    >
      {infoContainerControls.isInEditMode && !!defaultValues ? (
        <StopBasicDetailsForm
          defaultValues={defaultValues}
          ref={formRef}
          onSubmit={onSubmit}
          stop={stop}
          isHybrid={isHybrid}
          onCancel={() => infoContainerControls.setIsInEditMode(false)}
          testIdPrefix="BasicDetailsSection"
        />
      ) : (
        <BasicDetailsViewCard stop={stop} />
      )}
      <StopStateChangeConfirmationDialog
        isOpen={confirmationDialogProps.isOpen}
        onConfirm={confirmationDialogProps.onConfirm}
        onCancel={confirmationDialogProps.onCancel}
        stopLabel={stop.label ?? ''}
        affectedRoutes={confirmationDialogProps.affectedRoutes}
      />
    </InfoContainer>
  );
};
