import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  resetMapDepotStopEditorStateAction,
  selectDepotStopDraftLocation,
  useAppDispatch,
  useAppSelector,
} from '../../../../redux';
import { CustomOverlay } from '../../CustomOverlay';
import { MapModal } from '../../MapModal';
import { MapDepotStop } from '../../Types';
import { DepotStopForm } from './DepotStopForm';

const testIds = { modal: 'DepotStopModal' };

type DepotStopModalProps = {
  readonly editingDepotStop?: MapDepotStop;
};

export const DepotStopModal: FC<DepotStopModalProps> = ({
  editingDepotStop,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const draftLocation = useAppSelector(selectDepotStopDraftLocation);

  const onClose = () => dispatch(resetMapDepotStopEditorStateAction());

  const defaultValues = editingDepotStop
    ? {
        label: editingDepotStop.label,
        latitude: editingDepotStop.location.coordinates[1],
        longitude: editingDepotStop.location.coordinates[0],
      }
    : draftLocation;

  return (
    <CustomOverlay
      className="min-h-full w-[calc(450px+(2*1.25rem))]"
      position="top-left"
    >
      <MapModal
        className="pointer-events-auto flex max-h-full flex-col"
        headerClassName="items-center px-4 py-4 *:text-xl"
        bodyClassName="mx-0 my-0 flex flex-col"
        testId={testIds.modal}
        onClose={onClose}
        heading={
          editingDepotStop
            ? editingDepotStop.label
            : t(($) => $.map.addDepotStop)
        }
        navigationContext="DepotStopForm"
      >
        <DepotStopForm
          editing={!!editingDepotStop}
          depotStopId={editingDepotStop?.id}
          defaultValues={defaultValues}
          onCancel={onClose}
          onCreated={onClose}
          className="min-h-0"
        />
      </MapModal>
    </CustomOverlay>
  );
};
