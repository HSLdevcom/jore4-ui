import { useTranslation } from 'react-i18next';
import { FormState } from '../../components/routes-and-lines/ViaForm';
import {
  useGetScheduledStopPointInfoForViaModalQuery,
  usePatchScheduledStopPointViaInfoMutation,
  useRemoveScheduledStopPointViaInfoMutation,
} from '../../generated/graphql';
import { mapGetScheduledStopPointInfoForViaModal } from '../../graphql';
import { selectViaModal } from '../../redux';
import { closeViaModal } from '../../redux/slices/modals';
import { removeFromApolloCache, showSuccessToast } from '../../utils';
import { useAppDispatch, useAppSelector } from '../redux';

export const useViaModal = () => {
  const { t } = useTranslation();
  const [updateViaInfo] = usePatchScheduledStopPointViaInfoMutation();
  const [removeViaInfo] = useRemoveScheduledStopPointViaInfoMutation();
  const viaModalSelector = useAppSelector(selectViaModal);
  const { journeyPatternId, scheduledStopPointId } = viaModalSelector;
  const dispatch = useAppDispatch();

  const result = useGetScheduledStopPointInfoForViaModalQuery({
    variables: {
      journey_pattern_id: journeyPatternId,
      scheduled_stop_point_id: scheduledStopPointId,
    },
  });

  const stopInfo = mapGetScheduledStopPointInfoForViaModal(result);

  const onSubmit = async (formState: FormState) => {
    if (stopInfo) {
      await updateViaInfo({
        variables: {
          scheduled_stop_point_id: stopInfo.scheduled_stop_point_id,
          journey_pattern_id: stopInfo.journey_pattern_id,
          object: {
            is_via_point: true,
            via_point_name_i18n: {
              fi_FI: formState.viaInfo.name.fi_FI,
              sv_FI: formState.viaInfo.name.sv_FI,
            },
            via_point_short_name_i18n: {
              fi_FI: formState.viaInfo.shortName.fi_FI,
              sv_FI: formState.viaInfo.shortName.sv_FI,
            },
          },
        },
        update(cache) {
          removeFromApolloCache(cache, {
            scheduled_stop_point_id: scheduledStopPointId,
            __typename: 'service_pattern_scheduled_stop_point',
          });
        },
      });
      dispatch(closeViaModal());
      showSuccessToast(t('viaModal.viaSaveSuccess'));
    }
  };

  const onRemove = async () => {
    await removeViaInfo({
      variables: {
        scheduled_stop_point_id: scheduledStopPointId,
        journey_pattern_id: journeyPatternId,
      },
      update(cache) {
        removeFromApolloCache(cache, {
          scheduled_stop_point_id: scheduledStopPointId,
          __typename: 'service_pattern_scheduled_stop_point',
        });
      },
    });

    dispatch(closeViaModal());
    showSuccessToast(t('viaModal.viaRemoveSuccess'));
  };

  const onClose = () => {
    dispatch(closeViaModal());
  };

  const defaultValues = {
    isViaPoint: stopInfo?.is_via_point,
    viaInfo: {
      name: {
        fi_FI: stopInfo?.via_point_name_i18n?.fi_FI,
        sv_FI: stopInfo?.via_point_name_i18n?.sv_FI,
      },
      shortName: {
        fi_FI: stopInfo?.via_point_short_name_i18n?.fi_FI,
        sv_FI: stopInfo?.via_point_short_name_i18n?.sv_FI,
      },
    },
  };

  return { stopInfo, defaultValues, onSubmit, onRemove, onClose };
};
