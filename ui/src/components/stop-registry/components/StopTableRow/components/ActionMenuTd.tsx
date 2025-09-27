import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlignDirection,
  SimpleDropdownMenu,
} from '../../../../../uiComponents';

const testIds = {
  actionMenu: 'StopTableRow::actionMenu',
};

type ActionMenuTdProps = {
  readonly className?: string;
  readonly inEditMode?: boolean;
  readonly menuItems: ReactNode;
};

export const ActionMenuTd: FC<ActionMenuTdProps> = ({
  className,
  inEditMode = false,
  menuItems,
}) => {
  const { t } = useTranslation();

  if (inEditMode) {
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    return <td className={className} />;
  }

  return (
    <td className={className}>
      <SimpleDropdownMenu
        tooltip={t('accessibility:common.actionMenu')}
        alignItems={AlignDirection.Left}
        testId={testIds.actionMenu}
      >
        {menuItems}
      </SimpleDropdownMenu>
    </td>
  );
};
