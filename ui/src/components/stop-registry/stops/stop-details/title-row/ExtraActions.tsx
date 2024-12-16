import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { StopWithDetails } from '../../../../../hooks';
import {
  AlignDirection,
  SimpleDropdownMenu,
  SimpleDropdownMenuItem,
} from '../../../../../uiComponents';

const DISABLE_UNTIL_IMPLEMENTED = true;

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

  return (
    <SimpleDropdownMenu
      className={className}
      buttonClassName={twJoin(
        'flex h-11 w-11 items-center justify-center border border-grey',
        'disabled:pointer-events-none disabled:bg-background disabled:opacity-70',
      )}
      tooltip={t('accessibility:common.actionMenu')}
      alignItems={AlignDirection.Left}
      testId={testIds.actionMenu}
      disabled={!stop}
    >
      <SimpleDropdownMenuItem
        text={t('stopDetails.actions.extra.copy')}
        disabled={DISABLE_UNTIL_IMPLEMENTED}
        onClick={noop}
        testId={testIds.copy}
      />
    </SimpleDropdownMenu>
  );
};
