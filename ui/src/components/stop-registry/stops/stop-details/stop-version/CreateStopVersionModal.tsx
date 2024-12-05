import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { StopWithDetails } from '../../../../../hooks';
import { Modal, ModalHeader } from '../../../../../uiComponents';
import { LoadingWrapper } from '../../../../../uiComponents/LoadingWrapper';
import { ModalBody } from '../../../../map/modal';
import { CreateStopVersionForm } from './CreateStopVersionForm';
import {
  CreateStopVersionStopModalState,
  createStopVersionStopStore,
  setValues,
} from './createStopVersionState';

const testIds = {
  loading: 'CreateStopVersionModal::loading',
};

export type CreateStopVersionModalProps = {
  originalStop: StopWithDetails | null;
};

export const CreateStopVersionModal = (
  props: CreateStopVersionModalProps,
): React.ReactElement => {
  const { t } = useTranslation();

  const { originalStop } = props;
  const createStopVersionDispatch = createStopVersionStopStore.dispatch;

  const closeModal = () => {
    createStopVersionDispatch(setValues({ modalOpen: false }));
  };

  const modalOpen = useSelector(
    (state: CreateStopVersionStopModalState) => state.reducer.modalOpen,
  );


  return (
    <Modal isOpen={modalOpen} onClose={closeModal} >
      <ModalHeader onClose={closeModal} heading={t('stops.version.edit')} />
      <LoadingWrapper testId={testIds.loading} loading={!originalStop}>
        {originalStop && (
          <ModalBody>
            <CreateStopVersionForm
              originalStop={originalStop}
              closeModal={closeModal}
            />
          </ModalBody>
        )}
      </LoadingWrapper>
    </Modal>
  );
};
