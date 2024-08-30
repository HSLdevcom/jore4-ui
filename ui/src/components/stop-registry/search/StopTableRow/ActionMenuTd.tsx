import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AlignDirection, SimpleDropdownMenu } from '../../../../uiComponents';

type ActionMenuTdProps = {
  readonly className?: string;
  readonly menuItems: ReactNode;
};

export const ActionMenuTd: FC<ActionMenuTdProps> = ({
  className,
  menuItems,
}) => {
  const { t } = useTranslation();

  return (
    <td className={className}>
      <SimpleDropdownMenu
        tooltip={t('accessibility:common.actionMenu')}
        alignItems={AlignDirection.Left}
      >
        {menuItems}
      </SimpleDropdownMenu>
    </td>
  );
};
