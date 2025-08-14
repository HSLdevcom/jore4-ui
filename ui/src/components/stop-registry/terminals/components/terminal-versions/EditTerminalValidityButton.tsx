import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { getHoverStyles } from '../../../../../uiComponents';
import { TerminalComponentProps } from '../../types';
import { EditTerminalValidityModal } from './EditTerminalValidityModal';

const testIds = {
  button: 'TerminalVersioningRow::editTerminalValidityButton',
};

export const EditTerminalValidityButton: FC<TerminalComponentProps> = ({
  className,
  terminal,
}) => {
  const { t } = useTranslation();
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <button
        className={twMerge(
          'h-6 w-10',
          'flex items-center justify-center',
          'rounded-sm border border-grey',
          'disabled:pointer-events-none disabled:bg-background disabled:opacity-70',
          getHoverStyles(false, !terminal),
          className,
        )}
        data-testid={testIds.button}
        aria-label={t('accessibility:terminals.editTerminalValidity', {
          terminalName: terminal?.name,
        })}
        title={t('accessibility:terminals.editTerminalValidity', {
          terminalName: terminal?.name,
        })}
        disabled={!terminal}
        type="button"
        onClick={() => setShowEditModal(true)}
      >
        <i className="icon-calendar aria-hidden text-lg" />
      </button>

      <EditTerminalValidityModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        terminal={terminal}
      />
    </>
  );
};
