import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';
import { StopAreaMemberStopModal } from './StopAreaMemberStopModal';

const testIds = {
  addStopButton: 'MemberStops::addStopButton',
};

type StopAreaMemberStopsHeaderProps = {
  readonly areaId: string;
};

export const StopAreaMemberStopsHeader: FC<StopAreaMemberStopsHeaderProps> = ({
  areaId,
}) => {
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

      <StopAreaMemberStopModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleCloseModal}
        areaId={areaId}
      />
    </>
  );
};
