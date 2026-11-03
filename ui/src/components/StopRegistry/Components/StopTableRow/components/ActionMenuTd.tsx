import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenu } from '../../../../common/Dropdowns';

const testIds = {
  actionMenu: 'StopTableRow::actionMenu',
};

type ActionMenuTdProps = {
  readonly className?: string;
  readonly menuItems?: ReactNode;
  readonly actionMenu?: ReactNode;
};

export const ActionMenuTd: FC<ActionMenuTdProps> = ({
  className,
  menuItems,
  actionMenu,
}) => {
  const { t } = useTranslation();

  return (
    <td className={className}>
      {actionMenu ?? (
        <SimpleDropdownMenu
          tooltip={t(($) => $.accessibility.common.actionMenu)}
          testId={testIds.actionMenu}
        >
          {menuItems}
        </SimpleDropdownMenu>
      )}
    </td>
  );
};
