import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../layoutComponents';
import { Modal, NewModalBody, NewModalHeader } from '../../../uiComponents';
import { useWrapInContextNavigation } from '../../forms/common/NavigationBlocker';
import { ConfirmTimetablesImportForm } from './ConfirmTimetablesImportForm';
import {
  useCombiningSameContractTimetables,
  useConfirmTimetablesImportUIAction,
  useGetStagingVehicleScheduleFrameIds,
  useStagingAndTargetFramesForCombine,
  useTimetablesImport,
  useToCombineTargetVehicleScheduleFrameId,
  useVehicleScheduleFrameWithJourneys,
} from './hooks';
import { FormState, getDefaultValues } from './TimetablesImportFormSchema';

type ConfirmTimetablesImportModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly className?: string;
};

export const ConfirmTimetablesImportModal: FC<
  ConfirmTimetablesImportModalProps
> = ({ isOpen, onClose, className = '' }) => {
  const { t } = useTranslation();
  const wrappedOnClose = useWrapInContextNavigation(
    'ConfirmTimetablesImportForm',
  )(onClose);

  const { onConfirmTimetablesImport, showConfirmFailedErrorDialog } =
    useConfirmTimetablesImportUIAction();
  const {
    vehicleScheduleFrames,
    importingSomeSpecialDays,
    inconsistentSpecialDayPrioritiesStaged,
  } = useTimetablesImport();
  const { fetchToCombineTargetFrameId } =
    useToCombineTargetVehicleScheduleFrameId();
  const { fetchVehicleFramesWithJourneys } =
    useVehicleScheduleFrameWithJourneys();
  const { fetchStagingVehicleFrameIds } =
    useGetStagingVehicleScheduleFrameIds();
  const {
    stagingAndTargetFramesForCombine,
    fetchStagingAndTargetFramesForCombine,
    clearStagingAndTargetFramesForCombine,
  } = useStagingAndTargetFramesForCombine(
    fetchToCombineTargetFrameId,
    fetchVehicleFramesWithJourneys,
    fetchStagingVehicleFrameIds,
  );
  const { combiningSameContractTimetables } =
    useCombiningSameContractTimetables(stagingAndTargetFramesForCombine);

  // Default might be set incorrectly if data has not been fetched for the form.
  const formReadyForRender = !!vehicleScheduleFrames?.length;

  const onSave = async (state: FormState) => {
    try {
      await onConfirmTimetablesImport(
        vehicleScheduleFrames.map((vsf) => vsf.vehicle_schedule_frame_id),
        state.priority,
        state.timetableImportStrategy,
      );

      onClose();
    } catch (error) {
      showConfirmFailedErrorDialog(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={wrappedOnClose}
      contentClassName={className}
    >
      <NewModalHeader
        onClose={wrappedOnClose}
        heading={t('confirmTimetablesImportModal.title')}
      />
      <NewModalBody>
        <Visible visible={formReadyForRender}>
          <ConfirmTimetablesImportForm
            onSubmit={onSave}
            onCancel={onClose}
            fetchStagingAndTargetFramesForCombine={
              fetchStagingAndTargetFramesForCombine
            }
            clearStagingAndTargetFramesForCombine={
              clearStagingAndTargetFramesForCombine
            }
            combiningSameContractTimetables={combiningSameContractTimetables}
            inconsistentSpecialDayPrioritiesStaged={
              inconsistentSpecialDayPrioritiesStaged
            }
            defaultValues={getDefaultValues({ importingSomeSpecialDays })}
          />
        </Visible>
      </NewModalBody>
    </Modal>
  );
};
