import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenu } from '../../../../../../uiComponents';

const testIds = {
  actionMenu: 'SearchHeader::actionMenu',
};

export const ActionMenu: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <SimpleDropdownMenu
      tooltip={t('accessibility:common.actionMenu')}
      testId={testIds.actionMenu}
    >
      {children}
    </SimpleDropdownMenu>
  );
};
