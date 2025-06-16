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
              <MdMoreVert className="aria-hidden text-4xl" />
            </SimpleRoundButton>
          </Menu.Button>
          <SimpleDropdownMenuItems
            isOpen={open}
            alignItems={AlignDirection.Top}
          >
            <SimpleDropdownMenuItem
              onClick={onCreateNewTerminal}
              disabled // Until create marker component exists
              text={t('map.createNewTerminal') + ' TODO'} // eslint-disable-line prefer-template
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
