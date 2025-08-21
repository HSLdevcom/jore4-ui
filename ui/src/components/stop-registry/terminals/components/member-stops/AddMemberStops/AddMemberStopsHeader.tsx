import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { SlimSimpleButton } from '../../../../stops/stop-details/layout';
import { AddMemberStopsModal } from './AddMemberStopsModal';

const testIds = {
  addStopToTerminalButton: 'TerminalDetailsPage::addStopToTerminalButton',
};

type AddMemberStopsHeaderProps = {
  readonly terminal: EnrichedParentStopPlace;
};

export const AddMemberStopsHeader: FC<AddMemberStopsHeaderProps> = ({
  terminal,
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
      <SlimSimpleButton
        inverted
        onClick={handleOpenModal}
        testId={testIds.addStopToTerminalButton}
      >
        {t('terminalDetails.stops.addStopToTerminal')}
      </SlimSimpleButton>

      <AddMemberStopsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleCloseModal}
        terminal={terminal}
      />
    </>
  );
};
