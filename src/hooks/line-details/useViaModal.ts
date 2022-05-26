import { useTranslation } from 'react-i18next';
import { FormState } from '../../components/routes-and-lines/ViaForm';
import { useGetScheduledStopPointWithViaInfoQuery } from '../../generated/graphql';
import { mapGetScheduledStopPointWithViaInfo } from '../../graphql';
import { closeViaModalAction, selectViaModal } from '../../redux';
import { showDangerToastWithError, showSuccessToast } from '../../utils';
import { useAppDispatch, useAppSelector } from '../redux';
import { useEditViaInfo } from './useEditViaInfo';
import { useRemoveViaInfo } from './useRemoveViaInfo';

export const useViaModal = () => {
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

  const stopInfo = mapGetScheduledStopPointWithViaInfo(scheduledStopResult);

  const { prepareEdit, mapEditChangesToVariables, editViaInfoMutation } =
    useEditViaInfo();

  const {
    prepareRemoveViaInfo,
    mapRemoveViaInfoToVariables,
    removeViaInfoMutation,
  } = useRemoveViaInfo();

  const onSubmit = async (formState: FormState) => {
    if (stopInfo) {
      try {
        const changes = prepareEdit({
          formState,
          scheduledStopPointId: stopInfo.scheduled_stop_point_id,
          journeyPatternId: stopInfo.journey_pattern_id,
        });

        const variables = mapEditChangesToVariables(changes);

        editViaInfoMutation(variables);

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
        const changes = prepareRemoveViaInfo({
          scheduledStopPointId: stopInfo.scheduled_stop_point_id,
          journeyPatternId: stopInfo.journey_pattern_id,
        });
        const variables = mapRemoveViaInfoToVariables(changes);

        await removeViaInfoMutation(variables);

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

  return { stopInfo, defaultValues, onSubmit, onRemove, onClose };
};
