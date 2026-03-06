import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenu, SimpleDropdownMenuItem } from '../../uiComponents';

const testIds = {
  menu: 'MapFooterActionsDropdown::menu',
  createNewTerminal: 'MapFooterActionsDropdown::createNewTerminal',
  createNewStopArea: 'MapFooterActionsDropdown::createNewStopArea',
};

type MapFooterActionsDropdownProps = {
  readonly disabled?: boolean;
  readonly onCreateNewStopArea: () => void;
  readonly onCreateNewTerminal: () => void;
};

export const MapFooterActionsDropdown: FC<MapFooterActionsDropdownProps> = ({
  disabled,
  onCreateNewStopArea,
  onCreateNewTerminal,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleDropdownMenu
      anchorItems="top start"
      buttonShape="round"
      className="relative inline-flex h-auto"
      disabled={disabled}
      testId={testIds.menu}
      tooltip={t('map.footerActionsTooltip')}
    >
      <SimpleDropdownMenuItem
        onClick={onCreateNewTerminal}
        text={t('map.createNewTerminal')}
        testId={testIds.createNewTerminal}
      />
      <SimpleDropdownMenuItem
        onClick={onCreateNewStopArea}
        text={t('map.createNewStopArea')}
        testId={testIds.createNewStopArea}
      />
    </SimpleDropdownMenu>
  );
};
