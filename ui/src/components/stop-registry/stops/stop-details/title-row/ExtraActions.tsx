import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { StopWithDetails } from '../../../../../types';
import {
  SimpleDropdownMenu,
  SimpleDropdownMenuItem,
} from '../../../../../uiComponents';
import { CopyStopModal } from '../stop-version';

const testIds = {
  actionMenu: 'StopTitleRow::extraActions::menu',
  copy: 'StopTitleRow::extraActions::copy',
};

type ExtraActionsProps = {
  readonly className?: string;
  readonly stop: StopWithDetails | null;
};

export const ExtraActions: FC<ExtraActionsProps> = ({ className, stop }) => {
  const { t } = useTranslation();

  const [showCopyModal, setShowCopyModal] = useState(false);

  return (
    <>
      <SimpleDropdownMenu
        className={className}
        buttonClassName={twJoin(
          'h-11 w-11 justify-center border border-grey',
          'disabled:pointer-events-none disabled:bg-background disabled:opacity-70',
        )}
        tooltip={t('accessibility:common.actionMenu')}
        testId={testIds.actionMenu}
        disabled={!stop}
      >
        <SimpleDropdownMenuItem
          text={t('stopDetails.actions.extra.copy')}
          onClick={() => setShowCopyModal(true)}
          testId={testIds.copy}
        />
      </SimpleDropdownMenu>

      <CopyStopModal
        isOpen={showCopyModal}
        onClose={() => setShowCopyModal(false)}
        originalStop={stop}
      />
    </>
  );
};
