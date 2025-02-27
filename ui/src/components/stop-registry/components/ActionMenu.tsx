import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AlignDirection, SimpleDropdownMenu } from '../../../uiComponents';

type ActionMenuProps = {
  readonly className?: string;
  readonly menuItems: ReactNode;
};

const testIds = {
    actionMenu: 'StopAreaHeader::actionMenu',
};

export const ActionMenu: FC<ActionMenuProps> = ({ className, menuItems }) => {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <SimpleDropdownMenu
        tooltip={t('accessibility:common.actionMenu')}
        alignItems={AlignDirection.Left}
        testId={testIds.actionMenu}
    >
        {menuItems}
    </SimpleDropdownMenu>
    </div>
  );
};