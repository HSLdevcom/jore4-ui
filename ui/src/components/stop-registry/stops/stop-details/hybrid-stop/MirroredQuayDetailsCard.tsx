import { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfrastructureNetworkDirectionEnum } from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../types';
import { Priority } from '../../../../../types/enums';
import { StopPlaceState } from '../../../../../types/stop-registry';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { mapTransportModeToStopTypeName } from '../../../../../utils/i18n';
import {
  InfoContainer,
  useInfoContainerControls,
} from '../../../../common/InfoContainer';
import { ConfirmationDialog } from '../../../../common/Modals';
import { StopAreaDetailsSection } from '../basic-details/BasicDetailsStopAreaFields';
import { StopDetailsSection } from '../basic-details/BasicDetailsStopFields';
import { StopStateChangeConfirmationDialog } from '../basic-details/StopStateChangeConfirmationDialog';
import {
  getContainerColorsByTransportMode,
  inactiveInfoContainerColors,
} from '../stopInfoContainerColors';
import { MirroredQuayDetails } from '../useGetStopDetails';
import { useStopStateChangeConfirmation } from '../useStopStateChangeConfirmation';
import { MirroredQuayBasicDetailsForm } from './mirrored-quay-form/MirroredQuayBasicDetailsForm';
import { MirroredQuayFormState } from './mirrored-quay-form/schema';
import { useEditMirroredQuayDetails } from './useEditMirroredQuayDetails';
import { useRemoveMirrorRelation } from './useRemoveMirrorRelation';

function toStopWithDetails(details: MirroredQuayDetails): StopWithDetails {
  const { quay, stopPlace } = details;
  const coords = quay.geometry?.coordinates;
  return {
    scheduled_stop_point_id: '' as UUID,
    label: quay.publicCode ?? '',
    priority: quay.priority ?? Priority.Standard,
    direction: InfrastructureNetworkDirectionEnum.Forward,
    validity_start: null,
    validity_end: null,
    located_on_infrastructure_link_id: '' as UUID,
    stop_place_ref: null,
    measured_location: {
      type: 'Point' as const,
      coordinates: coords ?? [0, 0],
    },
    timing_place_id: (quay.timingPlaceId ?? null) as UUID | null,
    timing_place: null,
    vehicle_mode_on_scheduled_stop_point: [],
    stop_place: stopPlace,
    quay,
    location: {
      longitude: coords?.[0] ?? 0,
      latitude: coords?.[1] ?? 0,
    },
  };
}

type MirroredQuayDetailsCardProps = {
  readonly details: MirroredQuayDetails;
};

export const MirroredQuayDetailsCard: FC<MirroredQuayDetailsCardProps> = ({
  details,
}) => {
  const { t } = useTranslation();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const { removeMirrorRelation, loading: removing } = useRemoveMirrorRelation();
  const { saveMirroredQuayDetails, defaultErrorHandler } =
    useEditMirroredQuayDetails();

  const formRef = useRef<HTMLFormElement | null>(null);

  const { transportMode } = details.stopPlace;
  const { stopState, stopType } = details.quay;
  const isActive = !stopState || stopState === StopPlaceState.InOperation;

  const colors = isActive
    ? getContainerColorsByTransportMode(
        transportMode,
        stopType.trunkLineStop,
        stopType.speedTramStop,
      )
    : inactiveInfoContainerColors;

  const infoContainerControls = useInfoContainerControls({
    isEditable: true,
    isExpandable: true,
    onSave: () => submitFormByRef(formRef),
  });

  const { onSubmit, confirmationDialogProps } =
    useStopStateChangeConfirmation<MirroredQuayFormState>({
      currentStopState: details.quay.stopState ?? StopPlaceState.InOperation,
      quayNetexId: details.quay.id ?? '',
      doSave: (state) =>
        saveMirroredQuayDetails({
          state,
          quay: details.quay,
          stopPlace: details.stopPlace,
        }),
      onSuccess: () => {
        showSuccessToast(t(($) => $.stops.editSuccess));
        infoContainerControls.setIsInEditMode(false);
      },
      defaultErrorHandler,
    });

  const transportModeName = transportMode
    ? mapTransportModeToStopTypeName(t, transportMode)
    : '';

  const title = `${t(($) => $.stopDetails.basicDetails.title)} | ${transportModeName}`;

  const pseudoStop = useMemo(() => toStopWithDetails(details), [details]);

  const defaultValues: Partial<MirroredQuayFormState> = {
    stopState: stopState ?? undefined,
    trunkLineStop: details.quay.stopType.trunkLineStop,
    speedTramStop: details.quay.stopType.speedTramStop,
    reasonForChange: '',
  };

  const handleRemove = async () => {
    const success = await removeMirrorRelation({
      childQuayId: details.quay.id ?? '',
      childStopPlaceId: details.stopPlace.id ?? '',
    });
    setShowRemoveDialog(false);
    if (success) {
      showSuccessToast(t(($) => $.stopDetails.hybrid.removeSuccess));
    }
  };

  return (
    <>
      <InfoContainer
        colors={colors}
        controls={infoContainerControls}
        title={title}
        ariaLabel={title}
        inverted
        testIdPrefix="MirroredQuayDetails"
      >
        {infoContainerControls.isInEditMode ? (
          <MirroredQuayBasicDetailsForm
            defaultValues={defaultValues}
            ref={formRef}
            onSubmit={onSubmit}
            onCancel={() => infoContainerControls.setIsInEditMode(false)}
            onRemove={() => setShowRemoveDialog(true)}
            stop={pseudoStop}
            testIdPrefix="MirroredQuayDetails"
            transportMode={transportMode}
          />
        ) : (
          <>
            <StopAreaDetailsSection stop={pseudoStop} />
            <StopDetailsSection stop={pseudoStop} />
          </>
        )}
      </InfoContainer>
      <ConfirmationDialog
        isOpen={showRemoveDialog}
        onConfirm={handleRemove}
        onCancel={() => setShowRemoveDialog(false)}
        title={t(($) => $.stopDetails.hybrid.removeConfirmTitle)}
        description={t(($) => $.stopDetails.hybrid.removeConfirmDescription)}
        confirmText={t(($) => $.stopDetails.hybrid.removeConfirm)}
        cancelText={t(($) => $.stopDetails.hybrid.removeCancel)}
        isConfirming={removing}
      />
      <StopStateChangeConfirmationDialog
        isOpen={confirmationDialogProps.isOpen}
        onConfirm={confirmationDialogProps.onConfirm}
        onCancel={confirmationDialogProps.onCancel}
        stopLabel={details.quay.publicCode ?? ''}
        affectedRoutes={confirmationDialogProps.affectedRoutes}
      />
    </>
  );
};
