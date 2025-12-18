import { Menu } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdMoreVert } from 'react-icons/md';
import {
  AlignDirection,
  SimpleDropdownMenuItem,
  SimpleDropdownMenuItems,
  getSimpleButtonClassNames,
} from '../../uiComponents';

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
    <Menu as="div" className="relative inline-flex h-auto">
      {({ open }) => (
        <>
          <Menu.Button
            data-testid={testIds.menu}
            className={getSimpleButtonClassNames(!open, disabled, 'round')}
            title={t('map.footerActionsTooltip')}
            aria-label={t('map.footerActionsTooltip')}
          >
            <MdMoreVert aria-hidden className="text-4xl" />
          </Menu.Button>
          <SimpleDropdownMenuItems
            isOpen={open}
            alignItems={AlignDirection.Top}
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
          </SimpleDropdownMenuItems>
        </>
      )}
    </Menu>
  );
};
