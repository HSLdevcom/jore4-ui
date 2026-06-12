import { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfrastructureNetworkDirectionEnum } from '../../../../../generated/graphql';
import { mapTransportModeToStopTypeName } from '../../../../../i18n/uiNameMappings';
import { StopWithDetails } from '../../../../../types';
import { Priority } from '../../../../../types/enums';
import { StopPlaceState } from '../../../../../types/stop-registry';
import { ConfirmationDialog } from '../../../../../uiComponents';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { StopAreaDetailsSection } from '../basic-details/BasicDetailsStopAreaFields';
import { StopDetailsSection } from '../basic-details/BasicDetailsStopFields';
import {
  getContainerColorsByTransportMode,
  inactiveInfoContainerColors,
} from '../stopInfoContainerColors';
import { MirroredQuayDetails } from '../useGetStopDetails';
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

  const transportModeName = transportMode
    ? mapTransportModeToStopTypeName(t, transportMode)
    : '';

  const title = `${t(($) => $.stopDetails.basicDetails.title)} | ${transportModeName}`;

  const pseudoStop = useMemo(() => toStopWithDetails(details), [details]);

  const defaultValues: Partial<MirroredQuayFormState> = {
    stopState: stopState ?? undefined,
    reasonForChange: '',
  };

  const onSubmit = async (state: MirroredQuayFormState) => {
    try {
      await saveMirroredQuayDetails({
        state,
        quay: details.quay,
        stopPlace: details.stopPlace,
      });

      showSuccessToast(t(($) => $.stops.editSuccess));
      infoContainerControls.setIsInEditMode(false);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
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
    </>
  );
};
