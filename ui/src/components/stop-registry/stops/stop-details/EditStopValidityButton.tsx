import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { StopWithDetails } from '../../../../types';
import { SimpleButton } from '../../../../uiComponents';
import { EditStopModal } from './stop-version/EditStopModal';

const testIds = {
  button: 'StopDetailsPage::editStopValidityButton',
};

type EditStopValidityButtonProps = {
  readonly className?: string;
  readonly stop: StopWithDetails | null;
};

export const EditStopValidityButton: FC<EditStopValidityButtonProps> = ({
  className,
  stop,
}) => {
  const { t } = useTranslation();
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <SimpleButton
        shape="compact"
        inverted
        className={twJoin('px-2', className)}
        testId={testIds.button}
        tooltip={t('accessibility:stops.editStopValidity', {
          stopLabel: stop?.label,
        })}
        disabled={!stop}
        onClick={() => setShowEditModal(true)}
      >
        <i aria-hidden className="icon-calendar text-lg" />
      </SimpleButton>

      <EditStopModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        originalStop={stop}
      />
    </>
  );
};
