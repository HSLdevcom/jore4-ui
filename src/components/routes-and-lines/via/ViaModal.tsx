import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  JourneyPatternScheduledStopPointInJourneyPattern,
  useGetScheduledStopPointWithViaInfoQuery,
} from '../../../generated/graphql';
import { mapGetScheduledStopPointWithViaInfo as mapGetScheduledStopPointWithViaInfoResult } from '../../../graphql';
import {
  useAppDispatch,
  useAppSelector,
  useEditViaInfo,
  useRemoveViaInfo,
} from '../../../hooks';
import { selectViaModal } from '../../../redux';
import { closeViaModalAction } from '../../../redux/slices/modals';
import { showDangerToastWithError, showSuccessToast } from '../../../utils';
import { ModalHeader } from '../../common';
import {
  FormState,
  mapStopJourneyPatternToFormState,
  ViaForm,
} from './ViaForm';

interface Props {
  className?: string;
}

export const ViaModal = ({ className = '' }: Props): JSX.Element => {
  const { t } = useTranslation();
  const viaModalState = useAppSelector(selectViaModal);
  const { journeyPatternId, scheduledStopPointId } = viaModalState;
  const dispatch = useAppDispatch();

  const { prepareEdit, mapEditChangesToVariables, editMutation } =
    useEditViaInfo();

  const { prepareRemove, mapRemoveChangesToVariables, removeMutation } =
    useRemoveViaInfo();

  const scheduledStopResult = useGetScheduledStopPointWithViaInfoQuery({
    variables: {
      // if the via modal is open, we know that journeyPatternId and scheduledStopPointId are set
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      journey_pattern_id: journeyPatternId!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      scheduled_stop_point_id: scheduledStopPointId!,
    },
  });
  const stopInfo =
    mapGetScheduledStopPointWithViaInfoResult(scheduledStopResult);

  const onSubmit = async (
    formState: FormState,
    stopJourneyPattern: JourneyPatternScheduledStopPointInJourneyPattern,
  ) => {
    try {
      const changes = prepareEdit({
        formState,
        scheduledStopPointId: stopJourneyPattern.scheduled_stop_point_id,
        journeyPatternId: stopJourneyPattern.journey_pattern_id,
      });

      const variables = mapEditChangesToVariables(changes);

      editMutation(variables);

      dispatch(closeViaModalAction());
      showSuccessToast(t('viaModal.viaSaveSuccess'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  const onRemove = async (
    stopJourneyPattern: JourneyPatternScheduledStopPointInJourneyPattern,
  ) => {
    try {
      const changes = prepareRemove({
        scheduledStopPointId: stopJourneyPattern.scheduled_stop_point_id,
        journeyPatternId: stopJourneyPattern.journey_pattern_id,
      });
      const variables = mapRemoveChangesToVariables(changes);

      await removeMutation(variables);

      dispatch(closeViaModalAction());
      showSuccessToast(t('viaModal.viaRemoveSuccess'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  const onClose = () => {
    dispatch(closeViaModalAction());
  };

  return (
    <div
      className={`fixed top-1/2 left-1/2 z-10 -translate-y-1/2 -translate-x-1/2 overflow-auto overflow-y-auto bg-white drop-shadow-md ${className}`}
    >
      <ModalHeader
        onClose={onClose}
        heading={t('viaModal.viaModalTitle', {
          label: stopInfo?.journey_pattern.journey_pattern_route?.label,
        })}
      />
      {stopInfo && (
        <ViaForm
          className="p-8"
          onCancel={onClose}
          onSubmit={(formState) => onSubmit(formState, stopInfo)}
          onRemove={() => onRemove(stopInfo)}
          defaultValues={mapStopJourneyPatternToFormState(stopInfo)}
        />
      )}
    </div>
  );
};
