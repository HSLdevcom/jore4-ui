import { Menu } from '@headlessui/react';
import noop from 'lodash/noop';
import { useTranslation } from 'react-i18next';
import { MdMoreVert } from 'react-icons/md';
import { SimpleDropdownMenuItem, SimpleRoundButton } from '../../uiComponents';
import {
  AlignDirection,
  SimpleDropdownMenuItems,
} from '../../uiComponents/SimpleDropdownMenuItems';

const testIds = {
  menu: 'MapFooterActionsDropdown::menu',
  createNewTerminal: 'MapFooterActionsDropdown::createNewTerminal',
  createNewStopArea: 'MapFooterActionsDropdown::createNewStopArea',
};

interface Props {
  tooltip: string;
  disabled?: boolean;
  onCreateNewStopArea: () => void;
}

export const MapFooterActionsDropdown = ({
  tooltip,
  disabled,
  onCreateNewStopArea,
}: Props): JSX.Element => {
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
              tooltip={tooltip}
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
              onClick={noop}
              text={t('map.createNewTerminal') + ' TODO'} // eslint-disable-line prefer-template
              testId={testIds.createNewTerminal}
            />
            <SimpleDropdownMenuItem
              onClick={onCreateNewStopArea}
              text={t('map.createNewStopArea')}
              testId={testIds.createNewStopArea}
              // TODO: Fix Stop Area creation/editing/deletion
              disabled
              title={t('dataModelRefactor.disabled')}
            />
          </SimpleDropdownMenuItems>
        </>
      )}
    </Menu>
  );
};
