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
import { DepotStopForm } from './DepotStopForm';

const testIds = { modal: 'AddDepotStopModal' };

export const AddDepotStopModal: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const location = useAppSelector(selectDepotStopDraftLocation);

  const onClose = () => dispatch(resetMapDepotStopEditorStateAction());

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
        heading={t(($) => $.map.addDepotStop)}
        navigationContext="DepotStopForm"
      >
        <DepotStopForm
          defaultValues={location}
          onCancel={onClose}
          onCreated={onClose}
          className="min-h-0"
        />
      </MapModal>
    </CustomOverlay>
  );
};
