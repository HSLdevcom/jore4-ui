import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../types';
import {
  SimpleDropdownMenu,
  SimpleDropdownMenuItem,
} from '../../../../../uiComponents';
import { isMirrorChild } from '../../../utils/mirrorRelation';
import { MakeHybridStopModal } from '../hybrid-stop';
import { CopyStopModal } from '../stop-version';

const testIds = {
  actionMenu: 'StopTitleRow::extraActions::menu',
  copy: 'StopTitleRow::extraActions::copy',
  makeHybrid: 'StopTitleRow::extraActions::makeHybrid',
};

type ExtraActionsProps = {
  readonly className?: string;
  readonly stop: StopWithDetails | null;
};

export const ExtraActions: FC<ExtraActionsProps> = ({ className, stop }) => {
  const { t } = useTranslation();

  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showHybridModal, setShowHybridModal] = useState(false);

  const isAlreadyHybridChild = stop?.quay ? isMirrorChild(stop.quay) : false;

  return (
    <>
      <SimpleDropdownMenu
        className={className}
        buttonClassName="h-11 w-11"
        buttonShape="round"
        tooltip={t(($) => $.accessibility.common.actionMenu)}
        testId={testIds.actionMenu}
        disabled={!stop}
      >
        <SimpleDropdownMenuItem
          text={t(($) => $.stopDetails.actions.extra.copy)}
          onClick={() => setShowCopyModal(true)}
          testId={testIds.copy}
        />
        <SimpleDropdownMenuItem
          text={t(($) => $.stopDetails.actions.extra.makeHybrid)}
          onClick={() => setShowHybridModal(true)}
          disabled={isAlreadyHybridChild}
          title={
            isAlreadyHybridChild
              ? t(($) => $.stopDetails.actions.extra.makeHybridDisabled)
              : undefined
          }
          testId={testIds.makeHybrid}
        />
      </SimpleDropdownMenu>
      <CopyStopModal
        isOpen={showCopyModal}
        onClose={() => setShowCopyModal(false)}
        originalStop={stop}
      />
      <MakeHybridStopModal
        isOpen={showHybridModal}
        onClose={() => setShowHybridModal(false)}
        parentStop={stop}
      />
    </>
  );
};
