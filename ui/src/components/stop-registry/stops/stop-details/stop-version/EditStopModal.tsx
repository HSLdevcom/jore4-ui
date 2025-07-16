import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useObservationDateQueryParam } from '../../../../../hooks';
import { StopWithDetails } from '../../../../../types';
import { Modal, ModalHeader } from '../../../../../uiComponents';
import { LoadingWrapper } from '../../../../../uiComponents/LoadingWrapper';
import { useWrapInContextNavigation } from '../../../../forms/common/NavigationBlocker';
import { ModalBody } from '../../../../map/modal';
import { EditStopForm } from './EditStopForm';
import { EditStopVersionResult } from './types/EditStopVersionResult';
import { useResolveExistingStopValidityRanges } from './utils';
import { useFindLinesByStopId } from './utils/useFindLinesByStopId';

const testIds = {
  modal: 'EditStopModal::modal',
  loading: 'EditStopModal::loading',
};

type EditStopModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly originalStop: StopWithDetails | null;
};

export const EditStopModal: FC<EditStopModalProps> = ({
  isOpen,
  onClose,
  originalStop,
}) => {
  const { t } = useTranslation();
  const wrappedOnClose = useWrapInContextNavigation('EditStopForm')(onClose);

  const { setObservationDateToUrl, observationDate } =
    useObservationDateQueryParam();

  const { ranges, loading: loadingExistingValidityRanges } =
    useResolveExistingStopValidityRanges({
      stopPlaceId: originalStop?.stop_place_ref,
      skip: !isOpen,
    });

  const { lines, loading: loadingLinesForStop } = useFindLinesByStopId({
    stopPlaceId: originalStop?.stop_place_ref,
    validOn: observationDate,
    skip: !isOpen,
  });

  const onEditDone = (result: EditStopVersionResult) => {
    onClose();

    if (result.validityStart) {
      setObservationDateToUrl(result.validityStart);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={wrappedOnClose}
      testId={testIds.modal}
      contentClassName="w-[585px]"
    >
      <ModalHeader
        onClose={wrappedOnClose}
        heading={t('stopDetails.version.title.edit')}
      />
      <LoadingWrapper
        testId={testIds.loading}
        loading={
          !originalStop || loadingExistingValidityRanges || loadingLinesForStop
        }
      >
        {originalStop && (
          <ModalBody className="border-x-0">
            <EditStopForm
              className="mt-4 border-x-0"
              existingValidityRanges={ranges}
              affectedLines={lines}
              originalStop={originalStop}
              onCancel={onClose}
              onEditDone={onEditDone}
            />
          </ModalBody>
        )}
      </LoadingWrapper>
    </Modal>
  );
};
