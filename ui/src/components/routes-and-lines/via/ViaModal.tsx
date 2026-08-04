import { gql } from '@apollo/client';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  JourneyPatternScheduledStopPointInJourneyPattern,
  useGetScheduledStopPointWithViaInfoQuery,
} from '../../../generated/graphql';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectViaModal } from '../../../redux';
import { closeViaModalAction } from '../../../redux/slices/modals';
import {
  illegalOptionalCast,
  showDangerToastWithError,
  showSuccessToast,
} from '../../../utils';
import { Modal, ModalBody, ModalHeader } from '../../common/Modals';
import { useWrapInContextNavigation } from '../../forms/common/NavigationBlocker';
import { useEditViaInfo } from './useEditViaInfo';
import { useRemoveViaInfo } from './useRemoveViaInfo';
import {
  FormState,
  ViaForm,
  mapStopJourneyPatternToFormState,
} from './ViaForm';

const GQL_GET_SCHEDULED_STOP_POINT_WITH_VIA_INFO = gql`
  query GetScheduledStopPointWithViaInfo(
    $journeyPatternId: uuid!
    $stopLabel: String!
  ) {
    journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        journey_pattern_id: { _eq: $journeyPatternId }
        scheduled_stop_point_label: { _eq: $stopLabel }
      }
    ) {
      ...scheduled_stop_point_in_journey_pattern_all_fields
      journey_pattern {
        journey_pattern_id
        journey_pattern_route {
          route_id
          label
        }
      }
    }
  }
`;

type ViaModalProps = {
  readonly className?: string;
};

export const ViaModal: FC<ViaModalProps> = ({ className }) => {
  const { t } = useTranslation();
  const wrapInContextNavigation = useWrapInContextNavigation('ViaForm');

  const viaModalState = useAppSelector(selectViaModal);
  const { journeyPatternId, stopLabel } = viaModalState;
  const dispatch = useAppDispatch();

  const { prepareAndExecute: prepareAndExecuteEdit } = useEditViaInfo();
  const { prepareAndExecute: prepareAndExecuteRemove } = useRemoveViaInfo();

  const scheduledStopResult = useGetScheduledStopPointWithViaInfoQuery({
    variables: {
      // if the via modal is open, we know that journeyPatternId and scheduledStopPointSequence are set
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      journeyPatternId: journeyPatternId!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stopLabel: stopLabel!,
    },
  });
  const stopInfo =
    illegalOptionalCast<JourneyPatternScheduledStopPointInJourneyPattern>(
      scheduledStopResult.data?.journey_pattern_scheduled_stop_point_in_journey_pattern.at(
        0,
      ),
    );

  const onSubmit = async (
    form: FormState,
    stopJourneyPattern: JourneyPatternScheduledStopPointInJourneyPattern,
  ) => {
    try {
      await prepareAndExecuteEdit({
        form,
        journeyPatternId: stopJourneyPattern.journey_pattern_id,
        stopLabel: stopJourneyPattern.scheduled_stop_point_label,
      });

      dispatch(closeViaModalAction());
      showSuccessToast(t(($) => $.viaModal.viaSaveSuccess));
    } catch (err) {
      showDangerToastWithError(
        t(($) => $.errors.saveFailed),
        err,
      );
    }
  };

  const onRemove = async (
    stopJourneyPattern: JourneyPatternScheduledStopPointInJourneyPattern,
  ) => {
    try {
      await prepareAndExecuteRemove({
        journeyPatternId: stopJourneyPattern.journey_pattern_id,
        stopLabel: stopJourneyPattern.scheduled_stop_point_label,
      });

      dispatch(closeViaModalAction());
      showSuccessToast(t(($) => $.viaModal.viaRemoveSuccess));
    } catch (err) {
      showDangerToastWithError(
        t(($) => $.errors.saveFailed),
        err,
      );
    }
  };

  const onCancel = () => dispatch(closeViaModalAction());
  const onClose = wrapInContextNavigation(onCancel);

  return (
    <Modal isOpen onClose={onClose} contentClassName={className}>
      <ModalHeader
        onClose={onClose}
        heading={t(($) => $.viaModal.viaModalTitle, {
          label: stopInfo?.journey_pattern.journey_pattern_route?.label,
        })}
      />
      {stopInfo && (
        <ModalBody>
          <ViaForm
            onCancel={onCancel}
            onSubmit={(formState) => onSubmit(formState, stopInfo)}
            onRemove={() => onRemove(stopInfo)}
            defaultValues={mapStopJourneyPatternToFormState(stopInfo)}
          />
        </ModalBody>
      )}
    </Modal>
  );
};
