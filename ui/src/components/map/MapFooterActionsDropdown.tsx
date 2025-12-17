import { Menu } from '@headlessui/react';
import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdMoreVert } from 'react-icons/md';
import {
  AlignDirection,
  SimpleDropdownMenuItem,
  SimpleDropdownMenuItems,
  SimpleRoundButton,
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
            as="div"
            className="flex justify-around"
          >
            <SimpleRoundButton
              tooltip={t('map.footerActionsTooltip')}
              disabled={disabled}
              onClick={noop}
              inverted={!open}
            >
              <MdMoreVert aria-hidden className="text-4xl" />
            </SimpleRoundButton>
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
