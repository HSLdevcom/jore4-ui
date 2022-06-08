import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormState } from '../../components/routes-and-lines/ViaForm';
import { useGetScheduledStopPointWithViaInfoQuery } from '../../generated/graphql';
import { mapGetScheduledStopPointWithViaInfo as mapGetScheduledStopPointWithViaInfoResult } from '../../graphql';
import { useEditViaInfo, useRemoveViaInfo } from '../../hooks';
import { Visible } from '../../layoutComponents';
import { closeViaModalAction, selectViaModal } from '../../redux';
import { showDangerToastWithError, showSuccessToast } from '../../utils';
import { ModalHeader } from '../common';
import { useAppDispatch, useAppSelector } from '../redux';
import { ViaForm } from './ViaForm';

interface Props {
  className?: string;
}

export const ViaModal = ({ className = '' }: Props): JSX.Element => {
  const { t } = useTranslation();
  const viaModalState = useAppSelector(selectViaModal);
  const { journeyPatternId, scheduledStopPointId } = viaModalState;
  const dispatch = useAppDispatch();

  const scheduledStopResult = useGetScheduledStopPointWithViaInfoQuery({
    variables: {
      journey_pattern_id: journeyPatternId,
      scheduled_stop_point_id: scheduledStopPointId,
    },
  });
  const stopInfo =
    mapGetScheduledStopPointWithViaInfoResult(scheduledStopResult);

  const { prepareEdit, mapEditChangesToVariables, editMutation } =
    useEditViaInfo();

  const { prepareRemove, mapRemoveChangesToVariables, removeMutation } =
    useRemoveViaInfo();

  const onSubmit = async (formState: FormState) => {
    if (stopInfo) {
      try {
        const changes = prepareEdit({
          formState,
          scheduledStopPointId: stopInfo.scheduled_stop_point_id,
          journeyPatternId: stopInfo.journey_pattern_id,
        });

        const variables = mapEditChangesToVariables(changes);

        editMutation(variables);

        dispatch(closeViaModalAction());
        showSuccessToast(t('viaModal.viaSaveSuccess'));
      } catch (err) {
        showDangerToastWithError(t('errors.saveFailed'), err);
      }
    }
  };

  const onRemove = async () => {
    if (stopInfo) {
      try {
        const changes = prepareRemove({
          scheduledStopPointId: stopInfo.scheduled_stop_point_id,
          journeyPatternId: stopInfo.journey_pattern_id,
        });
        const variables = mapRemoveChangesToVariables(changes);

        await removeMutation(variables);

        dispatch(closeViaModalAction());
        showSuccessToast(t('viaModal.viaRemoveSuccess'));
      } catch (err) {
        showDangerToastWithError(t('errors.saveFailed'), err);
      }
    }
  };

  const onClose = () => {
    dispatch(closeViaModalAction());
  };

  const defaultValues = {
    isViaPoint: stopInfo?.is_via_point,
    viaPointName: {
      fi_FI: stopInfo?.via_point_name_i18n?.fi_FI,
      sv_FI: stopInfo?.via_point_name_i18n?.sv_FI,
    },
    viaPointShortName: {
      fi_FI: stopInfo?.via_point_short_name_i18n?.fi_FI,
      sv_FI: stopInfo?.via_point_short_name_i18n?.sv_FI,
    },
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
      <Visible visible={!!stopInfo}>
        <ViaForm
          className="p-8"
          onCancel={onClose}
          onSubmit={onSubmit}
          onRemove={onRemove}
          defaultValues={defaultValues}
        />
      </Visible>
    </div>
  );
};
