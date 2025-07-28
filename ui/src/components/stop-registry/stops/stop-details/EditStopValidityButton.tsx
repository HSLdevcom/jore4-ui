import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopWithDetails } from '../../../../types';
import { getHoverStyles } from '../../../../uiComponents';
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
      <button
        className={twMerge(
          'h-8 w-14',
          'flex items-center justify-center',
          'rounded-sm border border-grey',
          'disabled:pointer-events-none disabled:bg-background disabled:opacity-70',
          getHoverStyles(false, !stop),
          className,
        )}
        data-testid={testIds.button}
        aria-label={t('accessibility:stops.editStopValidity', {
          stopLabel: stop?.label,
        })}
        title={t('accessibility:stops.editStopValidity', {
          stopLabel: stop?.label,
        })}
        disabled={!stop}
        type="button"
        onClick={() => setShowEditModal(true)}
      >
        <i className="icon-calendar aria-hidden text-lg" />
      </button>

      <EditStopModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        originalStop={stop}
      />
    </>
  );
};
