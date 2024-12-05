import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../hooks';
import {
  AlignDirection,
  SimpleDropdownMenu,
  SimpleDropdownMenuItem,
} from '../../../../uiComponents';
import { CreateStopVersionModal } from './stop-version/CreateStopVersionModal';

const testIds = {
  actionMenu: 'StopDetailsPage::extraActions::menu',
  copy: 'StopDetailsPage::extraActions::copy',
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
        tooltip={t('accessibility:common.actionMenu')}
        alignItems={AlignDirection.Left}
        testId={testIds.actionMenu}
        disabled={stop === null}
      >
        <SimpleDropdownMenuItem
          text={t('stopDetails.actions.extra.copy')}
          onClick={() => setShowCopyModal(true)}
          testId={testIds.copy}
        />
      </SimpleDropdownMenu>

      <CreateStopVersionModal
        isOpen={showCopyModal}
        onClose={() => setShowCopyModal(false)}
        originalStop={stop}
      />
    </>
  );
};
