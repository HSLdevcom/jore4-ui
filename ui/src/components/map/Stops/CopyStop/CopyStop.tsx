import { Dispatch, FC, SetStateAction } from 'react';
import {
  isCopyMode,
  selectMapStopViewState,
  useAppSelector,
} from '../../../../redux';
import { StopInfoForEditingOnMap } from '../Types';
import { CopyStopConfirmationDialog } from './CopyStopConfirmationDialog';
import { CopyStopModal } from './CopyStopModal';
import { useMapCopyStopUtils } from './useMapCopyStopUtils';

type CopyStopProps = {
  readonly onCopyFinished: (netexId: string) => void;
  readonly onPopupClose: () => void;
  readonly isConfirmCopyDialogOpen: boolean;
  readonly setIsConfirmCopyDialogOpen: Dispatch<SetStateAction<boolean>>;
  readonly stopInfo: StopInfoForEditingOnMap | null;
};

export const CopyStop: FC<CopyStopProps> = ({
  onCopyFinished,
  onPopupClose,
  isConfirmCopyDialogOpen,
  setIsConfirmCopyDialogOpen,
  stopInfo,
}) => {
  const mapStopViewState = useAppSelector(selectMapStopViewState);

  const {
    defaultStopFormValues,
    onStartCopyStop,
    onCancelCopyStop,
    onCloseCopyModal,
    onCopyStopFormSubmit,
  } = useMapCopyStopUtils(
    stopInfo,
    onCopyFinished,
    onPopupClose,
    setIsConfirmCopyDialogOpen,
  );

  return (
    <>
      <CopyStopConfirmationDialog
        isOpen={isConfirmCopyDialogOpen}
        onConfirm={onStartCopyStop}
        onCancel={onCancelCopyStop}
      />

      {isCopyMode(mapStopViewState) && !!defaultStopFormValues && (
        <CopyStopModal
          defaultValues={defaultStopFormValues}
          onCancel={onCloseCopyModal}
          onClose={onCloseCopyModal}
          onSubmit={onCopyStopFormSubmit}
        />
      )}
    </>
  );
};
