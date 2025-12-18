import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { SimpleButton } from '../../../../../uiComponents';
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
      <SimpleButton
        shape="compact"
        inverted
        className={twJoin('px-2', className)}
        testId={testIds.button}
        tooltip={t('accessibility:terminals.editTerminalValidity', {
          terminalName: terminal?.name,
        })}
        disabled={!terminal}
        onClick={() => setShowEditModal(true)}
      >
        <i aria-hidden className="icon-calendar text-lg" />
      </SimpleButton>

      <EditTerminalValidityModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        terminal={terminal}
      />
    </>
  );
};
