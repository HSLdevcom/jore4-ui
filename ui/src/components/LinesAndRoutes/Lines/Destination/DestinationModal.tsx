import { gql } from '@apollo/client';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetScheduledStopPointWithDestinationInfoQuery } from '../../../../generated/graphql';
import {
  closeDestinationModalAction,
  selectDestinationModal,
  useAppDispatch,
  useAppSelector,
} from '../../../../redux';
import {
  requireValue,
  showDangerToastWithError,
  showSuccessToast,
} from '../../../../utils';
import { useWrapInContextNavigation } from '../../../common/Forms/NavigationBlocker';
import {
  ConfirmationDialog,
  Modal,
  ModalBody,
  ModalHeader,
} from '../../../common/Modals';
import {
  DestinationForm,
  DestinationFormState,
  mapStopJourneyPatternToFormState,
} from './DestinationForm';
import { useEditDestinationInfo } from './useEditDestinationInfo';
import { useRemoveDestinationInfo } from './useRemoveDestinationInfo';

const GQL_GET_SCHEDULED_STOP_POINT_WITH_DESTINATION_INFO = gql`
  query GetScheduledStopPointWithDestinationInfo(
    $journeyPatternId: uuid!
    $stopLabel: String!
  ) {
    journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        journey_pattern_id: { _eq: $journeyPatternId }
        scheduled_stop_point_label: { _eq: $stopLabel }
      }
    ) {
      ...ScheduledStopPointInJourneyPatternAllFields
      journey_pattern {
        journey_pattern_id
        journey_pattern_route {
          route_id
          label
          destination_name_i18n
        }
      }
    }
  }
`;

type DestinationModalProps = {
  readonly className?: string;
};

export const DestinationModal: FC<DestinationModalProps> = ({ className }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const wrapInContextNavigation = useWrapInContextNavigation('DestinationForm');

  const destinationModalState = useAppSelector(selectDestinationModal);
  const journeyPatternId = requireValue(destinationModalState.journeyPatternId);
  const stopLabel = requireValue(destinationModalState.stopLabel);

  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data } = useGetScheduledStopPointWithDestinationInfoQuery({
    variables: { journeyPatternId, stopLabel },
  });
  const stopInfo =
    data?.journey_pattern_scheduled_stop_point_in_journey_pattern.at(0);

  const editDestinationInfo = useEditDestinationInfo();
  const removeDestinationInfo = useRemoveDestinationInfo();

  const onCancel = () => dispatch(closeDestinationModalAction());
  const onClose = wrapInContextNavigation(onCancel);

  const onSubmit = async (form: DestinationFormState) => {
    setIsSaving(true);
    try {
      await editDestinationInfo({ form, journeyPatternId, stopLabel });
      onCancel();
      showSuccessToast(t(($) => $.destinationModal.saveSuccess));
    } catch (err) {
      showDangerToastWithError(
        t(($) => $.errors.saveFailed),
        err,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const onRemove = async () => {
    setIsSaving(true);
    try {
      await removeDestinationInfo({ journeyPatternId, stopLabel });
      onCancel();
      showSuccessToast(t(($) => $.destinationModal.removeSuccess));
    } catch (err) {
      showDangerToastWithError(
        t(($) => $.errors.saveFailed),
        err,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Modal
        isOpen
        onClose={isSaving ? () => undefined : onClose}
        contentClassName={className}
      >
        <ModalHeader
          onClose={isSaving ? () => undefined : onClose}
          heading={t(($) => $.destinationModal.title, {
            label: stopInfo?.journey_pattern.journey_pattern_route?.label ?? '',
          })}
        />
        <ModalBody>
          <h3 className="mb-2 text-lg">
            {t(($) => $.destinationModal.destinationName)}
          </h3>
          <p className="mb-4">
            {t(($) => $.destinationModal.appliesFromStop, {
              stopLabel,
              nameFi: requireValue(destinationModalState.stopNameFi),
              nameSv: destinationModalState.stopNameSv ?? '',
            })}
          </p>
          {stopInfo && (
            <DestinationForm
              defaultValues={mapStopJourneyPatternToFormState(stopInfo)}
              isSaving={isSaving}
              onSubmit={onSubmit}
              onRemove={() => setIsConfirmingRemoval(true)}
              onCancel={onClose}
            />
          )}
        </ModalBody>
      </Modal>
      {isConfirmingRemoval && (
        <ConfirmationDialog
          isOpen
          className="z-50"
          onCancel={() => {
            if (!isSaving) {
              setIsConfirmingRemoval(false);
            }
          }}
          onConfirm={onRemove}
          title={t(($) => $.destinationModal.removeTitle)}
          description={t(($) => $.destinationModal.removeDescription, {
            originalDestination:
              stopInfo?.journey_pattern.journey_pattern_route
                ?.destination_name_i18n?.fi_FI ?? '',
            stopLabel,
          })}
          confirmText={t(($) => $.remove)}
          cancelText={t(($) => $.cancel)}
          isConfirming={isSaving}
        />
      )}
    </>
  );
};
