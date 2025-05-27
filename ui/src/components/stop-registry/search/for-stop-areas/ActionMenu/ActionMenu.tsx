import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlignDirection,
  SimpleDropdownMenu,
} from '../../../../../uiComponents';

const testIds = {
  actionMenu: 'StopAreaHeader::actionMenu',
};

export const ActionMenu: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <SimpleDropdownMenu
      tooltip={t('accessibility:common.actionMenu')}
      alignItems={AlignDirection.Left}
      testId={testIds.actionMenu}
    >
      {children}
    </SimpleDropdownMenu>
  );
};
