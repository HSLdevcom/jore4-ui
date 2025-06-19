import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody, ModalHeader } from '../../../../../uiComponents';
import { Modal } from '../../../../../uiComponents/modal/Modal';
import { ControlledElement } from '../../../../forms/common/ControlledElement';
import { SelectMemberStopsDropdown } from '../../../../forms/stop-area';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';

const testIds = {
  addStopButton: 'MemberStops::addStopButton',
  selectMemberStops: 'MemberStops::selectMemberStops', // Add this testId
  modal: 'MemberStops::modal',
};

type StopAreaMemberStopsViewHeaderProps = {
  readonly onEditStops: () => void;
  readonly areaId: string; // You'll need to pass this prop
};

export const StopAreaMemberStopsViewHeader: FC<
  StopAreaMemberStopsViewHeaderProps
> = ({ onEditStops, areaId }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex-grow" />

      <SlimSimpleButton
        type="button"
        onClick={handleOpenModal}
        inverted
        testId={testIds.addStopButton}
      >
        {t('stopAreaDetails.memberStops.moveStopToArea')}
      </SlimSimpleButton>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        testId={testIds.modal}
        contentClassName="rounded-lg max-w-2xl w-full mx-4"
      >
        <ModalHeader
          onClose={handleCloseModal}
          heading={t('changeTimetablesValidityModal.title')}
        />
        <ModalBody>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <ControlledElement
                id="memberStops"
                testId={testIds.selectMemberStops}
                fieldPath="quays"
                // eslint-disable-next-line react/no-unstable-nested-components
                inputElementRenderer={({ value, onChange, testId }) => (
                  <SelectMemberStopsDropdown
                    editedStopAreaId={areaId}
                    // The form related component typings have been effed up.
                    // Everything is typed as a string.
                    // Cast to Any until the form-typings get fixed (huge rewrite)
                    value={value as ExplicitAny}
                    onChange={onChange}
                    testId={testId}
                  />
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <SlimSimpleButton type="button" onClick={handleCloseModal}>
                {t('cancel')}
              </SlimSimpleButton>
              <SlimSimpleButton
                type="button"
                onClick={() => {
                  onEditStops();
                  handleCloseModal();
                }}
              >
                {t('save')}
              </SlimSimpleButton>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
