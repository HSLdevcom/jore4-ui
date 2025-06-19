import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';
import { StopAreaEditableBlock } from '../StopAreaEditableBlock';
import { StopAreaMemberStopModal } from './StopAreaMemberStopModal';

const testIds = {
  addStopButton: 'MemberStops::addStopButton',
};

type StopAreaMemberStopsHeaderProps = {
  readonly areaId: string | null | undefined;
  readonly blockInEdit: StopAreaEditableBlock | null;
  readonly onEditStops: () => void;
};

export const StopAreaMemberStopsHeader: FC<StopAreaMemberStopsHeaderProps> = ({
  areaId,
  blockInEdit,
  onEditStops,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  if (blockInEdit === null) {
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
          onSave={onEditStops}
          areaId={areaId}
        />
      </>
    );
  }

  return null;
};
